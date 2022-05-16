import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./delete-discussion-modal.css";

function DeleteDiscussionModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="delete-discussion-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t("account:delete.discussion")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="delete-discussion-modal-content">
        <p className="content-title">
          {props.discussionCount === 1
            ? t("account:delete.discussion.header.single")
            : t("account:delete.discussion.header.multiple", {
                discussionCount: props.discussionCount
                  ? props.discussionCount
                  : 0,
              })}
        </p>
      </Modal.Body>
      <Modal.Footer className="delete-discussion-modal-footer">
        <Button className="share-btn" onClick={props.onSubmit}>
          {t("button:delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteDiscussionModal;
