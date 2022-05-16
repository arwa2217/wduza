import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import {
  deleteDiscussionAction,
  resetControlFlags,
} from "../../../store/actions/channelActions";
import {
  StyledModal,
  LeaveButton,
  CancelButton,
} from "./styles/remove-people-style";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { showToast } from "../../../store/actions/toast-modal-actions";
import StatusCode from "../../../constants/rest/status-codes";

function DeleteDiscussionModal(props) {
  const [show, setShow] = useState(props.show);
  const [radioValue, setRadioValue] = useState("all");
  const dispatch = useDispatch();
  const channel = props.channel;

  const { t } = useTranslation();

  const { deletingDiscussion, deleteSuccessful, errorCode } = useSelector(
    (state) => state.ChannelReducer
  );

  useEffect(() => {
    if (deleteSuccessful) {
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.DELETE_DISCUSSION));
    } else if (deleteSuccessful === false) {
      if (
        errorCode &&
        (errorCode === StatusCode.COMMON_ERROR ||
          errorCode === StatusCode.SERVER_ERROR)
      ) {
        dispatch(showToast(t("error.code.message:COMMON_ERROR"), 3000));
      }
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.DELETE_DISCUSSION));
    }
  }, [deleteSuccessful]);

  function handleClose() {
    dispatch(resetControlFlags());
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.DELETE_DISCUSSION));
  }

  function handleDeleteDiscussion() {
    channel.isOwner &&
      channel.isDeletable &&
      dispatch(deleteDiscussionAction(channel));
  }

  function handleRadioSelect(e) {
    setRadioValue(e.target.value);
  }
  return (
    <StyledModal
      show={show}
      onHide={handleClose}
      centered
      extraheight={
        (props.channel.type !==
          "" /*making false forcibly should be "EXTERNAL"*/ &&
        props.channelPrivacyType === "delete").toString()
      }
    >
      <Modal.Header>
        <div className="heading">{props.title}</div>
      </Modal.Header>

      <Modal.Body>
        <div className="message">
          {t("delete.discussion.modal:body.delete")}
          <strong>{t("delete.discussion.modal:body.strong.warning")}</strong>
        </div>
        {props.channel.type ===
          "" /*making false forcibly should be "EXTERNAL"*/ &&
          props.channelPrivacyType === "delete" && (
            <div onChange={handleRadioSelect} className="delete-radio-div">
              <label className="delete-radio-button">
                <input
                  type="radio"
                  value="all"
                  name="deletionRange"
                  checked={radioValue === "all"}
                  className="delete-radio-button-input"
                />
                {t("delete.discussion.modal:from.all")}
              </label>
              <label className="delete-radio-button">
                <input
                  type="radio"
                  value="current"
                  name="deletionRange"
                  checked={radioValue === "current"}
                  className="delete-radio-button-input"
                />
                {t("delete.discussion.modal:from.current")}
              </label>
            </div>
          )}
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={handleClose}>
          {t("delete.discussion.modal:cancel")}
        </CancelButton>
        <LeaveButton onClick={handleDeleteDiscussion}>
          {deletingDiscussion && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {t("delete.discussion.modal:delete")}
        </LeaveButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default DeleteDiscussionModal;
