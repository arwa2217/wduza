import ValueConstants from "../constants/rest/value-constants";
/*
 *The auth header is used to make authenticated HTTP requests to the server api using JWT authentication
 */

export function AuthHeader(contentType) {
  let token = getAuthToken();
  if (token) {
    return {
      Authorization: "Bearer " + token,
      "Content-Type": contentType ? contentType : "application/json",
    };
  } else {
    return { "Content-Type": contentType ? contentType : "application/json" };
  }
}

export function getAuthToken() {
  let authToken = sessionStorage.getItem(ValueConstants.STRING_AUTH);

  if (!authToken) {
    authToken = localStorage.getItem(ValueConstants.STRING_AUTH);
  }
  return JSON.parse(authToken);
}

export function getUID() {
  let uid = sessionStorage.getItem(ValueConstants.UID);
  if (!uid) {
    uid = localStorage.getItem(ValueConstants.UID);
  }
  return JSON.parse(uid);
}

export function saveAuthToken(token, uid) {
  if (token) {
    localStorage.setItem(ValueConstants.STRING_AUTH, JSON.stringify(token));
  }

  if (uid) {
    localStorage.setItem(ValueConstants.UID, JSON.stringify(uid));
  }
}

export function removeAuthToken() {
  if (getAuthTokenFromSessionStorage()) {
    removeSessionStorageToken();
  } else {
    localStorage.removeItem(ValueConstants.STRING_AUTH);
    localStorage.removeItem(ValueConstants.UID);
  }
  localStorage.removeItem(ValueConstants.LAST_SELECTED_CHANNEL_ID);
}

export function saveAuthTokenInSessionStorage(token, uid) {
  if (token) {
    sessionStorage.setItem(ValueConstants.STRING_AUTH, JSON.stringify(token));
  }

  if (uid) {
    sessionStorage.setItem(ValueConstants.UID, JSON.stringify(uid));
  }
}

export function getAuthTokenFromSessionStorage() {
  return JSON.parse(sessionStorage.getItem(ValueConstants.STRING_AUTH));
}
export function editPostPopupStore() {
  return JSON.parse(localStorage.getItem("editPostPopup"));
}
export function getHidePostPopupStore() {
  return JSON.parse(localStorage.getItem("hidePostPopup"));
}
export function getUIDfromSessionStorage() {
  return JSON.parse(sessionStorage.getItem(ValueConstants.UID));
}

export function removeSessionStorageToken() {
  sessionStorage.removeItem(ValueConstants.STRING_AUTH);
  sessionStorage.removeItem(ValueConstants.UID);
}

export function setPushNotificationPermission(status) {
  localStorage.setItem(ValueConstants.PUBLISH_PERMISSION, status);
}

export function getPushNotificationPermission() {
  return localStorage.getItem(ValueConstants.PUBLISH_PERMISSION);
}

export function setLastSelectedChannelId(channelId) {
  localStorage.setItem(ValueConstants.LAST_SELECTED_CHANNEL_ID, channelId);
}
export function getLastSelectedChannelId() {
  return localStorage.getItem(ValueConstants.LAST_SELECTED_CHANNEL_ID);
}

export function getContentLanguage() {
  return localStorage.getItem(ValueConstants.CONTENT_LANGUAGE);
}

export function setContentLanguage(lng) {
  localStorage.setItem(ValueConstants.CONTENT_LANGUAGE, lng);
}

export function getForwardSelectedChannelId() {
  return localStorage.getItem(ValueConstants.FORWARD_SELECTED_CHANNEL_ID);
}

export function setForwardSelectedChannelId(id) {
  localStorage.setItem(ValueConstants.FORWARD_SELECTED_CHANNEL_ID, id);
}
