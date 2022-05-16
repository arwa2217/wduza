import React, { useEffect, useState } from "react";
import TaskFilters from "../task-filters/task-filters";
import {
  fetchTaskDetails,
  updateSelectedFilter,
  updateSelectedAssignee,
} from "../../store/actions/task-actions";
import { useDispatch, useSelector } from "react-redux";
import { TextLink } from "../shared/styles/mainframe.style";
import { useTranslation } from "react-i18next";
import { fetchForwardDetailsById } from "../../store/actions/post-forward-action";
import SummaryPostList from "./summary-post-list";
const postsPerPage = 5;
let currentChannelId, currentEventUpdate;

const Tasks = () => {
  const { t } = useTranslation();
  const {
    channelTaskLists,
    channelTaskCount,
    eventUpdate,
    selectedFilter,
    selectedAssignee,
    showMore,
  } = useSelector((state) => state.tasksReducer);
  // const showMore = useSelector((state) => state.tagReducer.showMore);
  const [taskState, setTaskState] = useState(
    selectedFilter.length > 0 ? selectedFilter : []
  );
  const [assignee, setAssignee] = useState(
    selectedAssignee ? selectedAssignee : ""
  );
  // const [assignee, setAssignee] = useState(selectedAssignee ? selectedAssignee : "");

  const dispatch = useDispatch();
  const channelDetails = useSelector((state) => state.channelDetails);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const channelMembers = useSelector((state) => state.channelMembers.members);
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const [isForwarded, setIsForwarded] = useState(false);

  useEffect(() => {
    if (!(currentChannelId && currentChannelId === channelDetails.id)) {
      currentChannelId = channelDetails.id;
      let queryParams = {
        channelId: channelDetails.id,
        assignee: assignee,
        taskStatus: taskState,
        offset: 0,
        count: postsPerPage,
        author: assignee === "ASSIGN_BY_ME" ? true : false,
      };
      dispatch(fetchTaskDetails(queryParams));
    }
  }, [channelDetails.id]);

  useEffect(() => {
    if (
      !(currentEventUpdate && currentEventUpdate === eventUpdate) &&
      eventUpdate
    ) {
      currentEventUpdate = eventUpdate;
      let queryParams = {
        channelId: channelDetails.id,
        assignee: assignee,
        taskStatus: taskState,
        offset: 0,
        count: channelTaskLists ? channelTaskLists.length : postsPerPage,
        author: assignee === "ASSIGN_BY_ME" ? true : false,
      };
      dispatch(fetchTaskDetails(queryParams));
    }
  }, [eventUpdate]);

  const handleShowMorePosts = (e) => {
    e.preventDefault();
    if (
      !(
        channelTaskLists === null || channelTaskLists.length >= channelTaskCount
      )
    ) {
      let size = channelTaskLists ? channelTaskLists.length : 0;
      let queryParams = {
        channelId: channelDetails.id,
        taskStatus: taskState,
        assignee: assignee,
        offset: 0,
        count: size + postsPerPage,
        author: assignee === "ASSIGN_BY_ME" ? true : false,
      };
      dispatch(fetchTaskDetails(queryParams));
    }
  };

  const onFilterSelect = (selectedValue, type = "ADDED") => {
    let newTaskState = [];
    if (type === "ADDED") {
      newTaskState = [...taskState, selectedValue];
    } else {
      newTaskState = [...taskState];
      let index = newTaskState.indexOf(selectedValue);
      newTaskState.splice(index, 1);
    }

    setTaskState(newTaskState);
    let requestBody = {
      taskStatus: newTaskState,
      channelId: channelDetails.id,
      assignee: assignee,
      offset: 0,
      count: postsPerPage,
      author: assignee === "ASSIGN_BY_ME" ? true : false,
    };
    dispatch(updateSelectedFilter(newTaskState));
    dispatch(fetchTaskDetails(requestBody));
  };

  const onAssigneeSelect = (assignee) => {
    setAssignee(
      assignee === "ASSIGN_ME" && assignee !== undefined ? currentUser?.id : ""
    );
    let requestBody = {
      taskStatus: taskState,
      channelId: channelDetails.id,
      assignee:
        assignee === "ASSIGN_ME" && assignee !== undefined
          ? currentUser?.id
          : "",
      offset: 0,
      count: postsPerPage,
      author: assignee === "ASSIGN_BY_ME" ? true : false,
    };
    dispatch(updateSelectedAssignee(assignee));
    dispatch(fetchTaskDetails(requestBody));
  };
  const onAssignByMeSelect = (assignee) => {
    let isAuthor = false;
    if (assignee === "ASSIGN_BY_ME") {
      isAuthor = true;
    }
    let requestBody = {
      taskStatus: taskState,
      channelId: channelDetails.id,
      //assignee: assignee === "ASSIGN_ME" ? currentUser?.id : "",
      offset: 0,
      count: postsPerPage,
      author: (isAuthor = assignee === "ASSIGN_BY_ME" ? true : false),
    };
    dispatch(updateSelectedAssignee(assignee));
    dispatch(fetchTaskDetails(requestBody));
  };

  return (
    <div
      className="sidebar-container-wrapper w-100 border-top"
      style={{ minHeight: "340px" }}
    >
      <TaskFilters
        handleClick={onFilterSelect}
        handleAssignee={onAssigneeSelect}
        handleAssignByMe={onAssignByMeSelect}
        selectedValue={taskState}
        selectedAssignee={assignee}
      />

      {channelTaskLists ? (
        channelTaskLists.length > 0 ? (
          <>
            {channelTaskLists.map((post) => {
              let assigneeUser = channelMembers?.filter(
                (member) => member.id === post.task.taskAssignee
              );

              let postAuthor = channelMembers?.filter(
                (member) => member.id === post.userId
              )[0]?.screenName;
              let currentUserIdFlag = currentUserId === post.userId;
              if (post?.fwd_post_id && post?.channel_id) {
                dispatch(
                  fetchForwardDetailsById({
                    postId: post.fwd_post_id,
                    channelId: post.channel_id,
                  })
                );
              }
              return (
                <SummaryPostList
                  blockType={"TASKS"}
                  el={post}
                  currentUserIdFlag={currentUserIdFlag}
                  postAuthor={postAuthor}
                  postContent={post}
                  assigneeUser={assigneeUser}
                  isForwarded={isForwarded}
                  key={`summary-item-${post.post_id}`}
                />
              );
            })}
          </>
        ) : (
          <div className="w-100 text-center no-data">
            <h5 className="w-100 text-center mt-4">{t("file:loading")}</h5>
          </div>
        )
      ) : (
        <div className="w-100 text-center no-data">
          <h5>{t("file:no.updates")}</h5>
          <p>{t("file:task:task.no.data")}</p>
        </div>
      )}

      {showMore && (
        <div className="col-12 p-0 pt-3 text-center">
          <TextLink
            to="#"
            default={true}
            underline={`true`}
            small={`true`}
            onClick={handleShowMorePosts}
            // disabled={
            //   channelTaskLists === null ||
            //   channelTaskLists.length >= channelTaskCount
            // }
          >
            {t("more")}
          </TextLink>
        </div>
      )}
    </div>
  );
};

export default Tasks;
