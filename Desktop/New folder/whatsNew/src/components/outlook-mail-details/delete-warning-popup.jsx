import Modal from "react-bootstrap/Modal";
import React from "react";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { refreshContactData } from "../../store/actions/mail-summary-action";
import services from "../../outlook/apiService";
import { useTranslation } from "react-i18next";

function DeleteWarningPopup(props) {
  const { showWarning, handleCloseWarning, contactId, contactName } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleConfirm = async () => {
    try {
      await services.deleteContact(contactId);
      dispatch(refreshContactData(true));
    } catch (e) {}
  };
  console.log("test")
  return (
    <Modal
      show={showWarning}
      className="members-profile"
      onHide={handleCloseWarning}
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-black-50"> {t("email-contact:confirmText")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p className="text-black-50">
            {t("email-contact:confirmContent", {contactName: contactName})}{" "}
          </p>
        </div>
        <div className="contact-action-buttons justify-content-end d-flex pt-4">
          <Button className="btn-sm" onClick={handleCloseWarning}>
            {t("email-contact:cancel")}
          </Button>
          <Button className="ml-2 btn-sm" onClick={handleConfirm}>
            {t("email-contact:ok")}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
export default DeleteWarningPopup;
