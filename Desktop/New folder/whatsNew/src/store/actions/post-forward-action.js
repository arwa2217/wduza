import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";

import {
  FETCH_POST_FORWARD_DETAILS,
  FETCH_POST_FORWARD_SUCCESS,
  FETCH_POST_FORWARD_ERROR,
} from "../actionTypes/post-forward-action-types";
import { store } from "../store";
const fetchForwardDetailsById = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/fwdmessage?id=${queryParams.postId}&channelID=${queryParams.channelId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_POST_FORWARD_DETAILS,
      {
        type: FETCH_POST_FORWARD_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                userId: store.getState().AuthReducer.user.id,
                mainPostId: queryParams.mainPostId,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
            mainPostId: queryParams.mainPostId,
          };
        },
      },

      FETCH_POST_FORWARD_ERROR,
    ],
  });
};

export { fetchForwardDetailsById };
