import {
  SET_ACTIVE_PANEL,
  SET_SELECTED_CHANNEL,
  UPDATE_CHANNEL_NAME,
  SET_REDIRECT_POST_ID,
  RESET_REDIRECT_POST_ID,
  SET_REDIRECT_POST_ICON_VISIBLE,
  RESET_REDIRECT_POST_ICON_VISIBLE,
  FETCH_FILE_CONFIG_REQUEST,
  FETCH_FILE_CONFIG_SUCCESS,
  FETCH_FILE_CONFIG_ERROR,
  SUMMARY_PANEL_ACTIVE_STATE,
  SUMMARY_PANEL_ACTIVE_INDEX,
  FETCH_APP_VERSION,
  FETCH_APP_VERSION_SUCCESS,
  FETCH_APP_VERSION_FAILURE,
  UPDATE_APP_VERSION,
  UPDATE_USER_TYPING_STATUS,
  SET_ACTIVE_MENU_ITEM,
  SET_ACTIVE_FILE_MENU_ITEM,
  SET_ACTIVE_SETTING_MENU_ITEM,
  SET_SELECTED_FILE,
  FILE_PANEL_ACTIVE_STATE,
  ADMIN_SIDEBAR_SELECTED_PANEL,
  ADMIN_SIDEBAR_ACTIVE_STATE,
  ADMIN_SIDEBAR_SELECTED_INDEX,
} from "../../constants/config";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";
import { MENU_ITEMS } from "../../constants/menu-items";
import { RESET_FILE_STATES } from "../actionTypes/main-files-action-types";
const initialState = {
  activeSelectedChannel: {},
  redirectPostId: "",
  iconVisibility: true,
  fileConfig: {},
  summaryPanelActive: true,
  summaryPanelActiveIndex: 0,
  buildVersion: null,
  isUserTyping: false,
  activeMenuItem: MENU_ITEMS.COLLECTIONS,
  activeFileMenuItem: FILES_MENU_ITEMS.FILES_ALL,
  activeSelectedFile: {},
  activeSelectedFileId: null,
  filePanelActive: false,
  adminSelectedRow: null,
  adminSidebarPanelState: false,
  adminSidebarActiveIndex: 1,
  pushPathToHistory: false,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_PANEL: {
      return {
        ...state,
        activeActionPanel: action.activePanel,
        activeSelectedChannel: action.selectedChannel,
      };
    }
    case SET_SELECTED_CHANNEL: {
      return {
        ...state,
        activeActionPanel: action.activePanel,
        activeSelectedChannel: action.selectedChannel,
      };
    }
    case UPDATE_CHANNEL_NAME: {
      const channelName =
        action.payload.currentId === state.activeSelectedChannel.id
          ? action.payload.newName
          : state.activeSelectedChannel.name;
      return {
        ...state,
        activeSelectedChannel: {
          ...state.activeSelectedChannel,
          name: channelName,
        },
      };
    }
    case SET_REDIRECT_POST_ID:
      return {
        ...state,
        redirectPostId: action.redirectPostId,
      };
    case RESET_REDIRECT_POST_ID:
      return {
        ...state,
        redirectPostId: "",
      };
    case SET_REDIRECT_POST_ICON_VISIBLE:
      return {
        ...state,
        iconVisibility: action.iconVisibility,
      };
    case RESET_REDIRECT_POST_ICON_VISIBLE:
      return {
        ...state,
        iconVisibility: true,
      };
    case FETCH_FILE_CONFIG_REQUEST:
      return {
        ...state,
        fileConfigFetching: true,
        fileConfigFetched: false,
        fileConfig: {},
      };
    case FETCH_FILE_CONFIG_SUCCESS:
      return {
        ...state,
        fileConfigFetching: true,
        fileConfigFetched: false,
        fileConfig: action.payload.data,
      };
    case FETCH_FILE_CONFIG_ERROR:
      return {
        ...state,
        fileConfigFetching: true,
        fileConfigFetched: false,
        fileConfig: {},
      };
    case SUMMARY_PANEL_ACTIVE_STATE:
      return {
        ...state,
        summaryPanelActive: action.payload.panelState,
      };
    case SUMMARY_PANEL_ACTIVE_INDEX:
      return {
        ...state,
        summaryPanelActiveIndex: action.payload.activeIndex,
      };
    case FETCH_APP_VERSION:
      return {
        ...state,
      };
    case FETCH_APP_VERSION_SUCCESS:
      let buildVersion = null;
      action.payload &&
        action.payload.data &&
        action.payload.data.buildVersion &&
        Array.isArray(action.payload.data.buildVersion) &&
        action.payload.data.buildVersion.map((data) => {
          if (data.name === "WEBAPP") {
            buildVersion = data.version;
          }
          return data;
        });
      if (
        action.payload &&
        action.payload.data &&
        !Array.isArray(action.payload.data.buildVersion)
      ) {
        buildVersion = action.payload.data.buildVersion;
      }

      return {
        ...state,
        buildVersion: buildVersion,
      };
    case FETCH_APP_VERSION_FAILURE:
      return {
        ...state,
      };
    case UPDATE_APP_VERSION:
      return {
        ...state,
        buildVersion: action.payload.buildVersion,
      };
    case UPDATE_USER_TYPING_STATUS:
      return {
        ...state,
        isUserTyping: action.payload.typing,
      };
    case SET_ACTIVE_MENU_ITEM:
      return {
        ...state,
        activeMenuItem: action.payload.item,
        pushPathToHistory: action.payload.pushPathToHistory,
      };
    case SET_ACTIVE_FILE_MENU_ITEM:
      return {
        ...state,
        activeFileMenuItem: action.payload.item,
      };
    case SET_ACTIVE_SETTING_MENU_ITEM:
      return {
        ...state,
        activeSettingMenuItem: action.payload.item,
      };
    case SET_SELECTED_FILE:
      return {
        ...state,
        activeSelectedFileId:
          action.payload.selectedFile !== null
            ? state.activeSelectedFileId !== action.payload.fileId
              ? action.payload.fileId
              : null
            : null,
        activeSelectedFile:
          action.payload.selectedFile !== null
            ? state.activeSelectedFileId !== action.payload.fileId
              ? action.payload.selectedFile
              : {}
            : {},
      };
    case FILE_PANEL_ACTIVE_STATE:
      return {
        ...state,
        filePanelActive: action.payload.panelState,
      };
    case ADMIN_SIDEBAR_SELECTED_PANEL:
      return {
        ...state,
        adminSelectedRow:
          action.payload?.targetType === "ownerChanged" ||
          action.payload?.targetType === "discussionChanged" ||
          action.payload?.targetType === "discussionDeleted"
            ? action.payload.row
            : state.adminSelectedRow !== null
            ? state.adminSelectedRow?.id === action.payload.row.id
              ? null
              : action.payload.row
            : action.payload.row,
      };
    case ADMIN_SIDEBAR_ACTIVE_STATE:
      return {
        ...state,
        adminSidebarPanelState: action.payload.panelState,
      };
    case ADMIN_SIDEBAR_SELECTED_INDEX:
      return {
        ...state,
        adminSidebarActiveIndex: action.payload.value,
      };
    case RESET_FILE_STATES:
      return {
        ...state,
        filePanelActive: false,
        activeSelectedFileId: null,
        activeSelectedFile: {},
        activeFileMenuItem: FILES_MENU_ITEMS.FILES_ALL,
      };
    default:
      return { ...state };
  }
};
