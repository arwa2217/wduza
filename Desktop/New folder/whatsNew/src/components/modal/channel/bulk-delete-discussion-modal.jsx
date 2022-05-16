import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./bulk-delete-discussion-modal.css";

function BulkDeleteDiscussionModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={true}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="bulk-delete-discussion-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t("discussion:bulk.delete.header")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bulk-delete-discussion-modal-content">
        <p className="content-title">{t("discussion:bulk.delete.content")}</p>
      </Modal.Body>
      <Modal.Footer className="bulk-delete-discussion-modal-footer">
        <Button className="ok-btn" onClick={props.closeModal}>
          {t("button:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BulkDeleteDiscussionModal;
