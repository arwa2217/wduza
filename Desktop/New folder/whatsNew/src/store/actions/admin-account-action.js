import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";

import { API_BASE_URL } from "../../constants";
import {
  FETCH_ACCOUNT_LIST_REQUEST,
  FETCH_ACCOUNT_LIST_SUCCESS,
  FETCH_ACCOUNT_LIST_ERROR,
  SET_SELECTED_ACCOUNTS,
  FETCH_USER_DISCUSSIONS_LIST,
  FETCH_USER_DISCUSSIONS_LIST_SUCCESS,
  FETCH_USER_DISCUSSIONS_LIST_ERROR,
  ASSIGN_UUID_REQUEST,
  ASSIGN_UUID_SUCCESS,
  ASSIGN_UUID_ERROR,
  CREATE_ACCOUNT_REQUEST,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_RESET,
  IMPORT_MEMBER_LIST_REQUEST,
  IMPORT_MEMBER_LIST_SUCCESS,
  IMPORT_MEMBER_LIST_ERROR,
  FETCH_ADMIN_FOLDER_LIST_REQUEST,
  FETCH_ADMIN_FOLDER_LIST_SUCCESS,
  FETCH_ADMIN_FOLDER_LIST_ERROR,
  FETCH_USER_INFORMATION_REQUEST,
  FETCH_USER_INFORMATION_SUCCESS,
  FETCH_USER_INFORMATION_ERROR,
  UPDATE_USER_INFORMATION_REQUEST,
  UPDATE_USER_INFORMATION_SUCCESS,
  UPDATE_USER_INFORMATION_ERROR,
  FETCH_LOGIN_HISTORY_REQUEST,
  FETCH_LOGIN_HISTORY_SUCCESS,
  FETCH_LOGIN_HISTORY_ERROR,
  CREATE_OWNER_DISCUSSION_REQUEST,
  CREATE_OWNER_DISCUSSION_SUCCESS,
  CREATE_OWNER_DISCUSSION_ERROR,
  CREATE_OWNER_DISCUSSION_RESET,
  SET_ACCOUNT_SEARCH_QUERY,
  FETCH_ACCOUNT_SEARCH_LIST_REQUEST,
  FETCH_ACCOUNT_SEARCH_LIST_SUCCESS,
  FETCH_ACCOUNT_SEARCH_LIST_ERROR,
  UPDATE_ADMIN_ACCOUNT_DATA,
  IMPORTED_ADMIN_ACCOUNT,
  FETCH_AVAILABLE_UID_REQUEST,
  FETCH_AVAILABLE_UID_SUCCESS,
  FETCH_AVAILABLE_UID_ERROR,
  ACTIVATE_USER_REQUEST,
  ACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_ERROR,
  USER_STATUS_CHANGE_REQUEST,
  USER_STATUS_CHANGE_SUCCESS,
  USER_STATUS_CHANGE_ERROR,
} from "./../actionTypes/admin-account-action-types";
export const fetchAccountData = (postObj) => {
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
    endpoint: API_BASE_URL + `/ent/v1/accounts${queryString}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_ACCOUNT_LIST_REQUEST,
      {
        type: FETCH_ACCOUNT_LIST_SUCCESS,
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
      FETCH_ACCOUNT_LIST_ERROR,
    ],
  });
};

export const fetchUserData = (userId) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/user-info/${userId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_USER_INFORMATION_REQUEST,
      {
        type: FETCH_USER_INFORMATION_SUCCESS,
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
      FETCH_USER_INFORMATION_ERROR,
    ],
  });
export const createDiscussionAction = (discussion, dispatch) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/discussion`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(discussion),
    types: [
      CREATE_OWNER_DISCUSSION_REQUEST,
      {
        type: CREATE_OWNER_DISCUSSION_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              let discussion = json.data;
              if (discussion instanceof Array) {
                discussion = discussion[0];
              }
              if (dispatch) {
                window.createdDiscussion = discussion;
              }
              return { data: json.data };
            });
          }
          return res;
        },
      },
      CREATE_OWNER_DISCUSSION_ERROR,
    ],
  });
};
export const importMemberList = (memberList, dispatch) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/user-import`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(memberList),
    types: [
      IMPORT_MEMBER_LIST_REQUEST,
      {
        type: IMPORT_MEMBER_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return { data: json.data };
            });
          }
          return res;
        },
      },
      IMPORT_MEMBER_LIST_ERROR,
    ],
  });
};
export const resetCreateDiscussionAction = () => {
  return {
    type: CREATE_OWNER_DISCUSSION_RESET,
  };
};

export const getUsersFolderListByAdmin = (userId) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/users/${userId}/folders`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_ADMIN_FOLDER_LIST_REQUEST,
      {
        type: FETCH_ADMIN_FOLDER_LIST_SUCCESS,
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
      FETCH_ADMIN_FOLDER_LIST_ERROR,
    ],
  });
};
export const createAccountAction = (account) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/register`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(account),
    types: [
      CREATE_ACCOUNT_REQUEST,
      {
        type: CREATE_ACCOUNT_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return { data: json.data };
            });
          }
          return res;
        },
      },
      CREATE_ACCOUNT_ERROR,
    ],
  });
};
export const resetCreateAccountAction = () => {
  return {
    type: CREATE_ACCOUNT_RESET,
  };
};
export const UpdateAdminAccountData = (account, update) => {
  return {
    type: UPDATE_ADMIN_ACCOUNT_DATA,
    account_data: account,
    update_display: update,
  };
};

export const ImportedAdminAccount = (imported) => {
  return {
    type: IMPORTED_ADMIN_ACCOUNT,
    imported: imported,
  };
};
export const setSelectedAccounts = (data) => {
  return {
    type: SET_SELECTED_ACCOUNTS,
    payload: data,
  };
};
export const assignUuidAdmin = (postObj) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/assign-uid`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify(postObj),
    types: [
      ASSIGN_UUID_REQUEST,
      {
        type: ASSIGN_UUID_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            // return res.json().then((json) => {
            //   return {
            //     data: json.data,
            //     userId: store.getState().AuthReducer.user.id,
            //   };
            // });
          }
        },
      },
      ASSIGN_UUID_ERROR,
    ],
  });
};

