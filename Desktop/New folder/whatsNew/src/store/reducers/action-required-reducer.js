import {
  FETCH_USER_PERSONAL_INFO_SUCCESS,
  FETCH_USER_SEARCH_LIST_SUCCESS,
  FETCH_USER_SEARCH_LIST,
  FETCH_USER_SEARCH_LIST_ERROR,
  FETCH_USER_ACTIONS_REQUIRED,
  FETCH_USER_ACTIONS_REQUIRED_SUCCESS,
  FETCH_USER_ACTIONS_REQUIRED_ERROR,
  POST_USER_ACTIONS_REQUIRED,
  POST_USER_ACTIONS_REQUIRED_SUCCESS,
  POST_USER_ACTIONS_REQUIRED_ERROR,
  RESET_SEARCH_LIST,
} from "../actionTypes/user-action-type";

const initialState = {
  requiredActions: [],
  fetchingActions: undefined,
  actionPosting: undefined,
  actionPosted: undefined,
  error: undefined,
  requiredUserSearchList: [],
};

const ActionRequiredReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_ACTIONS_REQUIRED:
      return {
        ...state,
        fetchingActions: true,
      };
    case FETCH_USER_ACTIONS_REQUIRED_ERROR:
      return {
        ...state,
        fetchingActions: false,
        error: action.payload.message,
      };
    case FETCH_USER_ACTIONS_REQUIRED_SUCCESS:
      return {
        ...state,
        fetchingActions: false,
        requiredActions: action.payload.data ? action.payload.data : [],
      };
    case FETCH_USER_PERSONAL_INFO_SUCCESS:
      return {
        ...state,
        fetchingActions: false,
        requiredUserInfo: action.payload.data ? action.payload.data : "",
      };
    case FETCH_USER_SEARCH_LIST:
      return {
        ...state,
        fetchingActions: true,
        requiredUserSearchList: [],
      };
    case FETCH_USER_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        fetchingActions: false,
        requiredUserSearchList: action.payload.data ? action.payload.data : "",
      };
    case FETCH_USER_SEARCH_LIST_ERROR:
      return {
        ...state,
        fetchingActions: false,
        requiredUserSearchList: [],
      };

    case POST_USER_ACTIONS_REQUIRED:
      return {
        ...state,
        actionPosting: true,
        actionPosted: false,
      };
    case POST_USER_ACTIONS_REQUIRED_SUCCESS:
      return {
        ...state,
        actionPosting: false,
        actionPosted: true,
      };
    case POST_USER_ACTIONS_REQUIRED_ERROR:
      return {
        ...state,
        actionPosting: false,
        actionPosted: false,
        error: action.payload.message,
      };

    case RESET_SEARCH_LIST:
      return {
        ...state,
        fetchingActions: false,
        requiredUserSearchList: [],
      };

    default:
      return state;
  }
};

export default ActionRequiredReducer;
