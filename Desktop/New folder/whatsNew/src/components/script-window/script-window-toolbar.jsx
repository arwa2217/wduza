import React, { useState } from "react";
import styled from "styled-components";
import AttachmentButton from "./attachment-toolbar/attachment-button";
import ReactQuill from "react-quill";
// import vertical_break from "@toolbar/vertical_break.svg";
import divider_vertical from "@toolbar/divider.svg";
import "./mention/mention.js";
import MentionIcon from "../../assets/icons/v2/ic_mention.svg";
import { store } from "../../store/store";
import edit_cancel from "../../assets/icons/edit-cancel.svg";
import edit_save from "../../assets/icons/edit-save.svg";
import taskIcon from "../../assets/icons/taskIcon.svg";
import newEmailIcon from "../../assets/icons/new-email.svg";
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
import SendActive from "../../assets/icons/v2/ic_send_active.svg";
import IconExpand from "../../assets/icons/v2/ic_expand.svg";
import IconContract from "../../assets/icons/v2/ic_contract.svg";
import { useDispatch } from "react-redux";
import ModalActions from "../../store/actions/modal-actions";
import CommonUtils from "../utils/common-utils";
import {
  getForwardSelectedChannelId,
  getLastSelectedChannelId,
} from "../../utilities/app-preference";
// import CancelIcon from "../../assets/icons/v2/ic_cancel.svg";
import close from "../../assets/icons/close.svg";
import SVG from "react-inlinesvg";
import sendIcon from "../../assets/icons/v2/ic_send.svg";

const ExpandBlock = styled.div`
  display: flex;
  align-items: center;
  .expand-block {
    display: flex;
    align-items: center;
    min-width: 70px;
    margin-top: 1px;
    margin-right: 17px;
    cursor: pointer;
    .icon-expand {
      margin-left: 13px;
      margin-top: 2px;
    }
    .icon-contract {
      margin-left: 8px;
      margin-top: 1px;
    }
    .title {
      color: rgba(0, 0, 0, 0.4);
      font-size: 12px;
      font-weight: 500;
    }
  }
  .expand-block:hover .title {
    color: #03bd5d;
  }
  .expand-block:hover .icon-expand path {
    fill: #03bd5d;
    fill-opacity: 0.8;
  }
  .expand-block:hover .icon-contract path {
    fill: #03bd5d;
    fill-opacity: 0.8;
  }
`;

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
    handleShiftEnter: {
      key: 13,
      shiftKey: true,
      handler: function (range, context) {
        return true;
      },
    },
    handleEnter: {
      key: 13,
      handler: function (range, context) {
        // Do nothing in case of desktop screens
        if (
          Object.keys(context.format).includes("list") &&
          this.quill.editor.delta.ops[this.quill.editor.delta.ops.length - 1]
            .insert === "\n" &&
          Object.keys(
            this.quill.editor.delta.ops[this.quill.editor.delta.ops.length - 1]
              .attributes
          ).includes("list")
        ) {
          this.quill.editor.delta.ops.splice(-1);
        }
        if (context.suffix === "") {
          return true;
        } else {
          return !(window.innerWidth > 768);
        }
      },
    },
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
export const modulesFileForwardModal = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarFileForwardModal",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
  mention: subModuleForwardMention,
};
export const modulesShareFilesModal = {
  magicUrl: { ...linkUrlRegex },
  syntax: subModuleSyntax,
  toolbar: {
    container: "#toolbarShareFilesModal",
    handlers: subModuleToolbarHandler,
  },
  history: subModuleHistory,
  clipboard: subModuleClipboard,
  keyboard: subModuleKeyboard,
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
  "task",
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
];

const ToolBarBlockLeft = styled.div`
  display: flex;
  align-items: center;
  margin: 12px 9px;
  width: 100%;
  .divider_vertical {
    margin: 2px 15px 0 15px;
  }
  .ql-bold,
  .ql-italic,
  .ql-underline,
  .ql-code-block {
    padding-right: 17px !important;
    margin-top: 2px;
  }
  .ql-attachFile {
    padding-right: 11px !important;
  }
  .ql-list {
    padding-right: 13px !important;
  }
  .ql-formats button.ql-active svg path {
    fill: #6bbc98;
    // stroke: none;
  }
  .ql-formats button:hover svg path {
    fill: #6bbc98;
    // stroke: none;
  }
`;

const ButtonSendMessBlock = styled.div`
  padding-right: 5px;
`;

