import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";
import {
  POST_CHANNEL_SAVE,
  POST_CHANNEL_SAVE_SUCCESS,
  POST_CHANNEL_SAVE_ERROR,
  REMOVE_SAVE,
  REMOVE_SAVE_SUCCESS,
  REMOVE_SAVE_ERROR,
  FETCH_SAVE_DETAILS,
  FETCH_SAVE_DETAILS_SUCCESS,
  FETCH_SAVE_DETAILS_ERROR,
} from "../actionTypes/my-saves-action-types";
import { store } from "../store";
const postSavesToServer = (postSaves, callback) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/bookmark`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ ...postSaves }),
    types: [
      POST_CHANNEL_SAVE,
      {
        type: POST_CHANNEL_SAVE_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                callback();
                return postSaves.postId;
              } else {
                return postSaves.postId;
              }
            });
          }
        },
      },
      POST_CHANNEL_SAVE_ERROR,
    ],
  });

const removeSave = (saveInfo) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/bookmark/posts/${saveInfo.postId}`,
    headers: AuthHeader(),
    method: API_METHODS.DELETE,
    types: [REMOVE_SAVE, REMOVE_SAVE_SUCCESS, REMOVE_SAVE_ERROR],
  });

const fetchSaveDetails = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/bookmark?channelId=${queryParams.channelId}&offset=${queryParams.offset}&count=${queryParams.count}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_SAVE_DETAILS,
      {
        type: FETCH_SAVE_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                userId: store.getState().AuthReducer.user.id,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
          };
        },
      },
      FETCH_SAVE_DETAILS_ERROR,
    ],
  });
};
export { postSavesToServer, removeSave, fetchSaveDetails };
