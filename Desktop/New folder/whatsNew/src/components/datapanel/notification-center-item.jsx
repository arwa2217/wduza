import React, { useMemo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { useDispatch, useSelector } from "react-redux";
import DefaultUser from "../../assets/icons/default-user.svg";
import { updateNotificationState } from "../../store/actions/notification-action";
import CommonUtils from "../utils/common-utils";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import { showToast } from "../../store/actions/toast-modal-actions";
import { Trans, useTranslation } from "react-i18next";
import { fetchNotificationAction } from "../../store/actions/notification-action";
import { NOTIFICATION_COUNT } from "../../constants";

const NotificationCenterItem = ({ postsToRender }) => {
  const { t } = useTranslation();
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);

  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const getUserImage = (userId) => {
    let member = globalMembers.filter((member) => member.id === userId);
    return member[0]?.userImg === "" ? DefaultUser : member[0]?.userImg;
  };

  const getUserName = (userId) => {
    let member = globalMembers.filter((member) => member.id === userId);
    return member[0]?.screenName;
  };

  const dispatch = useDispatch();
  let isActive = true;

  const postClick = (notification) => {
    let myPostContent = notification.refPostContent
      ? JSON.parse(
          Buffer(notification.refPostContent, "base64").toString("utf-8")
        )
      : "";
    if (notification.state === "UNREAD") {
      dispatch(updateNotificationState(notification.id, "READ"));
      setTimeout(() => {
        dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT));
      }, 500);
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
          ? postContent.reply.parentId
            ? postContent.post.id
            : ""
          : "";
        dispatch(requestOpenReplyPost(childPostId));
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

  const renderNotificationTime = (post) => {
    return (
      <span className="notification-time">
        {t("discussion.notification:time", {
          date: post.timestamp * 1000,
        })}
      </span>
    );
  };

  const renderPostContent = (post) => (
    <p className="mention-info">
      <Trans
        t={t}
        i18nKey={
          post.isHidden
            ? ""
            : post.refPostContent
            ? JSON.parse(
                Buffer(post.refPostContent, "base64").toString("utf-8")
              ).post.content
            : ""
        }
      />
    </p>
  );

  return (
    <>
      {postsToRender?.length > 0 ? (
        postsToRender.map((post, index) => (
          <Dropdown.Item
            eventKey={post.id}
            className={post.state === "UNREAD" && "active"}
            key={index}
            onClick={() => postClick(post)}
          >
            <div
              className={
                post?.isHidden && currentUserId === post.userID
                  ? "notification-text-hide"
                  : ""
              }
            >
              <span className="notification-img">
                <span>
                  {post.state === "UNREAD" && (
                    <Badge variant="primary">
                      <span className="sr-only">
                        {t("discussion.summary:unread.messages")}
                      </span>
                    </Badge>
                  )}
                </span>
                <img
                  style={{
                    borderRadius: "5px",
                  }}
                  src={getUserImage(post.refUserID)}
                  onError={(e) => {
                    e.target.src = DefaultUser;
                  }}
                  alt=""
                  className="img-fluid"
                />
              </span>
              <span className="notification-text">
                {
                  <>
                    {post.type === "channel" &&
                      !(
                        post.subType === "deleted" ||
                        post.subType === "archived" ||
                        post.subType === "removed" ||
                        post.subType === "replied" ||
                        post.subType === "tagged" ||
                        post.subType === "mentionreplied"
                      ) && (
                        <p>
                          <strong>{getUserName(post.refUserID)}</strong>{" "}
                          {t("post:added.you")} ({post.channelName})
                        </p>
                      )}
                    {post.type === "channel" &&
                      (post.subType === "deleted" ||
                        post.subType === "removed" ||
                        post.subType === "archived") && (
                        <p>
                          <strong>{getUserName(post.refUserID)}</strong>{" "}
                          {t("post:removed.you")} ({post.channelName})
                        </p>
                      )}
                    {post.type === "mention" && (
                      <>
                        <p>
                          <strong>{getUserName(post.refUserID)} </strong>
                          {t("post:mentioned.you")} ({post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.subType === "mentionreplied" && (
                      <>
                        <p>
                          <strong>
                            {getUserName(post.refUserID)} {" : "}{" "}
                          </strong>
                          {t("post:mentionreplied")} ({post.channelName})
                        </p>

                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.type === "reaction" && (
                      <>
                        <p>
                          <strong>
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
                          </strong>
                          {/* <strong>{getUserName(post.refUserID)} </strong>{" "} */}
                          {t("notify.react", { reacted: post?.subType })} (
                          {post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.subType === "replied" && (
                      <>
                        <p>
                          <strong>{getUserName(post.refUserID)} </strong>{" "}
                          {t("post:replied")} ({post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.subType === "tagged" && (
                      <>
                        <p>
                          <strong>{getUserName(post.refUserID)} </strong>{" "}
                          {t("post:tagged")} ({post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}

                    {post.type === "task" && post.subType === "edited" && (
                      <>
                        <p>
                          <strong>{getUserName(post.refUserID)} </strong>{" "}
                          {t("notify.task:edited")} ({post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.type === "task" && post.subType === "state updated" && (
                      <>
                        <p>
                          <strong>{getUserName(post.refUserID)} </strong>{" "}
                          {t("notify.task:updated")} ({post.channelName})
                        </p>
                        {renderNotificationTime(post)}
                        {renderPostContent(post)}
                      </>
                    )}
                    {post.type === "task" &&
                      post.subType !== "state updated" &&
                      post.subType !== "edited" && (
                        <>
                          <p>
                            <strong>{getUserName(post.refUserID)} </strong>{" "}
                            {t("notify.task:created")} ({post.channelName})
                          </p>
                          {renderNotificationTime(post)}
                          {renderPostContent(post)}
                        </>
                      )}
                  </>
                }
              </span>
            </div>
          </Dropdown.Item>
        ))
      ) : (
        <div className="d-flex flex-fill p-5">
          <div class="notification-text text-center p-5">
            <p>
              <strong>{t("post:no.updates")}</strong>
            </p>
            <p>{t("post:check.later.for.new.updates")}</p>
          </div>
        </div>
      )}
    </>
  );
};
export default NotificationCenterItem;
