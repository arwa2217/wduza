import {
  FETCH_EMBEDDED_LINK_ERROR,
  FETCH_EMBEDDED_LINK_REQUEST,
  FETCH_EMBEDDED_LINK_SUCCESS,
  RESET_EMBEDDED_LINK_DATA,
} from "../actionTypes/channelMessagesTypes";
import {
  GET_DASHBOARD_DATA,
  GET_DASHBOARD_DATA_SUCCESS,
  GET_DASHBOARD_DATA_FAILURE,
  GET_NOTIFICATION_DATA,
  GET_NOTIFICATION_DATA_SUCCESS,
  GET_NOTIFICATION_DATA_FAILURE,
  GET_DASHBOARD_POST_DATA,
  GET_DASHBOARD_POST_DATA_SUCCESS,
  GET_DASHBOARD_POST_DATA_FAILURE,
  GET_DASHBOARD_TASK_DATA,
  GET_DASHBOARD_TASK_DATA_SUCCESS,
  GET_DASHBOARD_TASK_DATA_FAILURE,
  CLEAN_DASHBOARD_NOTIFICATION,
  RESET_HOME_NOTIFICATION_DATA,
  RESET_HOME_TAGGED_POST_DATA,
  CLEAN_DASHBOARD_TAGGED_POSTS,
  RESET_HOME_TASK_DATA,
  CLEAN_DASHBOARD_TASK_POSTS,
} from "../actionTypes/user-home-action-types";

