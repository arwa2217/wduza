import React from "react";
import { connect } from "react-redux";
import { fetchHistoryDetails } from "../../../store/actions/task-actions";
import { withTranslation } from "react-i18next";
import activeTodo from "../../../assets/icons/task-modal-icons/task-todo.svg";
import activeAssign from "../../../assets/icons/task-modal-icons/task-assign.svg";
import activeDone from "../../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../../assets/icons/v2/ic_filter_s.svg";
import activeCancel from "../../../assets/icons/task-modal-icons/canceled.svg";
import taskDropdown from "../../../assets/icons/task-modal-icons/task_arrow_down_s.svg";
import DefaultUser from "../../../assets/icons/default-user.svg";
import { taskConstants } from "../../../constants/task";
import SVG from "react-inlinesvg";

import Dropdown from "react-bootstrap/Dropdown";
class TaskHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      // taskStatus: this.props.taskInfo?.taskStatus,
    };
  }

  handleToggle = (isOpen, event, metadata) => {
    if (isOpen || metadata.source !== "select") {
      if (isOpen) {
        this.props.fetchHistoryDetails(this.props.post.id);
      }
      this.setState({ show: isOpen });
    }
    // event.persist();
  };

  getTaskStatusCase = (taskStatus) => {
    const { t } = this.props;
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

  render() {
    const { t, taskStatus } = this.props;
    return (
      <Dropdown
        onToggle={this.handleToggle}
        show={this.state.show}
        className="task-status-dropdown"
      >
        <Dropdown.Toggle
          variant=""
          id="dropdown-task-history"
          className={`task-status task-btn-${taskStatus?.toLowerCase()}`}
        >
          <SVG
            src={
              this.props.taskStatus === taskConstants.TODO
                ? activeTodo
                : this.props.taskStatus === taskConstants.ASSIGN
                ? activeAssign
                : this.props.taskStatus === taskConstants.INPROGRESS
                ? activeProgress
                : this.props.taskStatus === taskConstants.DONE
                ? activeDone
                : this.props.taskStatus === taskConstants.PENDING
                ? activePending
                : this.props.taskStatus === taskConstants.CANCELED
                ? activeCancel
                : ""
            }
          />
          {this.getTaskStatusCase(this.props.taskStatus)}
          <SVG className="task-dropdown" src={taskDropdown}/>
        </Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white"
        >
          <Dropdown.Header className="menu-header">
            {t("postInfo:postTask:history.header")}
          </Dropdown.Header>
          <div className="dropdown-content">
            <div className="list-group">
              {this.props.taskHistory &&
                this.props.taskHistory.length > 0 &&
                this.props.taskHistory
                  .sort(function (x, y) {
                    return (
                      new Date(y.taskStateEventTime) -
                      new Date(x.taskStateEventTime)
                    );
                  })
                  .map((task) => {
                    let taskUpdatedBy = this.props.members.filter(
                      (member) => member.id === task.taskStateUpdatedBy
                    );
                    return (
                      <div className="list-group-item" key={task.taskId}>
                        <span>
                          <img
                            src={
                              taskUpdatedBy.length > 0
                                ? taskUpdatedBy[0].userImg === ""
                                  ? DefaultUser
                                  : taskUpdatedBy[0].userImg
                                : DefaultUser
                            }
                            alt=""
                          />
                        </span>
                        <span className="task-user">
                          {taskUpdatedBy.length > 0
                            ? taskUpdatedBy[0].screenName
                            : "Unknown"}
                        </span>
                        &nbsp;
                        {task.taskState === taskConstants.TODO ? (
                          <span>
                            {t("task.history:created.a.prefix")}
                            <span
                              className={`task-text-${task.taskState.toLowerCase()}`}
                            >
                              {this.getTaskStatusCase(task.taskState)}
                            </span>
                            &nbsp;
                            {t("task.history:created.a.suffix")}
                            {t("task.history:task")}{" "}
                          </span>
                        ) : task.taskState === taskConstants.ASSIGN ||
                          task.taskState === taskConstants.INPROGRESS ||
                          task.taskState === taskConstants.DONE ? (
                          <span>
                            {t("task.history:a.task.prefix")}
                            <span
                              className={`task-text-${task.taskState.toLowerCase()}`}
                            >
                              {this.getTaskStatusCase(task.taskState)}{" "}
                            </span>{" "}
                            {t("task.history:a.task.suffix")}
                          </span>
                        ) : (
                          <span>
                            {t("task.history:change.status.prefix")}{" "}
                            <span
                              className={`task-text-${task.taskState.toLowerCase()}`}
                            >
                              {this.getTaskStatusCase(task.taskState)}
                            </span>{" "}
                            {t("task.history:change.status.suffix")}
                          </span>
                        )}
                        <span className="task-divider">|</span>
                        <span className="task-time">
                          {`${t("postTime-12", {
                            time: task.taskStateEventTime,
                          })}`}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
function mapStateToProps(state) {
  return {
    loadingTask: state.tasksReducer.loadingTask,
    taskHistory: state.tasksReducer.taskHistory,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchHistoryDetails: (postId) =>
      dispatch(fetchHistoryDetails(postId, dispatch)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TaskHistory));
