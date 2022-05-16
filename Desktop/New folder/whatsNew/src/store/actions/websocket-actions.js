import WebSocketClient from "../../client/websocket-client";
import server from "server";
import WebSocketEvents from "../../constants/websocket/WebSocketEvents";
import RestConstants from "../../constants/rest/rest-constants";
import { filesConstants } from "../../constants/files";
import { MENU_ITEMS } from "../../constants/menu-items";
import { store } from "../store";
import {
  LOAD_CHANNEL_MESSAGES_SUCCESS,
  UPDATE_CHANNEL_MESSAGES,
  UPDATE_MESSAGES_TAG,
  UPDATE_POST_REACTIONS,
  UPDATE_EDITED_POST,
  UPDATE_FILE_INFO_STATS,
  FILE_PREVIEW_AVAILABLE,
  UPDATE_MESSAGE_TASK,
  UPDATE_FORWARDED_FILE_INFO,
  MARK_POST_READ_STATUS,
} from "../actionTypes/channelMessagesTypes";
import {
  UPDATE_FILE_INFO_STATS_REPLY,
  UPDATE_REPLY_FILE_INFO,
} from "../actionTypes/commonActionTypes";
import {
  UPDATE_CHANNEL_MESSAGE_COUNT,
  UPDATE_CHANNEL_MESSAGES_DATA,
  UPDATE_DISCUSSION_LAST_READ_POST_ID,
  UPDATE_CHANNEL_LIST_LAST_POST,
} from "../actionTypes/channelActionTypes";
import { UPDATE_TAG_LIST } from "../actionTypes/tag-action-types";
import { UPDATE_TASK_LIST } from "../actionTypes/tasks-action-types";
import {
  channelDetailAction,
  GetChannelMemberAction,
  GetChannelListAction,
  initiateChannelDeletionStatus,
  completedChannelDeletionStatus,
  initiateChannelArchiveStatus,
  completedChannelArchiveStatus,
  GetAllChannelMembers,
  GetMembersProfileImage,
} from "../actions/channelActions";
import { USER_TYPING } from "../actionTypes/user-typing-actionTypes";
import {
  UPDATE_CHANNEL_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_STATUS,
  HIDE_NOTIFICATION_STATUS,
  UNHIDE_NOTIFICATION_STATUS,
} from "../actionTypes/notification-action-type";
import {
  setActiveFileMenuItem,
  setActivePanelAction,
  setAdminSidebarPanel,
  setSelectedChannelAction,
  updateFilePanelState,
  updateSelectedChannelName,
} from "../../store/actions/config-actions";
import { GetRequiredActions } from "../../store/actions/user-actions";
import {
  addPost,
  addUser,
  deleteUserByChannelId,
  deleteUsersByChannelId,
} from "../../utilities/caching/db-helper";
import UserActions from "../../store/actions/user-actions";
import { UPDATE_FILE_DETAILS_SUCCESS } from "../actionTypes/file-action-types";
import {
  UPDATE_CHANNEL_LAST_POST,
  UPDATE_CHANNEL_CREATOR,
} from "../actionTypes/channelActionTypes";
import {
  UPDATE_FOLDER_LIST,
  UPDATE_FOLDER_DATA,
} from "../actionTypes/folder-action-types";
import {
  UPDATE_MESSAGES_SAVE,
  DELETE_MESSAGES_SAVE,
  UPDATE_SAVE_LIST,
  UPDATE_HIDDEN_POST,
  UPDATE_HIDDEN_REPLY_POST,
  UPDATE_PARENT_POST_COUNT,
  UPDATE_UNHIDDEN_POST,
  UPDATE_UNHIDDEN_REPLY_POST,
  UPDATE_HIDDEN_FORWARD_POST,
  UPDATE_UNHIDDEN_FORWARD_POST,
  EDIT_FORWARDED_POST,
  UPDATE_FILE_INFO_STATS_FORWARD,
  UPDATE_DELETE_INFO_STATS_FORWARD,
  UPDATE_FORWARDED_POST_STATUS,
  POST_FWD_BY_EMAIL,
} from "../actionTypes/my-saves-action-types";
import { FETCH_WEBSOCKET_STATUS } from "../actionTypes/websocket-action-types";
import {
  getLastSelectedChannelId,
  removeAuthToken,
} from "../../utilities/app-preference";
import Panel from "../../components/actionpanel/panel";
import UserType from "../../constants/user/user-type";

import { sendPushNotification } from "./push-notification-manager";
import CommonUtils from "../../components/utils/common-utils";
import {
  UPDATE_APP_VERSION,
  UPDATE_USER_TYPING_STATUS,
} from "../../constants/config/index";
import {
  fetchFileList,
  fileStorageDetails,
} from "../../store/actions/files-actions";
import {
  fetchDiscussionNotificationAction,
  fetchNotificationAction,
} from "../../store/actions/notification-action";
import { fetchReplies, validSequenceReply } from "./PostReplyActions";
import {
  fetchFileSummaryDetails,
  GetFilesListAction,
} from "./main-files-actions";
import { GetAllFolders } from "./folderAction";
import {
  UPDATE_FILE_INFO_STATS_FILELIST,
  UPDATE_FILE_INFO_STATS_FILELIST_SEARCH,
  UPDATE_REACTION_FILE_TO_SUMMARY,
} from "../actionTypes/folder-action-types";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";
import { getSearchResultWithFile } from "../../store/actions/folderAction";
import {
  updateCollectionData,
  updateNotificationWS,
} from "./collection-action";
import {
  UPDATE_LOGIN_HISTORY_LIST,
  UPDATE_USER_BLOCKED_STATUS,
} from "./../actionTypes/admin-account-action-types";
import {
  fetchUserDiscussionsList,
  getUsersFolderListByAdmin,
} from "./admin-account-action";

import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import { USER_ROLES } from "../../utilities/user-roles";
import {
  fetchDiscussionMemberData,
  fetchDiscussionData,
} from "./admin-discussion-action";
import { FETCH_DISCUSSION_MEMBERS_LIST_SUCCESS } from "../actionTypes/admin-discussion-action-types";
import { getESignature } from "../../store/actions/esignature-actions"
const dispatch = store.dispatch;

const MAX_WEBSOCKET_FAILS = 10;
const TAG = "WebsocketAction";
let typingId = null;
export function initializeWebSocket(token) {
  if (!window.WebSocket) {
    console.log("Browser does not support websocket");
    return;
  }

  let connUrl = null;
  let timerId = null;
  if (!connUrl) {
    connUrl = new URL(
      server.apiUrl + RestConstants.BASE_URL + RestConstants.WEBSOCKET
    );

    // replace the protocol with a websocket one
    let webSocketPort;
    if (connUrl.protocol === "https:") {
      connUrl.protocol = "wss:";
      webSocketPort = 443;
    } else {
      connUrl.protocol = "ws:";
      webSocketPort = 80;
    }

    // append a port number if one isn't already specified
    if (!/:\d+$/.test(connUrl.host)) {
      connUrl.host += ":" + webSocketPort;
    }

    connUrl = connUrl.toString();
  }

  // Strip any trailing slash before appending the pathname below.
  if (connUrl.length > 0 && connUrl[connUrl.length - 1] === "/") {
    connUrl = connUrl.substring(0, connUrl.length - 1);
  }
  WebSocketClient.setEventCallback(handleEvent);
  WebSocketClient.setFirstConnectCallback(handleFirstConnect);
  WebSocketClient.setReconnectCallback(() => reconnect(false));
  WebSocketClient.setMissedEventCallback(() => reconnect(false));
  WebSocketClient.setCloseCallback(handleClose);
  WebSocketClient.initialize(connUrl, token);
}

