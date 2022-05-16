import ChannelConstants from "../../constants/channel/channel-constants";
import {
  FETCH_USER_TYPE,
  FETCH_POST_SEARCH_LIST_SUCCESS,
  FETCH_POST_SEARCH_DETAILS_REQUEST,
  FETCH_POST_SEARCH_DETAILS_SUCCESS,
  FETCH_POST_SEARCH_DETAILS_ERROR,
  FETCH_POST_SEARCH_DETAILS_CLEAR,
  FETCH_USER_TYPE_ERROR,
  POST_SEARCH,
  FETCH_USER_TYPE_SUCCESS,
  FETCH_CHANNEL_DETAILS,
  FETCH_CHANNEL_DETAILS_SUCCESS,
  FETCH_CHANNEL_DETAILS_ERROR,
  CREATE_CHANNEL_REQUEST,
  CREATE_CHANNEL_SUCCESS,
  CREATE_CHANNEL_ERROR,
  CREATE_CHANNEL_RESET,
  FETCH_CHANNEL_LIST_REQUEST,
  FETCH_CHANNEL_LIST_SUCCESS,
  FETCH_CHANNEL_LIST_ERROR,
  UPDATE_CHANNEL_POST_READ_AT,
  UPDATE_CHANNEL_MESSAGE_COUNT,
  LEAVE_CHANNEL,
  LEAVE_CHANNEL_SUCCESS,
  LEAVE_CHANNEL_ERROR,
  RENAME_CHANNEL,
  RENAME_CHANNEL_SUCCESS,
  RENAME_CHANNEL_ERROR,
  DELETE_CHANNEL,
  DELETE_CHANNEL_SUCCESS,
  DELETE_CHANNEL_ERROR,
  RESET_CONTROL_FLAGS,
  INITIATED_DISCUSSION_DELETE,
  COMPLETED_DISCUSSION_DELETE,
  INITIATED_DISCUSSION_ARCHIVE,
  COMPLETED_DISCUSSION_ARCHIVE,
  ARCHIVE_CHANNEL,
  ARCHIVE_CHANNEL_SUCCESS,
  ARCHIVE_CHANNEL_ERROR,
  DELETION_STATUS,
  DELETION_STATUS_SUCCESS,
  DELETION_STATUS_ERROR,
  RESET_NEW_CHANNEL,
  UPDATE_CHANNEL_LAST_POST,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE_SUCCESS,
  DISCUSSION_NOTIFICATION_FILTER_UPDATE_FAILURE,
  UPDATE_LAST_SEARCH_QUERY,
  UPDATE_CHANNEL_CREATOR,
  UPDATE_CHANNEL_MESSAGES_DATA,
  UPDATE_DISCUSSION_LAST_READ_POST_ID,
  UPDATE_CHANNEL_LIST_LAST_POST,
  RESET_NEW_UNREAD_MESSAGE_COUNT,
  RESET_USER_TYPE,
} from "../actionTypes/channelActionTypes";

const initialState = {
  creatingChannel: false,
  createdChannel: false,
  createChannelApiError: null,
  newChannel: null,
  channelList: [],
  updatedChannel: null,
  leavingDiscussion: false,
  renamingDiscussion: false,
  deletingDiscussion: false,
  archivingDiscussion: false,
  deletingDiscussionStatus: false,
  deletingDiscussionList: [],
  archivingDiscussionStatus: false,
  archivingDiscussionList: [],
  deletionOrganizationList: [],
  deletionOrganizationStatus: undefined,
  fetchResult: false,
  fetchedOffset: 0,
  getSearchPostDetails: [],
  currentSearchFilter: {},
  updatedData: 0,
  // newUnreadMessageCount: 0
};

const updateListIfChannelNotExist = (channelList, newChannel) => {
  if (channelList) {
    let channelAlreadyExist = false;
    let matchIndex = -1;

    var index;
    for (index = 0; index < channelList.length; index++) {
      var channel = channelList[index];
      if (channel?.id === newChannel?.id) {
        matchIndex = index;
        channelAlreadyExist = true;
        break;
      }
    }

    if (channelAlreadyExist) {
      newChannel.newUnreadMessageCount =
        channelList[matchIndex].newUnreadMessageCount !== undefined
          ? channelList[matchIndex].newUnreadMessageCount
          : newChannel.newUnreadMessageCount;
      channelList[matchIndex] = newChannel;
    } else {
      channelList.push(newChannel);
    }
  }
};

