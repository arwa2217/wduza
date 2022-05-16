import ChannelService from "../../services/channel-service";
import ChannelConstants from "../../constants/channel/channel-constants";

function addChannelMember(channelId, channel, isAdmin) {
  return (dispatch) => {
    dispatch(request(channelId));
    ChannelService.addChannelMember(channelId, channel, isAdmin).then(
      (user) => {
        dispatch(success(channelId, user));
      },
      (error) => {
        dispatch(failure(channelId, error));
      }
    );
  };
  function request(channelId) {
    return { type: ChannelConstants.REQUEST_ADD_CHANNEL_MEMBER, channelId };
  }
  function success(channelId, user) {
    return {
      type: ChannelConstants.SUCCESS_ADD_CHANNEL_MEMBER,
      channelId,
      user,
    };
  }
  function failure(channelId, error) {
    return {
      type: ChannelConstants.FAILURE_ADD_CHANNEL_MEMBER,
      channelId,
      error,
    };
  }
}

function getChannelMembers(channelId) {
  return (dispatch) => {
    dispatch(request(channelId));

    ChannelService.getChannelMembers(channelId).then(
      (members) => dispatch(success(members)),
      (error) => {
        dispatch(failure(channelId, error));
      }
    );
  };
  function request(channelId) {
    return { type: ChannelConstants.REQUEST_GET_CHANNEL_MEMBERS, channelId };
  }
  function success(members) {
    return { type: ChannelConstants.SUCCESS_GET_CHANNEL_MEMBERS, members };
  }
  function failure(channelId, error) {
    return {
      type: ChannelConstants.FAILURE_GET_CHANNEL_MEMBERS,
      channelId,
      error,
    };
  }
}

function resetAddChannelMember() {
  return {
    type: ChannelConstants.RESET_ADD_CHANNEL_MEMBER,
  };
}

const ChannelMemberActions = {
  addChannelMember,
  getChannelMembers,
  resetAddChannelMember,
};

export default ChannelMemberActions;
