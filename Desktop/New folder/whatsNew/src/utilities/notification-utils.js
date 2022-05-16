import NotificationSettings from "../constants/websocket/notification-settings-constants";

export const isNotificationEnabled = (notificationFilter) => {
  if (notificationFilter === NotificationSettings.NOTIFICATION_DISABLED) {
    return false;
  } else {
    return true;
  }
};

export const isNewPost = (notificationFilter) => {
  var bitArray = notificationFilter
    .toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (parseInt(bitArray[2]) === 1) {
    return true;
  } else {
    return false;
  }
};

export const isMentionAndReaction = (notificationFilter) => {
  var bitArray = notificationFilter
    .toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (parseInt(bitArray[0]) === 1 && parseInt(bitArray[1]) === 1) {
    return true;
  } else {
    return false;
  }
};

export const isTask = (notificationFilter) => {
  var bitArray = notificationFilter
    .toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (parseInt(bitArray[5]) === 1) {
    return true;
  } else {
    return false;
  }
};

export const isTag = (notificationFilter) => {
  var bitArray = notificationFilter
    .toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (parseInt(bitArray[4]) === 1) {
    return true;
  } else {
    return false;
  }
};

export const isReply = (notificationFilter) => {
  var bitArray = notificationFilter
    .toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (parseInt(bitArray[3]) === 1) {
    return true;
  } else {
    return false;
  }
};

export const setNotificationFilter = (
  isEnabled,
  postEnabled,
  mentionReactionEnabled,
  taskEnabled,
  tagEnabled,
  replyEnabled
) => {
  let result = 0;
  if (!isEnabled) return NotificationSettings.NOTIFICATION_DISABLED;
  if (postEnabled) {
    result += NotificationSettings.NOTIFICATION_POST;
  }
  if (mentionReactionEnabled) {
    result += NotificationSettings.NOTIFICATION_MENTIONS_AND_REACTIONS;
  }
  if (taskEnabled) {
    result += NotificationSettings.NOTIFICATION_TASK;
  }
  if (tagEnabled) {
    result += NotificationSettings.NOTIFICATION_TAG;
  }
  if (replyEnabled) {
    result += NotificationSettings.NOTIFICATION_REPLY;
  }

  return result === 0
    ? isEnabled
      ? NotificationSettings.NOTIFICATION_RESERVED
      : NotificationSettings.NOTIFICATION_DISABLED
    : result === 63
    ? NotificationSettings.NOTIFICATION_ALL
    : result;
};
