import server from "server";
import { AuthHeader, removeAuthToken } from "../utilities/app-preference";
import RestConstants from "../constants/rest/rest-constants";
import axios from "axios";

/*
 *Used to communicate with the backend services
 */

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        signout();
        location.reload(true); // eslint-disable-line
      }

      const error = data || response.statusText;
      return Promise.reject(error);
    }
    /*
        Structure for data is :
                {
                    code : '',
                    message: '',
                    data : ''
                }
                use accordingly
        */
    return data;
  });
}

function signout() {
  // remove user from local storage to log user out
  removeAuthToken();
}

function addChannelMember(channelId, channel, isAdmin) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify(channel),
  };

  return fetch(
    isAdmin
      ? `${server.apiUrl}/ent/v1/admin/discussion`
      : `${server.apiUrl}` +
          RestConstants.BASE_URL_V2 +
          RestConstants.CHANNELS +
          RestConstants.IDS +
          "/" +
          channelId +
          RestConstants.MEMBERS,
    requestOptions
  ).then(handleResponse);
}

function removeChannelMember(channelId, userID) {
  const requestOptions = {
    method: "DELETE",
    headers: AuthHeader(),
    body: JSON.stringify({
      userId: userID,
    }),
  };

  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      "/" +
      channelId +
      RestConstants.MEMBERS,
    requestOptions
  ).then(handleResponse);
}

function createChannel(channel) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({
      name: channel.name,
      description: channel.description,
      type: channel.type,
    }),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + RestConstants.CHANNELS,
    requestOptions
  ).then(handleResponse);
}

function createDirectChannel(channel, otherUserEmail) {
  const requestOptions = {
    method: "POST",
    headers: AuthHeader(),
    body: JSON.stringify({
      name: channel.name,
      type: channel.type,
      description: channel.description,
      otherUserEmail: otherUserEmail,
    }),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + RestConstants.CHANNELS,
    requestOptions
  ).then(handleResponse);
}

function getChannelMembers(channelId) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };

  return fetch(
    `${server.apiUrl}` +
      RestConstants.BASE_URL +
      RestConstants.CHANNELS +
      RestConstants.IDS +
      "/" +
      channelId +
      RestConstants.MEMBERS,
    requestOptions
  ).then(handleResponse);
}

function getChannelDetailById(channelId) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  let url =
    `${server.apiUrl}` + RestConstants.BASE_URL_V2 + RestConstants.CHANNELS;
  url =
    url +
    RestConstants.QUERY_TYPE +
    "id" +
    RestConstants.QUERY_VALUE +
    channelId;

  return fetch(url, requestOptions).then(handleResponse);
}

function getChannelDetailByName(channelName) {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  let url =
    `${server.apiUrl}` + RestConstants.BASE_URL + RestConstants.CHANNELS;
  url =
    url +
    RestConstants.QUERY_TYPE +
    "name" +
    RestConstants.QUERY_VALUE +
    channelName;

  return fetch(url, requestOptions).then(handleResponse);
}

function getChannelList() {
  const requestOptions = {
    method: "GET",
    headers: AuthHeader(),
  };
  return fetch(
    `${server.apiUrl}` + RestConstants.BASE_URL + RestConstants.CHANNELS,
    requestOptions
  ).then(handleResponse);
}

const getMessageContent = (channelId, data = {}) => {
  return axios
      .create({
        baseURL: server.apiUrl,
        headers: AuthHeader(),
      })
      .post(`/ent/v1/message-content?channelId=${channelId}`, JSON.stringify(data))
}

const ChannelService = {
  createChannel,
  createDirectChannel,
  getChannelList,
  getChannelDetailById,
  getChannelDetailByName,
  addChannelMember,
  removeChannelMember,
  getChannelMembers,
  getMessageContent
};

export default ChannelService;
