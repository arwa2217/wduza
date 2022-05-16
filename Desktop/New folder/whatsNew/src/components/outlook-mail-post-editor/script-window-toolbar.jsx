import React, { useState, useEffect } from "react";
import AttachmentButton from "./attachment-toolbar/attachment-button";
import ReactQuill from "react-quill";
import vertical_break from "@toolbar/vertical_break.svg";
import "./mention/mention.js";
import { store } from "../../store/store";
import edit_cancel from "../../assets/icons/edit-cancel.svg";
import edit_save from "../../assets/icons/edit-save.svg";
import taskIcon from "../../assets/icons/taskIcon.svg";
import todo from "../../assets/icons/task-modal-icons/to-do.svg";
import hljs from "highlight.js";
import "./linkify-blot";
import { MENTION_NAME_REGEX } from "../../constants";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { useTranslation } from "react-i18next";
import Tooltip from "react-bootstrap/Tooltip";
import Popover from "react-bootstrap/Popover";
import ToolbarIcons from "../../assets/icons/toolbar/script_toolbar";
import "./auto-linkify-blot";
import ModalTypes from "../../constants/modal/modal-type";

import { useDispatch } from "react-redux";
import ModalActions from "../../store/actions/modal-actions";
import CommonUtils from "../utils/common-utils";
import {
  getForwardSelectedChannelId,
  getLastSelectedChannelId,
} from "../../utilities/app-preference";

