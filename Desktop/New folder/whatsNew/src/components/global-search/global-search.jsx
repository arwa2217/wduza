import React, { useState } from "react";
import { Col } from "react-bootstrap";
import GlobalSearchContent from "./global-search-content";
import GlobalSearchTopbar from "./global-search-topbar";
import ProjectTopbar from "../project/project-topbar";

const GlobalHome = (props) => {
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
          <GlobalSearchTopbar isActive={isActive} setIsActive={setIsActive} />
        </div>
        <GlobalSearchContent isActive={isActive} />
      </Col>
    </>
  );
};

export default GlobalHome;