const addOrgNameWithChannel = (channelData) => {
  const lookup = channelData.reduce((a, e) => {
    a[e.name] = ++a[e.name] || 0;
    return a;
  }, {});
  let array = channelData.filter((e) => lookup[e.name]);
  array.forEach((item) => {
    if (item.type === "EXTERNAL") {
      item.name = item.name + "(" + item.companyName + ")";
    }
  });
};

const replaceChannelList = (newChannelList, stateChannelList) => {
  if (newChannelList instanceof Array) {
    stateChannelList.splice(0, stateChannelList.length);

    newChannelList.forEach((newChannel) => {
      newChannel.newUnreadMessageCount = newChannel.newMessageCount;
      updateListIfChannelNotExist(stateChannelList, newChannel);
    });
  }
  addOrgNameWithChannel(stateChannelList);
};

const updateChannelList = (newChannelList, stateChannelList) => {
  if (newChannelList instanceof Array) {
    newChannelList.forEach((newChannel) => {
      updateListIfChannelNotExist(stateChannelList, newChannel);
    });
  } else if (newChannelList) {
    let newChannel = newChannelList;
    newChannel.newUnreadMessageCount = newChannel.newMessageCount;
    updateListIfChannelNotExist(stateChannelList, newChannel);
  }
  addOrgNameWithChannel(stateChannelList);
  return newChannelList;
};

