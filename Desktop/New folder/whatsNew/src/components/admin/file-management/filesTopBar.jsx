import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import UserType from "../../../constants/user/user-type";
import styled from "styled-components";
import { DiscussionActions } from "../../messages/channel-head.style";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import Notifications from "../../datapanel/notification";
import OpenedChannelDetails from "../../../assets/icons/context-panel.svg";
import OpenChannelDetails from "../../../assets/icons/context-panel-active.svg";
import { showToast } from "../../../store/actions/toast-modal-actions";

import {
  deleteUser,
  importMemberList,
} from "../../../store/actions/admin-account-action";
import "./filesTopBar.css";
import DeleteWarningModal from "../../../components/modal/account/delete-warning-modal";
import AdminService from "../../../services/admin-service";
import SuccessModal from "../../modal/account/success-modal";
import { RESET_USER_STATUS_ACTIVITY } from "../../../store/actionTypes/admin-account-action-types";
import DownloadWarningModal from "../../modal/download-warning-modal/download-warning-modal";
import FileAttachmentService from "../../../services/file-attachment-service";
import { PermissionConstants } from "../../../constants/permission-constants";
import FileDeleteModal from "../../files/file-delete-modal";
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
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AuthReducer.user.userType);
  const userNetwork = useSelector((state) => state.AuthReducer.networkType);
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const selectedAccounts = useSelector(
    (state) => state.AdminAccountReducer.selectedAccounts
  );
  const activeSelectedFileId = useSelector(
    (state) => state.config.activeSelectedFileId
  );
  const importedMemberList = useSelector(
    (state) => state.AdminAccountReducer.importedMemberList
  );
  const failedToImportMemberList = useSelector(
    (state) => state.AdminAccountReducer.failedToImportMemberList
  );
  const selectedFiles = useSelector(
    (state) => state.mainFilesReducer.selectedFiles
  );
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  let {
    userStatusChangeSuccess,
    userStatusChangeType,
    userStatusChangeMessage,
  } = useSelector((state) => state.AdminAccountReducer);

  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [warningList, setWarningList] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    msg: "",
    title: "",
  });
  const [notDownloadableFile, setNotDownloadableFile] = useState([]);
  const [showDownloadWarningModal, setShowdownloadWarningModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [selectedOwnFiles, setSelectedOwnFiles] = useState([]);

  let enable = useMemo(() => selectedFiles.length, [selectedFiles]);

  // const checkAllowedFiles = (files) => {
  //   let allowedFileList = [];
  //   if (selectedFiles.length) {
  //     selectedFiles.map((file) => {
  //       if (file.postId && file.channelId) {
  //         if (
  //           file?.creatorId === currentUserId ||
  //           file?.postOwnerId === currentUserId
  //         ) {
  //           allowedFileList.push(file);
  //         }
  //       }
  //       // user can see only there own folder so delete is allowed always
  //       if (file.folderId) {
  //         allowedFileList.push(file);
  //       }
  //     });
  //   }
  //   setSelectedOwnFiles(allowedFileList);
  // };

  // let downloadPermissionArr = [];

  // useEffect(() => {
  //   selectedFiles.forEach((file) => {
  //     let result = downloadEnabled(file);
  //     if (result !== null) {
  //       downloadPermissionArr.push(result);
  //     }
  //   });
  //   checkAllowedFiles(selectedFiles);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedFiles]);

  const handleDeleteFiles = () => {
    FileAttachmentService.removeFilesById(selectedFiles, dispatch, true);
    // removeFile
    // if (selectedOwnFiles.length)
    //   dispatch(
    //     deleteFiles({
    //       folder: activeFileMenu?.folderId,
    //       files: [...selectedOwnFiles.map((i) => i.fileId)],
    //     })
    //   );
    setShowDeleteModal(false);
  };

  const openModal = (msg, title) => {
    setShowModal({ show: true, msg, title });
  };

  const closeModal = () => {
    setShowModal({ show: false, msg: "", title: "" });
  };

  // useEffect(() => {
  //   if (userStatusChangeType === "DELETED") {
  //     if (userStatusChangeSuccess) {
  //       setShowDeleteModal(false);
  //       openModal(t("account:account.delete.success"), t("account:deleted"));
  //     } else if (userStatusChangeSuccess === false) {
  //       setShowDeleteModal(false);
  //       dispatch(
  //         showToast(
  //           t("admin:account.management:user.information:error.message"),
  //           3000
  //         )
  //       );
  //     }
  //   }
  //   return () =>
  //     dispatch({
  //       type: RESET_USER_STATUS_ACTIVITY,
  //     });
  // }, [userStatusChangeSuccess]);

  const onExportClick = () => {
    const input = document.getElementById("export-file");
    if (input) {
      input.click();
    }
  };

  function downloadEnabled(myFile) {
    if (myFile.queryUserType === "INTERNAL") {
      if (
        myFile.internalPermission === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "INTERNAL"
      ) {
        return myFile;
      }
      if (
        myFile.internalPermissionOoo === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "EXTERNAL"
      ) {
        return myFile;
      }
      if (
        myFile.externalPermission === PermissionConstants(t).DOWNLOAD_ENUM &&
        (userType === UserType.EXTERNAL || userType === UserType.GUEST) &&
        userNetwork === "EXTERNAL"
      ) {
        return myFile;
      }
    }
    if (myFile.queryUserType === "EXTERNAL") {
      if (myFile.externalPermission === PermissionConstants(t).DOWNLOAD_ENUM) {
        return myFile;
      }
    }
    return null;
  }

  useEffect(() => {
    if (importedMemberList) {
      dispatch(showToast(t("account:import.successful"), 3000, "success"));
    } else if (failedToImportMemberList) {
      dispatch(showToast(t("account:import.fail")), 3000, "failure");
    }
  }, [importedMemberList, failedToImportMemberList]);

  const adminSidebarPanelState = useSelector(
    (state) => state.config.adminSidebarPanelState
  );
  const displayCount = selectedFiles.length - notDownloadableFile.length;

  const downloadFiles = () => {
    let downloadArr = [];
    let notDownloadArr = [];
    selectedFiles.forEach((file) => {
      let result = downloadEnabled(file);
      if (result !== null) {
        downloadArr.push(result);
      } else {
        notDownloadArr.push(file);
      }
    });

    // if (downloadArr.length > 0) {
    //   setDownloadableFile(downloadArr);
    // }

    if (notDownloadArr.length > 0) {
      setNotDownloadableFile(notDownloadArr);
    }
    downloadArr.length > 0 &&
      downloadArr.forEach((file) => {
        FileAttachmentService.fileDownloadFromFolder(
          file.fileId,
          file.mimeType,
          file.name,
          file.channelId,
          file?.postId,
          {},
          file?.folderId,
          true
        );
      });
    // if (downloadArr.length > 0 && notDownloadArr.length <= 0) {
    //   getFilesList();
    // }
  };

  useEffect(() => {
    if (notDownloadableFile.length) {
      setTimeout(() => {
        setShowdownloadWarningModal(true);
      }, 300);
    }
  }, [notDownloadableFile]);

  useEffect(() => {
    if (warningList && warningList.length > 0) {
      setCurrentData(warningList[0]);
      setCurrentDataIndex(0);
      setDeleteWarningModal(true);
    }
  }, [warningList]);

  const handleDelete = () => {
    if (selectedAccounts.length) {
      var list = selectedAccounts.filter(
        (item) => item?.ownedDiscussionCount > 0
      );
      if (list.length) {
        setWarningList(list);
      } else {
        openDeleteModal();
      }
    }
  };

  const submitDelete = (list) => {
    if (list.length) {
      let reqSelectedList = list
        .filter((item) => item.activationStatus !== "DELETED")
        .map((value) => ({
          userId: value.id,
          activationStatus: "DELETED",
        }));
      if (reqSelectedList.length) {
        dispatch(
          deleteUser(
            reqSelectedList,
            "DELETED",
            "Successfully deleted the selected account."
          )
        );
      }
    }
  };

  const importCSVFile = (e) => {
    e.preventDefault();
    const input = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const data = csvToArray(text);
      let csvArray = data;
      let importDataArray = [];
      csvArray &&
        csvArray.length > 0 &&
        csvArray.map((csvItem) => {
          if (importDataArray?.indexOf(csvItem.email) === -1) {
            importDataArray.push(csvItem);
          }
        });
      setImportData(importDataArray);
      dispatch(importMemberList(importDataArray, dispatch));
    };
    reader.readAsText(input);
  };

  const csvToArray = (str, delimiter = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
    return arr;
  };

  return (
    <div className="topBar m-0">
      <div className="d-flex align-items-center justify-content-between pr-0">
        <DiscussionActions className="justify-content-start">
          <div className="d-flex align-items-center left-spacing">
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            >
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip
                    id={t("admin:account.management:topbar.tooltip:delete")}
                  >
                    {t("admin:account.management:topbar.tooltip:delete")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__removeUser text-white ${
                    enable ? "" : "disabled"
                  }`}
                  onClick={() => {
                    if (enable) setShowDeleteModal(true);
                  }}
                >
                  {t("admin:account.management:topbar.text:delete")}
                </div>
              </OverlayTrigger>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            >
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip
                    id={t(
                      "admin:account.fileManagement:topbar.tooltip:download"
                    )}
                  >
                    {t("admin:account.fileManagement:topbar.tooltip:download")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__export text-white ${
                    enable ? "" : "disabled"
                  }
                  `}
                  onClick={(e) => {
                    downloadFiles(e);
                  }}
                >
                  {t("admin:account.fileManagement:topbar.text:download")}
                </div>
              </OverlayTrigger>
            </div>

            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            ></div>
          </div>
        </DiscussionActions>
        <DiscussionActions className="justify-content-end">
          <div
            className="d-flex align-items-center justify-content-between"
            style={adminSidebarPanelState ? { width: "321px" } : {}}
          >
            <div className="d-flex">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                show={showTooltip}
                overlay={
                  <Tooltip id={t("header.tooltip:notifications")}>
                    {t("header.tooltip:notifications")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon ${showBg === true ? "active" : ""}`}
                >
                  <Notifications
                    showToolTip={(val) => setShowTooltip(val)}
                    setShowBg={(val) => setShowBg(val)}
                    showBg={showBg}
                  />
                </div>
              </OverlayTrigger>
              {activeSelectedFileId && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip
                      id={t("admin:account.management:topbar.tooltip:details")}
                    >
                      {t("admin:account.management:topbar.tooltip:details")}
                    </Tooltip>
                  }
                >
                  <div
                    onClick={props.onToggleChannelDetails}
                    className={`topBar__icon topBar__icon__summary ${
                      activeSelectedFileId ? "active" : ""
                    }`}
                    id={activeSelectedFileId ? "opened" : ""}
                  >
                    <img
                      id="icon"
                      src={
                        activeSelectedFileId
                          ? OpenedChannelDetails
                          : OpenChannelDetails
                      }
                      alt={""}
                    />
                  </div>
                </OverlayTrigger>
              )}
            </div>
          </div>
        </DiscussionActions>
      </div>
      <FileDeleteModal
        fileCount={selectedFiles.length}
        showModal={showDeleteModal}
        handleSubmit={handleDeleteFiles}
        handleCancel={() => setShowDeleteModal(false)}
        showOwnFileDeleteWarning={false}
      />
      {showDownloadWarningModal && (
        <DownloadWarningModal
          data={notDownloadableFile}
          totalCount={displayCount > 0 ? displayCount : 0}
          closeModal={() => {
            setShowdownloadWarningModal(false);
            // getFilesList();
          }}
          showModal={showDownloadWarningModal}
        />
      )}
    </div>
  );
}

export default FilesTopBar;
