import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";
import { AuthHeader } from "../../utilities/app-preference";
import { showToast } from "./toast-modal-actions";

import {
  CREATE_FOLDER_REQUEST,
  CREATE_FOLDER_SUCCESS,
  CREATE_FOLDER_ERROR,
  CREATE_FOLDER_RESET,
  UPDATE_FOLDER_RESET,
  FETCH_FOLDER_LIST_REQUEST,
  FETCH_FOLDER_LIST_SUCCESS,
  FETCH_FOLDER_LIST_ERROR,
  UPDATE_FOLDER_REQUEST,
  UPDATE_FOLDER_SUCCESS,
  UPDATE_FOLDER_ERROR,
  FETCH_FILE_SEARCH_DETAILS_SUCCESS,
  FETCH_FILE_SEARCH_DETAILS_ERROR,
  FETCH_FILE_SEARCH_DETAILS_REQUEST,
  FETCH_SEARCH_FILE_DETAILS_CLEAR,
  FORWARD_FILE_TO_FOLDER_REQUEST,
  FORWARD_FILE_TO_FOLDER_SUCCESS,
  FORWARD_FILE_TO_FOLDER_ERROR,
  CLEAR_SEARCH_FILE_RESULT,
} from "../actionTypes/folder-action-types";

const createFolderAction = (folder, dispatch) => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.FOLDER,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(folder),
    types: [
      CREATE_FOLDER_REQUEST,
      {
        type: CREATE_FOLDER_SUCCESS,
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
      CREATE_FOLDER_ERROR,
    ],
  });
};
const resetCreateFolderAction = () => {
  return {
    type: CREATE_FOLDER_RESET,
  };
};
const resetUpdateFolderAction = () => {
  return {
    type: UPDATE_FOLDER_RESET,
  };
};
const GetAllFolders = (isFolderDeleted) =>
  createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.FOLDER,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_FOLDER_LIST_REQUEST,
      {
        type: FETCH_FOLDER_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return { data: json.data, isFolderDeleted };
            });
          }
          return res;
        },
      },
      FETCH_FOLDER_LIST_ERROR,
    ],
  });

const forwardFileToFolder = (folderId, requestParams, dispatch) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/file-fwd/folder/${folderId}`,
    method: API_METHODS.POST,
    headers: AuthHeader(),
    body: JSON.stringify(requestParams),
    types: [
      FORWARD_FILE_TO_FOLDER_REQUEST,
      {
        type: FORWARD_FILE_TO_FOLDER_SUCCESS,
        payload: (action, state, res) => {
          let mainFileList = state.mainFilesReducer.filesList;
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              if (json.code === 2011) {
                let notForwardedFiles = json.data.filter(
                  (el) => !el.isForwarded
                );
                if (notForwardedFiles.length > 0) {
                  let filteredFilesList = [];
                  mainFileList.map((file) => {
                    let fileObj = notForwardedFiles.find(
                      (el) => el.fileId === file.fileId
                    );
                    if (
                      fileObj?.fileId &&
                      filteredFilesList.findIndex(
                        (el) => el.fileId === file.fileId
                      ) === -1
                    )
                      filteredFilesList.push(file);
                    return file;
                  });
                  filteredFilesList = filteredFilesList.map((el) => el.name);
                  let str = filteredFilesList.join(", ");
                  dispatch(
                    showToast(`${str} already exist in the folder`),
                    3000
                  );
                }
              }
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      {
        type: FORWARD_FILE_TO_FOLDER_ERROR,
        payload: (action, state, res) => {
          let mainFileList = state.mainFilesReducer.filesList;
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              if (json.code === 4001) {
                let notForwardedFiles = json.data.filter(
                  (el) => !el.isForwarded
                );
                if (notForwardedFiles.length > 0) {
                  let filteredFilesList = [];
                  mainFileList.map((file) => {
                    let fileObj = notForwardedFiles.find(
                      (el) => el.fileId === file.fileId
                    );
                    if (
                      fileObj?.fileId &&
                      filteredFilesList.findIndex(
                        (el) => el.fileId === file.fileId
                      ) === -1
                    )
                      filteredFilesList.push(file);
                    return file;
                  });
                  filteredFilesList = filteredFilesList.map((el) => el.name);
                  let str = filteredFilesList.join(", ");
                  dispatch(
                    showToast(`${str} already exist in the folder`),
                    3000
                  );
                }
              }
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
    ],
  });

const updateFolderByFolderId = (folderId, folder) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/folder/${folderId}`,
    headers: AuthHeader(),
    method: API_METHODS.PATCH,
    body: JSON.stringify(folder),
    types: [UPDATE_FOLDER_REQUEST, UPDATE_FOLDER_SUCCESS, UPDATE_FOLDER_ERROR],
  });

