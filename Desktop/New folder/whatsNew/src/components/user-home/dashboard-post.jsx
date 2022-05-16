import React, { Fragment, useState, useEffect, useRef } from "react";
import { TextLink } from "../shared/styles/mainframe.style";
import { useTranslation } from "react-i18next";
import Post from "../post-view/post";
import { useSelector, useDispatch } from "react-redux";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import CommonUtils from "../utils/common-utils";
import {
  getDashboardPostData,
  cleanDashboardTaggedPostState,
} from "../../store/actions/user-home-actions";

const postsPerPage = 20;
let disabled = true;
let currentChannel = null;
let initCall = false;

const DashboardPostItem = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currKey } = props;
  const scrollRef = useRef();
  const activeTab = useSelector((state) => state.userHome.activeTab);
  const dashboardTaggedPostOffset = useSelector(
    (state) => state.userHome.dashboardTaggedPostOffset
  );
  const taggedPostDashCount = useSelector(
    (state) => state.userHome.taggedPostDashCount
  );
  const { activeSelectedChannel } = useSelector((state) => state.config);
  const [postsToShow, setPostsToShow] = useState(0);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);

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
      dispatch(cleanDashboardTaggedPostState());
      currentChannel = activeSelectedChannel?.id;
      initCall = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSelectedChannel]);

  useEffect(() => {
    if (!initCall && activeSelectedChannel?.id === currentChannel) {
      initCall = true;
      dispatch(getDashboardPostData(0, 20));
    }
    setPostsToShow(
      props.discussions?.length > 0 ? getTotalPosts(props.discussions) : 0
    );
    if (
      taggedPostDashCount &&
      taggedPostDashCount > dashboardTaggedPostOffset
    ) {
      disabled = false;
    } else {
      disabled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.discussions]);

  useEffect(() => {
    scrollRef.current.scrollIntoView();
  }, [currKey, scrollRef]);

  function redirectToPost(contents) {
    let data;
    if (contents) {
      data = contents;
      if (data.channelId && data.channelName && data.post && data.post.id) {
        let postId = data
          ? data?.parentId
            ? data?.parentId
            : data?.post?.id
          : "";
        let childPostId = data ? (data?.parentId ? data?.post?.id : "") : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          data.channelName,
          "saves",
          "saves",
          data.channelId,
          postId,
          childPostId,
          dispatch
        );
      }
    }
  }

  const handleShowMorePosts = () => {
    let tag_name = undefined;
    if (activeTab === "decision") {
      tag_name = "DECISION";
    } else if (activeTab === "important") {
      tag_name = "IMPORTANT";
    } else if (activeTab === "question") {
      tag_name = "QUESTION";
    } else if (activeTab === "follow-up") {
      tag_name = "FOLLOW-UP";
    }

    dispatch(
      getDashboardPostData(dashboardTaggedPostOffset, postsPerPage, tag_name)
    );
  };

  const commonTaggedPostCode = (message) => {
    return (
      <Fragment key={message.id}>
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
            tagInfo={message && message.tagInfo ? message.tagInfo : []}
            post={message?.post}
            homeFlag={true}
            currentUser={currentUser}
            user={message.user}
            reactions={message.reactions ? message.reactions : []}
            fileList={message?.fileList}
            isEmbeddedLink={message?.embededlink}
            embeddedLinkData={message?.embeddedLinkData}
            taskInfo={message?.task}
            taskStatus={message?.task.taskStatus}
            members={globalMembers}
            isHomeTab={true}
          />
        </div>
      </Fragment>
    );
  };

  return (
    <div>
      <div ref={scrollRef}></div>
      {props.discussions?.map((discussion, index) => {
        return (
          <Fragment key={`discussion-list-${index}`}>
            {props.tabName === "decision" && discussion?.messages?.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) =>
                    item.tagInfo &&
                    item.tagInfo.length &&
                    item.tagInfo[0].tagName === "DECISION"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter(
                    (item) =>
                      item.tagInfo &&
                      item.tagInfo.length &&
                      item.tagInfo[0].tagName === "DECISION"
                  )
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTaggedPostCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}
            {props.tabName === "question" && discussion?.messages?.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) =>
                    item.tagInfo &&
                    item.tagInfo.length &&
                    item.tagInfo[0].tagName === "QUESTION"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter(
                    (item) =>
                      item.tagInfo &&
                      item.tagInfo.length &&
                      item.tagInfo[0].tagName === "QUESTION"
                  )
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTaggedPostCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "follow-up" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) =>
                    item.tagInfo &&
                    item.tagInfo.length &&
                    item.tagInfo[0].tagName === "FOLLOW-UP"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter(
                    (item) =>
                      item.tagInfo &&
                      item.tagInfo.length &&
                      item.tagInfo[0].tagName === "FOLLOW-UP"
                  )
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTaggedPostCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}
            {props.tabName === "important" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) =>
                    item.tagInfo &&
                    item.tagInfo.length &&
                    item.tagInfo[0].tagName === "IMPORTANT"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter(
                    (item) =>
                      item.tagInfo &&
                      item.tagInfo.length &&
                      item.tagInfo[0].tagName === "IMPORTANT"
                  )
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTaggedPostCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "all" && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages?.map((message) => {
                  return (
                    <div key={`message-${message.id}`}>
                      {commonTaggedPostCode(message)}
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
    </div>
  );
};

export default DashboardPostItem;
