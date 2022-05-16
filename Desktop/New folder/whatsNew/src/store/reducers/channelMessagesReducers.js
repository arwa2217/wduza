import {
  LOAD_CHANNEL_MESSAGES,
  LOAD_CHANNEL_MESSAGES_SUCCESS,
  LOAD_CHANNEL_MESSAGES_ERROR,
  LOAD_CHANNEL_TIMELINE_MESSAGES_SUCCESS,
  POST_CHANNEL_MESSAGE,
  POST_CHANNEL_MESSAGE_SUCCESS,
  POST_CHANNEL_MESSAGE_ERROR,
  CLEAN_MESSAGES,
  POST_CHANNEL_TAG,
  POST_CHANNEL_TAG_SUCCESS,
  POST_CHANNEL_TAG_ERROR,
  FETCH_TAG_DETAILS,
  FETCH_TAG_DETAILS_SUCCESS,
  FETCH_TAG_DETAILS_ERROR,
  UPDATE_CHANNEL_MESSAGES,
  UPDATE_MESSAGES_TAG,
  REMOVE_TAG,
  REMOVE_TAG_SUCCESS,
  REMOVE_TAG_ERROR,
  REDIRECT_CHANNEL_MESSAGES,
  REDIRECT_CHANNEL_MESSAGES_SUCCESS,
  REDIRECT_CHANNEL_MESSAGES_ERROR,
  UPDATE_POST_REACTIONS,
  CLEAR_SCROLL_FLAGS,
  UPDATE_EDITED_POST,
  FOCUS_CHANNEL_POST,
  FETCH_EMBEDDED_LINK_REQUEST,
  FETCH_EMBEDDED_LINK_SUCCESS,
  FETCH_EMBEDDED_LINK_ERROR,
  RESET_EMBEDDED_LINK_DATA,
  UPDATE_FILE_INFO_STATS,
  FILE_PREVIEW_AVAILABLE,
  CLEAR_PREVIEW_AVAILABLE_FLAG,
  UPDATE_MESSAGE_TASK,
  UPDATE_FORWARDED_FILE_INFO,
  MARK_POST_READ_STATUS,
  UNREAD_FILTER_SCROLL_UP,
  SET_MESSAGE_SCROLL_FLAG,
  LOAD_UNREAD_MESSAGES,
  LOAD_UNREAD_MESSAGES_SUCCESS,
  LOAD_UNREAD_MESSAGES_ERROR,
  TOGGLE_UNREAD_MESSAGE,
  FOCUS_CHANNEL_POST_FAIL,
  TOGGLE_EDITOR,
  SET_POST_TO_REPLY,
  LAST_POST
} from "../actionTypes/channelMessagesTypes";
import {
  CurrentChannelMessagesCapacity,
  POST_WINDOW_HOLDING_MIN_CAPACITY,
} from "../../constants";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import {
  ADD_REACTION_SUCCESS,
  REMOVE_REACTION_SUCCESS,
} from "../actionTypes/post-reaction-action-type";
import {
  addUserReaction,
  removeUserReaction,
  updatePostReactions,
  updatePostTags,
  hasValidMessageSequence,
} from "../../components/utils/post-utils";
import {
  UPDATE_MESSAGES_SAVE,
  DELETE_MESSAGES_SAVE,
  UPDATE_HIDDEN_POST,
  UPDATE_PARENT_POST_COUNT,
  UPDATE_UNHIDDEN_POST,
  UPDATE_HIDDEN_FORWARD_POST,
  UPDATE_UNHIDDEN_FORWARD_POST,
  EDIT_FORWARDED_POST,
  UPDATE_FILE_INFO_STATS_FORWARD,
  UPDATE_FORWARDED_POST_STATUS,
  UPDATE_DELETE_INFO_STATS_FORWARD,
  POST_FWD_BY_EMAIL,
} from "../actionTypes/my-saves-action-types";
import { isEmptyObject } from "../../utilities/utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";

import {
  FETCH_MAIN_POST_FORWARD_DETAILS,
  FETCH_MAIN_POST_FORWARD_SUCCESS,
  FETCH_MAIN_POST_FORWARD_ERROR,
} from "../actionTypes/post-forward-action-types";

