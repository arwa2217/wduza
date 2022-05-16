import { createAction } from "redux-api-middleware";
import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";
import { MENU_ITEMS } from "../../constants/menu-items";
import { store } from "../store";
import {
  LOAD_CHANNEL_MESSAGES,
  LOAD_CHANNEL_MESSAGES_SUCCESS,
  LOAD_CHANNEL_MESSAGES_ERROR,
  LOAD_CHANNEL_TIMELINE_MESSAGES,
  LOAD_CHANNEL_TIMELINE_MESSAGES_SUCCESS,
  LOAD_CHANNEL_TIMELINE_MESSAGES_ERROR,
  POST_CHANNEL_MESSAGE,
  POST_CHANNEL_MESSAGE_SUCCESS,
  POST_CHANNEL_MESSAGE_ERROR,
  UPDATE_LAST_READ_POST_ID,
  UPDATE_LAST_READ_POST_ID_SUCCESS,
  UPDATE_LAST_READ_POST_ID_ERROR,
  POST_CHANNEL_TAG,
  POST_CHANNEL_TAG_SUCCESS,
  POST_CHANNEL_TAG_ERROR,
  FETCH_TAG_DETAILS,
  FETCH_TAG_DETAILS_SUCCESS,
  FETCH_TAG_DETAILS_ERROR,
  REMOVE_TAG,
  REMOVE_TAG_SUCCESS,
  REMOVE_TAG_ERROR,
  REDIRECT_CHANNEL_MESSAGES,
  REDIRECT_CHANNEL_MESSAGES_SUCCESS,
  REDIRECT_CHANNEL_REPLY_MESSAGES_SUCCESS,
  REDIRECT_CHANNEL_MESSAGES_ERROR,
  FOCUS_CHANNEL_POST,
  CLEAR_SCROLL_FLAGS,
  CLEAN_MESSAGES,
  FETCH_EMBEDDED_LINK_REQUEST,
  FETCH_EMBEDDED_LINK_SUCCESS,
  FETCH_EMBEDDED_LINK_ERROR,
  POST_CHANNEL_TASK,
  POST_CHANNEL_TASK_SUCCESS,
  POST_CHANNEL_TASK_ERROR,
  UNREAD_FILTER_SCROLL_UP,
  LOAD_UNREAD_MESSAGES,
  LOAD_UNREAD_MESSAGES_SUCCESS,
  LOAD_UNREAD_MESSAGES_ERROR,
  TOGGLE_UNREAD_MESSAGE,
  FOCUS_CHANNEL_POST_FAIL,
  SET_MESSAGE_SCROLL_FLAG,
  TOGGLE_EDITOR,
  SET_POST_TO_REPLY,
  LAST_POST,
} from "../actionTypes/channelMessagesTypes";
import { FILE_FORWARD_STATUS_MODAL } from "../actionTypes/main-files-action-types";

import { uniqueID } from "../../utilities/utils";
import {
  addPost,
  insertLinkData,
  getLinkDataByLinkUrl,
} from "../../utilities/caching/db-helper";
import retrieveMessages from "../../utilities/messages-retriever";
import { UPDATE_CHANNEL_MESSAGE_COUNT } from "../actionTypes/channelActionTypes";
import { hasValidMessageSequence } from "../../components/utils/post-utils";
import {
  FETCH_POST_REPLY,
  FETCH_POST_REPLY_SUCCESS,
  FETCH_POST_REPLY_ERROR,
} from "../actionTypes/commonActionTypes";
import {
  FETCH_MAIN_POST_FORWARD_DETAILS,
  FETCH_MAIN_POST_FORWARD_SUCCESS,
  FETCH_MAIN_POST_FORWARD_ERROR,
} from "../actionTypes/post-forward-action-types";
import { validSequenceReply } from "./PostReplyActions";
import ChannelService from "../../services/channel-service";
const versionAPI = "v3";

