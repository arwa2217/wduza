import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";
import { AuthHeader } from "../../utilities/app-preference";

import {
  FETCH_POST_SEARCH_DETAILS_REQUEST,
  FETCH_POST_SEARCH_DETAILS_SUCCESS,
  FETCH_POST_SEARCH_DETAILS_ERROR,
  FETCH_USER_TYPE,
  FETCH_USER_TYPE_ERROR,
  FETCH_USER_TYPE_SUCCESS,
  FETCH_CHANNEL_DETAILS,
  FETCH_CHANNEL_DETAILS_SUCCESS,
  FETCH_CHANNEL_DETAILS_ERROR,
  FETCH_CHANNEL_MEMBERS,
  FETCH_CHANNEL_MEMBERS_SUCCESS,
  FETCH_CHANNEL_MEMBERS_ERROR,
  GET_CHANNEL_MEMBERS_SUCCESS,
  FETCH_USER_DETAILS,
  FETCH_USER_DETAILS_ERROR,
  REMOVE_CHANNEL_MEMBER,
  REMOVE_CHANNEL_MEMBER_SUCCESS,
  REMOVE_CHANNEL_MEMBER_ERROR,
  REMOVE_CHANNEL_MEMBER_RESET,
  CREATE_CHANNEL_REQUEST,
  CREATE_CHANNEL_SUCCESS,
  CREATE_CHANNEL_ERROR,
  CREATE_CHANNEL_RESET,
  FETCH_CHANNEL_LIST_REQUEST,
  FETCH_CHANNEL_LIST_SUCCESS,
  FETCH_CHANNEL_LIST_ERROR,
  LEAVE_CHANNEL,
  LEAVE_CHANNEL_SUCCESS,
  LEAVE_CHANNEL_ERROR,
  RENAME_CHANNEL,
  RENAME_CHANNEL_SUCCESS,
  RENAME_CHANNEL_ERROR,
  DELETE_CHANNEL,
  DELETE_CHANNEL_SUCCESS,
  DELETE_CHANNEL_ERROR,
  RESET_CONTROL_FLAGS,
  INITIATED_DISCUSSION_DELETE,
  COMPLETED_DISCUSSION_DELETE,
  INITIATED_DISCUSSION_ARCHIVE,
  COMPLETED_DISCUSSION_ARCHIVE,
  ARCHIVE_CHANNEL,
  ARCHIVE_CHANNEL_SUCCESS,
  ARCHIVE_CHANNEL_ERROR,
  DELETION_STATUS,
  DELETION_STATUS_SUCCESS,
  DELETION_STATUS_ERROR,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE_SUCCESS,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE_FAILURE,
  UPDATE_CHANNEL_NOTIFICATION_FILTER,
  FETCH_POST_SEARCH_LIST_REQUEST,
  FETCH_POST_SEARCH_LIST_SUCCESS,
  FETCH_POST_SEARCH_LIST_ERROR,
  POST_SEARCH,
  FETCH_POST_SEARCH_DETAILS_CLEAR,
  FETCH_ALL_CHANNEL_MEMBERS,
  FETCH_ALL_CHANNEL_MEMBERS_SUCCESS,
  FETCH_ALL_CHANNEL_MEMBERS_ERROR,
  FETCH_USERS_PROFILE_IMAGE_ERROR,
  FETCH_USERS_PROFILE_IMAGE,
  FETCH_USERS_PROFILE_IMAGE_SUCCESS,
  RESET_NEW_UNREAD_MESSAGE_COUNT,
} from "../actionTypes/channelActionTypes";
import { MEMBER_DETAILS_SUCCESS } from "../actionTypes/member-details-action";
import ModalConstants from "../../constants/modal/modal-constants";
import { updateSummaryPanelState } from "./config-actions";
import {
  addUser,
  addUsers,
  addUsersByChannel,
  getAllUser,
  getUsersByChannelId,
  updateUsersImage,
} from "../../utilities/caching/db-helper";
import { store } from "../store";

const channelDetailAction = (channelId) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v2/channels?type=id&value=${channelId}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_CHANNEL_DETAILS,
      FETCH_CHANNEL_DETAILS_SUCCESS,
      FETCH_CHANNEL_DETAILS_ERROR,
    ],
  });

