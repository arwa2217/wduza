import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";
import { setActiveFileMenuItem } from "../../store/actions/config-actions";
import { GetFilesListAction } from "../../store/actions/main-files-actions";
import { ClearFileSearchResultAction } from "../../store/actions/folderAction";
import { filesConstants } from "../../constants/files";
import "./filesPanel.css";
import FilesTopBar from "./filesTopBar";
import FolderList from "./folderList";

function FilesPanel(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ClearFileSearchResultAction());
    dispatch(
      setActiveFileMenuItem({
        folderName: "All files",
        fileKey: FILES_MENU_ITEMS.FILES_ALL,
      })
    );
    dispatch(
      GetFilesListAction({
        count: filesConstants.ITEM_COUNT,
        order: filesConstants.ORDER_BY,
        sort: filesConstants.SORT_BY,
        file: filesConstants.ALL,
        offset: filesConstants.OFFSET,
        fileType: filesConstants.ALL,
      })
    );
  }, []);

  return (
    <div className="files-panel">
      <FilesTopBar />
      <FolderList />
    </div>
  );
}

export default FilesPanel;
