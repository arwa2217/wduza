import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ESignatureStyledModal } from "./create-esignature-modal.styles";
import logo from "../../../assets/icons/v2/logo.svg";
import ESignatureServices from "../../../services/esignature-services";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { getESignature } from "../../../store/actions/esignature-actions";
import { useHistory } from "react-router-dom";
import { removeAuthToken } from "../../../utilities/app-preference";
import VoidSuccessModal from "./void-success-modal";

function VoidESignatureModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [show, setShow] = useState(true);

  const voidNoteMaxChar = 200;
  const titleKey = "Reason for voiding";
  const modalTitle = t(titleKey);
  const [voidNoteCharLength, setVoidNodeCharLength] = useState(voidNoteMaxChar);
  const [reviewModalSwitch, setReviewModalSwitch] = useState(1);
  const [showInputField, setShowInputField] = useState(false);
  const [reasonText, setReasonText] = useState("");
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [err, setErr] = useState(false);
  const [voidFinishModal, setVoidFinishModal] = useState(false);
  const esignFolderSelected = useSelector(
    (state) => state.esignatureReducer.esignatureFolderSelected
  );

  const esignTabSelected = useSelector(
    (state) => state.esignatureReducer.esignatureTabSelected
  );
  function switchModalView() {
    ESignatureServices.voidEsignDocument(
      props.esignSummaryData?.fileId,
      currentUser.email ? currentUser.email : props.esignSummaryData?.email,
      { reason: reasonText }
    ).then((res) => {
      if (res?.code == 2001) {
        setVoidFinishModal(true);
        // dispatch(showToast(res?.message, 3000, "success"));
        dispatch(getESignature(esignFolderSelected, esignTabSelected));
        // handleClose();
        setErr(true);
      } else {
        dispatch(
          showToast(res?.message ?? "Something went wrong", 3000, "failure")
        );
      }
    });
  }
  const handleClose = () => {
    if (voidFinishModal) {
      if (props.isSigning) {
        currentUser.userType != "INTERNAL" && removeAuthToken();
        history.goBack();
      }
    }
    props.onModalHide();
  };

  return (
    <>
      {voidFinishModal ? (
        <VoidSuccessModal onHide={handleClose} />
      ) : (
        <ESignatureStyledModal show={show} onHide={handleClose} centered>
          <ModalHeader className="modal-void-header">
            <span> {modalTitle}</span>
          </ModalHeader>

          <Modal.Body className="upload-modal-body modal-body-void">
            <div className="void-document-body">
              {props.esignSummaryData?.fileName && (
                <span className="void-document-text">
                  {props.esignSummaryData.fileName}
                </span>
              )}
              <div style={{ width: "100%" }}>
                <textarea
                  className="modal-void-textarea"
                  placeholder="Enter the note"
                  value={reasonText}
                  onChange={(e) => {
                    setVoidNodeCharLength(
                      voidNoteMaxChar - e.target.value.length
                    );
                    setReasonText(e.target.value);
                  }}
                  maxLength={voidNoteMaxChar}
                />
                <span className="char-length">
                  Characters remaining : {voidNoteCharLength}
                </span>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer
            className="modal-upload-footer"
            style={{ border: "none", marginTop: "25px" }}
          >
            <button
              className={
                err ? "create-sign-btn create-btn-diasbled" : "create-sign-btn"
              }
              onClick={() => {
                switchModalView(reviewModalSwitch);
              }}
              style={{ width: "92px" }}
              disabled={err ? true : false}
            >
              OK
            </button>
          </Modal.Footer>
        </ESignatureStyledModal>
      )}
    </>
  );
}

export default VoidESignatureModal;