const modifyMessages = async (channelId, data = []) => {
  const parentIds = [];
  data.map((item) => {
    if (item.parentId !== "" && !parentIds.includes(item.parentId)) {
      parentIds.push(item.parentId);
    }
  });
  if (parentIds.length) {
    const results = await ChannelService.getMessageContent(channelId, {
      list: parentIds,
    });
    const {
      data: { data: messagesContentData = [] },
    } = results;
    const newData = data.map((post) => {
      const { parentId = "" } = post;
      const parentPostContent =
        messagesContentData.find((parent) => parent.id === parentId) || {};
      return {
        ...post,
        parentPostContent,
        isHasParent: Object.keys(parentPostContent).length > 0,
      };
    });
    return newData;
  }
  return data;
};

const toggleEditor = (toggle, currentPost) => {
  return {
    type: TOGGLE_EDITOR,
    payload: { toggle, currentPost },
  };
};

const setPostToReply = (post) => {
  return {
    type: SET_POST_TO_REPLY,
    payload: post,
  };
};

const setLastPost = () => {
  return {
    type: LAST_POST,
  };
};

const channelMessagesActions = (
  channelId,
  scrollDirection,
  postId,
  isFresh,
  successNotificationCallback,
  clearPrevious,
  isUnread
) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/${versionAPI}/message?channelId=${channelId}&historyMessage=${
        scrollDirection === -1
      }&postId=${postId}&isFresh=${isFresh === 1 || !!clearPrevious}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: LOAD_CHANNEL_MESSAGES,
        payload: { scrollDirection },
      },
      {
        type: LOAD_CHANNEL_MESSAGES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then(async (json) => {
              if (json && json.data) {
                const updateData = await modifyMessages(channelId, json.data);
                if (successNotificationCallback)
                  successNotificationCallback(updateData);
                return {
                  messages: updateData,
                  scrollDirection,
                  channelId,
                  clearPrevious,
                };
              } else {
                return {
                  messages: [],
                  scrollDirection,
                  channelId,
                };
              }
            });
          }
        },
      },
      {
        type: LOAD_CHANNEL_MESSAGES_ERROR,
        payload: { scrollDirection },
      },
    ],
  });

const unreadChannelMessagesActions = (
  channelId,
  scrollDirection,
  postId = 0,
  isFresh,
  successNotificationCallback,
  clearPrevious
) => {
  const dispatch = store.dispatch;
  if (scrollDirection === -1) {
    return { type: UNREAD_FILTER_SCROLL_UP };
  }
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/message?unread=true&channelId=${channelId}&requestLimit=10&postId=${postId}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      {
        type: LOAD_UNREAD_MESSAGES,
        payload: { scrollDirection },
      },
      {
        type: LOAD_UNREAD_MESSAGES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                if (successNotificationCallback) {
                  successNotificationCallback(json.data);
                }
                let postListIds = [];
                json.data.forEach((el) => {
                  if (el.unreadReplyCount > 0) postListIds.push(el.post.id);
                });
                if (postListIds.length > 0) {
                  let myObj = { list: [...postListIds] };

                  dispatch(
                    unreadReplyMessageActions(channelId, myObj, dispatch)
                  );
                }
                return {
                  messages: json.data,
                  scrollDirection,
                  channelId,
                  clearPrevious,
                };
              } else {
                return {
                  messages: [],
                  scrollDirection,
                  channelId,
                };
              }
            });
          }
        },
      },
      {
        type: LOAD_UNREAD_MESSAGES_ERROR,
        payload: { scrollDirection },
      },
    ],
  });
};
const unreadReplyMessageActions = (channelId, postIds, dispatch) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/unreadMessage?channelId=${channelId}&requestLimit=5`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ ...postIds }),
    types: [
      FETCH_POST_REPLY,
      {
        type: FETCH_POST_REPLY_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                setTimeout(() => {
                  dispatch({
                    type: SET_MESSAGE_SCROLL_FLAG,
                    payload: {
                      scrollToTop:
                        store.getState().channelMessages.messages.length > 0 &&
                        store.getState().channelMessages.toggleUnreadMessage
                          ? true
                          : false,
                    },
                  });
                }, 1500);
                // console.log(json.data, "in reply json data");
                // let parentPostIdMap = json.data.map(el => el.ParentPostID)
                return {
                  data: json.data || [],
                  parentPostId: "",
                  unreadMessage: true,
                  // direction: scrollDirection,
                  // callType: callType,
                };
              } else {
                return {
                  data: [],
                  parentPostId: "",
                  unreadMessage: true,
                  // direction: scrollDirection,
                  // callType: callType,
                };
              }
            });
          }
        },
      },
      FETCH_POST_REPLY_ERROR,
    ],
  });

const getTimelineMessagesActions = (channelId, selectedTimeline) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/message?channelId=${channelId}&timelineSelection=${selectedTimeline}`,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      LOAD_CHANNEL_TIMELINE_MESSAGES,
      {
        type: LOAD_CHANNEL_TIMELINE_MESSAGES_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                return { messages: json.data, channelId };
              } else {
                return { messages: [], channelId };
              }
            });
          }
        },
      },
      LOAD_CHANNEL_TIMELINE_MESSAGES_ERROR,
    ],
  });

