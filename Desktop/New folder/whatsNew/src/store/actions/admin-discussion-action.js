import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import RestConstants from "../../constants/rest/rest-constants";

import { API_BASE_URL } from "../../constants";
import {
  FETCH_DISCUSSION_LIST_REQUEST,
  FETCH_DISCUSSION_LIST_SUCCESS,
  FETCH_DISCUSSION_LIST_ERROR,
  FETCH_DISCUSSION_SEARCH_DETAILS_REQUEST,
  FETCH_DISCUSSION_SEARCH_DETAILS_SUCCESS,
  FETCH_DISCUSSION_SEARCH_DETAILS_ERROR,
  FETCH_SEARCH_DISCUSSIONS_DETAILS_CLEAR,
  CLEAR_SEARCH_DISCUSSIONS_RESULT,
  FETCH_DISCUSSION_HISTORY_LIST_REQUEST,
  FETCH_DISCUSSION_HISTORY_LIST_SUCCESS,
  FETCH_DISCUSSION_HISTORY_LIST_ERROR,
  FETCH_DISCUSSION_INFORMATION_REQUEST,
  FETCH_DISCUSSION_INFORMATION_SUCCESS,
  FETCH_DISCUSSION_INFORMATION_ERROR,
  SET_SELECTED_DISCUSSIONS,
  FETCH_DISCUSSION_MEMBERS_LIST_REQUEST,
  FETCH_DISCUSSION_MEMBERS_LIST_SUCCESS,
  FETCH_DISCUSSION_MEMBERS_LIST_ERROR,
  ADD_DISCUSSION_MEMBER_REQUEST,
  ADD_DISCUSSION_MEMBER_SUCCESS,
  ADD_DISCUSSION_MEMBER_ERROR,
  CHANGE_OWNER_REQUEST,
  CHANGE_OWNER_SUCCESS,
  CHANGE_OWNER_ERROR,
  ADMIN_DELETE_DISCUSSION_REQUEST,
  ADMIN_DELETE_DISCUSSION_SUCCESS,
  ADMIN_DELETE_DISCUSSION_ERROR,
  UPDATE_DISCUSSION_INFORMATION_REQUEST,
  UPDATE_DISCUSSION_INFORMATION_SUCCESS,
  UPDATE_DISCUSSION_INFORMATION_ERROR,
  SET_DISCUSSION_SEARCH_QUERY,
  REMOVE_DISCUSSION_MEMBER,
  REMOVE_DISCUSSION_MEMBER_SUCCESS,
  REMOVE_DISCUSSION_MEMBER_ERROR,
  REMOVE_DISCUSSION_MEMBER_RESET,
} from "../actionTypes/admin-discussion-action-types";

export const fetchDiscussionData = (postObj) => {
  let obj = { ...postObj };
  let queryString = "";
  if (obj) {
    delete obj.page;
    delete obj.size;
    queryString =
      "?" +
      Object.keys(obj)
        .filter((key) => (obj[key] || key === "q" ? key : ""))
        .map((key) => key + "=" + obj[key])
        .join("&");
  }
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels${queryString}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_DISCUSSION_LIST_REQUEST,
      {
        type: FETCH_DISCUSSION_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      FETCH_DISCUSSION_LIST_ERROR,
    ],
  });
};
export const getSearchResultWithDiscussion = (requestBody) => {
  let { value,
    authorValue,
    emailValue,
    advanced,
    status,
    orderby,
    order } = {
    ...requestBody
  }

  var resultText = value;
  value = value?.toString().replace(/['"]+/g, "");
  value = encodeURIComponent(value);
  // if (email === undefined || author === undefined) {
  //   return {
  //     type: FETCH_DISCUSSION_SEARCH_DETAILS_SUCCESS,
  //     payload: {
  //       data: {
  //         result: [],
  //         count: 0,
  //         term: resultText,
  //       },
  //     },
  //   };
  // }
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.QUERY_ADMIN +
      RestConstants.SLASH +
      RestConstants.QUERY_DISCUSSIONS +
      RestConstants.QUERY_SEARCH_TERM +
      value +
      (authorValue !== "" ? RestConstants.QUERY_OWNER + authorValue : "") +
      (emailValue !== "" ? RestConstants.QUERY_EMAIL + emailValue : "") +
      (advanced !== "" ? RestConstants.QUERY_ADVANCED + advanced : "") +
      (status !== "all" ? RestConstants.QUERY_STATUSTYPE + status : "") +
      (orderby !== ""
        ? orderby !== "all"
          ? RestConstants.QUERY_SORT + orderby
          : ""
        : "") +
      (order !== "" ? RestConstants.QUERY_ORDER + order : ""),
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: FETCH_DISCUSSION_SEARCH_DETAILS_REQUEST,
        payload: { pageOffset: "10" },
      },
      {
        type: FETCH_DISCUSSION_SEARCH_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                searchFilterObject: {
                  value: resultText,
                  authorValue,
                  emailValue,
                  advanced,
                  status,
                  orderby,
                  order,
                },
              };
            });
          }
          return res;
        },
      },
      FETCH_DISCUSSION_SEARCH_DETAILS_ERROR,
    ],
  });
};
export const ClearDiscussionSearchResultAction = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_SEARCH_DISCUSSIONS_DETAILS_CLEAR });
  };
};
export const clearSearchFields = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_SEARCH_DISCUSSIONS_RESULT });
  };
};
export const fetchDiscussionHistoryListData = (channelId) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/admin/channels/ids/${channelId}/history?offset=0&count=10`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_DISCUSSION_HISTORY_LIST_REQUEST,
      {
        type: FETCH_DISCUSSION_HISTORY_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      FETCH_DISCUSSION_HISTORY_LIST_ERROR,
    ],
  });
};
export const fetchDiscussionInformationData = (channelId) => {
  return createAction({
    endpoint: API_BASE_URL + `ent/v1/admin/channels/ids/${channelId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_DISCUSSION_INFORMATION_REQUEST,
      {
        type: FETCH_DISCUSSION_INFORMATION_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      FETCH_DISCUSSION_INFORMATION_ERROR,
    ],
  });
};

