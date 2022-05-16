import React, { useEffect, useMemo, useState } from "react";
import "./message-list-item.css";
import Badge from "../../assets/icons/notification-badge.svg";
import flagIconOff from "../../assets/icons/star-gray.svg";
import flagIconOn from "../../assets/icons/star-check.svg";
import fileAttach from "../../assets/icons/attachment-icon.svg";
import deleteIcon from "../../assets/icons/delete-icon.svg";
import styled from "styled-components";
import moment from "moment";
import { loginRequest } from "../../outlook/config";
import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { deleteEmail, updateFlagEmail } from "../../outlook/graphAPI";
import { useDispatch } from "react-redux";
import { setDeleteOutLookMailId } from "../../store/actions/outlook-mail-actions";
import { Checkbox } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  getColor,
  getColorByEmail,
  getEmailToShow,
} from "../../utilities/outlook";
import CheckboxCustom from "../../assets/icons/check-box.svg";
import arrowDown from "../../assets/icons/low-important.svg";
import { getNewEmailsByType } from "../../utilities/outlook-message-list";
import services from "../../outlook/apiService";
import {useTranslation} from "react-i18next";

const MentionImg = styled.img`
  width: 8px;
  height: 8px;
  float: left;
  margin: 0 7px 0 0;
  visibility: visible;
  position: absolute;
  top: 7px;
  left: 18px;
`;
const AttachImg = styled.img`
  //width: 16px;
  //height: 16px;
  margin: 0 5px 0 0;
  visibility: visible;
  vertical-align: text-top;
`;
const DeleteImg = styled.img`
  //width: 15px;
  //height: 16px;
  visibility: visible;
  vertical-align: bottom;
  margin-bottom: 1px;
`;

const FlagImg = styled.img`
  //width: 16px;
  //height: 16px;
  visibility: visible;
  vertical-align: text-top;
`;

const HiddenMentionImg = styled.img`
  width: 8px;
  height: 8px;
  float: left;
  margin: 0 7px 0 0;
  visibility: hidden;
`;

const MessageName = styled.p`
  width: calc(50%);
  font-size: 15px;
  font-weight: 400;
  color: #19191a;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const DraftTitle = styled.p`
  width: calc(50%);
  font-size: 15px;
  font-weight: 400;
  color: #19191a;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const DraftChecked = styled.span`
  color: #d83b02;
  margin-right: 5px;
`;

const MessageSubject = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  flex: 1 1 auto;
  line-height: 20px;
  margin-right: 17px;
  margin-bottom: 0;
`;
const AllReadMessage = styled.p`
  font-size: 12px;
  font-weight: 400;
  color: #999999;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 14px;
  width: 200px;
  margin-right: 60px;
  > p {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
const AllReadMessageCount = styled.div`
  font-size: 12px;
  color: #ca4c70;
  background-color: #fcf6f8;
  padding: 4px;
  border-radius: 2px;
  align-self: self-start;
  height: 14px;
  width: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const checkBoxStyles = () => ({
  root: {
    "&$checked": {
      color: "#03BD5D",
    },
    borderRadius: 0,
  },
  checked: {},
});
const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