// Quill Toolbar component
function QuillToolbar(props) {
  const [fileIcon, setFileIcon] = useState(props.fileIcon);
  const { t } = useTranslation();
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

  const showEmailModal = (e) => {
    e.preventDefault();
    const modalType = ModalTypes.POST_FORWARD_TO_EMAIL_MODAL;
    const modalProps = {
      show: true,
      closeButton: true,
      ...props,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };
  //Remove Default Toolbar icons
  var icons = ReactQuill.Quill.import("ui/icons");

  icons["task"] = ToolbarIcons.TASK;
  icons["bold"] = ToolbarIcons.BOLD;
  icons["italic"] = ToolbarIcons.ITALICS;
  icons["underline"] = ToolbarIcons.UNDERLINED;
  icons["link"] = ToolbarIcons.LINK;
  icons["list"] = ToolbarIcons.LIST;
  icons["code-block"] = ToolbarIcons.CODE_BLOCK;
  icons["onAt"] = ToolbarIcons.MENTION;
  icons["num-list"] = ToolbarIcons.NUMBER_LIST;
  icons["check"] = ToolbarIcons.CHECK;

  return (
    <>
      <div
        id={
          props?.isReply
            ? "toolbarReply" + props.parentPostVal
            : props.isTaskModal
            ? "toolbarTaskModal"
            : props.isPostForwardModal
            ? "toolbarPostForwardModal"
            : props.isFileForwardModal
            ? "toolbarFileForwardModal"
            : props.isShareFilesModal
            ? "toolbarShareFilesModal"
            : props.isEditing
            ? "toolbarEditPost"
            : "toolbarDefault"
        }
        className="w-100"
      >
        <ToolBarBlockLeft className="left-wrapper__block">
          <div className="mention-attach-file__block">
            <span className="ql-formats">
              {!props.isPostForwardModal &&
                !props.isFileForwardModal &&
                !props.isShareFilesModal && (
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
                    <button className="ql-attachFile">
                      <AttachmentButton
                        onChangeAttach={props.onChangeAttach}
                        handleFile={props.handleFile}
                        fileIcon={fileIcon}
                        refAttachmentFileButton={props.refAttachmentFileButton}
                      />
                    </button>
                  </OverlayTrigger>
                )}
              {!props.isShareFilesModal && (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip id={t("script.window:mention")}>
                      {t("script.window:mention")}
                    </Tooltip>
                  }
                >
                  <button className="ql-onAt" onClick={props.onMentionClick} />
                </OverlayTrigger>
              )}
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
                <button hidden className="ql-onEmoji" />
              </OverlayTrigger>
              <button className="divider_vertical">
                <img src={divider_vertical} alt="break" />
              </button>
            </span>
          </div>
          <div className="ql-formats__block">
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
                      <Popover.Content
                        onClick={
                          props.userType !== "GUEST"
                            ? showEmailModal
                            : undefined
                        }
                      >
                        <div id="content">
                          <img
                            src={newEmailIcon}
                            alt="newEmailIcon"
                            width="14"
                            height="14"
                          />
                          Email
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
                <button className="ql-bold" />
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
                <button className="ql-italic" />
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
                <button className="ql-underline" />
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
                <button className="ql-code-block" />
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
                <button className="ql-link" />
              </OverlayTrigger>
              <button disabled className="divider_vertical">
                <img src={divider_vertical} alt="break" />
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
                <button className="ql-list" value="bullet" />
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
                <button className="ql-list ql-num-list" value="ordered" />
              </OverlayTrigger>
              {!props.isTaskModal &&
                !props.isShareFilesModal &&
                !props.isFileForwardModal && (
                  <>
                    <button disabled className="divider_vertical">
                      <img src={divider_vertical} alt="break" />
                    </button>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 150, hide: 100 }}
                      trigger={["hover", "focus"]}
                      overlay={
                        <Tooltip id={t("script.window:check")}>
                          {t("Task")}
                        </Tooltip>
                      }
                    >
                      <button
                        className="ql-check"
                        onClick={
                          props.userType !== "GUEST" ? showTaskModal : undefined
                        }
                      />
                    </OverlayTrigger>
                  </>
                )}
            </span>
          </div>
        </ToolBarBlockLeft>
        {props.expandBlock && (
          <ExpandBlock>
            {props.isExpand ? (
              <button className="expand-block" onClick={props.onClickExpand}>
                <SVG
                  src={IconContract}
                  alt="ic-expand"
                  className="icon-contract"
                />
                <p className="title">Contract</p>
              </button>
            ) : (
              <button className="expand-block" onClick={props.onClickExpand}>
                <SVG src={IconExpand} alt="ic-expand" className="icon-expand" />
                <p className="title">Expand</p>
              </button>
            )}
          </ExpandBlock>
        )}

        <ButtonSendMessBlock className="btn-send-message">
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
                props.isTaskModal ||
                props.isPostForwardModal ||
                props.isFileForwardModal ||
                props.isShareFilesModal
                  ? "d-none"
                  : "send-icon"
              }
              onClick={props.onSendClick}
              ref={props.refscriptWindowSendButton}
            >
              {/*<img src={props.postImg} alt="send" />*/}
              {props.isEditing && <img src={edit_save} alt="save" />}
              {!props.isEditing && (
                <div>
                  <SVG
                    src={
                      (props.state !== null && props.state !== "<p><br></p>") ||
                      props.fileIds.length > 0
                        ? SendActive
                        : sendIcon
                    }
                  />
                </div>
              )}
            </button>
          </OverlayTrigger>
        </ButtonSendMessBlock>
      </div>
      {props.editingPostId !== "" && props.isTaskModal && (
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
            <SVG src={close} alt="cancel-edit" />
          </button>
        </OverlayTrigger>
      )}
    </>
  );
}

export default QuillToolbar;
