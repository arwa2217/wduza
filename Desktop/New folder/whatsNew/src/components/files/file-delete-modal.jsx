import React from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useTranslation } from "react-i18next";
import { StyledModal } from "../modal/folder-modal/createFolderModal.styles";
import "../modal/folder-modal/folder.css";
import Close from "../../assets/icons/close.svg";
import styled from "styled-components";

const Message = styled.p`
  font-weight: normal;
  font-size: 16px;
  line-height: 100%;
  color: #19191a;
`;

const Warning = styled.span`
  display: block;
  margin-top: 10px;
  font-size: 12px;
  color: #f36e3a;
`;

function FileDeleteModal(props) {
  const { t } = useTranslation();

  return (
    <>
      <StyledModal
        className="create-folder-modal"
        show={props.showModal}
        onHide={props.handleCancel}
        centered
      >
        <ModalHeader>
          <span className="header-title">{t("files:delete.modal.header")}</span>
          <button
            type="button"
            className="close"
            onClick={() => props.handleCancel()}
          >
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">
              {t("files:create.folder.modal:close")}
            </span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <Message>
            {t(
              props.fileCount > 1
                ? "files:delete.modal.body"
                : "files:delete.modal.singleFileBody",
              { fileCount: props.fileCount }
            )}
            {props.showOwnFileDeleteWarning && (
              <Warning>{t("files:delete.modal.ownFileDeleteWarning")}</Warning>
            )}
          </Message>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className="create-folder-btn"
            style={{ width: "130px" }}
            onClick={props.handleSubmit}
          >
            {t("files:delete.modal.confirm")}
          </button>
        </Modal.Footer>
      </StyledModal>{" "}
    </>
  );
}

export default FileDeleteModal;
