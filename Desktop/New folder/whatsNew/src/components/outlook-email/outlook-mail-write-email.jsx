import React, { useEffect, useRef, useState } from "react";
import { makeStyles, Popover, Snackbar, Typography } from "@material-ui/core";
import OutLookMailPost from "../outlook-mail-post/outlook-mail-post";
import { useDispatch, useSelector } from "react-redux";
import {
  setPostEmailType,
  setRefreshData,
  setSaveDraftEmail,
} from "../../store/actions/outlook-mail-actions";
import { Alert } from "@material-ui/lab";
import { postEmailType } from "../../outlook/config";
import { setActivePanelAction } from "../../store/actions/config-actions";
import Panel from "../actionpanel/panel";
import CheckIcon from "../../assets/icons/check_green.svg";
import { importantOption } from "../../outlook/config";
import OutLookMailEditDraftEditor from "../outlook-mail-post/outlook-edit-draft-editor";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
  headerWrapper: {
    height: 55,
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    borderBottom: "1px solid #18b263 !important",
  },
  subject: {
    width: `calc(100% - 16px)`,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontFamily: "Roboto",
    fontWeight: "400",
    fontSize: "18px",
    color: "#19191A",
  },
  mailPostWrapper: {
    // height: "calc(100vh - 166px)",
    height: "calc(100vh - 146px)",
    maxWidth: "100%",
    width: "100%",
    overflowX: "hidden",
    overflowY: "auto",
  },
  styledButton: {
    width: "66px",
    height: "27px",
    color: "#666666",
    fontSize: "12px",
    lineHeight: "14px",
    background: "#F2F2F2",
    borderRadius: "2px",
    border: "none",
    marginLeft: "10px",
    "&:focus": {
      outline: "none",
    },
    "&:hover": {
      background: "#03BD5D",
      color: "#fff",
    },
  },
  popOver: {
    padding: "15px",
    cursor: "pointer",
  },
  importantActive: {
    backgroundColor: "#F2F2F2",
  },
  importantText: {
    textTransform: "capitalize",
  },
});

function OutlookWriteMail() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [importantStatus, setImportantStatus] = useState(importantOption[1]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t } = useTranslation();
  const handleImportantCheck = (status) => {
    setImportantStatus(status);
  };
  const handleOpenPopOver = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const openPopOver = Boolean(anchorEl);
  const id = openPopOver ? "simple-popover" : undefined;
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };
  const {
    isSaveDraft,
    activeEmail,
    postEmailType: postEmailTypeReducer,
    activeDraftMailId,
  } = useSelector((state) => state.OutlookMailReducer);

  const handleCloseEditor = () => {
    if (activeEmail.isDraft || Object.keys(activeEmail).length === 0) {
      dispatch(setPostEmailType(postEmailType.init));
      dispatch(setActivePanelAction(Panel.WELCOME_EMAIL, null));
    } else {
      dispatch(setRefreshData(true));
    }
  };
  const handleSaveDraft = () => {
    dispatch(setSaveDraftEmail(true));
    buttonRef?.current.click();
  };

  useEffect(() => {
    if (isSaveDraft) {
      setOpen(true);
    }
  }, [isSaveDraft]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        style={{ top: "10px" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {t("outlook.mail:save.draft.success")}
        </Alert>
      </Snackbar>
      <div className={classes.headerWrapper}>
        {postEmailTypeReducer === postEmailType.newEmail ||
        activeDraftMailId === "" ? (
          <div className={classes.subject}>{t("outlook.mail:new.email")}</div>
        ) : (
          <div className={classes.subject}>{t("outlook.mail:edit.draft")}</div>
        )}
        <div className="d-flex align-items-center">
          <button className={classes.styledButton} onClick={handleCloseEditor}>
            {t("outlook.mail:cancel")}
          </button>
          <button
            className={classes.styledButton}
            onClick={handleSaveDraft}
            style={{ width: "80px" }}
          >
            {t("outlook.mail:save.draft")}
          </button>
          <button
            onClick={handleOpenPopOver}
            className={classes.styledButton}
            style={{
              backgroundColor: importantStatus !== "normal" && "#03BD5D",
              color: importantStatus !== "normal" && "#fff",
            }}
          >
            {t("outlook.mail.important")}
          </button>
          <Popover
            id={id}
            open={openPopOver}
            anchorEl={anchorEl}
            onClose={handleClosePopOver}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className={classes.popOver}>
              {importantOption.map((item, index) => {
                return (
                  <div
                    className="d-flex w-100"
                    style={{
                      backgroundColor: importantStatus === item && "#F8F8F8",
                    }}
                    key={index}
                  >
                    {importantStatus === item ? (
                      <img
                        src={CheckIcon}
                        alt={"check-icon"}
                        className="pr-2"
                      />
                    ) : (
                      <span
                        style={{
                          paddingRight: importantStatus !== item && "27.5px",
                        }}
                      >
                        {""}
                      </span>
                    )}
                    <Typography
                      className={classes.importantText}
                      onClick={() => handleImportantCheck(item)}
                      x={{ p: 5 }}
                    >
                      {t(`outlook.mail.important.${item}`)}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </Popover>
        </div>
      </div>
      <div className={classes.mailPostWrapper}>
        {postEmailTypeReducer === postEmailType.newEmail ? (
          <OutLookMailPost
            buttonRef={buttonRef}
            importantStatus={importantStatus}
            setImportantStatus={handleImportantCheck}
          />
        ) : (
          <OutLookMailEditDraftEditor
            buttonRef={buttonRef}
            importantStatus={importantStatus}
            setImportantStatus={handleImportantCheck}
          />
        )}
      </div>
    </>
  );
}

export default OutlookWriteMail;
