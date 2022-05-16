import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "react-bootstrap";
import DefaultUser from "../../assets/icons/default-user.svg";

function BeingProfileModal(props) {
  const { t } = useTranslation();
  const { show, user, handleClose } = props;

  let affiliation = true;
  if (user.affiliation === "" || user.affiliation === "undefined") {
    affiliation = false;
  }

  return (
    <Modal
      show={show}
      className="members-profile"
      onHide={handleClose}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t("user.profile:profile")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="member-info">
          <div className="user-image">
            <img
              src={user.userImg ? user.userImg : DefaultUser}
              alt="user-pic"
            />
          </div>
          <div className="pl-2 member-desc">
            <span className="user_type">{user.userType}</span>
            <span className="user_name">{user.screenName}</span>
            <span className="user_company">{user.jobTitle}</span>
            <p className="affiliation-info">
              {user.affiliation}
              {affiliation && " (" + user.companyName + ")"}
              {!affiliation && user.companyName}
            </p>
            <p className="user_email">{user.email}</p>
            <p className="user_email">{user ? user.phoneNumber : ""}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BeingProfileModal;
