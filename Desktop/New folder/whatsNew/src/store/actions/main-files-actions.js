import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";

import {
  FETCH_ALL_FILES,
  FETCH_ALL_FILES_SUCCESS,
  FETCH_ALL_FILES_ERROR,
  GUEST_SHARE_FILES,
  GUEST_SHARE_FILES_SUCCESS,
  GUEST_SHARE_FILES_ERROR,
  DELETE_FILES,
  DELETE_FILES_SUCCESS,
  DELETE_FILES_ERROR,
  FETCH_GUEST_FILES,
  FETCH_GUEST_FILES_SUCCESS,
  FETCH_GUEST_FILES_ERROR,
  FETCH_FILE_SUMMARY_DETAILS,
  FETCH_FILE_SUMMARY_DETAILS_SUCCESS,
  FETCH_FILE_SUMMARY_DETAILS_ERROR,
  CLOSE_GUEST_SHARE_STATUS_MODAL,
  CLOSE_FILE_FORWARD_STATUS_MODAL,
  DELETE_FILES_STATUS_UPDATE,
  FETCH_FWD_POST,
  FETCH_FWD_POST_SUCCESS,
  FETCH_FWD_POST_ERROR,
  CLEAR_FWD_POST,
  UPDATE_SUMMARY_DETAILS,
  GUEST_SHARED_DELETED_FILES_STATUS_UPDATE,
  SET_SELECTED_FILES,
} from "../actionTypes/main-files-action-types";
import { GetAllFolders } from "./folderAction";
import { store } from "../store";
import { fileStorageDetails } from "./files-actions";
// import { store } from "../store"

