import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { StyledModal, GreenButton } from "./styles/remove-people-style";
import { useDispatch } from "react-redux";
import Close from "../../../assets/icons/close.svg";

function DiscussionDeletedModal(props) {
  const [show, setShow] = useState(props.show);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  function handleClose() {
    setShow(false);
    props.setDeletedNoticeShown(false);
    dispatch(ModalActions.hideModal(ModalTypes.DISCUSSION_DELETED));
  }

  return (
    <StyledModal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <div className="heading">{props.title}</div>
        <button
          style={{ paddingRight: "35px" }}
          type="button"
          class="close"
          onClick={handleClose}
        >
          <span aria-hidden="true">
            <img src={Close} alt="close-button" />
          </span>
          <span class="sr-only">{t("discussion.deleted.modal:close")}</span>
        </button>
      </Modal.Header>

      <Modal.Body>
        <div className="message">{t("discussion.deleted.modal:body")}</div>
      </Modal.Body>
      <Modal.Footer>
        <GreenButton onClick={handleClose}>
          {t("discussion.deleted.modal:button")}
        </GreenButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default DiscussionDeletedModal;
