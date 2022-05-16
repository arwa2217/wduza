import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import {
  StyledModal,
  CancelButton,
  DeleteButton,
} from "./styles/delete-modal-style";

function ConfirmDeleteModal(props) {
  const { t } = useTranslation();
  return (
    <StyledModal show={props.showModal} onHide={props.handleCancel} centered>
      <Modal.Header>
        <p className="heading">{t("attachment:delete.modal.header")}</p>
      </Modal.Header>
      <Modal.Body>
        <p className="info">
          <span className="break" data-text={props.fileName}>
            {props.fileName}
          </span>{" "}
          <span className="align-bottom">
            {t("attachment:delete.modal.body")}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={props.handleCancel}>
          {t("attachment:delete.modal.close")}
        </CancelButton>
        <DeleteButton onClick={props.handleSubmit}>
          {t("attachment:delete.modal.confirm")}
        </DeleteButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default ConfirmDeleteModal;
