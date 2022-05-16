import { API_METHODS } from "../../constants";
import { AuthHeader } from "../../utilities/app-preference";
import { API_BASE_URL } from "../../constants";
import {
  LOAD_CHANNEL_NOTIFICATION,
  LOAD_CHANNEL_NOTIFICATION_SUCCESS,
  LOAD_CHANNEL_NOTIFICATION_ERROR,
  UPDATE_NOTIFICATION_STATE_REQUEST,
  UPDATE_NOTIFICATION_STATE_SUCCESS,
  UPDATE_NOTIFICATION_STATE_ERROR,
  LOAD_DISCUSSION_NOTIFICATION,
  LOAD_DISCUSSION_NOTIFICATION_SUCCESS,
  LOAD_DISCUSSION_NOTIFICATION_FAILURE,
  CLEAN_DISCUSSION_NOTIFICATION,
  CLOSE_REPLY_NOTIFICATION,
} from "../actionTypes/notification-action-type";
import { store } from "../store";
import { createAction } from "redux-api-middleware";
import RestConstants from "../../constants/rest/rest-constants";
const fetchNotificationAction = (start, end, filter = "") =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.NOTIFICATIONS +
      RestConstants.QUERY_OFFSET +
      start +
      RestConstants.QUERY_COUNT +
      end +
      RestConstants.QUERY_FILTER +
      filter,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      LOAD_CHANNEL_NOTIFICATION,
      // LOAD_CHANNEL_NOTIFICATION_SUCCESS,
      {
        type: LOAD_CHANNEL_NOTIFICATION_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                userId: store.getState().AuthReducer.user.id,
              };
            });
          }
          return {
            data: res,
            userId: store.getState().AuthReducer.user.id,
          };
        },
      },
      LOAD_CHANNEL_NOTIFICATION_ERROR,
    ],
  });

const updateNotificationState = (notificationId, state, filter = "") =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.NOTIFICATIONS +
      "/" +
      notificationId +
      "/" +
      filter,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify({ state: state }),
    types: [
      UPDATE_NOTIFICATION_STATE_REQUEST,
      {
        type: UPDATE_NOTIFICATION_STATE_SUCCESS,
        payload: { notificationId: notificationId, state: state },
      },
      UPDATE_NOTIFICATION_STATE_ERROR,
    ],
  });

const fetchDiscussionNotificationAction = (
  channel,
  start,
  end,
  filter = ""
) => {
  return createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL_V2 +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      RestConstants.SLASH +
      channel.id +
      RestConstants.MEMBERS +
      RestConstants.SLASH +
      RestConstants.NOTIFICATION_FILTER +
      RestConstants.QUERY_OFFSET +
      start +
      RestConstants.QUERY_COUNT +
      end +
      RestConstants.QUERY_FILTER +
      filter,
    method: API_METHODS.GET,
    headers: AuthHeader(),
    types: [
      LOAD_DISCUSSION_NOTIFICATION,
      {
        type: LOAD_DISCUSSION_NOTIFICATION_SUCCESS,
        payload: (action, state, res) => {
          const contentType = res.headers.get("Content-Type");
          if (contentType && ~contentType.indexOf("json")) {
            // Just making sure res.json() does not raise an error
            return res.json().then((json) => {
              return {
                data: json.data,
                channel: channel,
                offset: start,
                filter: filter,
                userId: store.getState().AuthReducer.user.id,
              };
            });
          }
          return {
            data: res,
            channel: channel,
            userId: store.getState().AuthReducer.user.id,
          };
        },
      },
      LOAD_DISCUSSION_NOTIFICATION_FAILURE,
    ],
  });
};

const updateDiscussionNotificationState = (
  notificationId,
  state,
  channel,
  filter = ""
) =>
  createAction({
    endpoint:
      API_BASE_URL +
      RestConstants.BASE_URL +
      RestConstants.NOTIFICATIONS +
      "/" +
      notificationId +
      "/" +
      filter,
    method: API_METHODS.PUT,
    headers: AuthHeader(),
    body: JSON.stringify({ channelId: channel?.id, state: state }),
    types: [
      UPDATE_NOTIFICATION_STATE_REQUEST,
      {
        type: UPDATE_NOTIFICATION_STATE_SUCCESS,
        payload: { notificationId: notificationId, state: state },
      },
      UPDATE_NOTIFICATION_STATE_ERROR,
    ],
  });
const cleanDiscussionNotificationState = () => {
  return {
    type: CLEAN_DISCUSSION_NOTIFICATION,
  };
};
const closeReplyNotificationState = () => {
  return {
    type: CLOSE_REPLY_NOTIFICATION,
  };
};
export {
  fetchNotificationAction,
  updateNotificationState,
  fetchDiscussionNotificationAction,
  updateDiscussionNotificationState,
  cleanDiscussionNotificationState,
  closeReplyNotificationState,
};
