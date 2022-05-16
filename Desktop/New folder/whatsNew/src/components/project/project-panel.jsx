import React, { useEffect, useState } from "react";
import "./project-panel.css";
import ProjectTopBar from "./project-topbar";
import DiscussionList from "./discussion-list";

function ProjectPanel(props) {
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return function cleanup() {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleResize = () => {
    return {
      borderLeft: "0.5px solid #cccccc",
      borderRight: "0.5px solid #cccccc",
    };
  };
  return (
    <div className="project-panel" style={handleResize()}>
      {/*<ProjectTopBar />*/}
      <DiscussionList ref={props.discussionListRef} />
    </div>
  );
}

export default ProjectPanel;
