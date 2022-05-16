import {
  FETCH_FILE_DETAILS,
  FETCH_FILE_DETAILS_SUCCESS,
  FETCH_FILE_DETAILS_ERROR,
  UPDATE_FILE_DETAILS_SUCCESS,
  FETCH_FILE_STORAGE_DETAILS,
  FETCH_FILE_STORAGE_DETAILS_SUCCESS,
  FETCH_FILE_STORAGE_DETAILS_ERROR,
  RESET_IMAGE_FILE_SOURCE,
  SET_IMAGE_FILE_SOURCE,
  UPDATE_SELECTED_FILTER,
  UPDATE_SELECTED_PERMISSION_FILTER,
} from "../actionTypes/file-action-types";

import { COMPLETED_DISCUSSION_DELETE } from "../actionTypes/channelActionTypes";

const initialState = {
  fetchFiles: false,
  fetchingFilesDetails: false,
  fetchedFilesDetails: false,
  channelFilesList: [],
  channelFilesCount: 0,
  fetchedFilesStDetails: false,
  channelFilesStorage: null,
  imageFileUrl: "",
  selectedFilter: null,
  selectedPermissionFilter: null,
  updater: 0,
  fileStorageDetails: null,
};

const prependFileList = (fileInfo, initialState) => {
  let tempFileList = initialState.channelFilesList
    ? initialState.channelFilesList.slice()
    : [];
  tempFileList = [...fileInfo, ...tempFileList];
  initialState.channelFilesList = tempFileList;
  return initialState.channelFilesList;
};

const fileReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_FILE_DETAILS:
      return {
        ...state,
        fetchingFilesDetails: true,
        fetchedFilesDetails: false,
      };
    case FETCH_FILE_DETAILS_ERROR:
      return {
        ...state,
        fetchingFilesDetails: false,
        fetchedFilesDetails: false,
      };

    case FETCH_FILE_DETAILS_SUCCESS:
      let tempFilesPost =
        action.payload.data?.fileList instanceof Array
          ? action.payload.data.fileList.filter(
              (item) =>
                (item.fileName !== "" && !item.isHidden) ||
                item.userId === action.payload.userId
            )
          : [];
      if (tempFilesPost && tempFilesPost.length === 0) {
        tempFilesPost = undefined;
      }
      let tempFileStorageDetails = {
        discussionQuotaAllowed: action.payload?.data?.discussionQuotaAllowed,
        discussionQuotaUsed: action.payload?.data?.discussionQuotaUsed,
      };
      return {
        ...state,
        fetchingFilesDetails: false,
        fileStorageDetails: tempFileStorageDetails,
        fetchedFilesDetails: true,
        channelFilesList: tempFilesPost,
        updater: action.payload?.forceUpdate ? Math.random() : state.updater,
      };

    case UPDATE_FILE_DETAILS_SUCCESS:
      if (action.payload.data) {
        return {
          ...state,
          fetchingFilesDetails: false,
          fetchedFilesDetails: true,
          channelFilesList: prependFileList(action.payload.data, state),
        };
      } else {
        return { ...state };
      }
    case COMPLETED_DISCUSSION_DELETE:
      return {
        ...state,
        fetchingFilesDetails: false,
        fetchedFilesDetails: true,
        channelFilesList: [],
      };

    case FETCH_FILE_STORAGE_DETAILS:
      return {
        ...state,
        fetchedFilesStDetails: false,
      };
    case FETCH_FILE_STORAGE_DETAILS_ERROR:
      return {
        ...state,
        fetchedFilesStDetails: false,
      };
    case FETCH_FILE_STORAGE_DETAILS_SUCCESS:
      return {
        ...state,
        fetchedFilesStDetails: true,
        channelFilesStorage: action.payload.data,
      };
    case RESET_IMAGE_FILE_SOURCE:
      return {
        ...state,
        imageFileUrl: "",
      };
    case SET_IMAGE_FILE_SOURCE:
      return {
        ...state,
        imageFileUrl: action.src,
      };
    case UPDATE_SELECTED_FILTER:
      return {
        ...state,
        selectedFilter: action.payload.data,
      };
    case UPDATE_SELECTED_PERMISSION_FILTER:
      return {
        ...state,
        selectedPermissionFilter: action.payload.data,
      };
    default:
      return state;
  }
};

export default fileReducer;
