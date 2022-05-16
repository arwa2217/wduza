import * as types from "../actionTypes/mail-summary-actionType";
export const refreshContactData = (isRefresh) => {
  return {
    type: types.REFRESH_ACTION,
    payload: isRefresh,
  };
};
export const refreshContactImage = (obj) => {
  return {
    type: types.REFRESH_CONTACT_IMAGE,
    payload: { ...obj },
  };
};
export const setContactList = (contactList) => {
  return {
    type: types.SET_CONTACT_LIST,
    payload: contactList,
  };
};
export const setMailSummary = (status) => {
  return {
    type: types.SET_MAIL_SUMMARY,
    payload: status,
  };
};
export const setKeyword = (keyword) => {
  return {
    type: types.SET_SEARCH_KEYWORD,
    payload: keyword,
  };
};
