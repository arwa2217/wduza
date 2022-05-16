import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const RecipientLeaveModal = (props) => {
  const [show, setShow] = useState(props.show);
  const { t } = useTranslation();
  const cancelHandler = () => {
    setShow(false);
    props.cancel();
  };
  const okHandler = () => {
    // navigate here
    props.okay();
    setShow(false);
  };
  return (
    <Modal
      className="leave-modal-container"
      show={show}
      onHide={cancelHandler}
      centered
    >
      <Modal.Header className="leave-modal-header">
        <Modal.Title className="leave-modal-title">
          {t("esign:recipient:message")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Footer className="leave-modal-footer">
        {/* <Button className="leave-modal-cancel" onClick={cancelHandler}>{t('esign:recipient:cancel')}</Button> */}
        <Button className="leave-modal-submit" onClick={okHandler}>
          {t("esign:recipient:leave")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RecipientLeaveModal;
