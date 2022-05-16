import { useState, useRef } from "react";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import { useTranslation } from "react-i18next";
import { taskConstants } from "../../../constants/task";
import todo from "../../../assets/icons/task-modal-icons/to-do.svg";
import assign from "../../../assets/icons/task-modal-icons/assign.svg";
import done from "../../../assets/icons/task-modal-icons/done.svg";
import pending from "../../../assets/icons/task-modal-icons/pending.svg";
import inProgress from "../../../assets/icons/task-modal-icons/inProgress.svg";
import canceled from "../../../assets/icons/task-modal-icons/canceled.svg";
import activeTodo from "../../../assets/icons/task-modal-icons/active-todo.svg";
import activeAssign from "../../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../../assets/icons/task-modal-icons/active-cancel.svg";
import SVG from "react-inlinesvg";
import taskIcon from "../../../assets/icons/v2/ic_task.svg";
import taskIconActive from "../../../assets/icons/v2/ic_task_act.svg";

function PostTaskMenu(props) {
  const { t } = useTranslation();
  const [taskState, setTaskState] = useState(props.taskInfo?.taskStatus);
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const target = useRef(null);
  const handleTaskStatusChange = (status) => {
    if (!props.postToTask) {
      setTaskState(status);
    }
  };
  const handleToggle = (open, event) => {
    setShow(open);
  };
  return (
    <div ref={ref} className={`post-tag-menu`}>
      <Dropdown show={show} autoClose={true} onToggle={handleToggle}>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          <span
            style={{
              width: "120px",
              display: "flex",
              alignItems: "center",
              margin: "0",
              padding: 0,
            }}
            className={`icon-action ${ !show ? "" : "tag-selected"}`}
          >
            {!show ? <SVG src={taskIcon} /> : <SVG src={taskIconActive} />}
            <span style={{ paddingLeft: "9px" }}>Task</span>
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          // show={show}
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white"
        >
          <Dropdown.Header className="menu-header">
            {t("postInfo:postTask:header")}
          </Dropdown.Header>
          <div className="dropdown-content">
            <div className="dropdown-content">
              <Dropdown.Item style={{ display: "contents", padding: "0" }}>
                <div className="task-modal">
                  <button
                    onClick={(e) => {
                      props.onClick(e, taskConstants.TODO, props.postToTask);
                      handleTaskStatusChange(taskConstants.TODO);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.TODO ? "task-state" : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={taskState === taskConstants.TODO ? activeTodo : todo}
                      alt={t("task.modal:status.buttons:todo")}
                    />
                    {t("task.modal:status.buttons:todo")}
                  </button>
                  <button
                    onClick={(e) => {
                      props.onClick(e, taskConstants.ASSIGN, props.postToTask);
                      handleTaskStatusChange(taskConstants.ASSIGN);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.ASSIGN ? "task-state" : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        taskState === taskConstants.ASSIGN
                          ? activeAssign
                          : assign
                      }
                      alt={t("task.modal:status.buttons:assign")}
                    />
                    {t("task.modal:status.buttons:assign")}
                  </button>
                  <button
                    onClick={(e) => {
                      props.onClick(
                        e,
                        taskConstants.INPROGRESS,
                        props.postToTask
                      );
                      handleTaskStatusChange(taskConstants.INPROGRESS);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.INPROGRESS ? "task-state" : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        taskState === taskConstants.INPROGRESS
                          ? activeProgress
                          : inProgress
                      }
                      alt={t("task.modal:status.buttons:progress")}
                    />
                    {t("task.modal:status.buttons:progress")}
                  </button>
                  <button
                    onClick={(e) => {
                      props.onClick(e, taskConstants.DONE, props.postToTask);
                      handleTaskStatusChange(taskConstants.DONE);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.DONE ? "done-state" : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={taskState === taskConstants.DONE ? activeDone : done}
                      alt={t("task.modal:status.buttons:done")}
                    />
                    {t("task.modal:status.buttons:done")}
                  </button>
                  <button
                    onClick={(e) => {
                      props.onClick(e, taskConstants.PENDING, props.postToTask);
                      handleTaskStatusChange(taskConstants.PENDING);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.PENDING
                        ? "pending-cancel-state"
                        : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        taskState === taskConstants.PENDING
                          ? activePending
                          : pending
                      }
                      alt={t("task.modal:status.buttons:pending")}
                    />
                    {t("task.modal:status.buttons:pending")}
                  </button>
                  <button
                    onClick={(e) => {
                      props.onClick(
                        e,
                        taskConstants.CANCELED,
                        props.postToTask
                      );
                      handleTaskStatusChange(taskConstants.CANCELED);
                    }}
                    className={`status-buttons d-flex ${
                      taskState === taskConstants.CANCELED
                        ? "pending-cancel-state"
                        : ""
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        taskState === taskConstants.CANCELED
                          ? activeCancel
                          : canceled
                      }
                      alt={t("task.modal:status.buttons:canceled")}
                    />
                    {t("task.modal:status.buttons:canceled")}
                  </button>
                </div>
              </Dropdown.Item>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Overlay
        placement="top"
        onHide={() => {
          setShow(false);
        }}
      >
        {(props) => (
          <Tooltip id="tag-icon-tooltip" className="hidden-xs" {...props}>
            {t("postInfo:tooltip.task.post")}
          </Tooltip>
        )}
      </Overlay>
    </div>
  );
}
export default PostTaskMenu;
