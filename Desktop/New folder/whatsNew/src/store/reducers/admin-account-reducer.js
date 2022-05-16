import { accountConstants } from "../../constants/account-search";
import {
  FETCH_ACCOUNT_LIST_REQUEST,
  FETCH_ACCOUNT_LIST_SUCCESS,
  FETCH_ACCOUNT_LIST_ERROR,
  SET_SELECTED_ACCOUNTS,
  FETCH_USER_DISCUSSIONS_LIST,
  FETCH_USER_DISCUSSIONS_LIST_SUCCESS,
  FETCH_USER_DISCUSSIONS_LIST_ERROR,
  ASSIGN_UUID_REQUEST,
  ASSIGN_UUID_SUCCESS,
  ASSIGN_UUID_ERROR,
  CREATE_ACCOUNT_REQUEST,
  CREATE_ACCOUNT_SUCCESS,
  CREATE_ACCOUNT_ERROR,
  CREATE_ACCOUNT_RESET,
  FETCH_ADMIN_FOLDER_LIST_REQUEST,
  FETCH_ADMIN_FOLDER_LIST_SUCCESS,
  FETCH_ADMIN_FOLDER_LIST_ERROR,
  FETCH_USER_INFORMATION_REQUEST,
  FETCH_USER_INFORMATION_SUCCESS,
  FETCH_USER_INFORMATION_ERROR,
  FETCH_LOGIN_HISTORY_REQUEST,
  FETCH_LOGIN_HISTORY_SUCCESS,
  FETCH_LOGIN_HISTORY_ERROR,
  UPDATE_LOGIN_HISTORY_LIST,
  CREATE_OWNER_DISCUSSION_REQUEST,
  CREATE_OWNER_DISCUSSION_SUCCESS,
  CREATE_OWNER_DISCUSSION_ERROR,
  CREATE_OWNER_DISCUSSION_RESET,
  SET_ACCOUNT_SEARCH_QUERY,
  FETCH_ACCOUNT_SEARCH_LIST_REQUEST,
  FETCH_ACCOUNT_SEARCH_LIST_SUCCESS,
  FETCH_ACCOUNT_SEARCH_LIST_ERROR,
  FETCH_ACCOUNT_SEARCH_DETAILS_CLEAR,
  RESET_ACCOUNT_FILTER_OBJECT,
  SET_ACCOUNT_FILTER_OBJECT,
  IMPORTED_ADMIN_ACCOUNT,
  UPDATE_ADMIN_ACCOUNT_DATA,
  FETCH_AVAILABLE_UID_REQUEST,
  FETCH_AVAILABLE_UID_SUCCESS,
  FETCH_AVAILABLE_UID_ERROR,
  IMPORT_MEMBER_LIST_REQUEST,
  IMPORT_MEMBER_LIST_SUCCESS,
  IMPORT_MEMBER_LIST_ERROR,
  RESET_LOGIN_HISTORY_ACTION,
  RESET_DISCUSSION_LIST_ACTION,
  RESET_ASSIGN_UUID_STATUS,
  ACTIVATE_USER_REQUEST,
  ACTIVATE_USER_SUCCESS,
  ACTIVATE_USER_ERROR,
  RESET_ACTIVATE_USER_STATUS,
  USER_STATUS_CHANGE_REQUEST,
  USER_STATUS_CHANGE_SUCCESS,
  USER_STATUS_CHANGE_ERROR,
  RESET_USER_STATUS_ACTIVITY,
  UPDATE_USER_BLOCKED_STATUS,
} from "./../actionTypes/admin-account-action-types";

