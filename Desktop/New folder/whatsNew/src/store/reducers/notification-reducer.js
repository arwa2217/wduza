import {
  LOAD_CHANNEL_NOTIFICATION,
  LOAD_CHANNEL_NOTIFICATION_SUCCESS,
  LOAD_CHANNEL_NOTIFICATION_ERROR,
  UPDATE_CHANNEL_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_STATE_REQUEST,
  UPDATE_NOTIFICATION_STATE_SUCCESS,
  UPDATE_NOTIFICATION_STATE_ERROR,
  LOAD_DISCUSSION_NOTIFICATION,
  LOAD_DISCUSSION_NOTIFICATION_SUCCESS,
  LOAD_DISCUSSION_NOTIFICATION_FAILURE,
  CLEAN_DISCUSSION_NOTIFICATION,
  UPDATE_NOTIFICATION_STATUS,
  HIDE_NOTIFICATION_STATUS,
  UNHIDE_NOTIFICATION_STATUS,
  CLOSE_REPLY_NOTIFICATION,
} from "../actionTypes/notification-action-type";

const initialState = {
  loadingNotification: false,
  loadingNotificationError: false,
  notificationDetails: [],
  discussionNotificationList: [],
  discussionNotificationTotal: 0,
  discussionUnreadCount: 0,
  discussionRequestOffset: 0,
  getNotifications: false,
  discussionNotificationFilter: "All",
  getNotificationSuccess: false,
};

const generateReactionNotificationId = (notification) => {
  const { type, refPostID, refUserID, subType, id } = notification;
  return type === "reaction"
    ? `${refPostID ? refPostID : refUserID}-${type}-${subType}`
    : id;
};

const _getDiscussionListNotification = (oldList, newList) => {
  let resultList = [];
  resultList = oldList?.slice();

  newList &&
    newList.length > 0 &&
    newList.map((element) => {
      let exists = false;
      if (
        // eslint-disable-next-line array-callback-return
        resultList.map((data) => {
          if (data.id === element.id) {
            exists = true;
          }
        })
      )
        if (!exists) {
          resultList.push(element);
        }
      return true;
    });
  if (resultList && resultList.length > 0) {
    resultList.sort(function (a, b) {
      return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0;
    });
  }
  resultList = resultList.map((notification) => {
    return {
      ...notification,
      reactionNotificationId: generateReactionNotificationId(notification),
    };
  });
  return resultList;
};

const prependNotification = (notification) => {
  let tempNotificationList = initialState.notificationDetails.slice();
  let reactionNotificationId = generateReactionNotificationId(notification);
  let duplicateNotificationInd = tempNotificationList.findIndex(
    (i) => i.reactionNotificationId === reactionNotificationId
  );
  if (duplicateNotificationInd > -1) {
    tempNotificationList.splice(duplicateNotificationInd, 1);
  }
  tempNotificationList.unshift({ ...notification, reactionNotificationId });
  initialState.notificationDetails = tempNotificationList;
  return initialState.notificationDetails;
};

const prependDiscussionNotification = (
  notification,
  discussionNotificationList
) => {
  let tempNotificationList =
    discussionNotificationList?.length > 0
      ? discussionNotificationList.slice()
      : [];
  let reactionNotificationId = generateReactionNotificationId(notification);

  let duplicateNotificationInd = tempNotificationList.findIndex(
    (i) => i.reactionNotificationId === reactionNotificationId
  );
  if (duplicateNotificationInd > -1) {
    tempNotificationList.splice(duplicateNotificationInd, 1);
  }
  tempNotificationList.unshift({ ...notification, reactionNotificationId });
  return tempNotificationList;
};

const updateNotification = (notificationList) => {
  if (notificationList instanceof Array) {
    initialState.notificationDetails = notificationList.map((notification) => {
      return {
        ...notification,
        reactionNotificationId: generateReactionNotificationId(notification),
      };
    });
  }
  return initialState.notificationDetails;
};

const ChannelNotificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_CHANNEL_NOTIFICATION: {
      return {
        ...state,
        loadingNotification: false,
        getNotifications: false,
      };
    }
    case LOAD_CHANNEL_NOTIFICATION_ERROR: {
      return {
        ...state,
        loadingNotificationError: false,
        getNotifications: false,
      };
    }
    case LOAD_CHANNEL_NOTIFICATION_SUCCESS: {
      let tempChannelNotiPost = action.payload.data.notification.filter(
        (item) => item.userID === action.payload.userId || !item.isHidden
      );
      let totalChannelNotiPostCount =
        action.payload.data.total -
        action.payload.data.notification.length +
        tempChannelNotiPost.length;
      if (tempChannelNotiPost && tempChannelNotiPost.length === 0) {
        tempChannelNotiPost = undefined;
      }
      return {
        ...state,
        notificationDetails: updateNotification(tempChannelNotiPost),
        notificationTotal: totalChannelNotiPostCount,
        unread_count: action.payload.data.unread_count,
        getNotifications: false,
      };
    }
    case UPDATE_CHANNEL_NOTIFICATION_SUCCESS: {
      let updatedDiscussionNotificationList =
        state.discussionNotificationList &&
        state.discussionNotificationList.length > 0
          ? state.discussionNotificationList.slice()
          : [];
      if (action.payload.updateDiscussionList) {
        updatedDiscussionNotificationList = prependDiscussionNotification(
          action.payload.notification,
          state.discussionNotificationList
        );
      }
      return {
        ...state,
        notificationDetails: prependNotification(action.payload.notification),
        unread_count: state.unread_count ? state.unread_count + 1 : 1,
        discussionNotificationList: updatedDiscussionNotificationList,
        discussionUnreadCount: state.discussionUnreadCount + 1,
      };
    }
    case UPDATE_NOTIFICATION_STATE_REQUEST: {
      return {
        ...state,
        // discussionUnreadCount: state.discussionUnreadCount <= 1 ? 0 : state.discussionUnreadCount - 1,
        // unread_count: state.unread_count ? state.unread_count <= 1 ? 0 : state.unread_count - 1 : 0,
      };
    }
    case UPDATE_NOTIFICATION_STATE_SUCCESS: {
      let notiDetails = state.notificationDetails;
      let newArray = notiDetails.slice();
      const elementsIndex = state.notificationDetails.findIndex(
        (element) => element.id === action.payload.notificationId
      );
      newArray[elementsIndex] = {
        ...newArray[elementsIndex],
        state: action.payload.state,
      };
      let notiDiscussionDetails = state.discussionNotificationList;
      let newDiscussionArray = notiDiscussionDetails.slice();

      if (action.payload.notificationId === "all") {
        // eslint-disable-next-line array-callback-return
        newDiscussionArray.map((element) => {
          if (element.state !== "READ" && element.state !== action.payload.state) {
            element.state = action.payload.state;
          }
        });
      } else {
        const discussionElement = state.discussionNotificationList.findIndex(
          (element) => element.id === action.payload.notificationId
        );
        newDiscussionArray[discussionElement] = {
          ...newDiscussionArray[discussionElement],
          state: action.payload.state,
        };
      }
      return {
        ...state,
        notificationDetails: newArray,
        discussionNotificationList: newDiscussionArray,
        getNotifications: true,
        getNotificationSuccess: true,
      };
    }
    case UPDATE_NOTIFICATION_STATE_ERROR: {
      return {
        ...state,
        getNotifications: false,
      };
    }
    case CLOSE_REPLY_NOTIFICATION: {
      return {
        ...state,
        getNotificationSuccess: false,
      };
    }
    case LOAD_DISCUSSION_NOTIFICATION: {
      return {
        ...state,
        getNotifications: false,
      };
    }
    case LOAD_DISCUSSION_NOTIFICATION_SUCCESS: {
      let tempDiscussionNotPost = action.payload.data.notification.filter(
        (item) =>
          (item.refPostContent !== null && !item.isHidden) ||
          (item.refPostContent !== null &&
            item.userID === action.payload.userId)
      );
      let totalDiscPostCount =
        action.payload.data.total -
        action.payload.data.notification.length +
        tempDiscussionNotPost.length;
      if (tempDiscussionNotPost && tempDiscussionNotPost.length === 0) {
        tempDiscussionNotPost = undefined;
      }
      let discussionNotificationList = [];
      discussionNotificationList = state.discussionNotificationList;
      discussionNotificationList = _getDiscussionListNotification(
        tempDiscussionNotPost,
        discussionNotificationList
      );
      let discussionNotificationTotal = totalDiscPostCount;
      let discussionUnreadCount = action.payload.data.unread_count;
      let discussionRequestOffset = discussionNotificationList?.length;
      return {
        ...state,
        discussionNotificationList: discussionNotificationList,
        discussionNotificationTotal: discussionNotificationTotal,
        discussionUnreadCount: discussionUnreadCount,
        discussionRequestOffset: discussionRequestOffset,
        discussionNotificationFilter: action.payload.filter,
        getNotifications: false,
      };
    }
    case LOAD_DISCUSSION_NOTIFICATION_FAILURE: {
      return {
        ...state,
        getNotifications: false,
      };
    }
    case CLEAN_DISCUSSION_NOTIFICATION: {
      return {
        ...state,
        discussionNotificationList: [],
        discussionNotificationTotal: 0,
        discussionUnreadCount: 0,
        discussionRequestOffset: 0,
        getNotifications: false,
        discussionNotificationFilter: "All",
      };
    }
    case UPDATE_NOTIFICATION_STATUS: {
      let stateNotif = [...state.notificationDetails];
      var tempDiscussionUnreadCount = state.discussionUnreadCount;
      var temp_unread_count = state.unread_count;
      var unreadCount = 0;

      let tempDiscussionNotif = [...state.discussionNotificationList];
      if (
        action.payload.notificationListIds?.length > 0 &&
        action.payload.notificationId === ""
      ) {
        action.payload.notificationListIds &&
          action.payload.notificationListIds.map((item, index) => {
            const readIndex = stateNotif?.findIndex(
              (value) => item === value?.id
            );
            if (readIndex >= 0) {
              stateNotif[readIndex].state = action.payload.state;
            }
            return item;
          });
        action.payload.notificationListIds &&
          action.payload.notificationListIds.map((item, index) => {
            const updateDiscussionNotifIndex = tempDiscussionNotif?.findIndex(
              (value) => item === value?.id
            );
            if (updateDiscussionNotifIndex >= 0) {
              tempDiscussionNotif[updateDiscussionNotifIndex].state =
                action.payload.state;
            }
            return item;
          });

        if (action.payload.state === "READ") {
          tempDiscussionUnreadCount =
            tempDiscussionUnreadCount <= 1 ? 0 : tempDiscussionUnreadCount - 1;
          temp_unread_count = temp_unread_count
            ? temp_unread_count <= 1
              ? 0
              : temp_unread_count - 1
            : 0;
        }
      }
      /* Off icon notification */
      if (action.payload.notificationId === "all") {
        stateNotif.map((item) => {
          if (item.state === "UNREAD") {
            item.state = "READ";
          }
          return item;
        });
        tempDiscussionNotif.map((item) => {
          if (item.state === "UNREAD") {
            item.state = "READ";
          }
          return item;
        });
        // tempDiscussionUnreadCount = 0;
        // temp_unread_count = 0;
      } else {
        if (
          state.discussionNotificationList.length > 0 &&
          action.payload.channelId ===
            state.discussionNotificationList[0].refChannelID
        ) {
          stateNotif.map((item) => {
            if (
              item.refChannelID === action.payload.chanelId &&
              item.state === "UNREAD"
            ) {
              item.state = "READ";
            }
            return item;
          });
          tempDiscussionNotif.map((item) => {
            if (item.state === "UNREAD") {
              unreadCount++;
              item.state = "READ";
            }
            return item;
          });
          tempDiscussionUnreadCount = 0;
          temp_unread_count = temp_unread_count
            ? temp_unread_count - unreadCount > 0
              ? temp_unread_count - unreadCount
              : 0
            : 0;
        } else {

          let updateNotifIndex = stateNotif.findIndex(
            (item) => item.id === action.payload.notificationId
          );
          if (updateNotifIndex !== -1) {
            stateNotif[updateNotifIndex].state = action.payload.state;
          }

          let updateDiscussionNotifIndex = tempDiscussionNotif.findIndex(
            (item) => item.id === action.payload.notificationId
          );
          if (updateDiscussionNotifIndex !== -1) {
            tempDiscussionNotif[updateDiscussionNotifIndex].state = action.payload.state;
          }
          if (action.payload.state === "READ" ) {
            tempDiscussionUnreadCount = tempDiscussionUnreadCount <= 1
                                        ? 0
                                        : tempDiscussionUnreadCount - 1;
            temp_unread_count = temp_unread_count
                                && temp_unread_count <= 1
                                ? 0
                                : temp_unread_count - 1;
          }
        }
      }

      return {
        ...state,
        notificationDetails: stateNotif,
        discussionNotificationList: tempDiscussionNotif,
        unread_count: temp_unread_count,
        discussionUnreadCount: tempDiscussionUnreadCount,
      };
    }
    case HIDE_NOTIFICATION_STATUS: {
      let stateNotif = [...state.notificationDetails];
      let tempDiscussionNotif = [...state.discussionNotificationList];
      stateNotif.map((item) => {
        if (item.refPostID === action.payload.postId) {
          item.isHidden = true;
        }
        return item;
      });
      tempDiscussionNotif.map((item) => {
        if (item.refPostID === action.payload.postId) {
          item.isHidden = true;
        }
        return item;
      });
      return {
        ...state,
        notificationDetails: stateNotif,
        discussionNotificationList: tempDiscussionNotif,
        discussionUnreadCount: tempDiscussionUnreadCount,
      };
    }

    case UNHIDE_NOTIFICATION_STATUS: {
      let stateNotif = [...state.notificationDetails];
      let tempDiscussionNotif = [...state.discussionNotificationList];
      stateNotif.map((item) => {
        if (item.refPostID === action.payload.postId) {
          item.isHidden = false;
        }
        return item;
      });
      tempDiscussionNotif.map((item) => {
        if (item.refPostID === action.payload.postId) {
          item.isHidden = false;
        }
        return item;
      });
      return {
        ...state,
        notificationDetails: stateNotif,
        discussionNotificationList: tempDiscussionNotif,
        discussionUnreadCount: tempDiscussionUnreadCount,
      };
    }
    default:
      return state;
  }
};

export default ChannelNotificationReducer;
