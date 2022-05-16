import React, { useEffect, useRef, useState } from "react";
import "./outlook-mail-item.css";
import fileAttach from "../../assets/icons/attachment-icon.svg";
import { deleteMailFolderId } from "../../outlook/config";
import moment from "moment";
import { getDefaultImage } from "../../utilities/outlook-message-list";
import { useDispatch, useSelector } from "react-redux";
import services from "../../outlook/apiService";
import {
  setIsReadMailId,
  updateUnreadInConversation,
} from "../../store/actions/outlook-mail-actions";
import {useTranslation} from "react-i18next";

const OutlookMailCollapseItem = (props) => {
  const {
    hasAttachments,
    parentFolderId,
    isDraft,
    senderInfo,
    sentDateTime,
    bodyPreview,
    uniqueBody,
    toggleCollapseItem,
    mailItem,
    setIsCollapse,
    isCollapse,
    updateUnreadConversation,
  } = props;
  const [profilePhotoUrl, setProfilePhotoUrl] = useState({});
  const mailRef = useRef(null);
  const mailHighLightId = useSelector(
    (state) => state.OutlookMailReducer.currentHighLightMailId
  );
  const mailFolderInfo = useSelector(
    (state) => state.OutlookMailReducer?.mailFolderInfo
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    if (mailItem.id === mailHighLightId) {
      setTimeout(() => {
        setIsCollapse(mailItem.id !== mailHighLightId);
        updateUnread();
      }, 500);
      mailRef?.current?.scrollIntoView();
    }
  }, [mailHighLightId]);

  useEffect(() => {
    const emailColor = localStorage.getItem("EMAIL_COLOR")
      ? JSON.parse(localStorage.getItem("EMAIL_COLOR"))
      : [];
    const userAvatar = emailColor.find(
      (i) => i.email === senderInfo?.emailAddress?.address
    );
    if (userAvatar && Object.keys(userAvatar).length) {
      setProfilePhotoUrl(userAvatar);
    } else {
      setProfilePhotoUrl({
        isDefault: false,
        value: getDefaultImage(),
      });
    }
  }, [senderInfo]);
  const updateUnread = async () => {
    await services.updateEmailInfo(mailItem.id, {
      isRead: true,
    });
    if (mailFolderInfo?.inbox === parentFolderId) {
      dispatch(setIsReadMailId(mailItem.id));
      updateUnreadConversation(mailItem.id);
    }
  };
  const handleOpenCollapse = async () => {
    toggleCollapseItem();
    if (isCollapse && !mailItem.isRead) {
      updateUnread();
    }
  };

  return (
    <>
      <div
        className="mail-item-collapse-wrapper"
        ref={mailRef}
        onClick={handleOpenCollapse}
        style={{
          transition: "all 300ms",
          scrollMargin: "100px",
          animationDelay: "1s",
          backgroundColor: "#fff",
        }}
      >
        <div className="sender-wrapper">
          <div className="d-flex">
            <div className="sender-image">
              {!profilePhotoUrl?.isDefault ? (
                <img
                  style={{
                    borderRadius: "5px",
                    color: "var(--white)",
                    width: "40px",
                    height: "40px",
                    alignSelf: "flex-start",
                  }}
                  src={`data:image/png;base64,${profilePhotoUrl?.value}`}
                  alt=""
                />
              ) : (
                <div
                  className="user-image"
                  style={{
                    borderRadius: "5px",
                    color: "var(--white)",
                    fontSize: "1rem",
                    fontWeight: "600",
                    marginBottom: "10px",
                    lineHeight: "2.7",
                    textAlign: "center",
                    backgroundColor: `#${profilePhotoUrl?.value}`,
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {senderInfo?.emailAddress?.name ? (
                    <span>
                      {senderInfo?.emailAddress?.name.toUpperCase().slice(0, 1)}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
            <div
              className="d-flex flex-column justify-content-center"
              style={{ width: "calc(100% - 178px)" }}
            >
              {isDraft ? (
                <div className="draft-header">{t("outlook.mail.draft")}</div>
              ) : (
                <div
                  // className={`sender-name ${
                  //   parentFolderId === deleteMailFolderId ? "deleted-email" : ""
                  // } `}
                  className={"sender-name"}
                >
                  {senderInfo.emailAddress.name}
                </div>
              )}
              {uniqueBody.content !== "<html><body></body></html>" ? (
                <div
                  className={`body-preview ${
                    parentFolderId === deleteMailFolderId ? "deleted-email" : ""
                  }`}
                  style={{
                    color: !mailItem.isRead ? "#308F65" : "#19191A",
                  }}
                >
                  {bodyPreview.split("\r")[0]}
                </div>
              ) : isDraft ? (
                <div className="draft-des">{t("outlook.mail.draft.no.preview")}</div>
              ) : (
                <div className="body-preview">{t("outlook.mail.draft.no.message")}</div>
              )}
            </div>
            <div
              className="d-flex flex-column justify-content-center align-items-end"
              style={{ width: "200px" }}
            >
              {hasAttachments && (
                <img
                  src={fileAttach}
                  alt={"file-attach"}
                  style={{ width: 16, height: 16 }}
                />
              )}

              <div
                // className={`post-time ${
                //   parentFolderId === deleteMailFolderId ? "deleted-email" : ""
                // }`}
                className={"post-time"}
              >
                {moment(sentDateTime).format("ddd, MMM DD, hh:mmA")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OutlookMailCollapseItem;
