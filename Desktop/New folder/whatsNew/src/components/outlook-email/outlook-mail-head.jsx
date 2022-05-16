import React, { useEffect, useState } from "react";
import { CircularProgress, makeStyles } from "@material-ui/core";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import {
  setConversationData,
  setRefreshData,
  toggleConversationRead,
} from "../../store/actions/outlook-mail-actions";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { loginRequest, postEmailType } from "../../outlook/config";
import { useMsal } from "@azure/msal-react";
import services from "../../outlook/apiService";
import arrowDown from "../../assets/icons/low-important.svg";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles({
  root: {
    height: 55,
    display: "flex",
    alignItems: "center",
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
    display: "flex",
  },
  buttonGroup: {
    display: "flex",
  },
  countButton: {
    background: "#FCF6F8",
    borderRadius: "2px",
    color: "#CA4C70",
    fontSize: "15px",
    lineHeight: "18px",
    height: "30px",
    width: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadButton: {
    width: "100px",
    height: "27px",
    background: "#03BD5D",
    borderRadius: "2px",
    lineHeight: "14px",
    color: "#fff",
    border: "none",
    fontSize: "12px",
    marginLeft: "10px",
    "&:focus": {
      outline: "none",
    },
  },
  importance: {
    color: "#999999",
    fontStyle: "italic",
    fontSize: "14px",
    marginLeft: "5px",
    "& img": {
      width: "14px!important",
      height: "14px!important",
    },
    "& span": {
      marginLeft: "5px",
    },
  },
});

const OutlookMailHead = (props) => {
  const classes = useStyles();
  const { subject, mailConversationCount } = props;
  const { instance, inProgress } = useMsal();
  const isConversationRead = useSelector(
    (state) => state.OutlookMailReducer.isConversationRead
  );
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer.activeEmail
  );

  useEffect(() => {
    dispatch(
      toggleConversationRead({
        id: activeEmail.id,
        isRead: activeEmail.isRead,
      })
    );
  }, [activeEmail, dispatch]);

  const handleMarkAsRead = async () => {
    if (InteractionStatus.None) {
      try {
        setLoading(true);
        const result = await services.updateEmailInfo(isConversationRead.id, {
          isRead: !isConversationRead.isRead,
        });
        dispatch(
          toggleConversationRead({
            id: result.id,
            isRead: result.isRead,
          })
        );
        setLoading(false);
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequest,
            account: instance.getActiveAccount(),
          });
        }
      }
    }
  };

  return (
    <>
      {subject !== false ? (
        <div className={classes.root}>
          <div className={classes.subject}>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={"subject"}>{subject ? subject : ""}</Tooltip>
              }
            >
              <span>{subject ? subject : ""}</span>
            </OverlayTrigger>
            {activeEmail?.importance === "high" ? (
              <div className={classes.importance}>
                {" "}
                <span>
                  {t("outlook.mail.send.important",{importance: activeEmail?.importance})}
                </span>
              </div>
            ) : activeEmail?.importance === "low" ? (
              <div className={classes.importance}>
                <span>
                  {t("outlook.mail.send.important",{importance: activeEmail?.importance})}
                </span>
              </div>
            ) : null}
          </div>
          <div className={classes.buttonGroup}>
            {/*<span className={classes.countButton}>{mailConversationCount}</span>*/}
            <button className={classes.unreadButton} onClick={handleMarkAsRead}>
              {loading ? (
                <CircularProgress
                  style={{ marginLeft: "6px" }}
                  size={11}
                  color="primary"
                />
              ) : isConversationRead.isRead ? (
                 t("outlook.mail.mark.unread.button")
              ) : (
                t("outlook.mail.mark.read.button")
              )}
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default OutlookMailHead;
