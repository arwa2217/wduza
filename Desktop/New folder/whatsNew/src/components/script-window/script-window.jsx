import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import ScriptWindowToolbar, {
  modulesDefault,
  modulesTaskModal,
  modulesPostForwardModal,
  modulesEditPost,
  modulesReply,
  formats,
  modulesFileForwardModal,
  modulesShareFilesModal,
} from "./script-window-toolbar";
import "react-quill/dist/quill.snow.css";
import "./ScriptWindow.css";
import FileUploadHelper from "./attachment-toolbar/file-upload-helper";
import AttachFileModal from "./attachment-toolbar/attach-file-modal";
import styled from "styled-components";
import AttachmentToolbarView from "./attachment-toolbar/attachment-toolbar-view";
import { UploadStatus } from "../../constants/channel/file-upload-status";
import { userTypeAction } from "../../store/actions/websocket-actions";
import { useDispatch, useSelector } from "react-redux";
import { clearTyping } from "../../store/actions/user-typing-actions";
import post from "@toolbar/send.svg";
// import file from "@toolbar/file.svg";
import file from "../../assets/icons/v2/ic_attach_inactive.svg";
import { uniqueID } from "../../utilities/utils";
import { PostEditResetAction } from "../../store/actions/edit-post-actions";
import "katex/dist/katex.css";
import "highlight.js/styles/xt256.css";
import { useTranslation } from "react-i18next";

import CryptoJS from "crypto-js";
import { fileStorageDetails } from "../../store/actions/files-actions";
import { CLEAR_USER_MENTION } from "../../store/actionTypes/user-mention-action-types";
// import { Box, Button, makeStyles } from "@material-ui/core";
// import classNames from "classnames";
// import closeReplyIcon from "../../assets/icons/v2/close.svg";
// import FormatQuoteIcon from "@material-ui/icons/FormatQuote";

// import SVG from "react-inlinesvg";
// import moment from "moment";
import { store } from "../../store/store";
import CommonUtils from "../utils/common-utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import { toggleEditor } from "../../store/actions/channelMessagesAction";