const MessageListItem = (props) => {
  const {
    email,
    emailFlagIds,
    setEmailFlagIds,
    handleCheckEmail,
    emailChecked,
    index,
    setNextIndex,
    emailPhotos = [],
    typeEmail,
  } = props;
  const { t } = useTranslation();
  const { instance } = useMsal();
  const emailToShow = getEmailToShow(typeEmail, email);
  const emailAddress = emailToShow?.emailAddress?.address;
  const emailColorInLocal = localStorage.getItem("EMAIL_COLOR");
  const [conversationCount, setConversationCount] = useState(0);
  const [attachment, setAttachment] = useState(email.hasAttachments);
  let emailColorInLocalParse = [];
  if (!emailColorInLocal) {
    if (emailPhotos.length) {
      emailColorInLocalParse = emailPhotos;
    }
  } else {
    emailColorInLocalParse = JSON.parse(localStorage.getItem("EMAIL_COLOR"));
  }
  const emailColor = getColorByEmail(emailColorInLocalParse, emailAddress);
  let isDefault = true;
  let colorValue = "";
  const getConversationCount = async () => {
    const result = await services.conversationCount(email.conversationId);
    setConversationCount(result["@odata.count"]);
  };
  const getConversationAttach = async () => {
    const result = await services.conversationAttach(email.conversationId);
    setAttachment(result["@odata.count"] > 0);

  };
  useEffect(() => {
    if (!email.hasAttachments){
      getConversationAttach();
    }
  }, [email.conversationId, email.hasAttachments]);
  useEffect(() => {
    getConversationCount();
  }, [email.conversationId]);
  if (emailColor && Object.keys(emailColor).length) {
    isDefault = emailColor.isDefault;
    colorValue = emailColor.value;
  }

  const flagIcon =
    email?.flag?.flagStatus === "flagged" ? flagIconOn : flagIconOff;
  const dispatch = useDispatch();
  //const [messageCount, setMessageCount] = useState("");
  const handleDeleteMail = async (e, email) => {
    e.stopPropagation();
    try {
      if (!email || Object.keys(email).length === 0) {
        return;
      }
      const { conversationId, id } = email;
      dispatch(setDeleteOutLookMailId(id));
      //setEmailChecked([id]);
      if (index - 1 < 0) {
        setNextIndex(index + 1);
      } else {
        setNextIndex(index - 1);
      }
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

  const handleChangeFlag = async (e, emailId) => {
    e.stopPropagation();
    try {
      const target = e.target;
      const status = target.getAttribute("data-status");
      target.src = status === "false" ? flagIconOn : flagIconOff;
      target.setAttribute("data-status", status === "false" ? "true" : "false");
      const parent = target.closest(".flag-button");
      parent.style.display = status === "false" ? "inline-block" : "";
      if (emailFlagIds.includes(emailId)) {
        const newArray = [...emailFlagIds];
        const filterArr = newArray.filter((item) => item !== emailId);
        setEmailFlagIds(filterArr);
      } else {
        setEmailFlagIds([...emailFlagIds, emailId]);
      }
      const data = {
        flag: {
          flagStatus: status === "false" ? "flagged" : "notFlagged",
        },
      };
      const localEmailList =
        JSON.parse(localStorage.getItem("EMAIL_LIST")) || [];
      if (localEmailList.length) {
        const type = status === "false" ? "flag" : "unFlag";
        const newEmailList = getNewEmailsByType(
          localEmailList,
          [emailId],
          type
        );
        localStorage.setItem("EMAIL_LIST", JSON.stringify(newEmailList));
      }
      await updateFlagEmail(emailId, data);
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        instance.acquireTokenRedirect({
          ...loginRequest,
          account: instance.getActiveAccount(),
        });
      }
    }
  };
  const renderText = () => {
    return (
      <div
        className={`user-image ${emailChecked.length > 0 ? "has-checked" : ""}`}
        style={{
          borderRadius: "5px",
          color: "var(--white)",
          fontSize: "15px",
          fontWeight: "600",
          lineHeight: "2.2",
          width: "32px",
          height: "32px",
          textAlign: "center",
          backgroundColor: `#${colorValue}`,
        }}
      >
        <span>
          {emailToShow?.emailAddress?.name.toUpperCase().slice(0, 1)}
          {!email?.isRead && <MentionImg src={Badge} />}
        </span>
      </div>
    );
  };
  const renderAvatar = () => {
    return (
      <div
        className={`user-image ${emailChecked.length > 0 ? "has-checked" : ""}`}
        style={{ borderRadius: "5px", color: "var(--white)", width: "32px" }}
      >
        {colorValue ? (
          <div>
            <img
              src={`data:image/png;base64,${colorValue}`}
              alt=""
              style={{
                borderRadius: "5px",
                color: "var(--white)",
                width: "32px",
              }}
            />
            {!email?.isRead && <MentionImg src={Badge} />}
          </div>
        ) : (
          renderText()
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`message-list-item ${
          !email?.isRead ? "email-is-unread" : ""
        }`}
      >
        <div className="d-flex">
          <div className="wrap-avatar" style={{ marginRight: "8px" }}>
            <CustomCheckbox
              icon={
                <img
                  src={CheckboxCustom}
                  alt={"check-box"}
                  style={{ marginTop: "3px" }}
                />
              }
              onClick={handleCheckEmail}
              color="primary"
              checked={emailChecked.includes(email.id)}
              value={email.id}
              className={`check-mail-item ${
                emailChecked.length > 0 ? "has-checked" : ""
              }`}
            />
            {email.isDraft ? (
              <div
                className={`user-image ${
                  emailChecked.length > 0 ? "has-checked" : ""
                }`}
                style={{
                  borderRadius: "5px",
                  color: "var(--white)",
                  width: "32px",
                }}
              >
                {" "}
              </div>
            ) : (
              <>{isDefault ? renderText() : renderAvatar()}</>
            )}
          </div>
          <div className="item message-item-wrap">
            <div className="message-list-item-header">
              {email.isDraft ? (
                <DraftTitle>
                  <DraftChecked>[Draft]</DraftChecked>
                  {email.toRecipients.length > 0 &&
                    email.toRecipients.map((item) => (
                      <span key={item.emailAddress.address}>
                        {item.emailAddress.name}
                      </span>
                    ))}
                </DraftTitle>
              ) : (
                <MessageName className="message-list-item-header-sender">
                  {emailToShow?.emailAddress?.name}
                </MessageName>
              )}

              <div className="message-list-item-header-right">
                <div className="has-attachments pr-2">
                  {email.importance === "high" ? (
                    <span style={{ color: "#a4262c" }}>!</span>
                  ) : email.importance === "low" ? (
                    <img
                      style={{
                        width: "12px",
                        height: "12px",
                        paddingBottom: "3px",
                      }}
                      src={arrowDown}
                      alt="low-important"
                    />
                  ) : null}
                </div>
                <div className="delete-button">
                  <DeleteImg
                    src={deleteIcon}
                    onClick={(e) => handleDeleteMail(e, email)}
                  />
                </div>
                <div className="has-attachments">
                  {attachment && <AttachImg src={fileAttach} />}
                </div>
                <div
                  className="flag-button "
                  style={{
                    display:
                      email?.flag?.flagStatus === "flagged"
                        ? "inline-block"
                        : "",
                  }}
                >
                  <FlagImg
                    src={flagIcon}
                    data-status={email?.flag?.flagStatus === "flagged"}
                    onClick={(e) => handleChangeFlag(e, email?.id)}
                  />
                </div>
              </div>
            </div>
            <div className="message-list-item-subject d-flex justify-content-between">
              {email.subject ? (
                <MessageSubject>{email.subject}</MessageSubject>
              ) : (
                <MessageSubject>{t("outlook.mail.draft.no.subject")}</MessageSubject>
              )}

              <div className="received-date-time">
                {moment(email?.receivedDateTime).isSame(moment(), "day")
                  ? moment(email.receivedDateTime).format("hh:mm a")
                  : moment(email.receivedDateTime).format("ddd DD/MM")}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              {email.bodyPreview.split("\r")[0] !== "" &&
              !email.bodyPreview.split("\r")[0].startsWith("_") ? (
                <AllReadMessage
                  dangerouslySetInnerHTML={{
                    __html: email.bodyPreview.split("\r")[0],
                  }}
                  className="message-list-message"
                />
              ) : (
                <AllReadMessage>{t("outlook.mail.draft.no.preview.available")}</AllReadMessage>
              )}
              {conversationCount > 1 && (
                <AllReadMessageCount>{conversationCount}</AllReadMessageCount>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageListItem;
