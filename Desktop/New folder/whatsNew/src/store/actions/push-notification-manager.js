import WebSocketEvents from "../../constants/websocket/WebSocketEvents";
import { store } from "../store";
import {
  setActiveMenuItem,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import { toggleUnreadMessage } from "../../store/actions/channelMessagesAction";
import CommonUtils from "../../../src/components/utils/common-utils";
import { updateNotificationState } from "../../store/actions/notification-action";
import {
  setPushNotificationPermission,
  getPushNotificationPermission,
} from "../../utilities/app-preference";
import Panel from "../../components/actionpanel/panel";
import NotificationSettings from "../../constants/websocket/notification-settings-constants";
import features from "features";
import { MENU_ITEMS } from "../../constants/menu-items";
import i18next from "i18next";

const t = (input, data) => {
  if (data) {
    return i18next.t(`push.notifications:${input}`, { ...data });
  } else {
    return i18next.t(`push.notifications:${input}`);
  }
};

const dispatch = store.dispatch;

/*Check if Notification are enabled & browser permission are granted*/
export function sendPushNotification(event, data) {
  const state = store.getState();
  const currentUser = state.AuthReducer.user;
  if (
    currentUser.notificationFilter !==
    NotificationSettings.NOTIFICATION_DISABLED
  ) {
    if (
      getPushNotificationPermission() &&
      getPushNotificationPermission() === "granted"
    ) {
      publishNotification(event, data);
    } else if (
      !getPushNotificationPermission() ||
      getPushNotificationPermission() !== "denied"
    ) {
      Notification.requestPermission(function (status) {
        setPushNotificationPermission(status);
        if (status === "granted") {
          publishNotification(event, data);
        }
      });
    }
  }
}

function publishNotification(event, msg) {
  const state = store.getState();
  const currentUser = state.AuthReducer.user;
  let title = t("title");
  const channel = CommonUtils.getChannelById(msg.refChannelID || msg.channelId);

  /* Check if discussion level Notifications permissions and is discussion level
  enabled or not */
  if (
    channel?.notificationFilter !==
      NotificationSettings.NOTIFICATION_DISABLED ||
    features.disable_discussion_notification
  ) {
    if (
      event === WebSocketEvents.NEW_POST &&
      !msg.post.edited &&
      msg.user.id !== "system" &&
      msg.post.type !== "TASK"
    ) {
      /*handle new post notification*/
      if (msg.parentId === "") {
        if (
          isNewPostNotificationEnabled(
            channel?.notificationFilter,
            currentUser.notificationFilter
          )
        ) {
          if (
            msg.mentions &&
            msg.mentions.findIndex((userId) => {
              return userId === currentUser.id;
            }) !== -1 &&
            isMentionAndReactionNotificationEnabled(
              channel?.notificationFilter,
              currentUser.notificationFilter
            )
          ) {
            return;
          } else {
            pushNewPostEvent(title, msg);
          }
        }
      } else if (msg.parentId !== "") {
        if (
          isReplyNotificationEnabled(
            channel?.notificationFilter,
            currentUser.notificationFilter
          )
        ) {
          if (
            msg.mentions &&
            msg.mentions.findIndex((userId) => {
              return userId === currentUser.id;
            }) !== -1 &&
            isMentionAndReactionNotificationEnabled(
              channel?.notificationFilter,
              currentUser.notificationFilter
            )
          ) {
            return;
          } else {
            pushNewPostEvent(title, msg);
          }
        }
      }
    } else if (event === WebSocketEvents.NEW_POST && msg.post.type === "TASK") {
      if (
        isTaskNotificationEnabled(
          channel?.notificationFilter,
          currentUser.notificationFilter
        ) &&
        msg.task?.taskAssignee === currentUser.id
      ) {
        if (
          msg.mentions &&
          msg.mentions.findIndex((userId) => {
            return userId === currentUser.id;
          }) !== -1 &&
          isMentionAndReactionNotificationEnabled(
            channel?.notificationFilter,
            currentUser.notificationFilter
          )
        ) {
          return;
        } else {
          pushNewTaskEvent(title, msg);
        }
      }
    }

    if (event === WebSocketEvents.SHOW_NOTIFICATION) {
      pushNotificationEvent(title, msg, currentUser);
    }
    if (
      event === WebSocketEvents.TASK_STATUS_UPDATE &&
      isTaskNotificationEnabled(
        channel?.notificationFilter,
        currentUser.notificationFilter
      )
    ) {
      pushTaskEvent(title, msg, currentUser);
    }
  }
}

function pushNewPostEvent(title, msg) {
  if (msg.parentId === "") {
    title += t("new.message", {
      displayName: msg.user?.displayName,
      channelName: msg.channelName,
    });
  } else {
    title += t("reply.message", {
      displayName: msg.user?.displayName,
      channelName: msg.channelName,
    });
  }
  let bodyMsg = msg.post.content.replace(/(<([^>]+)>)/gi, "");

  triggerNewPost(title, bodyMsg, msg);
}

function pushNewTaskEvent(title, msg) {
  if (!msg.post.edited) {
    title += t("create.task", {
      displayName: msg.user?.displayName,
      channelName: msg.channelName,
    });
  } else {
    title += t("edit.task", {
      displayName: msg.user?.displayName,
      channelName: msg.channelName,
    });
  }
  let bodyMsg = `[${msg.task?.taskStatus}] ${msg.task?.taskTitle} ${
    msg.post.content ? `: ${msg.post.content.replace(/(<([^>]+)>)/gi, "")}` : ""
  }`;
  triggerNewPost(title, bodyMsg, msg);
}

function pushNotificationEvent(title, msg, currentUser) {
  const state = store.getState();
  const activeUser = state.AuthReducer.user;
  const channel = CommonUtils.getChannelById(msg.refChannelID);
  let bodyMsg = "";
  if (msg.userID === currentUser.id) {
    if (msg.type === "mention") {
      if (
        isMentionAndReactionNotificationEnabled(
          channel?.notificationFilter,
          activeUser.notificationFilter
        )
      ) {
        [title, bodyMsg] = pushMentionNotification(title, msg, bodyMsg);
        triggerNotification(title, bodyMsg, msg);
      }
    } else if (msg.type === "reaction") {
      if (
        isMentionAndReactionNotificationEnabled(
          channel?.notificationFilter,
          activeUser.notificationFilter
        )
      ) {
        [title, bodyMsg] = pushReactionNotification(title, msg, bodyMsg);
        triggerNotification(title, bodyMsg, msg);
      }
    } else if (msg.type === "channel") {
      if (msg.subType === "tagged") {
        if (
          isTagNotificationEnabled(
            channel?.notificationFilter,
            activeUser.notificationFilter
          )
        ) {
          [title, bodyMsg] = pushChannelTagNotification(title, msg, bodyMsg);
          triggerNotification(title, bodyMsg, msg);
        }
      } else {
        if (
          isNewPostNotificationEnabled(
            channel?.notificationFilter,
            activeUser.notificationFilter
          )
        ) {
          [title, bodyMsg] = pushChannelNotification(title, msg, bodyMsg);
          triggerNotification(title, bodyMsg, msg);
        }
      }
    }
  }
}

function pushMentionNotification(title, msg, bodyMsg) {
  title += t("mention.message", {
    displayName: msg.userScreenName,
    channelName: msg.channelName,
  });
  bodyMsg = CommonUtils.extractTextFromHTML(
    msg.refPostContent
      ? JSON.parse(Buffer(msg.refPostContent, "base64").toString("utf-8")).post
          .content
      : ""
  );

  return [title, bodyMsg];
}

function pushReactionNotification(title, msg, bodyMsg) {
  title += t("reaction.message", {
    displayName: msg.userScreenName,
    channelName: msg.channelName,
    reactionType: msg.subType,
  });
  bodyMsg = CommonUtils.extractTextFromHTML(
    msg.refPostContent
      ? JSON.parse(Buffer(msg.refPostContent, "base64").toString("utf-8")).post
          .content
      : ""
  );

  return [title, bodyMsg];
}

function pushChannelNotification(title, msg, bodyMsg) {
  if (msg.subType === "added") {
    title += t("channel.add", {
      displayName: msg.userScreenName,
      channelName: msg.channelName,
    });
    bodyMsg = t("channel.add.body");
  } else if (msg.subType === "deleted") {
    title += t("channel.deleted", {
      displayName: msg.userScreenName,
      channelName: msg.channelName,
    });
    bodyMsg = t("channel.deleted.body");
  } else if (msg.subType === "archived") {
    title += t("channel.archived", {
      displayName: msg.userScreenName,
      channelName: msg.channelName,
    });
    bodyMsg = t("channel.archived.body");
  } else if (msg.subType === "invited") {
    title += t("channel.invited", {
      displayName: msg.userScreenName,
      channelName: msg.channelName,
    });
    bodyMsg = t("channel.invited.body");
  }
  return [title, bodyMsg];
}

function pushChannelTagNotification(title, msg, bodyMsg) {
  title += t("channel.tagged", {
    displayName: msg.userScreenName,
    channelName: msg.channelName,
  });
  bodyMsg = CommonUtils.extractTextFromHTML(
    msg.refPostContent
      ? JSON.parse(Buffer(msg.refPostContent, "base64").toString("utf-8")).post
          .content
      : ""
  );
  return [title, bodyMsg];
}

function triggerNotification(title, bodyMsg, msg) {
  if (bodyMsg !== "" && bodyMsg !== t("channel.invited.body")) {
    let n = new Notification(title, { body: htmlDecode(bodyMsg) });
    n.onclick = function () {
      // eslint-disable-next-line no-restricted-globals
      parent.focus();
      if (msg.type === "channel" && msg.subType !== "tagged") {
        let activeMenuItem = store.getState().config.activeMenuItem;
        if (activeMenuItem !== MENU_ITEMS.COLLECTIONS) {
          dispatch(setActiveMenuItem(MENU_ITEMS.COLLECTIONS));
        }
        let channel = CommonUtils.getChannelById(msg.refChannelID);
        dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
      } else {
        if (msg.state === "UNREAD") {
          dispatch(updateNotificationState(msg.id, "READ"));
        }

        let postContent = msg.refPostContent
          ? JSON.parse(Buffer(msg.refPostContent, "base64").toString("utf-8"))
          : "";
        let postId = postContent
          ? postContent.reply.parentId
            ? postContent.reply.parentId
            : postContent.post.id
          : "";

        let childId = postContent
          ? postContent.reply.parentId
            ? postContent.post.id
            : ""
          : "";

        let toggleUnreadMessageFlag =
          store.getState().channelMessages.toggleUnreadMessage;
        if (toggleUnreadMessageFlag) {
          dispatch(toggleUnreadMessage(msg.refChannelID, false));
        }
        CommonUtils.performNotificationAction(
          msg.channelName,
          msg.type,
          msg.subType,
          msg.refChannelID,
          postId,
          childId,
          store.dispatch
        );
      }
    };
  } else if (bodyMsg === t("channel.invited.body")) {
    let n = new Notification(title, { body: htmlDecode(bodyMsg) });
    n.onclick = function () {
      // eslint-disable-next-line no-restricted-globals
      parent.focus();
      let activeMenuItem = store.getState().config.activeMenuItem;
      if (activeMenuItem !== MENU_ITEMS.COLLECTIONS) {
        dispatch(setActiveMenuItem(MENU_ITEMS.COLLECTIONS));
      }
      let channel = CommonUtils.getChannelById(msg.refChannelID);
      if (channel.IsInvitePending) {
        dispatch(
          setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, channel)
        );
        return;
      }
      dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
    };
  }
}

