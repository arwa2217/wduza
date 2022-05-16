import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import ScriptWindowToolbar, {
  formats,
  modulesShareFilesModal,
} from "./script-window-toolbar";
import "react-quill/dist/quill.snow.css";
import "./ScriptWindow.css";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import post from "@toolbar/post.svg";
// import file from "@toolbar/file.svg";
import file from "@toolbar/file_icon.svg";
import { PostEditResetAction } from "../../store/actions/edit-post-actions";
import "katex/dist/katex.css";
import "highlight.js/styles/xt256.css";

const ScriptWindowStyle = styled.div`
  background-color: #fff;
  border: 1px solid #dedede;
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  margin-bottom: ${(props) => (props.isReply ? "0" : "20px")};
  font-weight: 400 !important;
  height: 100%;
  &:focus-within {
    border: ${(props) =>
      props.isReply ? "1px solid #DEDEDE;" : "1px solid #DEDEDE;"};
    color: var(--grey__dark);
  }

  .user-typing {
    position: fixed;
    color: #f36e3a;
    font-size: 12px;
    font-weight: 100;
    padding-left: 20px;
    padding-top: 2px;
  }

  .ql-editor {
    min-height: 65px;
    max-height: ${(props) => (props.isReply ? "130px" : "260px")};
    margin: ${(props) => (props.isReply ? "10px 0 0" : "0")};
    word-break: break-word;
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
`;
function ScriptWindowShare(props) {
  const dispatch = useDispatch();
  const [sendStyle, setSendStyle] = useState({
    width: "32px",
    height: "32px",
    overflow: "hidden",
    backgroundColor: "var(--primary__light)",
    borderRadius: "4px",
  });
  const [state, setState] = useState(props.content);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 768);
  const quillRef = useRef(null);
  const [resetIcons, setResetIcons] = useState(true);
  const [fileIcon, setFileIcon] = useState(file);
  const cleanHtml = (html) => {
    // Clean spaces between tags
    if (html === null) {
      return "";
    }
    var newText = html.replace(
      /(<(pre|script|style|textarea)[^]+?<\/\2)|(^|>)\s+|\s+(?=<|$)/g,
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
    if (props.isEditing && props.postContent === newText) {
      return null;
    }
    // Return the clean Text
    return newText;
  };

  const handleChange = (value) => {
    props.setContent(cleanHtml(value));
    setState(value);
    quillRef.current && quillRef.current.focus();
  };

  function onCancelClick() {
    dispatch(PostEditResetAction());
  }

  function onSendClick() {
    // eslint-disable-next-line array-callback-return
    // return cleanHtml(state);
    //CASE: edit post, no text changed, file updated
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
  }

  function onKeyPressed(e) {
    if (isDesktop && e.keyCode === 13 && !e.shiftKey) {
      var elements = document.getElementsByClassName("ql-tooltip");
      if (
        elements.length > 0 &&
        elements[0].classList.value.indexOf("ql-hidden") === -1
      ) {
        elements[0].classList.add("ql-hidden");
      }
      onSendClick();
    }
  }

  useEffect(() => {
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
    quillRef.current && quillRef.current.focus();
    window.addEventListener("resize", updateMedia);
    return () => {
      window.removeEventListener("resize", updateMedia);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    setState(cleanHtml(props.content));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.content]);

  useEffect(() => {
    if (cleanHtml(state)) {
      if (state) {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          backgroundColor: "var(--primary)",
          borderRadius: "4px",
        });
      } else {
        setSendStyle({
          width: "32px",
          height: "32px",
          overflow: "hidden",
          backgroundColor: "var(--primary)",
          borderRadius: "4px",
          opacity: 0.4,
        });
      }
      setFileIcon(file);
    } else {
      setSendStyle({
        width: "32px",
        height: "32px",
        overflow: "hidden",
        backgroundColor: "var(--primary)",
        borderRadius: "4px",
        opacity: 0.4,
      });

      setFileIcon(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 768);
  };

  return (
    <ScriptWindowStyle>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={state}
        onKeyDown={onKeyPressed}
        onChange={handleChange}
        placeholder={props.title === "" ? "" : props.title}
        modules={modulesShareFilesModal}
        formats={formats}
      />
      <ScriptWindowToolbar
        onSendClick={onSendClick}
        onCancelClick={onCancelClick}
        state={state}
        sendStyle={sendStyle}
        postImg={post}
        fileIcon={fileIcon}
        isEditing={props.isEditing}
        isReply={props.isReply}
        isTaskModal={props.isTaskModal}
        taskOnToolbar={props.taskOnToolbar}
        refscriptWindowSendButton={props.refscriptWindowSendButton}
        userType={props.userType}
        parentPostVal={props.parentPostId ? props.parentPostId : ""}
        isPostForwardModal={props.isPostForwardModal}
        isFileForwardModal={props.isFileForwardModal}
        isShareFilesModal={props.isShareFilesModal}
        expandBlock={false}
      />
    </ScriptWindowStyle>
  );
}

export default ScriptWindowShare;
