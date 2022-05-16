import React from "react";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import { CircularProgress } from "@material-ui/core";
import "./style.css";

class ProcessingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  render() {
    const { isOpen } = this.props;
    const { error } = this.state;
    return (
      <Modal show={isOpen} className="loading-modal" centered>
        <ModalBody>
          <div className="file-process-container">
            <CircularProgress className="custom-spinner" />
            <div className="file-process-message">
              <h4>Processing your Request...</h4>
              <h6>
                Please wait and do not refresh your page while we process your
                file.
              </h6>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default ProcessingModal;