const GetFilesListAction = (postObj, isAdmin) => {
  let queryString = "";
  if (postObj) {
    queryString =
      "?" +
      Object.keys(postObj)
        .map((key) => key + "=" + postObj[key])
        .join("&");
  }
  return createAction({
    endpoint: `${API_BASE_URL}${RestConstants.BASE_URL}${
      isAdmin ? RestConstants.ADMIN_USER : ""
    }${RestConstants.FILE_LIST}${queryString}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      { type: FETCH_ALL_FILES, payload: { fileFilterObject: postObj } },
      {
        type: FETCH_ALL_FILES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                fileFilterObject: postObj,
              };
            });
          }
        },
      },
      FETCH_ALL_FILES_ERROR,
    ],
  });
};

const GetFilesListActionNew = (
  {
    searchText,
    pageOffset,
    pageCount,
    discussionId,
    exact,
    fileType,
    activityType,
    startTime,
    stopTime,
    folderId,
    author,
    mention,
  },
  postObj
) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.SEARCH +
      RestConstants.SLASH +
      RestConstants.FILE +
      RestConstants.QUERY_SEARCH_TERM +
      searchText +
      RestConstants.QUERY_OFFSET_COUNT +
      pageOffset +
      RestConstants.QUERY_SIZE +
      pageCount +
      (discussionId !== "" ? RestConstants.QUERY_CHANNEL + discussionId : "") +
      (postObj.file !== "" ? RestConstants.QUERY_FILE + postObj.file : "") +
      (folderId !== "" ? RestConstants.FOLDER_ID + folderId : "") +
      RestConstants.QUERY_EXACT +
      exact +
      (startTime !== "" && startTime !== null
        ? RestConstants.QUERY_STARTDATE + startTime
        : "") +
      (stopTime !== "" && stopTime !== null
        ? RestConstants.QUERY_ENDDATE + stopTime
        : "") +
      (fileType !== "all" ? RestConstants.QUERY_FILETYPE + fileType : "") +
      (activityType !== "all"
        ? RestConstants.QUERY_ACTIVITY + activityType
        : "") +
      (author !== "" ? RestConstants.QUERY_UPLODER + author : "") +
      (mention !== "" ? RestConstants.QUERY_USER + mention : "") +
      (postObj.popular ? RestConstants.QUERY_POPULAR + postObj.popular : "") +
      (postObj.recent ? RestConstants.QUERY_RECENT + postObj.recent : ""),
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: FETCH_ALL_FILES,
        payload: {
          fileFilterObject: postObj,
        },
      },
      {
        type: FETCH_ALL_FILES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                fileFilterObject: postObj,
              };
            });
          }
        },
      },
      FETCH_ALL_FILES_ERROR,
    ],
  });
};

const fetchFileSummaryDetails = (
  fileId,
  channelId,
  postId,
  folderId,
  queryUserType,
  isAdmin
) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      (isAdmin ? RestConstants.ADMIN : "") +
      RestConstants.FILE_SUMMARY +
      fileId +
      "?" +
      (postId !== ""
        ? RestConstants.SUMMARY_POST_ID +
          postId +
          RestConstants.SUMMARY_CHANNEL_ID +
          channelId
        : RestConstants.SUMMARY_FOLDER_ID + folderId),
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_FILE_SUMMARY_DETAILS,
      {
        type: FETCH_FILE_SUMMARY_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                queryUserType: queryUserType,
              };
            });
          }
          return {
            data: res,
          };
        },
      },
      FETCH_FILE_SUMMARY_DETAILS_ERROR,
    ],
  });
};

const updateSummaryStats = (data) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SUMMARY_DETAILS,
      payload: data,
    });
  };
};

const fetchForwardPost = (postId, channelId) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.FILE_FWD +
      "?id=" +
      postId +
      "&channelID=" +
      channelId,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_FWD_POST,
      {
        type: FETCH_FWD_POST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
              };
            });
          }
          // return {
          //   data: res,
          // };
        },
      },
      FETCH_FWD_POST_ERROR,
    ],
  });
};

const clearFwdPost = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_FWD_POST,
    });
  };
};

const guestFilesSharing = (postObj) => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.FILE_SHARE,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify(postObj),
    types: [
      GUEST_SHARE_FILES,
      {
        type: GUEST_SHARE_FILES_SUCCESS,
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
      GUEST_SHARE_FILES_ERROR,
    ],
  });
};

const closeFileShareStatusModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_GUEST_SHARE_STATUS_MODAL,
    });
  };
};
const closeFileForwardStatusModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_FILE_FORWARD_STATUS_MODAL,
    });
  };
};

const requestGuestFiles = (postObj) => {
  let queryString = "";
  if (postObj) {
    queryString =
      "?" +
      Object.keys(postObj)
        .map((key) => key + "=" + postObj[key])
        .join("&");
  }
  return createAction({
    endpoint: `${API_BASE_URL}${RestConstants.BASE_URL}${RestConstants.FILE_SHARE}${queryString}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_GUEST_FILES,
      {
        type: FETCH_GUEST_FILES_SUCCESS,
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
      FETCH_GUEST_FILES_ERROR,
    ],
  });
};

const deleteFiles = (postObj) => {
  const dispatch = store.dispatch;
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.FILE_DELETE,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify(postObj),
    types: [
      DELETE_FILES,
      {
        type: DELETE_FILES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            //may need to update in future
            dispatch(GetAllFolders(dispatch));
            dispatch(fileStorageDetails());
            dispatch(
              GetFilesListAction({
                ...state.mainFilesReducer.fileFilterObject,
              })
            );
            return res.json().then((json) => {
              return {
                data: json.data,
                files: postObj.files,
              };
            });
          }
        },
      },
      DELETE_FILES_ERROR,
    ],
  });
};

const updateDeleteStatus = () => {
  return (dispatch) =>
    dispatch({
      type: DELETE_FILES_STATUS_UPDATE,
    });
};

const updateGuestSharedDeletedFiles = (data) => {
  return (dispatch) =>
    dispatch({
      type: GUEST_SHARED_DELETED_FILES_STATUS_UPDATE,
      payload: data,
    });
};

const setSelectedFiles = (files) => {
  return (dispatch) =>
    dispatch({
      type: SET_SELECTED_FILES,
      payload: files,
    });
};

export {
  GetFilesListAction,
  GetFilesListActionNew,
  guestFilesSharing,
  requestGuestFiles,
  deleteFiles,
  fetchFileSummaryDetails,
  closeFileShareStatusModal,
  closeFileForwardStatusModal,
  updateDeleteStatus,
  fetchForwardPost,
  clearFwdPost,
  updateSummaryStats,
  updateGuestSharedDeletedFiles,
  setSelectedFiles,
};
