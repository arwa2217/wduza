import server from "server";
const API_BASE_URL = server.apiUrl;

const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
};
export const CurrentChannelMessagesCapacity = 120;
export const POST_WINDOW_HOLDING_MIN_CAPACITY = 60;
export const IntervalUpdateLastReadMessage = 5000;
export const CurrentChannelCachedLimit = 100;
export const DATABASE_NAME = "appdb";
export const DB_VERSION = 30;
export const DB_VERSION_NEW = 31;
export const TABLE_POSTS = "POSTS";
export const TABLE_USERS = "USERS";
export const MENTION_NAME_REGEX =
  /^[\u0020\u0027\u0030-\u0039\u0041-\u005A\u0060-\u007a\u007E\u00C0-\u00F6\u00F8-\u00FF\u0100-\uFFFF]*$/;
export const NOTIFICATION_COUNT = 9;
export { API_BASE_URL, API_METHODS };
export const MAX_ITEM_SHOW = 20; // change this once we huge data
export const ITEM_COUNT = 20;  // change this once we huge data
