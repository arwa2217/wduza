import server from "server";
import { AuthHeader, removeAuthToken } from "../utilities/app-preference";
import RestConstants from "../constants/rest/rest-constants";

function handleResponse(response) {
  return response.text().then((text) => {
    const parsedJSON = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        removeAuthToken();
        location.reload(true); // eslint-disable-line
      }
      const error = parsedJSON || response.statusText;
      return Promise.reject(error);
    }

    return parsedJSON.data;
  });
}

function getBookmarkList() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/bookmark",
    requestOptions
  ).then(handleResponse);
}

function postBookmark(bookmark) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(bookmark),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/bookmark",
    requestOptions
  ).then(handleResponse);
}

function patchBookmark(bookmark) {
  const requestOptions = {
    method: "PATCH",
    headers: AuthHeader(),
    body: JSON.stringify(bookmark),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/bookmark",
    requestOptions
  ).then(handleResponse);
}

function deleteBookmark(bookmark) {
  const requestOptions = {
    method: "DELETE",
    headers: AuthHeader(),
    body: JSON.stringify(bookmark),
  };

  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/bookmark",
    requestOptions
  ).then(handleResponse);
}

function getLastMessage() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/message",
    requestOptions
  ).then(handleResponse);
}

function getUnreadNotification() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + "discussion/notification",
    requestOptions
  ).then(handleResponse);
}

const DiscussionService = {
  getBookmarkList,
  postBookmark,
  patchBookmark,
  deleteBookmark,
  getLastMessage,
  getUnreadNotification,
};

export default DiscussionService;
