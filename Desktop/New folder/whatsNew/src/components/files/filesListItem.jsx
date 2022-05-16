import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Folder from "../../assets/icons/folder.svg";
import { setActiveFileMenuItem } from "../../store/actions/config-actions";
import { GetFilesListAction } from "../../store/actions/main-files-actions";
import { getFileSize } from "../utils/file-utility";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";
import { ClearFileSearchResultAction } from "../../store/actions/folderAction";
import { filesConstants } from "../../constants/files";
import rename_icon from "@toolbar/rename.svg";
import rename_icon_active from "@toolbar/rename_active.svg";
import options from "@toolbar/options.svg";
import {
  Menu,
  Options,
  OptionsDropdown,
} from "../post-view/post-msg-view/styles/attachment-post-style";
import { NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import delete_icon from "@toolbar/delete_icon.svg";
import delete_icon_active from "@toolbar/delete_icon_active.svg";
import FileAttachmentService from "../../services/file-attachment-service";
import FolderDeleteModal from "./folder-delete-modal";
import RenameFolderModal from "../modal/folder-modal/rename-folder-modal";
import { setSelectedRows } from "../../store/actions/esignature-actions";

const FileItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 23px 25px;
  align-items: center;
  border-bottom: 1px solid #dedede;
  height: 67px;
  cursor: pointer;

  ${({ active }) => {
    if (active) {
      return `background: #f2f2f2;`;
    }
  }} // &:hover {
  //   background: #f2f2f2;
  // }

  .options-menu {
    visibility: hidden !important;
    position: absolute;
  }

  &:hover .options-menu {
    visibility: visible !important;
    position: relative;
  }
  &:hover .folder-name {
    max-width: calc(100% - 25px);
  }
  &:hover .folder-desc {
    max-width: calc(100% - 30px);
  }
`;
const FileInfo = styled.div`
  display: flex;
  align-items: ${({ hasDesc }) => (hasDesc ? "start" : "center")};
  width: calc(100% - 75px);
`;
const FileNameDesc = styled.div`
  margin-left: 9px;
  width: 100%;
  cursor: pointer;
  ${({ hasDesc }) => {
    if (!hasDesc) {
      return `display: flex;
       align-items:center;
    `;
    }
  }}
`;
const FileName = styled.label`
  //   margin-left: 10px;
  margin-bottom: ${({ hasDesc }) => (hasDesc ? "5px" : 0)};
  color: #19191a;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  max-width: calc(100% - 1px);
  line-height: 1.2;
`;
const Description = styled.p`
  font-weight: normal;
  font-size: 12px;
  line-height: 125%;
  color: #999999;
  margin-bottom: 0px;
  width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;
const UnreadCount = styled.div`
  font-weight: bold;
  font-size: 15px;
  line-height: 100%;
  color: #03bd5d;
  margin-bottom: 5px;
  text-align: end;
`;
const StorageInfo = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 100%;
  text-align: end;
  // width: 90%;
  // text-overflow: ellipsis;
  white-space: nowrap;
  // overflow: hidden;
`;
const UsedSpace = styled.span`
  font-weight: normal;
  font-size: 12px;
  line-height: 100%;
  color: #03bd5d;
`;

function FilesListItem(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);

  const [renameIcon, setRenameIcon] = useState(rename_icon);
  const [deleteIcon, setDeleteIcon] = useState(delete_icon);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  let {
    fileKey,
    folderName,
    description,
    totalFiles,
    icon,
    usedSpace,
    totalSize,
    folderId,
  } = props;
  const handleFolderClick = () => {
    dispatch(setActiveFileMenuItem(props));
    dispatch(setSelectedRows([]));
    dispatch(ClearFileSearchResultAction());
    let folderObj = {
      count: filesConstants.ITEM_COUNT,
      order: filesConstants.ORDER_BY,
      sort: filesConstants.SORT_BY,
      folder: folderId,
      offset: filesConstants.OFFSET,
      file: filesConstants.ALL,
      fileType: filesConstants.ALL,
    };
    if (!folderId) delete folderObj.folder;
    if (fileKey === FILES_MENU_ITEMS.FILES_POPULAR) folderObj.popular = true;
    else if (fileKey === FILES_MENU_ITEMS.FILES_RECENT) {
      folderObj = {
        count: filesConstants.ITEM_COUNT,
        recent: true,
        offset: filesConstants.OFFSET,
      };
    }
    dispatch(GetFilesListAction(folderObj));
  };
  const handleShowRenameModal = () => {
    setShowRenameModal(true);
  };
  const handleHideRenameModal = () => {
    setShowRenameModal(false);
  };
  return (
    <Fragment key={`fragment-${props.fileKey}-${props.folderId}`}>
      <FileItemWrapper
        onClick={handleFolderClick}
        active={
          folderId
            ? activeFileMenu?.folderId === folderId
            : activeFileMenu?.fileKey === fileKey
        }
      >
        <FileInfo hasDesc={description ? true : false}>
          <img
            src={icon ? icon : Folder}
            alt="search"
            // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}
            className="file-icons"
          />
          <FileNameDesc hasDesc={description ? true : false}>
            {folderName && (
              <FileName
                className="folder-name"
                hasDesc={description ? true : false}
              >
                {folderName}
              </FileName>
            )}
            {description && (
              <Description className="folder-desc">{description}</Description>
            )}
          </FileNameDesc>
        </FileInfo>
        <div>
          {props.showUnreadCount && totalFiles > 0 ? (
            <UnreadCount>{totalFiles > 999 ? "999+" : totalFiles}</UnreadCount>
          ) : (
            props.showUnreadCount && <UnreadCount>{0}</UnreadCount>
          )}
          {props.showUsedSpace ? (
            usedSpace ? (
              <StorageInfo>
                <UsedSpace>{getFileSize(usedSpace, 1)}</UsedSpace>
                {props.showTotalSize &&
                  totalSize &&
                  ` / ${getFileSize(totalSize, 1)}`}
              </StorageInfo>
            ) : (
              <StorageInfo>{"0MB"}</StorageInfo>
            )
          ) : (
            <span />
          )}
        </div>
        {/*remove false to restore delete and rename functionality*/}
        {folderId && (
          <Menu key={folderId} className="options-menu">
            <Options id={`nav-dropdown`}>
              <OptionsDropdown
                id={`nav-dropdown`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title={<img src={options} alt="options" />}
                // drop="auto"
                alignRight
                onMouseEnter={(e) => {
                  // setShowOverlay(false);
                }}
                onMouseLeave={() => {
                  // setShowOverlay(true);
                }}
              >
                <NavDropdown.Item
                  style={{ lineHeight: "40px" }}
                  onMouseOver={() => setRenameIcon(rename_icon_active)}
                  onMouseOut={() => setRenameIcon(rename_icon)}
                  onClick={handleShowRenameModal}
                >
                  <img className="img-icon" src={renameIcon} alt="update" />
                  <span className="item-name">
                    {t("attachment:rename.label")}
                  </span>
                </NavDropdown.Item>
                <NavDropdown.Item
                  style={{ lineHeight: "40px" }}
                  onMouseOver={() => setDeleteIcon(delete_icon_active)}
                  onMouseOut={() => setDeleteIcon(delete_icon)}
                  onClick={() => setShowRemoveModal(true)}
                >
                  <img className="img-icon" src={deleteIcon} alt="delete" />
                  <span className="item-name">
                    {t("attachment:delete.label")}
                  </span>
                </NavDropdown.Item>
              </OptionsDropdown>
            </Options>
          </Menu>
        )}
      </FileItemWrapper>
      <RenameFolderModal
        onModalHide={handleHideRenameModal}
        showModal={showRenameModal}
        folderName={props.folderName}
        folderDesc={props.description}
        folderId={props.folderId}
      />
      {showRemoveModal && (
        <FolderDeleteModal
          showModal={showRemoveModal}
          handleCancel={() => setShowRemoveModal(false)}
          handleSubmit={async () => {
            await FileAttachmentService.removeFolder(props.folderId, dispatch);
            // dispatch(fetchFileList(queryParams));
            // dispatch(fileStorageDetails());
            setShowRemoveModal(false);
          }}
          name={folderName}
          totalFiles={totalFiles}
        />
      )}
    </Fragment>
  );
}

export default FilesListItem;
