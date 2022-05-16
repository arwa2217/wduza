import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import ArrowIcon from "../../../assets/icons/breadcrumb-arrow.svg";
import { FILES_MENU_ITEMS } from "../../../constants/files-menu-items";
import { ClearFileSearchResultAction } from "../../../store/actions/folderAction";
import { GetFilesListAction } from "../../../store/actions/main-files-actions";
import { filesConstants } from "../../../constants/files";
const Parent = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 100%;
`;
const Arrow = styled.img`
  margin-right: 5px;
  margin-left: 5px;
`;
const Child = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 100%;
  color: #19191a;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ active }) =>
    active &&
    `
    cursor: pointer;
  `}
`;
const Count = styled.span`
  font-weight: bold;
  margin-left: 5px;
`;

function FilesBreadcrumbs(props) {
  const dispatch = useDispatch();
  const activeMenu = useSelector((state) => state.config.activeMenuItem);
  const activeFileMenu = useSelector(
    (state) => state.config.activeFileMenuItem
  );

  const filesCount = useSelector((state) => state.mainFilesReducer.filesCount);
  const folderList = useSelector((state) => state.folderReducer.folderList);

  const [activeFolder, setActiveFolder] = useState(activeFileMenu);

  let selectedFolder = useMemo(
    () =>
      folderList?.find(
        (folder) => folder.folderId === activeFileMenu?.folderId
      ),
    [folderList, activeFileMenu]
  );

  useEffect(() => {
    if (activeFileMenu) setActiveFolder(activeFileMenu);
  }, [activeFileMenu]);

  useEffect(() => {
    if (selectedFolder) setActiveFolder(selectedFolder);
  }, [selectedFolder]);

  let activeParentMenu = "";
  switch (activeMenu) {
    case "FILES":
      activeParentMenu = "Files";
      break;
    default:
      activeParentMenu = "Files";
      break;
  }

  const handleFolderClick = () => {
    dispatch(ClearFileSearchResultAction());
    let folderId = activeFolder.folderId;
    let fileKey = activeFolder.fileKey;
    let folderObj = {
      count: filesConstants.ITEM_COUNT,
      order: filesConstants.ORDER_BY,
      sort: filesConstants.SORT_BY,
      folder: folderId,
      offset: 0,
    };
    if (!folderId) delete folderObj.folder;
    if (fileKey === FILES_MENU_ITEMS.FILES_POPULAR) folderObj.popular = true;
    else if (fileKey === FILES_MENU_ITEMS.FILES_RECENT) {
      delete folderObj.sort;
      folderObj.recent = true;
    }
    dispatch(GetFilesListAction(folderObj));
  };

  return (
    <div className="d-flex flex-row w-100" style={{ marginTop: "15px" }}>
      <Parent>{activeParentMenu}</Parent>
      <Arrow src={ArrowIcon} />
      <Child
        active={props.searchFileEnabled}
        onClick={(e) => (props.searchFileEnabled ? handleFolderClick(e) : null)}
      >
        {activeFolder?.folderName}
        {activeFolder &&
          (activeFolder.fileKey === FILES_MENU_ITEMS.FILES_POPULAR ||
            activeFolder.fileKey === FILES_MENU_ITEMS.FILES_RECENT ||
            activeFolder.fileKey === FILES_MENU_ITEMS.FILES_ALL) &&
          !props.searchFileEnabled &&
          (filesCount > 1000 ? (
            <Count>999+</Count>
          ) : (
            <Count>{filesCount}</Count>
          ))}
        {activeFolder &&
          activeFolder.fileKey !== FILES_MENU_ITEMS.FILES_POPULAR &&
          activeFolder.fileKey !== FILES_MENU_ITEMS.FILES_RECENT &&
          activeFolder.fileKey !== FILES_MENU_ITEMS.FILES_ALL &&
          !props.searchFileEnabled &&
          activeFolder?.totalFiles >= 0 &&
          (activeFolder.totalFiles > 999 ? (
            <Count>999+</Count>
          ) : (
            <Count>{activeFolder.totalFiles}</Count>
          ))}
      </Child>
      {props.searchFileEnabled && (
        <>
          <Arrow src={ArrowIcon} />
          <Child>
            Search result
            {props.searchCount > 0 && props.searchCount > 999 ? (
              <Count>999+</Count>
            ) : (
              <Count>{props.searchCount}</Count>
            )}
          </Child>
        </>
      )}
    </div>
  );
}

export default FilesBreadcrumbs;
