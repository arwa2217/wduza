import { API_BASE_URL, API_METHODS, MAX_ITEM_SHOW } from "../../constants";
import * as types from "../actionTypes/esignature-action-types";
import { createAction } from "redux-api-middleware";
import { AuthHeader } from "../../utilities/app-preference";
import RestConstants from "../../constants/rest/rest-constants";

export const setESignRecipientList = (recipientList) => {
  return {
    type: types.SET_ESIGN_RECIPIENT_LIST,
    payload: { recipientList: recipientList ? recipientList : [] },
  };
};
export const savePrivateMsg = (privateMsgData) => {
  console.log("privateMsgData", privateMsgData);
  return {
    type: types.SAVE_PRIVATE_MSG,
    payload: privateMsgData,
  };
};

export const setESignRecipientOrder = (recipientOrder) => {
  return {
    type: types.SET_ESIGN_RECIPIENT_ORDER,
    payload: {
      recipientOrder: recipientOrder
        ? recipientOrder
        : [
            {
              total: [1],
              sequence: 1,
              index: 1,
            },
          ],
    },
  };
};

export const setESignFileInfo = (fileInfo) => {
  return {
    type: types.SET_ESIGN_FILE_INFO,
    payload: { fileInfo: fileInfo },
  };
};

export const setEsignatureFolder = (esignatureFolder) => {
  return {
    type: types.SET_ESIGNATURE_FOLDER,
    payload: esignatureFolder,
  };
};
export const setEsignatureTab = (esignatureTab) => {
  return {
    type: types.SET_ESIGNATURE_TAB,
    payload: esignatureTab,
  };
};
export const toggleTopBarButtons = (showHide) => {
  return {
    type: types.TOGGLE_TOPBAR_BUTTON,
    payload: showHide,
  };
};
export const setSelectedRows = (selectedRows) => {
  return {
    type: types.SET_SELECTED_ROWS,
    payload: selectedRows,
  };
};
export const setAnnotations = (type) => {
  return {
    type: types.SET_ANNOTATIONS,
    payload: type,
  };
};
export const uploadEsignAttachment = (data) => {
  return {
    type: types.SET_ESIGN_ATTACHMENT,
    payload: data,
  };
};
export const switchPanelView = (panelView) => {
  return {
    type: types.SWITCH_PANEL_VIEW,
    payload: { panelView: panelView },
  };
};
export const saveESignaturePrepareFile = (file) => {
  return {
    type: types.SAVE_ESIGN_PREPARE_FILE,
    payload: { file },
  };
};
export const getESignature = (folderSelected, tabSelected, params = {}) => {
  let url;
  if (Object.keys(params).length) {
    url =
      API_BASE_URL +
      `/ent/v1/e-sign/file-list?count=${params?.count}&offset=${params?.offset}&status=${tabSelected}&q=${folderSelected}`;
  } else {
    url =
      API_BASE_URL +
      `/ent/v1/e-sign/file-list?count=${MAX_ITEM_SHOW}&offset=${0}&status=${tabSelected}&q=${folderSelected}`;
  }
  let action = createAction({
    endpoint: url,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      types.FETCH_ESIGNATURE_LIST,
      {
        type: types.FETCH_ESIGNATURE_LIST_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      types.FETCH_ESIGNATURE_LIST_ERROR,
    ],
  });
  return action;
};

export const deleteEsignatureFile = (fileIds) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/e-sign/file`,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify(fileIds),
    types: [
      types.DELETE_ESIGNATURE_FILE,
      types.DELETE_ESIGNATURE_FILE_SUCCESS,
      types.DELETE_ESIGNATURE_FILE_ERROR,
    ],
  });

export const downloadEsignatureFile = (downloadDetail) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/e-sign/filecontent/${downloadDetail.fileId}?email=${
        downloadDetail.requestingUserEmail
      }&q=${downloadDetail.thumbnailOrDl.trim()}&wopiCapable=${
        downloadDetail.wopiCapable
      }&isFresh=${downloadDetail.isFresh}&page=${
        downloadDetail.page
      }&requestedpages=${downloadDetail.requestedpages}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      types.DOWNLOAD_ESIGNATURE_FILE,
      {
        type: types.DOWNLOAD_ESIGNATURE_FILE_SUCCESS,
        payload: (action, state, response) => {
          response.blob().then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", downloadDetail.fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
        },
      },
      types.DOWNLOAD_ESIGNATURE_FILE_ERROR,
    ],
  });

export const getESignatureSummary = (fileId) => {
  let action = createAction({
    endpoint: API_BASE_URL + `/ent/v1/e-sign/file/${fileId}/summary`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      types.FETCH_ESIGNATURE_SUMMARY,
      {
        type: types.FETCH_ESIGNATURE_SUMMARY_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      types.FETCH_ESIGNATURE_SUMMARY_ERROR,
    ],
  });
  return action;
};

export const getESignatureSummaryRecipients = (fileId) => {
  let action = createAction({
    endpoint: API_BASE_URL + `/ent/v1/e-sign/recipients/${fileId}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      types.FETCH_ESIGNATURE_SUMMARY_RECIPIENTS,
      {
        type: types.FETCH_ESIGNATURE_SUMMARY_RECIPIENTS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      types.FETCH_ESIGNATURE_SUMMARY_RECIPIENTS_ERROR,
    ],
  });
  return action;
};

export const getESignatureSummaryHistory = (fileId) => {
  let action = createAction({
    endpoint:
      API_BASE_URL + `/ent/v1/e-sign/file/${fileId}/history?offset=0&count=10`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      types.FETCH_ESIGNATURE_SUMMARY_HISTORY,
      {
        type: types.FETCH_ESIGNATURE_SUMMARY_HISTORY_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
              };
            });
          }
          return res;
        },
      },
      types.FETCH_ESIGNATURE_SUMMARY_HISTORY_ERROR,
    ],
  });
  return action;
};

export const getEsignSearchResult = (searchText, filterData) => {
  var resultText = searchText;
  searchText = searchText.replace(/['"]+/g, "");
  searchText = encodeURIComponent(searchText);

  return createAction({
    endpoint: `${API_BASE_URL}${
      RestConstants.BASE_URL
    }e-sign/search?q=${searchText}&field=${filterData.field}${
      filterData.date === "any" ? "" : `&date=${filterData.date}`
    }&page=${filterData.page}&size=${filterData.size}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: types.ESIGN_SEARCH_REQUEST,
      },
      {
        type: types.ESIGN_SEARCH_SUCCESS,
        payload: (action, state, res) => {
          const currentUserId = state.AuthReducer.user.id;
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                searchFilter: {
                  searchText: resultText,
                  filterData,
                },
                currentUserId: currentUserId,
              };
            });
          }
          return res;
        },
      },
      types.ESIGN_SEARCH_ERROR,
    ],
  });
};
export const clearEsignSearchResult = () => {
  return (dispatch) => {
    dispatch({ type: types.ESIGN_SEARCH_CLEAR });
  };
};
