import instance from "./apiConfig";
import { getAllValue, getMailsFolder } from "../utilities/outlook";
import { saveDraftEmail } from "./graphAPI";
import { mailFolders } from "./config";
const services = {
  getConversation: (conversationId, nextLink = "", filterParentId = "") =>
    nextLink === ""
      ? instance.get(
          `/me/messages?$orderby=receivedDateTime asc & $filter=receivedDateTime ge 1900-01-01T00:00:00Z and conversationId eq '${conversationId}'${filterParentId}&$select=subject,bodyPreview,body,uniqueBody,ccRecipients,conversationId,parentFolderId,createdDateTime,flag,from,hasAttachments,id,importance,isDraft,isRead,lastModifiedDateTime,receivedDateTime,replyTo,sender,sentDateTime,toRecipients,bccRecipients`
        )
      : instance.get(nextLink),
  getTopConversation: (conversationId) =>
    instance.get(
      `/me/messages?$top=1000&$filter=conversationId eq '${conversationId}'`
    ),
  getFileAttachments: (messageId) =>
    instance.get(
      `/me/messages/${messageId}/attachments?$select=lastModifiedDateTime,name,size,isInline,contentType`
    ),
  getContentBytesFileAttachments: (messageId) =>
    instance.get(`/me/messages/${messageId}/attachments`),
  addMailAttachment: (messageId, file) =>
    instance.post(`me/messages/${messageId}/attachments`, file),
  deleteMailAttachment: (messageId, attachmentId) =>
    instance.delete(`/me/messages/${messageId}/attachments/${attachmentId}`),
  downloadAttachments: (messageId, attachmentsId) =>
    instance.get(`/me/messages/${messageId}/attachments/${attachmentsId}`),
  sendEmail: (data) => instance.post("/me/sendMail", data),
  replyEmail: (id, data) => instance.post(`/me/messages/${id}/reply`, data),
  replyAllEmail: (id, data) =>
    instance.post(`/me/messages/${id}/replyAll`, data),
  forwardEmail: (id, data) => instance.post(`/me/messages/${id}/forward`, data),
  editEmail: (id, data) => instance.patch(`/me/messages/${id}`, data),
  deleteEmail: (id) => instance.delete(`/me/messages/${id}`),
  moveEmailToDeleteFolder: (id, body) =>
    instance.post(`/me/messages/${id}/move`, body),
  saveDraftEmail: (data) => instance.post("/me/messages/", data),
  sendDraftEmail: (id) => instance.post(`/me/messages/${id}/send`),
  //CONTACT API
  searchContact: (keyword) =>
    keyword !== ""
      ? instance.get(
          `/me/contacts?search=${encodeURIComponent(`"${keyword}"`)}`
        )
      : instance.get("/me/contacts?$orderby=createdDateTime desc"),
  updateContact: (contactId, data) =>
    instance.patch(`/me/contacts/${contactId}`, data),
  deleteContact: (contactId) => instance.delete(`/me/contacts/${contactId}`),
  getContactList: (nextLink = "") =>
    nextLink !== ""
      ? instance.get(nextLink)
      : instance.get("/me/contacts?$orderby=createdDateTime desc"),
  addContact: (data) => instance.post("/me/contacts", data),
  emailCheck: (email) =>
    instance.get(
      `/me/contacts?$filter=emailAddresses/any(a:a/address eq '${email}')`
    ),
  phoneCheck: (phoneNumber) =>
    instance.get(`/me/contacts?$filter=mobilePhone eq '${phoneNumber}'`),
  updateContactPhoto: (contactId, file) =>
    instance.patch(`/me/contacts/${contactId}/photo/$value`, file, {
      headers: {
        "content-type": "multipart/form-data",
      },
    }),
  getContactPhoto: (id) =>
    instance.get(`/me/contacts/${id}/photo/$value`, {
      responseType: "blob",
    }),
  getContactProfile: (id) => instance.get(`/me/contacts/${id}`),
  getUserImage: (userId) =>
    instance.get(`/users/${userId}/photo/$value`, {
      responseType: "blob",
    }),
  // SUMMARY API
  getUserSummaryInfo: (userId) => instance.get(`/users/${userId}`),
  updateEmailInfo: (id, body) => instance.patch(`/me/messages/${id}`, body),
  getMailFoldersById: async (
    mailFolder,
    nextLink = "",
    keyword = "",
    filter = "",
    conversationIds = []
  ) => {
    const data = { list: [], old: [], isStop: false };
    await getMailsFolder(
      mailFolder,
      nextLink,
      keyword,
      filter,
      data,
      conversationIds
    );
    return {
      value: data.list,
      old: data.old,
      "@odata.nextLink": data.nextLink,
    };
  },
  batchMailFolderInfo: (dataRequest) => instance.post(`/$batch`, dataRequest),
  getInfoInboxFolder: () => {
    return instance.get(`/me/mailFolders/inbox`);
  },
  getNewEmailAuto: (mailFolders) =>
    instance.get(`/me/mailFolders/${mailFolders}/messages?$top=5`),
  batchJson: (dataRequest) => instance.post(`/$batch`, dataRequest),
  getAllData: async (url) => {
    const data = { list: [] };
    await getAllValue(url, data);
    return {
      value: data.list,
    };
  },
  getDataForward: (url) => {
    return instance.get(url);
  },
  autoRefreshConversation: (conversationId) =>
    instance.get(
      `/me/messages?$orderby=receivedDateTime desc & $filter=receivedDateTime ge 1900-01-01T00:00:00Z and conversationId eq '${conversationId}'&$select=subject,bodyPreview,body,uniqueBody,ccRecipients,conversationId,parentFolderId,createdDateTime,flag,from,hasAttachments,id,importance,isDraft,isRead,lastModifiedDateTime,receivedDateTime,replyTo,sender,sentDateTime,toRecipients,bccRecipients&$top=5`
    ),
  conversationCount: (conversationId) =>
    instance.get(
      `/me/messages?$filter=conversationId eq '${conversationId}'&$count=true&$select=id&$skip=0`
    ),
  conversationAttach: (conversationId) =>
      instance.get(
          `/me/messages?$filter=conversationId eq '${conversationId}' AND hasAttachments eq true&$count=true&$select=id&$skip=0`
      ),
  createUploadSession: (messageId, data) => {
    return instance.post(`/me/messages/${messageId}/attachments/createUploadSession`, data)
  }
};
export default services;
