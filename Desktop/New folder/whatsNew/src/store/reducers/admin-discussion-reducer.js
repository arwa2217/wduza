import { discussionConstants } from "../../constants/discussion-search";
import {
  FETCH_DISCUSSION_LIST_REQUEST,
  FETCH_DISCUSSION_LIST_SUCCESS,
  FETCH_DISCUSSION_LIST_ERROR,
  FETCH_DISCUSSION_SEARCH_DETAILS_REQUEST,
  FETCH_DISCUSSION_SEARCH_DETAILS_SUCCESS,
  FETCH_DISCUSSION_SEARCH_DETAILS_ERROR,
  UPDATE_LAST_DISCUSSION_SEARCH_QUERY,
  FETCH_SEARCH_DISCUSSIONS_DETAILS_CLEAR,
  CLEAR_SEARCH_DISCUSSIONS_RESULT,
  FETCH_DISCUSSION_HISTORY_LIST_REQUEST,
  FETCH_DISCUSSION_HISTORY_LIST_SUCCESS,
  FETCH_DISCUSSION_HISTORY_LIST_ERROR,
  FETCH_DISCUSSION_INFORMATION_REQUEST,
  FETCH_DISCUSSION_INFORMATION_SUCCESS,
  FETCH_DISCUSSION_INFORMATION_ERROR,
  SET_SELECTED_DISCUSSIONS,
  SET_DISCUSSION_FILTER_OBJECT,
  RESET_DISCUSSION_FILTER_OBJECT,
  FETCH_DISCUSSION_MEMBERS_LIST_REQUEST,
  FETCH_DISCUSSION_MEMBERS_LIST_SUCCESS,
  FETCH_DISCUSSION_MEMBERS_LIST_ERROR,
  ADMIN_DELETE_DISCUSSION_REQUEST,
  ADMIN_DELETE_DISCUSSION_SUCCESS,
  ADMIN_DELETE_DISCUSSION_ERROR,
  UPDATE_DISCUSSION_INFORMATION_REQUEST,
  UPDATE_DISCUSSION_INFORMATION_SUCCESS,
  UPDATE_DISCUSSION_INFORMATION_ERROR,
  FETCH_DISCUSSION_SEARCH_DETAILS_CLEAR,
  SET_DISCUSSION_SEARCH_QUERY,
  ADD_DISCUSSION_MEMBER_REQUEST,
  ADD_DISCUSSION_MEMBER_SUCCESS,
  ADD_DISCUSSION_MEMBER_ERROR,
  CHANGE_OWNER_REQUEST,
  CHANGE_OWNER_SUCCESS,
  CHANGE_OWNER_ERROR,
  UPDATE_CHANGE_OWNER_STATUS,
  REMOVE_DISCUSSION_MEMBER,
  REMOVE_DISCUSSION_MEMBER_SUCCESS,
  REMOVE_DISCUSSION_MEMBER_ERROR,
  REMOVE_DISCUSSION_MEMBER_RESET,
} from "../actionTypes/admin-discussion-action-types";

const initialState = {
  fetchingDiscussionList: true,
  fetchedDiscussionList: false,
  discussionListData: [],
  discussionListCount: null,
  discussionFilteredCount: null,
  fetchingDiscussionHistoryList: true,
  fetchedDiscussionHistoryList: false,
  discussionHistoryListData: [],
  fetchingDiscussionInformation: true,
  fetchedDiscussionInformation: false,
  discussionInformationData: null,
  discussionListCount: null,
  discussionFilterObj: {
    count: discussionConstants.ITEM_COUNT,
    orderby: discussionConstants.ORDER_BY,
    order: discussionConstants.ASC,
    status: discussionConstants.STATUS,
    offset: discussionConstants.OFFSET,
    type: discussionConstants.TYPE,
    // sort:discussionConstants.SORT,
    value:'',
    authorValue:"",
    emailValue: "",
    advanced: "",
    status:discussionConstants.STATUS,
  },
  discussionSearchList: [],
  searchAccountEnabled: false,
  selectedDiscussions: [],
  fetchingDiscussionMemberList: true,
  fetchedDiscussionMemberList: false,
  discussionMembers: [],
  accountSearchCount: 0,
  adminUserDeletedSuccess : false,
  adminUserDeletedError : false,
  addingMember: false,
  addedMember: false,
  member: null,
  changingOwner: false,
  ownerChanged: false,
  removingMember: false,
  removedMember: false,
  failedToRemoveMember: false,
  errorMessage: null,
  removeMemberError: null,
};

const AdminDiscussionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DISCUSSION_LIST_REQUEST:
      return {
        ...state,
        fetchingDiscussionList: true,
        fetchedDiscussionList: false,
        discussionListData: [],
      };
    case FETCH_DISCUSSION_LIST_SUCCESS:
      return {
        ...state,
        fetchingDiscussionList: false,
        fetchedDiscussionList: true,
        discussionListData: action.payload.channels,
        discussionListCount: action.payload.count,
        discussionFilteredCount: action.payload.count.filteredCount,
      };
    case FETCH_DISCUSSION_LIST_ERROR:
      return {
        ...state,
        fetchingDiscussionList: false,
        fetchedDiscussionList: true,
        discussionListData: [],
      };

    case FETCH_DISCUSSION_SEARCH_DETAILS_REQUEST:
      return {
        ...state,
        searchCount: 0,
        accountSearchCount: 0,
      };
    case FETCH_DISCUSSION_SEARCH_DETAILS_SUCCESS:
      return {
        ...state,
        discussionSearchList: action.payload.data.result,
        accountSearchCount: action.payload.data.result?action.payload.data.result.length:0,
        searchAccountEnabled: true,
        terms: action.payload.data?.term,
        searchCount: action.payload.data?.filteredCount
          ? action.payload.data?.filteredCount
          : state.searchCount,
          searchFilterObject: action.payload.searchFilterObject,
      };

    case FETCH_DISCUSSION_SEARCH_DETAILS_ERROR:
      return {
        ...state,
        discussionSearchList: [],
        searchAccountEnabled: false,
        searchCount: 0,
        accountSearchCount:0
      };

    case FETCH_SEARCH_DISCUSSIONS_DETAILS_CLEAR:
      return {
        ...state,
        discussionSearchList: [],
        searchAccountEnabled: false,
        discussionFilterObj: { ...initialState.discussionFilterObj },
        searchCount: 0,
        accountSearchCount:0
      };

      case FETCH_DISCUSSION_SEARCH_DETAILS_CLEAR:
        return {
          ...state,
          discussionSearchList: [],
          searchAccountEnabled: false,
          discussionFilterObj: { ...initialState.discussionFilterObj },
          searchCount: 0,
        };
        
      
    case CLEAR_SEARCH_DISCUSSIONS_RESULT:
      let data = action.payload;
      data.discussionId = "";
      return {
        ...state,
      };
    case UPDATE_LAST_DISCUSSION_SEARCH_QUERY: {
      return {
        ...state,
        discussionFilterObj: {
          ...state.discussionFilterObj,
          ...action.payload,
        },
      };
    }

    case FETCH_DISCUSSION_HISTORY_LIST_REQUEST:
      return {
        ...state,
        fetchingDiscussionHistoryList: true,
        fetchedDiscussionHistoryList: false,
        discussionHistoryListData: [],
      };
    case FETCH_DISCUSSION_HISTORY_LIST_SUCCESS:
      return {
        ...state,
        fetchingDiscussionHistoryList: false,
        fetchedDiscussionHistoryList: true,
        discussionHistoryListData: action.payload?.discussionHistory,
      };
    case FETCH_DISCUSSION_HISTORY_LIST_ERROR:
      return {
        ...state,
        fetchingDiscussionHistoryList: false,
        fetchedDiscussionHistoryList: true,
        discussionHistoryListData: [],
      };
    case FETCH_DISCUSSION_INFORMATION_REQUEST:
      return {
        ...state,
        fetchingDiscussionInformation: true,
        fetchedDiscussionInformation: false,
        discussionInformationData: [],
      };
    case FETCH_DISCUSSION_INFORMATION_SUCCESS:
      return {
        ...state,
        fetchingDiscussionInformation: false,
        fetchedDiscussionInformation: true,
        discussionInformationData: [],
      };
    case FETCH_DISCUSSION_INFORMATION_ERROR:
      return {
        ...state,
        fetchingDiscussionInformation: false,
        fetchedDiscussionInformation: true,
        discussionInformationData: [],
      };
    case SET_DISCUSSION_FILTER_OBJECT:
      return {
        ...state,
        discussionFilterObj: action.payload,
      };
    case RESET_DISCUSSION_FILTER_OBJECT:
      return {
        ...state,
        discussionFilterObj: initialState.discussionFilterObj,
      };
    case SET_SELECTED_DISCUSSIONS:
      return {
        ...state,
        selectedDiscussions: action.payload,
      };
    case FETCH_DISCUSSION_MEMBERS_LIST_REQUEST:
      return {
        ...state,
        fetchingDiscussionMemberList: true,
        fetchedDiscussionMemberList: false,
        discussionMembers: [],
      };
    case FETCH_DISCUSSION_MEMBERS_LIST_SUCCESS:
      return {
        ...state,
        fetchingDiscussionMemberList: false,
        fetchedDiscussionMemberList: true,
        discussionMembers: action.payload,
      };
    case FETCH_DISCUSSION_MEMBERS_LIST_ERROR:
      return {
        ...state,
        fetchingDiscussionMemberList: false,
        fetchedDiscussionMemberList: true,
        discussionMembers: [],
      };
      case SET_DISCUSSION_SEARCH_QUERY:
      return {
        ...state,
        discussionFilterObj: action.payload,
      }
    case ADMIN_DELETE_DISCUSSION_REQUEST:
      return {
        ...state,
        adminUserDeletedSuccess : false,
        adminUserDeletedError : false
      };
    case ADMIN_DELETE_DISCUSSION_SUCCESS:
      return {
        ...state,
        adminUserDeletedSuccess : true,
        adminUserDeletedError : false
      };
    case ADMIN_DELETE_DISCUSSION_ERROR:
      return {
        ...state,
        adminUserDeletedSuccess : false,
        adminUserDeletedError : true
      }
    case ADD_DISCUSSION_MEMBER_REQUEST:
      return {
        addingMember: true,
        addedMember: undefined,
        member: null,
      };
    case ADD_DISCUSSION_MEMBER_SUCCESS:
      return {
        ...state,
        addedMember: true,
        addingMember: false,
        member: action.user,
      };
    case ADD_DISCUSSION_MEMBER_ERROR:
      return {
        addedMember: undefined,
        addingMember: false,
      };
    case CHANGE_OWNER_REQUEST:
      return {
        ...state,
        changingOwner: true,
        ownerChanged: undefined,
      };
    case CHANGE_OWNER_SUCCESS:
      return {
        ...state,
        ownerChanged: true,
        changingOwner: false,
      };
    case CHANGE_OWNER_ERROR:
      return {
        ...state,
        ownerChanged: undefined,
        changingOwner: false,
      };
    case UPDATE_CHANGE_OWNER_STATUS:
      return {
        ...state,
        ownerChanged: undefined,
        changingOwner: false,
      };
      case REMOVE_DISCUSSION_MEMBER: {
        return { ...state, removingMember: true, removeMemberError: null };
      }
      case REMOVE_DISCUSSION_MEMBER_SUCCESS: {
        return {
          ...state,
          removingMember: false,
          removedMember: true,
          removeMemberError: action.payload?.length ? action.payload : null,
        };
      }
      case REMOVE_DISCUSSION_MEMBER_ERROR: {
        return {
          ...state,
          removingMember: false,
          removedMember: false,
          failedToRemoveMember: true,
          errorMessage: "Failed to remove channel member",
        };
      }
      case REMOVE_DISCUSSION_MEMBER_RESET: {
        return {
          ...state,
          removingMember: false,
          removedMember: false,
          failedToRemoveMember: false,
          errorMessage: null,
          removeMemberError: null,
        };
      }
    default:
      return state;
  }
};
export default AdminDiscussionReducer;
