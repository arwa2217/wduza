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
  SET_ACTIVE_MENU_ITEM,
  SET_ACTIVE_FILE_MENU_ITEM,
  SET_ACTIVE_SETTING_MENU_ITEM,
  SET_SELECTED_FILE,
  FILE_PANEL_ACTIVE_STATE,
  ADMIN_SIDEBAR_SELECTED_PANEL,
  ADMIN_SIDEBAR_ACTIVE_STATE,
  ADMIN_SIDEBAR_SELECTED_INDEX,
} from "../../constants/config";
import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import RestConstants from "../../constants/rest/rest-constants";
import { AuthHeader } from "../../utilities/app-preference";
import { setLastSelectedChannelId } from "../../utilities/app-preference";

export const setActivePanelAction = (panelName, channel) => {
  setLastSelectedChannelId(channel ? channel.id : null);
  return {
    type: SET_ACTIVE_PANEL,
    activePanel: panelName,
    selectedChannel: channel,
  };
};

export const setSelectedChannelAction = (panelName, channel) => {
  setLastSelectedChannelId(channel ? channel.id : null);
  return {
    type: SET_SELECTED_CHANNEL,
    selectedChannel: channel,
    activePanel: panelName,
  };
};
export const updateSelectedChannelName = (channelId, channelName) => {
  return {
    type: UPDATE_CHANNEL_NAME,
    payload: {
      newName: channelName,
      currentId: channelId,
    },
  };
};

export const setRedirectPostId = (redirectPostId, iconVisibility = true) => {
  return {
    type: SET_REDIRECT_POST_ID,
    redirectPostId: redirectPostId,
    iconVisibility: iconVisibility,
  };
};

export const resetRedirectPostId = () => {
  return {
    type: RESET_REDIRECT_POST_ID,
  };
};

export const setRedirectPostIconVisibility = (iconVisibility = true) => {
  return {
    type: SET_REDIRECT_POST_ICON_VISIBLE,
    iconVisibility: iconVisibility,
  };
};

export const resetRedirectPostIconVisibility = () => {
  return {
    type: RESET_REDIRECT_POST_ICON_VISIBLE,
  };
};

export const GetFileConfig = (dispatch) => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + "files/officeconfig",
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_FILE_CONFIG_REQUEST,
      FETCH_FILE_CONFIG_SUCCESS,
      FETCH_FILE_CONFIG_ERROR,
    ],
  });
};

export const updateSummaryPanelState = (panelState) => {
  return {
    type: SUMMARY_PANEL_ACTIVE_STATE,
    payload: { panelState: panelState },
  };
};

export const updateSummaryActiveIndex = (activeIndex) => {
  return {
    type: SUMMARY_PANEL_ACTIVE_INDEX,
    payload: { activeIndex: activeIndex },
  };
};

export const getApplicationVersion = () => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.APP_VERSION,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_APP_VERSION,
      FETCH_APP_VERSION_SUCCESS,
      FETCH_APP_VERSION_FAILURE,
    ],
  });
};

export const setActiveMenuItem = (menuItem, pushPathToHistory = false) => {
  return {
    type: SET_ACTIVE_MENU_ITEM,
    payload: { item: menuItem, pushPathToHistory: pushPathToHistory },
  };
};

export const setActiveFileMenuItem = (menuItem) => {
  return {
    type: SET_ACTIVE_FILE_MENU_ITEM,
    payload: { item: menuItem },
  };
};

export const setActiveSettingMenuItem = (menuItem) => {
  return {
    type: SET_ACTIVE_SETTING_MENU_ITEM,
    payload: { item: menuItem },
  };
};

export const setSelectedFileAction = (file) => {
  return {
    type: SET_SELECTED_FILE,
    payload: {
      selectedFile: file,
      fileId:
        file === null
          ? file
          : `${file.fileId}-${file.folderId}-${file.channelId}-${file.postId}`,
    },
  };
};

export const updateFilePanelState = (panelState) => {
  return {
    type: FILE_PANEL_ACTIVE_STATE,
    payload: { panelState: panelState },
  };
};
export const setAdminSidebarPanel = (row, targetType) => {
  return {
    type: ADMIN_SIDEBAR_SELECTED_PANEL,
    payload: { row, targetType },
  };
};
export const setAdminSidebarActiveState = (panelState) => {
  return {
    type: ADMIN_SIDEBAR_ACTIVE_STATE,
    payload: { panelState },
  };
};
export const setAdminSidebarActiveIndex = (value) => {
  return {
    type: ADMIN_SIDEBAR_SELECTED_INDEX,
    payload: { value },
  };
};