const initialState = {
  importingMemberList: false,
  importedMemberList: false,
  createAccountApiError: null,
  importMemberListApiError: null,
  accountListFetching: true,
  accountListFetched: false,
  adminFolderListFetching: true,
  adminFolderListFetched: false,
  account_data: [],
  adminFolderList: [],
  creatingAccount: false,
  createdAccount: false,
  newAccount: null,
  accountList: [],
  accountSearchListFetching: true,
  accountSearchListFetched: false,
  accountSearchData: [],
  imported: false,
  update_display: 0,
  selectedAccounts: [],
  creatingDiscussion: false,
  createdDiscussion: false,
  createDiscussionApiError: null,
  newDiscussion: null,
  discussionList: [],
  accountSearchObj: {
    name: "",
    email: "",
    phone: "",
    affiliation: "",
    status: accountConstants.STATUS,
    q: "",
  },
  accountFilterObj: {
    size: accountConstants.ITEM_COUNT,
    count: accountConstants.ITEM_COUNT,
    order: accountConstants.ASC,
    sort: accountConstants.SORT_BY,
    status: accountConstants.STATUS,
    page: accountConstants.OFFSET,
    offset: accountConstants.OFFSET,
  },
  searchAccountEnabled: false,
  accountSearchCount: 0,
  accountCount: 0,
  fetchingUserInformation: true,
  fetchedUserInformation: false,
  fetchedUserData: null,
  accountLoginHistory: [],
  fetchingLoginHistory: true,
  fetchedLoginHistory: false,
  fetchingAvailableUidList: true,
  fetchedAvailalbeUidList: false,
  availableUidList: [],
  requestOffsetLogin: 0,
  internalDiscussionList: [],
  externalDiscussionList: [],
  guestDiscussionList: [],
  requestOffsetInternal: 0,
  requestOffsetExternal: 0,
  requestOffsetGuest: 0,
  totalInternalDisCount: 0,
  totalExternalDisCount: 0,
  totalGuestDisCount: 0,
  showInternal: 0,
  showExternal: 0,
  showGuest: 0,
  showMore: false,
  assignUuidSuccess: null,
  activateUserSuccess: null,
  userStatusChangeSuccess: null,
  userStatusChangeType: null,
  userStatusChangeMessage: null,
  userStatusInformation: null,
  userStatusChanges: false,
};

const updateListIfDiscussionNotExist = (discussionList, newDiscussion) => {
  if (discussionList) {
    let discussionAlreadyExist = false;
    let matchIndex = -1;

    var index;
    for (index = 0; index < discussionList.length; index++) {
      var discussion = discussionList[index];
      if (discussion?.id === newDiscussion?.id) {
        matchIndex = index;
        discussionAlreadyExist = true;
        break;
      }
    }

    if (discussionAlreadyExist) {
      newDiscussion.newUnreadMessageCount =
        discussionList[matchIndex].newUnreadMessageCount !== undefined
          ? discussionList[matchIndex].newUnreadMessageCount
          : newDiscussion.newUnreadMessageCount;
      discussionList[matchIndex] = newDiscussion;
    } else {
      discussionList.push(newDiscussion);
    }
  }
};
const updateDiscussionList = (newDiscussionList, stateDiscussionList) => {
  if (newDiscussionList instanceof Array) {
    newDiscussionList.forEach((newDiscussion) => {
      updateListIfDiscussionNotExist(stateDiscussionList, newDiscussion);
    });
  } else if (newDiscussionList) {
    let newDiscussion = newDiscussionList;
    newDiscussion.newUnreadMessageCount = newDiscussion.newMessageCount;
    updateListIfDiscussionNotExist(stateDiscussionList, newDiscussion);
  }
  return newDiscussionList;
};
const updateLoginHistoryStats = (LoginHistoryMessages, payload) => {
  //Need to update the condition when WS will come
  let currentMessages = LoginHistoryMessages.slice();
  // currentMessages.length > 0 &&
  // currentMessages.map((item, index) => {
  //   if (item.id === payload?.loginHistory?.id) {
  //     item=payload?.loginHistory;
  //   } else {
  currentMessages.push(payload?.loginHistory);
  //   }
  // });

  return currentMessages;
};
const updatedAccountData = (accountData, payload) => {
  let currentMessages = accountData.slice();
  currentMessages &&
    currentMessages.length > 0 &&
    currentMessages.map((item) => {
      if (item.id === payload.userId) {
        item.activationStatus = payload.activationStatus;
      }
      return item;
    });
  return currentMessages;
};