const GetChannelMemberAction = (channelId, dispatch) => {
  getAllUser().then((users) => {
    if (users && users.length > 0) {
      let data = users.map((user) => {
        return user.user;
      });
      dispatch(updateMemberData(data));
    }
  });
  getUsersByChannelId(channelId).then(
    (users) => {
      if (users && users.length > 0) {
        let data = users.map((user) => {
          return user.user;
        });
        dispatch({ type: GET_CHANNEL_MEMBERS_SUCCESS, data });
      } else {
        dispatch(FetchChannelMemberAction(channelId));
      }
    },
    (error) => {
      dispatch(FetchChannelMemberAction(channelId));
    }
  );
};

const FetchChannelMemberAction = (channelId) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/channels/ids/${channelId}/members`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_CHANNEL_MEMBERS,
      {
        type: FETCH_CHANNEL_MEMBERS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json.data && json.data.length > 0) {
                addUsersByChannel(json.data, channelId);
              }
              return {
                data: json.data,
                channelId: channelId,
              };
            });
          }
          return res;
        },
      },
      FETCH_CHANNEL_MEMBERS_ERROR,
    ],
  });

const GetAllChannelMembers = (dispatch) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/members`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_ALL_CHANNEL_MEMBERS,
      {
        type: FETCH_ALL_CHANNEL_MEMBERS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json.data && json.data.length > 0) {
                let userList = json.data;
                addUsers(userList);
                let userIdList = userList.map((user) => user.id);
                let request = {
                  users: userIdList,
                };
                dispatch(GetMembersProfileImage(request, userList, dispatch));
              }
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      FETCH_ALL_CHANNEL_MEMBERS_ERROR,
    ],
  });

const GetMembersProfileImage = (requestPayload, userList, dispatch) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v2/user/image`,
    method: API_METHODS.POST,
    body: JSON.stringify(requestPayload),
    headers: AuthHeader(),
    types: [
      FETCH_USERS_PROFILE_IMAGE,
      {
        type: FETCH_USERS_PROFILE_IMAGE_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json.data && json.data.length > 0) {
                let userImageList = json.data;
                updateUsersImage(userImageList).then((response) => {
                  getAllUser().then((users) => {
                    if (users && users.length > 0) {
                      let data = users.map((user) => {
                        return user.user;
                      });
                      dispatch(updateMemberData(data));
                    }
                  });
                });
              }

              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      FETCH_USERS_PROFILE_IMAGE_ERROR,
    ],
  });
const updateMemberData = (userList) => {
  return {
    type: MEMBER_DETAILS_SUCCESS,
    payload: { userList: [...userList] },
  };
};
const fetchUserTypeAction = (EmailIds) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/user-type?user-emails=${EmailIds}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      { type: FETCH_USER_TYPE, payload: { requestedId: EmailIds } },
      FETCH_USER_TYPE_SUCCESS,
      FETCH_USER_TYPE_ERROR,
    ],
  });

const userDetailsAction = (userId, { modalType, modalProps }) => {
  let action = createAction({
    endpoint: API_BASE_URL + `​/ent/v1/user/uids/${userId}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_USER_DETAILS,
      {
        type: ModalConstants.SHOW_MODAL,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((data) => ({
              modalType,
              modalProps: { ...modalProps, ...data },
            }));
          }
        },
      },
      FETCH_USER_DETAILS_ERROR,
    ],
  });
  return action;
};