const appendMessageToChannels = (
  channelId,
  message,
  parentPostId,
  isOutLookForward
) => {
  let messages = [message];
  return (dispatch) => {
    dispatch({
      type: LOAD_CHANNEL_MESSAGES_SUCCESS,
      payload: {
        channelId: channelId,
        messages: messages,
        parentPostId: parentPostId,
        isOutLookForward: isOutLookForward,
      },
    });
  };
};
const updateLastReadPost = (channelId, postIds, dispatch, parentPostId) => {
  //?lastReadPostId=${postId}`
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/channels/messages/${channelId}${
        parentPostId ? "?parentPostId=" + parentPostId : ""
      }`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ list: postIds }),
    types: [
      UPDATE_LAST_READ_POST_ID,
      {
        type: UPDATE_LAST_READ_POST_ID_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                dispatch({
                  type: UPDATE_CHANNEL_MESSAGE_COUNT,
                  payload: {
                    currentChannelId:
                      store.getState().config?.activeSelectedChannel?.id,
                    channelId: json.data.channelID,
                    unreadPostCount: json.data.unreadPostCount,
                    hasNewMessages:
                      json.data.unreadPostCount > 0 ? true : false,
                  },
                });
              }
            });
          }
          return {};
        },
      },
      UPDATE_LAST_READ_POST_ID_ERROR,
    ],
  });
};
const fetchTagDetails = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/tags?tag-name=${queryParams.tagName}&channelId=${queryParams.channelId}&offset=${queryParams.offset}&count=${queryParams.count}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_TAG_DETAILS,
      FETCH_TAG_DETAILS_SUCCESS,
      FETCH_TAG_DETAILS_ERROR,
    ],
  });
};
const postMessageToServer = (
  postMessage,
  moveToBottom,
  parentId,
  dispatch,
  isOutLookForward = false
) => {
  // if (parentId && parentId !== "") {
  //   let state = store.getState();
  //   let parentMessage= state.channelMessages.messages.find((message) => message.id === parentId);

  // }
  return createAction({
    endpoint: API_BASE_URL + `/ent/v1/message`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ ...postMessage }),
    types: [
      {
        type: POST_CHANNEL_MESSAGE,
        payload: {
          messageId: postMessage.post.id,
          moveToBottom: moveToBottom,
        },
      },
      {
        type: POST_CHANNEL_MESSAGE_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                let activeMenuItem = store.getState().config?.activeMenuItem;
                if (
                  activeMenuItem === MENU_ITEMS.FILES &&
                  postMessage.fileListIDs?.length > 0
                ) {
                  dispatch({
                    type: FILE_FORWARD_STATUS_MODAL,
                  });
                }
                if (json.data.reply.isReply || !moveToBottom) {
                  if (
                    parentId &&
                    parentId !== "" &&
                    !validSequenceReply(
                      json.data.reply.parentId,
                      json.data.sequence_id
                    )
                  ) {
                    //clearPostsForGivenId(parentId);
                    //fetchReplies(parentId, json.data.channelId, 1, 1, 0);
                  }
                  return json.data;
                }
                //enabled if cache enabled
                let currentMessage = json.data;
                let channelMessages = store.getState().channelMessages.messages;
                let currentSelectedChannel =
                  store.getState().config?.activeSelectedChannel?.id;
                const checkInvalidMessage = isOutLookForward
                  ? true
                  : !hasValidMessageSequence(channelMessages, currentMessage);
                if (
                  checkInvalidMessage &&
                  currentMessage?.data?.channelId === currentSelectedChannel
                ) {
                  const { channelId, post } = json.data;
                  retrieveMessages(1, channelId, 0, post.id, true);
                }
                if (false) {
                  setTimeout(async () => {
                    const { channelId, post, sequence_id, userId } = json.data;
                    const postWrapper = {
                      id: sequence_id,
                      post,
                      user: {
                        id: userId,
                        userImg: "",
                        displayName: state.AuthReducer.user?.screenname,
                      },
                    };
                    const isRecordOutOfSync = await addPost(
                      channelId,
                      postWrapper
                    );

                    //todo: out of sync has to be implemented once BE add post id to returned message
                    if (isRecordOutOfSync) {
                      retrieveMessages(true, channelId, 0, post.id, true);
                    }
                  }, 100);
                }

                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      {
        type: POST_CHANNEL_MESSAGE_ERROR,
        payload: { postMessage },
      },
    ],
  });
};

const postTagToServer = (postTag, callback) =>
  createAction({
    endpoint: API_BASE_URL + `/ent/v1/tags`,
    headers: AuthHeader(),
    method: API_METHODS.POST,
    body: JSON.stringify({ ...postTag }),
    types: [
      POST_CHANNEL_TAG,
      {
        type: POST_CHANNEL_TAG_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              if (json && json.data) {
                callback();
                return json.data;
              } else {
                return {};
              }
            });
          }
        },
      },
      POST_CHANNEL_TAG_ERROR,
    ],
  });

const postTaskToServer = (postTask, callback) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/task/${postTask.postId}?task-status=${postTask.taskStatus}`,
    headers: AuthHeader(),
    method: API_METHODS.PATCH,
    // body: JSON.stringify({ ...postTag }),
    types: [
      POST_CHANNEL_TASK,
      {
        type: POST_CHANNEL_TASK_SUCCESS,
        payload: (action, state, res) => {
          // const contentType = res.headers.get("Content-Type");
          // if (contentType && ~contentType.indexOf("json")) {
          // 	// Just making sure res.json() does not raise an error
          // 	return res.json().then((json) => {
          // 		if (json && json.data) {
          // 			callback();
          // 			return json.data;
          // 		} else {
          // 			return {};
          // 		}
          // 	});
          // }
        },
      },
      POST_CHANNEL_TASK_ERROR,
    ],
  });