function triggerNewPost(title, bodyMsg, msg) {
  let n = new Notification(title, { body: htmlDecode(bodyMsg) });
  n.onclick = function () {
    let toggleUnreadMessageFlag =
      store.getState().channelMessages.toggleUnreadMessage;
    if (toggleUnreadMessageFlag) {
      dispatch(toggleUnreadMessage(msg.refChannelID, false));
    }

    // eslint-disable-next-line no-restricted-globals
    parent.focus();
    CommonUtils.performNotificationAction(
      msg.channelName,
      "push",
      "new message",
      msg.channelId,
      msg.parentId ? msg.parentId : msg.post.id,
      msg.parentId ? msg.post.id : "",
      store.dispatch
    );
  };
}

function pushTaskEvent(title, msg) {
  if (
    msg.taskStateUpdatedBy !== store.getState()?.AuthReducer?.user?.id &&
    msg.taskCreatedBy === store.getState()?.AuthReducer?.user?.id
  ) {
    let taskState = t(`${msg.taskState.toLowerCase()}`);
    title += t("task.update.author", { status: taskState });
  }
  if (
    msg.taskStateUpdatedBy !== store.getState()?.AuthReducer?.user?.id &&
    msg.taskAssignee === store.getState()?.AuthReducer?.user?.id
  ) {
    let taskState = t(`${msg.taskState.toLowerCase()}`);
    title += t("task.update.assignee", { status: taskState });
  }

  if (title !== t("title")) {
    let bodyMsg = "";
    const channel = CommonUtils.getChannelById(msg.channelId);
    let n = new Notification(title, { body: htmlDecode(bodyMsg) });
    n.onclick = function () {
      let toggleUnreadMessageFlag =
        store.getState().channelMessages.toggleUnreadMessage;
      if (toggleUnreadMessageFlag) {
        dispatch(toggleUnreadMessage(msg.refChannelID, false));
      }
      // eslint-disable-next-line no-restricted-globals
      parent.focus();
      CommonUtils.performNotificationAction(
        channel.name,
        "push",
        "new message",
        msg.channelId,
        msg.taskId,
        "",
        store.dispatch
      );
    };
  }
}

