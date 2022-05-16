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
  FILE_FORWARD_STATUS_MODAL,
  CLOSE_FILE_FORWARD_STATUS_MODAL,
  DELETE_FILES_STATUS_UPDATE,
  FETCH_FWD_POST,
  FETCH_FWD_POST_SUCCESS,
  FETCH_FWD_POST_ERROR,
  CLEAR_FWD_POST,
  UPDATE_SUMMARY_DETAILS,
  GUEST_SHARED_DELETED_FILES_STATUS_UPDATE,
  SET_SELECTED_FILES,
  RESET_FILE_STATES,
} from "../actionTypes/main-files-action-types";
import {
  UPDATE_FORWARD_FILE_TO_FOLDER,
  FILES_FORWARDED_TO_DISCUSSION,
  UPDATE_FILE_INFO_STATS_FILELIST,
  UPDATE_FORWARD_FILE_TO_SUMMARY,
  UPDATE_SHARED_FILE_TO_SUMMARY,
  UPDATE_REACTION_FILE_TO_SUMMARY,
} from "../actionTypes/folder-action-types";

import { filesConstants } from "../../constants/files";

const initialState = {
  fetchFiles: false,
  filesList: [],
  filesCount: 0,
  filteredCount: 0,
  deleteFileSuccess: null,
  deletedFiles: [],
  staticFolderCounts: { allFiles: "", popular: "", recent: "" },
  filesTabCount: { allFiles: "", newFiles: "", unreadFiles: "", readFiles: "" },
  fileFilterObject: {
    count: filesConstants.ITEM_COUNT,
    order: filesConstants.ORDER_BY,
    sort: filesConstants.SORT_BY,
    file: filesConstants.ALL,
    offset: filesConstants.OFFSET,
    fileType: filesConstants.ALL,
  },
  fetchingSummaryFileDetails: false,
  fetchedSummaryFileDetails: false,
  summaryFileDetails: null,
  forwardFileToDiscussion: 0,
  showGuestShareStatusModal: false,
  showForwardStatusModal: false,
  showGuestShareStatusType: null,
  showFileForwardStatusModal: false,
  fetchingForwardPost: false,
  fetchedForwardPost: {},
  guestSharedDeletedFiles: [],
  updater: 0,
  selectedFiles: [],
};

const updateFileList = (payload, fileList) => {
  let currentFileList = fileList.slice();
  payload.fileList &&
    payload.fileList.map((item, index) => {
      const forwardIndex = currentFileList?.findIndex(
        (value) => item === value?.fileId
      );
      if (forwardIndex >= 0) {
        currentFileList[forwardIndex].folderId = payload.folderId;
        currentFileList[forwardIndex].forwarded += 1;
      }
      return item;
    });
  return currentFileList;
};
const updateFileForwardToDis = (payload, fileList) => {
  let currentFileList = fileList.slice();
  payload.fileList &&
    payload.fileList.map((item, index) => {
      const forwardIndex = currentFileList?.findIndex(
        (value) => item === value?.fileId
      );
      if (forwardIndex >= 0) {
        currentFileList[forwardIndex].forwarded += 1;
      }
      return item;
    });
  return currentFileList;
};

const updateListViewAndDownload = (message, fileList, currentUserId) => {
  let currentFileList = fileList.slice();
  currentFileList.map((file) => {
    if (file.fileId === message.fileId) {
      message &&
        message.fileDLStats &&
        message.fileDLStats.stats &&
        message.fileDLStats.stats.length > 0 &&
        message.fileDLStats.stats.forEach((item) => {
          if (item.type === "VIEWED") {
            file.viewed = item.total;
            let isViewedByOwner =
              item.users &&
              item.users.length > 0 &&
              item.users.some((user) => user.userId === currentUserId);
            if (isViewedByOwner) {
              file.viewedBySelf = true;
            }
          }
          if (item.type === "DOWNLOADED") {
            file.downloaded = item.total;

            let isDownloadByOwner =
              item.users &&
              item.users.length > 0 &&
              item.users.some((user) => user.userId === currentUserId);
            if (isDownloadByOwner) {
              file.downloadedBySelf = true;
            }
          }
        });
    }
    return file;
  });
  return currentFileList;
};
const summaryDetailsUpdate = (postData, payload) => {
  let currentFileList = postData;
  payload.fileList &&
    payload.fileList.map((itemId, index) => {
      if (itemId === currentFileList.fileList[0].fileId) {
        currentFileList &&
          currentFileList.fileList &&
          currentFileList.fileList[0] &&
          currentFileList.fileList[0].fileDLStats &&
          currentFileList.fileList[0].fileDLStats.stats &&
          currentFileList.fileList[0].fileDLStats.stats.length > 0 &&
          currentFileList.fileList[0].fileDLStats.stats.forEach((item) => {
            if (item.type === "FORWARDED") {
              item.total += 1;
            }
          });
      }
      return itemId;
    });
  return currentFileList;
};
const summarySharedDetailsUpdate = (postData, payload) => {
  let currentFileList = postData;
  payload.fileListIDs &&
    payload.fileListIDs.map((itemId, index) => {
      if (itemId === currentFileList.fileList[0].fileId) {
        currentFileList &&
          currentFileList.fileList &&
          currentFileList.fileList[0] &&
          currentFileList.fileList[0].fileDLStats &&
          currentFileList.fileList[0].fileDLStats.stats &&
          currentFileList.fileList[0].fileDLStats.stats.length > 0 &&
          currentFileList.fileList[0].fileDLStats.stats.forEach((item) => {
            if (item.type === "SHARED") {
              item.total += 1;
            }
          });
      }
      return itemId;
    });
  return currentFileList;
};
const summaryReactionDetailsUpdate = (postData, payload) => {
  let currentFileList = postData;
  if (payload.postId === currentFileList?.id) {
    currentFileList.reactions.reactionStats = payload.reactionInfo;
  }
  return currentFileList;
};

const mainFilesReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_ALL_FILES:
      return {
        ...state,
        // filesList: [],
        filesCount: 0,
        filteredCount: 0,
        fetchFiles: true,
        fileFilterObject: action.payload.fileFilterObject,
        selectedFiles: [],
      };
    case FETCH_ALL_FILES_SUCCESS:
      let staticFolderCounts = {};
      const { folder, popular, recent } = action.payload?.fileFilterObject;
      if (!folder && !popular && !recent)
        staticFolderCounts = {
          allFiles: action.payload.data.count,
          // popular: action.payload.data.newFiles,
          // recent: action.payload.data.unreadFiles,
        };
      else staticFolderCounts = state.staticFolderCounts;

      return {
        ...state,
        fetchFiles: false,
        filesList:
          action.payload.data.result === null ? [] : action.payload.data.result,
        filesCount: action.payload.data.count,
        filteredCount: action.payload.data.filteredCount,
        fileFilterObject: action.payload.fileFilterObject,
        filesTabCount: {
          allFiles: action.payload.data.count,
          newFiles: action.payload.data.newFiles,
          unreadFiles: action.payload.data.unreadFiles,
          readFiles: action.payload.data.readFiles,
        },
        staticFolderCounts,
      };
    case FETCH_ALL_FILES_ERROR:
      return {
        ...state,
        fetchFiles: false,
      };
    case FETCH_FILE_SUMMARY_DETAILS:
      return {
        ...state,
        fetchingSummaryFileDetails: true,
        fetchedSummaryFileDetails: false,
      };
    case FETCH_FILE_SUMMARY_DETAILS_ERROR:
      return {
        ...state,
        fetchingSummaryFileDetails: false,
        fetchedSummaryFileDetails: false,
      };
    case FETCH_FILE_SUMMARY_DETAILS_SUCCESS:
      return {
        ...state,
        fetchingSummaryFileDetails: false,
        fetchedSummaryFileDetails: true,
        summaryFileDetails: action.payload?.data,
        queryUserType: action.payload?.queryUserType,
      };

    case UPDATE_FORWARD_FILE_TO_SUMMARY:
      let summaryDetails = summaryDetailsUpdate(
        state.summaryFileDetails.result,
        action.payload
      );
      let summaryFwdFileDetails = {
        result: summaryDetails,
        folderId: state.summaryFileDetails.folderId,
      };
      return {
        ...state,
        summaryFileDetails: summaryFwdFileDetails,
      };
    case UPDATE_SHARED_FILE_TO_SUMMARY:
      let summarySharedDetails = summarySharedDetailsUpdate(
        state.summaryFileDetails.result,
        action.payload
      );
      let updateFolderId =
        state.summaryFileDetails?.folderId !== undefined
          ? state.summaryFileDetails.folderId
          : "";
      let summarySharedFileDetails = {
        result: summarySharedDetails,
        folderId: updateFolderId,
      };
      return {
        ...state,
        summaryFileDetails: summarySharedFileDetails,
      };
    case UPDATE_REACTION_FILE_TO_SUMMARY:
      let summaryReactionDetails = summaryReactionDetailsUpdate(
        state?.summaryFileDetails?.result,
        action.payload
      );
      let summaryReactionFileDetails = {
        result: { ...summaryReactionDetails },
        folderId: state?.summaryFileDetails?.folderId,
      };
      return {
        ...state,
        summaryFileDetails: { ...summaryReactionFileDetails },
      };

    case UPDATE_SUMMARY_DETAILS:
      let obj = state.summaryFileDetails;
      obj.result.fileList[
        state.summaryFileDetails.result.fileList.findIndex(
          (i) => i.fileId === action.payload.fileId
        )
      ].fileDLStats = action.payload.fileDLStats;
      return {
        ...state,
        // fetchingSummaryFileDetails: false,
        // fetchedSummaryFileDetails: true,
        summaryFileDetails: obj,
        // queryUserType: action.payload?.queryUserType
      };
    case GUEST_SHARE_FILES:
      return {
        ...state,
      };
    case GUEST_SHARE_FILES_SUCCESS:
      return {
        ...state,
        showGuestShareStatusModal: true,
        showGuestShareStatusType: "SUCCESS",
      };
    case GUEST_SHARE_FILES_ERROR:
      return {
        ...state,
        showGuestShareStatusModal: true,
        showGuestShareStatusType: "FAILED",
      };
    case CLOSE_GUEST_SHARE_STATUS_MODAL:
      return {
        ...state,
        showGuestShareStatusModal: false,
        showGuestShareStatusType: null,
      };
    case FILE_FORWARD_STATUS_MODAL:
      return {
        ...state,
        showFileForwardStatusModal: true,
      };
    case CLOSE_FILE_FORWARD_STATUS_MODAL:
      return {
        ...state,
        showFileForwardStatusModal: false,
      };
    case FETCH_GUEST_FILES:
      return {
        ...state,
      };
    case FETCH_GUEST_FILES_SUCCESS:
      return {
        ...state,
      };
    case FETCH_GUEST_FILES_ERROR:
      return {
        ...state,
      };
    case DELETE_FILES:
      return {
        ...state,
        deleteFileSuccess: null,
      };
    case DELETE_FILES_SUCCESS:
      //need to update logic if file open in summary panel get deleted
      // let files = action.payload.files;
      // let currFiles = state.summaryFileDetails?.result?.fileList;
      // if (files.some((file) => file === currFiles[0])) {
      //   summaryFileDetails: initialState.summaryFileDetails;
      // }
      return {
        ...state,
        deletedFiles: action.payload.files,
        deleteFileSuccess: true,
      };
    case DELETE_FILES_ERROR:
      return {
        ...state,
        deleteFileSuccess: false,
      };
    case DELETE_FILES_STATUS_UPDATE:
      return {
        ...state,
        deleteFileSuccess: null,
      };
    case UPDATE_FORWARD_FILE_TO_FOLDER:
      let updateFilesList = updateFileList(action.payload, state.filesList);
      return {
        ...state,
        // deleteFileSuccess: false,
      };
    case UPDATE_FILE_INFO_STATS_FILELIST:
      let updateListViewDownload = updateListViewAndDownload(
        action.payload.message,
        state.filesList,
        action.payload.currentUserId
      );
      return {
        ...state,
        fileList: [...updateListViewDownload],
        // forwardFileToDiscussion: Math.random(),
      };

    case FILES_FORWARDED_TO_DISCUSSION:
      let updateFrwdToDissFilesList = updateFileForwardToDis(
        action.payload,
        state.filesList
      );
      return {
        ...state,
        fileList: [...updateFrwdToDissFilesList],
        forwardFileToDiscussion: Math.random(),
      };
    case FETCH_FWD_POST:
      return {
        ...state,
        fetchingForwardPost: true,
        fetchedForwardPost: initialState.fetchedForwardPost,
      };
    case FETCH_FWD_POST_SUCCESS:
      return {
        ...state,
        fetchingForwardPost: false,
        fetchedForwardPost: action.payload.data,
      };
    case FETCH_FWD_POST_ERROR:
      return {
        ...state,
        fetchingForwardPost: false,
      };
    case CLEAR_FWD_POST:
      return {
        ...state,
        fetchingForwardPost: false,
        fetchedForwardPost: initialState.fetchedForwardPost,
      };
    case GUEST_SHARED_DELETED_FILES_STATUS_UPDATE:
      return {
        ...state,
        guestSharedDeletedFiles: [
          ...state.guestSharedDeletedFiles,
          ...action.payload,
        ],
      };
    case SET_SELECTED_FILES:
      return {
        ...state,
        selectedFiles: action.payload,
      };
    case RESET_FILE_STATES:
      return { ...initialState };
    default:
      return state;
  }
};

export default mainFilesReducer;
