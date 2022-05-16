import ChannelConstants from "../../constants/channel/channel-constants";

const initialState = {
  addingMember: false,
  addedMember: false,
  user: null,
  error: null,
};

function ChannelMemberReducer(state = initialState, action) {
  switch (action.type) {
    case ChannelConstants.REQUEST_ADD_CHANNEL_MEMBER:
      return {
        addingMember: true,
        addedMember: undefined,
        addMemberApiError: null,
        user: null,
      };
    case ChannelConstants.SUCCESS_ADD_CHANNEL_MEMBER:
      return {
        ...state,
        addedMember: true,
        addingMember: false,
        user: action.user,
      };
    case ChannelConstants.FAILURE_ADD_CHANNEL_MEMBER:
      return {
        addMemberApiError: action.error,
      };
    case ChannelConstants.RESET_ADD_CHANNEL_MEMBER:
      return {
        addingMember: undefined,
        addedMember: undefined,
        user: null,
        addMemberApiError: null,
      };
    default:
      return state;
  }
}

export default ChannelMemberReducer;
