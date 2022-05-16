import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";
import "./download-warning-modal.css";
function DownloadWarningModal(props) {
  const { t } = useTranslation();
  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="download-warning-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {" "}
          {t("warning.download.modal:warning")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="download-warning-content">
        {props.data?.map((fileItem, index) => {
          return (
            <span className="content-title" key={fileItem.name}>
              {fileItem.name}
              {index !== props.data.length - 1 ? `, ` : ""}
            </span>
          );
        })}
        <p className="content-title">
          {t("warning.download.modal:file.content")}
          {` ${props.totalCount} `} {t("warning.download.modal:files")}.
        </p>
      </Modal.Body>
      <Modal.Footer className="download-warning-footer">
        <Button className="ok-btn" onClick={props.closeModal}>
          {t("warning.download.modal:ok.button")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DownloadWarningModal;