const removeChannelMemberAction = (channelId, userId) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/channels/ids/${channelId}/members?userId=${userId}`,
    method: API_METHODS.DELETE,
    headers: AuthHeader(),
    types: [
      REMOVE_CHANNEL_MEMBER,
      REMOVE_CHANNEL_MEMBER_SUCCESS,
      REMOVE_CHANNEL_MEMBER_ERROR,
    ],
  });

const resetRemoveChannelMemberAction = () => {
  return {
    type: REMOVE_CHANNEL_MEMBER_RESET,
  };
};

const resetCreateChannelAction = () => {
  return {
    type: CREATE_CHANNEL_RESET,
  };
};

const createChannelAction = (channel, dispatch) => {
  return createAction({
    endpoint:
      API_BASE_URL + RestConstants.BASE_URL_V2 + RestConstants.DISCUSSIONBOARD,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(channel),
    types: [
      CREATE_CHANNEL_REQUEST,
      {
        type: CREATE_CHANNEL_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              let channel = json.data;
              if (channel instanceof Array) {
                channel = channel[0];
              }
              if (dispatch) {
                window.createdChannel = channel;
              }
              let GlobalMembers =
                store.getState().memberDetailsReducer.memberData;
              let channelOwner = GlobalMembers.find(
                (member) => member.id === channel.creatorId
              );
              addUser(channelOwner, channel.id).then(() => {
                GetChannelMemberAction(channel.id, dispatch);
              });
              return { data: json.data };
            });
          }
          return res;
        },
      },
      CREATE_CHANNEL_ERROR,
    ],
  });
};

const GetChannelListAction = (dispatch) => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL_V2 + RestConstants.CHANNELS,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_CHANNEL_LIST_REQUEST,
      FETCH_CHANNEL_LIST_SUCCESS,
      FETCH_CHANNEL_LIST_ERROR,
    ],
  });
};

const GetPostSearchListAction = (search, channelId) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      (channelId === undefined
        ? `post/autocomplete?q=${search}`
        : `post/autocomplete?q=${search}&channel=${channelId}`),
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_POST_SEARCH_LIST_REQUEST,
      FETCH_POST_SEARCH_LIST_SUCCESS,
      FETCH_POST_SEARCH_LIST_ERROR,
    ],
  });
};

const GetPostSearchResultAction = (searchText, count, channelId, exact) => {
  searchText = searchText.replace(/['"]+/g, "");
  searchText = encodeURIComponent(searchText);
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      `post/search?q=${searchText}&page=1&size=${count}&channel=${channelId}&exact=${exact}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_POST_SEARCH_DETAILS_REQUEST,
      FETCH_POST_SEARCH_DETAILS_SUCCESS,
      FETCH_POST_SEARCH_DETAILS_ERROR,
    ],
  });
};

const ClearPostSearchResultAction = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_POST_SEARCH_DETAILS_CLEAR });
  };
};

const PostSearchAction = (summaryPanelActive, dispatch) => {
  if (!summaryPanelActive) {
    dispatch(updateSummaryPanelState(true));
    return async () => {
      setTimeout(() => {
        dispatch({ type: POST_SEARCH });
      }, 200);
    };
  } else {
    return (dispatch) => {
      dispatch({ type: POST_SEARCH });
    };
  }
};
const leaveDiscussionAction = (channel) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channel.id +
      RestConstants.LEAVE,
    method: API_METHODS.DELETE,
    headers: AuthHeader(),
    types: [LEAVE_CHANNEL, LEAVE_CHANNEL_SUCCESS, LEAVE_CHANNEL_ERROR],
  });
};

const renameDiscussionAction = (channel, name, description) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channel.id,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify({ name: name, description: description }),
    types: [RENAME_CHANNEL, RENAME_CHANNEL_SUCCESS, RENAME_CHANNEL_ERROR],
  });
};

const deleteDiscussionAction = (channel) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channel.id,
    method: API_METHODS.DELETE,
    headers: AuthHeader(),
    types: [DELETE_CHANNEL, DELETE_CHANNEL_SUCCESS, DELETE_CHANNEL_ERROR],
  });
};

const initiateChannelDeletionStatus = (channelId) => {
  return {
    type: INITIATED_DISCUSSION_DELETE,
    payload: { channelId: channelId },
  };
};

const completedChannelDeletionStatus = (channelId) => {
  return {
    type: COMPLETED_DISCUSSION_DELETE,
    payload: { channelId: channelId },
  };
};

const filterChannelList = (channelList) => {
  return {
    type: FETCH_CHANNEL_LIST_SUCCESS,
    payload: { data: channelList },
  };
};
const archiveDiscussionAction = (channel) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.LOCK +
      RestConstants.SLASH +
      channel.id,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [ARCHIVE_CHANNEL, ARCHIVE_CHANNEL_SUCCESS, ARCHIVE_CHANNEL_ERROR],
  });
};

const resetControlFlags = () => {
  return { type: RESET_CONTROL_FLAGS };
};

const initiateChannelArchiveStatus = (channelId) => {
  return {
    type: INITIATED_DISCUSSION_ARCHIVE,
    payload: { channelId: channelId },
  };
};

const completedChannelArchiveStatus = (channelId) => {
  return {
    type: COMPLETED_DISCUSSION_ARCHIVE,
    payload: { channelId: channelId },
  };
};

const getDeletionStatus = (channelId) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channelId +
      RestConstants.STATUS,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [DELETION_STATUS, DELETION_STATUS_SUCCESS, DELETION_STATUS_ERROR],
  });
};

