import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ESignatureServices from "../../../services/esignature-services";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import Button from "react-bootstrap/Button";
import { PrivateMessageStyledModal } from "./private-message-modal.styles";
import "./private-message-modal.css";
import { savePrivateMsg } from "../../../store/actions/esignature-actions";

const PrivateMessageModal = (props) => {
  const [message, setMessage] = useState(props?.message ? props.message : "");
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const add = () => {
    if (message) {
      const payload = {
        email: props?.senderEmail,
        privateMsg: message,
      };
      dispatch(savePrivateMsg(payload));
      props.handleClose();
    }
  };
  const handleClose = () => {
    props.handleClose();
  };
  return (
    <PrivateMessageStyledModal show={show} onHide={handleClose} centered>
      <ModalHeader>
        <span> {t("esign:private:message")}</span>
      </ModalHeader>
      <div class="private-body">
        <div className="sender-details">
          <span className="sender-name">{props.senderName}</span>
          <span className="sender-email">{props.senderEmail}</span>
        </div>
        <textarea
          name="message"
          className="txt-area"
          value={message}
          onChange={(e) => setMessage(e?.target?.value)}
          placeholder={t("esign:review:enter.message")}
          rows="5"
        ></textarea>
      </div>
      <Modal.Footer>
        <Button
          disabled={!message}
          onClick={() => {
            add();
          }}
          className="btn-add"
          variant="primary"
        >
          {t("esign:private:add")}
        </Button>
      </Modal.Footer>
    </PrivateMessageStyledModal>
  );
};

export default PrivateMessageModal;
