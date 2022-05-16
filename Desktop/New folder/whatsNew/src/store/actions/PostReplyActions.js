import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { API_BASE_URL } from "../../constants";
import { AuthHeader } from "@utilities/app-preference";
import {
  FETCH_POST_REPLY,
  FETCH_POST_REPLY_SUCCESS,
  FETCH_POST_REPLY_ERROR,
  LOAD_POST_REPLY,
  LOAD_POST_REPLY_SUCCESS,
  LOAD_POST_REPLY_ERROR,
  FETCH_EMBEDDED_LINK_REQUEST_REPLY,
  FETCH_EMBEDDED_LINK_SUCCESS_REPLY,
  FETCH_EMBEDDED_LINK_ERROR_REPLY,
  UPDATE_CURRENT_SELECTED_PARENT_POST,
  CLEAR_MESSAGES_REPLY_POST_FOR_PARENT,
} from "../actionTypes/commonActionTypes";
import {
  REQUEST_POST_OPEN_MESSAGES_SUCCESS,
  REQUEST_POST_CLOSE_MESSAGES_SUCCESS,
} from "../actionTypes/channelMessagesTypes";
import {
  insertLinkData,
  getLinkDataByLinkUrl,
} from "../../utilities/caching/db-helper";
import { uniqueID } from "../../utilities/utils";
import { store } from "../store";

export const fetchReplies = (
  parentPostId,
  channelId,
  scrollDirection,
  isFresh,
  postId,
  doneCallback,
  callType,
  limit
) =>
  createAction({
    // endpoint: "http://vis.monolydev.com:3002/mocks/replies.json",
    endpoint:
      API_BASE_URL +
      `/ent/v1/message/${parentPostId}?channelId=${channelId}&historyMessage=${
        scrollDirection === -1
      }&postId=${postId || 0}&isFresh=${isFresh === 1}&requestLimit=${
        limit || 20
      }`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      FETCH_POST_REPLY,
      {
        type: FETCH_POST_REPLY_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              if (doneCallback) doneCallback(json.data || []);
              return {
                data: json.data || [],
                parentPostId: parentPostId,
                direction: scrollDirection,
                callType: callType,
              };
            });
          }
        },
      },
      FETCH_POST_REPLY_ERROR,
    ],
  });
export const loadMoreReplies = (channelId, parentPostId, childPostId, limit) =>
  createAction({
    // endpoint: "http://vis.monolydev.com:3002/mocks/replies.json",
    endpoint:
      API_BASE_URL +
      `/ent/v1/message/${parentPostId}?channelId=${channelId}&historyMessage=false&postId=${childPostId}&isFresh=false&requestLimit=${
        limit || 5
      }`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      LOAD_POST_REPLY,
      {
        type: LOAD_POST_REPLY_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            return res.json().then((json) => {
              // if (doneCallback) doneCallback(json.data || []);
              return {
                data: json.data || [],
                parentPostId: parentPostId,
                direction: 1,
              };
            });
          }
        },
      },
      LOAD_POST_REPLY_ERROR,
    ],
  });

export const getEmbeddedLinkDataReply = (requestParams, passDispatch) => {
  return function (passDispatch) {
    requestParams &&
      requestParams.siteArray.forEach((site) => {
        return getLinkDataByLinkUrl(site)
          .then(
            (
              result,
              params = {
                site: site,
                channel_id: requestParams.channel_id,
                post_id: requestParams.post_id,
              },
              dispatch = passDispatch
            ) => {
              if (result === undefined) {
                dispatch(getEmbeddedLinkDataActionReply(params));
              } else {
                const data = { ...result.value };
                dispatch({
                  type: FETCH_EMBEDDED_LINK_SUCCESS_REPLY,
                  payload: {
                    data: { ...data, post_id: requestParams.post_id },
                  },
                });
              }
            }
          )
          .catch(
            (
              error,
              params = {
                site: site,
                channel_id: requestParams.channel_id,
                post_id: requestParams.post_id,
              },
              dispatch = passDispatch
            ) => {
              dispatch(getEmbeddedLinkDataActionReply(params));
            }
          );
      });
  };
};

const getEmbeddedLinkDataActionReply = (requestParams) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/post/previewlink?site=${requestParams.site}&channel_id=${requestParams.channel_id}&post_id=${requestParams.post_id}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,

    types: [
      FETCH_EMBEDDED_LINK_REQUEST_REPLY,
      {
        type: FETCH_EMBEDDED_LINK_SUCCESS_REPLY,
        payload: (action, state, res, params = requestParams) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json.data) {
                insertLinkData(json.data, params.site, uniqueID());
              }
              return json;
            });
          } else {
            return res;
          }
        },
      },
      {
        type: FETCH_EMBEDDED_LINK_ERROR_REPLY,
        payload: (action, state, res, params = requestParams) => {
          let data = {
            channel_id: requestParams.channel_id,
            post_id: requestParams.post_id,
            images64: "",
            title: "",
            link: params.site,
          };
          insertLinkData(data, params.site, uniqueID());
          return data;
        },
      },
    ],
  });

export const requestOpenReplyPost = (postId) => {
  return (dispatch) => {
    dispatch({ type: REQUEST_POST_OPEN_MESSAGES_SUCCESS, postId: postId });
  };
};
export const requestCloseReplyPost = () => {
  return (dispatch) => {
    dispatch({ type: REQUEST_POST_CLOSE_MESSAGES_SUCCESS });
  };
};

export const setCurrentReplyParent = (id) => {
  let dispatch = store.dispatch;
  dispatch({
    type: UPDATE_CURRENT_SELECTED_PARENT_POST,
    payload: { parentId: id },
  });
};

export const validSequenceReply = (parentId, sequence_id) => {
  let state = store.getState();
  let postLists =
    state.postReplies.posts && state.postReplies.posts.length > 0
      ? state.postReplies.posts.find((item) => item.parentPostId === parentId)
          ?.posts
      : [];
  if (postLists && postLists.length > 0) {
    return postLists[postLists.length - 1].sequence_id === sequence_id - 1
      ? true
      : false;
  } else {
    return true;
  }
};

export const clearPostsForGivenId = (id) => {
  return {
    type: CLEAR_MESSAGES_REPLY_POST_FOR_PARENT,
    payload: { id: id },
  };
};
