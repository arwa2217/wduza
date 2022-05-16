import React, { Fragment } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Post from "../post-view/post";
import { useSelector, useDispatch } from "react-redux";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import CommonUtils from "../utils/common-utils";
import { updateNotificationState } from "../../store/actions/notification-action";
import { useRef } from "react";
import { TextLink } from "../shared/styles/mainframe.style";
import {
  getNotificationData,
  cleanDashboardNotificationState,
} from "../../store/actions/user-home-actions";
const postsPerPage = 20;
let disabled = true;
let currentChannel = null;
let initCall = false;

const NotificationItem = (props) => {
  const { currKey } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const discussions = useSelector((state) => state.userHome.notificationData);
  const notificationDashCount = useSelector(
    (state) => state.userHome.notificationDashCount
  );
  const dashboardRequestOffset = useSelector(
    (state) => state.userHome.dashboardRequestOffset
  );
  const [postsToShow, setPostsToShow] = useState(0);
  const { activeSelectedChannel } = useSelector((state) => state.config);

  const activeTab = useSelector((state) => state.userHome.activeTab);

  function getTotalPosts(discussionList) {
    let count = 0;
    discussionList.map((data) => {
      count = count + (data.messages ? data.messages.length : 0);
      return data;
    });
    return count;
  }

  useEffect(() => {
    if (activeSelectedChannel?.id !== currentChannel) {
      dispatch(cleanDashboardNotificationState());
      currentChannel = activeSelectedChannel?.id;
      initCall = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSelectedChannel]);

  useEffect(() => {
    if (!initCall && activeSelectedChannel?.id === currentChannel) {
      initCall = true;
      dispatch(getNotificationData(0, 20));
    }
    setPostsToShow(discussions?.length > 0 ? getTotalPosts(discussions) : 0);
    if (
      notificationDashCount &&
      notificationDashCount > dashboardRequestOffset
    ) {
      disabled = false;
    } else {
      disabled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussions]);

  function redirectToPost(contents) {
    if (contents.state === "UNREAD") {
      dispatch(updateNotificationState(contents.id, "READ"));
    }
    let data;
    if (contents) {
      data = contents;
      if (
        data.refChannelID &&
        data.channelName &&
        data.refPostdata.post &&
        data.refPostdata.post.id
      ) {
        let postId = data
          ? data?.parentPostId
            ? data?.parentPostId
            : data?.refPostdata?.post?.id
          : "";
        let childPostId = data
          ? data?.parentPostId
            ? data?.refPostdata?.post?.id
            : ""
          : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          data.channelName,
          "notification",
          "notification",
          data.refChannelID,
          postId,
          childPostId,
          dispatch
        );
      }
    }
  }

  const handleShowMorePosts = () => {
    let type = undefined,
      subType = undefined;
    // if (activeTab === "invitation") {
    //   type = "channel"
    //   subType = "added,invited"
    // }
    if (activeTab === "invitation") {
      type = "channel";
      subType = "added,invited";
    } else if (activeTab === "mention") {
      type = "mention";
      subType = "added";
    } else if (activeTab === "reaction") {
      type = "reaction";
      subType = "+1,-1,Checked";
    } else if (activeTab === "tagged") {
      type = "channel";
      subType = "tagged";
    } else if (activeTab === "replied") {
      type = "channel";
      subType = "replied";
    }
    dispatch(
      getNotificationData(dashboardRequestOffset, postsPerPage, type, subType)
    );
  };

  const commonPostCode = (message) => {
    if (message.user === undefined)
      message.user = props.members.find((item) => item.id === message.refUserID)
        ? props.members.find((item) => item.id === message.refUserID)
        : {
            id: message.userID,
            displayName: message.userScreenName,
            userImg: message.userImage,
          };
    if (message.user?.userImg === "") message.user.userImg = message.userImage;
    return (
      <Fragment key={`key-id-${message.id}`}>
        <div
          onClick={() => {
            redirectToPost(message);
          }}
          style={{
            cursor: "pointer",
            marginBottom: "10px",
            display: "block",
            background: "#fff",
            padding: "0 0 0 10px",
          }}
        >
          <Post
            post={message?.refPostdata?.post}
            homeFlag={true}
            currentUser={currentUser}
            user={message.user}
            tagInfo={message && message.tagInfo ? message.tagInfo : []}
            reactions={message.reactions ? message.reactions : []}
            fileList={message?.refPostdata?.fileList}
            isEmbeddedLink={message?.refPostdata?.embededlink}
            embeddedLinkData={message?.refPostdata?.embeddedLinkData}
            taskInfo={message?.refPostdata?.task}
            taskStatus={message?.refPostdata?.task?.taskStatus}
            members={props.members}
            showUnRead={true}
          />
        </div>
      </Fragment>
    );
  };

  useEffect(() => {
    scrollRef.current.scrollIntoView();
  }, [currKey, scrollRef]);

  return (
    <>
      <div ref={scrollRef}></div>
      {discussions?.map((discussion, index) => {
        return (
          <Fragment key={`discussion-list-${index}`}>
            {props.tabName === "invitation" &&
              discussion?.messages?.filter(
                (item) =>
                  item.type === "channel" &&
                  (item.subType === "added" ||
                    item.subType === "removed" ||
                    item.subType === "invited") &&
                  item.subType !== "tagged" &&
                  item.subType !== "replied"
              ).length > 0 && (
                <Fragment key={`discussion-name-${discussion.channelName}`}>
                  {discussion?.messages?.length > 0 ? (
                    <div className="notification-discussion-name">
                      {discussion.channelName}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {discussion?.messages
                    ?.filter(
                      (item) =>
                        item.type === "channel" &&
                        (item.subType === "added" ||
                          item.subType === "removed" ||
                          item.subType === "invited") &&
                        item.subType !== "tagged" &&
                        item.subType !== "replied"
                    )
                    .map((message) => {
                      return (
                        <div key={`message-${message.id}`}>
                          {" "}
                          {commonPostCode(message)}
                        </div>
                      );
                    })}
                </Fragment>
              )}
            {props.tabName === "mention" &&
              discussion?.messages?.filter((item) => item.type === "mention")
                .length > 0 && (
                <Fragment key={`discussion-name-${discussion.channelName}`}>
                  {discussion?.messages?.length > 0 ? (
                    <div className="notification-discussion-name">
                      {discussion.channelName}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {discussion?.messages
                    ?.filter((item) => item.type === "mention")
                    .map((message) => {
                      return (
                        <div key={`message-${message.id}`}>
                          {commonPostCode(message)}
                        </div>
                      );
                    })}
                </Fragment>
              )}

            {props.tabName === "reaction" &&
              discussion?.messages?.filter((item) => item.type === "reaction")
                .length > 0 && (
                <Fragment key={`key-id-${discussion.channelName}`}>
                  {discussion?.messages?.length > 0 ? (
                    <div className="notification-discussion-name">
                      {discussion.channelName}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {discussion?.messages
                    ?.filter((item) => item.type === "reaction")
                    .map((message) => {
                      return (
                        <div key={`message-${message.id}`}>
                          {commonPostCode(message)}
                        </div>
                      );
                    })}
                </Fragment>
              )}

            {props.tabName === "tagged" &&
              discussion?.messages?.filter((items) => {
                return items?.subType === "tagged";
              }).length > 0 && (
                <Fragment key={`key-id-${discussion.channelName}`}>
                  {discussion?.messages?.length > 0 ? (
                    <div className="notification-discussion-name">
                      {discussion.channelName}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {discussion?.messages
                    ?.filter((items) => {
                      return items?.subType === "tagged";
                    })
                    .map((message) => {
                      return (
                        <div key={`message-${message.id}`}>
                          {commonPostCode(message)}
                        </div>
                      );
                    })}
                </Fragment>
              )}

            {props.tabName === "replied" &&
              discussion?.messages?.filter((items) => {
                return items?.subType === "replied";
              }).length > 0 && (
                <Fragment key={`key-id-${discussion.channelName}`}>
                  {discussion?.messages?.length > 0 ? (
                    <div className="notification-discussion-name">
                      {discussion.channelName}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  {discussion?.messages
                    ?.filter((items) => {
                      return items?.subType === "replied";
                    })
                    .map((message) => {
                      return (
                        <div key={`message-${message.id}`}>
                          {commonPostCode(message)}
                        </div>
                      );
                    })}
                </Fragment>
              )}

            {props.tabName === "all" && (
              <Fragment key={`key-id-${discussion.name}`}>
                {discussion?.messages?.filter(
                  (item) =>
                    item.refPostID !== "" ||
                    (item.type === "channel" &&
                      (item.subType === "removed" || item.subType === "added"))
                ).length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div> </div>
                )}

                {discussion?.messages?.map((message) => {
                  return (
                    <div key={`message-${message.id}`}>
                      {commonPostCode(message)}
                    </div>
                  );
                })}
              </Fragment>
            )}
          </Fragment>
        );
      })}

      {postsToShow > 4 && (
        <div
          className={
            "discussion-notification-footer-more " +
            (disabled ? "disabled" : "")
          }
        >
          <TextLink
            to={"#"}
            default={true}
            underline={`true`}
            small={`true`}
            strong={`true`}
            onClick={() => {
              return disabled ? undefined : handleShowMorePosts();
            }}
            className={`${disabled ? "disabled" : ""}`}
            disabled={disabled}
          >
            {t("more")}
          </TextLink>
        </div>
      )}
    </>
  );
};

export default NotificationItem;
