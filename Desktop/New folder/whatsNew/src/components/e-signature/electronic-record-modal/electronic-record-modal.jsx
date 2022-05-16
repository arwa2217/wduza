import React from "react";
import Modal from "react-bootstrap/Modal";

const ElectronicRecordModal = (props) => {
  return (
    <Modal
      size="lg"
      show={true}
      scrollable={true}
      onHide={props.onHide}
      centered
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{__html: props.content}}>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ElectronicRecordModal;
