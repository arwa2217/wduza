import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessagePost from "../outlook-mail-post/outlook-forward-to-email";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import close from "../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";
import "./post-forward.css";
import ModalActions from "../../store/actions/modal-actions";
import ModalTypes from "../../constants/modal/modal-type";
import Post from "../post-view/post";
import CommonUtils from "../utils/common-utils";
import { getLastSelectedChannelId } from "../../utilities/app-preference";
import { CircularProgress } from "@material-ui/core";

function PostForwardToEmailModal(props) {
  const { postInfo } = props;
  const scriptWindowSendButton = useRef(null);
  const { t } = useTranslation();
  const [isDisabled, setIsDisabled] = useState(false);
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const memberInChanel = CommonUtils.getFilteredMembers(
    globalMembers,
    getLastSelectedChannelId()
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [show, setShow] = useState(props.show);
  const dispatch = useDispatch();
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  console.log(activeSelectedChannel);

  const onClose = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_TO_EMAIL_MODAL));
  };

  const onSendClick = () => {
    setIsDisabled(true);
    scriptWindowSendButton.current.click();
  };
  const hidePopup = () => {
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.POST_FORWARD_TO_EMAIL_MODAL));
    setIsDisabled(false);
  };

  return (
    <Modal
      className="post-forward-modal post-forward-to-email-modal create-channel-modal"
      show={show}
      centered
    >
      <Modal.Header className="m-pad">
        <Modal.Title closeButton>
          {t("post.forward.modal:header.forward.email")}
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
          <Form.Group
            style={{
              marginBottom: "20px",
              width: "760px",
              border: "1px solid #AFBACB",
            }}
          >
            <MessagePost
              forwardText={""}
              postInfo={postInfo}
              postId={postInfo?.post?.id}
              activeSelectedChannel={activeSelectedChannel}
              globalMembers={memberInChanel}
              refscriptWindowSendButton={scriptWindowSendButton}
              hidePopup={hidePopup}
              setIsDisabled={setIsDisabled}
            />
          </Form.Group>
          {postInfo?.post?.id ? (
            <Form.Group
              className="forward-post-wrapper"
              style={{ width: "760px" }}
            >
              <div id="post-content">
                <Post
                  id={postInfo?.post?.id}
                  tagInfo={postInfo?.tagInfo ? postInfo?.tagInfo : []}
                  post={postInfo?.post}
                  postInfo={postInfo}
                  postForwardFlag={true}
                  currentUser={currentUser}
                  isPostOwner={currentUser.id === postInfo?.user?.id}
                  isHiddenPost={postInfo?.isHidden}
                  user={postInfo?.user}
                  reactions={postInfo?.reactions ? postInfo.reactions : []}
                  fileList={postInfo?.fileList}
                  isEmbeddedLink={postInfo?.embededlink}
                  embeddedLinkData={postInfo?.embeddedLinkData}
                  taskInfo={postInfo?.task}
                  taskStatus={postInfo?.task?.taskStatus}
                  members={globalMembers}
                  isStyleInline={true}
                />
              </div>
            </Form.Group>
          ) : null}
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

export default PostForwardToEmailModal;
