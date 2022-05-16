import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";

function WIPModal(props) {
  const { t } = useTranslation();

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t("work.in.progress.modal:work.in.progress")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t("work.in.progress.modal:feature.is.not.yet.available")}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn-block col-4 offset-7 btn-lg"
          variant="primary"
          onClick={props.handleClose}
        >
          {t("work.in.progress.modal:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WIPModal;
