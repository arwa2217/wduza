import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import FilesActionPanel from "../filesActionPanel/activePanel";
import "../../mainframe/mainframe.css";
import { useDispatch } from "react-redux";
import FilesPanel from "../filesPanel";
import { GetAllFolders } from "../../../store/actions/folderAction";

function FilesView(props) {
  const dispatch = useDispatch();
  const activeActionPanel = "FILES_ALL";

  useEffect(() => {
    dispatch(GetAllFolders(dispatch));
  }, []);
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
        <FilesPanel />
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
        className="noScroll main-post-area frameContent p-0 main-file-area"
      >
        <FilesActionPanel
          panelName={activeActionPanel}
          // channel={activeSelectedChannel}
        />
        {/* <ModalRoot /> */}
      </Col>
      {/* <div
				onMouseDown={(e) => {
					if (!props.isDiscussionListEnabled) {
						props.setIsDiscussionListEnabled(true);
					}
					//e.preventDefault();
					return false;
				}}
			>
				<hr className="width-resize-sidebar" />
			</div> */}
    </>
  );
}

export default FilesView;
