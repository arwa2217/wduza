import React from "react";
import "./channel-details.css";

import Filter from "./activity-component/filter";
import Notifications from "./activity-component/notifications";
import features from "features";

function Activity(props) {
  return (
    <div className="row w-100 ml-0 border-top">
      {!features.disable_discussion_notification && <Filter props={props} />}
      <Notifications props={props} />
    </div>
  );
}

export default Activity;
