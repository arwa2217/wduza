import { filesConstants } from "../../constants/files";
import {
  CREATE_FOLDER_REQUEST,
  CREATE_FOLDER_SUCCESS,
  CREATE_FOLDER_ERROR,
  FETCH_FOLDER_LIST_REQUEST,
  FETCH_FOLDER_LIST_SUCCESS,
  FETCH_FOLDER_LIST_ERROR,
  UPDATE_FOLDER_LIST,
  UPDATE_FOLDER_REQUEST,
  UPDATE_FOLDER_SUCCESS,
  UPDATE_FOLDER_DATA,
  UPDATE_FOLDER_ERROR,
  CREATE_FOLDER_RESET,
  UPDATE_FOLDER_RESET,
  FETCH_FILE_SEARCH_DETAILS_SUCCESS,
  FETCH_FILE_SEARCH_DETAILS_ERROR,
  FETCH_FILE_SEARCH_DETAILS_REQUEST,
  UPDATE_LAST_FILE_SEARCH_QUERY,
  FETCH_SEARCH_FILE_DETAILS_CLEAR,
  FORWARD_FILE_TO_FOLDER_SUCCESS,
  FORWARD_FILE_TO_FOLDER_ERROR,
  CLEAR_SEARCH_FILE_RESULT,
  FETCH_FILE_SEARCH_DETAILS_CLEAR,
  UPDATE_FILE_INFO_STATS_FILELIST_SEARCH,
} from "../actionTypes/folder-action-types";
import { UPDATE_FORWARD_FILE_TO_FOLDER } from "../actionTypes/folder-action-types";

const initialState = {
  creatingFolder: false,
  createdFolder: false,
  createFolderApiError: null,
  renameFolderApiError: null,
  newFolder: null,
  folderList: [],
  folderSearchFileList: [],
  searchFileEnabled: false,
  terms: "",
  forwardToFolder: false,
  currentSearchFilter: {
    sortDirection: filesConstants.ORDER_BY,
    sortFilter: filesConstants.SORT_BY,
  },
  allFilesCount: 0,
  searchCount: 0,
};

const updateListViewAndDownload = (payload, fileList) => {
  let currentFileList = fileList.slice();
  currentFileList.map((file) => {
    if (file.fileId === payload.fileId) {
      payload &&
        payload.fileDLStats &&
        payload.fileDLStats.stats &&
        payload.fileDLStats.stats.length > 0 &&
        payload.fileDLStats.stats.forEach((item) => {
          if (item.type === "VIEWED") {
            file.viewed = item.total;
          }
          if (item.type === "DOWNLOADED") {
            file.downloaded = item.total;
          }
        });
    }
    return file;
  });
  return currentFileList;
};