const removeTag = (tagInfo) =>
  createAction({
    endpoint:
      API_BASE_URL + `/ent/v1/tags/${tagInfo.tagName}/posts/${tagInfo.postId}`,
    headers: AuthHeader(),
    method: API_METHODS.DELETE,
    types: [REMOVE_TAG, REMOVE_TAG_SUCCESS, REMOVE_TAG_ERROR],
  });

const focusOnPostActions = (channelId, postId, parentId) => {
  let state = store.getState();
  let currentChannelId = state.config.activeSelectedChannel.id;
  let currentMessages = state.channelMessages.messages;
  if (channelId === currentChannelId) {
    for (var i = 0; i < currentMessages.length; i++) {
      if (
        currentMessages[i].post.id === postId ||
        currentMessages[i].post.id === parentId
      ) {
        return (dispatch) => {
          dispatch({
            type: FOCUS_CHANNEL_POST,
            payload: {
              messages: currentMessages,
              channelId: channelId,
              postId: postId,
            },
          });
        };
      }
    }
  }

  return { type: FOCUS_CHANNEL_POST_FAIL };
};
const RedirectChildMessagesActions = (
  channelId,
  postId,
  childPostId,
  dispatch
) => {
  let requestPosts = true;
  let state = store.getState();
  let currentChannelId = state.config.activeSelectedChannel.id;
  let currentMessages = state.channelMessages.messages;
  if (channelId === currentChannelId) {
    for (var i = 0; i < currentMessages.length; i++) {
      if (currentMessages[i].post.id === postId) {
        requestPosts = false;
        return (dispatch) => {
          dispatch({
            type: REDIRECT_CHANNEL_MESSAGES_SUCCESS,
            payload: {
              messages: currentMessages,
              channelId: channelId,
              postId: postId,
            },
          });
          dispatch(redirectToReply(channelId, postId, childPostId, dispatch));
        };
      }
    }
  }
  if (requestPosts) {
    return createAction({
      endpoint:
        API_BASE_URL +
        `/ent/v3/message?channelId=${channelId}&historyMessage=true&postId=${postId}&isFresh=false`,
      method: API_METHODS.GET,
      headers: AuthHeader(),
      types: [
        REDIRECT_CHANNEL_MESSAGES,
        {
          type: REDIRECT_CHANNEL_MESSAGES_SUCCESS,
          payload: (action, state, res) => {
            const contentType = res.headers.get("Content-Type");
            if (contentType && ~contentType.indexOf("json")) {
              // Just making sure res.json() does not raise an error
              return res.json().then(async (json) => {
                if (json && json.data) {
                  setTimeout(() => {
                    dispatch(
                      redirectToReply(channelId, postId, childPostId, dispatch)
                    );
                  }, 1000);
                  const updateData = await modifyMessages(channelId, json.data);
                  return {
                    messages: updateData,
                    channelId,
                    postId,
                  };
                } else {
                  return { messages: [], channelId };
                }
              });
            }
          },
        },
        REDIRECT_CHANNEL_MESSAGES_ERROR,
      ],
    });
  }
};
//New ACTion Created for REdirect API : Currently using Same API for message Fetching on redirection but will update once backend get a way to do level order traversal
const RedirectMessagesActions = (
  channelId,
  postId,
  dispatch,
  moveToBottomPostFlag
) => {
  let requestPosts = true;
  let state = store.getState();
  let currentChannelId = state.config.activeSelectedChannel.id;
  let currentMessages = state.channelMessages.messages;
  if (channelId === currentChannelId) {
    for (var i = 0; i < currentMessages.length; i++) {
      if (currentMessages[i].post.id === postId) {
        requestPosts = false;
        return (dispatch) => {
          dispatch({
            type: REDIRECT_CHANNEL_MESSAGES_SUCCESS,
            payload: {
              messages: currentMessages,
              channelId: channelId,
              postId: postId,
              moveToBottomPostFlag: moveToBottomPostFlag,
            },
          });
        };
      }
    }
  }
  if (requestPosts) {
    return createAction({
      endpoint:
        API_BASE_URL +
        `/ent/v3/message?channelId=${channelId}&historyMessage=false&postId=${postId}&isFresh=true`,
      method: API_METHODS.GET,
      headers: AuthHeader(),
      types: [
        REDIRECT_CHANNEL_MESSAGES,
        {
          type: REDIRECT_CHANNEL_MESSAGES_SUCCESS,
          payload: (action, state, res) => {
            const contentType = res.headers.get("Content-Type");
            if (contentType && ~contentType.indexOf("json")) {
              // Just making sure res.json() does not raise an error
              return res.json().then(async (json) => {
                if (json && json.data) {
                  const updateData = await modifyMessages(channelId, json.data);
                  return {
                    messages: updateData,
                    channelId,
                    postId,
                  };
                } else {
                  return { messages: [], channelId };
                }
              });
            }
          },
        },
        REDIRECT_CHANNEL_MESSAGES_ERROR,
      ],
    });
  }
};

