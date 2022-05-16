import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import OutLookMailDetailsHeadTop from "../outlook-email/outlook-mail-details-head-top";
import OutlookWriteMail from "../outlook-email/outlook-mail-write-email";
import slide1 from "../../assets/icons/welcome-page/slide-1.svg";
import {
  setDeleteOutLookMailId,
  setEmailsAffected,
  setSendEmailType,
} from "../../store/actions/outlook-mail-actions";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Button,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { Alert } from "@material-ui/lab";
import MoveEmailModal from "./move-email-modal";
import {
  createRequestGetAll,
  createRequestLimit,
} from "../../utilities/outlook";
import OutLookLoading from "../outlook-shared/OutLookLoading";
import WelcomeCarousel from "./welcome-carousel";
import { InteractionStatus } from "@azure/msal-browser";
import { defaultMenuList, loginRequest } from "../../outlook/config";
import { useMsal } from "@azure/msal-react";
import { useHistory } from "react-router-dom";
const ChannelContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0;
  background-color: #2c2c2c;
`;

const ChannelBody = styled.div`
  height: calc(100vh - 84px);
  margin: 0 10px 10px 0;
  border-radius: 8px;
  background: #ffffff;
  position: relative;
`;
export const ProjectText = styled.div`
  width: 100%;
  height: 100%;
  font-size: 40px;
  line-height: 1.2;
  color: #666666;
  text-align: center;
  margin-bottom: 30px;
`;

export const OutlookText = styled.span`
  font-weight: bold;
  color: #2c2c2c;
`;

export const Text = styled.h4`
  font-size: 16px;
  line-height: 1.7;
  color: #65656c;
  padding: 100px 50px 0 50px;
  margin: 0;
  font-weight: 100;
`;
export const SelectedText = styled.h3`
  font-weight: normal;
  color: #19191a;
  font-size: 24px;