const initialState = {
  dashboardCount: { notificationCount: 0, taggedPostCount: 0, taskCount: 0 },
  fetchingDashboard: false,
  fetchedDashBoard: false,
  fetchingNotification: false,
  fetchedNotification: false,
  fetchingDashboardPost: false,
  fetchedDashBoardPost: false,
  fetchingDashboardTask: false,
  fetchedDashBoardTask: false,
  showMore: false,
  dashboardRequestOffset: 0,
  dashboardTaggedPostOffset: 0,
  discussionNotificationList: [],
  dashboardTaggedPostList: [],
  activeTab: "all",
};
const getDiscussionListNotification = (oldList, newList, sort) => {
  let resultList = [];
  resultList = oldList?.slice();

  newList &&
    newList.length > 0 &&
    newList.map((element) => {
      let exists = false;
      if (
        // eslint-disable-next-line array-callback-return
        resultList.map((data) => {
          if (data.id === element.id) {
            exists = true;
          }
        })
      )
        if (!exists) {
          resultList.push(element);
        }
      return true;
    });
  if (sort && resultList && resultList.length > 0) {
    resultList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  return resultList;
};

function groupBy(collection, property) {
  var i = 0,
    val,
    index,
    values = [],
    result = [];
  for (; i < collection?.length; i++) {
    val = collection[i][property];
    index = values.indexOf(val);
    if (index > -1) result[index] = [...result[index], collection[i]];
    else {
      values.push(val);
      result.push([collection[i]]);
    }
  }
  let final = [];
  for (var j = 0; j < values.length; j++) {
    final.push({ channelName: values[j], messages: result[j] });
  }
  return final;
}

const updateEmbeddedLinkInfo = (stateDashboardPostData, payload) => {
  if (
    stateDashboardPostData === undefined ||
    stateDashboardPostData.length === 0
  ) {
    return stateDashboardPostData;
  }
  let dashboardPostData = stateDashboardPostData.slice();
  dashboardPostData.map((currentMessages) => {
    currentMessages &&
      currentMessages.messages.map((message) => {
        if (message.post.id === payload.data?.post_id) {
          if (message.embeddedLinkData) {
            if (
              message.embeddedLinkData.findIndex(
                (linkData) => linkData.imageId === payload.data.imageId
              ) === -1
            ) {
              message.embeddedLinkData.push(payload.data);
            }
          } else {
            message.embeddedLinkData = [];
            message.embeddedLinkData.push(payload.data);
          }
        }
        if (message.forwardedPost?.post?.id === payload.data?.post_id) {
          if (message.embeddedLinkData) {
            if (
              message.forwardedPost?.embeddedLinkData?.findIndex(
                (linkData) => linkData.imageId === payload.data.imageId
              ) === -1
            ) {
              message.forwardedPost.embeddedLinkData.push(payload.data);
            }
          } else {
            message.forwardedPost.embeddedLinkData = [];
            message.forwardedPost.embeddedLinkData.push(payload.data);
          }
        }

        return message;
      });
    return currentMessages;
  });
  return dashboardPostData;
};
const resetEmbeddedLinkInfo = (stateDashboardPostData, payload) => {
  if (
    stateDashboardPostData === undefined ||
    stateDashboardPostData.length === 0
  ) {
    return stateDashboardPostData;
  }
  let dashboardPostData = stateDashboardPostData.slice();

  dashboardPostData.map((currentMessages) => {
    currentMessages &&
      currentMessages.messages.map((message) => {
        if (message.post.id === payload.postId) {
          message.embeddedLinkData = undefined;
        }
        return message;
      });
    return currentMessages;
  });

  return dashboardPostData;
};

const userHomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_DATA:
      return {
        ...state,
        fetchingDashboard: true,
      };
    case GET_DASHBOARD_DATA_SUCCESS:
      return {
        ...state,
        dashboardCount: {
          ...state.dashboardCount,
          notificationCount: action.payload?.data?.notifications,
          taggedPostCount: action.payload?.data?.post,
          taskCount: action.payload?.data?.task,
        },
        fetchingDashboard: false,
        fetchedDashBoard: true,
      };
    case GET_DASHBOARD_DATA_FAILURE:
      return {
        ...state,
        fetchingDashboard: false,
        fetchedDashBoard: false,
      };
    case GET_NOTIFICATION_DATA:
      return {
        ...state,
        fetchingNotification: true,
      };

    case GET_NOTIFICATION_DATA_SUCCESS: {
      let discussionNotificationList = [];
      discussionNotificationList = state.discussionNotificationList;
      discussionNotificationList = getDiscussionListNotification(
        discussionNotificationList,
        action.payload?.data?.result,
        true
      );
      let discussionRequestOffset = discussionNotificationList?.length;

      let allCount = 0;
      let invitationCount = 0;
      let mentionCount = 0;
      let reactionCount = 0;
      let taggedCount = 0;
      let repliedCount = 0;
      action.payload.data?.subCount &&
        action.payload.data.subCount.forEach((items) => {
          if (items.type === "reaction") {
            reactionCount += items.count;
          } else if (items.type === "mention") {
            mentionCount += items.count;
          } else if (items?.subType === "tagged") {
            taggedCount += items.count;
          } else if (
            items.type === "channel" &&
            (items.subType === "added" ||
              items.subType === "removed" ||
              items.subType === "invited") &&
            items.subType !== "tagged" &&
            items.subType !== "replied"
          ) {
            invitationCount += items.count;
          }
          allCount += items.count;
        });

      let count = 0;
      if (state.activeTab === "invitation") {
        count = invitationCount;
      } else if (state.activeTab === "reaction") {
        count = reactionCount;
      } else if (state.activeTab === "mention") {
        count = mentionCount;
      } else if (state.activeTab === "tagged") {
        count = taggedCount;
      } else if (state.activeTab === "replied") {
        count = repliedCount;
      } else {
        count = allCount;
      }

      let modifyNotificationData = groupBy(
        discussionNotificationList,
        "channelName"
      );

      return {
        ...state,
        notificationData: modifyNotificationData,
        fetchingNotification: false,
        fetchedNotification: true,
        notificationDashCount: count,
        discussionNotificationList: discussionNotificationList,
        dashboardRequestOffset: discussionRequestOffset,
        subCount: action.payload.data?.subCount,
      };
    }
    case CLEAN_DASHBOARD_NOTIFICATION: {
      return {
        ...state,
        discussionNotificationList: [],
        notificationDashCount: 0,
        dashboardRequestOffset: 0,
      };
    }
    case CLEAN_DASHBOARD_TAGGED_POSTS: {
      return {
        ...state,
        dashboardTaggedPostList: [],
        taggedPostDashCount: 0,
        dashboardTaggedPostOffset: 0,
      };
    }

    case CLEAN_DASHBOARD_TASK_POSTS: {
      return {
        ...state,
        dashboardTaskPostList: [],
        taskPostDashCount: 0,
        dashboardTaskPostOffset: 0,
      };
    }
    case RESET_HOME_NOTIFICATION_DATA: {
      return {
        ...state,
        activeTab: action.payload.activeTab,
        discussionNotificationList: [],
        notificationDashCount: 0,
        dashboardRequestOffset: 0,
      };
    }
    case RESET_HOME_TAGGED_POST_DATA: {
      return {
        ...state,
        activeTab: action.payload.activeTab,
        dashboardTaggedPostList: [],
        taggedPostDashCount: 0,
        dashboardTaggedPostOffset: 0,
      };
    }
    case RESET_HOME_TASK_DATA: {
      return {
        ...state,
        activeTab: action.payload.activeTab,
        dashboardTaskPostList: [],
        taskPostDashCount: 0,
        dashboardTaskPostOffset: 0,
      };
    }

    case GET_NOTIFICATION_DATA_FAILURE:
      return {
        ...state,
        fetchingNotification: false,
        fetchedNotification: false,
      };
    case GET_DASHBOARD_POST_DATA:
      return {
        ...state,
        fetchingDashboardPost: true,
      };

    case GET_DASHBOARD_POST_DATA_SUCCESS: {
      action.payload.data &&
        action.payload.data.result &&
        action.payload.data.result.length > 0 &&
        action.payload.data.result.sort(
          (a, b) => parseFloat(b.updatedAt) - parseFloat(a.updatedAt)
        );

      let dashboardTaggedPostList = [];
      dashboardTaggedPostList = state.dashboardTaggedPostList;
      dashboardTaggedPostList = getDiscussionListNotification(
        dashboardTaggedPostList,
        action.payload?.data?.result,
        true
      );
      let dashboardTaggedPostOffset = dashboardTaggedPostList?.length;
      let allCount = 0;
      let decisionCount = 0;
      let questionCount = 0;
      let followUpCount = 0;
      let importantCount = 0;
      action.payload.data?.subCount &&
        action.payload.data.subCount.forEach((item) => {
          if (item.tag_name === "DECISION") {
            decisionCount += item.count;
          } else if (item.tag_name === "QUESTION") {
            questionCount += item.count;
          } else if (item.tag_name === "FOLLOW-UP") {
            followUpCount += item.count;
          } else if (item.tag_name === "IMPORTANT") {
            importantCount += item.count;
          }
          allCount += item.count;
        });
      let count = 0;
      if (state.activeTab === "decision") {
        count = decisionCount;
      } else if (state.activeTab === "question") {
        count = questionCount;
      } else if (state.activeTab === "follow-up") {
        count = followUpCount;
      } else if (state.activeTab === "important") {
        count = importantCount;
      } else {
        count = allCount;
      }
      let taggedPostModifiedData = groupBy(
        dashboardTaggedPostList,
        "channelName"
      );
      return {
        ...state,
        dashboardPostData: taggedPostModifiedData,
        fetchingDashboardPost: false,
        fetchedDashboardPost: true,
        taggedPostDashCount: count,
        dashboardTaggedPostList: dashboardTaggedPostList,
        dashboardTaggedPostOffset: dashboardTaggedPostOffset,
        subCount: action.payload.data?.subCount,
      };
    }
    case GET_DASHBOARD_POST_DATA_FAILURE:
      return {
        ...state,
        fetchingDashboardPost: false,
        fetchedDashBoardPost: false,
      };

    case FETCH_EMBEDDED_LINK_REQUEST: {
      return {
        ...state,
        fetchingEmbeddedData: true,
        fetchedEmbeddedData: false,
        fetchingEmbeddedDataError: false,
      };
    }
    case FETCH_EMBEDDED_LINK_SUCCESS: {
      let stateDashboardPostData = state.dashboardPostData;
      return {
        ...state,
        fetchingEmbeddedData: false,
        fetchedEmbeddedData: true,
        fetchingEmbeddedDataError: false,
        dashboardPostData: updateEmbeddedLinkInfo(
          stateDashboardPostData,
          action.payload
        ),
      };
    }
    case FETCH_EMBEDDED_LINK_ERROR: {
      let stateDashboardPostData = state.dashboardPostData;
      return {
        ...state,
        fetchingEmbeddedData: false,
        fetchedEmbeddedData: true,
        fetchingEmbeddedDataError: true,
        dashboardPostData: updateEmbeddedLinkInfo(
          stateDashboardPostData,
          action.payload
        ),
      };
    }
    case RESET_EMBEDDED_LINK_DATA: {
      let stateDashboardPostData = state.dashboardPostData;
      return {
        ...state,
        dashboardPostData: resetEmbeddedLinkInfo(
          stateDashboardPostData,
          action.payload
        ),
      };
    }
    case GET_DASHBOARD_TASK_DATA:
      return {
        ...state,
        fetchingDashboardTask: true,
      };

    case GET_DASHBOARD_TASK_DATA_SUCCESS: {
      action.payload.data &&
        action.payload.data.result &&
        action.payload.data.result.length > 0 &&
        action.payload.data.result.sort(
          (a, b) => parseFloat(b.updatedAt) - parseFloat(a.updatedAt)
        );
      let dashboardTaskPostList = [];
      dashboardTaskPostList = state.dashboardTaskPostList;
      dashboardTaskPostList = getDiscussionListNotification(
        dashboardTaskPostList,
        action.payload?.data?.result,
        true
      );
      let dashboardTaskPostOffset = dashboardTaskPostList?.length;
      let allCount = 0;
      let assignTaskCount = 0;
      let toDoTaskCount = 0;
      let inProgressTask = 0;
      let pendingTask = 0;
      let doneTask = 0;
      let cancelledtTask = 0;
      action.payload.data &&
        action.payload.data.subCount &&
        action.payload.data.subCount.length > 0 &&
        action.payload.data.subCount.forEach((item) => {
          if (item.taskStatus === "ASSIGN") {
            assignTaskCount += item.count;
          } else if (item.taskStatus === "TODO") {
            toDoTaskCount += item.count;
          } else if (item.taskStatus === "INPROGRESS") {
            inProgressTask += item.count;
          } else if (item.taskStatus === "PENDING") {
            pendingTask += item.count;
          } else if (item.taskStatus === "DONE") {
            doneTask += item.count;
          } else if (item.taskStatus === "CANCELED") {
            cancelledtTask += item.count;
          }
          allCount += item.count;
        });
      let count = 0;
      if (state.activeTab === "todo") {
        count = toDoTaskCount;
      } else if (state.activeTab === "assigned") {
        count = assignTaskCount;
      } else if (state.activeTab === "in-progress") {
        count = inProgressTask;
      } else if (state.activeTab === "pending") {
        count = pendingTask;
      } else if (state.activeTab === "done") {
        count = doneTask;
      } else if (state.activeTab === "cancelled") {
        count = cancelledtTask;
      } else {
        count = allCount;
      }
      let taskPostModifiedData = groupBy(dashboardTaskPostList, "channelName");
      return {
        ...state,
        dashboardTaskData: taskPostModifiedData,
        fetchingDashboardTask: false,
        fetchedDashboardTask: true,
        dashboardTaskPostOffset: dashboardTaskPostOffset,
        dashboardTaskPostList: dashboardTaskPostList,
        taskPostDashCount: count,
        subCount: action.payload.data?.subCount,
      };
    }
    case GET_DASHBOARD_TASK_DATA_FAILURE:
      return {
        ...state,
        fetchingDashboardTask: false,
        fetchedDashBoardTask: false,
      };
    default:
      return state;
  }
};

export default userHomeReducer;
