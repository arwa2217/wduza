import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

function NotificationModal(props) {
  const { t } = useTranslation();

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title id="title">{t("notification.modal:error")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.error}</Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>{t("discussion:new.discussion")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default NotificationModal;