const updateDiscussionNotificationFilter = (
  channel,
  notificationFilter,
  dispatch
) => {
  dispatch({
    type: UPDATE_CHANNEL_NOTIFICATION_FILTER,
    payload: {
      channel: channel,
      notificationFilter: notificationFilter,
    },
  });
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL_V2 +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channel.id +
      RestConstants.MEMBERS +
      RestConstants.SLASH +
      RestConstants.NOTIFICATION_FILTER,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify({ notificationFilter: notificationFilter }),
    types: [
      DISCUSSION_NOTIFICATION_FILTER_UPDATE,
      {
        type: DISCUSSION_NOTIFICATION_FILTER_UPDATE_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                channel: channel,
                notificationFilter: notificationFilter,
              };
            });
          }
          return {
            data: res,
            channel: channel,
            notificationFilter: notificationFilter,
          };
        },
      },
      DISCUSSION_NOTIFICATION_FILTER_UPDATE_FAILURE,
    ],
  });
};

const getSearchResultWithFilter = (
  searchText,
  pageOffset,
  pageCount,
  discussionId,
  exact,
  saveFlag,
  tagFlag,
  fileFlag,
  taskFlag,
  author,
  mention,
  assignee,
  target,
  resetOffset
) => {
  var resultText = searchText;
  searchText = searchText.replace(/['"]+/g, "");
  searchText = encodeURIComponent(searchText);
  if (mention === undefined || author === undefined || assignee === undefined) {
    return {
      type: FETCH_POST_SEARCH_DETAILS_SUCCESS,
      payload: {
        data: {
          result: [],
          count: 0,
          term: resultText,
        },
      },
    };
  }
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL_V2 +
      RestConstants.POST +
      RestConstants.SLASH +
      RestConstants.SEARCH +
      RestConstants.QUERY_SEARCH_TERM +
      searchText +
      RestConstants.QUERY_PAGE +
      pageOffset +
      RestConstants.QUERY_SIZE +
      pageCount +
      (discussionId !== "" ? RestConstants.QUERY_CHANNEL + discussionId : "") +
      RestConstants.QUERY_EXACT +
      exact +
      (saveFlag === true ? RestConstants.QUERY_SAVE + saveFlag : "") +
      (tagFlag !== "all" ? RestConstants.QUERY_TAG + tagFlag : "") +
      (fileFlag !== "all" ? RestConstants.QUERY_FILE + fileFlag : "") +
      (taskFlag !== "all" ? RestConstants.QUERY_TASK + taskFlag : "") +
      (author !== "" ? RestConstants.QUERY_AUTHOR + author : "") +
      (mention !== "" ? RestConstants.QUERY_MENTIONS + mention : "") +
      (assignee !== "" && assignee !== undefined
        ? RestConstants.QUERY_ASSIGNEE + assignee
        : "") +
      (target !== "" && target !== "all" && assignee !== undefined
        ? RestConstants.QUERY_TARGET + target
        : ""),
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: FETCH_POST_SEARCH_DETAILS_REQUEST,
        payload: { pageOffset: pageOffset, resetOffset: resetOffset },
      },
      {
        type: FETCH_POST_SEARCH_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                resetOffset: resetOffset,
              };
            });
          }
          return {
            data: res,
            resetOffset: resetOffset,
          };
        },
      },
      FETCH_POST_SEARCH_DETAILS_ERROR,
    ],
  });
};

const resetNewUnreadMessageCount = (channelId) => {
  return {
    type: RESET_NEW_UNREAD_MESSAGE_COUNT,
    payload: { channelId: channelId },
  };
};

export {
  createChannelAction,
  fetchUserTypeAction,
  resetCreateChannelAction,
  GetChannelListAction,
  channelDetailAction,
  FetchChannelMemberAction,
  GetChannelMemberAction,
  userDetailsAction,
  removeChannelMemberAction,
  resetRemoveChannelMemberAction,
  leaveDiscussionAction,
  renameDiscussionAction,
  deleteDiscussionAction,
  resetControlFlags,
  initiateChannelDeletionStatus,
  completedChannelDeletionStatus,
  archiveDiscussionAction,
  initiateChannelArchiveStatus,
  completedChannelArchiveStatus,
  getDeletionStatus,
  updateDiscussionNotificationFilter,
  GetPostSearchListAction,
  GetPostSearchResultAction,
  ClearPostSearchResultAction,
  PostSearchAction,
  getSearchResultWithFilter,
  GetAllChannelMembers,
  GetMembersProfileImage,
  resetNewUnreadMessageCount,
  filterChannelList,
};
