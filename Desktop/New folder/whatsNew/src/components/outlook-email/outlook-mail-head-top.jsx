import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, postEmailType } from "../../outlook/config";
import { deleteEmail } from "../../outlook/graphAPI";
import {
  setCurrentReplyEmailId,
  setDataForward,
  setDeleteOutLookMailId,
  setEnableWriteEmail,
  setIsBottomAnchorScroll,
  setPostEmailType,
} from "../../store/actions/outlook-mail-actions";
import { clearDataCached, setEditorFocus } from "../../utilities/outlook";
import ContextPanel from "../../assets/icons/v2/ic_fold.svg";
import ContextPanelActive from "../../assets/icons/v2/ic_fold.svg";
import { setMailSummary } from "../../store/actions/mail-summary-action";
import services from "../../outlook/apiService";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles, Tooltip } from "@material-ui/core";

const useStyles = makeStyles({
  appLoader: {
    height: 4,
    zIndex: 1201,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "white",
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#03BD5D",
    },
  },
  arrow: {
    color: "#000",
  },
  tooltip: {
    backgroundColor: "#000",
    width: "80px",
    height: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
const OutLookMailHeadTop = () => {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const isSummary = useSelector((state) => state.MailSummaryReducer.isSummary);
  const { t } = useTranslation();
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer.activeEmail
  );
  const activePanel = useSelector((state) => state.config.activeActionPanel);
  const isOpenWriteEmailModalPopup = useSelector(
    (state) => state.OutlookMailReducer.isOpenWriteEmailModalPopup
  );
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer.postEmailType
  );
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const handleLogout = () => {
    clearDataCached();
    const currentAuth = instance.getActiveAccount();
    const logoutRequest = {
      account: instance.getAccountByHomeId(currentAuth.homeAccountId),
      mainWindowRedirectUri: window.location.href,
      postLogoutRedirectUri: window.location.href,
    };
    instance.logout(logoutRequest);
  };
  const handleGetFileAttachments = async (mailId, attachments, mailContent) => {
    for (let file of attachments) {
      await services.downloadAttachments(mailId, file.id).then((file) => {
        if (file.contentType.includes("image")) {
          const imageSrc = `src="data:image/png;base64 , ${file.contentBytes}"`;
          let imageContentId = `src="cid:${file.contentId}"`;
          mailContent = mailContent.replace(imageContentId, imageSrc);
        }
      });
    }

    return mailContent;
  };
  const handlePostEmail = async (emailType) => {
    dispatch(setCurrentReplyEmailId(""));
    if (emailType === postEmailType.forward) {
      //setLoading(true);
      const {
        id,
        body: { content },
      } = activeEmail;
      let newContent = content;
      const results = await services.getFileAttachments(id);
      const attachments = results.value || [];
      const attachmentsInline = attachments.filter((item) => item.isInline);
      if (attachmentsInline.length) {
        for (let i = 0; i < attachmentsInline.length; i++) {
          const file = attachmentsInline[i];
          let imageContentId = `src="cid:${file.contentId}"`;
          newContent = newContent.replace(
            imageContentId,
            " style='display:none'"
          );
        }
        /*newContent = await handleGetFileAttachments(
          id,
          attachmentsInline,
          content
        );*/
      }
      const forwardData = { content: newContent };
      dispatch(setDataForward(forwardData));
    }
    //hide write email modal button when user click to Reply, Reply All, Forward
    dispatch(setIsBottomAnchorScroll(true));
    dispatch(setEnableWriteEmail(true));
    setEditorFocus(emailType);
    dispatch(setPostEmailType(emailType));
    setLoading(false);
  };

  const handleDeleteMail = async () => {
    try {
      if (!activeEmail || Object.keys(activeEmail).length === 0) {
        return;
      }
      const { id, conversationId } = activeEmail;
      dispatch(setDeleteOutLookMailId(id));
      await deleteEmail(conversationId);
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        instance.acquireTokenRedirect({
          ...loginRequest,
          account: instance.getActiveAccount(),
        });
      }
    }
  };
  return (
    <div
      className={`topBar m-0 p-0 d-flex r ${
        activePanel === "WELCOME_EMAIL" ||
        postEmailTypeReducer === postEmailType.editDraftEmail ||
        postEmailTypeReducer === postEmailType.newEmail
          ? "justify-content-end"
          : "justify-content-space-around"
      }`}
      style={{ height: "70px" }}
    >
      {loading && (
        <LinearProgress color="primary" className={classes.appLoader} />
      )}
      <div
        className={`d-flex align-items-center ${
          activePanel === "WELCOME_EMAIL" ||
          postEmailTypeReducer === postEmailType.editDraftEmail ||
          postEmailTypeReducer === postEmailType.newEmail
            ? "justify-content-end"
            : "justify-content-between"
        }  pr-0 w-100`}
      >
        <div
          className={`${
            activePanel === "WELCOME_EMAIL" ||
            postEmailTypeReducer === postEmailType.editDraftEmail ||
            postEmailTypeReducer === postEmailType.newEmail
              ? "d-none"
              : "d-flex"
          } align-items-center left-spacing`}
        >
          <div className="d-flex align-items-center mr-0">
            <Tooltip
              title={t("outlook.mail.tooltip:reply")}
              arrow
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              <div
                className={`topBar__icon topBar__icon__reply ${
                  isOpenWriteEmailModalPopup ? "disabled" : ""
                }`}
                onClick={() => handlePostEmail(postEmailType.reply)}
              >
                {t("outlook.mail.head.top:reply")}
              </div>
            </Tooltip>
          </div>
          <div className="d-flex align-items-center mr-0">
            <Tooltip
              title={t("outlook.mail.tooltip:reply.all")}
              arrow
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              <div
                className={`topBar__icon topBar__icon__replyAll ${
                  isOpenWriteEmailModalPopup ? "disabled" : ""
                }`}
                style={{ width: "max-content" }}
                onClick={() => handlePostEmail(postEmailType.replyAll)}
              >
                {t("outlook.mail.head.top:reply.all")}
              </div>
            </Tooltip>
          </div>
          <div className="d-flex align-items-center mr-0">
            <Tooltip
              title={t("outlook.mail.tooltip:forward")}
              arrow
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              <div
                className={`topBar__icon topBar__icon__forward ${
                  isOpenWriteEmailModalPopup ? "disabled" : ""
                }`}
                onClick={() => handlePostEmail(postEmailType.forward)}
              >
                {t("outlook.mail.head.top:forward")}
              </div>
            </Tooltip>
          </div>
          <div className="d-flex align-items-center mr-0">
            <Tooltip
              title={t("outlook.mail.tooltip:delete")}
              arrow
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              <div
                className={"topBar__icon topBar__icon__deleteEmail"}
                onClick={handleDeleteMail}
              >
                {t("outlook.mail.head.top:delete")}
              </div>
            </Tooltip>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center mr-0">
            <Tooltip
              title={t("outlook.mail.head.top:leave")}
              arrow
              classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
            >
              {/*>*/}
              <div
                className={"topBar__icon topBar__icon__logOut"}
                onClick={handleLogout}
              >
                {t("outlook.mail.head.top:leave")}
              </div>
            </Tooltip>
          </div>
          {!isSummary && (
            <div className="d-flex align-items-center mr-0">
              <Tooltip
                title={t("header.tooltip:summary")}
                arrow
                classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
              >
                <div
                  className="topBar__icon"
                  id="opened"
                  onClick={() => dispatch(setMailSummary(!isSummary))}
                >
                  {isSummary ? (
                    <img
                      id="icon"
                      src={ContextPanelActive}
                      alt="channel details"
                    />
                  ) : (
                    <img id="icon" src={ContextPanel} alt="channel details" />
                  )}
                </div>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutLookMailHeadTop;
