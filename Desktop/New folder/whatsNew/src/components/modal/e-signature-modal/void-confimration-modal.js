import React from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import "./style.css";

const VoidConfirmationModal = (props) => {
  return (
    <Modal
      show={true}
      onHide={props.onModalHide}
      className="void-confirm-modal"
      centered
    >
      <ModalBody>
        <p className="void-confirm-text">
          If you select continue, this document will be voided.
        </p>
      </ModalBody>
      <Modal.Footer className="modal-upload-footer" style={{ border: "none" }}>
        <button className="btn-primary btn" onClick={props.onClick}>
          Continue
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default VoidConfirmationModal;