export function closeWebSocket() {
  WebSocketClient.close();
}
export function userTypeAction(channelId) {
  dispatch({ type: UPDATE_USER_TYPING_STATUS, payload: { typing: true } });
  WebSocketClient.userTyping(channelId);
  if (typingId) {
    clearTimeout(typingId);
  }
  typingId = setTimeout(() => {
    dispatch({
      type: UPDATE_USER_TYPING_STATUS,
      payload: { typing: false },
    });
  }, 10000);
}

function reconnectWebSocket() {
  closeWebSocket();
  initializeWebSocket();
}

export function reconnect(includeWebSocket = true) {
  console.log(TAG + "reconnect, includeWebSocket=" + includeWebSocket);
  GetWebSocketStatus(true);
  if (includeWebSocket) {
    reconnectWebSocket();
  }
}

function handleFirstConnect() {
  console.log(TAG + ":handleFirstConnect");
  GetWebSocketStatus(true);
}

function handleClose(failCount) {
  GetWebSocketStatus(false);
  if (failCount > MAX_WEBSOCKET_FAILS) {
    console.log(TAG + ":handleClose, failCount reached to  MAX LIMIT");
    //TODO send error to some store , so that it can be display on UI
  }
}

function handleEvent(msg) {
  switch (msg.event) {
    case WebSocketEvents.NEW_POST:
      handleNewPostEvent(WebSocketEvents.NEW_POST, msg.data);
      break;

    case WebSocketEvents.EDIT_POST:
      break;

    case WebSocketEvents.DELETE_POST:
      break;

    case WebSocketEvents.ACTION_REQUIRED:
      handleActionRequired(msg);
      break;
    case WebSocketEvents.USER_ADDED:
      handleUserAddedEvent(msg);
      break;
    case WebSocketEvents.USER_LEAVE:
    case WebSocketEvents.USER_REMOVED:
      handleUserRemovedEvent(msg);
      break;
    case WebSocketEvents.CHANNEL_CREATED:
      handleChannelCreatedEvent(msg);
      // handleUserTypingEvent(msg);
      break;

    case WebSocketEvents.USER_TYPING:
      handleUserTypingEvent(msg);
      break;

    case WebSocketEvents.SHOW_NOTIFICATION:
      handleUserNotificationEvent(WebSocketEvents.SHOW_NOTIFICATION, msg);
      break;
    case WebSocketEvents.FILE_DELETION:
      handleFileDeletion(msg);
      break;
    case WebSocketEvents.TAG_ADDED:
      handleTagUpdation(msg);
      break;
    case WebSocketEvents.TAG_DELETED:
      handleTagUpdation(msg);
      break;
    case WebSocketEvents.BOOKMARK_ADDED:
      handleSaveUpdation(msg);
      break;
    case WebSocketEvents.BOOKMARK_DELETED:
      handleMySaveDeletion(msg);
      break;

    case WebSocketEvents.REACTION_ADDED:
    case WebSocketEvents.REACTION_DELETED:
      handlePostReactionUpdated(msg);
      break;
    case WebSocketEvents.SOCKET_INIT:
      handleSessionTime(msg, this.timerId);
      handleUserNetworkType(msg);
      handleBuildVersion(msg);
      dispatch(GetAllChannelMembers(dispatch));
      dispatch(GetChannelListAction(dispatch));
      dispatch(fileStorageDetails());
      break;
    case WebSocketEvents.USER_PROFILE_UPDATE:
      handleUserProfileUpdate(msg);
      break;
    case WebSocketEvents.DISCUSSION_DELETE_COMPLETED:
      handleDiscussionDeletionComplete(msg);
      break;
    case WebSocketEvents.DISCUSSION_DELETE_INITIATED:
      handleDiscussionDeletionInitiate(msg);
      break;
    case WebSocketEvents.DISCUSSION_UPDATED:
      handleDiscussionUpdate(msg);
      break;
    case WebSocketEvents.DISCUSSION_ARCHIVE_COMPLETED:
      handleDiscussionArchiveComplete(msg);
      break;
    case WebSocketEvents.DISCUSSION_ARCHIVE_INITIATED:
      handleDiscussionArchiveInitiate(msg);
      break;
    case WebSocketEvents.FILE_STATS_UPDATED:
      handleFileStatsUpdate(msg);
      break;
    case WebSocketEvents.FOLDER_DELETED:
      handleFolderDelete(msg);
      break;
    case WebSocketEvents.FILE_PREVIEW_AVAILABILITY:
      handleFilePreviewAvailability(msg);
      break;
    case WebSocketEvents.HIDE_POST_MESSAGE:
      handleHiddenPost(msg);
      break;
    case WebSocketEvents.UNHIDE_POST_MESSAGE:
      handleUnhiddenPost(msg);
      break;
    case WebSocketEvents.TASK_STATUS_UPDATE:
      handleTaskUpdation(WebSocketEvents.TASK_STATUS_UPDATE, msg);
      break;
    case WebSocketEvents.NOTIFICATION_UPDATE:
      updateNotificaionStatus(msg);
      break;
    case WebSocketEvents.HIDE_NOTIFICATION:
      hideNotificaionStatus(msg);
      break;
    case WebSocketEvents.UNHIDE_NOTIFICATION:
      unHideNotificaionStatus(msg);
      break;
    case WebSocketEvents.POST_READ:
      markPostAsRead(msg);
      break;
    case WebSocketEvents.FORCE_SIGN_OUT:
      userForceSignOut(msg);
      break;
    case WebSocketEvents.FORWARD_POST_STATS_UPDATE:
      forwardPostStatsUpdated(msg);
      break;
    case WebSocketEvents.POST_FWD_BY_EMAIL:
      postFwdByEmailUpdated(msg);
      break;
    case WebSocketEvents.FOLDER_ADDED:
      handleFolderUpdation(msg);
      break;
    case WebSocketEvents.FOLDER_UPDATED:
      handleFolderUpdated(msg);
      break;
    case WebSocketEvents.FILE_UPLOADED_TO_FOLDER:
      handleFileUpload(msg);
      break;
    case WebSocketEvents.FILE_FORWARD_TO_FOLDER:
      handleFileForward(msg);
      break;
    case WebSocketEvents.FILE_SHARED:
      handleFileSharing(msg);
      break;
    case WebSocketEvents.FILE_FORWARD_TO_DISCUSSION:
      handleFileForwardToDis(msg);
      break;
    case WebSocketEvents.COLLECTION_CREATED:
      handleCollectionCreate(msg);
      break;
    case WebSocketEvents.COLLECTION_UPDATED:
      handleCollectionUpdate(msg);
      break;
    case WebSocketEvents.COLLECTION_DELETED:
      handleCollectionDelete(msg);
      break;
    case WebSocketEvents.COLLECTION_CHANNEL_ADDED:
    case WebSocketEvents.COLLECTION_CHANNEL_REMOVED:
      handleChannelCollection(msg);
      break;
    case WebSocketEvents.ADMIN_LOGIN_HISTORY:
    // handleLoginHistory(msg);
    // break;
    case WebSocketEvents.USER_BLOCKED_STATUS:
      userBlockedstatus(msg);
      break;
    case WebSocketEvents.USER_ESIGNATURE_UPDATED:
      userEsignatureUpdated(msg);
      break;
    // case WebSocketEvents.FILE_COUNT_DECREASED:
    //   handleFileCountDecreased(msg);
    default:
  }
}

