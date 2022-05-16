import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch } from "react-redux";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";

function ChannelTopic(props) {
  const [show, setShow] = useState(props.show);
  const [closeButton, setCloseButton] = useState(props.closeButton);

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const removingUser = false; //useSelector(state => state.AuthReducer.signingIn);
  const cancelRemove = false;

  function handleEdit(e) {
    e.preventDefault();
    setSubmitted(true);
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.EDIT_TOPIC));
  }

  function handleCancel(e) {
    e.preventDefault();
    setSubmitted(true);
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.EDIT_TOPIC));
  }

  const handleClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.EDIT_TOPIC));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <ModalHeader closeButton={closeButton} className="pb-1">
        <Modal.Title>{t("editTopic.modal:header")}</Modal.Title>
      </ModalHeader>

      <Modal.Body>
        <div
          contentEditable
          className="form-control"
          style={{
            borderColor: "#333",
            borderWidth: "1.2px",
            minHeight: "80px",
            borderRadius: "4px",
          }}
        ></div>
      </Modal.Body>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-lg btn-secondary block"
          onClick={handleCancel}
        >
          {removingUser && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {t("editTopic.modal:cancel")}
        </button>
        <button
          type="button"
          className="btn btn-lg btn-primary block col-2"
          onClick={handleEdit}
        >
          {cancelRemove && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {t("editTopic.modal:update")}
        </button>
      </div>
    </Modal>
  );
}

export default ChannelTopic;