export const fetchUserDiscussionsList = (queryParams) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/admin/users/${queryParams.userId}/discussions?type=${queryParams.channelType}&offset=${queryParams.offset}&count=${queryParams.count}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_USER_DISCUSSIONS_LIST,
      {
        type: FETCH_USER_DISCUSSIONS_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return {
                  payload: json.data,
                  channelType: queryParams.channelType,
                };
              } else {
                return {};
              }
            });
          }
        },
      },
      FETCH_USER_DISCUSSIONS_LIST_ERROR,
    ],
  });
export const setAccountSearchQuery = (data) => {
  return {
    type: SET_ACCOUNT_SEARCH_QUERY,
    payload: data,
  };
};

export const getAccountSearchResult = (postObj) => {
  let obj = { ...postObj };
  let queryString = "";
  if (obj) {
    delete obj.offset;
    delete obj.count;
    queryString =
      "?" +
      Object.keys(obj)
        .filter((key) => (obj[key] || key === "q" ? key : ""))
        .map((key) => key + "=" + obj[key])
        .join("&");
  }
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/users${queryString}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_ACCOUNT_SEARCH_LIST_REQUEST,
      {
        type: FETCH_ACCOUNT_SEARCH_LIST_SUCCESS,
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
      FETCH_ACCOUNT_SEARCH_LIST_ERROR,
    ],
  });
};

export const GetLoginHistoryListAction = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/admin/users/${queryParams.userId}/login-history?offset=${queryParams.offset}&count=${queryParams.count}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_LOGIN_HISTORY_REQUEST,
      FETCH_LOGIN_HISTORY_SUCCESS,
      FETCH_LOGIN_HISTORY_ERROR,
    ],
  });
};
export const activateUser = (postObj) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/activate`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify(postObj),
    types: [
      ACTIVATE_USER_REQUEST,
      {
        type: ACTIVATE_USER_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            // return res.json().then((json) => {
            //   return {
            //     data: json.data,
            //     userId: store.getState().AuthReducer.user.id,
            //   };
            // });
          }
        },
      },
      ACTIVATE_USER_ERROR,
    ],
  });
};
export const deleteUser = (data, type, message) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/delete`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(data),
    types: [
      {
        type: USER_STATUS_CHANGE_REQUEST,
        payload: {
          type,
          message,
        },
      },
      {
        type: USER_STATUS_CHANGE_SUCCESS,
      },
      USER_STATUS_CHANGE_ERROR,
    ],
  });
};

export const saveUserData = (userId, data) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/users/${userId}`,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify(data),
    types: [
      UPDATE_USER_INFORMATION_REQUEST,
      UPDATE_USER_INFORMATION_SUCCESS,
      UPDATE_USER_INFORMATION_ERROR,
    ],
  });

export const fetchAvailableUidData = () => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/admin/uid`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_AVAILABLE_UID_REQUEST,
      {
        type: FETCH_AVAILABLE_UID_SUCCESS,
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
      FETCH_AVAILABLE_UID_ERROR,
    ],
  });
};
