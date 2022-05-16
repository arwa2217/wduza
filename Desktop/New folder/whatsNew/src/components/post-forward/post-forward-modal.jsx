import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../post-view/post";
import MessagePost from "../messages/messages-post";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import close from "../../assets/icons/close.svg";
import DiscussionListSuggestions from "./discussion-suggestion";

import { useTranslation } from "react-i18next";

import "./post-forward.css";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import CommonUtils from "../utils/common-utils";
import {
  getLastSelectedChannelId,
  setForwardSelectedChannelId,
} from "../../utilities/app-preference";
import { useEffect } from "react";

function PostForwardModal(props) {
  const { postInfo } = props;
  const scriptWindowSendButton = useRef(null);
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [discussion, setDiscussion] = useState("");
  const [discussionId, setDiscussionId] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [showFileProhibitedError, setShowFileProhibitedError] = useState(false);

  const currentUser = useSelector((state) => state.AuthReducer.user);
  // const members = useSelector((state) => state.channelMembers.members);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  useEffect(() => {
    let showFiles = true;
    let count = 0;
    if (postInfo?.fileList?.length > 0) {
      if (postInfo?.fileList?.length === 1) {
        showFiles = !postInfo?.fileList[0]?.fileForwardDisabled;
      } else {
        postInfo &&
          postInfo.length > 0 &&
          postInfo.fileList.map((file) => {
            if (file.fileForwardDisabled) {
              count++;
            }
            return file;
          });
        if (postInfo?.fileList?.length === count) {
          showFiles = false;
        }
      }
    }
    if (!showFiles) {
      // setIsDisabled(true);
      setShowFileProhibitedError(true);
    }
  }, []);

  useEffect(() => {
    setDiscussion(activeSelectedChannel);
    setDiscussionId(activeSelectedChannel.id);
    setForwardSelectedChannelId(activeSelectedChannel.id);
  }, [activeSelectedChannel]);

  const [show, setShow] = useState(props.show);
  const dispatch = useDispatch();

  const title = t("post.forward.modal:script.window.placeholder");

  const onClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_MODAL));
  };

  const onSendClick = () => {
    setSubmitted(true);
    if (discussion && discussionId !== undefined) {
      setSubmitted(false);
      scriptWindowSendButton.current.click();
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_MODAL));
    }
  };

  const handleDiscussion = (filterDiscussion) => {
    setDiscussion(filterDiscussion);
    setDiscussionId(filterDiscussion.id);
    setForwardSelectedChannelId(filterDiscussion.id);
  };

  const getChannelList = (channelList) => {
    return channelList
      .filter((channel) => {
        if (
          channel.type === "GUEST" &&
          channel.status !== "DELETED" &&
          channel.status !== "LOCKED"
        ) {
          return channel.id === activeSelectedChannel.id;
        } else if (
          channel.type === "EXTERNAL" &&
          channel.status !== "DELETED" &&
          channel.status !== "LOCKED"
        ) {
          return channel.id === activeSelectedChannel.id;
        } else if (
          channel.status !== "DELETED" &&
          channel.status !== "LOCKED"
        ) {
          return channel.type === activeSelectedChannel.type;
        }
      })
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
  };

  return (
    <Modal
      className="post-forward-modal create-channel-modal"
      show={show}
      centered
    >
      <Modal.Header className="m-pad">
        <Modal.Title closeButton>
          {t("post.forward.modal:header")}
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
            {/* <Form.Label>
							{t("post.forward.modal:assignee")}{" "}
							<span className="text-primary">*</span>
						</Form.Label> */}
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
                className={`member-add-input form-control ${
                  submitted &&
                  (discussion === ""
                    ? "is-invalid"
                    : discussionId === undefined
                    ? "is-invalid"
                    : "")
                }`}
                name="discussion"
                channelList={getChannelList(channelList)}
                placeholder={t("post.forward.modal:discussion.placeholder")}
                value={discussion.name ? discussion.name : discussion}
              />
            </div>

            {submitted &&
              (discussion === "" ? (
                <div className="invalid-feedback">
                  {t("post.forward.modal:error.discussion")}
                </div>
              ) : discussionId === undefined ? (
                <div className="invalid-feedback">
                  {t("post.forward.modal:error.discussionId")}
                </div>
              ) : (
                ""
              ))}
          </Form.Group>
          <Form.Group className="mb-0" style={{ marginBottom: "20px" }}>
            {/* <Form.Label>{t("post.forward.modal:add.notes")}</Form.Label> */}
            <MessagePost
              post=""
              channel={discussion}
              title={title}
              channelMembers={CommonUtils.getFilteredMembers(
                globalMembers,
                getLastSelectedChannelId()
              )}
              refscriptWindowSendButton={scriptWindowSendButton}
              isPostForwardModal={true}
              onTaskSendClick={onSendClick}
              fwdPost={props}
              creatorId={props.currentUserInfo.id}
              channelId={props.channelId}
            />
          </Form.Group>
          <Form.Group className="forward-post-wrapper">
            <Post
              id={postInfo?.post?.id}
              tagInfo={postInfo.tagInfo ? postInfo.tagInfo : []}
              post={postInfo.post}
              postInfo={postInfo}
              postForwardFlag={true}
              currentUser={currentUser}
              isPostOwner={currentUser.id === postInfo?.user?.id}
              isHiddenPost={postInfo.isHidden}
              user={postInfo.user}
              reactions={postInfo.reactions ? postInfo.reactions : []}
              fileList={postInfo?.fileList}
              isEmbeddedLink={postInfo?.embededlink}
              embeddedLinkData={postInfo?.embeddedLinkData}
              taskInfo={postInfo?.task}
              taskStatus={postInfo?.task.taskStatus}
              members={globalMembers}
            />
          </Form.Group>
          {showFileProhibitedError && (
            <div className="text-danger mt-2">
              {t("post.forward.modal:error.file.prohibited")}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="m-pad">
        <Button
          variant="secondary"
          onClick={onClose}
          className="footer-buttons"
        >
          {t("post.forward.modal:cancel")}
        </Button>
        <Button
          variant="primary"
          disabled={isDisabled}
          className="footer-buttons"
          onClick={onSendClick}
        >
          {t("post.forward.modal:submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PostForwardModal;
