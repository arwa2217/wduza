import React, { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { taskConstants } from "../../constants/task";
import { useDispatch, useSelector } from "react-redux";
import MessagePost from "../messages/messages-post";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import todo from "../../assets/icons/task-modal-icons/to-do.svg";
import assign from "../../assets/icons/task-modal-icons/assign.svg";
import done from "../../assets/icons/task-modal-icons/done.svg";
import pending from "../../assets/icons/task-modal-icons/pending.svg";
import inProgress from "../../assets/icons/task-modal-icons/inProgress.svg";
import canceled from "../../assets/icons/task-modal-icons/canceled.svg";

import activeTodo from "../../assets/icons/task-modal-icons/active-todo.svg";
import activeAssign from "../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../assets/icons/task-modal-icons/active-cancel.svg";
import close from "../../assets/icons/close.svg";
import Suggestions from "../modal/channel/Suggestions.js";

import UserType from "../../constants/user/user-type";

import { useTranslation } from "react-i18next";

import "./task.css";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import CommonUtils from "../utils/common-utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import Post from "../post-view/post";

function TaskModal(props) {
  const { taskInfo } = props;
  const scriptWindowSendButton = useRef(null);
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  // const members = useSelector((state) => state.channelMembers.members);
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const [globalMembers, setGlobalMembers] = useState([]);
  useEffect(() => {
    setGlobalMembers(
      CommonUtils.getFilteredMembers(
        globalMembersList,
        getLastSelectedChannelId()
      )
    );
  }, [globalMembersList]);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  const assigneeData =
    globalMembersList &&
    globalMembersList.length > 0 &&
    globalMembersList.filter((member) => {
      return member.id === taskInfo?.taskAssignee;
    });

  const [title, setTaskTitle] = useState(taskInfo?.taskTitle || "");
  const [assignee, setAssignee] = useState(
    assigneeData && assigneeData.length > 0 ? assigneeData[0].screenName : ""
  );
  const [assigneeId, setAssigneeId] = useState(
    assigneeData && assigneeData.length > 0 ? assigneeData[0].id : ""
  );
  const [show, setShow] = useState(props.show);
  const [status, setStatus] = useState(
    taskInfo?.taskStatus || taskConstants.TODO
  );

  const [startTime, setStartTime] = useState(taskInfo?.taskStartTime || null);
  const [stopTime, setStopTime] = useState(taskInfo?.taskStopTime || null);
  const [dateIsInvalid, setDateIsInvalid] = useState(false);

  const dispatch = useDispatch();

  const onClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.TASK_MODAL));
  };

  useEffect(() => {
    if (props.postToTask) {
      onSendClick();
    }
  }, [props.postToTask]);

  const onSendClick = () => {
    setSubmitted(true);
    if (
      !props.postToTask &&
      assigneeId !== "" &&
      globalMembers.findIndex((member) => member.id === assigneeId) === -1
    ) {
      setAssigneeId(undefined);
      return;
    }
    let currentDateStart = new Date();
    currentDateStart.setHours(0, 0, 0, 0);
    let currentDateStop = new Date();
    currentDateStop.setHours(23, 59, 0, 0);
    let startValue = startTime;
    if (startTime instanceof Date) {
      startValue = startTime.getTime();
    }
    let stopValue = stopTime;
    if (stopTime instanceof Date) {
      stopValue = stopTime.getTime();
    }
    if (
      startValue !== null &&
      stopValue !== null &&
      startValue !== "" &&
      stopValue !== "" &&
      (currentDateStart.getTime() > startValue ||
        currentDateStop.getTime() > stopValue)
    ) {
      setDateIsInvalid(true);
      return;
    }

    if (title) {
      setSubmitted(false);

      scriptWindowSendButton.current.click();
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.TASK_MODAL));
    }
  };

  const handleAssignee = (member) => {
    if (member === "") {
      setAssignee("");
      setAssigneeId("");
    } else {
      setAssignee(member);
      setAssigneeId(member.id);
    }
  };
  const handleStartDate = (date) => {
    if (date === null) {
      setStopTime(null);
      setStartTime(null);
      setDateIsInvalid(false);
    } else {
      setDateIsInvalid(false);
      setStartTime(date);

      if (
        stopTime === null ||
        (stopTime && date && Date.parse(date) > stopTime)
      ) {
        let endDate = new Date(Date.parse(date) + 86340000);
        setStopTime(endDate);
      }
    }
  };

  const handleStopDate = (date) => {
    if (date === null) {
      setStopTime(null);
      setStartTime(null);
      setDateIsInvalid(false);
    } else {
      setDateIsInvalid(false);
      let endDate = date;
      if (stopTime === null) {
        endDate = new Date(Date.parse(date) + 86340000);
      }
      setStopTime(endDate);

      if (
        startTime === null ||
        (startTime && date && Date.parse(date) < startTime)
      ) {
        let startDate = new Date(Date.parse(date));
        setStartTime(startDate);
      }
    }
  };

  const getMembers = (memberList) => {
    return memberList && memberList.length > 0
      ? memberList.filter((member) => member.userType !== "GUEST")
      : [];
  };
  console.log('props.postInfo',props.postInfo)
  return (
    <Modal
      className={`task-modal ${props.postToTask ? "d-none" : ""}`}
      show={show}
      centered
    >
      <Modal.Header className="m-pad">
        <Modal.Title>
          {t("task.modal:header")}
          <img
            src={close}
            alt="subtract"
            onClick={onClose}
            className="cross-image"
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="m-pad">
        <div className="task-modal-form">
          <Form.Group>
            <Form.Label>
              {t("task.modal:title")} <span className="text-primary">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={title}
              placeholder={t("task.modal:title.placeholder")}
              onChange={(e) =>
                currentUser.userType === UserType.GUEST
                  ? null
                  : setTaskTitle(e.target.value)
              }
              className={submitted && title === "" ? "is-invalid" : ""}
            />
            {submitted && title === "" && (
              <div className="invalid-feedback">
                {t("task.modal:error.title")}
              </div>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("task.modal:assignee")}</Form.Label>
            <div
              className={`${
                submitted && (assigneeId === undefined ? "is-invalid" : "")
              }`}
            >
              <Suggestions
                handleChange={
                  currentUser.userType === UserType.GUEST
                    ? null
                    : handleAssignee
                }
                className={`member-add-input form-control ${
                  submitted && assigneeId === undefined ? "is-invalid" : ""
                }`}
                isAtRequired={true}
                name="assignee"
                members={getMembers(globalMembers)}
                useCachedData={true}
                placeholder={t("task.modal:assignee.placeholder")}
                value={assignee.screenName ? assignee.screenName : assignee}
              />
            </div>

            {submitted &&
              (assigneeId === undefined ? (
                <div className="invalid-feedback">
                  {t("task.modal:error.assigneeId")}
                </div>
              ) : (
                ""
              ))}
          </Form.Group>
          <Form.Group className="task-status-group">
            <Form.Label>{t("task.modal:status")}</Form.Label>
            <div style={{ display: "inline-block" }}>
              <span
                className={
                  status === taskConstants.TODO
                    ? "status-buttons task-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.TODO)
                }
              >
                <img
                  className="icons"
                  src={status === taskConstants.TODO ? activeTodo : todo}
                  alt={t("task.modal:status.buttons:todo")}
                />
                {t("task.modal:status.buttons:todo")}
              </span>
              <span
                className={
                  status === taskConstants.ASSIGN
                    ? "status-buttons task-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.ASSIGN)
                }
              >
                <img
                  className="icons"
                  src={status === taskConstants.ASSIGN ? activeAssign : assign}
                  alt={t("task.modal:status.buttons:assign")}
                />
                {t("task.modal:status.buttons:assign")}
              </span>
              <span
                className={
                  status === taskConstants.INPROGRESS
                    ? "status-buttons task-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.INPROGRESS)
                }
              >
                <img
                  className="icons"
                  src={
                    status === taskConstants.INPROGRESS
                      ? activeProgress
                      : inProgress
                  }
                  alt={t("task.modal:status.buttons:progress")}
                />
                {t("task.modal:status.buttons:progress")}
              </span>
              <span
                className={
                  status === taskConstants.DONE
                    ? "status-buttons done-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.DONE)
                }
              >
                <img
                  className="icons"
                  src={status === taskConstants.DONE ? activeDone : done}
                  alt={t("task.modal:status.buttons:done")}
                />
                {t("task.modal:status.buttons:done")}
              </span>
              <span
                className={
                  status === taskConstants.PENDING
                    ? "status-buttons pending-cancel-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.PENDING)
                }
              >
                <img
                  className="icons"
                  src={
                    status === taskConstants.PENDING ? activePending : pending
                  }
                  alt={t("task.modal:status.buttons:pending")}
                />
                {t("task.modal:status.buttons:pending")}
              </span>
              <span
                className={
                  status === taskConstants.CANCELED
                    ? "status-buttons pending-cancel-state"
                    : "status-buttons"
                }
                onClick={() =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : setStatus(taskConstants.CANCELED)
                }
              >
                <img
                  className="icons"
                  src={
                    status === taskConstants.CANCELED ? activeCancel : canceled
                  }
                  alt={t("task.modal:status.buttons:canceled")}
                />
                {t("task.modal:status.buttons:canceled")}
              </span>
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("task.modal:start.date")}</Form.Label>
            <div
              className={`${submitted && dateIsInvalid ? "is-invalid" : ""}`}
            >
              <DatePicker
                onFocus={(e) => e.target.blur()}
                selected={startTime}
                onChange={(date) =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : handleStartDate(date)
                }
                selectsStart
                startDate={startTime}
                endDate={stopTime}
                dateFormat="MMM dd, yyyy h:mm aa"
                minDate={new Date()}
                isClearable={!startTime ? false : true}
                className={`form-control ${
                  submitted && dateIsInvalid ? "is-invalid" : ""
                }`}
                // placeholderText={t(
                // 	"task.modal:startDate.placeholder"
                // )}
                // showTimeInput
              />
            </div>
            {submitted && dateIsInvalid && (
              <div className="invalid-feedback">
                {t("task.modal:error.startTime")}
              </div>
            )}
          </Form.Group>
          <Form.Group>
            <Form.Label>{t("task.modal:end.date")}</Form.Label>
            <div
              className={`${submitted && dateIsInvalid ? "is-invalid" : ""}`}
            >
              <DatePicker
                onFocus={(e) => e.target.blur()}
                selected={stopTime}
                onChange={(date) =>
                  currentUser.userType === UserType.GUEST
                    ? null
                    : handleStopDate(date)
                }
                selectsEnd
                dateFormat="MMM dd, yyyy h:mm aa"
                startDate={startTime}
                endDate={stopTime}
                minDate={startTime}
                className={`form-control ${
                  submitted && dateIsInvalid ? "is-invalid" : ""
                }`}
                // placeholderText={t(
                // 	"task.modal:endDate.placeholder"
                // )}
                isClearable={!stopTime ? false : true}
                // showTimeInput
              />
            </div>
            {submitted && dateIsInvalid && (
              <div className="invalid-feedback">
                {t("task.modal:error.endTime")}
              </div>
            )}
          </Form.Group>
          <Form.Group
            className={`forward-post-wrapper ${
              props.postToTask
                ? ""
                : props.isEditing
                ? ""
                : props.postInfo?.forwardedPost?.id
                ? ""
                : "d-none"
            }`}
          >
            {props.isEditing ? (
              <Post
                id={props.postInfo?.forwardedPost?.id}
                tagInfo={
                  props.postInfo?.forwardedPost.tagInfo
                    ? props.postInfo?.forwardedPost.tagInfo
                    : []
                }
                post={props.postInfo?.forwardedPost?.post}
                postInfo={props.postInfo?.forwardedPost}
                postForwardFlag={true}
                currentUser={currentUser}
                isPostOwner={
                  currentUser.id === props.postInfo?.forwardedPost?.user?.id
                }
                isHiddenPost={props.postInfo?.forwardedPost?.isHidden}
                user={props.postInfo?.forwardedPost?.user}
                reactions={
                  props.postInfo?.forwardedPost?.reactions
                    ? props.postInfo?.forwardedPost?.reactions
                    : []
                }
                fileList={props.postInfo?.forwardedPost?.fileList}
                isEmbeddedLink={props.postInfo?.forwardedPost?.embededlink}
                embeddedLinkData={
                  props.postInfo?.forwardedPost?.embeddedLinkData
                }
                isPostToTask={true}
                fwdPost={props}
                taskInfo={props.postInfo?.forwardedPost?.task}
                taskStatus={props.postInfo?.forwardedPost?.task.taskStatus}
                members={globalMembers}
                isTaskModal={true}
              />
            ) : (
              <Post
                id={props.postInfo?.id}
                tagInfo={props.postInfo?.tagInfo ? props.postInfo?.tagInfo : []}
                post={props.postInfo?.post}
                postInfo={props.postInfo}
                postForwardFlag={true}
                currentUser={currentUser}
                isPostOwner={currentUser.id === props.postInfo?.user?.id}
                isHiddenPost={props.postInfo?.isHidden}
                user={props.postInfo?.user}
                reactions={
                  props.postInfo?.reactions ? props.postInfo?.reactions : []
                }
                fileList={props.postInfo?.fileList}
                isEmbeddedLink={props.postInfo?.embededlink}
                embeddedLinkData={props.postInfo?.embeddedLinkData}
                isPostToTask={true}
                fwdPost={props}
                taskInfo={props.postInfo?.task}
                taskStatus={props.postInfo?.task.taskStatus}
                members={globalMembers}
                isTaskModal={true}
              />
            )}
          </Form.Group>
          <Form.Group
            // className={`task-add-notes ${
            //   props.postToTask || props.postInfo?.forwardedPost?.id
            //     ? "d-none"
            //     : ""
            // }`}
          >
            <Form.Label>{t("task.modal:add.notes")}</Form.Label>
            <MessagePost
              post={
                props.postToTask || props.forwardedPost?.post?.id
                  ? ""
                  : props.postInfo
              }
              taskTitle={title}
              taskAssigneeId={assigneeId}
              taskStatus={status}
              taskStartTime={startTime}
              taskStopTime={stopTime}
              channel={activeSelectedChannel}
              channelMembers={globalMembers}
              isTaskModal={true}
              typeTask={true}
              creatorId={currentUser?.id}
              channelId={activeSelectedChannel?.id}
              fwdPost={props}
              isPostToTask={props.postToTask}
              refscriptWindowSendButton={scriptWindowSendButton}
              onTaskSendClick={onSendClick}
            />
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer className="m-pad">
        <Button
          variant="secondary"
          onClick={onClose}
          className="footer-buttons"
        >
          {t("task.modal:cancel")}
        </Button>
        <Button
          variant="primary"
          className="footer-buttons"
          disabled={currentUser.userType === UserType.GUEST ? true : false}
          onClick={currentUser.userType === UserType.GUEST ? null : onSendClick}
        >
          {props.post?.id
            ? props.postToTask
              ? t("task.modal:post.to.task")
              : t("task.modal:update")
            : t("task.modal:submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskModal;
