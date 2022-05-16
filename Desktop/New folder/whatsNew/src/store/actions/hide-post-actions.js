import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import {
  HIDE_POST,
  HIDE_POST_SUCCESS,
  HIDE_POST_ERROR,
} from "../actionTypes/edit-post-action-type";

const postHideAction = (postId, hideFlag) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/message/${postId}?hide=${hideFlag}`,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    types: [HIDE_POST, HIDE_POST_SUCCESS, HIDE_POST_ERROR],
  });

export { postHideAction };
