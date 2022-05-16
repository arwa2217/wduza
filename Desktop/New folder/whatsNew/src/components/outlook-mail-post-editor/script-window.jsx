import React, { useState, useEffect, useRef } from "react";
import "./ScriptWindow.css";
import FileUploadHelper from "./attachment-toolbar/file-upload-helper";
import AttachFileModal from "./attachment-toolbar/attach-file-modal";
import styled from "styled-components";
import AttachmentToolbarView from "./attachment-toolbar/attachment-toolbar-view";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import { useDispatch, useSelector } from "react-redux";
import { clearTyping } from "../../store/actions/user-typing-actions";
import post from "@toolbar/post.svg";
import file from "@toolbar/file.svg";
import "katex/dist/katex.css";
import "highlight.js/styles/xt256.css";
import { useTranslation } from "react-i18next";
import { postEmailType } from "../../outlook/config";
import AttachmentButton from "./attachment-toolbar/attachment-button";
import Editor from "./editor";
import AttachmentForwardToolbarView from "./attachment-toolbar/attachment-forward-toolbar-view";
import { Alert } from "@material-ui/lab";
const ScriptWindowStyle = styled.div`
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
  position: relative;
  font-weight: 400 !important;
  display: block;
  overflow-y: hidden;
  height: 100%;
  textarea {
    display: none;
  }
`;
const maxSize = 3000000;
function ScriptWindow(props) {
  const {
    showModal,
    setFileId,
    files,
    uploaded,
    status,
    onSubmit,
    onChangeAttach,
    hideModal,
    updateFileList,
    updateFileName,
    progress,
    fileName,
    reset,
    remove,
    fileId,
    DeleteFile,
    setIsFileAdded,
    pending,
    totalFiles,
    rejected,
  } = FileUploadHelper();
  const {
    attachmentsForward = [],
    setAttachmentsForward,
    editor,
    attachError,
    isForwardToEmail,
  } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const UserDetails = useSelector(
    (state) => state.userTypingReducer.userTypingData
  );

  //get state active write email panel
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer.postEmailType
  );
  const isWriteEmail =
    postEmailTypeReducer === postEmailType.newEmail ||
    postEmailTypeReducer === postEmailType.newEmailInPopup ||
    postEmailTypeReducer === postEmailType.editDraftEmail;
  const [sendStyle, setSendStyle] = useState({
    width: "32px",
    height: "32px",
    overflow: "hidden",
    backgroundColor: "var(--primary__light)!important",
    borderRadius: "4px",
  });
  const [state, setState] = useState(props.postContent);
  const [error, setError] = useState("");
  const [fileIcon, setFileIcon] = useState(file);
  let userTypingRef;
  const removeFile = (id, outlookId) => {
    setError("");
    remove(id, outlookId).then((result) => {
      if (result.success) {
        if (result.remainingFile.length === 0) {
          reset();
        } else {
          DeleteFile(id);
        }
      }
    });
  };
  function onSendClick() {
    let totalSize = 0;
    const attachments = files.map((attachFile) => {
      const { contentBytes = "", file } = attachFile;
      const { name, type, size } = file;
      totalSize = totalSize + size;
      return {
        "@odata.type": "#microsoft.graph.fileAttachment",
        contentBytes,
        contentType: type,
        name,
      };
    });
    if (totalSize >= maxSize) {
      return setError(t(`outlook.mail.validate:attach.max.size`));
    }
    const { value = "" } = editor?.current;
    if (value || attachments.length || attachmentsForward.length) {
      if (props.isOutLookForward) {
        props.onMsgSend(value, attachmentsForward);
      } else {
        props.onMsgSend(value, attachments);
      }
    }
  }

  useEffect(() => {
    if (UserDetails && UserDetails.channelId) {
      OnUserTypingEvent();
    }
  }, [UserDetails.channelId]);

  function OnUserTypingEvent(e) {
    clearUserTypingEvent();
    userTypingRef = setTimeout(() => {
      dispatch(clearTyping());
    }, 2000);
  }

  function clearUserTypingEvent(e) {
    clearTimeout(userTypingRef);
  }

  useEffect(() => {
    if (props.postContent) {
      setState(props.postContent);
    } else {
      setState("");
    }
  }, [props.postContent]);

  const handleSaveDraft = () => {
    let totalSize = 0;
    const attachments = files.map((attachFile) => {
      const { contentBytes = "", file } = attachFile;
      const { name, type, size } = file;
      totalSize = totalSize + size;
      return {
        "@odata.type": "#microsoft.graph.fileAttachment",
        contentBytes,
        contentType: type,
        name,
      };
    });
    if (totalSize >= maxSize) {
      return setError(t(`outlook.mail.validate:attach.max.size`));
    }
    const { value = "" } = editor?.current;
    props.saveDraftMail(value, attachments);
  };
  useEffect(() => {
    setSendStyle({
      width: "32px",
      height: "32px",
      overflow: "hidden",
      backgroundColor: "var(--primary)",
      borderRadius: "4px",
      //opacity: 0.4,
    });
    setFileIcon(file);
  }, [state, status]);

  let hiddenAttachmentWrapper = "";
  if (isForwardToEmail) {
    hiddenAttachmentWrapper = "d-none";
    if (attachError) {
      hiddenAttachmentWrapper = "";
    }
  }
  return (
    <ScriptWindowStyle
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      isReply={props.isReply}
      postEmailType={postEmailTypeReducer}
      className="script-window"
    >
      {postEmailTypeReducer && (
        <Editor
          state={state}
          editor={editor}
          setState={setState}
          isWriteEmail={isWriteEmail}
        />
      )}
      {status === UploadStatus.FILES_UPLOADED.toString() && (
        <AttachmentToolbarView
          updateFileList={updateFileList}
          setFileId={setFileId}
          files={files}
          fileName={fileName}
          removeFile={removeFile}
          setIsFileAdded={setIsFileAdded}
          totalFiles={totalFiles}
          error={error}
        />
      )}
      <div className={`attachment-wrapper ${hiddenAttachmentWrapper}`}>
        {attachmentsForward.length > 0 && (
          <AttachmentForwardToolbarView
            attachments={attachmentsForward}
            setAttachmentsForward={setAttachmentsForward}
          />
        )}
      </div>
      <div
        className={`${
          props.classNameToolbar ? props.classNameToolbar : "wrapper-btns"
        }`}
        style={{ position: "absolute", right: 0, bottom: 3, zIndex: 2 }}
      >
        <button className="ql-attachFile mr-2 mt-1 p-0 bg-transparent border-0">
          <AttachmentButton
            onChangeAttach={onChangeAttach}
            handleFile={onSubmit}
            fileIcon={fileIcon}
          />
        </button>
        <button
          className={"btn-send p-0 border-0"}
          onClick={onSendClick}
          style={sendStyle}
          ref={props.refscriptWindowSendButton}
        >
          <img src={post} alt="send" />
        </button>
        <button
          className="d-none"
          ref={props.buttonRef}
          onClick={handleSaveDraft}
        >
          click
        </button>
      </div>
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
          channel={props.channel}
          DeleteFile={DeleteFile}
          setIsFileAdded={setIsFileAdded}
          fileId={fileId}
          pending={pending}
          totalFiles={totalFiles}
        />
      )}
    </ScriptWindowStyle>
  );
}

export default React.memo(ScriptWindow);
