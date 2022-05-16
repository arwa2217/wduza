import uniqBy from "lodash/uniqBy";
import { postEmailType } from "../outlook/config";
import instance from "../outlook/apiConfig";
import React from "react";
import moment from "moment";
import services from "../outlook/apiService";
import FileAttachmentService from "../services/file-attachment-service";
import OutLookLoading from "../components/outlook-shared/OutLookLoading";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const mapAddress = (item) => {
  return item.emailAddress;
};
export const mapEmailAddresses = (item) => {
  return item.emailAddresses[0];
};
export const mapOptions = (item) => {
  return {
    value: item?.address,
    label: item?.name,
    email: item?.address,
  };
};
export const mapDraftOption = (item) => {
  return {
    value: item?.emailAddress.address,
    label: item?.emailAddress.name,
    email: item?.emailAddress.address,
  };
};
const _getDefaultState = (
  firstLabel = "To",
  secondLabel = "Cc",
  thirdLabel = "Bcc"
) => [
  {
    label: firstLabel,
    options: [],
    isChange: false,
    display: true,
    value: [],
    isShowCloseButton: false,
  },
  {
    label: secondLabel,
    options: [],
    isChange: false,
    display: false,
    value: [],
    isShowCloseButton: true,
  },
  {
    label: thirdLabel,
    options: [],
    isChange: false,
    display: false,
    value: [],
    isShowCloseButton: true,
  },
];
export const getDefaultState = (
  firstLabel = "To",
  secondLabel = "Cc",
  thirdLabel = "Bcc"
) => {
  return _getDefaultState(firstLabel, secondLabel, thirdLabel);
};
export const getDefaultStateNotBcc = (
  firstLabel = "To",
  secondLabel = "Cc"
) => {
  const defaultState = _getDefaultState(firstLabel, secondLabel);
  const [firstState, secondState] = defaultState;
  return [firstState, secondState];
};
export const showTo = (updateState) => {
  updateState[0].display = true;
};
export const showCc = (updateState) => {
  updateState[1].display = true;
};
export const showBcc = (updateState) => {
  updateState[2].display = true;
};

export const showCcBcc = (updateState) => {
  updateState[1].display = true;
  updateState[2].display = true;
};
export const hideAllCloseButton = (updateState) => {
  updateState[0].isShowCloseButton = false;
  updateState[1].isShowCloseButton = false;
  updateState[2].isShowCloseButton = false;
};
export const showAllInput = (updateState) => {
  updateState[0].display = true;
  updateState[1].display = true;
  updateState[2].display = true;
};

export const setReceiver = (updateState, value, inputEl, sendMailType) => {
  updateState[0].value = value;
  inputEl.to.current && inputEl.to.current.setValue(value);

  if (sendMailType === postEmailType.forward) {
    updateState[1].value = value;
    updateState[2].value = value;
    inputEl.cc.current && inputEl.cc.current.setValue(value);
    inputEl.bcc.current && inputEl.bcc.current.setValue(value);
  }
};

export const clearInput = (inputEl) => {
  inputEl.to.current && inputEl.to.current.setValue([]);
  inputEl.cc.current && inputEl.cc.current.setValue([]);
  inputEl.bcc.current && inputEl.bcc.current.setValue([]);
};
const setOptions = (item, options = []) => {
  if (item) {
    item.options = options;
  }
};
export const setOptionsNewEmail = (updateState, suggestData) => {
  updateState[0].options = suggestData;
  updateState[1].options = suggestData;
  updateState[2].options = suggestData;
};

export const setOptionsReply = (updateState, toList, ccList, bccList) => {
  updateState[0].options = toList;
  updateState[1].options = ccList;
  if (updateState[2]) {
    updateState[2].options = bccList;
  }
};
export const setValuesReceivers = (
  updateState,
  toList,
  ccList,
  bccList,
  inputEl
) => {
  updateState[0].value = toList;
  updateState[1].value = ccList;
  updateState[2].value = bccList;

  inputEl.to.current && inputEl.to.current.setValue(toList);
  inputEl.cc.current && inputEl.cc.current.setValue(ccList);
  inputEl.bcc.current && inputEl.bcc.current.setValue(bccList);
};
export const uniqEmail = (list, key = "value") => {
  return uniqBy(list, key);
};
const _findChildElement = (parentElement, childElement) => {
  const parent = document.querySelector(parentElement);
  return parent?.querySelector(childElement);
};
export const findChildElement = _findChildElement;
const _setFocus = (element) => {
  if (element) {
    element.focus();
  }
};
const _focusEditor = (parentClass = ".jodit-container") => {
  setTimeout(() => {
    const editor = _findChildElement(parentClass, ".jodit-wysiwyg");
    _setFocus(editor);
  }, 500);
};

