import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createFolderAction,
  resetCreateFolderAction,
} from "../../../store/actions/folderAction";
import { ESignatureStyledModal } from "./create-esignature-modal.styles";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Close from "../../../assets/icons/close.svg";
import Dropzone from "./e-signature-modal-dropzone";
import { FormControl, InputGroup } from "react-bootstrap";
import pdfImage from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import closeImage from "../../../assets/icons/v2/ic_input_close.svg";
import "./style.css";
import { uploadEsignAttachment } from "../../../store/actions/esignature-actions";
function EmployeementESignatureModal(props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [fileMetaData, setFileMetaData] = useState({});
  const [uploadModalBody, setUploadModalBody] = useState(false);
  const dispatch = useDispatch();
  const [err, setErr] = useState(false);

  const titleKey = "Emplyment Agreement";
  const modalTitle = t(titleKey);

  const handleClose = () => {
    props.onModalHide();
  };

  const uploadFile = () => {
    dispatch(uploadEsignAttachment(fileMetaData));
    props.onFileUploadClick(fileMetaData);
    props.onModalHide();
  };

  function handleFileUpload(evt) {
    setUploadModalBody(true);
    setFileMetaData(evt);
    if (evt.name?.length > 64) {
      setErr(true);
    }
  }

  const [radioValue, setRadioValue] = useState(true);

  return (
    <>
      <ESignatureStyledModal show={show} onHide={handleClose} centered className="agreement-modal">
        <ModalHeader style={{ display: "block" }} >
          <div className="header-container">
            {/* <span className="aggr-title"> {modalTitle}</span> */}
            <span> {modalTitle}</span>
            {/* <button
              type="button"
              className="close"
              onClick={() => {
                props.onModalHide();
              }}
            >
              <span aria-hidden="true">
                <img src={Close} alt="" />
              </span>
              <span className="sr-only">
                {t("files:create.folder.modal:close")}
              </span>
            </button> */}
          </div>
          {/* <span className="header-content-subtitle">
            Please attach your Employment Agreement
          </span> */}
        </ModalHeader>
        {uploadModalBody ? (
          <Modal.Body className="upload-modal-body recipent-upload">
            <div className="form-control-field">
              <div className="sign-name-image">
                <img style={{ padding: "5px" }} src={pdfImage} alt="pdf" />
                <input
                  className={err ? "sign-name sign-name-err" : "sign-name"}
                  type="text"
                  value={fileMetaData.name}
                  readOnly
                />
              </div>
              <img src={closeImage} alt="close" />
            </div>
            {err && (
              <p className="err-message">
                File-name length cannot be greater than 64
              </p>
            )}
          </Modal.Body>
        ) : (
          <Modal.Body>
            <Dropzone onFileUpload={handleFileUpload} />
          </Modal.Body>
        )}
        {uploadModalBody && (
          <Modal.Footer
            className="modal-upload-footer"
            style={{ border: "none" }}
          >
            <button
              className={
                err
                  ? "create-sign-btn create-btn-diasbled"
                  : "upload-attachment-btn"
              }
              onClick={uploadFile}
              disabled={err ? true : false}
            >
              Upload
            </button>
          </Modal.Footer>
        )}
      </ESignatureStyledModal>
    </>
  );
}

export default EmployeementESignatureModal;
