import server from "server";
import deleteIcon from "../assets/icons/outlook-actions/deleteActions.svg";
import unFlagIcon from "../assets/icons/outlook-actions/unFlag.svg";
import unMarked from "../assets/icons/outlook-actions/un-marked.svg";
import unreadIcon from "../assets/icons/outlook-actions/unread.svg";
import readIcon from "../assets/icons/outlook-actions/read.svg";
import moveIcon from "../assets/icons/outlook-actions/move.svg";
const ua = window.navigator.userAgent;
const msie = ua.indexOf("MSIE ");
const msie11 = ua.indexOf("Trident/");
const msedge = ua.indexOf("Edge/");
const firefox = ua.indexOf("Firefox");
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0;
export const msalConfig = {
  auth: {
    clientId: server.azureClientID,
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin+"/email",
    postLogoutRedirectUri: window.location.origin+"/email",
  },
  cache: {
    cacheLocation: "localStorage",
    //storeAuthStateInCookie: true,
  },
};

export const loginRequest = {
  scopes: [
    "User.Read",
    "Profile",
    "Mail.Read",
    "Mail.ReadWrite",
    "Contacts.Read",
    "Contacts.ReadWrite",
    "User.ReadBasic.All",
    "Mail.Send",
  ],
};

export const deleteMailFolderId =
  "AQMkADAwATM0MDAAMS0zYWEAYy1kODBiLTAwAi0wMAoALgAAA_n6S4y9AytEoj2Y-6n9YacBAPtKikAGbblGq5sQrGUSE7wAAAIBCgAAAA==";

export const mailFolders = [
  {
    id: 1,
    isCountUnread: true,
    value: "inbox",
    label: "Inbox",
    isCanMove: false,
  },
  {
    id: 3,
    isCountUnread: false,
    value: "sentItems",
    label: "SentItem",
    isCanMove: false,
  },
  {
    id: 4,
    isCountUnread: false,
    value: "drafts",
    label: "Drafts",
    isCanMove: true,
  },
  {
    id: 5,
    isCountUnread: true,
    value: "deleteditems",
    label: "Deleted",
    isCanMove: true,
  },
  {
    id: 6,
    isCountUnread: true,
    value: "junkemail",
    label: "JunkEmail",
    isCanMove: true,
  },
  {
    id: 7,
    isCountUnread: true,
    value: "recoverableitemsdeletions",
    label: "RecoverEmail",
    isCanMove: false,
  },
  {
    id: 8,
    isCountUnread: true,
    value: "archive",
    label: "Archive",
    isCanMove: true,
  },
];
export const defaultMenuList = [
  {
    name: "delete",
    label: "Delete",
    icon: deleteIcon,
    labelLoading: "Deleting",
  },
  {
    name: "flag",
    label: "Marked",
    icon: unFlagIcon,
    labelLoading: "Marking",
  },
  {
    name: "unFlag",
    label: "Unmarked",
    icon: unMarked,
    labelLoading: "UnMarking",
  },
  {
    name: "read",
    label: "Mark as read",
    icon: unreadIcon,
    labelLoading: "Marking as read",
  },
  {
    name: "unread",
    label: "Mark as unread",
    icon: readIcon,
    labelLoading: "Marking as unread",
  },
  {
    name: "move",
    label: "Move",
    icon: moveIcon,
  },
];
export const postEmailType = {
  newEmail: "newEmail",
  editDraftEmail: "editDraftEmail",
  newEmailInPopup: "newEmailInPopup",
  init: "init",
  reply: "reply",
  replyAll: "replyAll",
  forward: "forward",
  delete: "delete",
};

export const mailStatus = [
  {
    id: 7,
    value: "",
    label: "All",
  },
  {
    id: 11,
    value: `&$search="to:{email}"`,
    label: "Tome",
  },
  {
    id: 8,
    value: `&$search="isRead:false"`,
    label: "Unread",
  },
  {
    id: 9,
    value: "flag/flagStatus eq 'flagged'",
    label: "Marked",
  },
  {
    id: 10,
    value: `&$search="hasAttachment:true"`,
    label: "Attached",
  },
];

export const emailFormData = {
  message: {
    subject: "",
    body: {
      contentType: "HTML",
      content: "",
    },
    toRecipients: [],
    ccRecipients: [],
    bccRecipients: [],
  },
};

export const saveDraftFormData = {
  subject: "",
  body: {
    contentType: "HTML",
    content: "",
  },
  toRecipients: [],
  ccRecipients: [],
  bccRecipients: [],
};
export const importantOption = ["high", "normal", "low"];
