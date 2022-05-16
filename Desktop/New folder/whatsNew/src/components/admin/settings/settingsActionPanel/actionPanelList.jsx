import React, { PureComponent, useEffect } from "react";
import "./actionpanel.css";
import { Grid, GridColumn, GridRow, Header, List } from "semantic-ui-react";
import ActionPanelListItem from "./actionPanelListItem";
import { useDispatch, useSelector } from "react-redux";
import { setActivePanelAction } from "../../store/actions/config-actions";

export const Panels = [
  {
    text: "Actions Required",
    notifications: 0,
    component: "ActionRequired",
  },
  {
    text: "Updates",
    notifications: 1,
    component: "Updates",
  },
  {
    text: "Mentions & Reactions",
    notifications: 0,
    component: "MentionAndReaction",
  },
  {
    text: "Saved Items",
    notifications: 1,
    component: "SavedItems",
  },
  {
    text: "People",
    notifications: 0,
    component: "People",
  },
  {
    text: "Files",
    notifications: 0,
    component: "Files",
  },
];

const ActionPanelList = React.memo(() => {
  const dispatchSetActivePanel = useDispatch();
  const activePanel = useSelector((state) => state.config.activeActionPanel);

  const setActivePanel = (panelName) => {
    dispatchSetActivePanel(setActivePanelAction(panelName));
  };

  const requiredActions = useSelector((state) => state.ActionRequiredReducer.requiredActions);
  Panels[0].notifications = requiredActions.length;

  useEffect(() => {
    Panels[0].notifications = requiredActions.length;
  }, [requiredActions])

  return (
    <Grid className="actionPanelColor">
      <GridColumn className="leftMargin">
        <GridRow className="actionRow">
          <List style={{width:"100%"}} id="actionPanel">
            {Panels.map((action, index) => {
              return (
                <ActionPanelListItem
                  key={action.component}
                  action={action}
                  setActivePanel={setActivePanel}
                  active={action.component === activePanel ? "active" : ""}
                />
              );
            })}
          </List>
        </GridRow>
      </GridColumn>
    </Grid>
  );
});

export default ActionPanelList;