const ChannelReducer = (state = initialState, action) => {
  let stateChannelList = state.channelList ? state.channelList.slice() : [];
  switch (action.type) {
    case CREATE_CHANNEL_REQUEST:
      return {
        ...state,
        creatingChannel: true,
        failedToCreateChannel: false,
        createdChannel: false,
        newChannel: null,
      };
    case CREATE_CHANNEL_SUCCESS:
      return {
        ...state,
        creatingChannel: false,
        createdChannel: true,
        failedToCreateChannel: false,
        newChannel: updateChannelList(action.payload.data, stateChannelList),
        channelList: stateChannelList,
      };
    case CREATE_CHANNEL_ERROR:
      return {
        ...state,
        creatingChannel: false,
        createdChannel: false,
        failedToCreateChannel: true,
        newChannel: null,
        createChannelApiError: action.payload,
      };

    case CREATE_CHANNEL_RESET:
      return {
        ...state,
        creatingChannel: false,
        createdChannel: false,
        failedToCreateChannel: false,
        newChannel: null,
        createChannelApiError: null,
      };

    case FETCH_CHANNEL_DETAILS:
      return {
        ...state,
        fetchedChannelList: false,
        updatedChannel: null,
      };
    case FETCH_CHANNEL_DETAILS_SUCCESS:
      return {
        ...state,
        fetchedChannelList: true,
        updatedChannel: updateChannelList(
          action.payload.data.length > 0 ? action.payload.data[0] : undefined,
          stateChannelList
        ),
        channelList: stateChannelList,
      };
    case UPDATE_CHANNEL_LAST_POST:
      let updatedChannelIndex = state.channelList.findIndex(
        (channel) =>
          channel.id ===
          (action.payload.data ? action.payload.data[0].channelId : "")
      );
      if (updatedChannelIndex === -1) {
        return { ...state };
      } else {
        let updatedChannel = [];
        updatedChannel = state.channelList[updatedChannelIndex];
        if (updatedChannel) {
          updatedChannel.LastPost = action.payload.data[0];
        }
        return {
          ...state,
          fetchedChannelList: true,
          updatedChannel: updateChannelList(updatedChannel, stateChannelList),
          channelList: state.channelList,
        };
      }
    case FETCH_CHANNEL_DETAILS_ERROR:
      return {
        ...state,
        fetchedChannelList: false,
        updatedChannel: null,
      };
    case FETCH_CHANNEL_LIST_REQUEST:
      return {
        ...state,
        fetchingChannelList: true,
        failedToFetchChannelList: false,
        fetchedChannelList: false,
        channelList: stateChannelList,
      };
    case FETCH_CHANNEL_LIST_SUCCESS:
      replaceChannelList(action.payload.data, stateChannelList);
      return {
        ...state,
        channelList: stateChannelList,
        fetchingChannelList: false,
        fetchedChannelList: true,
      };
    case FETCH_CHANNEL_LIST_ERROR:
      return {
        ...state,
        failedToFetchChannelList: true,
        fetchedChannelList: false,
      };
    case UPDATE_CHANNEL_POST_READ_AT:
      {
        const { channelId, lastPostReadAt, lastReadPostId } = action.payload;
        const channels = stateChannelList;
        for (let i = 0; i < channels.length; i++) {
          const channel = channels[i];
          if (channel.id === channelId) {
            channel.lastPostReadAt = lastPostReadAt;
            channel.lastReadPostId = lastReadPostId;

            return {
              ...state,
              fetchedChannelList: true,
              updatedChannel: updateChannelList(
                action.payload.channel?.length > 0
                  ? action.payload.channel[0]
                  : undefined,
                stateChannelList
              ),
              channelList: stateChannelList,
            };
          } else {
            return { ...state };
          }
        }
      }
      break;
    case ChannelConstants.SET_ACTIVE_CHANNEL: {
      // const { channelId } = action;
      // state.channelList.forEach((channel) => {
      //   if (channel.id === channelId) {
      //     channel.newMessageCount = 0;
      //     // channel.newUnreadMessageCount = 0;
      //   }
      // });
      return {
        ...state,
        channelId: action.channelId,
        channelList: [...state.channelList],
      };
    }
    case FETCH_USER_TYPE:
      return {
        ...state,
        fetchedUserType: false,
        requestedId: action.payload.requestedId,
      };
    case FETCH_USER_TYPE_ERROR:
      return {
        ...state,
        fetchedUserType: false,
      };
    case FETCH_USER_TYPE_SUCCESS:
      if (state.requestedId.toLowerCase() !== action.payload.data[0].email) {
        return { ...state };
      }
      return {
        ...state,
        fetchedUserType: true,
        getUserType: action.payload.data[0],
      };
    case RESET_USER_TYPE:
      return {
        ...state,
        fetchedUserType: false,
        getUserType: {},
      };

    case FETCH_POST_SEARCH_LIST_SUCCESS:
      return {
        ...state,
        fetchedPostSearchResult: true,
        getSearchPostList: action.payload.data,
      };
    case FETCH_POST_SEARCH_DETAILS_CLEAR:
      return {
        ...state,
        fetchingSearchResult: false,
        fetchedSearchResult: false,
        fetchedSearchError: false,
        getSearchPostDetails: [],
        totalCount: "",
        terms: "",
        fetchedOffset: 0,
        currentSearchFilter: {},
      };
    case FETCH_POST_SEARCH_DETAILS_REQUEST:
      return {
        ...state,
        fetchingSearchResult: true,
        fetchedSearchResult: false,
        fetchedSearchError: false,
        getSearchPostDetails:
          action.payload.pageOffset === 0 ? [] : state.getSearchPostDetails,
        totalCount: "",
        terms: "",
      };
    case FETCH_POST_SEARCH_DETAILS_SUCCESS:
      return {
        ...state,
        fetchingSearchResult: false,
        fetchedSearchResult: true,
        fetchedSearchError: false,
        getSearchPostDetails:
          action.payload.data?.result !== null
            ? [...state.getSearchPostDetails, ...action.payload.data?.result]
            : [...state.getSearchPostDetails],
        totalCount: action.payload.data?.count,
        terms: action.payload.data?.term,
        fetchedOffset:
          (action.payload.resetOffset ? 0 : state.fetchedOffset) +
          (action.payload.data?.hidden_count
            ? action.payload.data?.hidden_count
            : 0) +
          (action.payload.data?.result?.length
            ? action.payload.data?.result?.length
            : 0),
      };
    case FETCH_POST_SEARCH_DETAILS_ERROR:
      return {
        ...state,
        fetchingSearchResult: false,
        fetchedSearchResult: true,
        fetchedSearchError: true,
        getSearchPostDetails: [],
        totalCount: "",
        terms: "",
      };
    case POST_SEARCH:
      return {
        ...state,
        searchEventUpdate: Math.random(),
        fetchResult: true,
      };
    case UPDATE_CHANNEL_MESSAGE_COUNT:
      const { channelId, hasNewMessages, unreadPostCount, currentChannelId } =
        action.payload;
      let updatedChannel = state.updatedChannel;
      state.channelList.forEach((channel) => {
        if (channel.id === channelId) {
          channel.unreadPostCount =
            unreadPostCount !== undefined
              ? unreadPostCount
              : channel.unreadPostCount;
          const { newMessageCount } = channel;
          channel.newMessageCount = hasNewMessages
            ? unreadPostCount !== undefined
              ? unreadPostCount
              : newMessageCount !== undefined
              ? newMessageCount + 1
              : 1
            : 0;
          channel.newUnreadMessageCount =
            hasNewMessages && unreadPostCount === undefined
              ? newMessageCount + 1
              : hasNewMessages === false
              ? channel.newMessageCount
              : channel.newUnreadMessageCount;

          if (
            (updatedChannel === null || updatedChannel === undefined) &&
            currentChannelId === channelId
          ) {
            updatedChannel = channel;
          }
          if (updatedChannel?.id === channelId) {
            updatedChannel = channel;
          }
        }
      });
      return {
        ...state,
        updatedChannel: updatedChannel,
        channelList: [...state.channelList],
      };
    case LEAVE_CHANNEL: {
      return { ...state, leavingDiscussion: true };
    }
    case LEAVE_CHANNEL_SUCCESS: {
      return { ...state, leavingDiscussion: false, leaveSuccessful: true };
    }
    case LEAVE_CHANNEL_ERROR: {
      return {
        ...state,
        leavingDiscussion: false,
        leaveSuccessful: false,
        errorCode: action.payload.code,
        errorMessage: action.payload.message,
      };
    }
    case RENAME_CHANNEL: {
      return { ...state, renamingDiscussion: true };
    }
    case RENAME_CHANNEL_SUCCESS: {
      return { ...state, renamingDiscussion: false, renameSuccessful: true };
    }
    case RENAME_CHANNEL_ERROR: {
      return {
        ...state,
        renamingDiscussion: false,
        renameSuccessful: false,
        errorCode: action.payload.code,
        errorMessage: action.payload.message,
      };
    }
    case DELETE_CHANNEL: {
      return { ...state, deletingDiscussion: true };
    }
    case DELETE_CHANNEL_SUCCESS: {
      return { ...state, deletingDiscussion: false, deleteSuccessful: true };
    }
    case DELETE_CHANNEL_ERROR: {
      return {
        ...state,
        deletingDiscussion: false,
        deleteSuccessful: false,
        errorCode: action.payload.code,
        errorMessage: action.payload.message,
      };
    }
    case ARCHIVE_CHANNEL: {
      return { ...state, archivingDiscussion: true };
    }
    case ARCHIVE_CHANNEL_SUCCESS: {
      return { ...state, archivingDiscussion: false, archiveSuccessful: true };
    }
    case ARCHIVE_CHANNEL_ERROR: {
      return {
        ...state,
        archivingDiscussion: false,
        archiveSuccessful: false,
        errorCode: action.payload.code,
        errorMessage: action.payload.message,
      };
    }
    case RESET_CONTROL_FLAGS: {
      return {
        ...state,
        leavingDiscussion: false,
        renamingDiscussion: false,
        deletingDiscussion: false,
        archivingDiscussion: false,
        deleteSuccessful: undefined,
        renameSuccessful: undefined,
        leaveSuccessful: undefined,
        archiveSuccessful: undefined,
      };
    }
    case INITIATED_DISCUSSION_DELETE:
      let updateList = state.deletingDiscussionList;
      if (action?.payload?.channelId) updateList.push(action.payload.channelId);
      return {
        ...state,
        deletingDiscussionStatus: true,
        deletingDiscussionList: updateList,
      };
    case COMPLETED_DISCUSSION_DELETE:
      let underDeletion = [];
      // eslint-disable-next-line no-unused-expressions
      state.deletingDiscussionList?.map((item) => {
        if (item !== action.payload.channelId) {
          underDeletion.push(item);
        }
        return item;
      });
      let stillDeleting = true;
      if (underDeletion.length === 0) stillDeleting = false;
      return {
        ...state,
        deletingDiscussionStatus: stillDeleting,
        deletingDiscussionList: underDeletion,
      };
    case INITIATED_DISCUSSION_ARCHIVE:
      let archivalList = state.archivingDiscussionList;
      if (action?.payload?.channelId)
        archivalList.push(action.payload.channelId);
      return {
        ...state,
        archivingDiscussionStatus: true,
        archivingDiscussionList: archivalList,
      };
    case COMPLETED_DISCUSSION_ARCHIVE:
      let underArchival = [];
      // eslint-disable-next-line no-unused-expressions
      state.archivingDiscussionList?.map((item) => {
        if (item !== action.payload.channelId) {
          underArchival.push(item);
        }
        return item;
      });
      let stillArchiving = true;
      if (underArchival.length === 0) stillArchiving = false;
      return {
        ...state,
        archivingDiscussionStatus: stillArchiving,
        archivingDiscussionList: underArchival,
      };
    case DELETION_STATUS:
      return {
        ...state,
      };
    case DELETION_STATUS_SUCCESS:
      let orgList = action.payload?.data.ent_info;
      return {
        ...state,
        deletionOrganizationList: orgList
          ? orgList
          : initialState.deletionOrganizationList,
        deletionOrganizationStatus: action.payload?.data.status,
      };
    case DELETION_STATUS_ERROR:
      return { ...state };
    case RESET_NEW_CHANNEL:
      return {
        ...state,
        newChannel: null,
      };
    case DISCUSSION_NOTIFICATION_FILTER_UPDATE:
      return {
        ...state,
        updatingFilter: true,
        updatedFilter: undefined,
        updateFailed: false,
      };
    case DISCUSSION_NOTIFICATION_FILTER_UPDATE_SUCCESS: {
      let newChannelList = [];
      // eslint-disable-next-line array-callback-return
      state.channelList.map((channel) => {
        if (channel.id === action.payload.channel.id) {
          channel.notificationFilter = action.payload.notificationFilter;
        }
        newChannelList.push(channel);
      });
      return {
        ...state,
        channelList: newChannelList,
        updatingFilter: false,
        updatedFilter: true,
        updateFailed: false,
      };
    }
    case DISCUSSION_NOTIFICATION_FILTER_UPDATE_FAILURE: {
      return {
        ...state,
        updatingFilter: false,
        updatedFilter: false,
        updateFailed: true,
      };
    }
    case UPDATE_LAST_SEARCH_QUERY: {
      return {
        ...state,
        currentSearchFilter: action.payload,
      };
    }

    case UPDATE_CHANNEL_CREATOR: {
      let tempChannelList = [...state.channelList];
      tempChannelList.map((item) => {
        if (item.creatorId === action.payload.userId) {
          item.creator = action.payload.userName;
        }
        return item;
      });
      return {
        ...state,
        channelList: tempChannelList,
      };
    }
    case UPDATE_CHANNEL_MESSAGES_DATA: {
      return {
        ...state,
        updatedData: action.payload.updatedData,
      };
    }
    case UPDATE_DISCUSSION_LAST_READ_POST_ID: {
      let tempChannelList = [...state.channelList];
      let updatedChannelId = tempChannelList.findIndex(
        (item) => item.id === action.payload.channelId
      );
      if (updatedChannelId !== -1) {
        let updatedChannel = {
          ...tempChannelList[updatedChannelId],
          lastReadPostId: action.payload.postId,
          lastPostReadAt: new Date().getTime(),
          newMessageCount:
            state.newMessageCount - action.payload.messagesReadCount > -1
              ? state.newMessageCount - action.payload.messagesReadCount > -1
              : 0,
          newUnreadMessageCount:
            state.newUnreadMessageCount - action.payload.messagesReadCount > -1
              ? state.newUnreadMessageCount - action.payload.messagesReadCount >
                -1
              : 0,
          unreadPostCount:
            state.unreadPostCount - action.payload.messagesReadCount > -1
              ? state.unreadPostCount - action.payload.messagesReadCount > -1
              : 0,
        };
        tempChannelList[updatedChannelId] = updatedChannel;
      }
      return {
        ...state,
        channelList: tempChannelList,
      };
    }
    case UPDATE_CHANNEL_LIST_LAST_POST: {
      let filteredDiscussion = state.channelList.findIndex(
        (item) => item.id === action.payload.data[0]?.channelId
      );
      let tempList = state.channelList;
      if (filteredDiscussion !== -1) {
        tempList[filteredDiscussion] = {
          ...tempList[filteredDiscussion],
          LastPost:
            action.payload.data.length > 0
              ? action.payload.data[0]
              : state.LastPost,
        };
      }

      return {
        ...state,
        channelList: tempList,
      };
    }
    case RESET_NEW_UNREAD_MESSAGE_COUNT: {
      const { channelId } = action.payload;
      let channelListTemp = JSON.parse(JSON.stringify(state.channelList));
      let updatedChannelTemp = undefined;
      channelListTemp.forEach((channel) => {
        if (channel.id === channelId) {
          channel.newUnreadMessageCount = 0;
          updatedChannelTemp = channel;
        }
      });

      return {
        ...state,
        updatedChannel: updatedChannelTemp
          ? updatedChannelTemp
          : state.updatedChannel,
        channelList: channelListTemp,
      };
    }
    default:
      return state;
  }
};

export default ChannelReducer;
