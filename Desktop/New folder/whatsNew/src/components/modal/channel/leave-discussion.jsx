import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import {
  leaveDiscussionAction,
  GetChannelListAction,
  deleteDiscussionAction,
  resetControlFlags,
  archiveDiscussionAction,
} from "../../../store/actions/channelActions";
import { showToast } from "../../../store/actions/toast-modal-actions";
import {
  StyledModal,
  LeaveButton,
  CancelButton,
} from "./styles/remove-people-style";
import { useDispatch, useSelector } from "react-redux";
import StatusCode from "../../../constants/rest/status-codes";
import UserType from "../../../constants/user/user-type";
import { removeAuthToken } from "../../../utilities/app-preference";

function LeaveDiscussionModal(props) {
  const [show, setShow] = useState(props.show);
  const dispatch = useDispatch();
  const channel = props.channel;
  const currentUser = useSelector((state) => state.AuthReducer.user);

  const { t } = useTranslation();
  const {
    leavingDiscussion,
    deletingDiscussion,
    leaveSuccessful,
    deleteSuccessful,
    errorCode,
    archivingDiscussion,
    archiveSuccessful,
  } = useSelector((state) => state.ChannelReducer);

  const channelStatus = useSelector((state) => state.channelDetails.status);

  useEffect(() => {
    if (leaveSuccessful || deleteSuccessful || archiveSuccessful) {
      if (
        leaveSuccessful &&
        currentUser &&
        currentUser.userType === UserType.GUEST
      ) {
        setTimeout(() => {
          //dispatch(UserActions.signout());
          //TODO logout API doesn't work after leave the discussion, simply removing the auth token for now.
          removeAuthToken();
          location.reload(true); // eslint-disable-line
        }, 1000);
      } else {
        dispatch(GetChannelListAction());
      }
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.LEAVE_DISCUSSION));
    } else if (
      leaveSuccessful === false ||
      deleteSuccessful === false ||
      archiveSuccessful === false
    ) {
      if (
        errorCode &&
        (errorCode === StatusCode.COMMON_ERROR ||
          errorCode === StatusCode.SERVER_ERROR)
      ) {
        dispatch(showToast("Error Occurred", 3000));
      }
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.LEAVE_DISCUSSION));
    }
  }, [leaveSuccessful, deleteSuccessful, archiveSuccessful]);

  function handleClose() {
    dispatch(resetControlFlags());
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.LEAVE_DISCUSSION));
  }

  function handleLeaveDiscussion() {
    if (props.isOwner && channel.isDeletable && channelStatus !== "DELETED") {
      dispatch(deleteDiscussionAction(channel));
    } else if (
      props.isOwner &&
      channel.isLockable &&
      channelStatus !== "LOCKED"
    ) {
      dispatch(archiveDiscussionAction(channel));
    } else {
      dispatch(leaveDiscussionAction(channel));
    }
  }

  return (
    <StyledModal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <div className="heading">{props.title}</div>
      </Modal.Header>

      <Modal.Body>
        <div className="message">
          {props.isOwner && channel.isLockable && channelStatus !== "LOCKED"
            ? t("leave.discussion.modal:body.owner", {
                action: "archived",
              })
            : props.isOwner &&
              channel.isDeletable &&
              channelStatus !== "DELETED"
            ? t("leave.discussion.modal:body.owner", {
                action: "deleted",
              })
            : t("leave.discussion.modal:body.member")}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={handleClose}>
          {t("leave.discussion.modal:cancel")}
        </CancelButton>
        <LeaveButton onClick={handleLeaveDiscussion}>
          {(leavingDiscussion || deletingDiscussion || archivingDiscussion) && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {props.isOwner
            ? channel.isLockable && channelStatus !== "LOCKED"
              ? t("leave.discussion.modal:archive")
              : channel.isDeletable && channelStatus !== "DELETED"
              ? t("leave.discussion.modal:delete")
              : t("leave.discussion.modal:leave")
            : t("leave.discussion.modal:leave")}
        </LeaveButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default LeaveDiscussionModal;