const updateEditMessages = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.post.id === payload.message.post.id) {
      message.post = payload.message.post;
      message.fileInfo = payload.message.fileInfo;
      message.embeddedLinkData = payload.message.embededlinkDetails;
      message.embededlink = payload.message.embededlink;
      message.embeddedLinkData = undefined;
      message.task = payload.message.task;
    }
  });
  return currentMessages;
};
const updatePostSave = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      message.savedPost = true;
    }
  });
  return currentMessages;
};

const updatePostUnHide = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  let index = currentMessages.findIndex((message) => {
    return message.id === payload.postId;
  });
  if (index !== -1) {
    let forwardedPostObj = currentMessages[index].forwardedPost;
    currentMessages[index] = payload.post;
    currentMessages[index].forwardedPost = forwardedPostObj;
  }
  return currentMessages;
};

const updatePostHide = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.id === payload.postId) {
      message.isHidden = payload.isHidden;
    }
  });
  return currentMessages;
};

const updatePostForwardHide = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  payload.ForwardedPostChannels &&
    payload.ForwardedPostChannels.map((item, index) => {
      if (item?.channelID === payload.currentChannelId) {
        const forwardIndex = currentMessages?.findIndex(
          (value) => item.id === value?.id
        );
        if (forwardIndex >= 0) {
          currentMessages[forwardIndex].forwardedPost.isHidden = true;
        }
      }
      return item;
    });
  return currentMessages;
};
const updatePostForwardUnHide = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  payload.ForwardedPostChannels &&
    payload.ForwardedPostChannels.map((item, index) => {
      if (item?.channelID === payload.currentChannelId) {
        const forwardIndex = currentMessages?.findIndex(
          (value) => item.id === value?.id
        );
        if (forwardIndex >= 0) {
          currentMessages[forwardIndex].forwardedPost.isHidden = false;
          currentMessages[forwardIndex].forwardedPost.post =
            payload.message.post.post;
        }
      }
      return item;
    });
  return currentMessages;
};
const updateEditPostForward = (stateMessages = [], payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages?.length > 0 &&
    currentMessages.map((item, i) => {
      if (
        payload.postId === item?.forwardedPost?.post?.id &&
        payload.channelId === item?.forwardedPost.channelId
      ) {
        item.forwardedPost = payload.post;
      }
      return item;
    });
  return currentMessages;
};

const updateReplyPostCount = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.id === payload.parentPostId) {
      message.replyCount = payload.replyCount;
      message.hiddenReplyCount = payload.hiddenReplyCount;
    }
  });
  return currentMessages;
};
const deletePostSave = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      message.savedPost = false;
    }
  });
  return currentMessages;
};
const updateFileInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      let foundData = message.fileList.find(
        (el) => el.fileId === payload.fileId
      );
      foundData.status = UploadStatus.DELETED;
      // if (message.fileInfo.fileId === payload.fileId) {
      //   message.fileInfo.status = UploadStatus.DELETED;
      // }
    }
    return message;
  });
  return currentMessages;
};

const updateForwardedFileInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      let foundData = message.forwardedPost.fileList.find(
        (el) => el.fileId === payload.fileId
      );
      foundData.status = UploadStatus.DELETED;
      // if (message.fileInfo.fileId === payload.fileId) {
      //   message.fileInfo.status = UploadStatus.DELETED;
      // }
    }
    return message;
  });
  return currentMessages;
};
const updateForwardedPostInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.mainPostId) {
      message.forwardedPost = payload.data;
    }
    return message;
  });
  return currentMessages;
};

const updateErrorForwardedPost = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.mainPostId) {
      message.forwardedPost.isHidden = true;
    }
    return message;
  });
  return currentMessages;
};

const updateForwardedStats = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  payload.forwards &&
    payload.forwards.map((item, index) => {
      const forwardIndex = currentMessages?.findIndex(
        (value) => item.orgPostID === value?.id
      );
      if (forwardIndex >= 0) {
        currentMessages[forwardIndex].fwdStats = payload;
      }
      return item;
    });
  return currentMessages;
};

