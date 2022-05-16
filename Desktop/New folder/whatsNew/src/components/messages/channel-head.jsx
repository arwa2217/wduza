import React, { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cleanMessages,
  unreadChannelMessagesActions,
  toggleUnreadMessage,
} from "../../store/actions/channelMessagesAction";
import { resetNewUnreadMessageCount } from "../../store/actions/channelActions";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import deleteIcon from "../../assets/icons/v2/ic_delete.svg";
import unLockIcon from "../../assets/icons/v2/ic_un-lock.svg";
import lockIcon from "../../assets/icons/v2/ic_lock.svg";
import exitIcon from "../../assets/icons/v2/ic_exit.svg";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  flatButton: {
    border: "none",
    backgroundColor: theme.palette.background.sub1,
    color: theme.palette.text.secondary,
    fontSize: 12,
    paddingRight: "16px",
    cursor: "pointer",
    paddingTop: "2px",
    "& svg": {
      width: "14px",
      height: "14px",
      fill: theme.palette.text.secondary,
      "& path:hover": {
        fill: theme.palette.text.black70,
      },
    },
    "&:hover:not([disabled])": {
      color: theme.palette.text.black70,
    },
  },
  flatButtonLock: {
    border: "none",
    "& svg:hover": {
      stroke: theme.palette.text.focused1,
      "& path": {
        stroke: theme.palette.text.focused1,
      },
    },
  },
  flatButtonActive: {
    border: "none",
    backgroundColor: theme.palette.background.sub1,
    fontWeight: "700",
    color: `${theme.palette.text.focused} !important`,
    paddingRight: "16px",
  },
  leftMessageTab: {
    height: 40,
    backgroundColor: theme.palette.background.sub1,
  },
  markAsReadActive: {
    fontSize: "11px",
    lineHeight: "134%",
    color: "rgba(0, 0, 0, 0.4)",
  },
  markAsRead: {
    fontSize: "11px",
    lineHeight: "134%",
    color: "rgba(0, 0, 0, 0.4)",
    opacity: "0.35",
  },
}));
const btnFilters = ["All", "Unreads"];
const [btnAll] = btnFilters;
function ChannelHead(props) {
  const [showNewMessageBadge, setShowNewMessageBadge] = useState(false);
  const classes = useStyles();
  const [activeFilter, setActiveFilter] = useState(btnAll);
  const dispatch = useDispatch();
  const isToggleUnreadMessage = useSelector(
    (state) => state.channelMessages.toggleUnreadMessage
  );
  let channelId = useSelector(
    (state) => state.config?.activeSelectedChannel?.id
  );
  let newUnreadMessageCount = useSelector(
    (state) => state.config?.activeSelectedChannel?.newUnreadMessageCount
  );
  let unreadPostCount = useSelector(
    (state) => state.config?.activeSelectedChannel?.unreadPostCount
  );
  const channelStatus = useSelector((state) => state.channelDetails.status);
  const memberCount = useSelector((state) => state.channelDetails.memberCount);
  const isConfidential = useSelector(
    (state) => state.config?.activeSelectedChannel?.isConfidential
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (newUnreadMessageCount > 0) {
      setShowNewMessageBadge(true);
    } else {
      if (!isToggleUnreadMessage && unreadPostCount && unreadPostCount > 0) {
        setShowNewMessageBadge(true);
      } else {
        setShowNewMessageBadge(false);
      }
    }
  }, [newUnreadMessageCount, isToggleUnreadMessage, unreadPostCount]);

  function toggleUnreadMessageBtn() {
    dispatch(toggleUnreadMessage(channelId));
    dispatch(resetNewUnreadMessageCount(channelId));
  }
  function unreadMessageReload() {
    // dispatch(resetNewUnreadMessageCount(channelId));
    // dispatch(cleanMessages(channelId));
    // dispatch(
    //   unreadChannelMessagesActions(channelId, 0, 0, true, undefined, true)
    // );
  }
  const handleFilter = (btn) => {
    if (isToggleUnreadMessage) {
      if (showNewMessageBadge) {
        // unreadMessageReload();
      } else {
        toggleUnreadMessageBtn();
      }
    } else {
      if (showNewMessageBadge) {
        toggleUnreadMessageBtn();
      }
    }
    setActiveFilter(btn);
  };

  function handleChannelDelete() {
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
  const leaveDiscussion = () => {
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
  };
  const handleChannelLock = () => {
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
  };
  const handleLeaveDiscussion = () => {
    if (
      props.channel.isOwner &&
      props.channel.isDeletable &&
      channelStatus !== "DELETED"
    ) {
      handleChannelDelete();
    } else if (
      props.channel.isOwner &&
      props.channel.isLockable &&
      channelStatus !== "LOCKED"
    ) {
      handleChannelLock();
    } else {
      leaveDiscussion();
    }
  };
  const isDisableLock = !(
    props.channel.isOwner &&
    props.channel.isLockable === true &&
    props.channel.isAdvanced &&
    channelStatus !== "LOCKED"
  );

  const isDisableDelete = !(
    props.channel.isOwner &&
    props.channel.isDeletable === true &&
    props.channel.isAdvanced &&
    channelStatus !== "DELETED"
  );

  const isDisableLeave =
    props.channel.isOwner && memberCount > 1 && channelStatus === "ACTIVE";
  return (
    <Box
      className={classNames(
        "m-0 left-message-tab d-flex align-items-center justify-content-between",
        classes.leftMessageTab
      )}
    >
      <Box className="btn-groups btn-filter">
        <button
          disabled={"All" === btnAll ? false : !showNewMessageBadge}
          onClick={() => handleFilter("All")}
          className={classNames(
            classes.flatButton,
            activeFilter === "All" && classes.flatButtonActive
          )}
        >
          All
        </button>
        <button
          disabled={"Unreads" === btnAll ? false : !showNewMessageBadge}
          onClick={() => handleFilter("Unreads")}
          className={classNames(
            classes.flatButton,
            activeFilter === "Unreads" && classes.flatButtonActive
          )}
          style={{
            opacity: newUnreadMessageCount > 0 ? "1" : "0.35",
            cursor: newUnreadMessageCount > 0 ? "default" : "not-allowed",
          }}
        >
          Unreads
        </button>
      </Box>
      <Box className="btn-groups btn-settings d-flex justify-content-end align-items-center">
        {!isToggleUnreadMessage ? (
          <Fragment>
            <p>{isConfidential}</p>
            {/*{props.channel.isLockable && props.channel.isOwner && (*/}
            {/*  <button*/}
            {/*    className={classes.flatButtonLock}*/}
            {/*    disabled={isDisableLock}*/}
            {/*    onClick={handleChannelLock}*/}
            {/*  >*/}
            {/*    <SVG src={unLockIcon} className="btn-icon" />*/}
            {/*  </button>*/}
            {/*)}*/}
            {props.channel.isLockable &&
              props.channel.isOwner &&
              (channelStatus === "LOCKED" ? (
                <button
                  className={classes.flatButtonLock}
                  disabled={isDisableLock}
                  // onClick={handleChannelLock}
                >
                  <SVG src={lockIcon} className="btn-icon" />
                </button>
              ) : (
                <button
                  className={classes.flatButtonLock}
                  disabled={isDisableLock}
                  onClick={handleChannelLock}
                >
                  <SVG src={unLockIcon} className="btn-icon" />
                </button>
              ))}

            {props.channel.isDeletable && props.channel.isOwner && (
              <button
                className={classes.flatButtonLock}
                disabled={isDisableDelete}
                onClick={handleChannelDelete}
              >
                <SVG src={deleteIcon} className="btn-icon" />
              </button>
            )}
            <button
              className={classes.flatButton}
              disabled={isDisableLeave}
              onClick={() => handleLeaveDiscussion()}
            >
              <SVG src={exitIcon} className="btn-icon" />
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <span
              className={
                unreadPostCount > 0
                  ? classes.markAsReadActive
                  : classes.markAsRead
              }
              onClick={unreadMessageReload}
            >
              Mark all as read
            </span>
          </Fragment>
        )}
      </Box>
    </Box>
  );
}

export default ChannelHead;
