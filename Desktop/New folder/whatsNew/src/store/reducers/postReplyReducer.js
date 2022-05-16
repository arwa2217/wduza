import {
  FETCH_POST_REPLY,
  FETCH_POST_REPLY_SUCCESS,
  FETCH_POST_REPLY_ERROR,
  CLEAR_MESSAGES_REPLY_POST,
  LOAD_POST_REPLY_SUCCESS,
  FETCH_EMBEDDED_LINK_REQUEST_REPLY,
  FETCH_EMBEDDED_LINK_SUCCESS_REPLY,
  FETCH_EMBEDDED_LINK_ERROR_REPLY,
  UPDATE_FILE_INFO_STATS_REPLY,
  UPDATE_REPLY_FILE_INFO,
  UPDATE_CURRENT_SELECTED_PARENT_POST,
  CLEAR_MESSAGES_REPLY_POST_FOR_PARENT,
} from "../actionTypes/commonActionTypes";
import {
  UPDATE_MESSAGES_SAVE,
  DELETE_MESSAGES_SAVE,
  UPDATE_FORWARDED_POST_STATUS,
} from "../actionTypes/my-saves-action-types";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import {
  LOAD_CHANNEL_MESSAGES_SUCCESS,
  UPDATE_MESSAGES_TAG,
  UPDATE_POST_REACTIONS,
  REDIRECT_CHANNEL_REPLY_MESSAGES_SUCCESS,
  REQUEST_POST_OPEN_MESSAGES_SUCCESS,
  REQUEST_POST_CLOSE_MESSAGES_SUCCESS,
  CLEAR_REDIRECT_POST_FLAG,
  MARK_POST_READ_STATUS,
} from "../actionTypes/channelMessagesTypes";

import {
  ADD_REACTION_SUCCESS,
  REMOVE_REACTION_SUCCESS,
} from "../actionTypes/post-reaction-action-type";
import {
  UPDATE_HIDDEN_REPLY_POST,
  UPDATE_UNHIDDEN_REPLY_POST,
} from "../actionTypes/my-saves-action-types";
import {
  addUserReaction,
  removeUserReaction,
  updatePostReactions,
  updatePostTags,
} from "../../components/utils/post-utils";

import { UPDATE_EDITED_POST } from "../actionTypes/channelMessagesTypes";

const updateEditMessages = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages &&
    currentMessages.map((message) => {
      if (message.post.id === payload.message.post.id) {
        message.post = payload.message.post;
        message.embeddedLinkData = payload.message.embededlinkDetails;
        message.embededlink = payload.message.embededlink;
        message.embeddedLinkData = undefined;
      }
      return message;
    });
  return currentMessages;
};
const updatePostSave = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages &&
    currentMessages.map((message) => {
      if (message.post.id === payload.postId) {
        message.savedPost = true;
      }
      return message;
    });
  return currentMessages;
};
const updatePostHide = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages &&
    currentMessages.map((message) => {
      if (message.id === payload.postId) {
        message.isHidden = payload.isHidden;
      }
      return message;
    });
  return currentMessages;
};
const updatePostUnHide = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  // eslint-disable-next-line array-callback-return
  let index = currentMessages.findIndex((message) => {
    return message.id === payload.postId;
  });
  if (index !== -1) {
    currentMessages[index] = payload.post;
    currentMessages[index].channelId = payload.channelId;
    currentMessages[index].post_type = "MESSAGE";
  }
  return currentMessages;
};

const deletePostSave = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  // eslint-disable-next-line array-callback-return
  currentMessages &&
    currentMessages.map((message) => {
      if (message.post.id === payload.postId) {
        message.savedPost = false;
      }
      return message;
    });
  return currentMessages;
};
const getFreshPosts = (existingPosts, newPosts) => {
  return newPosts.filter((newPost) => {
    return (
      existingPosts.filter(
        (existingPost) => existingPost.post.id === newPost.post.id
      ).length === 0
    );
  });
};
const updateForwardedStats = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
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