const postFwdByEmailUpdated = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  payload.emailFwdHistory &&
    payload.emailFwdHistory.length > 0 &&
    payload.emailFwdHistory.emailFwdHistory.map((item, index) => {
      const forwardIndex = currentMessages?.findIndex(
        (value) => item.postId === value?.id
      );
      if (forwardIndex >= 0) {
        currentMessages[forwardIndex].emailFwdHistory = payload.emailFwdHistory;
      }
      return item;
    });
  console.log(currentMessages);
  return currentMessages;
};

const markPostReadStatus = (stateMessages, readPostList) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (readPostList && readPostList.includes(message.post.id)) {
      message.isUnread = false;
    }
    return message;
  });
  return currentMessages;
};

const updateEmbeddedLinkInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.data?.post_id) {
      if (message.embeddedLinkData) {
        if (
          message.embeddedLinkData.findIndex(
            (linkData) => linkData.imageId === payload.data.imageId
          ) === -1
        ) {
          message.embeddedLinkData.push(payload.data);
        }
      } else {
        message.embeddedLinkData = [];
        message.embeddedLinkData.push(payload.data);
      }
    }
    if (message.forwardedPost?.post?.id === payload.data?.post_id) {
      if (message.embeddedLinkData) {
        if (
          message.forwardedPost?.embeddedLinkData?.findIndex(
            (linkData) => linkData.imageId === payload.data.imageId
          ) === -1
        ) {
          message.forwardedPost.embeddedLinkData.push(payload.data);
        }
      } else {
        message.forwardedPost.embeddedLinkData = [];
        message.forwardedPost.embeddedLinkData.push(payload.data);
      }
    }

    return message;
  });
  return currentMessages;
};
const resetEmbeddedLinkInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      message.embeddedLinkData = undefined;
    }
    return message;
  });
  return currentMessages;
};

const updateFileInfoStats = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      let foundData = message.fileList.find(
        (el) => el.fileId === payload.fileId
      );
      foundData.fileDLStats = payload.fileDLStats;
      // if (message.fileInfo.fileId === payload.fileId) {
      //   message.fileInfo.fileDLStats = payload.fileDLStats;
      // }
    }
    return message;
  });
  return currentMessages;
};
const updateFileInfoStatsFwd = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.forwardedPost.post.id === payload.postId) {
      let foundData = message.forwardedPost.fileList.find(
        (el) => el.fileId === payload.fileId
      );
      foundData.fileDLStats = payload.fileDLStats;
    }
    return message;
  });
  return currentMessages;
};
const updateFwdPostDeleteChannel = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  payload.fwdPostList &&
    payload.fwdPostList.map((item, index) => {
      const forwardIndex = currentMessages?.findIndex(
        (value) => item.fwdPostID === value?.post?.id
      );
      if (forwardIndex >= 0) {
        currentMessages[forwardIndex].forwardedPost.isHidden = true;
      }
      // }
      // return message;
      return item;
    });
  return currentMessages;
};

const updateTaskStatus = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      if (message.forwardedPost && !isEmptyObject(message.forwardedPost.task)) {
        //creating shallow copy of forwardedPost to notify channel-messages class that somethings has changed inside the forwardedPost
        var forwardedPostTemp = Object.assign({}, message.forwardedPost);
        forwardedPostTemp.task.taskStatus = payload.taskState;
        message.forwardedPost = forwardedPostTemp;
      } else if (!isEmptyObject(message.task)) {
        message.task.taskStatus = payload.taskState;
      }
    }
    return message;
  });
  return currentMessages;
};

const handleFilePreviewAvailability = (stateMessages, payload) => {
  let currentMessages = stateMessages.slice();
  currentMessages.map((message) => {
    if (message.post.id === payload.postId) {
      if (message.fileInfo.fileId === payload.fileId) {
        message.fileInfo.previewAvailable = true;
      }
    }
    return message;
  });
  return currentMessages;
};

