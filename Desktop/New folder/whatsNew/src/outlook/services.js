const msalServices = {
  /* Get current user login profile */
  getMe: "https://graph.microsoft.com/v1.0/me",
  getProfileImage: "https://graph.microsoft.com/beta/me/photo/$value",
  getConversation:
    "https://graph.microsoft.com/v1.0/me/messages?$orderby=receivedDateTime asc & $filter=receivedDateTime ge 1900-01-01T00:00:00Z and conversationId eq ",
  getOneMessage: "https://graph.microsoft.com/v1.0/me/messages/",
  mailFolders: "https://graph.microsoft.com/v1.0/me/mailFolders",
  getContactList: "https://graph.microsoft.com/v1.0/me/contacts",
  getContactListDelta: "https://graph.microsoft.com/v1.0/me/contacts/delta",
  subscriptions: "https://graph.microsoft.com/v1.0/subscriptions",
  getUserId: "https://graph.microsoft.com/v1.0/users/",
  sendMail: "https://graph.microsoft.com/v1.0/me/sendMail",
  batch: "https://graph.microsoft.com/v1.0/$batch",
  getTopConversation:
    "https://graph.microsoft.com/v1.0/me/messages?$top=1000&$filter=conversationId eq ",
};
export default msalServices;