const updateFolderFileList = (payload, fileList) => {
  let currentFileList = fileList.slice();
  currentFileList.map((item, index) => {
    if (item.folderId === payload.folderId) {
      item.totalFiles = payload.filesCount;
    }
    return item;
  });
  return currentFileList;
};
const updateFolderDetails = (payload, folderList) => {
  let currentFileList = folderList.slice();
  currentFileList.map((item, index) => {
    if (item.folderId === payload.folderId) {
      item.folderName = payload.folderName;
      item.description = payload.description;
    }
    return item;
  });
  return currentFileList;
};
const replaceFolderList = (newFolderList, stateFolderList) => {
  if (newFolderList instanceof Array) {
    newFolderList.length > 0 &&
      newFolderList.forEach((newFolder) => {
        updateListIfFolderNotExist(stateFolderList, newFolder);
      });
  }
};
const updateListIfFolderNotExist = (folderList, newFolder) => {
  if (folderList) {
    let folderAlreadyExist = false;
    let matchIndex = -1;

    var index;
    for (index = 0; index < folderList.length; index++) {
      var folder = folderList[index];
      if (folder?.folderId === newFolder?.folderId) {
        matchIndex = index;
        folderAlreadyExist = true;
        break;
      }
    }

    if (folderAlreadyExist) {
      folderList[matchIndex] = newFolder;
    } else {
      folderList.push(newFolder);
    }
  }
};
const updateChannelList = (newFolderList, stateFolderList) => {
  if (newFolderList instanceof Array) {
    newFolderList.forEach((newFolder) => {
      updateListIfFolderNotExist(stateFolderList, newFolder);
    });
  } else if (newFolderList) {
    let newFolder = newFolderList;
    updateListIfFolderNotExist(stateFolderList, newFolder);
  }
  return newFolderList;
};
const folderReducer = (state = { ...initialState }, action) => {
  let stateFolderList = state.folderList ? state.folderList.slice() : [];
  switch (action.type) {
    case CREATE_FOLDER_REQUEST:
      return {
        ...state,
        creatingFolder: true,
        createdFolder: false,
        newFolder: null,
        folderCreateSuccess: false,
      };
    case CREATE_FOLDER_SUCCESS:
      return {
        ...state,
        creatingFolder: false,
        createdFolder: true,
        newFolder: updateChannelList(action.payload.data, stateFolderList),
        folderList: stateFolderList,
        folderCreateSuccess: true,
      };
    case CREATE_FOLDER_ERROR:
      return {
        ...state,
        creatingFolder: false,
        createdFolder: false,
        failedToCreateFolder: true,
        newFolder: null,
        createFolderApiError: action.payload,
        folderCreateSuccess: false,
      };
    case CREATE_FOLDER_RESET:
      return {
        ...state,
        creatingFolder: false,
        createdFolder: false,
        failedToCreateFolder: false,
        newFolder: null,
        createFolderApiError: null,
        folderCreateSuccess: false,
      };
    case UPDATE_FOLDER_RESET:
      return {
        ...state,
        updateFolderSuccess: false,
        renameFolderApiError: null,
      };
    case FETCH_FOLDER_LIST_REQUEST:
      return {
        ...state,
        fetchingFolderList: true,
        failedToFetchFolderList: false,
        fetchedFolderList: false,
        folderList: stateFolderList,
      };
    case FETCH_FOLDER_LIST_SUCCESS:
      replaceFolderList(
        action.payload.data?.folderList &&
          action.payload.data?.folderList !== undefined
          ? action.payload.data?.folderList
          : [],
        stateFolderList
      );
      return {
        ...state,
        folderList: action.payload?.isFolderDeleted
          ? action.payload.data?.folderList
          : stateFolderList,
        fetchingFolderList: false,
        fetchedFolderList: true,
        allFilesCount: action.payload.data?.allFilesCount
          ? action.payload.data?.allFilesCount
          : state.allFilesCount,
      };
    case FETCH_FOLDER_LIST_ERROR:
      return {
        ...state,
        failedToFetchFolderList: true,
        fetchedFolderList: false,
      };
    case UPDATE_FOLDER_LIST:
      return {
        ...state,
        failedToFetchFolderList: true,
        fetchedFolderList: false,
        newFolder: updateChannelList(action.payload.data, stateFolderList),
        folderList: stateFolderList,
      };
    case UPDATE_FOLDER_REQUEST:
      return {
        ...state,
        updateFolderSuccess: false,
      };
    case UPDATE_FOLDER_SUCCESS:
      return {
        ...state,
        updateFolderSuccess: true,
      };
    case UPDATE_FOLDER_DATA:
      let updateFolderData = updateFolderDetails(
        action.payload,
        state.folderList
      );
      return {
        ...state,
        folderList: updateFolderData,
      };
    case UPDATE_FOLDER_ERROR:
      return {
        ...state,
        updateFolderSuccess: false,
        renameFolderApiError: action.payload,
      };
    case FETCH_FILE_SEARCH_DETAILS_REQUEST:
      return {
        ...state,
        searchCount: 0,
      };
    case FETCH_FILE_SEARCH_DETAILS_SUCCESS:
      return {
        ...state,
        folderSearchFileList: action.payload.data.result,
        searchFileEnabled: true,
        terms: action.payload.data?.term,
        searchCount: action.payload.data?.filteredCount
          ? action.payload.data?.filteredCount
          : state.searchCount,
        searchFilterObject: action.payload.searchFilterObject,
      };

    case UPDATE_FILE_INFO_STATS_FILELIST_SEARCH:
      let updateListViewDownload = updateListViewAndDownload(
        action.payload,
        state.folderSearchFileList
      );
      return {
        ...state,
        folderSearchFileList: updateListViewDownload,
      };

    case FETCH_FILE_SEARCH_DETAILS_ERROR:
      return {
        ...state,
        folderSearchFileList: [],
        searchFileEnabled: false,
        searchCount: 0,
      };

    case FETCH_SEARCH_FILE_DETAILS_CLEAR:
      return {
        ...state,
        folderSearchFileList: [],
        searchFileEnabled: false,
        currentSearchFilter: { ...initialState.currentSearchFilter },
        searchCount: 0,
      };
    case CLEAR_SEARCH_FILE_RESULT:
      let data = action.paload;
      data.discussionId = "";
      return {
        ...state,
      };

    case UPDATE_LAST_FILE_SEARCH_QUERY: {
      return {
        ...state,
        currentSearchFilter: {
          ...state.currentSearchFilter,
          ...action.payload,
        },
      };
    }

    case FETCH_FILE_SEARCH_DETAILS_CLEAR:
      return {
        ...state,
        folderSearchFileList: [],
        searchFileEnabled: false,
        terms: "",
        currentSearchFilter: { ...initialState.currentSearchFilter },
        searchCount: 0,
      };
    case FORWARD_FILE_TO_FOLDER_SUCCESS: {
      return {
        ...state,
        forwardToFolder: true,
      };
    }
    case FORWARD_FILE_TO_FOLDER_ERROR: {
      return {
        ...state,
        forwardToFolder: false,
      };
    }

    case UPDATE_FORWARD_FILE_TO_FOLDER:
      let updateFolderList = updateFolderFileList(
        action.payload,
        state.folderList
      );
      return {
        ...state,
        folderList: updateFolderList,
      };

    default:
      return state;
  }
};

export default folderReducer;