`;

const CustomButton = withStyles({
  root: {
    color: "white",
    backgroundColor: "#999999",
  },
})(Button);

const MenuListCustom = withStyles({
  root: {
    boxShadow: "none",
    color: "#666666",
    borderBottom: "1px solid #DEDEDE",
    "& hr": {
      display: "none",
    },
  },
})(MenuList);

const MenuItemCustom = withStyles({
  root: {
    "&:hover": {
      color: "#03BD5D",
      backgroundColor: "rgba(255, 255, 255, 255)",
    },
  },
  selected: {},
})(MenuItem);

const useStyles = makeStyles({
  loginButton: {
    borderRadius: "3px",
    width: "250px",
    height: "40px",
    padding: "10px 0",
    fontSize: "15px",
    color: "#FFFFFF",
    backgroundColor: "#03BD5D",
    textTransform: "capitalize",
    textAlign: "center",
    border: "none",
    "&:focus": {
      outline: "none",
      border: "none",
    },
    "&:hover": {
      backgroundColor: "#03BD5D",
      opacity: "0.8",
    },
  },
});

function WelcomePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [menuList] = useState(defaultMenuList);
  const [loadingAction, setLoadingAction] = useState(false);
  const [action, setAction] = useState("");
  const { inProgress, instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const classes = useStyles();
  const clearSession = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.indexOf("msal.") !== -1) {
        sessionStorage.removeItem(key);
      }
    });
  };
  const postEmailType = useSelector(
    (state) => state.OutlookMailReducer.postEmailType
  );
  const emailsSelected = useSelector(
    (state) => state.OutlookMailReducer.emailsSelected
  );
  const conversationEmailsSelected = useSelector(
    (state) => state.OutlookMailReducer.conversationEmailsSelected
  );
  const sendEmailType = useSelector(
    (state) => state.OutlookMailReducer.sendEmailType
  );
  const [open, setOpen] = useState(false);
  const [openWaring, setOpenWaring] = useState(false);
  const [showEmailMoveModal, setShowEmailMoveModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const history = useHistory();
  const handleMoveMulti = async (body) => {
    try {
      // get all conversation
      const urlGetConversation = `/me/messages?top=100&$filter=conversationId eq '{id}'`;
      const dataResponseConservations = await createRequestGetAll(
        conversationEmailsSelected,
        urlGetConversation
      );
      let requestMoveIds = [];
      dataResponseConservations.map((item, index) => {
        const { value = [] } = item;
        const emailIds = value.map((email) => email.id);
        requestMoveIds = [...emailIds, ...requestMoveIds];
      });
      // delete all email by conversation
      const urlMove = `/me/messages/{id}/move`;
      const dataResponseMove = await createRequestLimit(
        requestMoveIds,
        urlMove,
        "POST",
        body
      );
      // check delete is error
      const errors = [];
      dataResponseMove.map((item, index) => {
        const { responses = [] } = item;
        responses.map((res) => {
          const { status } = res;
          if (status !== 201) {
            errors.push(index);
          }
        });
      });
      if (errors.length) {
        return setOpenWaring(true);
      }
      dispatch(setDeleteOutLookMailId(emailsSelected.join(",")));
    } catch (e) {}
  };

  const handleMoveEmail = async () => {
    setShowEmailMoveModal(false);
    setAction("move");
    setLoadingAction(true);
    const body = { destinationId: selectedFolder };
    await handleMoveMulti(body);
    setAction("");
    setLoadingAction(false);
    //
  };
  const handleMarkMulti = async (actionName = "flag") => {
    try {
      const body = {};
      if (actionName === "flag" || actionName === "unFlag") {
        const flagStatus = actionName === "flag" ? "flagged" : "notFlagged";
        body.flag = {
          flagStatus: flagStatus,
        };
      } else {
        body.isRead = actionName === "read";
      }
      const url = `/me/messages/{id}`;
      const dataResponseUpdate = await createRequestLimit(
        emailsSelected,
        url,
        "PATCH",
        body
      );
      console.log(dataResponseUpdate);
      dispatch(
        setEmailsAffected({
          type: actionName,
          data: emailsSelected,
        })
      );
    } catch (e) {
      console.log(e);
    }
  };
  const handleCancel = async () => {
    try {
      dispatch(
        setEmailsAffected({
          type: "cancel",
          data: [],
        })
      );
    } catch (e) {}
  };
  const handleAction = async (menuItem) => {
    const { name } = menuItem;
    if (name === "move") {
      return setShowEmailMoveModal(true);
    }
    setAction(name);
    setLoadingAction(true);
    switch (name) {
      case "delete":
        await handleMoveMulti({
          destinationId: "deleteditems",
        });
        break;
      case "unFlag":
      case "flag":
      case "read":
      case "unread":
        await handleMarkMulti(name);
        break;
      default:
        break;
    }
    setAction("");
    setLoadingAction(false);
  };

  const handleCloseWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenWaring(false);
  };
  const displayWelcome = emailsSelected.length > 1 ? `d-none` : `d-flex`;

  useEffect(() => {
    if (sendEmailType) {
      setOpen(
        sendEmailType === "SEND_EMAIL" || sendEmailType === "SEND_DRAFT_EMAIL"
      );
      dispatch(setSendEmailType(""));
    }
  }, [sendEmailType]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleCloseMove = () => {
    setShowEmailMoveModal(false);
  };
  const handleLogin = () => {
    localStorage.removeItem("EMAIL_COLOR");
    try {
      if (inProgress === InteractionStatus.None) {
        instance.loginRedirect(loginRequest);
      }
    } catch (e) {
      clearSession();
      //console.log(e);
    } finally {
      history.push("/email");
    }
  };

  return (
    <ChannelContainer>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        style={{ top: "10px" }}
        // key={"top" + "center"}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {t("outlook.mail:sendmail.success")}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openWaring}
        autoHideDuration={2000}
        onClose={handleCloseWarning}
        style={{ top: "10px" }}
        key={"top" + "right"}
      >
        <Alert
          onClose={handleCloseWarning}
          severity="warning"
          sx={{ width: "100%" }}
        >
          {t("outlook.mail.action.multiple:cannot.delete")}
        </Alert>
      </Snackbar>
      <div className="channel-head-top">
        <OutLookMailDetailsHeadTop />
      </div>
      <ChannelBody>
        {postEmailType === "newEmail" && emailsSelected.length === 0 ? (
          <OutlookWriteMail />
        ) : (
          <>
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
              <div
                className={` ${displayWelcome} justify-content-center align-items-center flex-column`}
              >
                <ProjectText>
                  {t("welcome:welcome.project")}{" "}
                  <OutlookText>Outlook</OutlookText>
                </ProjectText>
                <WelcomeCarousel />
                {!activeAccount ? (
                  inProgress !== "none" ? (
                    <div>
                      <OutLookLoading />
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={handleLogin}
                        className={classes.loginButton}
                      >
                        {t("outlook.button.login")}
                      </button>
                    </div>
                  )
                ) : null}
              </div>
              <div className="d-flex flex-column align-items-center">
                <div
                  className="wrapper-actions flex-column justify-content-center align-items-center"
                  style={{
                    display: `${emailsSelected.length > 1 ? "flex" : "none"}`,
                  }}
                >
                  <img
                    src={slide1}
                    alt="First slide"
                    style={{
                      width: "100%",
                      height: "124px",
                    }}
                  />
                  {emailsSelected.length > 1 && loadingAction ? (
                    <>
                      <div className="actions-processing d-flex justify-content-center">
                        <div className="label-item align-self-center mr-3">
                          <SelectedText className="selected-items">
                            {emailsSelected.length}{" "}
                            {t("outlook.mail.action.multiple:conversations")}{" "}
                            {t(
                              `outlook.mail.action.multiple:processing:${action}`
                            )}
                          </SelectedText>
                        </div>
                        <div className="pb-3">
                          <OutLookLoading />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <SelectedText className="selected-items mb-3">
                        {t(
                          "outlook.mail.action.multiple:selected.conversations",
                          { selected: emailsSelected.length }
                        )}
                      </SelectedText>
                      <div className="menu mb-3" style={{ zIndex: 1 }}>
                        <MenuListCustom>
                          {menuList.map((menuItem, index) => {
                            return (
                              <div key={index}>
                                <MenuItemCustom
                                  disabled={loadingAction}
                                  onClick={() => handleAction(menuItem)}
                                >
                                  <ListItemIcon>
                                    {menuItem.icon && (
                                      <img
                                        src={menuItem.icon}
                                        alt={menuItem.icon}
                                      />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText>
                                    {t(
                                      `outlook.mail.action.multiple:menu:${menuItem.name}`
                                    )}
                                  </ListItemText>
                                </MenuItemCustom>
                                {index < menuList.length - 1 && <Divider />}
                              </div>
                            );
                          })}
                        </MenuListCustom>

                        <div className="text-right mt-3">
                          <CustomButton
                            onClick={() => handleCancel()}
                            variant="contained"
                          >
                            {t("outlook.mail.action.multiple:cancel")}
                          </CustomButton>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </ChannelBody>
      <MoveEmailModal
        handleCancelMove={handleCloseMove}
        show={showEmailMoveModal}
        emailsSelected={emailsSelected}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        handleMoveEmail={handleMoveEmail}
      />
    </ChannelContainer>
  );
}

export default WelcomePage;
