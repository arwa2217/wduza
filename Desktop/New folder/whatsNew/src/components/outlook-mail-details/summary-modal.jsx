import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import DefaultUser from "@icons/default-user.svg";
import { getDomainNameByEmail } from "../../utilities/outlook";
import { useMsal } from "@azure/msal-react";
import services from "../../outlook/apiService";
function SummaryModal(props) {
  const { t, i18n } = useTranslation();
  const { show, handleClose, userEmail, userAvatar, profile } = props;
  const { instance } = useMsal();
  const [userInfo, setUserInfo] = useState("");
  const [avatar, setUserAvatar] = useState("");
  const { username } = instance.getActiveAccount();
  useEffect(() => {
    if (
      userEmail &&
      getDomainNameByEmail(userEmail) === getDomainNameByEmail(username)
    ) {
      const getValues = async () => {
        const values = await services.getUserSummaryInfo(userEmail);
        setUserInfo(values);
      };
      try {
        if (userEmail) {
          getValues();
        }
      } catch (e) {}
    }
  }, [userEmail]);
  useEffect(() => {
    if (profile) {
      const emailColor = localStorage.getItem("EMAIL_COLOR")
        ? JSON.parse(localStorage.getItem("EMAIL_COLOR"))
        : [];
      const userAvatar = emailColor.find(
        (i) => i.email === profile?.address
      );
      setUserAvatar(userAvatar);
    }
  }, [profile]);
  return (
    <Modal
      show={show}
      className="members-profile"
      onHide={() => {
        handleClose();
      }}
      animation={false}
    >
      <>
        <Modal.Header closeButton>
          <Modal.Title>{t("user.profile:profile")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="member-info contact-info d-flex">
            {!avatar?.isDefault ? (
              <img
                src={
                  avatar?.value
                    ? `data:image/png;base64,${avatar?.value}`
                    : DefaultUser
                }
                alt=""
                style={{
                  width: "140px",
                  height: "140px",
                  marginRight: "50px",
                }}
              />
            ) : (
              <div
                className="user-image"
                style={{
                  borderRadius: "5px",
                  color: "var(--white)",
                  fontSize: "50px",
                  fontWeight: "600",
                  marginBottom: "10px",
                  lineHeight: "1.9",
                  textAlign: "center",
                  width: "140px",
                  height: "140px",
                  backgroundColor: `#${avatar?.value}`,
                }}
              >
                {profile?.name ? (
                  <span>
                    {profile?.name.toUpperCase().slice(0, 1)}
                  </span>
                ) : null}
              </div>
            )}
            <div className="pl-2 member-desc">
              <span className="user_name" style={{ fontSize: "16px" }}>
                {profile?.name}
              </span>
              {userInfo?.companyName ? (
                <span className="user_company">{userInfo?.companyName}</span>
              ) : null}
              {userInfo?.jobTitle ? (
                <span className="affiliation-info">{userInfo?.jobTitle}</span>
              ) : null}
              <span className="user_email">
                {profile?.address}
              </span>
              {userInfo?.mobilePhone ? (
                <span className="user_email">{userInfo?.mobilePhone}</span>
              ) : null}
            </div>
          </div>
        </Modal.Body>
      </>
    </Modal>
  );
}
export default SummaryModal;
