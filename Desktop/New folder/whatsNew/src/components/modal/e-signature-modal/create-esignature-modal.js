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
import {
  setESignFileInfo,
  setESignRecipientList,
} from "../../../store/actions/esignature-actions";
import "./style.css";
import { isLength } from "lodash";
var truncateMiddle = require("truncate-middle");

function CreateESignatureModal(props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [fileMetaData, setFileMetaData] = useState({});
  const [uploadModalBody, setUploadModalBody] = useState(false);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const dispatch = useDispatch();
  const [err, setErr] = useState(false);
  const [fileSize, setFileSize] = useState("0 Bytes");

  const titleKey = "Add document";
  const modalTitle = t(titleKey);

  const handleClose = () => {
    props.onModalHide();
  };

  function setIsOwnerRecipientData() {
    const { screenName, email, cid, userType } = currentUser;
    if (cid) {
      let data = [];
      let payload = {
        name: `${screenName}`,
        email: email,
        order: 1,
        xfdf: "",
        recipientCID: cid,
        signed: false,
        signNeeded: true,
        userType: userType,
      };
      data.push(payload);
      dispatch(setESignRecipientList(data));
    }
  }

  const uploadFile = () => {
    props.createEsignature(fileMetaData);
    props.onModalHide();
    props.changeSignatureState(radioValue);
    dispatch(setESignFileInfo(fileMetaData));
    radioValue && setIsOwnerRecipientData();
  };

  function handleFileUpload(evt) {
    setUploadModalBody(true);
    setFileMetaData(evt);
    calculateFileSize(evt);
    if (evt.name?.length > 64) {
      setErr(true);
    } else {
      setErr(false);
    }
  }

  function calculateFileSize(file) {
    var size = "0 Bytes";
    if (file.size == 0) {
      setFileSize(size);
    } else {
      var k = 1000,
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(file.size) / Math.log(k));
      size =
        parseFloat((file.size / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
      setFileSize(size);
    }
  }

  function resetModal() {
    setUploadModalBody(false);
  }

  const [radioValue, setRadioValue] = useState(false);

  return (
    <>
      <ESignatureStyledModal
        className="create-signature-modal"
        show={show}
        onHide={handleClose}
        centered
      >
        <ModalHeader>
          <span> {modalTitle}</span>
        </ModalHeader>
        {uploadModalBody ? (
          <Modal.Body className="upload-modal-body">
            <div className="form-control-field">
              <div className="sign-name-image">
                <img
                  style={{ padding: "2.5px 8px 2.5px 0px" }}
                  src={pdfImage}
                  alt="pdf"
                />
                <input
                  className={err ? "sign-name sign-name-err" : "sign-name"}
                  type="text"
                  value={
                    fileMetaData.name.length > 29
                      ? truncateMiddle(fileMetaData.name, 18, 11, "...")
                      : fileMetaData.name
                  }
                  title={fileMetaData.name}
                  readOnly
                />
              </div>
              <div
                className="align-items-center d-flex justify-content-end"
                style={{ width: "100px" }}
              >
                <span className="upload-file-size">{`${fileSize
                  .match(/\d+/g)
                  .join(".")} ${fileSize.match(/[a-zA-Z]+/g)}`}</span>
                <img
                  src={closeImage}
                  alt="close"
                  style={{ margin: "0 4px" }}
                  onClick={resetModal}
                />
              </div>
            </div>
            {err && (
              <p className="err-message">
                File name cannot be greater than 64
              </p>
            )}
            <div
              key={`default-radio`}
              className="form-control-radio"
              style={{ alignSelf: "flex-start" }}
            >
              <Form.Check
                type="radio"
                id={`default-radio`}
                label="I’m the only signer"
                onClick={() => setRadioValue(!radioValue)}
                checked={radioValue}
              />
            </div>
            {/* <div
              key={`default-radio`}
              className="custom-radio form-control-radio"
            >
              <input
                type={"radio"}
                id={`default-radio`}
                name="amOnlySigner"
                onClick={() => setRadioValue(!radioValue)}
                checked={radioValue}
              />
              <label htmlFor="amOnlySigner">I’m the only signer</label>
            </div> */}
          </Modal.Body>
        ) : (
          <Modal.Body>
            <Dropzone
              onFileUpload={handleFileUpload}
              // accept="application/pdf"
              accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </Modal.Body>
        )}
        {uploadModalBody ? (
          <Modal.Footer
            className="modal-upload-footer"
            style={{ border: "none" }}
          >
            <button
              className={
                err ? "create-sign-btn create-btn-diasbled" : "create-sign-btn"
              }
              onClick={uploadFile}
              disabled={err ? true : false}
            >
              Create signature
            </button>
          </Modal.Footer>
        ) : (
          <Modal.Footer style={{ border: "none" }}>
            <p style={{ margin: "0" }}>Upload only a single PDF file</p>
          </Modal.Footer>
        )}
      </ESignatureStyledModal>
    </>
  );
}

export default CreateESignatureModal;
