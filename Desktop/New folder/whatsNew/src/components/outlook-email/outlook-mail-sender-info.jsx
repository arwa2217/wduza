import React, { useEffect, useState } from "react";
import moment from "moment";
import "./outlook-mail-sender-info.css";
import { deleteMailFolderId } from "../../outlook/config";
import { getDefaultImage } from "../../utilities/outlook-message-list";
import { useTranslation } from "react-i18next";

const OutlookMailSenderInfo = (props) => {
  const { parentFolderId, isDraft, senderInfo, sentDateTime } = props;
  const [profilePhotoUrl, setProfilePhotoUrl] = useState({});
  const { t } = useTranslation();
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
  return (
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
        <div className="d-flex flex-column justify-content-center">
          {isDraft ? (
            <>
              <div className="draft-header">{t("outlook.mail.draft")}</div>
              <div className="draft-des">
                {t("outlook.mail.draft.description")}
              </div>
            </>
          ) : (
            <>
              <div
                className={`sender-name ${
                  parentFolderId === deleteMailFolderId ? "deleted-email" : ""
                } `}
              >
                {senderInfo.emailAddress.name}
              </div>

              <div
                className={`post-time ${
                  parentFolderId === deleteMailFolderId ? "deleted-email" : ""
                }`}
              >
                {moment(sentDateTime).format("ddd, MMM DD, hh:mmA")}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutlookMailSenderInfo;
