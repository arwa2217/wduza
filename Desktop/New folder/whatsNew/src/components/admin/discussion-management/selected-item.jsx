import React from "react";

// Import Account Management Routes
import DiscussionInformation from "./discussion-information";
import DiscussionHistory from "./discussion-history";
import File from "./file";

function SelectedItem(props) {
  const Active = () => {
    let Active;
    switch (props.item.key) {
      case "discussionInformation":
        Active = <DiscussionInformation item={props.item} />;
        break;
      // case "members":
      //   Active = <Members item={props.item} />;
      //   break;
      case "discussionHistory":
        Active = <DiscussionHistory item={props.item} />;
        break;
      case "file":
        Active = <File item={props.item} />;
        break;
      default:
        break;
    }
    return Active;
  };

  return <Active {...props} />;
}

export default SelectedItem;