// function handleFileCountDecreased(msg) {
//   const state = store.getState();
//   var message = msg.data;
//   const activeSelectedFileId = state.config.activeSelectedFileId;
//   let itemFileId = `${message.fileId}-${message?.folderId ?? ""
//     }-${message?.channelId ?? ""}-${message?.postId ?? ""
//     }`;
//   dispatch(
//     updateFilePanelState(
//       activeSelectedFileId === itemFileId ? false : true
//     )
//   );
// }

function userEsignatureUpdated(msg) {
  const state = store.getState();
  const esignFolderSelected =  state.esignatureReducer.esignatureFolderSelected;
  const esignTabSelected = state.esignatureReducer.esignatureTabSelected;
  dispatch(getESignature(esignFolderSelected, esignTabSelected ));
}

function handleUserTypingEvent(msg) {
  const messageData = JSON.parse(msg.data);
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  if (
    messageData.userId !== currentUser.id &&
    messageData.channelId === (currentChannel && currentChannel.id)
  ) {
    dispatch({
      type: USER_TYPING,
      payload: {
        userName: messageData.userName,
        channelId: messageData.channelId,
      },
    });
  }
  //  else {
  //   dispatch({
  //     type: USER_TYPING,
  //     payload: { userName: messageData.userName },
  //   });
  // }
}

function handleNewPostEvent(event, msg) {
  var message = JSON.parse(msg.Payload);
  const state = store.getState();
  const currentUser = state.AuthReducer.user;
  const currentChannel = state.config.activeSelectedChannel;
  const activeMenuItem = state.config.activeMenuItem;
  let activeSelectedFile = state.config.activeSelectedFile;
  // if (message.user.id === currentUser.id) {
  //   //If message user.id is same as current user then will ignore it.
  //   return;
  // }
  //For now we are just removing the image to use static image.
  // message.user.userImg = "";

  dispatch({
    type: EDIT_FORWARDED_POST,
    payload: {
      post: message,
      channelId: message.channelId,
      postId: message.post.id,
    },
  });
  let messages = [message];
  dispatch({
    type: UPDATE_CHANNEL_LIST_LAST_POST,
    payload: {
      data: messages,
    },
  });
  dispatch({
    type: UPDATE_CHANNEL_MESSAGES_DATA,
    payload: { updatedData: Math.random() },
  });
  if (MENU_ITEMS.FILES === activeMenuItem && message?.fileList?.length > 0) {
    dispatch(GetAllFolders());
    dispatch(
      GetFilesListAction({
        ...state.mainFilesReducer.fileFilterObject,
        count: filesConstants.ITEM_COUNT,
        order: filesConstants.ORDER_BY,
        sort: filesConstants.SORT_BY,
      })
    );
  }
  // if (message.fileInfo.fileId === activeSelectedFile.fileId) {
  //   dispatch(
  //     fetchFileSummaryDetails(
  //       activeSelectedFile.fileId,
  //       activeSelectedFile.channelId,
  //       activeSelectedFile.postId,
  //       activeSelectedFile.folderId,
  //       activeSelectedFile.queryUserType)
  //   );
  // }
  if (currentChannel && currentChannel.id === message.channelId) {
    dispatch({
      type: UPDATE_SAVE_LIST,
      payload: {
        channelId: message.channelId,
        postId: message.post.id,
      },
    });
    dispatch({
      type: UPDATE_TAG_LIST,
      payload: {
        channelId: message.channelId,
        tagInfo: message.tagInfo,
      },
    });
    dispatch({
      type: UPDATE_TASK_LIST,
      payload: {
        channelId: message.channelId,
      },
    });
    if (message?.fileList?.length > 0) {
      dispatch({
        type: UPDATE_FILE_DETAILS_SUCCESS,
        payload: {
          data: message.fileList,
        },
      });
    }
    if (message && message.post && message.post.edited) {
      dispatch({
        type: UPDATE_EDITED_POST,
        payload: {
          channelId: message.channelId,
          message: message,
          noChannelSwitch: true,
        },
      });

      if (
        message.parentId === "" &&
        currentChannel.LastPost.post.id === message.post.id
      ) {
        //If parentId equal empty it means It is actual post else just ignore the reply post
        //If edited post is last post of current channel then update it.
        dispatch({
          type: UPDATE_CHANNEL_LAST_POST,
          payload: {
            data: messages,
          },
        });
      }
    } else {
      if (message.parentId === "") {
        //If parentId equal empty it means It is actual post else just ignore the reply post
        dispatch({
          type: UPDATE_CHANNEL_LAST_POST,
          payload: {
            data: messages,
          },
        });
      }

      if (!state.channelMessages.toggleUnreadMessage) {
        if (
          message.parentId &&
          message.parentId !== "" &&
          !validSequenceReply(messages[0].parentId, messages[0].sequence_id)
        ) {
          //dispatch(clearPostsForGivenId(messages[0].parentId));
          if (message.user.id === currentUser.id) {
            dispatch(
              fetchReplies(messages[0].parentId, message.channelId, 1, 1, 0)
            );
          } /*else {
            //do nothing, user will get new message when asked for next set of replies
            
          }*/
        } else {
          console.log("here");
          dispatch({
            type: LOAD_CHANNEL_MESSAGES_SUCCESS,
            payload: {
              channelId: message.channelId,
              messages: messages,
              noChannelSwitch: true,
              preserveScrollPosition:
                message.user.id === currentUser.id ? false : true,
            },
          });
        }
      } else if (
        state.channelMessages.toggleUnreadMessage &&
        message.user.id === currentUser.id &&
        message.parentId &&
        message.parentId !== ""
      ) {
        if (
          !validSequenceReply(messages[0].parentId, messages[0].sequence_id)
        ) {
          dispatch(
            fetchReplies(messages[0].parentId, message.channelId, 1, 1, 0)
          );
        } else {
          if (messages[0].isUnread) {
            messages[0].isUnread = false;
          }
          dispatch({
            type: LOAD_CHANNEL_MESSAGES_SUCCESS,
            payload: {
              channelId: message.channelId,
              messages: messages,
              noChannelSwitch: true,
              preserveScrollPosition:
                message.user.id === currentUser.id ? false : true,
            },
          });
        }
      }
    }
  }
  if (currentUser && currentUser.id !== message.user.id) {
    dispatch({
      type: UPDATE_CHANNEL_MESSAGE_COUNT,
      payload: {
        channelId: message.channelId,
        currentChannelId: currentChannel?.id,
        hasNewMessages: true,
      },
    });
  }

  if (message.user.id !== currentUser.id) {
    sendPushNotification(event, message);
  }
  addPost(message.channelId, message);
  if (message?.user?.displayName !== currentUser?.screenName) {
    dispatch(
      updateNotificationWS({
        channelId: message?.channelId,
        type: "sendPost",
      })
    );
  }
}

function handleUserNotificationEvent(event, msg) {
  var message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  // if (currentChannel?.id === message.refChannelID) {
  dispatch({
    type: UPDATE_CHANNEL_NOTIFICATION_SUCCESS,
    payload: {
      notification: message,
      updateDiscussionList: currentChannel?.id === message.refChannelID,
    },
  });
  // dispatch(fetchDiscussionNotificationAction(currentChannel, 0, 5, "All"));
  // }
  sendPushNotification(event, message);
  dispatch(
    updateNotificationWS({
      channelId: message?.refChannelID,
      actionStatus: "up",
      type: "notification",
    })
  );
}

