import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ESignatureServices from "../../../services/esignature-services";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import "./private-message-modal.css";

const DisplayPrivateMessageModal = (props) => {
  const { t } = useTranslation();
  const [show, setShow] = useState(props.isOpen);
  const handleClose = () => {
    props.handlePrivatemsgClose();
  };

  return (
    <Modal
      className="display-private-msg"
      show={show}
      centered
      onHide={handleClose}
    >
      <Modal.Header>
        <div className="modal-title">{t("esign:private:message")}</div>
      </Modal.Header>
      <Modal.Body>
        <p>{props?.privateMsg}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-close" onClick={handleClose} variant="primary">
          {t("esign:private:close")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisplayPrivateMessageModal;