export const setFocusEditor = _focusEditor;

const _focusTo = () => {
  const input = _findChildElement("#receive_input_option_to", "input");
  _setFocus(input);
};
const _focusCc = () => {
  const input = _findChildElement("#receive_input_option_cc", "input");
  _setFocus(input);
};
const _focusBcc = () => {
  const input = _findChildElement("#receive_input_option_bcc", "input");
  _setFocus(input);
};
export const showReceiveContainer = () => {
  const receiveContainer = document.querySelector("#receive-container");
  if (receiveContainer) {
    receiveContainer.style.display = "block";
  }
};

export const hideReceiveContainer = () => {
  const receiveContainer = document.querySelector("#receive-container");
  if (receiveContainer) {
    receiveContainer.style.display = "none";
  }
};
export const setEditorFocus = (emailType) => {
  showReceiveContainer();
  // if (
  //   emailType === postEmailType.forward ||
  //   emailType === postEmailType.newEmail
  // ) {
  //   _focusTo();
  // } else {
  //   _focusEditor();
  // }
};
export const getTop = () => {
  const scrollHeight = document.documentElement.scrollHeight - 56 - 70 - 15;
  return Math.ceil(scrollHeight / 65) + 1;
};
export const focusTo = _focusTo;

export const focusBcc = _focusBcc;
export const focusCc = _focusCc;

export const getDomainNameByEmail = (email) => {
  if (!email) {
    return "";
  }
  return email.split("@")[1] || "";
};
const _colorList = ["2D76CE", "CA4C70", "F69833", "A259FF", "ff3300"];
const _getRandomColor = () => {
  return _colorList[Math.floor(Math.random() * _colorList.length)];
};
export const getRandomColor = _getRandomColor;
export const getColorByEmail = (emailPhotos, email) => {
  return emailPhotos.find((item) => item.email === email);
};
export const removeDuplicates = (arr, key) => {
  const tmp = {};
  return arr.reduce((p, c) => {
    const k = c[key];
    if (tmp[k]) return p;
    tmp[k] = true;
    return p.concat(c);
  }, []);
};

const _mergeEmailByConversationId = (data) => {
  const dataGroupBy = _(data).groupBy("conversationId").value();
  return Object.keys(dataGroupBy).map((key) => {
    const firstItem = dataGroupBy[key][0];
    //const lastItem = dataGroupBy[key][dataGroupBy[key].length - 1];
    const hasAttachments = dataGroupBy[key].some((item) => item.hasAttachments);
    const isRead = dataGroupBy[key].every((item) => item.isRead);
    return {
      ...firstItem,
      hasAttachments,
      isRead,
    };
  });
};
export const mergeEmailByConversationId = _mergeEmailByConversationId;
const getLimitItems = () => {
  const scrollHeight = document.documentElement.scrollHeight - 56 - 70 - 15;
  return Math.ceil(scrollHeight / 65) + 1;
};
export const getLimit = getLimitItems;

const getMailFolderFilter = (filter) => {
  return filter
    ? `&$orderby=receivedDateTime desc &$filter=receivedDateTime ge 1900-01-01T00:00:00Z and ${encodeURIComponent(
        filter
      )}`
    : ``;
};
const getMailFolderUrl = (nextLink, mailFolder, top, search, filter) => {
  const filterCondition = getMailFolderFilter(filter);
  return nextLink !== ""
    ? nextLink
    : `/me/mailFolders/${mailFolder}/messages?$top=${top}${search}${filterCondition}`;
};
const getMailFolderSearch = (keyword) => {
  keyword = keyword ? `"${keyword}"` : ``;
  return keyword ? `&$search=${encodeURIComponent(keyword)}` : ``;
};

const _getMailsFolder = async (
  mailFolder,
  nextLink = "",
  keyword = "",
  filter = "",
  data,
  conversationIds = []
) => {
  const limit = getLimitItems();
  //const top = limit;
  //const search = getMailFolderSearch(keyword);
  const url = getMailFolderUrl(nextLink, mailFolder, limit, keyword, filter);
  const resultJson = await instance.get(url);
  let newNextLink = resultJson["@odata.nextLink"]
    ? resultJson["@odata.nextLink"]
    : "";
  // merge email by conversation id
  const values = resultJson.value;
  const newData = values.filter((email) => {
    return !conversationIds.includes(email.conversationId);
  });
  const oldData = values.filter((email) => {
    return conversationIds.includes(email.conversationId);
  });
  data.old = _mergeEmailByConversationId(data.old.concat(oldData));
  data.list = _mergeEmailByConversationId(data.list.concat(newData));

  if (data.list.length >= limit + 5) {
    data.isStop = true;
    data.nextLink = newNextLink;
  }
  if (resultJson && newNextLink && !data.isStop) {
    await _getMailsFolder(mailFolder, newNextLink, keyword, filter, data);
  }
};