const updateCopyMessages = (
  stateMessages,
  messages,
  actualRequired,
  scrollDirection
) => {
  //var size = actualRequired;
  var size = messages.length;
  var length =
    stateMessages.length > messages.length
      ? messages.length
      : stateMessages.length;
  for (var i = 0; i < length; i++) {
    for (var index = 0; index < stateMessages.length; index++) {
      if (
        (stateMessages[index].id &&
          (stateMessages[index].id === messages[i].id ||
            (messages[i].post &&
              stateMessages[index].id === messages[i].post.id))) ||
        (stateMessages[index].post.id &&
          (stateMessages[index].post.id === messages[i].id ||
            (messages[i].post &&
              stateMessages[index].post.id === messages[i].post.id)))
      ) {
        let forwardedPostObj = stateMessages[index].forwardedPost;
        stateMessages[index] = messages[i];
        stateMessages[index].forwardedPost = forwardedPostObj;
        // stateMessages[index] = messages[i];
        size = size - 1;
        break;
      }
    }
  }
  var newData = [];
  for (var j = 0; j < size; j++) {
    if (scrollDirection === -1) {
      newData[j] = messages[j];
    } else {
      newData[j] = messages[messages.length - size + j];
    }
  }

  return [stateMessages, newData, size];
};

const isDifferent = (previousMsgs, newMsgs) => {
  return JSON.stringify(previousMsgs) !== JSON.stringify(newMsgs);
};

const initialState = {
  messages: [],
  loadingTop: false,
  loadingBottom: false,
  scrollToTop: false,
  toggleUnreadMessage: false,
  toggleEditor: false,
  postToReply: {},
  lastPost: undefined,
};