function handleUserAddedEvent(msg) {
  console.log(TAG + ":handleUserAddedEvent: msg=" + msg);
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentAdminDiscussion = state.config.adminSelectedRow;
  const currentUser = state.AuthReducer.user;
  if (
    state.notificationReducer.notificationDetails?.length === 0 ||
    state.notificationReducer.notificationDetails?.length === 1
  ) {
    dispatch(fetchNotificationAction(0, 7));
  }

  if (currentChannel && currentChannel.id === msg.data.channelId) {
    dispatch(channelDetailAction(currentChannel.id));
  }

  if (msg.data.length > 0) {
    for (let i = 0; i < msg.data.length; i++) {
      let memberInfo = CommonUtils.getUserData(msg.data[i]);
      addUser(memberInfo, msg.data[i].channelId).then((resp) => {
        dispatch(
          GetMembersProfileImage(
            {
              users: [memberInfo.id],
            },
            null,
            dispatch
          )
        );
        if (currentChannel && currentChannel.id === msg.data[i].channelId) {
          //TODO Need to optimize , It should invoke only if Right Hand side (Detail Page is opened)
          GetChannelMemberAction(currentChannel.id, dispatch);
        }
      });

      let lastSelectedChannel = getLastSelectedChannelId();
      if (
        (!currentChannel || lastSelectedChannel === "null") &&
        currentUser.id === memberInfo.id
      ) {
        dispatch(GetChannelListAction(dispatch));
        setTimeout(() => {
          const channelList = state.ChannelReducer.channelList;
          const channel = channelList?.find(
            (item) => item.id === msg.data[i].channelId
          );
          if (channel) {
            if (channel.IsInvitePending) {
              dispatch(
                setSelectedChannelAction(
                  Panel.JOIN_DISCUSSION_AGREEMENT,
                  channel
                )
              );
              return;
            }
            dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
          }
        }, 1000);
      }
    }
  }

  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    msg.data.some((i) => i.channelId === currentAdminDiscussion?.id)
  ) {
    dispatch(fetchDiscussionMemberData(currentAdminDiscussion?.id));
  }
}
function handleCollectionCreate(msg) {
  const state = store.getState();
  const currentCollectionData = state.CollectionReducer.collectionData;
  if (msg.data) {
    const data = { ...msg.data, channelCount: 0, channels: [] };
    const newCollectionData = {
      ...currentCollectionData,
      collections: [...currentCollectionData.collections, data],
    };
    dispatch(updateCollectionData(newCollectionData));
  }
}

function handleChannelCollection(msg) {
  const { event } = msg;
  if (msg.data) {
    const state = store.getState();
    const currentCollectionData = state.CollectionReducer?.collectionData;
    const newCollectionData = { ...currentCollectionData };
    const { collections = [] } = newCollectionData;
    const isAdded = event === "collectionChannelAdded";
    const channelId = msg?.data?.channelId;
    const addedList = msg?.data?.addedList || [];
    const removedList = msg?.data?.removedList || [];
    const collectionList = isAdded ? addedList : removedList;

    const newCollections = collections.map((collection) => {
      if (!collection.channels) {
        collection.channels = [];
      }
      if (collectionList.includes(collection.id)) {
        if (isAdded) {
          collection.channels = [channelId, ...collection.channels];
        } else {
          collection.channels = collection.channels.filter(
            (id) => id !== channelId
          );
        }
      }
      return collection;
    });
    console.log(event);
    console.log(newCollections);
    newCollectionData.collections = newCollections;
    dispatch(updateCollectionData(currentCollectionData));
  }
}
function handleCollectionUpdate(msg) {
  const state = store.getState();
  const currentCollectionData = state.CollectionReducer.collectionData;
  if (msg.data) {
    const newCollectionData = {
      ...currentCollectionData,
      collections: [...currentCollectionData?.collections].map((item) => {
        return item.id === msg.data.id
          ? {
              ...item,
              name: msg.data.name,
              status: msg.data.status,
              description: msg.data.description,
              updatedAt: msg.data.updatedAt,
            }
          : item;
      }),
    };
    dispatch(updateCollectionData(newCollectionData));
  }
}
function handleCollectionDelete(msg) {
  const state = store.getState();
  const currentCollectionData = state.CollectionReducer.collectionData;
  if (msg.data) {
    const newCollectionData = {
      ...currentCollectionData,
      collections: [...currentCollectionData?.collections].filter(
        (item) => item.id !== msg.data.id
      ),
    };
    dispatch(updateCollectionData(newCollectionData));
  }
}
function handleUserRemovedEvent(msg) {
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  const currentAdminDiscussion = state.config.adminSelectedRow;

  if (currentAdminDiscussion?.id === msg.data.channelId) {
    dispatch(fetchDiscussionMemberData(currentAdminDiscussion?.id));
  }
  if (msg.data.userId === currentUser.id) {
    deleteUsersByChannelId(msg.data.channelId).then((response) => {
      if (
        currentUser.userType === UserType.GUEST &&
        currentChannel &&
        currentChannel.id === msg.data.channelId
      ) {
        removeAuthToken();
        location.reload(true); // eslint-disable-line
        return;
      }
      // dispatch(GetChannelListAction(dispatch));
      if (currentChannel && currentChannel.id === msg.data.channelId) {
        //redirect user to welcome page, If user removed from selected channel.
        const welcomePage = {
          text: "Welcome",
          notifications: 0,
          component: "Welcome",
        };
        dispatch(setActivePanelAction(Panel.WELCOME, null));
      }
    });
  } else {
    deleteUserByChannelId(msg.data.channelId, msg.data.userId).then(
      (response) => {
        if (currentChannel && currentChannel.id === msg.data.channelId) {
          dispatch(channelDetailAction(msg.data.channelId));
          GetChannelMemberAction(currentChannel.id, dispatch);
        }
      }
    );
  }
}

function handleActionRequired(msg) {
  console.log(TAG + ":handleActionRequired: msg=" + msg);
  dispatch(GetRequiredActions());
}

function handleChannelCreatedEvent(msg) {
  console.log(TAG + ":handleChannelCreatedEvent: msg=" + msg.event);
}

