/* eslint-disable jsx-a11y/anchor-is-valid */
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { taskConstants } from "../../constants/task";
import todo from "../../assets/icons/task-modal-icons/to-do.svg";
import assign from "../../assets/icons/task-modal-icons/assign.svg";
import done from "../../assets/icons/task-modal-icons/done.svg";
import pending from "../../assets/icons/task-modal-icons/pending.svg";
import inProgress from "../../assets/icons/task-modal-icons/inProgress.svg";
import canceled from "../../assets/icons/task-modal-icons/canceled.svg";
import activeTodo from "../../assets/icons/task-modal-icons/active-todo.svg";
import taskTodo from "../../assets/icons/task-modal-icons/todo-task.svg";
import activeAssign from "../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../assets/icons/task-modal-icons/active-cancel.svg";

const TaskFilters = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.selectedValue);
  const [selectedAssignee, setSelectedAssignee] = useState(
    props.selectedAssignee
  );
  const { t } = useTranslation();
  const getTaskStatusCase = (taskStatus) => {
    return taskStatus === taskConstants.TODO
      ? t("task.modal:status.buttons:todo")
      : taskStatus === taskConstants.ASSIGN
      ? t("task.modal:status.buttons:assign")
      : taskStatus === taskConstants.INPROGRESS
      ? t("task.modal:status.buttons:progress")
      : taskStatus === taskConstants.DONE
      ? t("task.modal:status.buttons:done")
      : taskStatus === taskConstants.PENDING
      ? t("task.modal:status.buttons:pending")
      : taskStatus === taskConstants.CANCELED
      ? t("task.modal:status.buttons:canceled")
      : "";
  };

  const getTaskStatusImageCase = (taskStatus) => {
    return taskStatus === taskConstants.TODO
      ? taskTodo
      : taskStatus === taskConstants.ASSIGN
      ? activeAssign
      : taskStatus === taskConstants.INPROGRESS
      ? activeProgress
      : taskStatus === taskConstants.DONE
      ? activeDone
      : taskStatus === taskConstants.PENDING
      ? activePending
      : taskStatus === taskConstants.CANCELED
      ? activeCancel
      : "";
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="d-flex justify-content-between">
      <div className="d-flex flex-wrap filter-list">
        {selectedValue.length > 0 &&
          selectedValue.map((value) => (
            <button className={`btn task-btn-${value.toLowerCase()}`}>
              <img
                src={getTaskStatusImageCase(value)}
                alt={getTaskStatusCase(value)}
              />
              {getTaskStatusCase(value)}
              <span
                className="close_btn"
                onClick={() => {
                  props.handleClick(value, "REMOVE");
                  // setSelectedValue("");
                }}
              >
                &times;
              </span>
            </button>
          ))}
        {selectedAssignee && (
          <button
            className="btn btn-primary"
            // style={{
            // 	border: "1px solid #dddddd",
            // 	background: "#03BD5D",
            // 	color: "#ffffff",
            // }}
          >
            {selectedAssignee === "ASSIGN_BY_ME"
              ? t("task.modal:assign.by.me")
              : selectedAssignee === "ASSIGN_ME"
              ? t("task.modal:assign.to.me")
              : ""}
            <span
              className="close_btn"
              // style={{
              // 	fontSize: "19px",
              // 	lineHeight: "10px",
              // 	fontWeight: "normal",
              // }}
              onClick={() => {
                props.handleAssignee("");
                setSelectedAssignee("");
              }}
            >
              &times;
            </span>
          </button>
        )}
      </div>
      <a
        href
        className="filter__icon"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </a>
    </div>
  ));

  useEffect(() => {
    setSelectedValue(props.selectedValue);
  }, [props.selectedValue]);

  return (
    <div className="post-tag-menu post-tag-menu-filter post-task-menu-filter">
      <Dropdown>
        <Dropdown.Toggle
          menuAlign="right"
          as={CustomToggle}
          id="dropdown-button-drop-left"
        ></Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white"
        >
          <Dropdown.Header className="menu-header">
            {t("click.to.task.status")}
          </Dropdown.Header>
          <div className="dropdown-content">
            <div className="dropdown-content">
              <div className="task-modal">
                <div className="user-filter">
                  <button
                    onClick={(e) => {
                      if (selectedAssignee === "ASSIGN_ME") {
                        props.handleAssignee("");
                        setSelectedAssignee("");
                      } else {
                        props.handleAssignee("ASSIGN_ME");
                        setSelectedAssignee("ASSIGN_ME");
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedAssignee === "ASSIGN_ME"
                        ? "task-user-filter-active"
                        : ""
                    }`}
                  >
                    {t("task.modal:assign.to.me")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedAssignee === "ASSIGN_BY_ME") {
                        props.handleAssignByMe("");
                        setSelectedAssignee("");
                      } else {
                        props.handleAssignByMe("ASSIGN_BY_ME");
                        setSelectedAssignee("ASSIGN_BY_ME");
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedAssignee === "ASSIGN_BY_ME"
                        ? "task-user-filter-active"
                        : ""
                    }`}
                  >
                    {t("task.modal:assign.by.me")}
                  </button>
                </div>
                <div className="general-filter">
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.TODO)) {
                        props.handleClick(taskConstants.TODO, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.TODO);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.TODO)
                        ? `task-state`
                        : ``
                    } `}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.TODO)
                          ? activeTodo
                          : todo
                      }
                      alt={t("task.modal:status.buttons:todo")}
                    />
                    {t("task.modal:status.buttons:todo")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.ASSIGN)) {
                        props.handleClick(taskConstants.ASSIGN, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.ASSIGN);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.ASSIGN)
                        ? `task-state`
                        : ``
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.ASSIGN)
                          ? activeAssign
                          : assign
                      }
                      alt={t("task.modal:status.buttons:assign")}
                    />
                    {t("task.modal:status.buttons:assign")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.INPROGRESS)) {
                        props.handleClick(taskConstants.INPROGRESS, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.INPROGRESS);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.INPROGRESS)
                        ? `task-state`
                        : ``
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.INPROGRESS)
                          ? activeProgress
                          : inProgress
                      }
                      alt={t("task.modal:status.buttons:progress")}
                    />
                    {t("task.modal:status.buttons:progress")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.DONE)) {
                        props.handleClick(taskConstants.DONE, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.DONE);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.DONE)
                        ? `done-state`
                        : ``
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.DONE)
                          ? activeDone
                          : done
                      }
                      alt={t("task.modal:status.buttons:done")}
                    />
                    {t("task.modal:status.buttons:done")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.PENDING)) {
                        props.handleClick(taskConstants.PENDING, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.PENDING);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.PENDING)
                        ? `pending-cancel-state`
                        : ``
                    }`}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.PENDING)
                          ? activePending
                          : pending
                      }
                      alt={t("task.modal:status.buttons:pending")}
                    />
                    {t("task.modal:status.buttons:pending")}
                  </button>
                  <button
                    onClick={(e) => {
                      if (selectedValue.includes(taskConstants.CANCELED)) {
                        props.handleClick(taskConstants.CANCELED, "REMOVE");
                      } else {
                        props.handleClick(taskConstants.CANCELED);
                      }
                    }}
                    className={`status-buttons d-flex ${
                      selectedValue.includes(taskConstants.CANCELED)
                        ? `pending-cancel-state`
                        : ``
                    }`}
                    style={{ marginBottom: "0" }}
                  >
                    <img
                      className="icons"
                      src={
                        selectedValue.includes(taskConstants.CANCELED)
                          ? activeCancel
                          : canceled
                      }
                      alt={t("task.modal:status.buttons:canceled")}
                    />
                    {t("task.modal:status.buttons:canceled")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default TaskFilters;