function clearScrollFlags() {
  return { type: CLEAR_SCROLL_FLAGS };
}

function redirectToReply(channelId, parentPostId, childPostId, dispatch) {
  let requestPosts = true;
  let state = store.getState();
  let currentChannelId = state.config.activeSelectedChannel.id;
  let filterMessages = state.postReplies?.posts.filter(
    (el) => el.parentPostId === parentPostId
  );
  let currentMessages =
    filterMessages.length > 0 ? filterMessages[0].posts : [];
  let currentParentPostId =
    filterMessages.length > 0 ? filterMessages[0].parentPostId : "";
  if (channelId === currentChannelId) {
    for (var i = 0; i < currentMessages.length; i++) {
      if (
        currentMessages[i].post.id === childPostId &&
        currentParentPostId === parentPostId
      ) {
        requestPosts = false;
        return (dispatch) => {
          dispatch({
            type: REDIRECT_CHANNEL_REPLY_MESSAGES_SUCCESS,
            payload: {
              messages: currentMessages,
              parentPostId: parentPostId,
              postId: childPostId,
            },
          });
        };
      }
    }
  }
  if (requestPosts) {
    return createAction({
      // endpoint: "http://vis.monolydev.com:3002/mocks/replies.json",
      endpoint:
        API_BASE_URL +
        `/ent/v1/message/${parentPostId}?channelId=${channelId}&historyMessage=false&postId=${childPostId}&isFresh=true`,
      method: API_METHODS.GET,
      headers: AuthHeader(),
      types: [
        FETCH_POST_REPLY,
        {
          type: REDIRECT_CHANNEL_REPLY_MESSAGES_SUCCESS,
          payload: (action, state, res) => {
            const contentType = res.headers.get("Content-Type");
            if (contentType && ~contentType.indexOf("json")) {
              return res.json().then((json) => {
                return {
                  messages: json.data || [],
                  postId: childPostId,
                  parentPostId: parentPostId,
                };
              });
            }
          },
        },
        FETCH_POST_REPLY_ERROR,
      ],
    });
  }
}

