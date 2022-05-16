import React, { useState } from "react";
import { Col } from "react-bootstrap";
import ProjectTopbar from "../project/project-topbar";
import UserHomeContent from "./user-home-content";
import UserHomeTopBar from "./user-home-top-bar.jsx";
import "./user-home.css";

const UserHome = (props) => {
  const [isActive, setIsActive] = useState(false);
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
        id="middle-project"
        className="noScroll  main-post-area frameContent p-0"
      >
        <div className="home-header">
          <ProjectTopbar />
          <UserHomeTopBar isActive={isActive} setIsActive={setIsActive} />
        </div>
        <UserHomeContent isActive={isActive} />
      </Col>
    </>
  );
};

export default UserHome;
