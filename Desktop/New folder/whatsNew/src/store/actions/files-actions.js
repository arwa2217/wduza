import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";

import {
  FETCH_FILE_DETAILS,
  FETCH_FILE_DETAILS_SUCCESS,
  FETCH_FILE_DETAILS_ERROR,
  FETCH_FILE_STORAGE_DETAILS,
  FETCH_FILE_STORAGE_DETAILS_SUCCESS,
  FETCH_FILE_STORAGE_DETAILS_ERROR,
  UPDATE_SELECTED_FILTER,
  UPDATE_SELECTED_PERMISSION_FILTER,
} from "../actionTypes/file-action-types";
import { store } from "../store";

const fetchFileList = (queryParams, forceUpdate, isAdmin) => {
  const { channelId, fileType } = queryParams;
  return createAction({
    endpoint: isAdmin
      ? `${API_BASE_URL}/ent/v1/admin/channels/ids/${channelId}/files?type=${
          fileType ? fileType : "all"
        }&perm=${queryParams.perm ? queryParams.perm : "all"}`
      : `${API_BASE_URL}/ent/v1/files/channel/${channelId}?fileType=${
          fileType ? fileType : "all"
        }`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_FILE_DETAILS,
      // FETCH_FILE_DETAILS_SUCCESS,
      {
        type: FETCH_FILE_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,

                userId: store.getState().AuthReducer.user.id,
                forceUpdate: forceUpdate,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
            forceUpdate: forceUpdate,
          };
        },
      },
      FETCH_FILE_DETAILS_ERROR,
    ],
  });
};
const fileStorageDetails = () =>
  createAction({
    endpoint: API_BASE_URL + "/ent/v1/user/file-storage-quota",
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_FILE_STORAGE_DETAILS,
      FETCH_FILE_STORAGE_DETAILS_SUCCESS,
      FETCH_FILE_STORAGE_DETAILS_ERROR,
    ],
  });

const updateSelectedFilter = (filterValue) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SELECTED_FILTER,
      payload: {
        data: filterValue,
      },
    });
  };
};
const updateSelectedPermissionFilter = (filterValue) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_SELECTED_PERMISSION_FILTER,
      payload: {
        data: filterValue,
      },
    });
  };
};

// const resetFileDetails = () => {
//   return (dispatch) => dispatch({ type: RESET_FILE_DETAILS });
// };
export {
  fetchFileList,
  fileStorageDetails,
  updateSelectedFilter,
  updateSelectedPermissionFilter,
};