function handleFileDeletion(msg) {
  var message = msg.data;
  const state = store.getState();
  let activeSelectedFile = state.config.activeSelectedFile;
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  let searchFilterObject = state.folderReducer.searchFilterObject;
  let searchFileEnabled = state.folderReducer.searchFileEnabled;
  if (currentChannel && message.channelId === currentChannel.id) {
    if (
      message.parentPostId === undefined ||
      message.parentPostId === "" ||
      message.parentPostId === null
    ) {
      dispatch({
        type: UPDATE_CHANNEL_MESSAGES,
        payload: {
          channelId: message.channelId,
          fileId: message.fileId,
          postId: message.postId,
        },
      });
    } else {
      dispatch({
        type: UPDATE_REPLY_FILE_INFO,
        payload: {
          channelId: message.channelId,
          fileId: message.fileId,
          postId: message.postId,
        },
      });
    }
  }
  if (
    message.ForwardedPostChannels &&
    message.ForwardedPostChannels.length > 0
  ) {
    message.ForwardedPostChannels.map((item) => {
      if (currentChannel && item.channelID === currentChannel.id) {
        dispatch({
          type: UPDATE_FORWARDED_FILE_INFO,
          payload: {
            channelId: item.channelID,
            fileId: message.fileId,
            postId: item.id,
            filePostId: message.postId,
          },
        });
      }
      return item;
    });
  }

  if (currentUser.role === USER_ROLES.USER) dispatch(GetAllFolders());
  if (searchFileEnabled) {
    let {
      searchText,
      pageOffset,
      pageCount,
      discussionId,
      exact,
      fileType,
      activityType,
      startTime,
      stopTime,
      folderId,
      author,
      mention,
      target,
      sort,
      order,
      fileFilter,
      isPopular,
    } = searchFilterObject;
    dispatch(
      getSearchResultWithFile(
        searchText,
        pageOffset,
        pageCount,
        discussionId,
        exact,
        fileType,
        activityType,
        startTime,
        stopTime,
        folderId,
        author,
        mention,
        target,
        sort,
        order,
        fileFilter,
        isPopular,
        currentUser.role === USER_ROLES.ADMIN ||
          currentUser.role === USER_ROLES.SUPER_ADMIN
      )
    );
  } else {
    dispatch(
      GetFilesListAction(
        {
          ...state.mainFilesReducer.fileFilterObject,
        },
        currentUser.role === USER_ROLES.ADMIN ||
          currentUser.role === USER_ROLES.SUPER_ADMIN
      )
    );
  }
  if (message.fileId === activeSelectedFile.fileId)
    dispatch(updateFilePanelState(false));
}

function handleSaveUpdation(msg) {
  var message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: UPDATE_MESSAGES_SAVE,
      payload: {
        channelId: message.channelId,
        postId: message.postId,
      },
    });

    dispatch({
      type: UPDATE_SAVE_LIST,
      payload: {
        channelId: message.channelId,
        postId: message.postId,
      },
    });
  }
}

function handleFolderUpdation(msg) {
  var message = msg.data;
  const state = store.getState();
  dispatch({
    type: UPDATE_FOLDER_LIST,
    payload: { data: msg.data },
  });
}
function handleFolderUpdated(msg) {
  var message = msg.data;
  const state = store.getState();
  const currentUser = state.AuthReducer.user;
  const adminSelectedRow = state.config.adminSelectedRow;
  let pathUrl = window.location.pathname;
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("account") &&
    message.userId === adminSelectedRow.userId
  ) {
    //TODO pathUrl.includes("account") , it should change from redux state to determine the selected menu.
    dispatch(getUsersFolderListByAdmin(message.userId));
  }
  dispatch({
    type: UPDATE_FOLDER_DATA,
    payload: message,
  });
}

function handleLoginHistory(msg) {
  var message = msg.data;
  dispatch({
    type: UPDATE_LOGIN_HISTORY_LIST,
    payload: message,
  });
}

function userBlockedstatus(msg) {
  var message = msg.data;
  const state = store.getState();
  let currentUserId = state.AuthReducer.user.id;
  if (
    message.userId === currentUserId &&
    (message.loginHistory?.actionType === "ADMIN_BLOCKED" ||
      message.loginHistory?.actionType === "PASSWORD_LOCKED")
  ) {
    const modalType = ModalTypes.BLOCKED_DELETE_USER;
    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: "delete user",
      modalType: modalType,
      isPasswordLocked: message.loginHistory?.actionType === "PASSWORD_LOCKED",
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }
  dispatch({
    type: UPDATE_USER_BLOCKED_STATUS,
    payload: message,
  });
  dispatch({
    type: UPDATE_LOGIN_HISTORY_LIST,
    payload: message,
  });
}
function handleFileForwardToDis(msg) {
  const state = store.getState();
  var message = msg.data;
  let activeSelectedFile = state.config.activeSelectedFile;
  if (message.fileList.some((fileId) => fileId === activeSelectedFile.fileId)) {
    dispatch(
      fetchFileSummaryDetails(
        activeSelectedFile.fileId,
        activeSelectedFile.channelId,
        activeSelectedFile.postId,
        activeSelectedFile.folderId,
        activeSelectedFile.queryUserType
      )
    );
  }

  let searchFilterObject = state.folderReducer.searchFilterObject;
  let searchFileEnabled = state.folderReducer.searchFileEnabled;
  if (searchFileEnabled) {
    let {
      searchText,
      pageOffset,
      pageCount,
      discussionId,
      exact,
      fileType,
      activityType,
      startTime,
      stopTime,
      folderId,
      author,
      mention,
      target,
      sort,
      order,
      fileFilter,
    } = searchFilterObject;
    dispatch(
      getSearchResultWithFile(
        searchText,
        pageOffset,
        pageCount,
        discussionId,
        exact,
        fileType,
        activityType,
        startTime,
        stopTime,
        folderId,
        author,
        mention,
        target,
        sort,
        order,
        fileFilter
      )
    );
  } else {
    dispatch(
      GetFilesListAction({
        ...state.mainFilesReducer.fileFilterObject,
      })
    );
  }

  // dispatch(GetAllFolders());
  // dispatch(
  //   GetFilesListAction({
  //     ...state.mainFilesReducer.fileFilterObject,
  //     count: filesConstants.ITEM_COUNT,
  //     order: filesConstants.ORDER_BY,
  //     sort: filesConstants.SORT_BY,
  //   })
  // );
  // var message = msg.data;
  // const state = store.getState();
  // dispatch({
  //   type: FILES_FORWARDED_TO_DISCUSSION,
  //   payload: message,
  // });
  // dispatch({
  //   type: UPDATE_FORWARD_FILE_TO_SUMMARY,
  //   payload: message,
  // });
}

function handleFileForward(msg) {
  var message = msg.data;
  const state = store.getState();
  let activeSelectedFile = state.config.activeSelectedFile;
  if (message.fileList.some((fileId) => fileId === activeSelectedFile.fileId)) {
    dispatch(
      fetchFileSummaryDetails(
        activeSelectedFile.fileId,
        activeSelectedFile.channelId,
        activeSelectedFile.postId,
        activeSelectedFile.folderId,
        activeSelectedFile.queryUserType
      )
    );
  }
  // dispatch({
  //   type: UPDATE_FORWARD_FILE_TO_FOLDER,
  //   payload: message,
  // });
  dispatch(GetAllFolders());
  // dispatch({
  //   type: UPDATE_FORWARD_FILE_TO_SUMMARY,
  //   payload: message,
  // });
  let searchFilterObject = state.folderReducer.searchFilterObject;
  let searchFileEnabled = state.folderReducer.searchFileEnabled;
  if (searchFileEnabled) {
    let {
      searchText,
      pageOffset,
      pageCount,
      discussionId,
      exact,
      fileType,
      activityType,
      startTime,
      stopTime,
      folderId,
      author,
      mention,
      target,
      sort,
      order,
      fileFilter,
    } = searchFilterObject;
    dispatch(
      getSearchResultWithFile(
        searchText,
        pageOffset,
        pageCount,
        discussionId,
        exact,
        fileType,
        activityType,
        startTime,
        stopTime,
        folderId,
        author,
        mention,
        target,
        sort,
        order,
        fileFilter
      )
    );
  } else {
    dispatch(
      GetFilesListAction({
        ...state.mainFilesReducer.fileFilterObject,
      })
    );
  }
}

