import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./channel-details.css";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import rename from "../../assets/icons/rename-discussion.svg";
import renameHover from "../../assets/icons/rename-discussion-hover.svg";
import leave from "../../assets/icons/leave-discussion.svg";
import leaveHover from "../../assets/icons/leave-discussion-hover.svg";

export default React.memo((props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [renameIcon, setRenameIcon] = useState(rename);
  const [leaveIcon, setLeaveIcon] = useState(leave);
  const channelStatus = useSelector((state) => state.channelDetails.status);
  const memberCount = useSelector((state) => state.channelDetails.memberCount);

  function leaveDiscussion() {
    const modalType = ModalTypes.LEAVE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("leave.discussion.modal:title", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: props.channel,
      isOwner: props.channel.isOwner,
      channelPrivacyType: "delete",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function renameDiscussion() {
    const modalType = ModalTypes.RENAME_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("rename.discussion.modal:title", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: props.channel,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function deleteDiscussion() {
    const modalType = ModalTypes.DELETE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("delete.discussion.modal:title.delete", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: props.channel,
      channelPrivacyType: "delete",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleChannelLock() {
    const modalType = ModalTypes.ARCHIVE_DISCUSSION;
    const modalProps = {
      show: true,
      closeButton: true,
      title: t("delete.discussion.modal:title.archive", {
        discussionName: props.channel.name,
      }),
      modalType: modalType,
      channel: props.channel,
      channelPrivacyType: "archive",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  function handleLeaveDiscussion() {
    if (
      props.channel.isOwner &&
      props.channel.isDeletable &&
      channelStatus !== "DELETED"
    ) {
      deleteDiscussion();
    } else if (
      props.channel.isOwner &&
      props.channel.isLockable &&
      channelStatus !== "LOCKED"
    ) {
      handleChannelLock();
    } else {
      leaveDiscussion();
    }
  }

  return (
    <div className="row w-100 ml-0 border-top">
      <div className="col-12 p-0">
        {props.channel.isOwner && (
          <div
            disabled={channelStatus === "LOCKED" || channelStatus === "DELETED"}
            className="col-12 px-4"
            onMouseOver={() => {
              !(channelStatus === "LOCKED" || channelStatus === "DELETED") &&
                setRenameIcon(renameHover);
            }}
            onMouseOut={() => {
              !(channelStatus === "LOCKED" || channelStatus === "DELETED") &&
                setRenameIcon(rename);
            }}
          >
            <button
              disabled={
                channelStatus === "LOCKED" || channelStatus === "DELETED"
              }
              onClick={
                channelStatus === "LOCKED" || channelStatus === "DELETED"
                  ? undefined
                  : renameDiscussion
              }
              className={`btn btn-block rename-discussion-button ${
                channelStatus === "LOCKED" || channelStatus === "DELETED"
                  ? "disabled"
                  : ""
              } `}
            >
              <img src={renameIcon} alt="rename-icon" />{" "}
              {t("control:rename.discussion")}
            </button>
          </div>
        )}
        <div
          className="col-12 px-4"
          disabled={
            props.channel.isOwner &&
            ((channelStatus === "LOCKED" && memberCount > 1) ||
              channelStatus !== "LOCKED")
          }
          onMouseOver={() => {
            !(
              props.channel.isOwner &&
              ((channelStatus === "LOCKED" && memberCount > 1) ||
                channelStatus !== "LOCKED")
            ) && setLeaveIcon(leaveHover);
          }}
          onMouseOut={() => {
            !(
              props.channel.isOwner &&
              ((channelStatus === "LOCKED" && memberCount > 1) ||
                channelStatus !== "LOCKED")
            ) && setLeaveIcon(leave);
          }}
        >
          <button
            disabled={
              props.channel.isOwner &&
              ((channelStatus === "LOCKED" && memberCount > 1) ||
                channelStatus !== "LOCKED")
            }
            onClick={
              props.channel.isOwner &&
              ((channelStatus === "LOCKED" && memberCount > 1) ||
                channelStatus !== "LOCKED")
                ? undefined
                : handleLeaveDiscussion
            }
            className={`btn btn-block leave-discussion-button ${
              props.channel.isOwner &&
              ((channelStatus === "LOCKED" && memberCount > 1) ||
                channelStatus !== "LOCKED")
                ? "disabled"
                : ""
            }`}
          >
            <img src={leaveIcon} alt="leave icon" />
            {t("control:leave.discussion")}
          </button>
        </div>
      </div>
    </div>
  );
});
