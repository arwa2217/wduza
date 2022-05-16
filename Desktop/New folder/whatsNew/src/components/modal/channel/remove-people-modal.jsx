import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import "./create-channel-modal.css";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { resetRemoveChannelMemberAction } from "../../../store/actions/channelActions";
import { channelDetailAction } from "../../../store/actions/channelActions";
import { fetchDiscussionMemberData } from "../../../store/actions/admin-discussion-action";
import { useEffect } from "react";
import {
  StyledModal,
  SaveButton,
  CancelButton,
} from "./styles/remove-people-style";
import Participant from "./remove-participant-view";
import { showToast } from "../../../store/actions/toast-modal-actions";

function RemovePeopleModal(props) {
  const [show, setShow] = useState(props.show);
  const dispatch = useDispatch();
  const user = props.user;
  const channel = props.channel;

  const { t } = useTranslation();

  const removingMember = useSelector(
    (state) => state.channelMembers.removingMember
  );
  const removedMember = useSelector(
    (state) => state.channelMembers.removedMember
  );
  const failedToRemoveMember = useSelector(
    (state) => state.channelMembers.failedToRemoveMember
  );
  const removingMemberAdmin = useSelector(
    (state) => state.AdminDiscussionReducer.removingMember
  );
  const removedMemberAdmin = useSelector(
    (state) => state.AdminDiscussionReducer.removedMember
  );
  const failedToRemoveMemberAdmin = useSelector(
    (state) => state.AdminDiscussionReducer.failedToRemoveMember
  );
 
  useEffect(() => {
    if (removedMemberAdmin || failedToRemoveMemberAdmin) {
      if (removedMemberAdmin) {
        dispatch(
          showToast(
            t("admin:discussion.management:members:removed.success"),
            3000,
            "success"
          )
        );
        //GetChannelMemberAction(channel.id,dispatch);
        dispatch(fetchDiscussionMemberData(channel.id));
      }
      handleClose();
    }
  }, [removedMemberAdmin, failedToRemoveMemberAdmin]);

  useEffect(() => {
    if (removedMember || failedToRemoveMember) {
      if (removedMember) {
        //GetChannelMemberAction(channel.id,dispatch);
        dispatch(channelDetailAction(channel.id));
      }
      handleClose();
    }
  }, [removedMember, failedToRemoveMember]);

  function handleClose(e) {
    dispatch(resetRemoveChannelMemberAction());
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.REMOVE_PEOPLE));
  }

  //Its no more required , also this field is not part of GlobalMember API
  /*const date = new Date();
  date.setTime(user.timeAdded * 1000); //As requestTime is in second and javascript work with millisecond only.

  const dateTimeFormat = new Intl.DateTimeFormat("en", { weekday: "long" });
  const [{ value: weekday }] = dateTimeFormat.formatToParts(date);
*/

  return (
    <StyledModal show={show} onHide={handleClose} centered>
      <ModalHeader>
        <div className="heading">
          {t("removePeople.modal:remove") +
            " " +
            user.map((i) => i.screenName).join(", ") +
            t("removePeople.modal:remove.question.mark")}{" "}
        </div>
      </ModalHeader>

      <Modal.Body>
        <div className="message">
          {t("remove.member")} <strong> "{channel.name}" </strong>
          {t("remove.confirm")}
        </div>
        {user.map((i) => (
          <Participant key={`participant${i.id}`} user={i} />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={handleClose}>
          {t("removePeople.modal:cancel")}
        </CancelButton>
        <SaveButton
          onClick={(e) =>
            props.handleRemove(
              e,
              channel.id,
              user,
              user.map((i) => i.screenName).join(", ")
            )
          }
        >
          {(removingMember || removingMemberAdmin) && (
            <span className="spinner-border spinner-border-sm mr-1"></span>
          )}
          {t("removePeople.modal:remove")}
        </SaveButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default RemovePeopleModal;