export const getMailsFolder = _getMailsFolder;

const _getAllValue = async (url, data) => {
  const resultJson = await instance.get(url);
  let newNextLink = resultJson["@odata.nextLink"]
    ? resultJson["@odata.nextLink"]
    : "";
  data.list = data.list.concat(resultJson.value);
  if (resultJson && newNextLink) {
    await _getAllValue(newNextLink, data);
  }
};
export const getAllValue = _getAllValue;

export const setHeight = (openSearch) => {
  return `calc(100vh - var(--message-list-header-height) - var(--message-list-top-bar-height) - var(--message-list-bottom-margin) - ${
    openSearch ? "60px" : "0px"
  })`;
};
export const loader = (loading) => {
  if (!loading) {
    return null;
  }
  return (
    <div className="pt-3 bg-white" style={{ height: setHeight() }}>
      <OutLookLoading />
    </div>
  );
};

export const validateEmails = (input) => {
  const { to, cc, bcc } = input;
  if (to && !to.match(emailRegex)) {
    _focusTo();
    return false;
  }
  if (cc && !cc.match(emailRegex)) {
    _focusCc();
    return false;
  }
  if (bcc && !bcc.match(emailRegex)) {
    _focusBcc();
    return false;
  }
  return true;
};
export const autoRefreshTime = 15000;
export const autoRefreshConversationTime = 10000;
export const showNotification = (newEmail, type = "") => {
  const regexRemoveHtml = /(&nbsp;|<([^>]+)>)/ig
  if (!newEmail.length){
    return;
  }

  const [firstEmail]  = newEmail
  const {sender, uniqueBody, bodyPreview} = firstEmail
  const senderName = sender?.emailAddress?.name
  const content = type === "reply" ? uniqueBody?.content.replace(regexRemoveHtml, "").trim(): bodyPreview;
  const iconURL = `${window.location.origin}/favicon-32x32.png`

  if (!window.Notification) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted" && newEmail.length > 0) {
    // If it's okay let's create a notification
    if (type === "reply") {
      new Notification(senderName, {
        body: content,
        icon: iconURL
      });
    } else {
      new Notification(senderName, {
        body: content,
        icon: iconURL
      });
    }
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted" && newEmail.length > 0) {
        if (type === "reply") {
          new Notification(senderName, {
            body: content,
            icon: iconURL
          });
        } else {
          new Notification(senderName, {
            body: content,
            icon: iconURL
          });
        }
      }
    });
  }
};
export const getIdFromResponses = (responses, id) => {
  return responses.find((item) => item.id === id)?.body?.id;
};
export const validateEmail = (email) => {
  return email && email.match(emailRegex);
};
export const getEmailToShow = (typeEmail, email) => {
  if (typeEmail === "sentItems") {
    return email.toRecipients ? email.toRecipients[0] : {};
  }
  return email.sender;
};
export const getValueToRecipientFromRefs = (
  inputReceiveRefs,
  field,
  receiveExtra
) => {
  let formDataRecipient = [];
  if (inputReceiveRefs[field] && inputReceiveRefs[field].current) {
    const value = inputReceiveRefs[field].current.state.selectValue;
    formDataRecipient = value.map((item) => {
      return {
        emailAddress: {
          address: item.value,
        },
      };
    });
  }
  if (receiveExtra) {
    formDataRecipient.push({
      emailAddress: {
        address: receiveExtra,
      },
    });
  }
  return formDataRecipient;
};

export const getRecipientInputValue = (label) => {
  const elementWrapper = document.getElementById(
    `receive_input_option_${label}`
  );
  const input = elementWrapper.querySelector("input");
  if (input) {
    return input.value;
  }
  return "";
};
const getSearchStringFromRecipient = (recipients, field) => {
  if (recipients.length) {
    const items = recipients.map((item) => {
      return `${field}:${item.emailAddress.address}`;
    });
    return `(${items.join(" OR ")})`;
  }
  return "";
};