const updatePostsArray = (oldMessagesListArgument, newMessageObject) => {
  let oldMessagesList = oldMessagesListArgument
    ? oldMessagesListArgument.slice()
    : [];
  let messageArrayIndex = oldMessagesList.findIndex(
    (data) => data.parentPostId === newMessageObject.parentPostId
  );
  if (messageArrayIndex !== -1) {
    oldMessagesList[messageArrayIndex].posts = newMessageObject.posts;
  } else {
    if (newMessageObject.parentPostId && newMessageObject.posts) {
      oldMessagesList.push(newMessageObject);
    }
  }
  return oldMessagesList;
};

const updateEmbeddedLinkInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  currentMessages.length > 0 &&
    currentMessages &&
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

      // if (message.post.id === payload.data?.post_id) {
      //   message.embeddedLinkData = payload.data;
      // }
      return message;
    });
  return currentMessages;
};

const updateReplyMessageData = (stateMessages, newMessage) => {
  let currentMessages = stateMessages?.slice();
  let matchIndex = false;
  const index =
    currentMessages &&
    currentMessages.findIndex(
      (message) => message.post.id === newMessage[0].post.id
    );
  currentMessages &&
    currentMessages.length > 0 &&
    currentMessages.map((message) => {
      if (message.post.id === newMessage[0].post.id) {
        matchIndex = true;
        currentMessages[index] = newMessage[0];
      }
      return message;
    });

  if (!matchIndex) {
    if (stateMessages === undefined) {
      currentMessages = [newMessage[0]];
    } else {
      currentMessages = [...stateMessages, newMessage[0]];
    }
  }
  return currentMessages;
};

const updateReplyFileInfo = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  currentMessages &&
    currentMessages.map((message) => {
      if (message.post.id === payload.postId) {
        let foundData = message.fileList.find(
          (el) => el.fileId === payload.fileId
        );
        foundData.status = UploadStatus.DELETED;
      }
      return message;
    });
  return currentMessages;
};

