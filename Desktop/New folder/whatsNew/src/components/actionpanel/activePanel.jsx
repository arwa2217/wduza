import React from "react";
import styled from "styled-components";

import MessagesTab from "../messages/messages-tab";
import ActionRequired from "../useractions/actionrequired";
import Updates from "../useractions/updates/updates";
import MentionAndReaction from "../useractions/mention_reaction/mention_reaction";
import SavedItems from "../useractions/saved_items/saved_items";
import People from "../useractions/people/people";
import Files from "../useractions/files/files";
import { useDispatch } from "react-redux";
import { GetRequiredActions } from "../../store/actions/user-actions";
import {
  channelDetailAction,
  GetChannelMemberAction,
} from "../../store/actions/channelActions";
import WelcomePage from "../welcome/welcome-page";
import WelcomePageEmail from "../welcome-email/welcome-page";
import AdminAccountPage from "../admin/account-management/admin-account";
import AdminSettingsPage from "../admin/admin-settings";
import NewDiscussionPage from "../new-discussion/new-discussion-page";
import JoinDiscussionAgreement from "../new-discussion/join-discussion-agreement";
import Panel from "./panel";
import OutlookMailTab from "../outlook-email/outlook-mail";

export const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
`;

let currentChannelId;
const ActivePanel = ({ panelName, onToggleChannelDetails, channel }) => {
  const dispatch = useDispatch();
  let ActivePanel = <WelcomePage />; // = <MessagesTab onToggleChannelDetails={onToggleChannelDetails} channel={channel}/>
  switch (panelName) {
    case Panel.WELCOME:
      ActivePanel = <WelcomePage />;
      break;
    case Panel.WELCOME_EMAIL:
      ActivePanel = <WelcomePageEmail />;
      break;
    case "ActionRequired":
      ActivePanel = <ActionRequired />;
      dispatch(GetRequiredActions());
      break;
    case Panel.CHANNEL:
      ActivePanel = (
        <MessagesTab
          onToggleChannelDetails={onToggleChannelDetails}
          channel={channel}
        />
      );
      if (!currentChannelId || currentChannelId !== channel.id) {
        dispatch(channelDetailAction(channel.id));
        GetChannelMemberAction(channel.id, dispatch);
      }
      currentChannelId = channel.id;
      break;
    case Panel.OUTLOOK_EMAIL:
      ActivePanel = <OutlookMailTab />;
      break;
    case Panel.NEW_DISCUSSION:
      ActivePanel = <NewDiscussionPage />;
      break;
    case Panel.JOIN_DISCUSSION_AGREEMENT:
      ActivePanel = <JoinDiscussionAgreement channel={channel} />;
      break;
    case "Updates":
      ActivePanel = <Updates />;
      break;
    case "MentionAndReaction":
      ActivePanel = <MentionAndReaction />;
      break;
    case "SavedItems":
      ActivePanel = <SavedItems />;
      break;
    case "People":
      ActivePanel = <People />;
      break;
    case "Files":
      ActivePanel = <Files />;
      break;
    case "AdminAccountPage":
      ActivePanel = <AdminAccountPage />;
      break;
    case "AdminSettingPage":
      ActivePanel = <AdminSettingsPage />;
      break;
    default:
      ActivePanel = <WelcomePage />;
      break;
  }
  return ActivePanel;
};

export default (props) => (
  <PanelWrapper>
    <ActivePanel {...props} />
  </PanelWrapper>
);
