import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetFilesListAction } from "../../../store/actions/main-files-actions";
import { updateFilePanelState } from "../../../store/actions/config-actions";
import { ClearFileSearchResultAction } from "../../../store/actions/folderAction";
import { filesConstants } from "../../../constants/files";
import "./filesPanel.css";
import ActivePanel from "./activePanel";
import FilesTopBar from "./filesTopBar";

function FilesPanel(props) {
  const dispatch = useDispatch();
  const filePanelActive = useSelector((state) => state.config.filePanelActive);
  useEffect(() => {
    dispatch(ClearFileSearchResultAction());
    dispatch(
      GetFilesListAction(
        {
          count: filesConstants.ITEM_COUNT,
          order: filesConstants.ORDER_BY,
          sort: filesConstants.SORT_BY,
          file: filesConstants.ALL,
          offset: filesConstants.OFFSET,
          fileType: filesConstants.ALL,
        },
        true
      )
    );
  }, []);

  const toggleChannelDetails = () => {
    dispatch(updateFilePanelState(!filePanelActive));
  };

  return (
    <div className="files-panel">
      <FilesTopBar  onToggleChannelDetails={toggleChannelDetails}/>
      <ActivePanel />
    </div>
  );
}

export default FilesPanel;
