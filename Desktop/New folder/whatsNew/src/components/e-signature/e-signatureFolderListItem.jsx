import React, { Fragment, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Folder from "../../assets/icons/folder.svg";
import { setActiveFileMenuItem } from "../../store/actions/config-actions";
import { GetFilesListAction } from "../../store/actions/main-files-actions";
import { FILES_MENU_ITEMS } from "../../constants/files-menu-items";
import { ClearFileSearchResultAction } from "../../store/actions/folderAction";
import { filesConstants } from "../../constants/files";
import rename_icon from "@toolbar/rename.svg";
import { useTranslation } from "react-i18next";
import delete_icon from "@toolbar/delete_icon.svg";
import RecipientLeaveModal from "./recipients-view/recipient-leave";
import {
  setEsignatureFolder,
  setSelectedRows,
  switchPanelView,
  toggleTopBarButtons,
} from "../../store/actions/esignature-actions";
import { SignatureState } from "./constants";

const FolderItemWrapper = styled.div`
  // display: flex;
  // justify-content: space-between;
  // align-items: center;
  height: 60px;
  cursor: pointer;

  ${({ active }) => {
    if (active) {
      return `background: #f2f2f2;`;
    }
  }} 
  
  // &:hover {
  //   background: #f2f2f2;
  // }

  // .options-menu {
  //   visibility: hidden !important;
  //   position: absolute;
  // }

  // &:hover .options-menu {
  //   visibility: visible !important;
  //   position: relative;
  // }
  &:hover .folder-name {
    max-width: calc(100% - 25px);
  }
  &:hover .folder-desc {
    max-width: calc(100% - 30px);
  }
`;
const FolderInfo = styled.div`
  display: flex;
  align-items: ${({ hasDesc }) => (hasDesc ? "start" : "center")};
  width: 100%;
  padding: 0 16px;

  img {
    margin: 0 16px 0 8px;
  }
`;
const FolderNameDesc = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 19.5px 0;
  justify-content: space-between;
  border-bottom: ${({ active }) => (active ? "0px" : "1px solid #dedede")};

  ${({ hasDesc }) => {
    if (!hasDesc) {
      return `display: flex;
      align-items:center;
    `;
    }
  }}
`;
const FolderName = styled.label`
  //   margin-left: 10px;
  margin-bottom: ${({ hasDesc }) => (hasDesc ? "5px" : 0)};
  color: ${({ active }) => (active ? "#00A95B" : "#19191a")};
  font-weight: ${({ active }) => (active ? "700" : "400")};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  max-width: calc(100% - 1px);
  line-height: 19px;
  font-size: 14px;
`;
const Description = styled.p`
  font-weight: normal;
  font-size: 12px;
  line-height: 125%;
  color: #999999;
  margin-bottom: 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

function ESignatureFolderListItem(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [canLeave, setLeave] = useState(false);
  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);
  const signatureState = useSelector(
    (state) => state.esignatureReducer.signatureState
  );
  let {
    fileKey,
    folderName,
    description,
    icon,
    folderId,
    selectedIcon,
    totalFiles,
  } = props;
  const handleFolderClick = (folderName) => {
    dispatch(toggleTopBarButtons(false));
    if (signatureState === SignatureState.DEFAULT) {
      dispatch(setActiveFileMenuItem(props));
      dispatch(setEsignatureFolder(folderName.toUpperCase().split(" ")[0]));
      dispatch(switchPanelView(SignatureState.DEFAULT));
      dispatch(setSelectedRows([]));
    } else {
      setLeave(true);
    }
  };
  const isActive = useMemo(
    () =>
      folderId
        ? activeFileMenu?.folderId === folderId
        : activeFileMenu?.fileKey === fileKey,
    [activeFileMenu, folderId, fileKey]
  );
  return (
    <Fragment key={`fragment-${props.fileKey}-${props.folderId}`}>
      <FolderItemWrapper
        onClick={() => handleFolderClick(props.folderName)}
        active={isActive}
      >
        <FolderInfo hasDesc={description ? true : false}>
          <img
            src={icon ? (isActive ? selectedIcon : icon) : Folder}
            alt="search"
            // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}
            className="file-icons"
          />
          <FolderNameDesc
            hasDesc={description ? true : false}
            active={isActive}
          >
            {folderName && (
              <FolderName
                className="folder-name"
                hasDesc={description ? true : false}
                active={isActive}
              >
                {folderName}
              </FolderName>
            )}
            {isActive && (
              <Description
                className="folder-desc"
                style={{ textAlign: "right" }}
              >
                {totalFiles}
              </Description>
            )}
          </FolderNameDesc>
        </FolderInfo>
      </FolderItemWrapper>
      {canLeave && (
        <RecipientLeaveModal
          show={canLeave}
          cancel={() => setLeave(false)}
          okay={() => {
            dispatch(setActiveFileMenuItem(props));
            dispatch(
              setEsignatureFolder(props.folderName.toUpperCase().split(" ")[0])
            );
            dispatch(switchPanelView(SignatureState.DEFAULT));
            setLeave(false);
          }}
        />
      )}
    </Fragment>
  );
}

export default ESignatureFolderListItem;
