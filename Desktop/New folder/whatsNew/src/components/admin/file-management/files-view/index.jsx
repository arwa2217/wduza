import React from "react";
import { Col } from "react-bootstrap";
import "../../../mainframe/mainframe.css";
import { useDispatch, useSelector } from "react-redux";
import FilesPanel from "../filesPanel";

function FilesView(props) {
  const dispatch = useDispatch();
  return (
    <>
      <div
        onMouseDown={(e) => {
          if (!props.isProjectListEnabled) {
            props.setIsProjectListEnabled(true);
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
        <FilesPanel />
      </Col>
      {/* <div
        onMouseDown={(e) => {
          if (!props.isDiscussionListEnabled) {
            props.setIsDiscussionListEnabled(true);
          }
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div> */}
    </>
  );
}

export default FilesView;
