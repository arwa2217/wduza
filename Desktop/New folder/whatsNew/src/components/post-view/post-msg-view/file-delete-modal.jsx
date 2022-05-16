import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import {
  StyledModal,
  CancelButton,
  DeleteButton,
} from "./styles/delete-modal-style";
// import Close from "../../../assets/icons/close.svg";

function FileDeleteModal(props) {
  const { t } = useTranslation();
  return (
    <StyledModal show={props.showModal} onHide={props.handleCancel} centered>
      <Modal.Header className="d-flex ">
        <p className="heading">{t("files:delete.modal.header")}</p>
        {/* <button type="button" className="close" onClick={props.handleCancel}>
          <span aria-hidden="true">
            <img src={Close} />
          </span>
          <span className="sr-only">{t("files:delete.modal:close")}</span>
        </button> */}
      </Modal.Header>
      <Modal.Body>
        <p className="info">
          {/* <span className="break" data-text={props.fileName}>
            {props.fileName}
          </span>{" "} */}
          <span className="align-bottom">
            {t("files:delete.modal.body", { fileCount: props.fileCount })}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={props.handleCancel}>
          {t("files:delete.modal.close")}
        </CancelButton>
        <DeleteButton onClick={props.handleSubmit}>
          {t("files:delete.modal.confirm")}
        </DeleteButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default FileDeleteModal;
