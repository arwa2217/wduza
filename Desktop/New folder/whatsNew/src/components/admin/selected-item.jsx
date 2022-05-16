import React from "react";

// Import Account Management Routes
import UserInformation from "./account-management/user-information";
import LoginHistory from "./account-management/login-history";
import Discussion from "./account-management/discussion";
import FileFolder from "./account-management/file-folder";
import SelectedAccountsList from "./account-management/selected-accounts-list";

// Import Discussion Management Routes
import SelectedDiscussionList from "./discussion-management/selected-discussion-list";
import DiscussionInformation from "./discussion-management/discussion-information";
import DiscussionHistory from "./discussion-management/discussion-history";
import DiscussionMembers from "./discussion-management/members";

import Files from "./discussion-management/file";

function SelectedItem(props) {
  const Active = () => {
    let Active;
    switch (props.item.key) {
      case "selectedList":
        Active = <SelectedAccountsList item={props.item} />;
        break;
      case "userInformation":
        Active = <UserInformation item={props.item} />;
        break;
      case "loginHistory":
        Active = <LoginHistory item={props.item} />;
        break;
      case "discussion":
        Active = <Discussion item={props.item} />;
        break;
      case "fileFolder":
        Active = <FileFolder item={props.item} />;
        break;
      case "selectedListDiscussion":
        Active = <SelectedDiscussionList item={props.item} />;
        break;
      case "discussionInformation":
        Active = <DiscussionInformation item={props.item} />;
        break;
      case "discussionMembers":
        Active = <DiscussionMembers item={props.item} />;
        break;
      case "discussionHistory":
        Active = <DiscussionHistory item={props.item} />;
        break;
      case "discussionFile":
        Active = <Files item={props.item} />;
        break;
      default:
        break;
    }
    return Active;
  };

  return <Active {...props} />;
}

export default SelectedItem;