const updateAccountLoginHistory = (accountLoginHistory, payload) => {
  let currentLoginHistory =
    accountLoginHistory.length > 0 ? accountLoginHistory.slice() : [];
  payload &&
    payload.length > 0 &&
    payload.map((item) => {
      let matchIndex = currentLoginHistory.findIndex(
        (value) => item.id === value.id
      );
      if (matchIndex === -1) {
        currentLoginHistory.push(item);
      } else {
        currentLoginHistory[matchIndex] = item;
      }
      return item;
    });
  return currentLoginHistory;
};

const updateDiscussionListOnSummary = (stateDiscussionList, payload) => {
  let currentStateDiscussions =
    stateDiscussionList.length > 0 ? stateDiscussionList.slice() : [];
  payload &&
    payload.length > 0 &&
    payload.map((item) => {
      let matchIndex = currentStateDiscussions.findIndex(
        (value) => item.id === value.id
      );
      if (matchIndex === -1) {
        currentStateDiscussions.push(item);
      } else {
        currentStateDiscussions[matchIndex] = item;
      }
      return item;
    });
  return currentStateDiscussions;
};

const AdminAccountReducer = (state = initialState, action) => {
  let stateAccountList = state.accountList ? state.accountList.slice() : [];
  let stateDiscussionList = state.discussionList
    ? state.discussionList.slice()
    : [];

  switch (action.type) {
    case CREATE_OWNER_DISCUSSION_REQUEST:
      return {
        ...state,
        creatingDiscussion: true,
        failedToCreateDiscussion: false,
        createdDiscussion: false,
        newDiscussion: null,
      };
    case CREATE_OWNER_DISCUSSION_SUCCESS:
      return {
        ...state,
        creatingDiscussion: false,
        createdDiscussion: true,
        failedToCreateDiscussion: false,
        newDiscussion: updateDiscussionList(
          action.payload.data,
          stateDiscussionList
        ),
        discussionList: stateDiscussionList,
      };
    case CREATE_OWNER_DISCUSSION_ERROR:
      return {
        ...state,
        creatingDiscussion: false,
        createdDiscussion: false,
        failedToCreateDiscussion: true,
        newDiscussion: null,
        createDiscussionApiError: action.payload,
      };

    case CREATE_OWNER_DISCUSSION_RESET:
      return {
        ...state,
        creatingDiscussion: false,
        createdDiscussion: false,
        failedToCreateDiscussion: false,
        newDiscussion: null,
        createDiscussionApiError: null,
      };
    case CREATE_ACCOUNT_REQUEST:
      return {
        ...state,
        creatingAccount: true,
        failedToCreateAccount: false,
        createdAccount: false,
        newAccount: null,
      };
    case CREATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        creatingAccount: false,
        createdAccount: true,
        failedToCreateAccount: false,
        // newAccount: updateAccountList(action.payload.data, stateAccountList),
        newAccount: null,
        accountList: stateAccountList,
      };
    case CREATE_ACCOUNT_ERROR:
      return {
        ...state,
        creatingAccount: false,
        createdAccount: false,
        failedToCreateAccount: true,
        newAccount: null,
        createAccountApiError: action.payload,
      };
    case IMPORT_MEMBER_LIST_REQUEST:
      return {
        ...state,
        importingMemberList: true,
        failedToImportMemberList: false,
        importedMemberList: false,
      };
    case IMPORT_MEMBER_LIST_SUCCESS:
      return {
        ...state,
        importingMemberList: false,
        importedMemberList: true,
        failedToImportMemberList: false,
      };
    case IMPORT_MEMBER_LIST_ERROR:
      return {
        ...state,
        importingMemberList: false,
        importedMemberList: false,
        failedToImportMemberList: true,
        importMemberListApiError: action.payload,
      };

    case CREATE_ACCOUNT_RESET:
      return {
        ...state,
        creatingAccount: false,
        createdAccount: false,
        failedToCreateAccount: false,
        newAccount: null,
        createAccountApiError: null,
      };
    case FETCH_ACCOUNT_LIST_REQUEST:
      return {
        ...state,
        accountListFetching: true,
        accountListFetched: false,
        accountCount: 0,
      };
    case FETCH_ACCOUNT_LIST_SUCCESS:
      return {
        ...state,
        accountListFetching: false,
        accountListFetched: true,
        account_data: action.payload.result ? action.payload.result : [],
        accountCount: action.payload.count
          ? action.payload.count
          : accountConstants.ITEM_COUNT,
      };
    case FETCH_ACCOUNT_LIST_ERROR:
      return {
        ...state,
        accountListFetching: false,
        accountListFetched: false,
        account_data: [],
        accountCount: 0,
      };
    case FETCH_ACCOUNT_SEARCH_LIST_REQUEST:
      return {
        ...state,
        accountSearchListFetching: true,
        accountSearchListFetched: false,
        searchAccountEnabled: true,
        accountSearchCount: 0,
        accountSearchData: [],
      };
    case FETCH_ACCOUNT_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        accountSearchListFetching: false,
        accountSearchListFetched: true,
        accountSearchCount: action.payload.count,
        accountSearchData: action.payload.result,
        searchAccountEnabled: true,
      };
    case FETCH_ACCOUNT_SEARCH_LIST_ERROR:
      return {
        ...state,
        accountSearchListFetching: false,
        accountSearchListFetched: false,
        accountSearchData: [],
        searchAccountEnabled: true,
        accountSearchCount: 0,
      };
    case RESET_ACCOUNT_FILTER_OBJECT:
      return {
        ...state,
        accountFilterObj: initialState.accountFilterObj,
      };
    case SET_ACCOUNT_FILTER_OBJECT:
      return {
        ...state,
        accountFilterObj: action.payload,
      };
    case FETCH_ACCOUNT_SEARCH_DETAILS_CLEAR:
      return {
        ...state,
        accountSearchData: [],
        searchAccountEnabled: false,
        accountSearchObj: { ...initialState.accountSearchObj },
        accountSearchCount: 0,
      };
    case FETCH_USER_INFORMATION_REQUEST:
      return {
        ...state,
        fetchingUserInformation: true,
        fetchedUserInformation: false,
      };
    case FETCH_USER_INFORMATION_SUCCESS:
      return {
        ...state,
        fetchingUserInformation: false,
        fetchedUserInformation: true,
        fetchedUserData: action.payload,
      };
    case FETCH_USER_INFORMATION_ERROR:
      return {
        ...state,
        fetchingUserInformation: false,
        fetchedUserInformation: false,
      };
    case FETCH_ADMIN_FOLDER_LIST_REQUEST:
      return {
        ...state,
        adminFolderListFetching: true,
        adminFolderListFetched: false,
      };
    case FETCH_ADMIN_FOLDER_LIST_SUCCESS:
      return {
        ...state,
        adminFolderListFetching: false,
        adminFolderListFetched: true,
        adminFolderList: action.payload,
      };
    case FETCH_ADMIN_FOLDER_LIST_ERROR:
      return {
        ...state,
        adminFolderListFetching: false,
        adminFolderListFetched: false,
        adminFolderList: [],
      };
    case SET_SELECTED_ACCOUNTS:
      return {
        ...state,
        selectedAccounts: action.payload,
      };
    case SET_ACCOUNT_SEARCH_QUERY:
      return {
        ...state,
        accountSearchObj: action.payload,
      };

    case UPDATE_ADMIN_ACCOUNT_DATA:
      return {
        ...state,
        account_data: action.account_data,
        update_display: action.update_display,
      };
    case IMPORTED_ADMIN_ACCOUNT:
      return { ...state, imported: action.imported };
    case ASSIGN_UUID_REQUEST:
      return {
        ...state,
      };
    case ASSIGN_UUID_SUCCESS:
      return {
        ...state,
        assignUuidSuccess: true,
      };
    case ASSIGN_UUID_ERROR:
      return {
        ...state,
        assignUuidSuccess: false,
      };
    case RESET_ASSIGN_UUID_STATUS:
      return {
        ...state,
        assignUuidSuccess: null,
      };
    case ACTIVATE_USER_REQUEST:
      return {
        ...state,
      };
    case ACTIVATE_USER_SUCCESS:
      return {
        ...state,
        activateUserSuccess: true,
      };
    case ACTIVATE_USER_ERROR:
      return {
        ...state,
        activateUserSuccess: false,
      };
    case RESET_ACTIVATE_USER_STATUS:
      return {
        ...state,
        activateUserSuccess: null,
      };
    case USER_STATUS_CHANGE_REQUEST:
      return {
        ...state,
        userStatusChangeType: action.payload.type,
        userStatusChangeMessage: action.payload.message,
      };
    case USER_STATUS_CHANGE_SUCCESS:
      return {
        ...state,
        userStatusChangeSuccess: true,
      };
    case USER_STATUS_CHANGE_ERROR:
      return {
        ...state,
        userStatusChangeSuccess: false,
      };
    case RESET_USER_STATUS_ACTIVITY:
      return {
        ...state,
        userStatusChangeSuccess: null,
      };
    case FETCH_LOGIN_HISTORY_REQUEST:
      return {
        ...state,
        fetchingLoginHistory: true,
        fetchedLoginHistory: false,
      };
    case FETCH_USER_DISCUSSIONS_LIST:
      return {
        ...state,
        fetchingUserDiscussions: true,
      };
    case FETCH_USER_DISCUSSIONS_LIST_SUCCESS:
      let guestList = [],
        internalList = [],
        externalList = [],
        totalInternalCount = 0,
        totalExternalCount = 0,
        totalGuestCount = 0;
      if (action.payload?.channelType === "INTERNAL") {
        internalList = action.payload?.payload?.data?.result;
        externalList = state.externalDiscussionList;
        guestList = state.guestDiscussionList;
        totalInternalCount = action.payload?.payload?.data?.totalCount;
        totalExternalCount = state.totalExternalDisCount;
        totalGuestCount = state.totalGuestDisCount;
      }
      if (action.payload?.channelType === "EXTERNAL") {
        externalList = action.payload?.payload?.data?.result;
        internalList = state.internalDiscussionList;
        guestList = state.guestDiscussionList;
        totalExternalCount = action.payload?.payload?.data?.totalCount;
        totalInternalCount = state.totalInternalDisCount;
        totalGuestCount = state.totalGuestDisCount;
      }
      if (action.payload?.channelType === "GUEST") {
        guestList = action.payload?.payload?.data?.result;
        externalList = state.externalDiscussionList;
        internalList = state.internalDiscussionList;
        totalGuestCount = action.payload?.payload?.data?.totalCount;
        totalExternalCount = state.totalExternalDisCount;
        totalInternalCount = state.totalInternalDisCount;
      }

      let updateInternalDiscussionData = updateDiscussionListOnSummary(
        state.internalDiscussionList,
        internalList
      );
      let updateExternalDiscussionListData = updateDiscussionListOnSummary(
        state.externalDiscussionList,
        externalList
      );
      let updateGuestDiscussionListData = updateDiscussionListOnSummary(
        state.guestDiscussionList,
        guestList
      );

      return {
        ...state,
        internalDiscussionList: updateInternalDiscussionData,
        externalDiscussionList: updateExternalDiscussionListData,
        guestDiscussionList: updateGuestDiscussionListData,
        fetchedUserDiscussions: true,
        totalInternalDisCount: totalInternalCount,
        totalExternalDisCount: totalExternalCount,
        totalGuestDisCount: totalGuestCount,
        requestOffsetInternal: updateInternalDiscussionData.length,
        requestOffsetExternal: updateExternalDiscussionListData.length,
        requestOffsetGuest: updateGuestDiscussionListData.length,
        showInternal:
          totalInternalCount - updateInternalDiscussionData?.length > 10
            ? true
            : false,
        showExternal:
          totalExternalCount - updateExternalDiscussionListData?.length > 10
            ? true
            : false,
        showGuest:
          totalGuestCount - updateGuestDiscussionListData?.length > 10
            ? true
            : false,
      };
    case RESET_DISCUSSION_LIST_ACTION:
      return {
        ...state,
        internalDiscussionList: [],
        externalDiscussionList: [],
        guestDiscussionList: [],
        totalInternalDisCount: 0,
        totalExternalDisCount: 0,
        requestOffsetInternal: 0,
        requestOffsetExternal: 0,
        requestOffsetGuest: 0,
        showGuest: false,
        showInternal: false,
        showExternal: false,
      };
    case FETCH_USER_DISCUSSIONS_LIST_ERROR:
      return {
        ...state,
        fetchingUserDiscussions: false,
        fetchedUserDiscussions: false,
      };

    case FETCH_LOGIN_HISTORY_SUCCESS:
      let updateAccountLoginHistoryData = updateAccountLoginHistory(
        state.accountLoginHistory,
        action.payload.data?.loginHistory
      );

      return {
        ...state,
        accountLoginHistory: updateAccountLoginHistoryData,
        fetchingLoginHistory: false,
        fetchedLoginHistory: true,
        requestOffsetLogin:
          updateAccountLoginHistoryData?.length > 0
            ? updateAccountLoginHistoryData.length
            : 0,
        showMore:
          action.payload.data?.count - updateAccountLoginHistoryData?.length >
          10
            ? true
            : false,
      };
    case RESET_LOGIN_HISTORY_ACTION:
      return {
        ...state,
        accountLoginHistory: [],
        requestOffsetLogin: 0,
      };
    case FETCH_LOGIN_HISTORY_ERROR:
      return {
        ...state,
        fetchingLoginHistory: true,
        fetchedLoginHistory: false,
      };
    case UPDATE_LOGIN_HISTORY_LIST:
      let stateAccountLoginHistory = state.accountLoginHistory;
      return {
        ...state,
        fetchingLoginHistory: false,
        fetchedLoginHistory: true,
        accountLoginHistory: updateLoginHistoryStats(
          stateAccountLoginHistory,
          action.payload
        ),
      };
    case FETCH_AVAILABLE_UID_REQUEST:
      return {
        ...state,
        fetchingAvailableUidList: true,
        fetchedAvailalbeUidList: false,
        availableUidList: [],
      };
    case FETCH_AVAILABLE_UID_SUCCESS:
      return {
        ...state,
        fetchingAvailableUidList: false,
        fetchedAvailalbeUidList: true,
        availableUidList: action.payload,
      };
    case FETCH_AVAILABLE_UID_ERROR:
      return {
        ...state,
        fetchingAvailableUidList: false,
        fetchedAvailalbeUidList: true,
        availableUidList: [],
      };
    case UPDATE_USER_BLOCKED_STATUS:
      let updatedAccountStatus = updatedAccountData(
        state.account_data,
        action.payload
      );
      return {
        ...state,
        userStatusInformation: action.payload,
        account_data: updatedAccountStatus,
        userStatusChanges: true,
      };
    default:
      return state;
  }
};
export default AdminAccountReducer;
