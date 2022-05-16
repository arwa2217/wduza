import React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import Account from "./account/account";

export const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-right: 10px;
`;

const ActivePanel = ({ panelName, onToggleChannelDetails, channel }) => {
  let ActivePanel = <Account />;
  switch (panelName) {
    // case "FILES_POPULAR":
    //   ActivePanel = <WelcomePage />;
    //   break;
    // case "FILES_RECENT":
    //   ActivePanel = <AdminAccountPage />;
    //   break;
    default:
      ActivePanel = <Account />;
      break;
  }
  return ActivePanel;
};

export default (props) => (
  <PanelWrapper>
    <ActivePanel {...props} />
  </PanelWrapper>
);