function handleFileSharing(msg) {
  const state = store.getState();
  var message = msg.data;
  let activeSelectedFile = state.config.activeSelectedFile;
  if (
    message.fileListIDs.some((fileId) => fileId === activeSelectedFile.fileId)
  ) {
    dispatch(
      fetchFileSummaryDetails(
        activeSelectedFile.fileId,
        activeSelectedFile.channelId,
        activeSelectedFile.postId,
        activeSelectedFile.folderId,
        activeSelectedFile.queryUserType
      )
    );
  }
  dispatch(GetAllFolders());
  let searchFilterObject = state.folderReducer.searchFilterObject;
  let searchFileEnabled = state.folderReducer.searchFileEnabled;
  if (searchFileEnabled) {
    let {
      searchText,
      pageOffset,
      pageCount,
      discussionId,
      exact,
      fileType,
      activityType,
      startTime,
      stopTime,
      folderId,
      author,
      mention,
      target,
      sort,
      order,
      fileFilter,
    } = searchFilterObject;
    dispatch(
      getSearchResultWithFile(
        searchText,
        pageOffset,
        pageCount,
        discussionId,
        exact,
        fileType,
        activityType,
        startTime,
        stopTime,
        folderId,
        author,
        mention,
        target,
        sort,
        order,
        fileFilter
      )
    );
  } else {
    dispatch(
      GetFilesListAction({
        ...state.mainFilesReducer.fileFilterObject,
      })
    );
  }
  // dispatch({
  //   type: UPDATE_SHARED_FILE_TO_SUMMARY,
  //   payload: msg.data,
  // });
}

function handleFileUpload(msg) {
  const state = store.getState();
  dispatch(GetAllFolders());
  dispatch(
    GetFilesListAction({
      ...state.mainFilesReducer.fileFilterObject,
      count: filesConstants.ITEM_COUNT,
      order: filesConstants.ORDER_BY,
      sort: filesConstants.SORT_BY,
    })
  );
  dispatch(fileStorageDetails());
  // dispatch(
  //   GetFilesListAction({
  //     ...state.mainFilesReducer.fileFilterObject,
  //     // count: 0,
  //     // order: "asc",
  //     // sort: "size",
  //   })
  // );
}

function GetWebSocketStatus(isConnected) {
  dispatch({
    type: FETCH_WEBSOCKET_STATUS,
    payload: {
      value: isConnected,
    },
  });
}

function handleMySaveDeletion(msg) {
  var message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: DELETE_MESSAGES_SAVE,
      payload: {
        postId: message.postId,
      },
    });
    dispatch({
      type: UPDATE_SAVE_LIST,
      payload: {
        channelId: message.channelId,
        postId: message.postId,
      },
    });
  }
}

function handleTagUpdation(msg) {
  var message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: UPDATE_MESSAGES_TAG,
      payload: {
        channelId: message.channelId,
        tagInfo: message.tagInfo,
        postId: message.postId,
        preserveScrollPosition: true,
      },
    });

    dispatch({
      type: UPDATE_TAG_LIST,
      payload: {
        channelId: message.channelId,
        tagInfo: message.tagInfo,
      },
    });
  }
}

function handlePostReactionUpdated(msg) {
  var message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: UPDATE_POST_REACTIONS,
      payload: {
        channelId: message.channelId,
        reaction: message.reactionInfo,
        postId: message.postId,
        preserveScrollPosition: true,
      },
    });
  }
  dispatch({
    type: UPDATE_REACTION_FILE_TO_SUMMARY,
    payload: msg.data,
  });
}

function handleSessionTime(msg, timerId) {
  var timeout = msg.data.sessionExpiry * 60 * 1000;

  if (timeout < 0 && msg.data.sessionExpiry > 0) {
    timeout = 600 * 60 * 1000;
  }
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(UserActions.signout, timeout - 60000);
}

function handleUserNetworkType(msg) {
  dispatch(UserActions.userNetwork(msg.data.networkType));
}

//TODO revisit once member cache is implemented, since cache should be updated regardless of user's current channel
function handleUserProfileUpdate(msg) {
  console.log(TAG + ":handleUserProfileUpdate: msg=" + msg);
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const userData = state.AuthReducer.user;

  addUser(msg.data.memberInfo, msg.data.channelId).then((resp) => {
    //if (currentChannel && currentChannel.id === msg.data.channelId) {
    //TODO Need to optimize , It should invoke only if Right Hand side (Detail Page is opened)
    GetChannelMemberAction(currentChannel?.id, dispatch);
    //}
  });

  if (
    userData.id === msg.data.memberInfo.id &&
    !CommonUtils.isEqualsJson(userData, msg.data.memberInfo)
  ) {
    dispatch(UserActions.updateUserProfileEvent(msg.data.memberInfo));
  }
  dispatch({
    type: UPDATE_CHANNEL_CREATOR,
    payload: {
      userId: msg.data?.memberInfo?.id,
      userName: msg.data?.memberInfo?.screenName,
    },
  });
}

function handleDiscussionUpdate(msg) {
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const adminSelectedRow = state.config.adminSelectedRow;
  dispatch(GetChannelListAction(dispatch));
  dispatch(
    setAdminSidebarPanel(
      { ...adminSelectedRow, ...msg.data },
      "discussionChanged"
    )
  );
  if (currentChannel && currentChannel.id === msg.data.channelId) {
    //TODO Need to optimize , It should invoke only if Right Hand side (Detail Page is opened)
    dispatch(channelDetailAction(currentChannel.id));
    setTimeout(() => {
      const state = store.getState();
      dispatch(
        updateSelectedChannelName(
          state.config.activeSelectedChannel.id,
          state.channelDetails.name
        )
      );
    }, 500);
  }
  const currentUser = state.AuthReducer.user;
  const discussionFilterObj = state.AdminDiscussionReducer.discussionFilterObj;
  let pathUrl = window.location.pathname;
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("account-management") &&
    msg.data.userId === adminSelectedRow.userId
  ) {
    dispatch(
      fetchUserDiscussionsList({
        userId: msg.data.userId,
        channelType: msg.data.channelType,
        offset: 0,
        count: 5,
      })
    );
  }
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("discussion") &&
    msg.data.userId === adminSelectedRow.userId
  ) {
    dispatch(fetchDiscussionData(discussionFilterObj));
    dispatch(
      setAdminSidebarPanel({ ...adminSelectedRow, ...msg.data }, "ownerChanged")
    );
  }
}

