import CreateChannelModal from "../modal/channel/create-channel-modal";
import AddPeopleModal from "../modal/channel/add-people-modal";
import RemovePeopleModal from "../modal/channel/remove-people-modal";
import ChannelDescription from "../modal/channel/channel_description";
import ChannelTopic from "../modal/channel/channel_topic";
import DiscussionAdvanceCtrlModal from "../modal/channel/discussion-advnc-ctrl-modal";
import LeaveDiscussionModal from "../modal/channel/leave-discussion";
import RenameDiscussionModal from "../modal/channel/rename-discussion";
import DeleteDiscussionModal from "../modal/channel/delete-discussion";
import ArchiveDiscussionModal from "../modal/channel/archive-discussion";
import DiscussionDeletedModal from "../modal/channel/discussion-deleted";
import AvailableUidModal from "../modal/channel/available-uid-modal";
import UserBlockedModal from "../modal/account/blocked-user-account";

import React from "react";
import { useSelector } from "react-redux";
import TaskModal from "../task/task-modal";
import PostForwardModal from "../post-forward/post-forward-modal";
import PostForwardToEmailModal from "../post-forward-to-email/post-forward-to-email-modal";
import DiscussionModal from "../discussion-modal/discussion-modal";
import CollectionModal from "../collection-modal/collection-modal";
import CreateDiscussionModal from "../project/create-discussion-modal";

const MODAL_COMPONENTS = {
  CREATE_CHANNEL_MODAL: CreateChannelModal,
  ADD_PEOPLE_MODAL: AddPeopleModal,
  REMOVE_PEOPLE_MODAL: RemovePeopleModal,
  EDIT_CHANNEL_DESCRIPTION: ChannelDescription,
  EDIT_CHANNEL_TOPIC: ChannelTopic,
  CREATE_DISCUSSION_ADVANCE_CTRL: DiscussionAdvanceCtrlModal,
  LEAVE_DISCUSSION: LeaveDiscussionModal,
  RENAME_DISCUSSION: RenameDiscussionModal,
  DELETE_DISCUSSION: DeleteDiscussionModal,
  ARCHIVE_DISCUSSION: ArchiveDiscussionModal,
  DISCUSSION_DELETED: DiscussionDeletedModal,
  TASK_MODAL: TaskModal,
  POST_FORWARD_MODAL: PostForwardModal,
  POST_FORWARD_TO_EMAIL_MODAL: PostForwardToEmailModal,
  DISCUSSION_MODAL_SHOW: DiscussionModal,
  COLLECTION_MODAL_SHOW: CollectionModal,
  AVAILABLE_UID: AvailableUidModal,
  BLOCKED_DELETE_USER: UserBlockedModal,
  NEW_DISCUSSION: CreateDiscussionModal,
};

function ModalRoot() {
  const modalReducer = useSelector((state) => state.ModalReducer);
  let modalType = modalReducer.modalType;
  let modalProps = modalReducer.modalProps;

  if (!modalType) {
    return <span />; // after React v15 you can return null here
  }

  console.log("ModalRoot modalType=" + modalType);
  const SpecificModal = MODAL_COMPONENTS[modalType];
  return <SpecificModal {...modalProps} />;
}

export default ModalRoot;
