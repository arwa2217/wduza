import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./delete-account-modal.css";

function DeleteAccountFailedModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="delete-account-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t("account:delete.account.title")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="delete-account-modal-content">
        <p className="content-title">
          {t("account:delete.accounts.header.failed.title")}
        </p>
      </Modal.Body>
      <Modal.Footer className="delete-account-modal-footer">
        <Button className="share-btn" onClick={props.closeModal}>
          {t("button:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteAccountFailedModal;
