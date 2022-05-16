import React from "react";
import { Col } from "react-bootstrap";

function AdminSettingsPage(props) {
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
        Middle Setting
      </Col>
      <div
        onMouseDown={(e) => {
          if (!props.isDiscussionListEnabled) {
            props.setIsDiscussionListEnabled(true);
          }
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col
        id="right-messagetab"
        className="noScroll main-post-area frameContent p-0 main-file-area"
      >
        Setting Page
      </Col>
    </>
  );
}
export default AdminSettingsPage;