const updateFileInfoStatsReply = (stateMessages, payload) => {
  let currentMessages = stateMessages?.slice();
  currentMessages &&
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
const getMessagePostsParent = (posts, postId) => {
  let postData = posts.find((post) => {
    let currPost = [];
    if (post.posts && post.posts.some((i) => i.id === postId)) {
      currPost = post.posts;
    }
    return currPost.length > 0;
  });
  return postData ? postData.parentPostId : null;
};

const getMessagePosts = (posts, postId) => {
  let postData = posts.find((post) => {
    let currPost = [];
    if (post.posts && post.posts.some((i) => i.id === postId)) {
      currPost = post.posts;
    }
    return currPost.length > 0;
  });
  return postData ? postData.posts : [];
};

const initialState = {
  posts: [],
  hidePreviousLoading: false,
  hideNextLoading: false,
  selectedParentId: null,
};

export const PostReplyReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case FETCH_POST_REPLY:
      return {
        ...state,
        fetchingReplies: true,
      };
    case FETCH_POST_REPLY_SUCCESS:
      const {
        parentPostId,
        data,
        direction,
        callType,
        unreadMessage = false,
      } = action.payload;
      //dispatch(updateParentReplyCount(parentPostId, data(data.length -1).parentReplyCount))
      if (unreadMessage) {
        // const myPosts = data.map((el) => ({
        //   posts: el.postList,
        //   parentPostId: el.ParentPostID,
        // }));
        let responseData = state.posts;
        data &&
          data.map((item) => {
            responseData = updatePostsArray(responseData, item);
            return item;
          });
        return {
          ...state,
          posts: [...responseData],
          hidePreviousLoading: false,
          hideNextLoading: false,
        };
      } else {
        if (!state.posts?.some((i) => i.parentPostId === parentPostId)) {
          return {
            ...state,
            posts: [
              ...updatePostsArray(state.posts, {
                posts: data,
                parentPostId,
              }),
            ],
            // parentPostId: parentPostId,
            hidePreviousLoading: false,
            hideNextLoading: false,
          };
        } else {
          const newPosts = getFreshPosts(
            state.posts?.find((i) => i.parentPostId === parentPostId)?.posts,
            data
          );
          const postInd = state.posts?.findIndex(
            (i) => i.parentPostId === parentPostId
          );
          let array = [...state.posts];
          if (direction === 1) {
            if (
              state.posts[postInd].posts.length > 0 &&
              newPosts?.[0]?.sequence_id -
                state.posts[postInd].posts[
                  state.posts[postInd].posts.length - 1
                ].sequence_id >
                1
            ) {
              array[postInd].posts = [...newPosts];
            } else {
              array[postInd].posts = [
                ...state.posts[postInd].posts,
                ...newPosts,
              ];
            }
          } else {
            array[postInd].posts = [...newPosts, ...state.posts[postInd].posts];
          }
          array[postInd].posts.sort((a, b) => {
            return a.sequence_id > b.sequence_id
              ? 1
              : a.sequence_id < b.sequence_id
              ? -1
              : 0;
          });
          return {
            ...state,
            posts: newPosts.length > 0 ? array : state.posts,
            // parentPostId: parentPostId,
            hidePreviousLoading:
              direction === -1
                ? newPosts.length === 0
                : callType === "next" || callType === "prev"
                ? state.hidePreviousLoading
                : false,
            hideNextLoading:
              direction === 1
                ? newPosts.length === 0
                : callType === "next" || callType === "prev"
                ? state.hideNextLoading
                : false,
          };
        }
      }
    case LOAD_POST_REPLY_SUCCESS:
      let parentPostReplyId = action.payload.parentPostId;
      let replyData = action.payload.data;
      if (!state.posts?.some((i) => i.parentPostId === parentPostReplyId)) {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              posts: replyData,
              parentPostId: parentPostReplyId,
            }),
          ],
          // parentPostId: parentPostReplyId,
        };
      } else {
        const newPosts = getFreshPosts(
          state.posts?.find((i) => i.parentPostId === parentPostReplyId)?.posts,
          replyData
        );
        const postInd = state.posts?.findIndex(
          (i) => i.parentPostId === parentPostReplyId
        );
        const array = [...state.posts];
        array[postInd].posts = [...state.posts, ...newPosts];
        array[postInd].posts.sort((a, b) => {
          return a.sequence_id > b.sequence_id
            ? 1
            : a.sequence_id < b.sequence_id
            ? -1
            : 0;
        });
        return {
          ...state,
          posts: newPosts.length > 0 ? array : state.posts,
          // parentPostId:  parentPostReplyId,
        };
      }
    case FETCH_POST_REPLY_ERROR:
      return {
        ...state,
        fetchError: action.payload.error,
      };
    case LOAD_CHANNEL_MESSAGES_SUCCESS: {
      let parentId =
        action.payload?.messages?.length > 0
          ? action.payload.messages[0]?.parentId
          : false;
      let parentPostId = action.payload.parentPostId;

      if (parentId || parentPostId) {
        // if (parentId && state.posts) {
        //   let index = state.posts.findIndex((i) => i.parentPostId === parentId);
        //   if (index === -1) {
        //     return state;
        //   }
        // }
        if (action.payload.messages) {
          if (state.posts.length > 0) {
            var lastPost = state.posts?.filter((post) =>
              post?.posts?.find(
                (i) => i.id === action.payload.messages[0].post.id
              )
            );
            // if (lastPost.length > 0) {
            //   lastPost[0].parentReplyCount = lastPost[0].parentReplyCount
            //     ? lastPost[0].parentReplyCount + 1
            //     : 1;
            // }
            let postInd = state.posts?.findIndex((i) => {
              return (
                i.parentPostId === parentPostId || i.parentPostId === parentId
              );
            });
            if (postInd && postInd > -1) {
              return {
                ...state,
                // parentPostId: state.parentPostId,
                posts: [
                  ...updatePostsArray(state.posts, {
                    parentPostId: parentPostId ? parentPostId : parentId,
                    posts: updateReplyMessageData(
                      state.posts?.find(
                        (i) =>
                          i.parentPostId === parentPostId ||
                          i.parentPostId === parentId
                      )?.posts,
                      action.payload.messages
                    ),
                  }),
                ],
                // posts: [...state.posts, ...action.payload.messages],
              };
            } else {
              return {
                ...state,
                // parentPostId: state.parentPostId,
                posts: [
                  ...updatePostsArray(state.posts, {
                    parentPostId: parentPostId ? parentPostId : parentId,
                    posts: updateReplyMessageData(
                      state.posts?.find(
                        (i) =>
                          i.parentPostId === parentPostId ||
                          i.parentPostId === parentId
                      )?.posts,
                      action.payload.messages
                    ),
                  }),
                ],
                // posts: [...state.posts, ...action.payload.messages],
              };
            }
          } else {
            return {
              ...state,
              // parentPostId: state.parentPostId,
              posts: [
                ...updatePostsArray(state.posts, {
                  parentPostId: parentPostId ? parentPostId : parentId,
                  posts: updateReplyMessageData(
                    state.posts?.find(
                      (i) =>
                        i.parentPostId === parentPostId ||
                        i.parentPostId === parentId
                    )?.posts,
                    action.payload.messages
                  ),
                }),
              ],
              // posts: [...action.payload.messages],
            };
          }
        }
      } else {
        return state;
      }
      break;
    }

    case UPDATE_MESSAGES_TAG: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updatePostTags(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_MESSAGES_SAVE: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updatePostSave(stateMessages, action.payload),
            }),
          ],
        };
      }
    }

    case UPDATE_HIDDEN_REPLY_POST: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updatePostHide(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_UNHIDDEN_REPLY_POST: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updatePostUnHide(stateMessages, action.payload),
            }),
          ],
        };
      }
    }

    case DELETE_MESSAGES_SAVE: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: deletePostSave(stateMessages, action.payload),
            }),
          ],
        };
      }
    }

    case UPDATE_EDITED_POST: {
      let parentPostId = getMessagePostsParent(
        state.posts,
        action.payload.message?.post.id
      );
      let stateMessages = getMessagePosts(
        state.posts,
        action.payload.message?.post.id
      );

      if (parentPostId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: parentPostId,
              posts: updateEditMessages(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_POST_REACTIONS: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updatePostReactions(stateMessages, action.payload),
            }),
          ],
        };
      }
    }

    case REMOVE_REACTION_SUCCESS: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: removeUserReaction(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case ADD_REACTION_SUCCESS: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: addUserReaction(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case CLEAR_MESSAGES_REPLY_POST: {
      return {
        ...state,
        posts: [],
      };
    }
    case CLEAR_MESSAGES_REPLY_POST_FOR_PARENT: {
      let posts = [...state.posts];
      let postObjectIndex = posts.findIndex(
        (post) => post.parentPostId === action.payload.id
      );
      if (postObjectIndex !== -1) {
        posts[postObjectIndex].posts = [];
      }
      return {
        ...state,
        posts: [...posts],
      };
    }
    case REDIRECT_CHANNEL_REPLY_MESSAGES_SUCCESS: {
      if (action.payload?.messages?.length > 0) {
        if (action.payload.parentPostId) {
          let array = state.posts.slice();
          if (array.length === 0) {
            array.push({
              parentPostId: action.payload.parentPostId,
              posts: action.payload.messages,
            });
          } else {
            let postInd = array.findIndex((i) => {
              return i.parentPostId === action.payload.parentPostId;
            });
            if (postInd !== -1) {
              array[postInd].parentPostId = action.payload.parentPostId;
              array[postInd].posts = action.payload.messages;
            }
          }
        }
        // else {
        //   //Not sure about this case
        //   state.posts = action.payload.messages;
        // }
      }
      let array = [...state.posts];
      let postInd = array.findIndex(
        (i) => i.parentPostId === action.payload.parentPostId
      );
      if (postInd !== -1) {
        array[postInd].parentPostId = action.payload.parentPostId;
        array[postInd].posts = action.payload.messages;
      } else
        array.push({ parentPostId: action.payload.parentPostId, posts: [] });
      return {
        ...state,
        posts: array,
        // parentPostId: action.payload.parentPostId,
        redirectPost: action.payload.postId,
        redirectFlag: true,
      };
    }
    case REQUEST_POST_OPEN_MESSAGES_SUCCESS: {
      let id = action.postId;
      if (state.selectedParentId === action.postId) {
        id = null;
      }
      return {
        ...state,
        redirectPostOpen: action.postId,
        scrollToBottom: false,
        avoidScrolling: false,
        selectedParentId: id,
      };
    }

    case CLEAR_REDIRECT_POST_FLAG: {
      return {
        ...state,
        redirectFlag: false,
        redirectPostOpen: undefined,
        redirectPost: undefined,
      };
    }

    case REQUEST_POST_CLOSE_MESSAGES_SUCCESS: {
      if (action.payload?.messages?.length > 0) {
        state.posts = action.payload.messages;
        return {
          ...state,
          redirectPostOpen: action.payload.postId,
          scrollToBottom: false,
          avoidScrolling: false,
        };
      }

      return state;
    }

    case FETCH_EMBEDDED_LINK_REQUEST_REPLY: {
      return {
        ...state,
        fetchingEmbeddedData: true,
        fetchedEmbeddedData: false,
      };
    }
    case FETCH_EMBEDDED_LINK_SUCCESS_REPLY: {
      let postId = getMessagePostsParent(
        state.posts,
        action.payload.data.post_id
      );
      let stateMessages = getMessagePosts(
        state.posts,
        action.payload.data.post_id
      );
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          fetchingEmbeddedData: false,
          fetchedEmbeddedData: true,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updateEmbeddedLinkInfo(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case FETCH_EMBEDDED_LINK_ERROR_REPLY: {
      let postId = getMessagePostsParent(
        state.posts,
        action.payload.data.post_id
      );
      let stateMessages = getMessagePosts(
        state.posts,
        action.payload.data.post_id
      );
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          fetchingEmbeddedData: false,
          fetchedEmbeddedData: true,
          fetchingEmbeddedDataError: true,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updateEmbeddedLinkInfo(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_FILE_INFO_STATS_REPLY: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updateFileInfoStatsReply(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_REPLY_FILE_INFO: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updateReplyFileInfo(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_FORWARDED_POST_STATUS: {
      let postId = getMessagePostsParent(state.posts, action.payload.postId);
      let stateMessages = getMessagePosts(state.posts, action.payload.postId);
      if (postId === null) {
        return { ...state };
      } else {
        return {
          ...state,
          posts: [
            ...updatePostsArray(state.posts, {
              parentPostId: postId,
              posts: updateForwardedStats(stateMessages, action.payload),
            }),
          ],
        };
      }
    }
    case UPDATE_CURRENT_SELECTED_PARENT_POST: {
      let id = action.payload.parentId;
      if (state.selectedParentId === action.payload.parentId) {
        id = null;
      }
      return {
        ...state,
        selectedParentId: id,
      };
    }
    case MARK_POST_READ_STATUS: {
      let postsParent = state.posts;
      if (state.posts && state.posts.length > 0) {
        postsParent = state.posts.slice();
        postsParent.map((data) => {
          if (data.posts.length > 0) {
            data.posts.map((post) => {
              if (action.payload.postList.includes(post.post.id)) {
                post.isUnread = false;
              }
              return post;
            });
          }
          return data;
        });
      }

      return {
        ...state,
        posts: postsParent,
      };
    }
    default:
      return state;
  }
};
