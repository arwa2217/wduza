import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./file-forward-status-modal.css";

function FileForwardStatusModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="forward-files-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t(props.data.header)}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="forward-files-modal-content">
        <p className="content-title">{t(props.data.content)}</p>
      </Modal.Body>
      <Modal.Footer className="forward-files-modal-footer">
        <Button className="share-btn" onClick={props.closeModal}>
          {t(props.data.primaryButtonText)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FileForwardStatusModal;
