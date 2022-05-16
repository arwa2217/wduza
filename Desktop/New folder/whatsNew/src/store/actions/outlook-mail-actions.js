import * as type from "../actionTypes/outlook-mail-action-types";

export const setCurrentOutLookMailId = (mailId) => {
  return {
    type: type.SET_CURRENT_OUTLOOK_MAIL_ID,
    payload: mailId,
  };
};
export const setCurrentOutLookMailIdOrigin = (originId) => {
  return {
    type: type.SET_CURRENT_OUTLOOK_MAIL_ID_ORIGIN,
    payload: originId,
  };
};
export const setDeleteOutLookMailId = (mailId) => {
  return {
    type: type.SET_DELETE_MAIL_ID,
    payload: mailId,
  };
};

export const setActiveWriteEmailPanel = (activeStatus) => {
  return {
    type: type.SET_ACTIVE_WRITE_EMAIL_PANEL,
    payload: activeStatus,
  };
};
export const setActiveEmail = (activeEmail) => {
  return {
    type: type.SET_ACTIVE_EMAIL,
    payload: activeEmail,
  };
};
export const setPostEmailType = (postEmailType) => {
  return {
    type: type.SET_POST_EMAIL_TYPE,
    payload: postEmailType,
  };
};
export const setConversationData = (conversationData) => {
  return {
    type: type.SET_CONVERSATION_DATA,
    payload: conversationData,
  };
};

export const setSendEmailType = (sendEmailType) => {
  return {
    type: type.SET_SEND_EMAIL_TYPE,
    payload: sendEmailType,
  };
};

export const setSaveDraftEmail = (status) => {
  return {
    type: type.SET_SAVE_DRAFT_EMAIL,
    payload: status,
  };
};

export const setRefreshData = (status) => {
  return {
    type: type.SET_REFRESH_DATA,
    payload: status,
  };
};

export const setEmailsSelected = (emailsSelected) => {
  return {
    type: type.SET_EMAILS_SELECTED,
    payload: emailsSelected,
  };
};
export const toggleConversationRead = (mailInfo) => {
  return {
    type: type.TOGGLE_CONVERSATION_READ,
    payload: {
      id: mailInfo.id,
      isRead: mailInfo.isRead,
    },
  };
};

export const setConversationEmailsSelected = (conversationEmailsSelected) => {
  return {
    type: type.SET_CONVERSATION_EMAILS_SELECTED,
    payload: conversationEmailsSelected,
  };
};

export const setEmailsAffected = (emailsAffected) => {
  return {
    type: type.SET_EMAILS_AFFECTED,
    payload: emailsAffected,
  };
};
export const setRefreshButtonClick = (status) => {
  return {
    type: type.SET_REFRESH_BUTTON,
    payload: status,
  };
};

export const setEmailPhotos = (emailPhotos) => {
  return {
    type: type.SET_EMAIL_PHOTOS,
    payload: emailPhotos,
  };
};
export const setContactSenderEmail = (emailObj) => {
  return {
    type: type.SET_CONTACT_SENDER_EMAIL,
    payload: { ...emailObj },
  };
};
export const setEnableWriteEmail = (status) => {
  return {
    type: type.SET_ENABLE_WRITE_EMAIL,
    payload: status,
  };
};

export const setOpenWriteEmailModalPopup = (status) => {
  return {
    type: type.SET_OPEN_WRITE_EMAIL_MODAL_POPUP,
    payload: status,
  };
};

export const setAttachmentsList = (attachments) => {
  return {
    type: type.SET_ATTACHMENTS_LIST,
    payload: attachments,
  };
};
export const setFileLoading = (status) => {
  return {
    type: type.SET_FILE_LOADING,
    payload: status,
  };
};
export const setMailHighLight = (mailId) => {
  return {
    type: type.SET_CURRENT_MAIL_HIGH_LIGHT,
    payload: mailId,
  };
};

export const setMailFolderInfo = (mailFolderInfo) => {
  return {
    type: type.SET_MAIL_FOLDER_INFO,
    payload: mailFolderInfo,
  };
};
export const setCurrentMailFolder = (mailFolder) => {
  return {
    type: type.SET_CURRENT_MAIL_FOLDER,
    payload: mailFolder,
  };
};

export const setActiveDraftMailId = (draftEmailId) => {
  return {
    type: type.SET_ACTIVE_DRAFT_MAIL_ID,
    payload: draftEmailId,
  };
};
export const setSearching = (status) => {
  return {
    type: type.SET_IS_SEARCHING,
    payload: status,
  };
};
export const setFiltering = (status) => {
  return {
    type: type.SET_IS_FILTERING,
    payload: status,
  };
};
export const setDataForward = (data) => {
  return {
    type: type.SET_DATA_FORWARD,
    payload: data,
  };
};

export const setIsBottomAnchorScroll = (isScroll) => {
  return {
    type: type.IS_BOTTOM_ANCHOR_SCROLL,
    payload: isScroll,
  };
};
export const setListEmailSendFromContact = (listEmails) => {
  return {
    type: type.SET_LIST_EMAIL_SEND_CONTACT,
    payload: listEmails,
  };
};

export const updateUnReadNumber = (unRead) => {
  return {
    type: type.UPDATE_UNREAD_NUMBER,
    payload: unRead,
  };
};
export const setCurrentReplyEmailId = (mailId) => {
  return {
    type: type.CURRENT_REPLY_MAIL_ID,
    payload: mailId,
  };
};
export const setNewEmailReplyList = (mailList) => {
  return {
    type: type.NEW_REPLY_EMAIL_LIST,
    payload: mailList,
  };
};

export const setFileAttachments = (fileAttachments) => {
  return {
    type: type.SET_FILE_ATTACHMENTS,
    payload: fileAttachments,
  };
};

export const loadingDraftAttachments = (status) => {
  return {
    type: type.LOADING_DRAFT_ATTACHMENTS,
    payload: status,
  };
};
export const updateUnreadInConversation = (status) => {
  return {
    type: type.UPDATE_UNREAD_IN_CONVERSATION,
    payload: status,
  };
};
export const setIsReadMailId = (mailId) => {
  return {
    type: type.SET_IS_READ_MAIL_ID,
    payload: mailId,
  };
};
