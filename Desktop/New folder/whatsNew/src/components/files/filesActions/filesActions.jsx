import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import download from "../../../assets/icons/download-file.svg";
import downloadDark from "../../../assets/icons/download-file-dark.svg";
import deleteFile from "../../../assets/icons/file-delete.svg";
import deleteFileDark from "../../../assets/icons/file-delete-dark.svg";
import forward from "../../../assets/icons/file-forward.svg";
import forwardDark from "../../../assets/icons/file-forward-dark.svg";
import share from "../../../assets/icons/file-share.svg";
import shareDark from "../../../assets/icons/file-share-dark.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDeleteStatus,
} from "../../../store/actions/main-files-actions";
import FileDeleteModal from "../file-delete-modal";
import fileUploadDark from "../../../assets/icons/file-upload-dark.svg";
import { useTranslation } from "react-i18next";
import FileUploadHelper from "../../script-window/attachment-toolbar/file-upload-helper";
import AttachmentButton from "../../script-window/attachment-toolbar/attachment-button";
import AttachFileModal from "../../script-window/attachment-toolbar/attach-file-modal";
import { showToast } from "../../../store/actions/toast-modal-actions";
import FilesForwardModal from "../../files-forward/files-forward-modal";
import ShareFilesModal from "../../files-forward/share-files-modal";
import ShareModal from "../../modal/share-modal/share-modal";
import FileShareStatusModal from "../../modal/file-share-status-modal/file-share-status-modal";
import FileForwardStatusModal from "../../modal/file-forward-status-modal/file-forward-status-modal";
import DownloadWarningModal from "../../modal/download-warning-modal/download-warning-modal";
import { PermissionConstants } from "../../../constants/permission-constants";
import {
  guestFilesSharing,
  closeFileShareStatusModal,
  closeFileForwardStatusModal,
} from "../../../store/actions/main-files-actions";
import { fetchFileList } from "../../../store/actions/files-actions";
import moment from "moment";
import FileAttachmentService from "../../../services/file-attachment-service";
import UserType from "../../../constants/user/user-type";

const ActionButton = styled.div`
  position: relative;
  border: 1px solid ${({ enable }) => (enable ? "#19191A" : "#999999")};
  box-sizing: border-box;
  border-radius: 4px;
  padding: 6px 10px;
  font-weight: normal;
  font-size: 12px;
  // line-height: 100%;
  color: ${({ enable }) => (enable ? "#19191A" : "#999999")};
  cursor: ${({ enable }) => (enable ? "pointer" : "default")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  width: 90px;
  height: 24px;

  img {
    height: 12px;
    width: 12px;
    margin-right: 5px;
  }
  p {
    width: 100%;
    position: absolute;
    > img {
      visibility: hidden;
    }
  }
`;

