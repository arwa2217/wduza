import UserActions from "../../../store/actions/user-actions";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import CloseIcon from "../../../assets/icons/close.svg";
import ModalActions from "../../../store/actions/modal-actions";
import ModalTypes from "../../../constants/modal/modal-type";

import "./delete-account-modal.css";

function UserBlockedModal(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleOnClick = (e) => {
    dispatch(ModalActions.hideModal(ModalTypes.BLOCKED_DELETE_USER));
    dispatch(UserActions.signout());
  };
  useEffect(() => {
    setTimeout(() => {
      handleOnClick()
    }, 10000)
  },[])

  return (
    <Modal
      show={true}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="delete-account-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t("admin:account.management:user.information:account")}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={(e) => handleOnClick(e)} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="delete-account-modal-content">
        <p className="content-title">
           {props.isPasswordLocked ? t("admin:account.management:user.information:description.password") : t("admin:account.management:user.information:description")}
        </p> 
      </Modal.Body>
      <Modal.Footer className="delete-account-modal-footer">
        <Button className="share-btn" onClick={(e) => handleOnClick(e)}>
          {t("admin:account.management:user.information:ok")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserBlockedModal;
