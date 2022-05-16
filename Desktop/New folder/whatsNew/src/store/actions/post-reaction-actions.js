import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";

import {
  ADD_REACTION_REQUEST,
  ADD_REACTION_SUCCESS,
  ADD_REACTION_ERROR,
  REMOVE_REACTION_REQUEST,
  REMOVE_REACTION_SUCCESS,
  REMOVE_REACTION_ERROR,
} from "../actionTypes/post-reaction-action-type";
import RestConstants from "../../constants/rest/rest-constants";

const addReactionAction = (rqstBody) => {
  return createAction({
    endpoint: API_BASE_URL + RestConstants.BASE_URL + RestConstants.REACTIONS,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ ...rqstBody }),
    types: [
      ADD_REACTION_REQUEST,
      {
        type: ADD_REACTION_SUCCESS,
        payload: {
          postId: rqstBody.postId,
          reaction: rqstBody.reaction,
        },
      },
      ADD_REACTION_ERROR,
    ],
  });
};

const removeReactionAction = (channelId, postId, reaction) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.REACTIONS +
      RestConstants.SLASH +
      reaction +
      RestConstants.SLASH +
      "posts/" +
      postId,
    headers: AuthHeader(),
    method: API_METHODS.DELETE,
    types: [
      REMOVE_REACTION_REQUEST,
      {
        type: REMOVE_REACTION_SUCCESS,
        payload: {
          postId: postId,
          reaction: reaction,
        },
      },
      REMOVE_REACTION_ERROR,
    ],
  });
};

export { addReactionAction, removeReactionAction };
