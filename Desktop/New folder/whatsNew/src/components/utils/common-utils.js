import { CommonConstants } from "../../constants/CommonConstants";
import { store } from "../../store/store";
import {
  setActiveMenuItem,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import {
  RedirectMessagesActions,
  RedirectChildMessagesActions,
} from "../../store/actions/channelMessagesAction";
import { setRedirectPostIconVisibility } from "../../store/actions/config-actions";
import Panel from "../actionpanel/panel";
import { MENU_ITEMS } from "../../constants/menu-items";
import { emailRegex } from "../../utilities/utils";

function isMobile() {
  return window.innerWidth <= CommonConstants.MOBILE_SCREEN_WIDTH;
}

function isValidEmail(email) {
  return emailRegex.test(email);
}

function removeElement(array, elem) {
  var index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  }
}
function getChannelByName(channelName) {
  let foundChannel;
  const channelList = store.getState().ChannelReducer.channelList;
  if (channelList) {
    channelList.map((channel, index) => {
      if (channel.name === channelName) {
        foundChannel = channel;
      }
      return channel;
    });
  }
  return foundChannel;
}

function performNotificationAction(
  channelName,
  type,
  subtype,
  refChannelID,
  refPostID,
  childPostId,
  dispatch,
  moveToBottomPostFlag = "",
  redirectPostIconVisibility
) {
  let state = store.getState();
  let currentChannel = state.config.activeSelectedChannel;
  let activeMenu = state.config.activeMenuItem;
  if (activeMenu !== MENU_ITEMS.COLLECTIONS) {
    dispatch(setActiveMenuItem(MENU_ITEMS.COLLECTIONS, true));
  }
  let channel = CommonUtils.getChannelById(refChannelID);
  if (channel && type === "channel" && subtype === "invited") {
    if (channel.IsInvitePending) {
      dispatch(
        setSelectedChannelAction(Panel.JOIN_DISCUSSION_AGREEMENT, channel)
      );
      return;
    }
    dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
  } else {
    if (channel) {
      let requestDelayedBy = 10;
      if (!(currentChannel && currentChannel.id === refChannelID)) {
        dispatch(setSelectedChannelAction(Panel.CHANNEL, channel));
        requestDelayedBy = 3500;
        //TODO It's required to initial call when new discussion get selected. We can optimize it in future.
      }
      setTimeout(() => {
        if (
          type !== "channel" ||
          (type === "channel" && subtype === "tagged") ||
          (type === "channel" && subtype === "replied") ||
          (type === "channel" && subtype === "mentionreplied")
        ) {
          if (childPostId) {
            if (currentChannel && currentChannel.id === refChannelID) {
              setTimeout(() => {
                dispatch(
                  RedirectChildMessagesActions(
                    refChannelID,
                    refPostID,
                    childPostId,
                    dispatch
                  )
                );
                dispatch(
                  setRedirectPostIconVisibility(redirectPostIconVisibility)
                );
              }, 2000);
            } else {
              setTimeout(() => {
                dispatch(
                  RedirectChildMessagesActions(
                    refChannelID,
                    refPostID,
                    childPostId,
                    dispatch
                  )
                );
                dispatch(
                  setRedirectPostIconVisibility(redirectPostIconVisibility)
                );
              }, 2000);
            }
          } else {
            if (currentChannel && currentChannel.id === refChannelID) {
              setTimeout(() => {
                dispatch(
                  RedirectMessagesActions(
                    refChannelID,
                    refPostID,
                    dispatch,
                    moveToBottomPostFlag
                  )
                );
                dispatch(
                  setRedirectPostIconVisibility(redirectPostIconVisibility)
                );
              }, 2000);
            } else {
              setTimeout(() => {
                dispatch(
                  RedirectMessagesActions(refChannelID, refPostID, dispatch)
                );
                dispatch(
                  setRedirectPostIconVisibility(redirectPostIconVisibility)
                );
              }, 200);
            }
          }
        }
      }, requestDelayedBy);
    }
  }
}