const FileActions = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AuthReducer.user.userType);

  const currentChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const { selectedFilter } = useSelector((state) => state.fileReducer);
  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);
  let deleteFileSuccess = useSelector(
    (state) => state.mainFilesReducer.deleteFileSuccess
  );
  const {
    showModal,
    files,
    uploaded,
    status,
    onSubmit,
    onChangeAttach,
    hideModal,
    updateFileName,
    progress,
    fileId,
    DeleteFile,
    setIsFileAdded,
    pending,
    totalFiles,
    rejected,
  } = FileUploadHelper();
  // const { selectedFiles } = props;
  const selectedFiles = useMemo(() => {
    let ids = [];
    let newFields = props.selectedFiles.filter((file) => {
      let id = `${file.fileId}-${file.folderId}-${file.channelId}-${file.postId}`;

      if (!ids.some((i) => i === id)) {
        ids.push(id);
        return file;
      }
    });
    return newFields;
  }, [props.selectedFiles]);
  let enable = useMemo(() => selectedFiles.length, [selectedFiles]);
  const userNetwork = useSelector((state) => state.AuthReducer.networkType);
  const {
    showGuestShareStatusModal,
    showGuestShareStatusType,
    showFileForwardStatusModal,
  } = useSelector((state) => state.mainFilesReducer);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [showDownloadWarningModal, setShowdownloadWarningModal] =
    useState(false);
  const [downloadableFile, setDownloadableFile] = useState([]);
  const [notDownloadableFile, setNotDownloadableFile] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showConfirmShareModal, setConfirmShowShareModal] = useState(false);
  const [showFileShareStatusModal, setShowFileShareStatusModal] = useState(
    showGuestShareStatusModal
  );
  const [showFileForwardShowStatusModal, setShowFileForwardShowStatusModal] =
    useState(showFileForwardStatusModal);
  const [shareData, setShareData] = useState(null);
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);

  const [expirationDateSelect, setExpirationDateSelect] = useState(null);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  const [selectedOwnFiles, setSelectedOwnFiles] = useState([]);

  const handleDeleteFiles = () => {
    FileAttachmentService.removeFilesById(selectedOwnFiles, dispatch);
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
  const displayCount = selectedFiles.length - notDownloadableFile.length;

  const getFilesList = () => {
    let queryParams = {
      channelId: currentChannel?.id,
      user: false,
      fileType: selectedFilter,
    };
    dispatch(fetchFileList(queryParams, true));
  };

  const checkAllowedFiles = (files) => {
    let allowedFileList = [];
    if (selectedFiles.length) {
      selectedFiles.map((file) => {
        if (file.postId && file.channelId) {
          if (
            file?.creatorId === currentUserId ||
            file?.postOwnerId === currentUserId
          ) {
            allowedFileList.push(file);
          }
        }
        // user can see only there own folder so delete is allowed always
        if (file.folderId) {
          allowedFileList.push(file);
        }
      });
    }
    setSelectedOwnFiles(allowedFileList);
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
  let downloadPermissionArr = [];

  useEffect(() => {
    setShowFileShareStatusModal(showGuestShareStatusModal);
  }, [showGuestShareStatusModal]);
  useEffect(() => {
    setShowFileForwardShowStatusModal(showFileForwardStatusModal);
  }, [showFileForwardStatusModal]);
  useEffect(() => {
    selectedFiles.forEach((file) => {
      let result = downloadEnabled(file);
      if (result !== null) {
        downloadPermissionArr.push(result);
      }
    });
    checkAllowedFiles(selectedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  useEffect(() => {
    if (notDownloadableFile.length) {
      setTimeout(() => {
        setShowdownloadWarningModal(true);
      }, 300);
    }
  }, [notDownloadableFile]);

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

    if (downloadArr.length > 0) {
      setDownloadableFile(downloadArr);
    }

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
          file?.folderId
        );
      });
    if (downloadArr.length > 0 && notDownloadArr.length <= 0) {
      getFilesList();
    }
  };

  useEffect(() => {
    if (deleteFileSuccess === false)
      dispatch(showToast(t("files:delete.fail")), 3000);
    else if (deleteFileSuccess) {
      dispatch(showToast(t("files:delete.success"), 3000, "success"));
    }
    dispatch(updateDeleteStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFileSuccess]);

  useEffect(() => {
    if (shareData?.invitee) {
      setConfirmShowShareModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareData]);

  const hideForwardModal = () => {
    setShowForwardModal(false);
  };
  const hideShareModal = () => {
    setShowShareModal(false);
  };

  const shareFile = () => {
    let newPostObj = shareData;
    newPostObj.invitee = shareData?.invitee?.map(
      ({ memberEmail }) => memberEmail
    );
    dispatch(guestFilesSharing(shareData));
    setShareData(null);
    setExpirationDateSelect(null);
    setConfirmShowShareModal(false);
  };
  const backAction = () => {
    setConfirmShowShareModal(false);
    setShowShareModal(true);
    setExpirationDateSelect(expirationDateSelect);
    setShareData(shareData);
  };

  function modalProps() {
    let data = "";
    if (shareData?.invitee && shareData?.fileListIds) {
      var newDateObj = new Date(
        new Date().getTime() + shareData.fileExpiry * 60000
      );
      const diffDays = Math.round(
        Math.abs((newDateObj - new Date()) / (24 * 60 * 60 * 1000))
      );
      newDateObj = new Date(
        new Date().setDate(new Date().getDate() + diffDays)
      );
      const expireDate = moment(newDateObj).format("MMM D, YYYY");
      let passcodeStars = "";
      if (shareData?.passcode?.length) {
        for (var i = 1; i <= shareData?.passcode?.length; i++) {
          passcodeStars = passcodeStars + "*";
        }
      }

      data = {
        header: "confirm.share.modal:header",
        content1:
          shareData?.fileListIds?.length === 1
            ? "confirm.share.modal:content.single"
            : "confirm.share.modal:content.multiple",
        content2: "confirm.share.modal:content2",
        fileCount: shareData?.fileListIds?.length,
        hasPasscode: shareData?.passcodeReqd,
        passcode: passcodeStars,
        passcodeText: "confirm.share.modal:passcode",
        emails: shareData?.invitee?.map(({ memberEmail }) => memberEmail),
        primaryButtonText: "confirm.share.modal:back.button",
        secondaryButtonText: "confirm.share.modal:share.button",
        expireDate: expireDate,
        days: diffDays,
      };
    }
    return data;
  }

  function statusModalProps() {
    let data = "";
    let success = showGuestShareStatusType === "SUCCESS";
    if (showGuestShareStatusModal && showGuestShareStatusType) {
      data = {
        header: success
          ? "file.share.status.modal:header1"
          : "file.share.status.modal:header2",
        content: success
          ? "file.share.status.modal:content1"
          : "file.share.status.modal:content2",
        primaryButtonText: "file.share.status.modal:ok.button",
      };
    }
    return data;
  }
  function forwardStatusModalProps() {
    let data = {
      header: "file.forward.status.modal:header1",
      content: "file.forward.status.modal:content1",
      primaryButtonText: "file.forward.status.modal:ok.button",
    };
    return data;
  }
  let fileIds = [...selectedFiles];
  fileIds = fileIds.map((file) => {
    return file.fileId;
  });

  return (
    <>
      <div className="d-flex flex-row w-100" style={{ marginTop: "15px" }}>
        {activeFileMenu?.folderId && (
          <ActionButton enable={true}>
            <img src={fileUploadDark} alt={"file upload"} />
            <span>{t("files:upload")}</span>
            <AttachmentButton onChangeAttach={onChangeAttach} />
          </ActionButton>
        )}
        <ActionButton enable={enable} onClick={(e) => downloadFiles(e)}>
          <img src={enable ? downloadDark : download} alt={"download"} />
          <span>{t("files:download")}</span>
        </ActionButton>
        <ActionButton
          enable={enable}
          onClick={() => {
            if (enable) {
              // if (
              //   selectedFiles.some((file) => file?.creatorId === currentUserId)
              // )
              setShowDeleteModal(true);
              // else
              // dispatch(
              //   showToast(t("files:delete.modal.ownFileDeleteWarning")),
              //   3000
              // );
            }
          }}
        >
          <img src={enable ? deleteFileDark : deleteFile} alt={"delete"} />
          <span>{t("files:delete")}</span>
        </ActionButton>
        <ActionButton
          enable={enable}
          onClick={() => enable && setShowForwardModal(true)}
        >
          <img src={enable ? forwardDark : forward} alt={"forward"} />
          <span>{t("files:forward")}</span>
        </ActionButton>
        <ActionButton
          enable={enable}
          onClick={() => enable && setShowShareModal(true)}
        >
          <img src={enable ? shareDark : share} alt={"share"} />
          <span>{t("files:share")}</span>
        </ActionButton>
      </div>
      <FileDeleteModal
        fileCount={selectedOwnFiles.length}
        showModal={showDeleteModal}
        handleSubmit={handleDeleteFiles}
        handleCancel={() => setShowDeleteModal(false)}
        showOwnFileDeleteWarning={
          selectedFiles.length > selectedOwnFiles.length ? true : false
        }
      />
      <ShareModal
        data={modalProps()}
        shareFile={shareFile}
        backAction={backAction}
        closeModal={() => setConfirmShowShareModal(false)}
        showModal={showConfirmShareModal}
      />
      <FileShareStatusModal
        data={statusModalProps()}
        closeModal={() => dispatch(closeFileShareStatusModal())}
        showModal={showFileShareStatusModal}
      />

      {showModal && (
        <AttachFileModal
          show={showModal}
          handleClose={hideModal}
          files={files}
          status={status}
          uploaded={uploaded}
          rejected={rejected}
          onSubmit={onSubmit}
          updateFileName={updateFileName}
          channelMembers={props.channelMembers}
          progress={progress}
          folderId={activeFileMenu.folderId}
          DeleteFile={DeleteFile}
          setIsFileAdded={setIsFileAdded}
          fileId={fileId}
          pending={pending}
          totalFiles={totalFiles}
          fileIds={fileIds}
          channel={activeSelectedChannel}
        />
      )}
      <FileForwardStatusModal
        data={forwardStatusModalProps()}
        closeModal={() => {
          dispatch(closeFileForwardStatusModal());
        }}
        showModal={showFileForwardShowStatusModal}
      />
      {showDownloadWarningModal && (
        <DownloadWarningModal
          data={notDownloadableFile}
          totalCount={displayCount > 0 ? displayCount : 0}
          closeModal={() => {
            setShowdownloadWarningModal(false);
            getFilesList();
          }}
          showModal={showDownloadWarningModal}
        />
      )}
      {showForwardModal && (
        <FilesForwardModal
          show={showForwardModal}
          handleClose={hideForwardModal}
          files={selectedFiles}
          status={status}
          uploaded={uploaded}
          rejected={rejected}
          onSubmit={onSubmit}
          updateFileName={updateFileName}
          channelMembers={props.channelMembers}
          progress={progress}
          folderId={activeFileMenu.id}
          DeleteFile={DeleteFile}
          setIsFileAdded={setIsFileAdded}
          fileId={fileId}
          pending={pending}
          totalFiles={totalFiles}
          fileIds={fileIds}
          channel={activeSelectedChannel}
        />
      )}
      {showShareModal && (
        <ShareFilesModal
          show={showShareModal}
          handleClose={hideShareModal}
          files={selectedFiles}
          shareData={shareData}
          setShareData={setShareData}
          expirationDateSelect={expirationDateSelect}
          setExpirationDateSelect={setExpirationDateSelect}
          status={status}
          uploaded={uploaded}
          rejected={rejected}
          onSubmit={onSubmit}
          updateFileName={updateFileName}
          channelMembers={props.channelMembers}
          progress={progress}
          folderId={activeFileMenu.id}
          DeleteFile={DeleteFile}
          setIsFileAdded={setIsFileAdded}
          fileId={fileId}
          pending={pending}
          totalFiles={totalFiles}
          fileIds={fileIds}
          channel={activeSelectedChannel}
        />
      )}
    </>
  );
};

export default FileActions;
