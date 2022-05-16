import React from "react";
import styled from "styled-components";

import { useDispatch } from "react-redux";
import FileList from "./fileList/fileList";

export const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-right: 10px;
`;

let currentChannelId;
const ActivePanel = ({ panelName, onToggleChannelDetails, channel }) => {
  const dispatch = useDispatch();
  let ActivePanel = <FileList />;
  switch (panelName) {
    // case "FILES_POPULAR":
    //   ActivePanel = <WelcomePage />;
    //   break;
    // case "FILES_RECENT":
    //   ActivePanel = <AdminAccountPage />;
    //   break;
    default:
      ActivePanel = <FileList />;
      break;
  }
  return ActivePanel;
};

export default (props) => (
  <PanelWrapper>
    <ActivePanel {...props} />
  </PanelWrapper>
);
