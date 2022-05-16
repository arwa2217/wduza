import React from "react";
import styled from "styled-components";
import FilesDetails from "../fileDetails/fileDetails";

export const PanelWrapper = styled.div`
  display: flex;
  width: 100%;
  padding-right: 10px;
`;

const ActivePanel = ({ panelName, onToggleChannelDetails, channel }) => {
  let ActivePanel = <FilesDetails />;
  switch (panelName) {
    default:
      ActivePanel = <FilesDetails />;
      break;
  }
  return ActivePanel;
};

export default (props) => (
  <PanelWrapper>
    <ActivePanel {...props} />
  </PanelWrapper>
);
