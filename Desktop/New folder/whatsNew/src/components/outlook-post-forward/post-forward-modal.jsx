import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import MessagePost from "../messages/outlook-messages-post";
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

import { setFocusEditor } from "../../utilities/outlook";
import { CircularProgress } from "@material-ui/core";

function PostForwardModal(props) {
  const { attachments } = props;
  const scriptWindowSendButton = useRef(null);
  const editor = useRef(null);
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [discussion, setDiscussion] = useState("");
  const [discussionId, setDiscussionId] = useState("");
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const dispatch = useDispatch();
  const title = t("post.forward.modal:script.window.placeholder");

  const onClose = () => {
    props.setShowForward(false);
    dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_MODAL));
  };
  const hideModal = () => {
    props.setShowForward(false);
    dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_MODAL));
    setIsDisabled(false);
  };
  const onSendClick = async () => {
    setSubmitted(true);
    const { value } = editor.current;
    if (!value) {
      setFocusEditor(".task-modal-form");
      return;
    }
    setIsDisabled(true);
    if (discussion && discussionId !== undefined) {
      scriptWindowSendButton.current.click();
      setSubmitted(false);
    }
  };

  const handleDiscussion = (filterDiscussion) => {
    setDiscussion(filterDiscussion);
    setDiscussionId(filterDiscussion.id);
    setForwardSelectedChannelId(filterDiscussion.id);
  };
  return (
    <Modal
      className="post-forward-modal outlook-post-forward-modal create-channel-modal"
      size="lg"
      show={props.show}
      centered
    >
      <Modal.Header className="m-pad">
        <Modal.Title closeButton>
          {t("post.forward.modal:header.outlook")}
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
                channelList={channelList}
                placeholder={t("post.forward.modal:discussion.placeholder")}
                value={discussion.name ? discussion.name : discussion}
              />
            </div>
          </Form.Group>
          <Form.Group className="mb-0" style={{ marginBottom: "20px" }}>
            <MessagePost
              post={props.body}
              channel={discussion}
              title={title}
              channelMembers={CommonUtils.getFilteredMembers(
                globalMembers,
                getLastSelectedChannelId()
              )}
              refscriptWindowSendButton={scriptWindowSendButton}
              isPostForwardModal={true}
              fwdPost={props}
              creatorId={currentUser?.id}
              channelId={props.channelId}
              attachments={attachments}
              editor={editor}
              hideModal={hideModal}
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
          {t("post.forward.modal:cancel")}
        </Button>
        <Button
          variant="primary"
          className="footer-buttons"
          onClick={onSendClick}
        >
          {isDisabled && (
            <CircularProgress
              color="inherit"
              style={{ width: 15, height: 15, marginRight: 5 }}
            />
          )}
          {t("post.forward.modal:submit")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PostForwardModal;
