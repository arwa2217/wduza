import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import "../../../components/mainframe/mainframe.css";
import { useDispatch, useSelector } from "react-redux";
import SettingsPanel from "./settingsPanel";
import { GetAllFolders } from "../../../store/actions/folderAction";
import { SETTINGS_MENU_ITEMS } from "../../../constants/settings-menu-items";
import SettingsActionPanel from "./settingsActionPanel/activePanel";

function Settings(props) {
  const dispatch = useDispatch();
  let activeActionPanel = useSelector(
    (state) => state.config.activeSettingMenuItem
  );
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
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
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col id="middle-project" className="project-bar pl-0 pr-0">
        <SettingsPanel />
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
        style={{ marginTop: "70px" }}
      >
        {/* <SettingsActionPanel panelName={activeActionPanel?.settingKey} /> */}
      </Col>
    </>
  );
}

export default Settings;