function extractTextFromHTML(s, space) {
  var span = document.createElement("span");
  span.innerHTML = s;
  if (space) {
    var children = span.querySelectorAll("*");
    for (var i = 0; i < children.length; i++) {
      if (children[i].textContent) children[i].textContent += " ";
      else children[i].innerText += " ";
    }
  }
  return [span.textContent || span.innerText].toString().replace(/ +/g, " ");
}

const setPageTitle = (notifCount, companyName) => {
  if (notifCount !== "undefined" || notifCount !== undefined) {
    if (notifCount <= 0) {
      document.title = "Monoly - " + companyName;
    } else if (notifCount > 0 && notifCount < 100) {
      document.title = "(" + notifCount + ") Monoly - " + companyName;
    } else {
      document.title = "(99+) Monoly - " + companyName;
    }
  }
};

function getChannelById(channelId) {
  let foundChannel;
  const channelList = store.getState().ChannelReducer.channelList;
  if (channelList) {
    channelList.map((channel, index) => {
      if (channel.id === channelId) {
        foundChannel = channel;
      }
      return channel;
    });
  }
  return foundChannel;
}

const isEqualsJson = (obj1, obj2) => {
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);

  //return true when the two json has same length and all the properties
  //have same value key by key
  return (
    keys1.length === keys2.length &&
    Object.keys(obj1).every((key) => obj1[key] === obj2[key])
  );
};

const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

const getFilteredMembers = (membersList, channelId) => {
  let filteredMembers = [];
  if (channelId) {
    membersList.map((member) => {
      if (member.channel_id?.includes(channelId)) {
        filteredMembers.push(member);
      }
      return member;
    });
    return filteredMembers;
  } else {
    return membersList;
  }
};

const getUserData = (userData) => {
  return {
    id: userData.userId,
    uid: userData.uid ? userData.uid : "",
    cid: userData.cid ? userData.cid : "",
    email: userData.email ? userData.email : "",
    screenName: userData.screenName ? userData.screenName : "",
    activationStatus: userData.activationStatus
      ? userData.activationStatus
      : "",
    address: userData.address ? userData.address : "",
    city: userData.city ? userData.city : "",
    country: userData.country ? userData.country : "",
    officeNumber: userData.officeNumber ? userData.officeNumber : "",
    deskExtension: userData.deskExtension ? userData.deskExtension : "",
    phoneNumber: userData.phoneNumber ? userData.phoneNumber : "",
    timezone: userData.timezone ? userData.timezone : "",
    firstName: userData.firstName ? userData.firstName : "",
    lastName: userData.lastName ? userData.lastName : "",
    jobTitle: userData.jobTitle ? userData.jobTitle : "",
    department: userData.department ? userData.department : "",
    companyName: userData.companyName ? userData.companyName : "",
    userImg: userData.userImg ? userData.userImg : "",
    onlineStatus: userData.onlineStatus ? userData.onlineStatus : "",
    userType: userData.userType ? userData.userType : "",
    affiliation: userData.affiliation ? userData.affiliation : "",
    notificationFilter: userData.notificationFilter
      ? userData.notificationFilter
      : 0,
    notifyByEmail: userData.notifyByEmail ? userData.notifyByEmail : false,
    memberStatus: userData.memberStatus ? userData.memberStatus : "",
    isOwner: userData.isOwner ? userData.isOwner : false,
    timeAdded: userData.timeAdded ? userData.timeAdded : 0,
  };
};

const getRecentUser = (users) =>
  users.sort(function (a, b) {
    return a.timestamp < b.timestamp ? 1 : a.timestamp > b.timestamp ? -1 : 0;
  })[0];

const CommonUtils = {
  isMobile,
  isValidEmail,
  removeElement,
  getChannelByName,
  performNotificationAction,
  extractTextFromHTML,
  setPageTitle,
  getChannelById,
  isEqualsJson,
  arraysEqual,
  objectsEqual,
  getFilteredMembers,
  getUserData,
  getRecentUser,
};

export default CommonUtils;
