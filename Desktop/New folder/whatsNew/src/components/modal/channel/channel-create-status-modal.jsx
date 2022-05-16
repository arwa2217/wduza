import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./channel-create-status-modal.css";

function CreateChannelStatusModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={false}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="channel-create-status-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t("discussion:created")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="channel-create-status-modal-content">
        <p className="content-title">
          {t("discussion:discussion.admin.create.content")}
        </p>
      </Modal.Body>
      <Modal.Footer className="channel-create-status-modal-footer">
        <Button className="share-btn" onClick={props.closeModal}>
          {t("button:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateChannelStatusModal;