function isNewPostNotificationEnabled(discussionFilter, globalFilter) {
  var discussionFlags = discussionFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  var globalFlags = globalFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (features.disable_discussion_notification) {
    if (parseInt(globalFlags[2]) === 1) {
      return true;
    }
  } else {
    if (
      globalFilter !== NotificationSettings.NOTIFICATION_DISABLED &&
      parseInt(discussionFlags[2]) === 1
    ) {
      return true;
    }
  }

  return false;
}

function isMentionAndReactionNotificationEnabled(
  discussionFilter,
  globalFilter
) {
  var discussionFlags = discussionFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  var globalFlags = globalFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (features.disable_discussion_notification) {
    if (parseInt(globalFlags[0]) === 1 && parseInt(globalFlags[1]) === 1) {
      return true;
    }
  } else {
    if (
      globalFilter !== NotificationSettings.NOTIFICATION_DISABLED &&
      parseInt(discussionFlags[0]) === 1 &&
      parseInt(discussionFlags[1]) === 1
    ) {
      return true;
    }
  }
  return false;
}

function isReplyNotificationEnabled(discussionFilter, globalFilter) {
  var discussionFlags = discussionFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  var globalFlags = globalFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (features.disable_discussion_notification) {
    if (parseInt(globalFlags[3]) === 1) {
      return true;
    }
  } else {
    if (
      globalFilter !== NotificationSettings.NOTIFICATION_DISABLED &&
      parseInt(discussionFlags[3]) === 1
    ) {
      return true;
    }
  }

  return false;
}

function isTagNotificationEnabled(discussionFilter, globalFilter) {
  var discussionFlags = discussionFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  var globalFlags = globalFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (features.disable_discussion_notification) {
    if (parseInt(globalFlags[4]) === 1) {
      return true;
    }
  } else {
    if (
      globalFilter !== NotificationSettings.NOTIFICATION_DISABLED &&
      parseInt(discussionFlags[4]) === 1
    ) {
      return true;
    }
  }

  return false;
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function isTaskNotificationEnabled(discussionFilter, globalFilter) {
  var discussionFlags = discussionFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  var globalFlags = globalFilter
    ?.toString(2)
    .padStart(8, "0")
    .split("")
    .reverse();
  if (features.disable_discussion_notification) {
    if (parseInt(globalFlags[5]) === 1) {
      return true;
    }
  } else {
    if (
      globalFilter !== NotificationSettings.NOTIFICATION_DISABLED &&
      parseInt(discussionFlags[5]) === 1
    ) {
      return true;
    }
  }

  return false;
}
