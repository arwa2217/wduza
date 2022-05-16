import React from "react";
import { Col } from "react-bootstrap";
import OutlookPanel from "../outlook/outlook-panel";
import ModalRoot from "../modal/modal-root";
import ActivePanel from "../actionpanel/activePanel";
import "../mainframe/mainframe.css";
import { useSelector } from "react-redux";
import BeingDeletedModal from "../modal/being-deleted-modal";
import { useIsAuthenticated } from "@azure/msal-react";

function EmailView(props) {
  const activeActionPanel = useSelector(
    (state) => state.config.activeActionPanel
  );
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const isAuthenticated = useIsAuthenticated();
  return (
    <>
      <div
        onMouseDown={(e) => {
          if (!props.isProjectListEnabled) {
            props.setIsProjectListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      {isAuthenticated ? (
        <Col id="middle-project" className="project-bar outlook-bar pl-0 pr-0">
          <OutlookPanel />
        </Col>
      ) : null}
      <div
        onMouseDown={(e) => {
          if (!props.isDiscussionListEnabled) {
            props.setIsDiscussionListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col
        id="right-messagetab"
        className="noScroll  main-post-area frameContent p-0"
      >
        <BeingDeletedModal channel={activeSelectedChannel} />
        <ActivePanel
          panelName={activeActionPanel}
          channel={activeSelectedChannel}
        />
        <ModalRoot />
      </Col>
    </>
  );
}

export default EmailView;