const linkUrlRegex = {
  globalRegularExpression:
    /(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?((?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/gi,
  urlRegularExpression:
    /(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?((?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/,
};

hljs.initHighlightingOnLoad();
// Modules object for setting up the Quill editor

const ALL_MENTION = {
  id: "all",
  screenName: "All",
  userImg: "",
  jobTitle: "",
  companyName: "",
  userType: "INTERNAL",
};

const subModuleSyntax = {
  highlight: (text) => hljs.highlightAuto(text).value,
};

const subModuleHistory = {
  delay: 300,
  maxStack: 100,
  userOnly: true,
};

const subModuleClipboard = {
  matchVisual: false,
};

const subModuleKeyboard = {
  bindings: {
    "list autofill": {
      prefix: /^\s{0,}(1){1,1}(\.|-|\*|\[ ?\]|\[x\])$/,
    },
    tab: false,
    /*handleEnter: {
      key: 13,
      handler: function (range, context) {
        // Do nothing in case of desktop screens
        if(context.suffix === ""){
          return true;
        }
        else{
          return !(window.innerWidth > 768);
        }

      },
    },*/
  },
};

const subModuleMention = {
  allowedChars: MENTION_NAME_REGEX,
  commandChars: ["@", "#"],
  defaultMenuOrientation: "top",
  isolateCharacter: true,
  source: function (searchTerm, renderList, mentionChar) {
    let values;
    let channelId;
    if (mentionChar === "@") {
      let state = store.getState();
      let members = CommonUtils.getFilteredMembers(
        state.memberDetailsReducer.memberData,
        getLastSelectedChannelId()
      );
      values = [ALL_MENTION, ...members];
      channelId = state.channelDetails.id;

      if (searchTerm.length === 0) {
        renderList(values, searchTerm, channelId);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (
            values[i].screenName
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1 ||
            values[i].screenName.indexOf(searchTerm) !== -1
          )
            matches.push(values[i]);
        renderList(matches, searchTerm, channelId);
      }
    }
  },
};

const subModuleForwardMention = {
  allowedChars: MENTION_NAME_REGEX,
  commandChars: ["@", "#"],
  defaultMenuOrientation: "bottom",
  isolateCharacter: true,
  source: function (searchTerm, renderList, mentionChar) {
    let values;
    let channelId;
    if (mentionChar === "@") {
      let state = store.getState();
      let members = [];
      if (
        getForwardSelectedChannelId() &&
        getForwardSelectedChannelId() === ""
      ) {
        members = CommonUtils.getFilteredMembers(
          state.memberDetailsReducer.memberData,
          getLastSelectedChannelId()
        );
      } else {
        members = CommonUtils.getFilteredMembers(
          state.memberDetailsReducer.memberData,
          getForwardSelectedChannelId()
        );
      }
      values = [ALL_MENTION, ...members];
      channelId = state.channelDetails.id;

      if (searchTerm.length === 0) {
        renderList(values, searchTerm, channelId);
      } else {
        const matches = [];
        for (let i = 0; i < values.length; i++)
          if (
            values[i].screenName
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1 ||
            values[i].screenName.indexOf(searchTerm) !== -1
          )
            matches.push(values[i]);
        renderList(matches, searchTerm, channelId);
      }
    }
  },
};

const subModuleToolbarHandler = {
  onSend: () => {},
  onEmoji: () => {},
  onAt: () => {},
};

export const modulesDefault = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarDefault",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
  mention: subModuleMention,
  //divider: true
};

export const modulesTaskModal = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarTaskModal",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
  mention: subModuleMention,
};
export const modulesPostForwardModal = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarPostForwardModal",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
  mention: subModuleForwardMention,
};

export const modulesEditPost = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarEditPost",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
  mention: subModuleMention,
};

export const modulesReply = (parentPostVal) => {
  return {
    magicUrl: { ...linkUrlRegex },
    syntax: subModuleSyntax,
    toolbar: {
      container: "#toolbarReply" + parentPostVal,
      handlers: subModuleToolbarHandler,
    },
    history: subModuleHistory,
    clipboard: subModuleClipboard,
    keyboard: subModuleKeyboard,
    mention: subModuleMention,
  };
};

// Formats objects for setting up the Quill editor

export const formats = [
  //"header",
  //"font",
  //"size",
  //"task",
  "bold",
  "italic",
  "underline",
  "align",
  //"strike",
  //"script",
  //"blockquote",
  //"background",
  "list",
  "bullet",
  "indent",
  "link",
  //"image",
  //"color",
  "code-block",
  "mention",
  "divider"
];

// Quill Toolbar component
function QuillToolbar(props) {
  const [fileIcon, setFileIcon] = useState(props.fileIcon);
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const showTaskModal = (e) => {
    e.preventDefault();
    document.body.click();
    const modalType = ModalTypes.TASK_MODAL;
    const modalProps = {
      show: true,
      closeButton: true,
      ...props,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };
  //Remove Default Toolbar icons
  //var icons = ReactQuill.Quill.import("ui/icons");

  // icons["task"] = ToolbarIcons.TASK;
/*
  icons["bold"] = ToolbarIcons.BOLD;
  icons["italic"] = ToolbarIcons.ITALICS;
  icons["underline"] = ToolbarIcons.UNDERLINED;
  icons["link"] = ToolbarIcons.LINK;
  icons["list"] = ToolbarIcons.LIST;
  icons["code-block"] = ToolbarIcons.CODE_BLOCK;
  icons["onAt"] = ToolbarIcons.MENTION;
  icons["num-list"] = ToolbarIcons.NUMBER_LIST;
*/

  return (
    <div
      id={
        props?.isReply
          ? "toolbarReply" + props.parentPostVal
          : props.isTaskModal
          ? "toolbarTaskModal"
          : props.isPostForwardModal
          ? "toolbarPostForwardModal"
          : props.isEditing
          ? "toolbarEditPost"
          : "toolbarDefault"
      }
      className="w-100"
    >
      <div className="row m-0">
        {/*<div className=" col-8 col-md-7 pl-0 pr-0">
          <span className="ql-formats">
            {props.taskOnToolbar && (
              <OverlayTrigger
                placement="top-start"
                trigger="click"
                rootClose
                overlay={
                  <Popover className="task-popover">
                    <Popover.Title>
                      {t("script.window:popover.title")}
                    </Popover.Title>
                    <Popover.Content
                      onClick={
                        props.userType !== "GUEST" ? showTaskModal : undefined
                      }
                    >
                      <div id="content">
                        <img src={taskIcon} alt="taskIcon" />
                        {t("script.window:task")}
                      </div>
                    </Popover.Content>
                  </Popover>
                }
              >
                <button className="ql-task mr-2 mt-1" />
              </OverlayTrigger>
            )}
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:bold")}>
                  {t("script.window:bold")}
                </Tooltip>
              }
            >
              <button className="ql-bold mr-2 mt-1" />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:italics")}>
                  {t("script.window:italics")}
                </Tooltip>
              }
            >
              <button className="ql-italic mr-2 mt-1" />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:underline")}>
                  {t("script.window:underline")}
                </Tooltip>
              }
            >
              <button className="ql-underline mr-2 mt-1" />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:code")}>
                  {t("script.window:code")}
                </Tooltip>
              }
            >
              <button className="ql-code-block mr-2 mt-1" />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:link")}>
                  {t("script.window:link")}
                </Tooltip>
              }
            >
              <button className="ql-link mr-2 mt-1" />
            </OverlayTrigger>
            <button disabled className="mr-3 ml-2 mt-1">
              <img src={vertical_break} alt="break" />
            </button>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:bullet")}>
                  {t("script.window:bullet")}
                </Tooltip>
              }
            >
              <button className="ql-list mr-2 mt-1" value="bullet" />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:number")}>
                  {t("script.window:number")}
                </Tooltip>
              }
            >
              <button
                className="ql-list ql-num-list mr-2 mt-1"
                value="ordered"
              />
            </OverlayTrigger>
          </span>
        </div>*/}
        <div className="col-12 col-md-12 text-right p-0">
          <span className="ql-formats">
            {/*<OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:mention")}>
                  {t("script.window:mention")}
                </Tooltip>
              }
            >
              <button
                className="ql-onAt mr-2 mt-1"
                onClick={props.onMentionClick}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("script.window:emoji")}>
                  {t("script.window:emoji")}
                </Tooltip>
              }
            >
              <button hidden className="ql-onEmoji mr-2 mt-1" />
            </OverlayTrigger>*/}
            {!props.isEditing && !props.isPostForwardModal && (
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 150, hide: 100 }}
                    trigger={["hover", "focus"]}
                    overlay={
                      <Tooltip id={t("script.window:attach")}>
                        {t("script.window:attach")}
                      </Tooltip>
                    }
                >
                  <button className="ql-attachFile mr-2 mt-1">
                    <AttachmentButton
                        onChangeAttach={props.onChangeAttach}
                        handleFile={props.handleFile}
                        fileIcon={fileIcon}
                    />
                  </button>
                </OverlayTrigger>
            )}
           {/* {props.isEditing && !props.isTaskModal && (
              <OverlayTrigger
                placement="top"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip id={t("script.window:cancel")}>
                    {t("script.window:cancel")}
                  </Tooltip>
                }
              >
                <button
                  onClick={props.onCancelClick}
                  className="ql-onCancel"
                  style={{
                    width: "40px",
                    height: "32px",
                    overflow: "hidden",
                    paddingBottom: 0,
                    paddingRight: 0,
                  }}
                >
                  <img src={edit_cancel} alt="cancel-edit" />
                </button>
              </OverlayTrigger>
            )}*/}

            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip
                  id={
                    props.isEditing
                      ? t("script.window:edit")
                      : t("script.window:send")
                  }
                >
                  {props.isEditing
                    ? t("script.window:edit")
                    : t("script.window:send")}
                </Tooltip>
              }
            >
              <button
                className={
                  props.isTaskModal || props.isPostForwardModal ? "d-none" : ""
                }
                onClick={props.onSendClick}
                // className="ql-onSend mr-2"
                style={props.sendStyle}
                ref={props.refscriptWindowSendButton}
              >
                {props.isEditing && <img src={edit_save} alt="save" />}
                {!props.isEditing && <img src={props.postImg} alt="send" />}
              </button>
            </OverlayTrigger>
          </span>
        </div>
      </div>
    </div>
  );
}

export default QuillToolbar;
