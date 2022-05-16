import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ESignatureStyledModal } from "./create-esignature-modal.styles";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Close from "../../../assets/icons/close.svg";
import pdfImage from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import closeImage from "../../../assets/icons/v2/ic_input_close.svg";
import checkIcon from "../../../assets/icons/check.svg";
import activeCheckIcon from "../../../assets/icons/active-check.svg";
import DiscussionListSuggestions from "../../../components/post-forward/discussion-suggestion";
import FolderListSuggestions from "../../utils/folder-suggestion";

import {
  getLastSelectedChannelId,
  setForwardSelectedChannelId,
} from "../../../utilities/app-preference";
import CommonUtils from "../../utils/common-utils";
import MessagePost from "../../messages/messages-post";
import { forwardFileToFolder } from "../../../store/actions/folderAction";
import { setSelectedRows } from "../../../store/actions/esignature-actions";
import { getFileSize } from "../../utils/file-utility";

function ForwardESignatureModal(props) {
  const { t } = useTranslation();
  const [show, setShow] = useState(true);
  const [type, setType] = useState("DISCUSSION");
  const titleKey = t("esign.forward.modal:forward");
  const modalTitle = t(titleKey);
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const folderList = useSelector((state) => state.folderReducer.folderList);
  const [discussion, setDiscussion] = useState("");
  const [channelType, setChannelType] = useState("");

  const [folder, setFolder] = useState("");
  const [discussionId, setDiscussionId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [discussionFound, setDiscussionFound] = useState(true);
  const [folderFound, setFolderFound] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const scriptWindowSendButton = useRef(null);
  const activeMenuConfig = useSelector(
    (state) => state.config.activeFileMenuItem
  );
  let filesCopy = useRef([...props.selectedFiles]);
  const [filesShow, setFilesShow] = useState(filesCopy.current);
  const [fileName, setFileName] = useState(filesShow[0].fileName);
  const [fileSize, setFileSize] = useState(filesShow[0].size);
  const dispatch = useDispatch();

  const handleClose = () => {
    props.onModalHide();
  };

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

  const onSendClick = () => {
    setSubmitted(true);
    if (discussion && discussionId !== undefined) {
      setSubmitted(false);
      scriptWindowSendButton.current.click();
      dispatch(setSelectedRows([]));
      setShow(false);
      handleClose();
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
      dispatch(setSelectedRows([]));
      setShow(false);
      handleClose();
    }
  };

  const getChannelList = (channelList) => {
    return channelList
      .filter((i) => !i.isDeletable && i.type === "INTERNAL")
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
  };

  const onClose = () => {
    handleClose();
  };

  return (
    <>
      <ESignatureStyledModal show={show} onHide={handleClose} centered>
        <ModalHeader>
          <span> {modalTitle}</span>
          <button
            type="button"
            className="close"
            onClick={() => {
              props.onModalHide();
            }}
          >
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">
              {t("files:create.folder.modal:close")}
            </span>
          </button>
        </ModalHeader>
        <Modal.Body className="upload-modal-body">
          <div className="form-control-field">
            <div className="sign-name-image">
              <img style={{ width: "18px", marginRight : '8px' }} src={pdfImage} alt="pdf" />
              <input
                className="sign-name"
                type="text"
                value={fileName}
                readOnly
              />
            </div>
            <span className="upload-file-size mr-0">{getFileSize(fileSize)}</span>
            {/* <img src={closeImage} alt="close" onClick={onClose} /> */}
          </div>
          <div
            key={`default-radio`}
            className="form-control-radio forward-radio"
          >
            <div
              className={`d-flex align-items-center discussion-container ${
                type === "DISCUSSION" && `active-forward`
              } `}
              style={{
                marginRight: "16px",
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: "19px",
              }}
            >
              {type === "DISCUSSION" ? (
                <img
                  className="selected-type"
                  style={{ width: "14px", height: "14px" }}
                  src={activeCheckIcon}
                />
              ) : (
                <img
                  className="selected-type"
                  style={{ width: "14px", height: "14px" }}
                  src={checkIcon}
                />
              )}
              <span
                onClick={() => {
                  setType("DISCUSSION");
                }}
              >
                {t("esign.forward.modal:discussion")}
              </span>
            </div>
            <div
              className={`d-flex align-items-center folder-container ${
                type === "FOLDER" && `active-forward`
              } `}
              style={{
                cursor: "pointer",
                fontSize: "14px",
                lineHeight: "19px",
              }}
            >
              {type === "FOLDER" ? (
                <img
                  className="selected-type"
                  style={{ width: "14px", height: "14px" }}
                  src={activeCheckIcon}
                />
              ) : (
                <img
                  className="selected-type"
                  style={{ width: "14px", height: "14px" }}
                  src={checkIcon}
                />
              )}

              <span
                onClick={() => {
                  setType("FOLDER");
                }}
              >
                {t("esign.forward.modal:folder")}
              </span>
            </div>
          </div>
          <div style={{ width: "100%", position: "relative" }}>
            {type === "DISCUSSION" ? (
              <Form.Group className="forward-form-group">
                <div
                  className={`${
                    submitted &&
                    (discussion === ""
                      ? "is-invalid"
                      : discussionId === undefined
                      ? "is-invalid"
                      : "")
                  }`}
                >
                  <DiscussionListSuggestions
                    handleChange={handleDiscussion}
                    className={`folder-input form-control discussion-list forward-type ${
                      submitted &&
                      (discussion === ""
                        ? "is-invalid"
                        : discussionId === undefined
                        ? "is-invalid"
                        : "")
                    }`}
                    name="discussion"
                    channelList={getChannelList(channelList)}
                    placeholder="Enter discussion name"
                    value={discussion.name ? discussion.name : discussion}
                    isOpenDownArrow={true}
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
                <div
                  className={`forward-e-sign-top ${
                    submitted
                      ? folder === ""
                        ? "is-invalid"
                        : folderId === undefined
                        ? "is-invalid"
                        : ""
                      : ""
                  }`}
                >
                  <FolderListSuggestions
                    handleChange={handleFolderList}
                    className={`member-add-input form-control discussion-list forward-type ${
                      submitted
                        ? folder === ""
                          ? "is-invalid"
                          : folderId === undefined
                          ? "is-invalid"
                          : ""
                        : ""
                    }`}
                    name="folder"
                    folderList={folderList}
                    placeholder={t("file.forward:folder.placeholder")}
                    value={
                      folder.name
                        ? folder.name
                        : folder.folderName
                        ? folder.folderName
                        : folder
                    }
                    isOpenDownArrow={true}
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
              <Form.Group
                className={`mon-custom-scrollbar files-forward-add-notes mb-0 message-post-box`}
              >
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
                  isEsignForwarding={true}
                />
              </Form.Group>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          className="modal-upload-footer"
          style={{ border: "none" }}
        >
          {type === "DISCUSSION" && (
            <button
              className="create-sign-btn"
              onClick={() => {
                onSendClick();
              }}
              style={{ width: "92px", marginTop: "25px" }}
            >
              {t("esign.forward.modal:forward")}
            </button>
          )}
          {type === "FOLDER" && (
            <button
              className="create-sign-btn"
              onClick={() => {
                onSendFolderClick();
              }}
              style={{ width: "92px", marginTop: "25px" }}
            >
              {t("esign.forward.modal:forward")}
            </button>
          )}
        </Modal.Footer>
      </ESignatureStyledModal>
    </>
  );
}

export default ForwardESignatureModal;
