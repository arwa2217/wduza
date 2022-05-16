import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";

import {
  FETCH_TAG_DETAILS,
  FETCH_TAG_DETAILS_SUCCESS,
  FETCH_TAG_DETAILS_ERROR,
  FETCH_HISTORY_POST,
  FETCH_HISTORY_POST_SUCCESS,
  FETCH_HISTORY_POST_ERROR,
} from "../actionTypes/tag-action-types";
import { store } from "../store";

const fetchTagDetails = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/tags?tag-name=${queryParams.tagName}&channelId=${queryParams.channelId}&offset=${queryParams.offset}&count=${queryParams.count}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_TAG_DETAILS,
      {
        type: FETCH_TAG_DETAILS_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              return {
                data: json.data,
                userId: store.getState().AuthReducer.user.id,
                activeTag: queryParams.tagName,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
            activeTag: queryParams.tagName,
          };
        },
      },
      FETCH_TAG_DETAILS_ERROR,
    ],
  });
};
const fetchHistoryDetails = (postId) => {
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/post/history/${postId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_HISTORY_POST,
      FETCH_HISTORY_POST_SUCCESS,
      FETCH_HISTORY_POST_ERROR,
    ],
  });
};
export { fetchTagDetails, fetchHistoryDetails };