const getSearchResultWithFile = (
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
  target = "",
  sort = "",
  order = "",
  fileFilter = "",
  isPopular,
  isAdmin
) => {

  let urlSearchString = isAdmin ? "admin/file/search" : "search/file";
  var resultText = searchText;
  searchText = searchText.replace(/['"]+/g, "");
  searchText = encodeURIComponent(searchText);
  if (mention === undefined || author === undefined) {
    return {
      type: FETCH_FILE_SEARCH_DETAILS_SUCCESS,
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
      RestConstants.BASE_URL +
      urlSearchString +
      RestConstants.QUERY_SEARCH_TERM +
      searchText +
      RestConstants.QUERY_OFFSET_COUNT +
      pageOffset +
      RestConstants.QUERY_SIZE +
      pageCount +
      (discussionId !== "" ? RestConstants.QUERY_CHANNEL + discussionId : "") +
      (folderId !== "" ? RestConstants.FOLDER_ID + folderId : "") +
      RestConstants.QUERY_EXACT +
      exact +
      (startTime !== "" && startTime !== null && startTime !== undefined
        ? RestConstants.QUERY_STARTDATE + startTime
        : "") +
      (stopTime !== "" && stopTime !== null && stopTime !== undefined
        ? RestConstants.QUERY_ENDDATE + stopTime
        : "") +
      (fileType !== "all" ? RestConstants.QUERY_FILETYPE + fileType : "") +
      (activityType !== "all"
        ? RestConstants.QUERY_ACTIVITY + activityType
        : "") +
      (author !== "" ? RestConstants.QUERY_UPLODER + author : "") +
      (mention !== "" ? RestConstants.QUERY_USER + mention : "") +
      (sort !== ""
        ? sort !== "all"
          ? RestConstants.QUERY_SORT + sort
          : ""
        : "") +
      (target !== "" ? RestConstants.QUERY_SEARCH_TYPE + target : "") +
      (order !== "" ? RestConstants.QUERY_ORDER + order : "") +
      (fileFilter !== "" ? RestConstants.QUERY_FILE + fileFilter : "") +
      (isPopular ? RestConstants.QUERY_POPULAR + isPopular : ""),
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: FETCH_FILE_SEARCH_DETAILS_REQUEST,
        payload: { pageOffset: pageOffset },
      },
      {
        type: FETCH_FILE_SEARCH_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                searchFilterObject: {
                  searchText: resultText,
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
                  sort,
                  order,
                  fileFilter,
                },
              };
            });
          }
          return res;
        },
      },
      FETCH_FILE_SEARCH_DETAILS_ERROR,
    ],
  });
};
const ClearFileSearchResultAction = () => {
  return (dispatch) => {
    dispatch({ type: FETCH_SEARCH_FILE_DETAILS_CLEAR });
  };
};
const clearSearchFields = () => {
  return (dispatch) => {
    dispatch({ type: CLEAR_SEARCH_FILE_RESULT });
  };
};

export {
  createFolderAction,
  GetAllFolders,
  updateFolderByFolderId,
  getSearchResultWithFile,
  resetCreateFolderAction,
  resetUpdateFolderAction,
  ClearFileSearchResultAction,
  forwardFileToFolder,
  clearSearchFields,
};
