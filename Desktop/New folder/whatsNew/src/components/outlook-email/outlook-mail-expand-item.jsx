import React, { useEffect, useRef, useState } from "react";
import OutlookMailSenderInfo from "./outlook-mail-sender-info";
import OutlookMailRecipientsInfo from "./outlook-mail-recipients-info";
import OutlookMailContent from "./outlook-mail-content";
import OutlookMailFileAttachments from "./outlook-mail-file-attachments";
import OutlookMailToolbox from "./outlook-mail-toolbox";
import "./outlook-mail-item.css";
import services from "../../outlook/apiService";
import moment from "moment";
import {
  setAttachmentsList,
  setFileLoading,
  setMailHighLight,
} from "../../store/actions/outlook-mail-actions";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@material-ui/lab";

const OutlookMailExpandItem = (props) => {
  const { mailItem, toggleCollapseItem } = props;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [backgroundState, setBackgroundState] = useState("#fff");
  const [attachments, setAttachments] = useState([]);
  const [mailBody, setMailBody] = useState("");
  const [mailItemBody, setMailItemBody] = useState("");
  const [fileNoInlineState, setFileNoInlineState] = useState([]);
  const mailRef = useRef(null);
  const mailList = useSelector(
    (state) => state.OutlookMailReducer.newReplyEmailList
  );
  const handleGetFileAttachments = async (attachments) => {
    let mailContent = mailItem.body && mailItem.body.content;
    let mailItemContent = mailItem.body && mailItem.body.content;
    if (attachments.length > 0) {
      for (let file of attachments) {
        if (file.isInline) {
          await services
            .downloadAttachments(file.mailId, file.id)
            .then((file) => {
              if (file.contentType.includes("image")) {
                const imageSrc = `src="data:image/png;base64 , ${file.contentBytes}"`;
                let imageContentId = `src="cid:${file.contentId}"`;
                mailContent = mailContent.replace(imageContentId, imageSrc);
                mailItemContent = mailItemContent.replace(
                  imageContentId,
                  imageSrc
                );
              }
            });
        }
      }
    }
    setMailBody(mailContent);
    setMailItemBody(mailItemContent);
  };
  const mailHighLightId = useSelector(
    (state) => state.OutlookMailReducer.currentHighLightMailId
  );
  const setBackgroundColor = () => {
    setBackgroundState("#fbffe5");
    setTimeout(() => {
      setBackgroundState("#fff");
    }, [1500]);
  };
  useEffect(() => {
    if (mailItem.id === mailHighLightId && mailHighLightId !== "" && mailItem) {
      setTimeout(() => {
        setBackgroundColor();
        dispatch(setMailHighLight(""));
      }, 1000);
      mailRef?.current?.scrollIntoView();
    }
  }, [mailHighLightId]);
  const getAttachments = async () => {
    dispatch(setFileLoading(true));
    setLoading(true);
    const result = await services.getFileAttachments(mailItem.id);
    const newResult = [...result.value].map((item) => {
      return { ...item, mailId: mailItem.id };
    });
    setAttachments(newResult);
    const noInlineFile = [...newResult].filter((item) => !item.isInline);
    setFileNoInlineState(noInlineFile);
    await handleGetFileAttachments(newResult);
    setLoading(false);
    dispatch(
      setAttachmentsList({
        sender: mailItem.sender?.emailAddress?.name,
        lastModifiedDateTime: moment(mailItem.lastModifiedDateTime).format(
          "ddd, MMM DD"
        ),
        attachments: [...noInlineFile],
      })
    );
    dispatch(setFileLoading(false));
  };
  useEffect(() => {
    try {
      getAttachments();
    } catch (e) {}
  }, [mailItem]);
  useEffect(() => {
    if (mailList.length > 0 && mailList.id === mailItem.id) {
      getAttachments();
    }
  }, [mailItem, mailList]);
  return (
    <>
      <div
        className="mail-item-wrapper"
        ref={mailRef}
        style={{
          backgroundColor: backgroundState,
          position: "relative",
        }}
      >
        <div
          style={{
            height: 78,
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
          onClick={toggleCollapseItem}
        />
        <OutlookMailToolbox
          body={mailItemBody}
          mailId={mailItem.id}
          senderInfo={mailItem.sender}
          isDraft={mailItem.isDraft}
          attachments={fileNoInlineState}
        />
        {mailItem.sender && (
          <OutlookMailSenderInfo
            parentFolderId={mailItem.parentFolderId}
            isDraft={mailItem.isDraft}
            senderInfo={mailItem.sender}
            sentDateTime={mailItem.sentDateTime}
          />
        )}
        <OutlookMailRecipientsInfo
          ccRecipients={mailItem.ccRecipients}
          toRecipients={mailItem.toRecipients}
          bccRecipients={mailItem.bccRecipients}
        />
        {attachments.length > 0 && (
          <OutlookMailFileAttachments fileAttachments={fileNoInlineState} />
        )}
        {loading ? (
          <Skeleton variant="rect" height={118} animation="wave" />
        ) : (
          <OutlookMailContent
            mailBodyContent={mailBody}
            contentType={mailItem.uniqueBody.contentType}
          />
        )}
      </div>
    </>
  );
};

export default OutlookMailExpandItem;
