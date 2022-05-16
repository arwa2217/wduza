import React, { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Post from "../post-view/post";
import { useSelector, useDispatch } from "react-redux";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import CommonUtils from "../utils/common-utils";
import {
  getDashboardTasksData,
  cleanDashboardTaskPostState,
} from "../../store/actions/user-home-actions";
import { TextLink } from "../shared/styles/mainframe.style";

const postsPerPage = 20;
let disabled = true;
let currentChannel = null;
let initCall = false;

const DashboardTaskItem = (props) => {
  const { currKey } = props;
  const scrollRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const dashboardTaskData = useSelector(
    (state) => state.userHome.dashboardTaskData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const dashboardTaskPostOffset = useSelector(
    (state) => state.userHome.dashboardTaskPostOffset
  );
  const taskPostDashCount = useSelector(
    (state) => state.userHome.taskPostDashCount
  );
  const { activeSelectedChannel } = useSelector((state) => state.config);
  const activeTab = useSelector((state) => state.userHome.activeTab);

  const [postsToShow, setPostsToShow] = useState(0);

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
      dispatch(cleanDashboardTaskPostState());
      currentChannel = activeSelectedChannel?.id;
      initCall = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSelectedChannel]);

  useEffect(() => {
    if (!initCall && activeSelectedChannel?.id === currentChannel) {
      initCall = true;
      dispatch(getDashboardTasksData(0, 20));
    }
    setPostsToShow(
      dashboardTaskData?.length > 0 ? getTotalPosts(dashboardTaskData) : 0
    );
    if (taskPostDashCount && taskPostDashCount > dashboardTaskPostOffset) {
      disabled = false;
    } else {
      disabled = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardTaskData]);

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
    let task_type = undefined;

    if (activeTab === "todo") {
      task_type = "TODO";
    } else if (activeTab === "assigned") {
      task_type = "ASSIGN";
    } else if (activeTab === "in-progress") {
      task_type = "INPROGRESS";
    } else if (activeTab === "pending") {
      task_type = "PENDING";
    } else if (activeTab === "done") {
      task_type = "DONE";
    } else if (activeTab === "cancelled") {
      task_type = "CANCELED";
    }

    dispatch(
      getDashboardTasksData(dashboardTaskPostOffset, postsPerPage, task_type)
    );
  };

  const commonTasksCode = (message) => {
    return (
      <Fragment>
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
      {dashboardTaskData?.map((discussion, index) => {
        return (
          <Fragment key={`discussion-list-${index}`}>
            {props.tabName === "to-do" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "TODO"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "TODO")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "assigned" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "ASSIGN"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "ASSIGN")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "inProgress" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "INPROGRESS"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "INPROGRESS")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "done" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "DONE"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "DONE")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}
            {props.tabName === "cancelled" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "CANCELED"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "CANCELED")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
                      </div>
                    );
                  })}
              </Fragment>
            )}

            {props.tabName === "pending" && discussion?.messages.length > 0 && (
              <Fragment key={`discussion-name-${discussion.id}`}>
                {discussion?.messages?.filter(
                  (item) => item.task.askStatus === "PENDING"
                )?.length > 0 ? (
                  <div className="notification-discussion-name">
                    {discussion.channelName}
                  </div>
                ) : (
                  <div></div>
                )}
                {discussion?.messages
                  ?.filter((item) => item.task.taskStatus === "PENDING")
                  .map((message) => {
                    return (
                      <div key={`message-${message.id}`}>
                        {commonTasksCode(message)}
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
                      {commonTasksCode(message)}
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

export default DashboardTaskItem;
