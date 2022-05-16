import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import ProjectPanel from "../project/project-panel";
import BeingDeletedModal from "../modal/being-deleted-modal";
import ActivePanel from "../actionpanel/activePanel";
import "../mainframe/mainframe.css";
import { useSelector } from "react-redux";

function ProjectItemView(props) {
  const activeActionPanel = useSelector(
    (state) => state.config.activeActionPanel
  );
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  useEffect(() => {}, [props]);
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
      <Col id="middle-project" className="project-bar pl-0 pr-0">
        <ProjectPanel {...props} />
      </Col>
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
        {/* <ModalRoot /> */}
      </Col>
    </>
  );
}

export default ProjectItemView;
