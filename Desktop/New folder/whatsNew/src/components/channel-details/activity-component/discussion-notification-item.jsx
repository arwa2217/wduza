import React, { Fragment, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import DefaultUser from "../../../assets/icons/default-user.svg";
import { updateNotificationState } from "../../../store/actions/notification-action";
import CommonUtils from "../../utils/common-utils";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { Trans, useTranslation } from "react-i18next";
import classNames from "classnames";
import {
  fetchNotificationAction,
  closeReplyNotificationState,
} from "../../../store/actions/notification-action";
import NotificationMessage from "../../datapanel/no-notifications-message";
import { NOTIFICATION_COUNT } from "../../../constants";
import { toggleUnreadMessage } from "../../../store/actions/channelMessagesAction";
import FileAttachmentService from "../../../services/file-attachment-service";
import { makeStyles } from "@material-ui/core";
import TimeAgo from "react-timeago";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";
import DefaultAvatar from "../../modal/popupAddUser/DefaultAvatar";

const formatter = buildFormatter({
  prefixAgo: null,
  prefixFromNow: null,
  suffixAgo: "",
  suffixFromNow: "",
  seconds: "1s",
  minute: "1m",
  minutes: "%dm",
  week: "1w",
  weeks: "%dw",
  hour: "1h",
  hours: "%dh",
  day: "1d",
  days: "%dd",
  month: "1mon",
  months: "%dmon",
  year: "1yrs",
  years: "%dyrs",
  wordSeparator: " ",
});

const UserInvite = styled.span`
  min-width: 232px;
`;

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: "bold",
    fontSize: "13px",
    color: theme.palette.text.primary,
    textOverflow: "ellipsis",
    lineHeight: "1.2",
    overflow: "hidden",
    width: "90%",
  },
  normalText: {
    fontWeight: "normal",
    fontSize: "13px",
    lineHeight: "120%",
    color: theme.palette.text.primary,
  },
  companyText: {
    color: theme.palette.text.black40,
    fontSize: "11px",
    paddingBottom: "3px",
  },
  bageUnread: {
    marginRight: "6px",
    width: "6px",
    height: "6px",
  },
  notificationDescription: {
    fontSize: 0,
    display: "flex",
    // borderBottom: "1px solid #E6E6E6",
    // paddingBottom: "5px",
    // height: "22.5px",
    "& p": {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
      fontSize: "12px",
      color: theme.palette.text.black70,
      margin: 0,
    },
    "& p:not(:first-child)": {
      display: "none",
    },
    "& .mention-info": {
      height: "17.5px",
    },
  },
}));
const DiscussionNotificationItem = ({ postsToRender, fromPanel }) => {
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const timeAgo = new TimeAgo("en-US");

  const classes = useStyles();
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const notificationSuccess = useSelector(
    (state) => state.notificationReducer.getNotificationSuccess
  );
  let isActive = true;
  const { t } = useTranslation();
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  let channelId = useSelector(
    (state) => state.config?.activeSelectedChannel?.id
  );
  let imageFileUrl = useSelector((state) => state.fileReducer?.imageFileUrl);
  const isToggleUnreadMessage = useSelector(
    (state) => state.channelMessages.toggleUnreadMessage
  );

  const dispatch = useDispatch();

  const getUserImage = (userId) => {
    let member = globalMembers.filter((member) => member.id === userId);
    return member[0]?.userImg === "" ? null : member[0]?.userImg;
  };

  const getUserName = (userId) => {
    let member = globalMembers.filter((member) => member.id === userId);
    return member[0]?.screenName;
  };

  const getUserEmail = (userId) => {
    let member = globalMembers.filter((member) => member.id === userId);
    return member[0]?.email;
  };

  useEffect(() => {
    if (notificationSuccess) {
      dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT));
      dispatch(closeReplyNotificationState());
      if (imageFileUrl) {
        dispatch(FileAttachmentService.resetImageFile());
      }
    }
  }, [notificationSuccess]);
  const postClick = (event, notification) => {
    event.stopPropagation();
    if (isToggleUnreadMessage) dispatch(toggleUnreadMessage(channelId));
    let myPostContent = notification.refPostContent
      ? JSON.parse(
          Buffer(notification.refPostContent, "base64").toString("utf-8")
        )
      : "";
    if (notification.state === "UNREAD" || notification.state === "CHECKED") {
      dispatch(updateNotificationState(notification.id, "READ"));
    }

    if (notification.isHidden && myPostContent?.userId !== currentUserId) {
      dispatch(showToast(t("user.post.hide")), 3000);
    } else {
      const isChannelExist = channelList.some(
        (el) => el.id === notification.refChannelID
      );
      if (isChannelExist === false) {
        dispatch(showToast(t("my.notification:exist.message")), 3000);
      } else {
        let postContent = notification.refPostContent
          ? JSON.parse(
              Buffer(notification.refPostContent, "base64").toString("utf-8")
            )
          : "";
        let postId = postContent
          ? postContent.reply.parentId
            ? postContent.reply.parentId
            : postContent.post.id
          : "";
        let childPostId = postContent
          ? postContent.post?.id
          : postContent.reply?.parentId
          ? postContent.reply.parentId
          : "";
        // dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          notification.channelName,
          notification.type,
          notification.subType,
          notification.refChannelID,
          postId,
          childPostId,
          dispatch
        );
        isActive = false;
      }
    }
  };
  function handlePostContent(refPost) {
    if (refPost.post.content === "") {
      if (refPost.fileListIDs.length > 0) {
        return `<p>${getUserName(refPost.userId)} uploads ${refPost.fileListIDs.length} files<p>`;
      }
      if (refPost.postType === "TASK") {
        return `<p>${getUserName(refPost.userId)} create a task<p>`;
      }
      if (refPost.forwardedPost.post.id !== "") {
        return `<p>${getUserName(refPost.userId)} forwarded a post<p>`;
      }
    }
    return refPost.post.content;
  }
  const renderPostContent = (post) => (
      <div className="mention-info">
        <Trans
            t={t}
            i18nKey={
              !post.isHidden &&
                post.refPostContent
                ? handlePostContent(JSON.parse(Buffer(post.refPostContent, "base64").toString("utf-8")))
                : ""
            }
        />
    </div>
  );
  return (
    <>
      {postsToRender?.length > 0 ? (
        postsToRender.map((post, index) => {
          return (
            <Fragment key={index}>
              <Dropdown.Item
                eventKey={post.id}
                className={`${
                      post.state === "UNREAD"
                      ? "active"
                      : ""
                } `}
                style={{ height: fromPanel && fromPanel ? "74px" : "58px" }}
                onClick={(event) => postClick(event, post)}
              >
                <div
                  className={`notification-wrapper ${
                    post?.isHidden && currentUserId === post.userID
                      ? "notification-text-hide"
                      : ""
                  }`}
                >
                  <span
                    className="notification-img"
                  >
                    <span className="green-dot">
                      {(post.state === "UNREAD" || post.state === "CHECKED") &&
                        post.type !== "reaction" && (
                          <Badge
                            className={classes.bageUnread}
                            variant="primary"
                          >
                            <span className="sr-only">
                              {t("discussion.summary:unread.messages")}
                            </span>
                          </Badge>
                        )}
                    </span>
                    {getUserImage(post.refUserID) ? (
                      <img
                        style={{
                          borderRadius: "100%",
                          marginTop: "2px",
                        }}
                        src={getUserImage(post.refUserID)}
                        onError={(e) => {
                          e.target.src = DefaultUser;
                        }}
                        alt=""
                        className="img-fluid"
                      />
                    ) : (
                      <div
                        style={{
                          marginTop: "2px",
                        }}
                      >
                        <DefaultAvatar
                          memberName={getUserName(post?.refUserID)}
                          memberEmail={getUserEmail(post?.refUserID)}
                        />
                      </div>
                    )}
                  </span>
                  <span className="notification-text">
                    {
                      <>
                        {fromPanel && fromPanel === true && (
                          <div className="d-flex justify-content-between">
                            <span className={classes.companyText}>
                              {post.channelName}
                            </span>
                            <TimeAgo
                              style={{ color: "#00000080", fontSize: "11px" }}
                              date={new Date(post.timestamp * 1000)}
                              formatter={formatter}
                            />
                          </div>
                        )}

                        {post.type === "channel" &&
                          !(
                            post.subType === "deleted" ||
                            post.subType === "archived" ||
                            post.subType === "removed" ||
                            post.subType === "tagged" ||
                            post.subType === "replied" ||
                            post.subType === "mentionreplied"
                          ) && (
                            <p
                              className={classes.normalText}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <UserInvite
                                className={classNames(
                                  classes.boldText,
                                  "invite-user"
                                )}
                              >
                                {getUserName(post.refUserID)}{" "}
                                <span className={classes.normalText}>
                                  {t("post:added.you")}
                                </span>
                                <span
                                  className={classes.notificationDescription}
                                >
                                  {""}
                                </span>
                              </UserInvite>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                    marginLeft: "-20px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          )}
                        {post.type === "channel" &&
                          (post.subType === "deleted" ||
                            post.subType === "removed" ||
                            post.subType === "archived") && (
                            <p className={classes.normalText}>
                              <span className={classes.boldText}>
                                {getUserName(post.refUserID)}{" "}
                                <span className={classes.normalText}>
                                  {t("post:removed.you")}
                                </span>
                              </span>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          )}
                        {post.type === "mention" && (
                          <>
                            <p
                              className={classes.normalText}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className={classes.boldText}>
                                {getUserName(post.refUserID)}
                                <span className={classes.normalText}>
                                  {" "}
                                  {t("post:mentioned.you")}
                                </span>
                              </span>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          </>
                        )}
                        {post.subType === "mentionreplied" && (
                          <>
                            <p
                              className={classes.normalText}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className={classes.boldText}>
                                {getUserName(post.refUserID)}
                                <span className={classes.normalText}>
                                  {" : "}
                                  {t("post:mentionreplied")}
                                </span>
                              </span>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          </>
                        )}
                        {post.type === "reaction" && (
                          <p
                            className={classes.normalText}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className={classes.boldText}>
                              {post?.userList?.length > 1
                                ? post.userList.length - 1 > 1
                                  ? t("notify.byManyUsers", {
                                      user: CommonUtils.getRecentUser(
                                        post.userList
                                      )?.screenName,
                                      count: post.userList.length - 1,
                                    })
                                  : t("notify.byTwoUsers", {
                                      user: CommonUtils.getRecentUser(
                                        post.userList
                                      )?.screenName,
                                      count: post.userList.length - 1,
                                    })
                                : post?.userList?.length === 1
                                ? t("notify.byUser", {
                                    user: post?.userList[0].screenName,
                                  })
                                : t("notify.byUser", {
                                    user: getUserName(post.refUserID),
                                  })}
                              {/* {getUserName(post.refUserID)} */}
                              <span className={classes.normalText}>
                                {t("notify.react", { reacted: post?.subType })}
                              </span>
                            </span>

                            {!fromPanel && (
                              <TimeAgo
                                style={{
                                  color: "#00000080",
                                  fontSize: "11px",
                                  marginLeft: "-20px",
                                }}
                                date={new Date(post.timestamp * 1000)}
                                formatter={formatter}
                              />
                            )}
                          </p>
                        )}

                        {post.subType === "replied" && (
                          <p
                            className={classes.normalText}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className={classes.boldText}>
                              {getUserName(post.refUserID)}
                              <span className={classes.normalText}>
                                {" "}
                                {t("post:replied")}
                              </span>
                            </span>

                            {!fromPanel && (
                              <TimeAgo
                                style={{ color: "#00000080", fontSize: "11px" }}
                                date={new Date(post.timestamp * 1000)}
                                formatter={formatter}
                              />
                            )}
                          </p>
                        )}
                        {post.type === "edited" && (
                          <p
                            className={classes.normalText}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className={classes.boldText}>
                              <span className={classes.normalText}>
                                ({t("added.activity")}) {t("post.edited")} By{" "}
                              </span>
                              {getUserName(post.refUserID)} <span> </span>(
                              <span className={classes.normalText}>
                                {post.companyName})
                              </span>
                            </span>
                            {!fromPanel && (
                              <TimeAgo
                                style={{ color: "#00000080", fontSize: "11px" }}
                                date={new Date(post.timestamp * 1000)}
                                formatter={formatter}
                              />
                            )}
                          </p>
                        )}

                        {post.subType === "tagged" && (
                          <p
                            className={classes.normalText}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className={classes.boldText}>
                              {getUserName(post.refUserID)}
                              <span className={classes.normalText}>
                                {" "}
                                {t("post:tagged")}
                              </span>
                            </span>
                            {!fromPanel && (
                              <TimeAgo
                                style={{
                                  color: "#00000080",
                                  fontSize: "11px",
                                  marginLeft: "-20px",
                                }}
                                date={new Date(post.timestamp * 1000)}
                                formatter={formatter}
                              />
                            )}
                          </p>
                        )}
                        {post.type === "task" && post.subType === "edited" && (
                          <p
                            className={classes.normalText}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className={classes.boldText}>
                              {getUserName(post.refUserID)}
                              <span className={classes.normalText}>
                                {" "}
                                {t("notify.task:edited")}
                              </span>
                            </span>
                            {!fromPanel && (
                              <TimeAgo
                                style={{
                                  color: "#00000080",
                                  fontSize: "11px",
                                  marginLeft: "-20px",
                                }}
                                date={new Date(post.timestamp * 1000)}
                                formatter={formatter}
                              />
                            )}
                          </p>
                        )}
                        {post.type === "task" &&
                          post.subType === "state updated" && (
                            <p
                              className={classes.normalText}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className={classes.boldText}>
                                {getUserName(post.refUserID)}
                                <span className={classes.normalText}>
                                  {" "}
                                  {t("notify.task:updated")}
                                </span>
                              </span>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                    marginLeft: "-20px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          )}
                        {post.type === "task" &&
                          post.subType !== "state updated" &&
                          post.subType !== "edited" && (
                            <p
                              className={classes.normalText}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span className={classes.boldText}>
                                {getUserName(post.refUserID)}
                                <span className={classes.normalText}>
                                  {" "}
                                  {t("notify.task:created")}
                                </span>
                              </span>
                              {!fromPanel && (
                                <TimeAgo
                                  style={{
                                    color: "#00000080",
                                    fontSize: "11px",
                                    marginLeft: "-20px",
                                  }}
                                  date={new Date(post.timestamp * 1000)}
                                  formatter={formatter}
                                />
                              )}
                            </p>
                          )}
                        {(post.type === "mention" ||
                          post.type === "reaction" ||
                          post.type === "channel" ||
                          post.subType === "replied" ||
                          post.subType === "tagged") && (
                          <span className={classes.notificationDescription}>
                            {renderPostContent(post)}
                          </span>
                        )}

                        {post.type === "task" && post.subType === "edited" && (
                          <>{renderPostContent(post)}</>
                        )}
                        {post.type === "task" &&
                          post.subType === "state updated" && (
                            <>{renderPostContent(post)}</>
                          )}
                        {post.type === "task" &&
                          post.subType !== "state updated" &&
                          post.subType !== "edited" && (
                            <>{renderPostContent(post)}</>
                          )}
                      </>
                    }
                  </span>
                </div>
              </Dropdown.Item>
              {/*<hr className={classes.borderBottom} />*/}
            </Fragment>
          );
        })
      ) : (
        <NotificationMessage />
      )}
    </>
  );
};
export default DiscussionNotificationItem;
