import React, { useEffect, useState } from "react";
import "./discussion-list-item.css";
import Badge from "../../assets/icons/notification-badge.svg";
import AdvancedDiscussion from "../../assets/icons/v2/security.svg";
import FlagActive from "../../assets/icons/v2/ic_flag_act.svg";
import Flag from "../../assets/icons/v2/ic_flag.svg";
import ExternalDiscussionImg from "../../assets/icons/v2/external.svg";
import GuestDiscussionImg from "../../assets/icons/v2/ic_badge_guest.svg";
import NDAAvatarImg from "../../assets/icons/v2/ic_nda_avatar.svg";
import styled from "styled-components";
import ChannelConstants from "../../constants/channel/channel-constants";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { collectionConstants } from "../../constants/collection";
import {
  addSelectedCollectionClass,
  removeSelectedCollectionClass,
} from "../utils/collection";
import { makeStyles } from "@material-ui/core";
import moment from "moment";
import DiscussionListItemAvatar from "./discussion-list-item-avatar";

const MentionImg = styled.img`
  width: 6px;
  height: 6px;
  float: left;
  margin: 0 5px 0 0;
  visibility: visible;
`;

const AvartarDiscussion = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
`;

const HiddenMentionImg = styled.img`
  width: 6px;
  height: 6px;
  margin-right: 5px !important;
  float: left;
  color: rgba(0, 0, 0, 0.7);
  margin: 0;
  visibility: hidden;
`;

const HiddenLockImg = styled.img`
  width: 24px;
  height: 24px;
  margin: 0;
  visibility: hidden;
`;

const DiscussionName = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 1.2;
  //width: 100%;
  //width: calc(100% - 65px);
`;

const TypeImg = styled.img`
  width: 16px;
  height: 16px;
  margin: 0 0 0 5px;
  border: none;
  visibility: visible;
`;

const HiddenTypeImg = styled.img`
  width: 20px;
  height: 20px;
  margin: 0;
  border: none;
  visibility: hidden;
`;

const DiscussionMember = styled.p`
  width: calc(100% - 16px);
  font-size: 12px;
  color: #999999;
  margin-bottom: 1px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 14px;
`;

const UnreadMessage = styled.div`
  width: 206px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 12px;
  overflow: hidden;
  line-height: 14px;
  white-space: nowrap;
  height: 16px;
  text-overflow: ellipsis;
  > p {
    max-width: 211px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const AllReadMessage = styled.div`
  width: 206px;
  color: rgba(0, 0, 0, 0.7);
  font-size: 12px;
  overflow: hidden;
  line-height: 14px;
  white-space: nowrap;
  height: 16px;
  text-overflow: ellipsis;
  > p {
    max-width: 211px;
    color: rgba(0, 0, 0, 0.7);
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const useStyles = makeStyles((theme) => ({
  detailsWrapper: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "224px",
    alignItems: "center",
    position: "relative",
  },
  time: {
    color: theme.palette.text.black50,
    fontSize: "11px",
    minWidth: "50px",
    textAlign: "end",
  },
  borderBottom: {
    margin: "0 16px 0 72px",
  },
  memberCount: {
    fontSize: "12px",
    // lineHeight: "100%",
    color: theme.palette.text.black70,
    paddingLeft: "4px",
  },
}));

