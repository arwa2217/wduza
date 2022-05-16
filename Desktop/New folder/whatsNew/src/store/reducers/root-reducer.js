import { combineReducers } from "redux";

import AuthReducer from "./auth-reducer";
import SignupReducer from "./signup-reducer.js";
import UserReducer from "./users-reducer";
import ModalReducer from "./modal-reducer";
import ConfigReducers from "./configReducer";
import ChannelReducer from "./channel-reducer";
import ChannelMemberReducer from "./channel-member-reducer";
import ChannelMessagesReducer from "./channelMessagesReducers";
import ActionRequiredReducer from "./action-required-reducer";
import AttachmentReducer from "./file-attachment-reducer";
import notificationReducer from "./notification-reducer";
import tagReducer from "./tag-reducer";
import userTypingReducer from "./user-typing-reducer";
import fileReducer from "./files-reducer";
import esignatureReducer from "./esignature-reducer";
import folderReducer from "./folder-reducer";
import mySaveReducer from "./my-saves-reducer";
import hidePostReducer from "./hide-post-reducer";
import userHomeReducer from "./user-home-reducer";

import { PostReplyReducer } from "./postReplyReducer";
import editPostReducer from "./edit-post-reducer";
import PostReactionReducer from "./post-reaction-reducer";
import { ChannelDetailsReducer, ChannelMembers } from "./channelDetailReducers";
import AdminAccountReducer from "./admin-account-reducer";
import AdminDiscussionReducer from "./admin-discussion-reducer";
import ToastReducer from "./toast-reducer";
import DeletionUnderProcessReducer from "./deletion-under-process-reducer";
import ArchivalUnderProcessReducer from "./archival-under-process-reducer";
import userMentionReducer from "./user-mention-reducer";
import websocketReducer from "./websocket-reducer";
import tasksReducer from "./tasks-reducer.js";
import postForwardReducer from "./post-forward-reducer";
import memberDetailsReducer from "./member-details-reducer";
import MailSummaryReducer from "./mail-summary-reducer";

import OutlookMailReducer from "./outlook-mail-reducers";

import mainFilesReducer from "./main-files-reducer";
import CollectionReducer from "./collection-reducer";
/*
 *Updates and combine all system states/variables
 */
const rootReducer = combineReducers({
  AuthReducer,
  SignupReducer,
  UserReducer,
  ModalReducer,
  config: ConfigReducers,
  ChannelReducer,
  notificationReducer,
  userTypingReducer,
  fileReducer,
  esignatureReducer,
  mySaveReducer,
  hidePostReducer,
  tagReducer,
  ChannelMemberReducer,
  channelDetails: ChannelDetailsReducer,
  channelMembers: ChannelMembers,
  channelMessages: ChannelMessagesReducer,
  ActionRequiredReducer: ActionRequiredReducer,
  AttachmentReducer: AttachmentReducer,
  postReplies: PostReplyReducer,
  editPostReducer,
  PostReactionReducer,
  AdminAccountReducer,
  AdminDiscussionReducer,
  ToastReducer,
  DeletionUnderProcess: DeletionUnderProcessReducer,
  ArchivalUnderProcess: ArchivalUnderProcessReducer,
  userMentionReducer,
  websocketReducer: websocketReducer,
  userHome: userHomeReducer,
  tasksReducer,
  postForwardReducer,
  memberDetailsReducer,
  OutlookMailReducer,
  CollectionReducer,
  MailSummaryReducer: MailSummaryReducer,
  mainFilesReducer,
  folderReducer,
});

export default rootReducer;