const getEmbeddedLinkData = (requestParams, passDispatch) => {
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
                post_id: requestParams?.post_id,
              },
              dispatch = passDispatch
            ) => {
              if (result === undefined) {
                dispatch(getEmbeddedLinkDataAction(params));
              } else {
                const data = { ...result.value };
                dispatch({
                  type: FETCH_EMBEDDED_LINK_SUCCESS,
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
              dispatch(getEmbeddedLinkDataAction(params));
            }
          );
      });
  };
};

const getEmbeddedLinkDataAction = (requestParams) =>
  createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/post/previewlink?site=${requestParams.site}&channel_id=${requestParams.channel_id}&post_id=${requestParams.post_id}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,

    types: [
      FETCH_EMBEDDED_LINK_REQUEST,
      {
        type: FETCH_EMBEDDED_LINK_SUCCESS,
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
        type: FETCH_EMBEDDED_LINK_ERROR,
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

function cleanMessages(channelId) {
  return {
    type: CLEAN_MESSAGES,
    payload: { channelId: channelId },
  };
}

const fetchForwardDetailsById = (queryParams) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      `/ent/v1/fwdmessage?id=${queryParams.postId}&channelID=${queryParams.channelId}`,
    headers: AuthHeader(),
    method: API_METHODS.GET,
    types: [
      FETCH_MAIN_POST_FORWARD_DETAILS,
      {
        type: FETCH_MAIN_POST_FORWARD_SUCCESS,
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
      {
        type: FETCH_MAIN_POST_FORWARD_ERROR,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.code,
                mainPostId: queryParams.mainPostId,
                fwdPostId: queryParams.postId,
              };
            });
          }
        },
      },
    ],
  });
};
const toggleUnreadMessage = (channelId, isMessageFilterEnabled) => ({
  type: TOGGLE_UNREAD_MESSAGE,
  payload: {
    channelId,
    isMessageFilterEnabled,
  },
});

export {
  toggleEditor,
  setPostToReply,
  channelMessagesActions,
  unreadChannelMessagesActions,
  appendMessageToChannels,
  postMessageToServer,
  getTimelineMessagesActions,
  updateLastReadPost,
  postTagToServer,
  postTaskToServer,
  fetchTagDetails,
  removeTag,
  RedirectMessagesActions,
  RedirectChildMessagesActions,
  redirectToReply,
  focusOnPostActions,
  clearScrollFlags,
  cleanMessages,
  getEmbeddedLinkData,
  fetchForwardDetailsById,
  toggleUnreadMessage,
  setLastPost,
};