const ChannelMessagesReducer = (state = initialState, action) => {
  const nextState = (previousMessages, nextMessages) => {
    if (isDifferent(previousMessages, nextMessages)) {
      return {
        ...state,
        messages: nextMessages,
        scrollToBottom: false,
        scrollToTop: false,
        avoidScrolling: true,
      };
    }
    return state;
  };

  switch (action.type) {
    case CLEAN_MESSAGES: {
      return {
        ...initialState,
        messages: [],
        channelId: state.channelId,
        toggleUnreadMessage: state.toggleUnreadMessage,
      };
    }
    case TOGGLE_EDITOR: {
      return {
        ...state,
        toggleEditor:
            action.payload.toggle,
        lastPost: action.payload.currentPost,
      };
    }
    case SET_POST_TO_REPLY: {
      return {
        ...state,
        postToReply: action.payload,
      };
    }
    case LAST_POST: {
      return {
        ...state,
        lastPost: undefined,
      };
    }
    case LOAD_UNREAD_MESSAGES:
    case LOAD_CHANNEL_MESSAGES: {
      return {
        ...state,
        messages: state.messages,
        loadingTop: action.payload.scrollDirection === -1,
        loadingBottom: false,
      };
    }
    case LOAD_UNREAD_MESSAGES_ERROR:
    case LOAD_CHANNEL_MESSAGES_ERROR: {
      return {
        ...state,
        loadingTop: false,
        loadingBottom: false,
        messages: state.messages,
        messagesRetrieveError: "There is error while retrieving the messages",
      };
    }
    case LOAD_UNREAD_MESSAGES_SUCCESS:
    case LOAD_CHANNEL_MESSAGES_SUCCESS: {
      let message;
      const isOutLookForward = action?.payload?.isOutLookForward;
      if (action.payload?.messages?.length > 0) {
        message = action.payload.messages[0];
      }
      if (message?.parentId && state.messages.length > 0) {
        //increasing post reply count
        const parentPostContent = message?.parentPostContent || {};
        state.scrollToBottom = false;
        state.avoidScrolling = true;
        const msgs = state.messages.filter(
          (post) => post.post.id === message.parentId
        );
        if (msgs.length > 0) {
          msgs[0].replyCount = message.parentReplyCount;
        }
        let messageData = [...state.messages];
        if (Object.keys(parentPostContent).length) {
          messageData = [...state.messages, message];
        }
        return {
          ...state,
          messages: messageData,
          scrollToBottom: false,
          scrollToTop: false,
          avoidScrolling: true,
        };
      }
      const stateMessages = state.messages || [];
      if (!stateMessages.length) {
        return {
          ...state,
          messages: action.payload.messages,
          channelId: action.payload.channelId,
          scrollToBottom: state.toggleUnreadMessage ? false : true,
          scrollToTop: state.toggleUnreadMessage ? true : false,
          loadingTop: false,
          loadingBottom: false,
        };
      } else {
        let {
          messages,
          scrollDirection,
          channelId,
          noChannelSwitch,
          clearPrevious,
          preserveScrollPosition,
        } = action.payload;

        let loadingTopOldState = !!state.loadingTop;
        let loadingBottomOldState = !!state.loadingBottom;

        let loadingTop = scrollDirection === -1;
        let loadingBottom = scrollDirection === 1;

        let isSequenceValid;
        if (channelId !== state.channelId || clearPrevious) {
          if (noChannelSwitch) {
            return state;
          }
          return {
            ...state,
            messages: action.payload.messages,
            channelId: channelId,
            scrollToBottom: state.toggleUnreadMessage ? false : true,
            scrollToTop: state.toggleUnreadMessage ? true : false,
            moveToBottom: state.toggleUnreadMessage ? false : true,
            loadingBottom: false,
            loadingTop: loadingTop,
          };
        }
        if (messages && !messages.length) {
          return {
            ...state,
            messages: state.messages,
            channelId: state.channelId,
            skipScrolling: true,
            loadingTop: false,
            loadingBottom: false,
            scrollToBottom: false,
            scrollToTop:
              state.toggleUnreadMessage && state.messages.length === 0
                ? true
                : false,
          };
        }
        if (scrollDirection === undefined) {
          if (!isOutLookForward) {
            isSequenceValid = hasValidMessageSequence(
              state.messages,
              messages[0]
            );
          }
          if (!isSequenceValid) {
            return {
              ...state,
            };
          }
        }
        let autoScroll = false;
        if (!scrollDirection) {
          scrollDirection = 1;
          autoScroll = true;
        }

        if (
          !messages ||
          (state.messages.length > 0 &&
            JSON.stringify(messages.length) === JSON.stringify(messages))
        ) {
          return state;
        }

        /*
        TODO We have to handle this in future
        if(loadingTopOldState != loadingTop && loadingBottomOldState != loadingBottom){
          console.log("Discarding payload response as scrollDirection is changed. {loadingTopOldState, loadingTop}, {loadingBottomOldState, loadingBottom} = ",loadingTopOldState, loadingTop, loadingBottomOldState, loadingBottom);
          //Payload response does not have valid scroll direction, At this time user are moving another scroll direction , so we don't need this response.
          return {
            ...state
          }
        }*/

        let remainingCapacity =
          CurrentChannelMessagesCapacity - stateMessages.length;
        let requiredVacancy = messages.length;
        if (remainingCapacity < requiredVacancy) {
          let filterMessages = [];
          let actualRequired = requiredVacancy - remainingCapacity;
          if (scrollDirection === -1) {
            const [updatedMessages, newData] = updateCopyMessages(
              stateMessages,
              messages,
              actualRequired,
              scrollDirection
            );
            let firstIndexForRemoval = POST_WINDOW_HOLDING_MIN_CAPACITY; //updatedMessages.length - size;
            updatedMessages.splice(firstIndexForRemoval);
            filterMessages = [...newData, ...updatedMessages];
          } else {
            const [updatedMessages, newData] = updateCopyMessages(
              stateMessages,
              messages,
              actualRequired,
              scrollDirection
            );
            updatedMessages.splice(0, POST_WINDOW_HOLDING_MIN_CAPACITY);

            filterMessages = [...updatedMessages, ...newData];
          }
          if (!isDifferent(filterMessages, state.messages)) {
            return {
              ...state,
              messages: state.messages,
              loadingBottom: false,
              loadingTop: false,
              autoScroll: false,
              channelId: state.channelId,
            };
          }
          return {
            ...state,
            messages: filterMessages,
            autoScroll,
            channelId: channelId,
            loadingTop,
            loadingBottom,
            preserveScrollPosition,
          };
        } else {
          if (scrollDirection === -1) {
            const [updatedMessages, newData] = updateCopyMessages(
              stateMessages,
              messages,
              messages.length,
              scrollDirection
            );

            let updatedMsgs = [...newData, ...updatedMessages];
            if (!isDifferent(updatedMsgs, state.messages)) {
              return {
                ...state,
                messages: state.messages,
                loadingBottom: false,
                loadingTop: false,
                autoScroll: false,
                channelId: state.channelId,
              };
            }
            return {
              ...state,
              messages: updatedMsgs,
              autoScroll,
              channelId: channelId,
              loadingTop,
              loadingBottom,
              preserveScrollPosition,
            };
          } else {
            const [updatedMessages, newData] = updateCopyMessages(
              stateMessages,
              messages,
              messages.length,
              scrollDirection
            );
            const updatedMsgs = [...updatedMessages, ...newData];

            if (!isDifferent(updatedMsgs, state.messages)) {
              return {
                ...state,
                messages: state.messages,
                loadingBottom: false,
                loadingTop: false,
                autoScroll: false,
                channelId: state.channelId,
              };
            }
            return {
              ...state,
              messages: updatedMsgs || state.messages,
              autoScroll,
              loadingTop,
              loadingBottom,
              channelId: state.channelId,
              scrollToBottom: scrollDirection === 1,
              preserveScrollPosition,
            };
          }
        }
      }
    }
    case LOAD_CHANNEL_TIMELINE_MESSAGES_SUCCESS: {
      if (!action.payload.messages.length) {
        return state;
      }
      return {
        ...state,
        messages: action.payload.messages,
        selectedTimeline: true,
        channelId: action.payload.channelId,
      };
    }
    case POST_CHANNEL_MESSAGE: {
      const messages = state?.messages?.length
        ? state.messages
        : [state.messages];

      if (messages && !messages[0]?.post) {
        return state;
      }
      let messagesList = messages.map((message) => {
        if (message.post.id === action.payload.messageId) {
          return {
            ...message,
            post: { ...message.post, postStatus: "sending" },
          };
        } else {
          return message;
        }
      });
      return {
        ...state,
        messages: messagesList,
        channelId: state.channelId,
        moveToBottom: action.payload.moveToBottom,
      };
    }
    case POST_CHANNEL_MESSAGE_SUCCESS: {
      if (action.payload.reply && action.payload.reply.isReply) {
        return state;
      }
      const msgs = state.messages.map((message) => {
        if (message?.post?.id === action.payload?.post?.id) {
          if (action.payload.success) {
            return {
              ...message,
              post: { ...message.post, postStatus: "success" },
            };
          } else {
            return {
              ...message,
              post: { ...message?.post, postStatus: "failed" },
            };
          }
        } else {
          return message;
        }
      });

      return {
        ...state,
        messages: msgs,
        channelId: state.channelId,
        avoidScrolling: true,
        moveToBottom: false,
      };
    }
    case POST_CHANNEL_MESSAGE_ERROR: {
      const messagesList = state.messages.map((message) => {
        if (message?.post?.id === action?.payload?.postMessage?.post?.id) {
          return {
            ...message,
            post: { ...message?.post, postStatus: "failed" },
          };
        } else {
          return message;
        }
      });
      return {
        ...state,
        messages: messagesList,
        channelId: state.channelId,
        moveToBottom: false,
      };
    }
    case POST_CHANNEL_TAG:
      return {
        ...state,
        fetchedUserType: false,
      };
    case POST_CHANNEL_TAG_ERROR:
      action.payload = {
        code: 2001,
        message: "Request successfully processed.",
        data: "",
      };
      return {
        ...state,
        postTag: true,
        getTagResponse: action.payload,
      };
    case POST_CHANNEL_TAG_SUCCESS:
      action.payload = {
        code: 2001,
        message: "Request successfully processed.",
        data: "",
      };
      return {
        ...state,
        fetchedUserType: true,
        getTagResponse: "",
      };

    case FETCH_TAG_DETAILS:
    case FETCH_TAG_DETAILS_ERROR:
      return {
        ...state,
        fetchedTagDetails: false,
      };
    case FETCH_TAG_DETAILS_SUCCESS:
      return {
        ...state,
        fetchedTagDetails: true,
        getTagResponse: action.payload,
      };
    case UPDATE_CHANNEL_MESSAGES: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateFileInfo(stateMessages, action.payload),
      };
    }
    case UPDATE_MESSAGES_TAG: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostTags(stateMessages, action.payload),
        preserveScrollPosition: action.payload.preserveScrollPosition,
      };
    }
    case UPDATE_MESSAGES_SAVE: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostSave(stateMessages, action.payload),
      };
    }
    case UPDATE_HIDDEN_POST: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostHide(stateMessages, action.payload),
      };
    }

    case UPDATE_HIDDEN_FORWARD_POST: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostForwardHide(stateMessages, action.payload),
      };
    }

    case UPDATE_UNHIDDEN_FORWARD_POST: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostForwardUnHide(stateMessages, action.payload),
      };
    }
    case EDIT_FORWARDED_POST: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateEditPostForward(stateMessages, action.payload),
      };
    }
    case UPDATE_UNHIDDEN_POST: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostUnHide(stateMessages, action.payload),
      };
    }
    case DELETE_MESSAGES_SAVE: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: deletePostSave(stateMessages, action.payload),
      };
    }

    case UPDATE_EDITED_POST: {
      let stateMessages = state.messages;

      return {
        ...state,
        messages: updateEditMessages(stateMessages, action.payload),
        preserveScrollPosition: action.payload.preserveScrollPosition,
      };
    }

    case UPDATE_POST_REACTIONS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updatePostReactions(stateMessages, action.payload),
        preserveScrollPosition: action.payload.preserveScrollPosition,
      };
    }

    case REMOVE_REACTION_SUCCESS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: removeUserReaction(stateMessages, action.payload),
      };
    }
    case ADD_REACTION_SUCCESS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: addUserReaction(stateMessages, action.payload),
      };
    }

    case REMOVE_TAG:
    case REMOVE_TAG_SUCCESS:
    case REMOVE_TAG_ERROR:
      return { ...state };
    case REDIRECT_CHANNEL_MESSAGES: {
      return {
        ...state,
        loadingTop: false,
        loadingBottom: false,
      };
    }

    case REDIRECT_CHANNEL_MESSAGES_SUCCESS: {
      let lastSelectedChannelId = getLastSelectedChannelId();
      if (
        lastSelectedChannelId &&
        lastSelectedChannelId !== action.payload?.channelId
      ) {
        return {
          ...state,
        };
      } else {
        if (action.payload?.messages?.length > 0) {
          state.messages = action.payload.messages;
          return {
            ...state,
            redirectPost: action.payload?.postId,
            moveToBottomPostFlag: action.payload?.moveToBottomPostFlag,
            scrollToBottom: false,
            scrollToTop: false,
            avoidScrolling: false,
          };
        }
      }
      return {
        ...state,
      };
    }

    case FOCUS_CHANNEL_POST: {
      if (action.payload?.messages?.length > 0) {
        state.messages = action.payload.messages;
        return {
          ...state,
          focusPostId: action.payload.postId,
          scrollToBottom: false,
          scrollToTop: false,
          moveToBottom: false,
          avoidScrolling: false,
        };
      }
      return state;
    }
    case FOCUS_CHANNEL_POST_FAIL:
      return { ...state };
    case REDIRECT_CHANNEL_MESSAGES_ERROR: {
      return {
        ...state,
        messages: state.messages,
        messagesRetrieveError: "There is error while retrieving the messages",
      };
    }
    case CLEAR_SCROLL_FLAGS: {
      return {
        ...state,
        redirectPost: null,
        loadingTop: false,
        loadingBottom: false,
        moveToBottom: false,
        preserveScrollPosition: false,
        focusPostId: null,
        focusLastPostIfVisible: false,
        scrollToTop: false,
      };
    }
    case FETCH_EMBEDDED_LINK_REQUEST: {
      return {
        ...state,
        fetchingEmbeddedData: true,
        fetchedEmbeddedData: false,
        fetchingEmbeddedDataError: false,
      };
    }
    case FETCH_EMBEDDED_LINK_SUCCESS: {
      let stateMessages = state.messages;
      let focusLastPostIfVisible = undefined;
      let postId = action.payload.data?.post_id;
      let matchedIndex = stateMessages.findIndex(
        (msg) => msg.post.id === postId
      );
      if (matchedIndex !== -1) {
        focusLastPostIfVisible = true;
      } else {
        focusLastPostIfVisible = state.focusLastPostIfVisible;
      }
      return {
        ...state,
        focusLastPostIfVisible: focusLastPostIfVisible,
        fetchingEmbeddedData: false,
        fetchedEmbeddedData: true,
        fetchingEmbeddedDataError: false,
        messages: updateEmbeddedLinkInfo(stateMessages, action.payload),
      };
    }
    case FETCH_EMBEDDED_LINK_ERROR: {
      let stateMessages = state.messages;
      return {
        ...state,
        fetchingEmbeddedData: false,
        fetchedEmbeddedData: true,
        fetchingEmbeddedDataError: true,
        messages: updateEmbeddedLinkInfo(stateMessages, action.payload),
      };
    }
    case RESET_EMBEDDED_LINK_DATA: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: resetEmbeddedLinkInfo(stateMessages, action.payload),
      };
    }

    case UPDATE_FILE_INFO_STATS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateFileInfoStats(stateMessages, action.payload),
      };
    }

    case UPDATE_FILE_INFO_STATS_FORWARD: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateFileInfoStatsFwd(stateMessages, action.payload),
      };
    }

    case FILE_PREVIEW_AVAILABLE: {
      let stateMessages = state.messages;
      return {
        ...state,
        filePreviewAvailableId: action.payload.fileId,
        messages: handleFilePreviewAvailability(stateMessages, action.payload),
      };
    }
    case CLEAR_PREVIEW_AVAILABLE_FLAG: {
      return {
        ...state,
        filePreviewAvailableId: undefined,
      };
    }
    case UPDATE_MESSAGE_TASK: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateTaskStatus(stateMessages, action.payload),
        preserveScrollPosition: action.payload.preserveScrollPosition,
      };
    }

    case UPDATE_PARENT_POST_COUNT: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateReplyPostCount(stateMessages, action.payload),
      };
    }
    case UPDATE_FORWARDED_FILE_INFO: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateForwardedFileInfo(stateMessages, action.payload),
      };
    }
    case FETCH_MAIN_POST_FORWARD_DETAILS:
      return {
        ...state,
        fetchingPostFwdCount: true,
        fetchedPostFwdCount: false,
      };
    case FETCH_MAIN_POST_FORWARD_ERROR: {
      let stateMessages = state.messages;
      if (action.payload.data === 40012) {
        return {
          ...state,
          messages: updateErrorForwardedPost(stateMessages, action.payload),
        };
      }
      return {
        ...state,
      };
    }
    case FETCH_MAIN_POST_FORWARD_SUCCESS:
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateForwardedPostInfo(stateMessages, action.payload),
      };
    case UPDATE_DELETE_INFO_STATS_FORWARD: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateFwdPostDeleteChannel(stateMessages, action.payload),
      };
    }
    case UPDATE_FORWARDED_POST_STATUS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: updateForwardedStats(stateMessages, action.payload),
      };
    }
    case POST_FWD_BY_EMAIL: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: postFwdByEmailUpdated(stateMessages, action.payload),
      };
    }
    case TOGGLE_UNREAD_MESSAGE: {
      const { channelId, isMessageFilterEnabled } = action.payload;
      return {
        ...state,
        channelId: channelId,
        messages: [],
        toggleUnreadMessage:
          isMessageFilterEnabled === undefined
            ? !state.toggleUnreadMessage
            : isMessageFilterEnabled,
      };
    }

    case MARK_POST_READ_STATUS: {
      let stateMessages = state.messages;
      return {
        ...state,
        messages: markPostReadStatus(stateMessages, action.payload.postList),
      };
    }
    case UNREAD_FILTER_SCROLL_UP:
      return { ...state };
    case SET_MESSAGE_SCROLL_FLAG:
      return {
        ...state,
        scrollToTop: action.payload.scrollToTop,
      };
    default:
      return state;
  }
};

export default ChannelMessagesReducer;
