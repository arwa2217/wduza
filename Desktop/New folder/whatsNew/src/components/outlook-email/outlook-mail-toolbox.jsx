import React, { useState } from "react";
import iconChecked from "../../assets/icons/outlook-toolbox/checked.svg";
import iconUpOne from "../../assets/icons/outlook-toolbox/upOne.svg";
import iconDownOne from "../../assets/icons/outlook-toolbox/downOne.svg";
import iconReply from "../../assets/icons/outlook-toolbox/reply.svg";
import iconReplyAll from "../../assets/icons/outlook-toolbox/reply-all.svg";
import iconForwardEmail from "../../assets/icons/outlook-toolbox/forward-email.svg";
import iconForwardDiscussion from "../../assets/icons/outlook-toolbox/forward-discussion.svg";
import iconDelete from "../../assets/icons/outlook-toolbox/delete.svg";

import services from "../../outlook/apiService";
import "./outlook-mail-toolbox.css";
import { makeStyles, Snackbar, Tooltip } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import {
  setCurrentReplyEmailId,
  setDataForward,
  setEnableWriteEmail,
  setPostEmailType,
  setRefreshData,
} from "../../store/actions/outlook-mail-actions";
import { useDispatch } from "react-redux";
import PostForwardModal from "../outlook-post-forward/post-forward-modal";
import { setEditorFocus } from "../../utilities/outlook";
import { postEmailType } from "../../outlook/config";
import {useTranslation} from "react-i18next";
const useStyles = makeStyles({
  arrow: {
    color: "#000",
  },
  tooltip: {
    backgroundColor: "#000",
  },
});
function OutlookMailToolbox(props) {
  const { mailId, senderInfo, isDraft, body, attachments } = props;
  const [showForward, setShowForward] = useState(false);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const handleFastReplyEmail = async (emailContent) => {
    const emailData = {
      message: {
        toRecipients: [
          {
            emailAddress: {
              address: senderInfo.emailAddress.address,
            },
          },
        ],
      },
      comment: emailContent,
    };
    try {
      setOpen(true);
      await services.replyEmail(mailId, emailData);
      dispatch(setRefreshData(true));
    } catch (e) {
      console.log(e);
    }
  };

  const handlePostEmail = (event, emailType) => {
    event.stopPropagation();
    // dispatch(setActiveEmail(mail));
    dispatch(setPostEmailType(emailType));
    dispatch(setEnableWriteEmail(true));
    dispatch(setCurrentReplyEmailId(mailId));
    setEditorFocus(emailType);
    if (emailType === postEmailType.forward) {
      dispatch(setDataForward({content: body}));
    }
  };

  //IN DOING...
  const handleDeleteMail = async (e) => {
    e.stopPropagation();
    try {
      await services.deleteEmail(mailId);
      dispatch(setRefreshData(true));
    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = (event, reason) => {
    event.stopPropagation();
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleForward = (e) => {
    e.stopPropagation();
    setShowForward(true);
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
          {t("outlook.mail:sendmail.success")}
        </Alert>
      </Snackbar>
      <div className="outlook-mail-toolbox">
        <Tooltip
          title={t("outlook.mail.tooltip:checked")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 m-0 ${isDraft ? "disabled" : ""} `}
            onClick={() => handleFastReplyEmail("Checked")}
          >
            <img alt="checked" src={iconChecked} />
          </button>
        </Tooltip>
        <Tooltip
          title="+1"
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 ${isDraft ? "disabled" : ""}`}
            onClick={() => handleFastReplyEmail("+1")}
            // value={PostReactionType.CHECK}
          >
            <img alt="up-one" src={iconUpOne} />
          </button>
        </Tooltip>
        <Tooltip
          title="-1"
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 ${isDraft ? "disabled" : ""}`}
            onClick={() => handleFastReplyEmail("-1")}
          >
            <img alt="down-one" src={iconDownOne} />
          </button>
        </Tooltip>
        {/*<OverlayTrigger*/}
        {/*  className="hidden-xs"*/}
        {/*  delayShow={500}*/}
        {/*  placement="top"*/}
        {/*  overlay={<Tooltip id={"edit"}>{"Edit Draft"}</Tooltip>}*/}
        {/*>*/}
        {/*  <button*/}
        {/*    className={`toolbox-btn btn p-0 ${isDraft ? "" : "disabled"}`}*/}
        {/*    onClick={() => console.log("Edit")}*/}
        {/*  >*/}
        {/*    <img alt="edit-mail-draft" src={iconPostEdit} />*/}
        {/*  </button>*/}
        {/*</OverlayTrigger>*/}
        <Tooltip
          title={t("outlook.mail.tooltip:reply")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 ${isDraft ? "disabled" : ""}`}
            onClick={(e) => handlePostEmail(e, postEmailType.reply)}
          >
            <img alt="reply" src={iconReply} />
          </button>
        </Tooltip>
        <Tooltip
          title={t("outlook.mail.tooltip:reply.all")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 ${isDraft ? "disabled" : ""}`}
            onClick={(e) => handlePostEmail(e, postEmailType.replyAll)}
          >
            <img alt="reply-all" src={iconReplyAll} />
          </button>
        </Tooltip>

        <Tooltip
          title={t("outlook.mail.tooltip:forward")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0 ${isDraft ? "disabled" : ""}`}
            onClick={(e) => handlePostEmail(e, postEmailType.forward)}
          >
            <img alt="forward-email" src={iconForwardEmail} />
          </button>
        </Tooltip>

        <Tooltip
          title={t("outlook.mail.tooltip:forward.discussion")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button className={`toolbox-btn btn p-0`} onClick={handleForward}>
            <img alt="forward" src={iconForwardDiscussion} />
          </button>
        </Tooltip>
        <PostForwardModal
          show={showForward}
          setShowForward={setShowForward}
          body={body}
          attachments={attachments}
        />
        <Tooltip
          title={t("outlook.mail.tooltip:delete")}
          arrow
          classes={{ arrow: classes.arrow, tooltip: classes.tooltip }}
          placement="top"
        >
          <button
            className={`toolbox-btn btn p-0`}
            onClick={(e) => handleDeleteMail(e)}
          >
            <img alt="delete" src={iconDelete} />
          </button>
        </Tooltip>
      </div>
    </>
  );
}

export default React.memo(OutlookMailToolbox);