export const getQuerySearchString = (
  subject,
  keyword,
  dateStart,
  dateEnd,
  attachments,
  searchFromRecipients,
  searchToRecipients,
  searchCcRecipients
) => {
  const searchQueryList = [];
  if (subject !== "") {
    searchQueryList.push(
      `subject:${encodeURIComponent(subject.replaceAll("\\", "\\\\"))}`
    );
  }
  if (keyword !== "") {
    searchQueryList.push(
      `body:${encodeURIComponent(keyword.replaceAll("\\", "\\\\"))}`
    );
  }
  // todo format date
  if (dateStart !== null) {
    const momentDateStart = moment(dateStart);
    searchQueryList.push(`received >= ${momentDateStart.format("MM/DD/YYYY")}`);
  }
  if (dateEnd !== null) {
    const momentDateEnd = moment(dateEnd);
    searchQueryList.push(`received <= ${momentDateEnd.format("MM/DD/YYYY")}`);
  }
  if (attachments) {
    searchQueryList.push(`hasAttachment:true`);
  }
  const searchFrom = getSearchStringFromRecipient(searchFromRecipients, "from");
  if (searchFrom) {
    searchQueryList.push(searchFrom);
  }
  const searchTo = getSearchStringFromRecipient(searchToRecipients, "to");
  if (searchTo) {
    searchQueryList.push(searchTo);
  }
  const searchCc = getSearchStringFromRecipient(searchCcRecipients, "cc");
  if (searchCc) {
    searchQueryList.push(searchCc);
  }
  if (searchQueryList.length) {
    return `&$search="${searchQueryList.join(" AND ")}"`;
  }
  return "";
};
export const createRequest = (
  listIds,
  url,
  method = "GET",
  body = {},
  parentIndex
) => {
  const item = {
    method: method,
  };
  if (method === "POST" || method === "PATCH") {
    item.headers = { "Content-Type": "application/json" };
    item.body = body;
  }
  return listIds.map((id, index) => {
    const newUrl = url.replace("{id}", id);
    return {
      id: parentIndex + index,
      url: newUrl,
      ...item,
    };
  });
};
const limit = 4;
export const createRequestLimit = async (
  listIds,
  url,
  method = "GET",
  body = {}
) => {
  const response = [];
  for (let i = 0; i < listIds.length; i++) {
    if (i % limit === 0) {
      const listIdSlice = listIds.slice(i, i + limit);
      const parentIndex = i;
      const data = { requests: [] };
      data.requests = createRequest(
        listIdSlice,
        url,
        method,
        body,
        parentIndex
      );
      const results = await services.batchJson(data);
      response.push(results);
    }
  }
  return response;
};
export const createRequestGetAll = async (listIds, url) => {
  const response = [];
  for (let i = 0; i < listIds.length; i++) {
    const conversationId = listIds[i];
    const newUrl = url.replace("{id}", conversationId);
    const results = await services.getAllData(newUrl);
    response.push(results);
  }
  return response;
};

export const clearDataCached = () => {
  localStorage.removeItem("EMAIL_LIST");
  localStorage.removeItem("NEXT_LINK");
  localStorage.removeItem("TYPE_EMAIL");
};
export const blobToBase64 = async (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
};
export const convertSize = (fileSize) => {
  const isMB = fileSize.indexOf("MB");
  const isKB = fileSize.indexOf("KB");
  if (isMB !== -1) {
    const size = fileSize.replace("MB", "");
    return parseFloat(size) * 1000000;
  } else if (isKB !== -1) {
    const size = fileSize.replace("KB", "");
    if (size) {
      return parseFloat(size) * 1000;
    }
  }
  return 0;
};
export const convertFileToContentBytes = async (attachments) => {
  const newAttachments = [];
  if (attachments.length) {
    for (let i = 0; i < attachments.length; i++) {
      const { channelId, fileId, postId, fileName } = attachments[i];
      const result = await FileAttachmentService.getBlobByFileId(
        fileId,
        channelId,
        postId
      );
      if (result.status === 200) {
        const { type } = result.data;
        const base64Data = await blobToBase64(result.data);
        const fileAttach = {
          "@odata.type": "#microsoft.graph.fileAttachment",
          contentBytes: base64Data,
          contentType: type,
          name: fileName,
        };
        newAttachments.push(fileAttach);
      }
    }
  }
  return {
    newAttachments,
  };
};
export const removeElement = (parent, id) => {
  if (parent) {
    const elem = parent.querySelector(`#${id}`);
    return elem ? elem.parentNode.removeChild(elem) : null;
  }
};