function handleFileStatsUpdate(msg) {
  const message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  let activeSelectedFile = state.config.activeSelectedFile;
  const { summaryPanelActive, summaryPanelActiveIndex } = state.config;
  const { selectedFilter } = state.fileReducer;
  if (currentChannel && message.channelId === currentChannel.id) {
    if (
      message.parentPostId === undefined ||
      message.parentPostId === "" ||
      message.parentPostId === null
    ) {
      dispatch({
        type: UPDATE_FILE_INFO_STATS,
        payload: message,
      });
    } else {
      dispatch({
        type: UPDATE_FILE_INFO_STATS_REPLY,
        payload: message,
      });
    }
    if (summaryPanelActive && summaryPanelActiveIndex === 5) {
      let queryParams = {
        channelId: currentChannel.id,
        user: false,
        fileType: selectedFilter,
      };
      dispatch(
        fetchFileList(
          queryParams,
          false,
          currentUser.role === USER_ROLES.ADMIN ||
            currentUser.role === USER_ROLES.SUPER_ADMIN
        )
      );
      dispatch(fileStorageDetails());
    }
  }
  dispatch(GetAllFolders());

  dispatch({
    type: UPDATE_FILE_INFO_STATS_FILELIST_SEARCH,
    payload: message,
  });

  let currentUserId = state.AuthReducer.user.id;

  dispatch({
    type: UPDATE_FILE_INFO_STATS_FILELIST,
    payload: {
      message: message,
      currentUserId: currentUserId,
    },
  });
  dispatch({
    type: UPDATE_FILE_INFO_STATS_FORWARD,
    payload: message,
  });

  // dispatch(fetchFileSummaryDetails(message.fileId,
  //   message.channelId?message.channelId:"",
  //   message.postId?message.postId:'',
  //   message.folderId?message.folderId:'',
  //   ""))
  if (message.fileId === activeSelectedFile.fileId) {
    // dispatch(updateSummaryStats(message));
    dispatch(
      fetchFileSummaryDetails(
        activeSelectedFile.fileId,
        activeSelectedFile.channelId,
        activeSelectedFile.postId,
        activeSelectedFile.folderId,
        activeSelectedFile.queryUserType,
        currentUser.role === USER_ROLES.ADMIN ||
          currentUser.role === USER_ROLES.SUPER_ADMIN
      )
    );
  }
}

function handleFolderDelete(msg) {
  let activeFileMenuItem = store.getState().config.activeFileMenuItem;
  const message = msg.data;
  dispatch(fileStorageDetails());
  dispatch(GetAllFolders(true));
  if (activeFileMenuItem.folderId === message.folderId) {
    dispatch(
      setActiveFileMenuItem({
        folderName: "All files",
        fileKey: FILES_MENU_ITEMS.FILES_ALL,
      })
    );
    dispatch(
      GetFilesListAction({
        count: filesConstants.ITEM_COUNT,
        order: filesConstants.ORDER_BY,
        sort: filesConstants.SORT_BY,
        file: filesConstants.ALL,
        offset: filesConstants.OFFSET,
        fileType: filesConstants.ALL,
      })
    );
  }
  const state = store.getState();
  let searchFilterObject = state.folderReducer.searchFilterObject;
  let searchFileEnabled = state.folderReducer.searchFileEnabled;
  if (searchFileEnabled) {
    let {
      searchText,
      pageOffset,
      pageCount,
      discussionId,
      exact,
      fileType,
      activityType,
      startTime,
      stopTime,
      folderId,
      author,
      mention,
      target,
      sort,
      order,
      fileFilter,
    } = searchFilterObject;
    dispatch(
      getSearchResultWithFile(
        searchText,
        pageOffset,
        pageCount,
        discussionId,
        exact,
        fileType,
        activityType,
        startTime,
        stopTime,
        folderId,
        author,
        mention,
        target,
        sort,
        order,
        fileFilter
      )
    );
  } else {
    dispatch(
      GetFilesListAction({
        ...state.mainFilesReducer.fileFilterObject,
      })
    );
  }
}

function handleTaskUpdation(event, msg) {
  const message = msg.data;
  const ForwardedPostChannels = message.ForwardedPostChannels;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: UPDATE_MESSAGE_TASK,
      payload: {
        channelId: message.channelId,
        taskState: message.taskState,
        postId: message.taskId,
        preserveScrollPosition: true,
      },
    });

    dispatch({
      type: UPDATE_TASK_LIST,
      payload: {
        channelId: message.channelId,
      },
    });
    dispatch({
      type: UPDATE_SAVE_LIST,
      payload: {
        channelId: message.channelId,
      },
    });
    dispatch({
      type: UPDATE_TAG_LIST,
      payload: {
        channelId: message.channelId,
      },
    });
  }

  if (
    currentChannel &&
    ForwardedPostChannels &&
    ForwardedPostChannels.length > 0
  ) {
    const forwardedPost = ForwardedPostChannels.find(
      (item) => item.channelID === currentChannel.id
    );
    if (forwardedPost) {
      dispatch({
        type: UPDATE_MESSAGE_TASK,
        payload: {
          channelId: forwardedPost.channelID,
          taskState: message.taskState,
          postId: forwardedPost.id,
          preserveScrollPosition: true,
        },
      });

      dispatch({
        type: UPDATE_TASK_LIST,
        payload: {
          channelId: forwardedPost.channelID,
        },
      });
      dispatch({
        type: UPDATE_SAVE_LIST,
        payload: {
          channelId: forwardedPost.channelId,
        },
      });
      dispatch({
        type: UPDATE_TAG_LIST,
        payload: {
          channelId: forwardedPost.channelId,
        },
      });
    }
  }
  sendPushNotification(event, message);
}

function handleHiddenPost(msg) {
  const message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  const isPostOwner = message?.post?.user?.id;

  const discussionListMessages = state.ChannelReducer.channelList.map(
    (data) => {
      return data.LastPost;
    }
  );
  if (
    discussionListMessages.findIndex(
      (item) => item.id === message?.post?.id
    ) !== -1
  ) {
    dispatch({
      type: UPDATE_CHANNEL_MESSAGES_DATA,
      payload: { updatedData: Math.random() },
    });
    if (currentChannel && currentChannel.id === message.channelId) {
      dispatch(channelDetailAction(currentChannel.id));
    }
  }
  //Create a case for HIDDEN_FORWARD_POST
  dispatch({
    type: UPDATE_HIDDEN_FORWARD_POST,
    payload: {
      ForwardedPostChannels: message.ForwardedPostChannels,
      currentChannelId: currentChannel?.id,
    },
  });

  if (currentChannel && message.channelId === currentChannel.id) {
    if (message.parentPostId && message.parentPostId !== "") {
      dispatch({
        type: UPDATE_HIDDEN_REPLY_POST,
        payload: {
          channelId: message.channelId,
          postId: message.postId,
          isHidden: message.isHidden, //? message.isHidden : false
        },
      });

      dispatch({
        type: UPDATE_PARENT_POST_COUNT,
        payload: {
          parentPostId: message.parentPostId,
          replyCount: message.replyCount,
          // hiddenReplyCount:message.hiddenReplyCount,
          hiddenReplyCount:
            currentUser.id === isPostOwner
              ? message.post.hiddenReplyCount
              : message.hiddenReplyCount,
        },
      });
    } else {
      dispatch({
        type: UPDATE_HIDDEN_POST,
        payload: {
          channelId: message.channelId,
          postId: message.postId,
          isHidden: message.isHidden, //? message.isHidden : false,
        },
      });
    }

    dispatch({ type: UPDATE_SAVE_LIST });
    dispatch({ type: UPDATE_TAG_LIST });
    dispatch({ type: UPDATE_TASK_LIST });
    let queryParams = {
      channelId: message.channelId,
      user: false,
    };
    dispatch(fetchFileList(queryParams, false));
    // dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT))
  }
}

