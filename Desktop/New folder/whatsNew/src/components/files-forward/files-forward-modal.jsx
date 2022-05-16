//Code commented in this file is to be used in future releases, please don't remove the same
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { PermissionConstants } from "../../constants/permission-constants";
import Progress from "../utils/progress-bar";
import { StyledModal } from "./styles/styled-modal";
import { FileExt } from "./styles/break";
import { CancelButton } from "./styles/cancel-button";
import { ShareButton } from "./styles/share-button";
import Close from "../../assets/icons/attach-close.svg";
import MessagePost from "../messages/messages-post";
import UploadedFileIcon from "../../assets/icons/uploaded-file.svg";
import { getFileSizeBytes, fileExtension } from "../utils/file-utility";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./files.css";
import DiscussionListSuggestions from "../../components/post-forward/discussion-suggestion";
import {
  getLastSelectedChannelId,
  setForwardSelectedChannelId,
} from "../../utilities/app-preference";
import CommonUtils from "../utils/common-utils";
import FolderListSuggestions from "../utils/folder-suggestion";
import { forwardFileToFolder } from "../../store/actions/folderAction";

function FilesForwardModal(props) {
  const scriptWindowSendButton = useRef(null);

  let fileNameDataArr = [];
  let filesCopy = useRef([...props.files]);
  const [filesShow, setFilesShow] = useState(filesCopy.current);
  let myPermission = useRef(true);
  const { t } = useTranslation();
  const [internalPermission, setInternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [type, setType] = useState("DISCUSSION");
  const [internalPermissionOOO, setInternalPermissionOOO] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [externalPermission, setExternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const fileConfig = useSelector((state) => state.config.fileConfig);
  const activeMenuConfig = useSelector(
    (state) => state.config.activeFileMenuItem
  );

  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  const currentUser = useSelector((state) => state.AuthReducer.user);
  const currentNetworkType = useSelector(
    (state) => state.AuthReducer.networkType
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const [fileName, setFileName] = useState([]);
  const [viewPermission, setViewPermission] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [applyCss, setApplyCss] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const folderList = useSelector((state) => state.folderReducer.folderList);
  const [discussion, setDiscussion] = useState("");
  const [channelType, setChannelType] = useState("");

  const [folder, setFolder] = useState("");
  const [discussionId, setDiscussionId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [show, setShow] = useState(props.show);
  const [discussionFound, setDiscussionFound] = useState(true);
  const [folderFound, setFolderFound] = useState(true);

  const dispatch = useDispatch();

  const setFileNameAndExt = (id, fullName) => {
    let fileNameArr = [...fileName];
    let selectedId = fileNameArr.find((el) => el.id === id);

    const last_dot = fullName?.lastIndexOf(".");
    const myFileName = fullName.slice(0, last_dot);
    let fileNameObj = {};
    fileNameObj.fileId = id;
    fileNameObj.name = selectedId === undefined ? myFileName : selectedId.name;
    fileNameDataArr.push(fileNameObj);
  };
  const handleModalClose = (value) => {
    props.handleClose();

    fileNameDataArr = [];
  };

  const handleFileDelete = (id) => {
    let fileCopyArr = [...filesCopy.current];
    let filteredCopyArr = fileCopyArr.filter((el) => el.fileId !== id);

    filesCopy.current = [...filteredCopyArr];
    setFilesShow(filesCopy.current);
    if (filesCopy.current.length < 1) {
      handleModalClose();
    }
    if (filesCopy.current?.length === 1) {
      if (filesCopy.current[0].fileForwardDisabled) {
        setIsDisabled(true);
      }
    }
  };
  useEffect(() => {
    if (props.files?.length === 1) {
      if (props.files[0]?.fileForwardDisabled) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
  }, []);
  useEffect(() => {
    if (props.files?.length > 3) {
      props.files.map(({ file, src, id, mimeType, size }, index) =>
        internalPermission === PermissionConstants(t).VIEW ||
        internalPermissionOOO === PermissionConstants(t).VIEW ||
        externalPermission === PermissionConstants(t).VIEW
          ? fileConfig && fileConfig.mime.indexOf(mimeType) !== -1
            ? size < getFileSizeBytes(fileConfig.maxfilesize)
              ? ""
              : setApplyCss(true)
            : mimeType.split("/")[0] === "image" ||
              mimeType === "application/pdf"
            ? ""
            : setApplyCss(true)
          : ""
      );
    }
  }, [internalPermission, internalPermissionOOO, externalPermission]);

  useEffect(() => {
    props.files.map(({ file, src, fileId, mimeType, size, name }, index) => {
      setFileNameAndExt(fileId, name);
      setFileName(fileNameDataArr);
      if (myPermission.current === true) {
        if (
          (fileConfig &&
            fileConfig.mime.indexOf(mimeType) !== -1 &&
            size < getFileSizeBytes(fileConfig.maxfilesize)) ||
          mimeType.split("/")[0] === "image" ||
          mimeType === "application/pdf"
        ) {
          myPermission.current = true;
        } else {
          myPermission.current = false;
        }
      }
    });

    if (
      props.files.length + props.totalFiles.length >
      fileConfig.maxAllowedFilesInPost
    ) {
      setIsDisabled(true);
    } else {
      // setIsDisabled(false);
    }
    if (props.files?.length === 1) {
      if (props.files[0]?.fileForwardDisabled) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      setIsDisabled(false);
    }
    setViewPermission(myPermission.current);
    setInternalPermission(PermissionConstants(t).DOWNLOAD);
    setInternalPermissionOOO(PermissionConstants(t).DOWNLOAD);
    setExternalPermission(PermissionConstants(t).DOWNLOAD);
    if (props.files.length === 0) {
      handleModalClose(true);
    }
  }, [props.files]);

  const handleFolderList = (filterFolder) => {
    if (typeof filterFolder === "object") {
      setFolder(filterFolder);
      setFolderId(
        filterFolder && filterFolder.id
          ? filterFolder.id
          : filterFolder && filterFolder.folderId
          ? filterFolder.folderId
          : ""
      );
      // setFolderId(filterFolder && filterFolder.id ? filterFolder.id : "");
      setFolderFound(true);
    } else if (typeof filterFolder === "string") {
      if (filterFolder === "") {
        setFolder("");
        setFolderId("");
        setFolderFound(true);
      } else {
        var folder = folderList.find(
          (folderItem) => folderItem.folderName === filterFolder
        );
        if (typeof folder === "object") {
          setFolder(folder);
          setFolderId(folder && folder.folderId ? folder.folderId : "");
          setFolderFound(true);
        } else {
          setFolder("");
          setFolderId("");
          setFolderFound(false);
        }
      }
    } else {
      setFolder("");
      setFolderId("");
    }
  };

  useEffect(() => {
    if (discussion && discussionId !== undefined) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [discussion]);

  const onSendClick = () => {
    setSubmitted(true);
    if (discussion && discussionId !== undefined) {
      setSubmitted(false);
      scriptWindowSendButton.current.click();
      setShow(false);
      props.handleClose();
      // dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_MODAL));
    }
  };
  const onSendFolderClick = () => {
    let postObject = [];
    filesShow.forEach((item) => {
      postObject.push({
        fileId: item.fileId,
        orgFolderId: item.folderId,
        orgChannelId: item.uploadedChannelId,
      });
    });

    setSubmitted(true);
    if (folder && folderId !== undefined) {
      setSubmitted(false);
      dispatch(forwardFileToFolder(folderId, postObject, dispatch));
      setShow(false);
      props.handleClose();
    }
  };

  const handleDiscussion = (filterDiscussion) => {
    if (typeof filterDiscussion === "object") {
      setDiscussion(filterDiscussion);
      setDiscussionId(
        filterDiscussion && filterDiscussion.id ? filterDiscussion.id : ""
      );
      setChannelType(
        filterDiscussion && filterDiscussion.type ? filterDiscussion.type : ""
      );
      setForwardSelectedChannelId(
        filterDiscussion && filterDiscussion.id ? filterDiscussion.id : ""
      );
      setDiscussionFound(true);
    } else if (typeof filterDiscussion === "string") {
      if (filterDiscussion === "") {
        setDiscussion("");
        setDiscussionId("");
        setChannelType("");
        setForwardSelectedChannelId("");
        setDiscussionFound(true);
      } else {
        var discussion = channelList.find(
          (discussionItem) => discussionItem.name === filterDiscussion
        );
        if (typeof discussion === "object") {
          setDiscussion(discussion);
          setDiscussionId(discussion && discussion.id ? discussion.id : "");
          setChannelType(
            filterDiscussion && filterDiscussion.type
              ? filterDiscussion.type
              : ""
          );
          setForwardSelectedChannelId(
            filterDiscussion && filterDiscussion.id ? filterDiscussion.id : ""
          );
          setDiscussionFound(true);
        } else {
          setDiscussion("");
          setDiscussionId("");
          setChannelType("");
          setForwardSelectedChannelId("");
          setDiscussionFound(false);
        }
      }
    } else {
      setDiscussion("");
      setDiscussionId("");
      setChannelType("");
      setForwardSelectedChannelId("");
    }
  };

  const getChannelList = (channelList) => {
    if (getForwardableFiles(filesShow, true)?.length > 0) {
      if (
        filesShow.some(
          (file) =>
            file.queryUserType === "INTERNAL" &&
            ((currentNetworkType === "EXTERNAL" &&
              file?.internalPermissionOoo !== "DL") ||
              (currentNetworkType === "INTERNAL" &&
                file.internalPermission !== "DL") ||
              file.internalPermissionOoo !== "DL") &&
            file.creatorId !== currentUser?.id
        )
      ) {
        return channelList
          .filter((channel) => {
            if (
              channel.type === "INTERNAL" &&
              channel.status !== "DELETED" &&
              channel.status !== "LOCKED"
            ) {
              return channel;
            }
          })
          .sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          );
      } else {
        return channelList.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
      }
    }
  };

  function getForwardableFiles(filesShow, isDiscussion) {
    if (isDiscussion) {
      return filesShow.filter(
        (el) =>
          !(
            el.fileForwardDisabled ||
            (el.creatorId !== currentUser?.id &&
              ((el.queryUserType === "INTERNAL" &&
                // (currentNetworkType === "INTERNAL" &&
                //   el?.internalPermission !== "DL") ||
                currentNetworkType === "EXTERNAL" &&
                el?.internalPermissionOoo !== "DL") ||
                (el.queryUserType === "EXTERNAL" &&
                  el?.externalPermission !== "DL")))
          )
      );
    } else {
      return filesShow.filter(
        (el) =>
          !(
            el.fileForwardDisabled ||
            el.uploadedFolderId === folderId ||
            (el.creatorId !== currentUser?.id &&
              ((el.queryUserType === "INTERNAL" &&
                // (currentNetworkType === "INTERNAL" &&
                //   el?.internalPermission !== "DL") ||
                currentNetworkType === "EXTERNAL" &&
                el?.internalPermissionOoo !== "DL") ||
                (el.queryUserType === "EXTERNAL" &&
                  el?.externalPermission !== "DL")))
          )
      );
    }
  }

  return (
    <StyledModal
      className={`files-forward-modal`}
      show={props.show}
      onHide={() => handleModalClose(true)}
      centered
      backdrop={"static"}
      keyboard={false}
    >
      <Modal.Header className={`attach-header border-none`}>
        <div className="modal-heading">
          <div className="heading">{t("file.forward:heading")}</div>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="close attachment-close"
              onClick={(e) => handleModalClose(true)}
            >
              <span aria-hidden="true">
                <img src={Close} alt="" />
              </span>
              <span className="sr-only">
                {t("rename.discussion.modal:close")}
              </span>
            </button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Header
        className={`attach-header ${
          filesShow?.length > 6 || applyCss ? "scrollable-y" : ""
        }`}
      >
        <Progress height="6px" progress={props.progress} />

        <div className="thumbnail-container">
          {filesShow.length > 0 &&
            filesShow.map(
              (
                {
                  file,
                  src,
                  fileId,
                  mimeType,
                  size,
                  name,
                  fileForwardDisabled,
                  creatorId,
                  queryUserType,
                  uploadedFolderId,
                  internalPermission,
                  externalPermission,
                  internalPermissionOoo,
                },
                index
              ) => (
                <div
                  className="d-flex flex-column"
                  key={`thumb-${fileId}-${index}`}
                >
                  <div id={`${fileId}-${index}`} className="thumbnail-wrapper">
                    <FileExt className="btn thumbnail">{`.${fileExtension(
                      mimeType
                    )}`}</FileExt>
                    <div className="input-group">
                      <input
                        className="form-control thumbnail-caption"
                        value={fileName.length > 0 && name}
                        // onChange={(e) => {
                        //   updateName(id, file, e.target.value);
                        // }}
                        readOnly
                        disabled={
                          props.status === UploadStatus.PENDING.toString()
                        }
                      />
                      {props.status !== UploadStatus.PENDING.toString() && (
                        <div className="input-group-append">
                          <span onClick={() => handleFileDelete(fileId)}>
                            <img src={Close} alt="" style={{ width: "13px" }} />
                          </span>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        height: "20px",
                        textAlign: "right",
                      }}
                    >
                      {Object.keys(props.uploaded).length > 0
                        ? Object.keys(props.uploaded).includes(
                            fileId.toString()
                          ) && (
                            <img
                              src={UploadedFileIcon}
                              alt=""
                              style={{
                                width: "20px",
                                height: "20px",
                                marginLeft: "20px",
                              }}
                            />
                          )
                        : ""}
                    </div>
                  </div>
                  {fileForwardDisabled && (
                    <div className="text-danger">
                      {t("file.forward:forwarding.prohibited")}
                    </div>
                  )}
                  {!fileForwardDisabled &&
                    creatorId !== currentUser?.id &&
                    ((queryUserType === "INTERNAL" &&
                      // (currentNetworkType === "INTERNAL" &&
                      //   internalPermission !== "DL") ||
                      currentNetworkType === "EXTERNAL" &&
                      internalPermissionOoo !== "DL") ||
                      (queryUserType === "EXTERNAL" &&
                        externalPermission !== "DL")) && (
                      <div className="text-danger">
                        {t("file.forward:forward.error")}
                      </div>
                    )}

                  {uploadedFolderId === folderId && (
                    <div className="text-danger">
                      {t("file.forward:forward.folder.error")}
                    </div>
                  )}
                  {internalPermission === PermissionConstants(t).VIEW ||
                  internalPermissionOOO === PermissionConstants(t).VIEW ||
                  externalPermission === PermissionConstants(t).VIEW ? (
                    fileConfig && fileConfig.mime.indexOf(mimeType) !== -1 ? (
                      size < getFileSizeBytes(fileConfig.maxfilesize) ? (
                        ""
                      ) : (
                        <div
                          className="text-primary"
                          style={{ height: "12px", marginBottom: "15px" }}
                        >
                          {t("upload.modal:not.support.view.only")}
                        </div>
                      )
                    ) : mimeType.split("/")[0] === "image" ||
                      mimeType === "application/pdf" ? (
                      ""
                    ) : (
                      <div
                        className="text-primary"
                        style={{ height: "12px", marginBottom: "15px" }}
                      >
                        {t("upload.modal:not.support.view.only")}
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              )
            )}
        </div>
      </Modal.Header>
      <Modal.Body className="m-pad">
        <div className="files-forward-modal-form">
          <div className="target-content">
            <div className="target-radio-btn-container">
              <input
                type="radio"
                id="DISCUSSION"
                style={{ display: "none" }}
                name="type"
                value="DISCUSSION"
                checked={type === "DISCUSSION"}
                className="target-radio-btn"
                onChange={(e) => {
                  setSubmitted(false);
                  setType(e.target.value);
                }}
              />{" "}
              <label
                className="search-label form-label  target-radio-btn-label col-form-label"
                htmlFor="DISCUSSION"
              >
                <span> {t("file.forward:discussion")}</span>
              </label>
              <input
                type="radio"
                id="FOLDER"
                name="type"
                style={{ display: "none" }}
                value="FOLDER"
                checked={type === "FOLDER"}
                className="target-radio-btn"
                onChange={(e) => {
                  setSubmitted(false);
                  setType(e.target.value);
                }}
              />
              <label
                className="search-label form-label  target-radio-btn-label col-form-label"
                htmlFor="FOLDER"
              >
                <span>{t("file.forward:folder")}</span>
              </label>
            </div>
          </div>
          {type === "DISCUSSION" ? (
            <Form.Group>
              <Form.Label>{t("file.forward:discussion.name")}</Form.Label>
              <div
                className={`${
                  submitted &&
                  (discussion === ""
                    ? "is-invalid"
                    : discussionId === undefined
                    ? "is-invalid"
                    : "")
                }`}
                // className={`${submitted && (assigneeId === undefined ? "is-invalid" : "") }`}
              >
                <DiscussionListSuggestions
                  handleChange={handleDiscussion}
                  className={`folder-input form-control ${
                    submitted &&
                    (discussion === ""
                      ? "is-invalid"
                      : discussionId === undefined
                      ? "is-invalid"
                      : "")
                  }`}
                  name="discussion"
                  channelList={getChannelList(channelList)}
                  placeholder={t("post.forward.modal:discussion.placeholder")}
                  value={discussion.name ? discussion.name : discussion}
                />
              </div>

              {submitted &&
                (discussion === "" ? (
                  !discussionFound ? (
                    <div className="invalid-feedback">
                      {t("post.forward.modal:error.discussionId")}
                    </div>
                  ) : discussionId === undefined ? (
                    <div className="invalid-feedback">
                      {t("post.forward.modal:error.discussionId")}
                    </div>
                  ) : (
                    <div className="invalid-feedback">
                      {t("post.forward.modal:error.discussion")}
                    </div>
                  )
                ) : (
                  ""
                ))}
            </Form.Group>
          ) : (
            <Form.Group>
              <Form.Label>{t("file.forward:folder.name")}</Form.Label>
              <div
                className={`${
                  submitted &&
                  (folder === ""
                    ? "is-invalid"
                    : folderId === undefined
                    ? "is-invalid"
                    : "")
                }`}
              >
                <FolderListSuggestions
                  handleChange={handleFolderList}
                  className={`member-add-input form-control ${
                    submitted &&
                    (folder === ""
                      ? "is-invalid"
                      : folderId === undefined
                      ? "is-invalid"
                      : "")
                  }`}
                  name="folder"
                  folderList={
                    getForwardableFiles(filesShow, false)?.length > 0
                      ? folderList
                      : []
                  }
                  placeholder={t("file.forward:folder.placeholder")}
                  value={
                    folder.name
                      ? folder.name
                      : folder.folderName
                      ? folder.folderName
                      : folder
                  }
                />
              </div>

              {submitted &&
                (folder === "" ? (
                  !folderFound ? (
                    <div className="invalid-feedback">
                      {t("file.forward:error.folder")}
                    </div>
                  ) : folderId === undefined ? (
                    <div className="invalid-feedback">
                      {t("file.forward:error.folder")}
                    </div>
                  ) : (
                    <div className="invalid-feedback">
                      {t("file.forward:required.folder")}
                    </div>
                  )
                ) : (
                  ""
                ))}
            </Form.Group>
          )}
          {type === "DISCUSSION" ? (
            <Form.Group className={`files-forward-add-notes mb-0`}>
              <Form.Label>{t("task.modal:add.notes")}</Form.Label>
              <MessagePost
                title={"Enter the note"}
                channel={discussion}
                post={props.postInfo ? props.postInfo : ""}
                fileListIDs={filesShow.map((file) => {
                  if (!file.fileForwardDisabled) {
                    return file.fileId;
                  }
                })}
                channelMembers={CommonUtils.getFilteredMembers(
                  globalMembers,
                  getLastSelectedChannelId()
                )}
                isFileForwardModal={true}
                creatorId={currentUser?.id}
                channelId={activeSelectedChannel?.id}
                fwdFilePost={props}
                refscriptWindowSendButton={scriptWindowSendButton}
                onTaskSendClick={onSendClick}
                fileForwarding={true}
                folderId={
                  activeMenuConfig?.folderId ? activeMenuConfig.folderId : ""
                }
              />
            </Form.Group>
          ) : (
            ""
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={(e) => handleModalClose(true)}>
          {t("upload.modal:cancel.button")}
        </CancelButton>

        {type === "DISCUSSION" && (
          <ShareButton
            variant="primary"
            className="footer-buttons"
            disabled={
              getForwardableFiles(filesShow, true).length < 1 ||
              discussion === ""
            }
            onClick={() => {
              return getForwardableFiles(filesShow, true).length < 1
                ? undefined
                : onSendClick();
            }}
          >
            {t("file.forward:forward")}
          </ShareButton>
        )}
        {type === "FOLDER" && (
          <ShareButton
            variant="primary"
            className="footer-buttons"
            disabled={
              getForwardableFiles(filesShow, false).length < 1 || folder === ""
            }
            onClick={() => {
              return getForwardableFiles(filesShow, false).length < 1
                ? undefined
                : onSendFolderClick();
            }}
          >
            {t("file.forward:forward")}
          </ShareButton>
        )}
      </Modal.Footer>
    </StyledModal>
  );
}

export default FilesForwardModal;