const ScriptWindowStyle = styled.div`
  background-color: #fff;
  border: ${(props) =>
    props.isEsignForwarding ? "none !important" : "1px solid #cccccc;"};
  border-left: ${(props) => (props.isReply ? "1px solid #DEDEDE;" : "0")};
  border-right: ${(props) => (props.isReply ? "1px solid #DEDEDE;" : "0")};
  box-sizing: border-box;
  position: relative;
  font-weight: 400 !important;
  width: 100%;
  &:focus-within {
    color: var(--grey__dark);
  }
  .ql-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .user-typing {
    position: absolute;
    left: 50%;
    top: -24px;
    transform: translateX(-50%);
    color: #fff;
    font-size: 10px;
    line-height: 1;
    font-weight: 100;
    padding: 5px 8px;
    margin: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(6px);
    border-radius: 12px;
    max-width: 560px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ql-editor {
    min-height: 49px;
    max-height: ${(props) => (props.isReply ? "130px" : "260px")};
    margin: ${(props) => (props.isReply ? "10px 0 0" : "0")};
    word-break: break-word;
    padding: 10px 16px 10px 18px !important;
  }

  /* Track */
  .ql-editor::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  .ql-editor::-webkit-scrollbar-thumb {
    background: transparent;
  }

  .ql-editor:hover,
  .ql-editor:active,
  .ql-editor:focus,
  .ql-editor:focus-within {
    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.5);
    }
  }
  .ql-onCancel {
    position: absolute;
    right: -8px;
    top: -65px;
    border: none;
    background: none;
  }
`;
let alreadyTyping;
function ScriptWindow(props) {
  const {
    showModal,
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
    internalPermission,
    externalPermission,
    DeleteFile,
    setIsFileAdded,
    pending,
    totalFiles,
    rejected,
    isEditing,
  } = FileUploadHelper();
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const UserDetails = useSelector(
    (state) => state.userTypingReducer.userTypingData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [sendStyle, setSendStyle] = useState({
    width: "32px",
    height: "32px",
    overflow: "hidden",
    backgroundColor: "var(--primary__light)",
    borderRadius: "4px",
  });
  const quillId = uniqueID();
  const [state, setState] = useState(props.postContent);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 768);
  const quillRef = useRef(null);
  const [resetIcons, setResetIcons] = useState(true);
  const [channelId, setChannelId] = useState(null);
  const [channelName, setChannelName] = useState(null);
  const [fileIcon, setFileIcon] = useState(file);
  const [isExpand, setExpand] = useState(false);
  const { userMention } = useSelector((state) => state.userMentionReducer);
  const editingPostId = useSelector((state) => state.editPostReducer.postId);
  let userTypingRef;
  const cleanHtml = (html) => {
    // Clean spaces between tags
    if (html === null) {
      return "";
    }

    var newText = html.replace(
      // eslint-disable-next-line no-regex-spaces
      /( < (pre | script | style | textarea)[^] +?< \/\2) | (^ |> )\s +  | \s + (?=<| $)/g,
      "$1$3"
    );
    if (
      newText === "<p> </p>" ||
      newText === "<p>  </p>" ||
      newText === "<p>   </p>"
    ) {
      return "";
    }
    // Clean empty paragraphs before the content
    // <p><br/><p> && <p></p>
    var slicer;
    while (
      newText.slice(0, 7) === "<p></p>" ||
      newText.slice(0, 11) === "<p><br></p>"
    ) {
      if (newText.slice(0, 7) === "<p></p>") slicer = 7;
      else slicer = 11;
      newText = newText.substring(slicer, newText.length);
    }

    // Clean empty paragraphs after the content
    while (
      newText.slice(-7) === "<p></p>" ||
      newText.slice(-11) === "<p><br></p>"
    ) {
      if (newText.slice(-7) === "<p></p>") slicer = 7;
      else slicer = 11;
      newText = newText.substring(0, newText.length - slicer);
    }
    if (newText.slice(-5) === "</ul>") {
      newText = newText.replace("<li><br></li></ul>", "</ul>");
    }
    if (newText.slice(-5) === "</ol>") {
      newText = newText.replace("<li><br></li></ol>", "</ol>");
    }
    if (newText.includes("ql-indent-")) {
      for (let i = 1; i < 10; i++) {
        if (newText.includes("ql-indent-" + i)) {
          if (newText.slice(-5) === "</ol>") {
            newText = newText.replace(
              `<li class="ql-indent-${i}"><br></li></ol>`,
              "</ol>"
            );
          }
          if (newText.slice(-5) === "</ul>") {
            newText = newText.replace(
              `<li class="ql-indent-${i}"><br></li></ul>`,
              "</ul>"
            );
          }
        }
      }
    }
    if (isEditing && props.postContent === newText) {
      return null;
    }
    // Return the clean Text
    return newText;
  };

  const handleChange = (value) => {
    setState(value);
  };

  const removeFile = (id) => {
    remove(id, props.channel?.id).then((result) => {
      if (result.success) {
        if (result.remainingFile.length === 0) {
          reset();
        } else {
          DeleteFile(id);
        }
      }
    });
  };
  function onCancelClick() {
    dispatch(PostEditResetAction());
    props.updateShowReplies(undefined, undefined);
  }
  function onClickExpand() {
    setExpand(!isExpand);
  }
  function onSendClick() {
    let fileIds = fileId.map((fileId) => {
      if (uploaded[fileId.id] !== undefined) {
        return fileId;
      } else {
        return { id: -1 };
      }
    });
    fileIds = fileIds.filter((fileId) => fileId.id !== -1);
    dispatch(fileStorageDetails());
    let delta = quillRef.current.editor.getContents();
    let mentionIds = [];
    // eslint-disable-next-line array-callback-return
    delta.ops.map((data) => {
      if (data.insert && data.insert.mention) {
        if (mentionIds.indexOf(data.insert.mention.id) === -1) {
          mentionIds.push(data.insert.mention.id);
        }
      }
    });
    let data = cleanHtml(state);
    //CASE: edit post, no text changed, file updated
    if (
      data === null &&
      status === UploadStatus.FILES_UPLOADED.toString() &&
      !props.isTaskModal
    ) {
      props.onMsgSend(
        props.postContent,
        mentionIds,
        fileIds,
        files,
        internalPermission,
        externalPermission,
        fileName
      );
      reset();
      setState(null);
    } else if (data === null && props.isTaskModal) {
      if (status === UploadStatus.FILES_UPLOADED.toString()) {
        props.onMsgSend(
          props.postContent ? props.postContent : "",
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );

        reset();
        setState(null);
      } else {
        props.onMsgSend(props.postContent ? props.postContent : "", mentionIds);
        setState(null);
      }
    } else if ((data === "" || data === "undefined") && props.isTaskModal) {
      if (status === UploadStatus.FILES_UPLOADED.toString()) {
        props.onMsgSend(
          data,
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );

        reset();
        setState(null);
      } else {
        props.onMsgSend(data, mentionIds);
        setState(null);
      }
    } else if (
      (data === "" || data === "undefined") &&
      props.isPostForwardModal
    ) {
      if (status === UploadStatus.FILES_UPLOADED.toString()) {
        props.onMsgSend(
          props.postContent ? props.postContent : "",
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );

        reset();
        setState(null);
      } else {
        props.onMsgSend(props.postContent ? props.postContent : "", mentionIds);
        setState(null);
      }
    } else if (
      (data === "" || data === "undefined") &&
      props.isFileForwardModal
    ) {
      if (status === UploadStatus.FILES_UPLOADED.toString()) {
        props.onMsgSend(
          props.postContent ? props.postContent : "",
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );

        reset();
        setState(null);
      } else if (
        (data === "" || data === "undefined") &&
        props.isShareFilesModal
      ) {
        // if (status === UploadStatus.FILES_UPLOADED.toString()) {
        //   props.onMsgSend(
        //     props.postContent ? props.postContent : "",
        //     mentionIds,
        //     fileIds,
        //     files,
        //     internalPermission,
        //     externalPermission,
        //     fileName
        //   );
        //   reset();
        //   setState(null);
      } else {
        props.onMsgSend(props.postContent ? props.postContent : "", mentionIds);
        setState(null);
      }
    } else if (
      data !== null &&
      data.length === 0 &&
      props.isTaskModal &&
      !isEditing
    ) {
      if (status === UploadStatus.FILES_UPLOADED.toString()) {
        props.onMsgSend(
          props.postContent ? props.postContent : "",
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );

        reset();
        setState(null);
      } else {
        props.onMsgSend(props.postContent ? props.postContent : "", mentionIds);
        setState(null);
      }
    } else {
      if (data !== null && data.length !== 0) {
        //CASE: edit or normal post, text changed, file updated
        if (status === UploadStatus.FILES_UPLOADED.toString()) {
          props.onMsgSend(
            data,
            mentionIds,
            fileIds,
            files,
            internalPermission,
            externalPermission,
            fileName
          );

          reset();
          setState(null);
        } else {
          //CASE: edit or normal post, text changed, no file updated
          props.onMsgSend(data, mentionIds);
          setState(null);
        }
      }
      if (
        data !== null &&
        data.length === 0 &&
        status === UploadStatus.FILES_UPLOADED.toString()
      ) {
        //CASE: normal or edit post, no text changed,but file updated
        props.onMsgSend(
          data,
          mentionIds,
          fileIds,
          files,
          internalPermission,
          externalPermission,
          fileName
        );
        reset();
        setState(null);
      }
    }
    dispatch(toggleEditor(false, undefined));
  }

  useEffect(() => {
    if (UserDetails && UserDetails.channelId) {
      OnUserTypingEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserDetails.channelId]);

  function OnUserTypingEvent(e) {
    clearUserTypingEvent();
    userTypingRef = setTimeout(() => {
      dispatch(clearTyping());
    }, 3000);
  }

  function clearUserTypingEvent(e) {
    clearTimeout(userTypingRef);
  }

  function isFunctionKey(e) {
    switch (e.keyCode) {
      case 8:
      case 9:
      case 13:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 27:
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
      case 45:
      case 91:
      case 92:
      case 93:
      case 112:
      case 113:
      case 114:
      case 115:
      case 116:
      case 117:
      case 118:
      case 119:
      case 120:
      case 121:
      case 122:
      case 123:
      case 144:
      case 145:
        return true;
      default:
        return false;
    }
  }

  function onKeyPressed(e) {
    if (e.keyCode === 13 && userMention) {
      dispatch({
        type: CLEAR_USER_MENTION,
      });
      return;
    }

    if (
      e.keyCode !== 13 &&
      !isFunctionKey(e) &&
      !isEditing &&
      alreadyTyping === null
    ) {
      let timerId = setTimeout(() => {
        alreadyTyping = null;
      }, 5000);
      alreadyTyping = timerId;
      userTypeAction(props.channel?.id);
    }

    if (isDesktop && e.keyCode === 13 && !e.shiftKey) {
      var elements = document.getElementsByClassName("ql-tooltip");
      if (
        elements.length > 0 &&
        elements[0].classList.value.indexOf("ql-hidden") === -1
      ) {
        elements[0].classList.add("ql-hidden");
      }
      if (
        props.isTaskModal ||
        props.isPostForwardModal ||
        props.isFileForwardModal ||
        props.isShareFilesModal
      ) {
        props.onTaskSendClick();
      } else {
        onSendClick();
      }
    }
  }

  useEffect(() => {
    window.onunload = function () {
      sessionStorage.clear(props.channel?.id);
    };

    if (
      !props.postContent &&
      !props.isPostForwardModal &&
      !props.isFileForwardModal &&
      !props.isShareFilesModal
    ) {
      if (
        channelId !== props.channel?.id &&
        !props.isReply &&
        !props.isTaskModal
      ) {
        alreadyTyping = null;
        if (state !== null && state !== "") {
          let storeData = CryptoJS.AES.encrypt(state, props.userId);
          sessionStorage.setItem(channelId, storeData);
        }
        let getData = sessionStorage.getItem(props.channel?.id);
        setState(
          getData !== null
            ? CryptoJS.AES.decrypt(getData, props.userId).toString(
                CryptoJS.enc.Utf8
              )
            : getData
        );
        setChannelId(props.channel?.id);
        setChannelName(props.channel?.name);
        // if (quillRef.current != null) {
        //   quillRef.current.editor.root.dataset.placeholder =
        //     props.title === ""
        //       ? ""
        //       : props.title ||
        //         t("post:post.to", { channel: props.channel.name });
        // }
        reset();
      }
    }

    if (channelName !== props.channelName) {
      setChannelName(props.channel?.name);
      // if (quillRef.current != null) {
      //   quillRef.current.editor.root.dataset.placeholder =
      //     props.title === ""
      //       ? ""
      //       : props.title || t("post:post.to", { channel: props.channel.name });
      // }
    }
    if (
      (quillRef.current && quillRef.current.props.value === null) ||
      (quillRef.current &&
        quillRef.current.props.value === "<p><br></p>" &&
        resetIcons === false)
    ) {
      setResetIcons(true);
    } else {
      setResetIcons(false);
    }
    if (
      quillRef &&
      !props.isPostForwardModal &&
      !props.isFileForwardModal &&
      !props.isShareFilesModal &&
      !props.minEditor
    ) {
      quillRef.current && quillRef.current.focus();
    }

    window.addEventListener("resize", updateMedia);
    return () => {
      window.removeEventListener("resize", updateMedia);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state,
    status,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    props.channel?.id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    props.channel?.name,
    props.minEditor,
  ]);

  useEffect(() => {
    if (cleanHtml(state)) {
      if (state) {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          // backgroundColor: "var(--primary)",
          // borderRadius: "4px",
        });
      } else {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          // backgroundColor: "var(--primary)",
          // borderRadius: "4px",
          opacity: 0.4,
        });
      }
      setFileIcon(file);
    } else {
      if (files.length > 0) {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          // backgroundColor: "var(--primary)",
          // borderRadius: "4px",
        });
      } else {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          // backgroundColor: "var(--primary)",
          // borderRadius: "4px",
          opacity: 0.4,
        });
      }

      setFileIcon(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, status]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 768);
  };
  useEffect(() => {
    setTimeout(() => {
      if (
        status === UploadStatus.FILES_UPLOADED.toString() &&
        !props.isTaskModal
      ) {
        quillRef.current.focus();
      }
    }, 500);
  }, [quillId, status]);
  function onMentionClick() {
    var length = quillRef.current.getEditor().getLength();
    var lastChar = quillRef.current.getEditor().getText(length);
    if (lastChar === " ") {
      let range = quillRef.current.getEditor().getSelection();
      let position = range ? range.index : 0;
      let nextChar = quillRef.current.getEditor().getText(position + 1);
      if (nextChar) {
        quillRef.current.getEditor().insertText(position, "@ ");
      } else {
        quillRef.current.getEditor().insertText(position, "@");
      }
    } else {
      let range = quillRef.current.getEditor().getSelection();
      let position = range ? range.index : 0;
      let nextChar = quillRef.current.getEditor().getText(position + 1);
      if (nextChar) {
        quillRef.current.getEditor().insertText(position, " @ ");
        quillRef.current.getEditor().setSelection(position + 2);
      } else {
        quillRef.current.getEditor().insertText(position, " @");
      }
    }
  }

  //set auto mention when reply
  useEffect(() => {
    setState(null);
    if (props.isReply && props.postInfo) {
      let id;
      if (props.postInfo?.parentPostContent?.creatorId) {
        id = props.postInfo.parentPostContent.creatorId;
      } else {
        id = props.postInfo.user.id;
      }
      // const {
      //   user: { id },
      // } = props.postInfo;
      // if (currentUser?.id !== id) {
      let state = store.getState();
      let members = CommonUtils.getFilteredMembers(
        state.memberDetailsReducer.memberData,
        getLastSelectedChannelId()
      );
      const userMention = members.find((item) => item.id === id);
      if (quillRef.current) {
        const mentionModule = quillRef.current.getEditor().getModule("mention");
        let value = userMention?.displayName;
        if (value === "") {
          value = userMention?.screenName;
        }
        if (value === "") {
          value = userMention?.firstName;
        }
        if (value === "") {
          value = userMention?.lastName;
        }
        const mentionItem = {
          ...userMention,
          value: value,
          commandChar: "@",
        };
        mentionModule.insertItem(mentionItem, true);
      }
      // }
    }
  }, [props.isReply]);

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
        if (!isEditing && !props.isPostForwardModal) {
          onChangeAttach(e);
        }
      }}
      isReply={props.isReply}
      isEsignForwarding={props.isEsignForwarding}
    >
      {!props.isReply &&
        !props.isTaskModal &&
        !props.isPostForwardModal &&
        !props.isFileForwardModal &&
        !props.isShareFilesModal && (
          <>
            {UserDetails && UserDetails.channelId ? (
              <p className="user-typing">
                {`${UserDetails.userName} is typing...`}
              </p>
            ) : (
              ""
            )}
          </>
        )}
      {/* <ChatBox className="chat-box"> */}
      <ReactQuill
        className={isExpand ? "chat-box-expand" : ""}
        ref={quillRef}
        theme="snow"
        value={state || props.postContent}
        onKeyDown={onKeyPressed}
        onChange={handleChange}
        placeholder={props.isEsignForwarding ? "Enter the note" : "Enter text"}
        modules={
          props.isReply
            ? modulesReply(props.parentPostId ? props.parentPostId : "")
            : props.isTaskModal
            ? modulesTaskModal
            : props.isPostForwardModal
            ? modulesPostForwardModal
            : props.isFileForwardModal
            ? modulesFileForwardModal
            : props.isShareFilesModal
            ? modulesShareFilesModal
            : isEditing
            ? modulesEditPost
            : modulesDefault
        }
        formats={formats}
      />
      {status === UploadStatus.FILES_UPLOADED.toString() && (
        <AttachmentToolbarView
          updateFileList={updateFileList}
          files={files}
          fileName={fileName}
          removeFile={removeFile}
          setIsFileAdded={setIsFileAdded}
          totalFiles={totalFiles}
        />
      )}
      {/* </ChatBox> */}
      <ScriptWindowToolbar
        handleFile={onSubmit}
        onChangeAttach={onChangeAttach}
        onSendClick={onSendClick}
        onCancelClick={onCancelClick}
        onClickExpand={onClickExpand}
        isExpand={isExpand}
        state={state}
        sendStyle={sendStyle}
        postImg={post}
        fileIcon={fileIcon}
        onMentionClick={onMentionClick}
        isEditing={isEditing}
        isReply={props.isReply}
        isTaskModal={props.isTaskModal}
        // taskOnToolbar={props.taskOnToolbar}
        refscriptWindowSendButton={props.refscriptWindowSendButton}
        refAttachmentFileButton={props.refAttachmentFileButton}
        userType={props.userType}
        parentPostVal={props.parentPostId ? props.parentPostId : ""}
        isPostForwardModal={props.isPostForwardModal}
        isFileForwardModal={props.isFileForwardModal}
        isShareFilesModal={props.isShareFilesModal}
        editingPostId={editingPostId}
        postContent={props.postContent}
        fileIds={fileId}
        expandBlock={true}
      />
      {/* {showModal && (
        <ShareFilesModal
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
      )} */}
      {/* {showModal && (
        <FilesForwardModal
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
          post={props.post}
        />
      )} */}
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
      {/* <ShareModal
        // data={modalProps()}
        // currentUser={currentUser}
        // closeModal={handleModalClose}
        showModal={false}
      /> */}
    </ScriptWindowStyle>
  );
}

export default ScriptWindow;
