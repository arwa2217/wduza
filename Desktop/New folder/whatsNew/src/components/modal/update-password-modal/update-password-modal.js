import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./updatepasswordmodal.css";

function UpdatePasswordModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="update-password-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t(props.data.header)}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="update-password-modal-content">
        <p className="content-title">
          {t("update-password-modal:content-title1", {
            updatePasswordEmail: props.currentUser.email,
          })}
          {t("update-password-modal:content-title2")}
        </p>
      </Modal.Body>
      <Modal.Footer className="update-password-modal-footer">
        <Button className="close-btn" onClick={props.closeModal}>
          {t("update-password-modal:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdatePasswordModal;
