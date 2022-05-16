import * as types from "../actionTypes/mail-summary-actionType";
const initialState = {
  contactData: [],
  isRefresh: false,
  deleteId: "",
  isSummary: true,
  searchValue: "",
  isImageUpdate: {
    id: "",
    isUpdate: false,
  },
};

const MailSummaryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REFRESH_ACTION:
      return {
        ...state,
        isRefresh: action.payload,
      };
    case types.SET_MAIL_SUMMARY:
      return {
        ...state,
        isSummary: action.payload,
      };
    case types.SET_CONTACT_LIST:
      return {
        ...state,
        contactData: action.payload,
      };
    case types.SET_SEARCH_KEYWORD:
      return {
        ...state,
        searchValue: action.payload,
      };
    case types.REFRESH_CONTACT_IMAGE:
      return {
        ...state,
        isImageUpdate: { ...action.payload },
      };
    default:
      return state;
  }
};
export default MailSummaryReducer;
