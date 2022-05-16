import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useTranslation } from "react-i18next";
import close from "../../assets/icons/close.svg";
function SignoutModal(props) {
  const { t } = useTranslation();

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header>
        <Modal.Title closeButton>
          {t("signoutHeader")}
          <img
            src={close}
            alt="subtract"
            onClick={props.handleClose}
            style={{ float: "right", cursor: "pointer" }}
          />
        </Modal.Title>
        {/* <Modal.Title >{t('signoutHeader')}</Modal.Title> */}
      </Modal.Header>
      <Modal.Body>{t("signoutBody")}</Modal.Body>
      <Modal.Footer>
        <Button
          className="col-3 btn-lg"
          variant="secondary"
          onClick={props.handleClose}
        >
          {t("signoutButtonSecondary")}
        </Button>
        <Button
          className=" col-3 offset-2 btn-lg"
          variant="primary"
          onClick={props.handleSignout}
        >
          {t("signoutButtonPrimary")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SignoutModal;