function DiscussionListItem(props) {
  const classes = useStyles();
  const { handleDiscussionChange, deletedList, members } = props;
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const activeCollection = useSelector(
    (state) => state.CollectionReducer?.activeCollection
  );
  const channelListActive = activeCollection?.channels || [];
  const activeCollectionId = activeCollection?.id;
  // check if this discussion is selected
  const { t } = useTranslation();
  const [previewMessage, setPreviewMessage] = useState("");
  let isActive = false;
  if (props.activeDiscussionId === props.channel?.id) {
    isActive = true;
  }
  useEffect(() => {
    if (props.previewMsg === "") {
      const lastPost = props?.channel?.LastPost;
      const forwardPostId = lastPost?.forwardedPost?.post?.id;
      if (lastPost.fileListIDs) {
        setPreviewMessage(
          `${lastPost?.user?.displayName} uploads ${lastPost?.fileListIDs.length} files`
        );
      } else if (lastPost?.post_type === "TASK") {
        setPreviewMessage(`${lastPost?.user?.displayName} create a task`);
      } else if (forwardPostId !== "") {
        setPreviewMessage(`${lastPost?.user?.displayName} forward a post`);
      }
    } else {
      setPreviewMessage(props.previewMsg);
    }
  }, [props]);
  let unReadMessageCount = props.channel?.newMessageCount;
  let discussionType = props.channel?.type;
  let isAdvancedDiscussion = props.channel?.isAdvanced;
  // let discussionStatus = props.channel?.status;
  // let isLockedDiscussion = false;
  // let isDeletedDiscussion = false;
  // if (discussionStatus === "LOCKED") {
  //   isLockedDiscussion = true;
  // }
  // if (discussionStatus === "DELETED") {
  //   isDeletedDiscussion = true;
  // }
  let typeImage = undefined;
  if (discussionType === ChannelConstants.EXTERNAL) {
    typeImage = ExternalDiscussionImg;
  } else if (discussionType === ChannelConstants.GUEST) {
    typeImage = GuestDiscussionImg;
  }

  let bookmarkOn = props.bookmarkOn;

  function toggleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();
    props.toggleBookmark(props.channel?.id, !bookmarkOn);
    return false;
  }
  const filterByActiveCollection =
    activeCollectionId !== "ALL"
      ? channelListActive.includes(props.channel?.id) &&
        !deletedList.includes(props.channel?.id)
      : true;
  const handleOnShow = (channelId) => {
    removeSelectedCollectionClass(".discussion-list-body-item");
    addSelectedCollectionClass(".discussion-list-body-item", channelId);
  };
  const handleOnMouseLeave = (e) => {
    removeSelectedCollectionClass(".discussion-list-body-item");
  };
  return (
    <>
      <ContextMenuTrigger id={props.channel?.id}>
        {channelList?.length > 0 && filterByActiveCollection && (
          <div className={`${isActive && "active-item"}`}>
            <div className={`discussion-list-item`}>
              {unReadMessageCount > 0 ? (
                <MentionImg src={Badge} />
              ) : (
                <HiddenMentionImg src={Badge} />
              )}
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ width: "100%" }}
              >
                <div className={classes.imgOverflow}>
                  {!props.channel.isConfidential ? (
                    <DiscussionListItemAvatar members={members} />
                  ) : (
                    <img
                      src={NDAAvatarImg}
                      style={{
                        width: "40px",
                        height: "40px",
                        marginRight: "10px",
                      }}
                      alt="NDA-avatar"
                    />
                  )}
                </div>
                <div className="discussion-list-item-details">
                  <div className={classes.detailsWrapper}>
                    <div
                      style={{
                        width: "calc(100% - 45px)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <DiscussionName>{props.channel?.name}</DiscussionName>
                      {props.channel?.memberCount > 1 && (
                        <span className={classes.memberCount}>
                          {props.channel?.memberCount}
                        </span>
                      )}
                      {isAdvancedDiscussion && (
                        <TypeImg src={AdvancedDiscussion} />
                      )}
                      {typeImage && <TypeImg src={typeImage} />}
                      {props.channel.isConfidential && (
                        <button
                          className="discussion-list-bookmark-btn"
                          type="button"
                          onClick={toggleBookmark}
                          style={{
                            position: "absolute",
                            right: 0,
                          }}
                        >
                          {bookmarkOn ? (
                            <img
                              src={FlagActive}
                              alt="flag-active"
                              className="flag-active"
                            />
                          ) : (
                            <img src={Flag} alt="flag" className="flag" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className={classes.time}>
                      {!props.channel.isConfidential &&
                        (moment(props?.channel?.LastPost?.updatedAt).isSame(
                          moment(),
                          "day"
                        )
                          ? moment(props?.channel?.LastPost?.updatedAt).format(
                              "hh:mm A"
                            )
                          : moment(props?.channel?.LastPost?.updatedAt).format(
                              "MMM DD"
                            ))}
                    </div>
                  </div>
                  {/*{isLockedDiscussion ? (*/}
                  {/*  <LockImg src={DiscussionLockImg} />*/}
                  {/*) : isDeletedDiscussion ? (*/}
                  {/*  <LockImg src={DiscussionDeletedImg} />*/}
                  {/*) : (*/}
                  {/*  <HiddenLockImg src={DiscussionLockImg} />*/}
                  {/*)}*/}
                  {/*{typeImage === undefined ? (*/}
                  {/*  <HiddenTypeImg src={GuestDiscussionImg} />*/}
                  {/*) : (*/}
                  {/*  <TypeImg src={typeImage} />*/}
                  {/*)}*/}
                  {/*<button*/}
                  {/*  className="discussion-list-bookmark-btn"*/}
                  {/*  type="button"*/}
                  {/*  onClick={toggleBookmark}*/}
                  {/*>*/}
                  {/*  {bookmarkOn ? (*/}
                  {/*    <img src={BookmarkOnImg} alt="bookmark-active" />*/}
                  {/*  ) : (*/}
                  {/*    <img src={BookmarkOffImg} alt="bookmark-inactive" />*/}
                  {/*  )}*/}
                  {/*</button>*/}
                  {!props.channel.isConfidential && (
                    <div className={classes.detailsWrapper}>
                      {unReadMessageCount > 0 ? (
                        <UnreadMessage
                          dangerouslySetInnerHTML={{ __html: previewMessage }}
                          // className="discussion-list-message"
                        />
                      ) : (
                        <AllReadMessage
                          dangerouslySetInnerHTML={{ __html: previewMessage }}
                          // className="discussion-list-message"
                        />
                      )}
                      <button
                        className="discussion-list-bookmark-btn"
                        type="button"
                        onClick={toggleBookmark}
                      >
                        {bookmarkOn ? (
                          <img
                            src={FlagActive}
                            alt="flag-active"
                            className="flag-active"
                          />
                        ) : (
                          <img src={Flag} alt="flag" className="flag" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                {/*<DiscussionMember>*/}
                {/*  {t(`discussion.list.sub.heading`, {*/}
                {/*    name:*/}
                {/*      props.channel?.creator.length > 22*/}
                {/*        ? props.channel?.creator.substring(0, 22) + "..."*/}
                {/*        : props.channel?.creator,*/}
                {/*    count: props.channel?.memberCount - 1,*/}
                {/*  })}*/}
                {/*</DiscussionMember>*/}
              </div>
            </div>
            <hr className={classes.borderBottom} />
            {/*{!props.lastItemIndex && <hr className={classes.borderBottom} />}*/}
          </div>
        )}
      </ContextMenuTrigger>
      <ContextMenu
        id={props.channel?.id}
        hideOnLeave
        onShow={() => handleOnShow(props.channel?.id)}
        onMouseLeave={handleOnMouseLeave}
      >
        {collectionConstants.MENU_DISCUSSION_FUNCTION.map((menu) => {
          const disabled =
            activeCollectionId === "ALL" &&
            ["move", "delete"].includes(menu.name);
          return (
            <MenuItem
              key={menu.id}
              onClick={(e) =>
                handleDiscussionChange(
                  e,
                  props.channel?.id,
                  menu.name,
                  disabled,
                  activeCollectionId
                )
              }
              disabled={disabled}
            >
              {t(`discussion:collection:menu:${menu.name}`)}
            </MenuItem>
          );
        })}
      </ContextMenu>
    </>
  );
}

export default DiscussionListItem;
