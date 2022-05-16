import {
  FETCH_CHANNEL_DETAILS,
  FETCH_CHANNEL_DETAILS_SUCCESS,
  UPDATE_CHANNEL_LAST_POST,
  FETCH_CHANNEL_DETAILS_ERROR,
  GET_CHANNEL_MEMBERS,
  GET_CHANNEL_MEMBERS_SUCCESS,
  GET_CHANNEL_MEMBERS_ERROR,
  REMOVE_CHANNEL_MEMBER,
  REMOVE_CHANNEL_MEMBER_SUCCESS,
  REMOVE_CHANNEL_MEMBER_ERROR,
  REMOVE_CHANNEL_MEMBER_RESET,
  FETCH_CHANNEL_MEMBERS_SUCCESS,
  UPDATE_CHANNEL_NOTIFICATION_FILTER,
} from "../actionTypes/channelActionTypes";

const ChannelDetailsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_CHANNEL_DETAILS: {
      return { ...state, loading: true };
    }
    case FETCH_CHANNEL_DETAILS_SUCCESS: {
      return { ...action.payload.data[0], loading: false };
    }
    case UPDATE_CHANNEL_LAST_POST: {
      return {
        ...state,
        LastPost:
          action.payload.data.length > 0
            ? action.payload.data[0]
            : state.LastPost,
        loading: false,
      };
    }
    case FETCH_CHANNEL_DETAILS_ERROR: {
      return {
        ...state,
        loading: false,
        errorMessage: "Failed to fetch channel details",
      };
    }
    case UPDATE_CHANNEL_NOTIFICATION_FILTER: {
      let notificationFilter = state.notificationFilter;
      if (action.payload.channel.id === state.id) {
        notificationFilter = action.payload.notificationFilter;
      }
      return { ...state, notificationFilter: notificationFilter };
    }
    default: {
      return state;
    }
  }
};

const initialState = {
  removingMember: false,
  removedMember: false,
  failedToRemoveMember: false,
  removeMemberError: null,
};

const ChannelMembers = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHANNEL_MEMBERS: {
      return { ...state, loading: true };
    }
    case FETCH_CHANNEL_MEMBERS_SUCCESS: {
      return { ...state, members: action.payload.data, loading: false };
    }
    case GET_CHANNEL_MEMBERS_SUCCESS: {
      return { ...state, members: action.data, loading: false };
    }
    case GET_CHANNEL_MEMBERS_ERROR: {
      return {
        ...state,
        loading: false,
        errorMessage: "Failed to fetch channel members",
      };
    }

    case REMOVE_CHANNEL_MEMBER: {
      return { ...state, removingMember: true, removeMemberError: null };
    }
    case REMOVE_CHANNEL_MEMBER_SUCCESS: {
      return {
        ...state,
        removingMember: false,
        removedMember: true,
        removeMemberError: action.payload?.length ? action.payload : null,
      };
    }
    case REMOVE_CHANNEL_MEMBER_ERROR: {
      return {
        ...state,
        removingMember: false,
        removedMember: false,
        failedToRemoveMember: true,
        errorMessage: "Failed to remove channel member",
      };
    }
    case REMOVE_CHANNEL_MEMBER_RESET: {
      return {
        ...state,
        removingMember: false,
        removedMember: false,
        failedToRemoveMember: false,
        errorMessage: null,
        removeMemberError: null,
      };
    }
    default: {
      return state;
    }
  }
};

export { ChannelMembers, ChannelDetailsReducer };
