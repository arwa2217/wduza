import React, { useState, useEffect } from "react";
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

function FolderDeleteModal(props) {
  const { t } = useTranslation();

  const [deleteAllFiles, setDeleteAllFiles] = useState(false);

  useEffect(() => {
    setDeleteAllFiles(props.totalFiles > 0 ? false : true);
  }, [props.totalFiles]);

  return (
    <>
      <StyledModal
        className="create-folder-modal"
        show={props.showModal}
        onHide={props.handleCancel}
        centered
      >
        <ModalHeader>
          <span className="header-title">
            {t("files:delete.folder.modal:header")}
          </span>
          <button
            type="button"
            className="close"
            onClick={() => props.handleCancel()}
          >
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">
              {t("files:delete.folder.modal:close")}
            </span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <Message>
            {props.totalFiles > 0 && (
              <div style={{ marginBottom: "8px" }}>
                {t(
                  props.totalFiles > 1
                    ? "files:delete.folder.modal:deleteFiles"
                    : "files:delete.folder.modal:deleteFile",
                  {
                    fileCount: props.totalFiles,
                  }
                )}
              </div>
            )}
            <b>{props.name}</b> {t("files:delete.folder.modal:body")}
            {props.totalFiles ? (
              <div style={{ marginTop: "10px", marginLeft: "22px" }}>
                <input
                  type="checkbox"
                  className="custom-control-input custom-control-input-green"
                  id="deleteAllFiles"
                  checked={deleteAllFiles}
                  onChange={() => setDeleteAllFiles(!deleteAllFiles)}
                />
                <label
                  className="custom-control-label pointer-on-hover"
                  htmlFor="deleteAllFiles"
                  style={{ padding: "5px" }}
                >
                  {t("files:delete.folder.modal:deleteAllCheck")}
                </label>
              </div>
            ) : (
              <></>
            )}
          </Message>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className={
              props.totalFiles > 0 && !deleteAllFiles
                ? "create-folder-btn-disabled"
                : "create-folder-btn"
            }
            disabled={props.totalFiles > 0 && !deleteAllFiles}
            style={{ width: "130px" }}
            onClick={deleteAllFiles && props.handleSubmit}
          >
            {/* {creatingFolder && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )} */}
            {t("files:delete.modal.confirm")}
          </button>
        </Modal.Footer>
      </StyledModal>{" "}
    </>
  );
}

export default FolderDeleteModal;
