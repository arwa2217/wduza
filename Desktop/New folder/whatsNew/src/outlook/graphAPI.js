import msalServices from "./services";
import msalInstance from "./instance";
import { loginRequest, mailFolders as mailFoldersDefault } from "./config";
import {
  getDomainNameByEmail,
  getRandomColor,
  getTop,
} from "../utilities/outlook";

const scrollHeight = document.documentElement.scrollHeight - 56 - 70 - 15;
const limit = Math.ceil(scrollHeight / 65) + 1;
const makeHeader = async () => {
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called."
    );
  }
  const response = await msalInstance.acquireTokenSilent({
    ...loginRequest,
    account: account,
  });
  const headers = new Headers();
  const bearer = `Bearer ${response.accessToken}`;
  headers.append("Authorization", bearer);
  return headers;
};
async function getConversationById(conversationId) {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = `${msalServices.getTopConversation}'${conversationId}'`;
  return fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getConversation(conversationId, nextLink = "") {
  const headers = await makeHeader();
  headers.append("x-ms-throttle-priority", "High");
  const options = {
    method: "GET",
    headers: headers,
  };
  const url =
    nextLink !== ""
      ? nextLink
      : `${msalServices.getConversation}'${conversationId}'&$select=subject,bodyPreview,uniqueBody,ccRecipients,conversationId,createdDateTime,flag,from,hasAttachments,id,importance,isDraft,isRead,lastModifiedDateTime,receivedDateTime,replyTo,sender,sentDateTime,toRecipients,bccRecipients&$expand=attachments`;
  return fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getMailFolderUnRead(mailFolder) {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = `${msalServices.mailFolders}/${mailFolder}/messages?$count=true&$top=1000&$filter=isRead eq false`;
  const result = await fetch(url, options);
  const resultJson = await result.json();
  return resultJson["@odata.count"] || 0;
}
const updateListEmail = (data) => {
  const dataGroupBy = _(data).groupBy("conversationId").value();
  return Object.keys(dataGroupBy).map((key) => {
    const firstItem = dataGroupBy[key][0];
    const lastItem = dataGroupBy[key][dataGroupBy[key].length - 1];
    return {
      ...firstItem,
      subject: lastItem.subject,
    };
  });
};

const _mailFoldersById2 = async (url) => {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  headers.append("x-ms-throttle-priority", "High");
  //const scrollHeight = document.documentElement.scrollHeight - 56 - 70 - 15;
  const result = await fetch(url, options);
  return await result.json();
};
export const mailFoldersById2 = _mailFoldersById2;

const _mailFoldersById = async (
  mailFolder,
  nextLink = "",
  keyword = "",
  filter = "",
  data
) => {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  headers.append("x-ms-throttle-priority", "High");
  //const scrollHeight = document.documentElement.scrollHeight - 56 - 70 - 15;
  const top = limit;
  keyword = keyword ? `"${keyword}"` : ``;
  const search = keyword ? `&$search=${encodeURIComponent(keyword)}` : ``;
  const filterCondition = filter
    ? `&$orderby=receivedDateTime desc &$filter=receivedDateTime ge 1900-01-01T00:00:00Z and ${encodeURIComponent(
        filter
      )}`
    : ``;
  const url =
    nextLink !== ""
      ? nextLink
      : `${msalServices.mailFolders}/${mailFolder}/messages?$count=true&$top=${top}${search}${filterCondition}`;
  const result = await fetch(url, options);
  const resultJson = await result.json();
  const newNextLink = resultJson["@odata.nextLink"]
    ? resultJson["@odata.nextLink"]
    : "";
  data.list = updateListEmail(data.list.concat(resultJson.value));
  if (data.list.length >= limit) {
    data.isStop = true;
    data.nextLink = newNextLink;
  }
  if (resultJson && newNextLink && !data.isStop) {
    await _mailFoldersById(mailFolder, newNextLink, keyword, filter, data);
  }
  //return
};
export const mailFoldersById = async (
  mailFolder,
  nextLink = "",
  keyword = "",
  filter = ""
) => {
  const data = { list: [], isStop: false };
  await _mailFoldersById(mailFolder, nextLink, keyword, filter, data);

  console.log(data.nextLink);
  console.log(data.list);

  return {
    value: data.list,
    "@odata.nextLink": data.nextLink,
  };
};

export const getUnreadMailFolders = async () => {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = `${msalServices.mailFolders}/inbox`;
  const result = await fetch(url, options);
  return await result.json();
};

export async function getFileAttachments(messageId) {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = `${msalServices.getOneMessage}${messageId}/attachments`;
  return fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
export async function getProfileImage() {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = msalServices.getProfileImage;
  const result = await fetch(url, options);
  return await result.blob();
}

export async function createSubscriptions() {
  const headers = await makeHeader();
  const subscription = {
    changeType: "created",
    notificationUrl: "https://localhost:444",
    resource: "me/mailfolders/inbox/messages",
    expirationDateTime: new Date(Date.now() + 3600000).toISOString(),
  };
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(subscription),
  };

  const url = `${msalServices.subscriptions}`;
  const result = await fetch(url, options);
  return await result.json();
}
export async function getUserPhotoByEmails(emailPhotos) {
  const data = { requests: [] };
  emailPhotos.map((email, index) => {
    const url = `/users/${email}/photo/$value`;
    data.requests.push({
      id: index + 1,
      email: email,
      method: "GET",
      url: url,
    });
  });
  return await _batchJson(data);
}

export async function getUserImage(userId) {
  const headers = await makeHeader();
  const options = {
    method: "GET",
    headers: headers,
  };
  const url = `https://graph.microsoft.com/beta/users/${userId}/photo/$value`;
  return fetch(url, options)
    .then((response) => response.blob())
    .catch((error) => console.log(error));
}
export async function getEmailsByConversationIds(conversationIds) {
  const data = { requests: [] };
  conversationIds.map((conversationId, index) => {
    const url = `/me/messages?top=1000&$filter=conversationId eq '${conversationId}'`;
    data.requests.push({
      id: index + 1,
      method: "GET",
      url: url,
    });
  });
  return await _batchJson(data);
}

// move to delete folder delete
export async function deleteEmailByIds(emailIds) {
  const data = { requests: [] };
  emailIds.map((email, index) => {
    const url = `/me/messages/${email.id}/move`;
    data.requests.push({
      id: index,
      method: "POST",
      url: url,
      body: {
        destinationId: "deleteditems",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  return await _batchJson(data);
}

export async function deleteEmail(conversationId) {
  const conversationList = await getConversationById(conversationId);
  const mailIds = conversationList.value || [];
  const limit = 4;
  let dataResponseDelete = [];
  for (let i = 0; i < mailIds.length; i++) {
    if (i % limit === 0) {
      const requestDelete = mailIds.slice(i, i + limit);
      const results = await deleteEmailByIds(requestDelete);
      dataResponseDelete.push(results);
    }
  }
  return dataResponseDelete;
}

export async function updateMulti(mailIds, body) {
  const data = { requests: [] };
  mailIds.map((mailId, index) => {
    const url = `/me/messages/${mailId}`;
    data.requests.push({
      id: index + 1,
      method: "PATCH",
      url: url,
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  return await _batchJson(data);
}

export async function updateFlagMulti(mailIds, status = "flagged") {
  const data = { requests: [] };
  mailIds.map((mailId, index) => {
    const url = `/me/messages/${mailId}`;
    data.requests.push({
      id: index + 1,
      method: "PATCH",
      url: url,
      body: {
        flag: {
          flagStatus: status,
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
  return await _batchJson(data);
}

export async function updateFlagEmail(emailId, data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.getOneMessage}${emailId}`;
  const result = await fetch(url, options);
  return await result.json();
}

export async function saveDraftEmail(data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.getOneMessage}`;
  const result = await fetch(url, options);
  return await result.json();
}

//All function related to Send, Reply, Reply all, forward
export async function sendEmail(data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.sendMail}`;
  const result = await fetch(url, options);
  return await result.json();
}
export async function replyAll(id, data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.getOneMessage}${id}/replyAll`;
  return await fetch(url, options);
}
export async function reply(id, data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.getOneMessage}${id}/reply`;
  return await fetch(url, options);
}
export async function forward(id, data) {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.getOneMessage}${id}/forward`;
  return await fetch(url, options);
}
const _batchJson = async (data) => {
  const headers = await makeHeader();
  headers.append("content-type", "application/json");
  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  };
  const url = `${msalServices.batch}`;
  const result = await fetch(url, options);
  return await result.json();
};
export const batchJson = _batchJson;