export const setSelectedDiscussions = (data) => {
  return {
    type: SET_SELECTED_DISCUSSIONS,
    payload: data,
  };
};

export const fetchDiscussionMemberData = (channelId) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels/ids/${channelId}/members`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_DISCUSSION_MEMBERS_LIST_REQUEST,
      {
        type: FETCH_DISCUSSION_MEMBERS_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      FETCH_DISCUSSION_MEMBERS_LIST_ERROR,
    ],
  });
};

export const changeOwner = (channelId, data) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels/ids/${channelId}/owner`,
    headers: AuthHeader(),
    method: API_METHODS.PUT,
    body: JSON.stringify(data),
    types: [CHANGE_OWNER_REQUEST, CHANGE_OWNER_SUCCESS, CHANGE_OWNER_ERROR],
  });
  
export const adminDeleteDiscussionData = (data) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels/delete`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(data),
    types: [
      ADMIN_DELETE_DISCUSSION_REQUEST,
      ADMIN_DELETE_DISCUSSION_SUCCESS,
      ADMIN_DELETE_DISCUSSION_ERROR,
    ],
  });

export const saveDiscussionData = (channelId, data) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels/ids/${channelId}`,
    method: API_METHODS.PATCH,
    headers: AuthHeader(),
    body: JSON.stringify(data),
    types: [
      UPDATE_DISCUSSION_INFORMATION_REQUEST,
      UPDATE_DISCUSSION_INFORMATION_SUCCESS,
      UPDATE_DISCUSSION_INFORMATION_ERROR,
    ],
  });

export const adminAddDiscussionMember = (channelId, postObj) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/channels/ids/${channelId}/members`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify(postObj),
    types: [
      ADD_DISCUSSION_MEMBER_REQUEST,
      {
        type: ADD_DISCUSSION_MEMBER_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      ADD_DISCUSSION_MEMBER_ERROR,
    ],
  });
};

export const setDiscussionSearchQuery = (data) => {
  return {
    type: SET_DISCUSSION_SEARCH_QUERY,
    payload: data,
  };
}
export const removeChannelMemberByAdminAction = (channelId, users) =>
  createAction({
    endpoint:
      API_BASE_URL + `/ent/v1/admin/channels/ids/${channelId}/members/delete`,
    method: API_METHODS.POST,
    body: JSON.stringify({ users }),
    headers: AuthHeader(),
    types: [
      REMOVE_DISCUSSION_MEMBER,
      {
        type: REMOVE_DISCUSSION_MEMBER_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return json.data;
            });
          }
          return res;
        },
      },
      REMOVE_DISCUSSION_MEMBER_ERROR,
    ],
  });
  export const resetRemoveChannelMemberAdminAction = () => {
    return {
      type: REMOVE_DISCUSSION_MEMBER_RESET,
    };
  };