function handleUnhiddenPost(msg) {
  const message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  dispatch({
    type: UPDATE_UNHIDDEN_FORWARD_POST,
    payload: {
      ForwardedPostChannels: message.ForwardedPostChannels,
      currentChannelId: currentChannel?.id,
      message: message,
    },
  });
  if (currentChannel && message.channelId === currentChannel.id) {
    if (message.parentPostId && message.parentPostId !== "") {
      dispatch({
        type: UPDATE_UNHIDDEN_REPLY_POST,
        payload: {
          channelId: message.channelId,
          postId: message.postId,
          post: message.post,
          isHidden: false,
        },
      });

      dispatch({
        type: UPDATE_PARENT_POST_COUNT,
        payload: {
          parentPostId: message.parentPostId,
          replyCount: message.post.parentReplyCount,
          hiddenReplyCount: message.post.hiddenReplyCount,
        },
      });
    } else {
      dispatch({
        type: UPDATE_UNHIDDEN_POST,
        payload: {
          channelId: message.channelId,
          postId: message.postId,
          post: message.post,
          isHidden: false,
        },
      });
    }
    dispatch({ type: UPDATE_SAVE_LIST });
    dispatch({ type: UPDATE_TAG_LIST });
    dispatch({ type: UPDATE_TASK_LIST });
    let queryParams = {
      channelId: message.channelId,
      user: false,
    };
    dispatch(fetchFileList(queryParams, false));
    // dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT))
    dispatch(channelDetailAction(message.channelId));
  }
  dispatch({
    type: UPDATE_CHANNEL_MESSAGES_DATA,
    payload: { updatedData: Math.random() },
  });
}

function handleFilePreviewAvailability(msg) {
  const message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  if (currentChannel && message.channelId === currentChannel.id) {
    dispatch({
      type: FILE_PREVIEW_AVAILABLE,
      payload: message,
    });
  }
}
function forwardPostStatsUpdated(msg) {
  const message = msg.data;
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  dispatch({
    type: UPDATE_FORWARDED_POST_STATUS,
    payload: message,
  });
}
function postFwdByEmailUpdated(msg) {
  const message = msg.data;
  const state = store.getState();
  dispatch({
    type: POST_FWD_BY_EMAIL,
    payload: message,
  });
}

function handleDiscussionDeletionComplete(msg) {
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;
  const adminSelectedRow = state.config.adminSelectedRow;
  const discussionFilterObj = state.AdminDiscussionReducer.discussionFilterObj;
  let pathUrl = window.location.pathname;
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("account-management") &&
    msg.data.userId === adminSelectedRow.userId
  ) {
    dispatch(
      fetchUserDiscussionsList({
        userId: msg.data.userId,
        channelType: msg.data.channelType,
        offset: 0,
        count: 5,
      })
    );
  }
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("discussion")
  ) {
    if (msg.data.channelId === adminSelectedRow.id) {
      dispatch(
        setAdminSidebarPanel(
          { ...adminSelectedRow, ...msg.data, status: msg.data.channelStatus },
          "discussionDeleted"
        )
      );
    }
    dispatch(fetchDiscussionData(discussionFilterObj));
  }
  dispatch(completedChannelDeletionStatus(msg.data.channelId));
  dispatch({
    type: UPDATE_DELETE_INFO_STATS_FORWARD,
    payload: msg.data,
  });
  dispatch(GetChannelListAction(dispatch));
  if (currentChannel && currentChannel.id === msg.data.channelId) {
    dispatch(channelDetailAction(msg.data.channelId));
  }
}

function handleDiscussionDeletionInitiate(msg) {
  dispatch(initiateChannelDeletionStatus(msg.data.channelId));
}

function handleDiscussionArchiveInitiate(msg) {
  dispatch(initiateChannelArchiveStatus(msg.data.channelId));
}

function handleDiscussionArchiveComplete(msg) {
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const currentUser = state.AuthReducer.user;

  const adminSelectedRow = state.config.adminSelectedRow;
  let pathUrl = window.location.pathname;
  if (
    (currentUser.role === USER_ROLES.ADMIN ||
      currentUser.role === USER_ROLES.SUPER_ADMIN) &&
    pathUrl.includes("account-management") &&
    msg.data.userId === adminSelectedRow.userId
  ) {
    dispatch(
      fetchUserDiscussionsList({
        userId: msg.data.userId,
        channelType: msg.data.channelType,
        offset: 0,
        count: 5,
      })
    );
  }
  dispatch(completedChannelArchiveStatus(msg.data.channelId));
  dispatch(GetChannelListAction(dispatch));
  if (currentChannel && currentChannel.id === msg.data.channelId) {
    dispatch(channelDetailAction(msg.data.channelId));
  }
}

function handleBuildVersion(msg) {
  let buildVersion = null;
  msg.data &&
    msg.data.buildVersion &&
    Array.isArray(msg.data.buildVersion) &&
    msg.data.buildVersion.map((data) => {
      if (data.name === "WEBAPP") {
        buildVersion = data.version;
      }
      return data;
    });
  dispatch({
    type: UPDATE_APP_VERSION,
    payload: { buildVersion: buildVersion },
  });
}

function updateNotificaionStatus(msg) {
  dispatch({
    type: UPDATE_NOTIFICATION_STATUS,
    payload: {
      notificationId: msg.data.notificationId,
      state: msg.data.state,
      channelId: msg.data.channelId,
      notificationListIds: msg.data.notificationIdList,
    },
  });
  const state = store.getState();
  const currentChannels = state?.channelDetails;
  if (msg.data) {
    if (msg.data.notificationId === "channel") {
      dispatch(
        updateNotificationWS({
          channelId: currentChannels.id,
          actionStatus: "clear",
          type: "notification",
        })
      );
    } else {
      dispatch(
        updateNotificationWS({
          channelId: currentChannels.id,
          actionStatus: "down",
          type: "notification",
        })
      );
    }
  }
}

function hideNotificaionStatus(msg) {
  dispatch({
    type: HIDE_NOTIFICATION_STATUS,
    payload: {
      notificationId: msg.data.id,
      postId: msg.data.refPostID,
      channelId: msg.data.refChannelID,
      isHidden: true,
    },
  });
}
function unHideNotificaionStatus(msg) {
  dispatch({
    type: UNHIDE_NOTIFICATION_STATUS,
    payload: {
      notificationId: msg.data.id,
      postId: msg.data.refPostID,
      channelId: msg.data.refChannelID,
    },
  });
}

function markPostAsRead(msg) {
  const state = store.getState();
  const currentChannel = state.config.activeSelectedChannel;
  const message = msg?.data;
  const lastReadPostId = msg.data.postList
    ? msg.data.postList[msg.data.postList.length - 1]
    : msg.data.postId;
  const count = msg.data.postList ? msg.data.postList.length : 1;
  dispatch({
    type: UPDATE_DISCUSSION_LAST_READ_POST_ID,
    payload: {
      postId: lastReadPostId,
      channelId: msg.data.channelId,
      messagesReadCount: count,
    },
  });
  if (state.channelMessages.channelId === msg.data.channelId) {
    dispatch({
      type: MARK_POST_READ_STATUS,
      payload: {
        postList: msg.data.postList,
        channelId: msg.data.channelId,
      },
    });
    dispatch(fetchNotificationAction(0, 7));
  }

  const discussion = state.ChannelReducer.channelList.find((data) => {
    return data.id === msg.data.channelId;
  });
  if (discussion?.LastPost?.id === lastReadPostId) {
    dispatch({
      type: UPDATE_CHANNEL_MESSAGES_DATA,
      payload: { updatedData: Math.random() },
    });
    if (currentChannel && currentChannel.id === msg.data.channelId) {
      dispatch(channelDetailAction(currentChannel.id));
    }
  }
  dispatch(
    updateNotificationWS({
      channelId: message?.channelId,
      type: "readPost",
      postReadCount: message?.postList.length,
    })
  );
}

function userForceSignOut(msg) {
  dispatch(UserActions.signout());
}

export { GetWebSocketStatus };
