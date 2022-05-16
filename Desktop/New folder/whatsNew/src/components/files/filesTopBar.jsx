import React, { useState } from "react";
import "./filesTopBar.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import UserType from "../../constants/user/user-type";
import CreateFolderModal from "../../components/modal/folder-modal/create-folder-modal";
import styled from "styled-components";

const Label = styled.p`
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 100;
  line-height: 100%;
  font-size: 14px;
  color: #999999;
  float: right;
  margin-top: 5px;
  margin-left: 5px;
`;

function FilesTopBar(props) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.AuthReducer.user);
  const [createModalShow, setCreateModalShow] = useState(false);

  const handleClose = () => {
    setCreateModalShow(false);
  };
  const handleOpen = () => {
    setCreateModalShow(true);
  };
  return (
    <div className="files-topbar">
      {user.userType !== UserType.GUEST && (
        <button
          className="btn files-topbar-new-folder-btn"
          type="button"
          onClick={handleOpen}
        >
          <Label>{t("files:new.folder")}</Label>
        </button>
      )}
      {createModalShow && <CreateFolderModal onModalHide={handleClose} />}
      {/* <GuestFileShareModal /> */}
      {/* <PassCodeModal /> */}
    </div>
  );
}

export default FilesTopBar;
