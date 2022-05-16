import React from "react";
import { HeaderContent, Icon, Button, List, Label } from "semantic-ui-react";

const ActionPanelListItem = ({ action, active, setActivePanel }) => (
  <>
    <List.Item
      className={`actionButton ${active}`}
      onClick={() => setActivePanel(action.component)}
    >
      
      <span className="customColor textStyle">
        <Icon floated="left" corner="top left" name="circle" size="small" />
        {action.text}
      </span>

      <Label
        hidden={action.notifications > 0 ? false : true}
        className="actionIcon"
        size="tiny"
        color="red"
      >
        {action.notifications}
      </Label>
    </List.Item>
  </>
);

export default ActionPanelListItem;
