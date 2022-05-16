import * as type from "../actionTypes/outlook-mail-action-types";
import { postEmailType } from "../../outlook/config";
const initialState = {
  id: "",
  originId: "",
  deleteId: "",
  postEmailType: postEmailType.init,
  conversationData: [],
  sendEmailType: "",
  activeEmail: {},
  isSaveDraft: false,
  isRefresh: false,
  emailsSelected: [],
  isConversationRead: {
    id: "",
    isRead: false,
  },
  conversationEmailsSelected: [],
  emailsAffected: {
    type: "",
    data: [],
  },
  isRefreshClick: false,
  emailSendFromContact: {},
  emailListSendFromContact: [],
  emailPhotos: [],
  isWriteEmail: false,
  isOpenWriteEmailModalPopup: false,
  activeAttachmentFiles: [],
  attachmentsLoading: false,
  currentHighLightMailId: "",
  mailFolderInfo: {},
  currentMailFolder: "inbox",
  activeDraftMailId: "",
  isSearching: false,
  isFiltering: false,
  isBottomAnchorScroll: false,
  dataForward: {},
  unReadNumber: 0,
  currentReplyEmailId: "",
  newReplyEmailList: [],
  fileAttachments: [],
  loadingDraftAttachments: false,
  updateUnreadInConversation: false,
  isReadMailId: "",
};

const OutlookMailReducer = (state = initialState, action) => {
  switch (action.type) {
    case type.SET_CURRENT_OUTLOOK_MAIL_ID:
      return {
        ...state,
        id: action.payload,
      };
    case type.SET_CURRENT_OUTLOOK_MAIL_ID_ORIGIN:
      return {
        ...state,
        originId: action.payload,
      };
    case type.SET_DELETE_MAIL_ID:
      return {
        ...state,
        deleteId: action.payload,
      };
    case type.SET_POST_EMAIL_TYPE:
      return {
        ...state,
        postEmailType: action.payload,
      };
    case type.SET_CONVERSATION_DATA:
      return {
        ...state,
        conversationData: action.payload,
      };
    case type.SET_SEND_EMAIL_TYPE:
      return {
        ...state,
        sendEmailType: action.payload,
      };
    case type.SET_ACTIVE_EMAIL:
      return {
        ...state,
        activeEmail: action.payload,
      };
    case type.SET_SAVE_DRAFT_EMAIL:
      return {
        ...state,
        isSaveDraft: action.payload,
      };
    case type.SET_REFRESH_DATA:
      return {
        ...state,
        isRefresh: action.payload,
      };
    case type.SET_EMAILS_SELECTED:
      return {
        ...state,
        emailsSelected: action.payload,
      };
    case type.TOGGLE_CONVERSATION_READ:
      return {
        ...state,
        isConversationRead: action.payload,
      };
    case type.SET_CONVERSATION_EMAILS_SELECTED:
      return {
        ...state,
        conversationEmailsSelected: action.payload,
      };

    case type.SET_EMAILS_AFFECTED:
      return {
        ...state,
        emailsAffected: action.payload,
      };
    case type.SET_REFRESH_BUTTON:
      return {
        ...state,
        isRefreshClick: action.payload,
      };

    case type.SET_EMAIL_PHOTOS:
      return {
        ...state,
        emailPhotos: action.payload,
      };
    case type.SET_CONTACT_SENDER_EMAIL:
      return {
        ...state,
        emailSendFromContact: { ...action.payload },
      };
    case type.SET_ENABLE_WRITE_EMAIL:
      return {
        ...state,
        isWriteEmail: action.payload,
      };
    case type.SET_OPEN_WRITE_EMAIL_MODAL_POPUP:
      return {
        ...state,
        isOpenWriteEmailModalPopup: action.payload,
      };
    case type.SET_ATTACHMENTS_LIST:
      return {
        ...state,
        activeAttachmentFiles: Object.keys(action.payload).length
          ? state.activeAttachmentFiles.concat([action.payload])
          : [],
      };
    case type.SET_FILE_LOADING:
      return {
        ...state,
        attachmentsLoading: action.payload,
      };
    case type.SET_CURRENT_MAIL_HIGH_LIGHT:
      return {
        ...state,
        currentHighLightMailId: action.payload,
      };
    case type.SET_MAIL_FOLDER_INFO:
      return {
        ...state,
        mailFolderInfo: action.payload,
      };

    case type.SET_CURRENT_MAIL_FOLDER:
      return {
        ...state,
        currentMailFolder: action.payload,
      };
    case type.SET_ACTIVE_DRAFT_MAIL_ID:
      return {
        ...state,
        activeDraftMailId: action.payload,
      };
    case type.SET_IS_FILTERING:
      return {
        ...state,
        isFiltering: action.payload,
      };
    case type.SET_IS_SEARCHING:
      return {
        ...state,
        isSearching: action.payload,
      };
    case type.IS_BOTTOM_ANCHOR_SCROLL:
      return {
        ...state,
        isBottomAnchorScroll: action.payload,
      };

    case type.SET_DATA_FORWARD:
      return {
        ...state,
        dataForward: action.payload,
      };
    case type.SET_LIST_EMAIL_SEND_CONTACT:
      return {
        ...state,
        emailListSendFromContact: action.payload,
      };
    case type.UPDATE_UNREAD_NUMBER:
      return {
        ...state,
        unReadNumber: action.payload,
      };
    case type.CURRENT_REPLY_MAIL_ID:
      return {
        ...state,
        currentReplyEmailId: action.payload,
      };
    case type.NEW_REPLY_EMAIL_LIST:
      return {
        ...state,
        newReplyEmailList: action.payload,
      };
    case type.SET_FILE_ATTACHMENTS:
      return {
        ...state,
        fileAttachments: action.payload,
      };
    case type.LOADING_DRAFT_ATTACHMENTS:
      return {
        ...state,
        loadingDraftAttachments: action.payload,
      };
    case type.UPDATE_UNREAD_IN_CONVERSATION:
      return {
        ...state,
        updateUnreadInConversation: action.payload,
      };
    case type.SET_IS_READ_MAIL_ID:
      return {
        ...state,
        isReadMailId: action.payload,
      };
    default:
      return state;
  }
};

export default OutlookMailReducer;
