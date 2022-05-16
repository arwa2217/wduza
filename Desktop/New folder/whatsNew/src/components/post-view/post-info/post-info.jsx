import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Dropdown } from "react-bootstrap";

import { withTranslation } from "react-i18next";
import "../post.css";
import {
  addReactionAction,
  removeReactionAction,
} from "../../../store/actions/post-reaction-actions";
import {
  postSavesToServer,
  removeSave,
} from "../../../store/actions/my-saves-actions";

import {
  postTagToServer,
  postTaskToServer,
  removeTag,
  setPostToReply,
  toggleEditor,
} from "../../../store/actions/channelMessagesAction";
import ChannelConstants from "../../../constants/channel/channel-constants";
import { bindActionCreators } from "redux";
import PostTagMenu from "../post-tag-menu/post-tag-menu";
import { TAG_IMPORTANT } from "../post-tag-menu/post-tag-type";
import PostTaskMenu from "../post-task-menu/post-task-menu";
import PostEdit from "./post-edit";
import PostHide from "./post-hide";
import { Button } from "../../shared/styles/mainframe.style";
import iconPostReplyActive from "../../../assets/icons/v2/ic_reply_default.svg";
import iconPostReply from "../../../assets/icons/v2/ic_reply.svg";
import iconPostReplyGreen from "../../../assets/icons/v2/ic_reply_green.svg";
import iconPostReactCheck from "../../../assets/icons/v2/ic_check_default.svg";
import iconPostReactPlusOne from "../../../assets/icons/v2/ic_plus_default.svg";
import iconPostReactMinusOne from "../../../assets/icons/v2/ic_minus_default.svg";
import iconDivider from "../../../assets/icons/v2/divider.svg";
import iconMore from "../../../assets/icons/v2/ic_more.svg";
import iconMoreGreen from "../../../assets/icons/v2/ic_more_green.svg";
import iconPostForward from "../../../assets/icons/v2/ic_forward.svg";
import iconPostForwardToEmail from "../../../assets/icons/outlook-toolbox/forward-email.svg";
import iconSavedPost from "../../../assets/icons/v2/ic_bookmark.svg";
import iconPostSaveGreen from "../../../assets/icons/v2/ic_bookmark_act.svg";
import iconPostDelete from "../../../assets/icons/post-toolbox/post-delete.svg";

import PostUtils from "../../utils/post-utils";
import { PostEditAction } from "../../../store/actions/edit-post-actions";
import { postHideAction } from "../../../store/actions/hide-post-actions";
import { PostContextConsumer } from "../postContext";
import { PostReactionType } from "../post-reaction/post-reaction-type";
import ModalTypes from "../../../constants/modal/modal-type";
import iconPostTag from "../../../assets/icons/v2/ic_tag.svg";
import iconPostTagAct from "../../../assets/icons/v2/ic_tag_act.svg";
import ModalActions from "../../../store/actions/modal-actions";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import styled from "styled-components";

const MoreButtonWrapper = styled.div`
  .btn {
    font-weight: 500
  }
`;

const Action = styled.button`
  .reply_ic {
    margin-right: 2px;
  }
  .tooltip-icon {
    margin-right: 8px;
  }
`;
const Mention = styled.div`
  min-width: 80px;
  height: 20px;
  padding: 6px 0 6px 0px;
  align-items: center;
  margin-left: 12px;
  .mention-wrapper {
    width: 100%;
    .btn-shadow-none {
      padding: 0px;
      width: 100%;
      height: 100%;
    }
    .mention-icon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        padding-left: 2px;
      }
    }
  }
  .action {
    padding-left: 12px;
  }
`;
const Divider = styled.div`
  padding: 0 16px;
`;
class PostInfo extends React.PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    teamId: PropTypes.string,
    handleCommentClick: PropTypes.func.isRequired,
    handleDropdownOpened: PropTypes.func,
    isMobile: PropTypes.bool,
    hover: PropTypes.bool.isRequired,
    enableEmojiPicker: PropTypes.bool.isRequired,

    actions: PropTypes.shape({
      removeReactionAction: PropTypes.func.isRequired,
      addReactionAction: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      showEmojiPicker: false,
      reactionPickerOffset: 21,
      showPostTagMenu: false,
      replyIcon: iconPostReply,
      saveIcon: iconSavedPost,
      moreIcon: iconMore,
      isshowMore: false,
      event: "",
      isCheckReply: false,
      isCheckSave: false,
    };
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.props.post.id !== nextProps.lastPost) {
      this.setState({ isCheckReply: false });
    }
  }

  //   console.log(this.postInfoWrapRef)
  //   const wrap = document.getElementById('post-action_wrap')
  //   const boxActions = document.getElementById('post__toolbox__container')
  //   let showMore
  //   if(!this.postInfoWrapRef && boxActions.style.display === 'none'){

  //     showMore = false
  //     boxActions.style.display = "none"
  //   }else if(this.postInfoWrapRef){

  //     showMore = true
  //     boxActions.style.display = "block"
  //     console.log(boxActions.style.display )
  //   }

  //   this.setState({
  //     isshowMore: showMore
  //   })

  // }
  handleMouseOverMoreAction = () => {
    const boxActions = document.getElementById("post__toolbox__container");
    let showMore;
    if (!this.postInfoWrapRef && boxActions.style.display === "none") {
      showMore = false;
      boxActions.style.display = "none";
    } else if (this.postInfoWrapRef) {
      showMore = true;
      boxActions.style.display = "block";
      console.log(boxActions.style.display);
    }

    this.setState({
      isshowMore: showMore,
    });
  };
  handleMouseOutMoreAction = () => {
    console.log("handleMouseOutMoreAction");
    const wrap = document.getElementById("post-action_wrap");
    const boxActions = document.getElementById("post__toolbox__container");
    let showMore;
    if (!this.postInfoWrapRef && boxActions.style.display === "block") {
      showMore = false;
      boxActions.style.display = "block";
    } else if (!this.postInfoWrapRef && boxActions.style.display === "none") {
      showMore = false;
      boxActions.style.display = "none";
    }
  };
  hasCheckedReaction = () => {
    var reactions = this.props.reactions;
    return (
      reactions &&
      reactions.myReactions &&
      reactions.myReactions.length > 0 &&
      reactions.myReactions.some((el) => el.Reaction === PostReactionType.CHECK)
    );
  };

  hasPlusReaction = () => {
    var reactions = this.props.reactions;
    return (
      reactions &&
      reactions.myReactions &&
      reactions.myReactions.length > 0 &&
      reactions.myReactions.some(
        (el) => el.Reaction === PostReactionType.UP_ONE
      )
    );
  };

  hasMinusReaction = () => {
    var reactions = this.props.reactions;
    return (
      reactions &&
      reactions.myReactions &&
      reactions.myReactions.length > 0 &&
      reactions.myReactions.some(
        (el) => el.Reaction === PostReactionType.DOWN_ONE
      )
    );
  };

  toggleEmojiPicker = () => {
    const showEmojiPicker = !this.state.showEmojiPicker;

    this.setState({ showEmojiPicker });
    this.props.handleDropdownOpened(showEmojiPicker);
  };

  hideEmojiPicker = () => {
    this.setState({ showEmojiPicker: false });
    this.props.handleDropdownOpened(false);
  };

  removePost = () => {
    this.props.actions.removePost(this.props.post);
  };

  createRemovePostButton = () => {
    return (
      <button
        className="color--link style--none"
        type="button"
        onClick={this.removePost}
      >
        {"Ã—"}
      </button>
    );
  };

  reactEmojiClick = (emoji) => {
    const pickerOffset = 21;
    this.setState({
      showEmojiPicker: false,
      reactionPickerOffset: pickerOffset,
    });
    const emojiName = emoji.name || emoji.aliases[0];
    this.props.actions.addReaction(this.props.post.id, emojiName);
    this.props.handleDropdownOpened(false);
  };
  onReactClick = (e) => {
    e.preventDefault();
    const userReaction = e.currentTarget.value;
    let myReactions = [];
    var hasUpOrDownReaction = false;
    if (this.props.reactions && this.props.reactions.myReactions) {
      myReactions = this.props.reactions.myReactions;
    }

    let removeReaction = false;
    if (myReactions.length > 0) {
      var index;
      for (index = 0; index < myReactions.length; index++) {
        if (myReactions[index].Reaction === userReaction) {
          removeReaction = true;
          break;
        }
      }
      hasUpOrDownReaction =
        myReactions[0].Reaction === PostReactionType.UP_ONE ||
        myReactions[0].Reaction === PostReactionType.DOWN_ONE ||
        (myReactions.length > 1 &&
          myReactions[1].Reaction === PostReactionType.UP_ONE) ||
        (myReactions.length > 1 &&
          myReactions[1].Reaction === PostReactionType.DOWN_ONE)
          ? true
          : false;
    }
    if (removeReaction) {
      let channelId = this.props.channelId;
      let postId = this.props.post.id;
      this.props.actions.removeReactionAction(channelId, postId, userReaction);
    } else if (
      (userReaction === PostReactionType.DOWN_ONE ||
        userReaction === PostReactionType.UP_ONE) &&
      hasUpOrDownReaction
    ) {
      let channelId = this.props.channelId;
      let postId = this.props.post.id;
      let upOrDownReaction =
        userReaction === PostReactionType.UP_ONE
          ? PostReactionType.DOWN_ONE
          : PostReactionType.UP_ONE;
      this.props.actions.removeReactionAction(
        channelId,
        postId,
        upOrDownReaction
      );

      //mutual exclusion
      let requestBody = {
        channelId: this.props.channelId,
        postId: this.props.post.id,
        reaction: userReaction,
      };
      this.props.actions.addReactionAction(requestBody);
    } else {
      let requestBody = {
        channelId: this.props.channelId,
        postId: this.props.post.id,
        reaction: userReaction,
      };
      this.props.actions.addReactionAction(requestBody);
    }
  };

  togglePostTagMenu = () => {
    const showPostTagMenu = !this.state.showPostTagMenu;
    this.setState({ showPostTagMenu });
  };

  reactSaveClicked = (e) => {
    e.preventDefault();
    const { removeSave, postSavesToServer } = this.props;
    const { post } = this.props;
    if (this.props.savedPost) {
      if (this.props.savedPost === true) {
        let request = {
          postId: post.id,
        };
        removeSave(request);
      } else {
        let requestBody = {
          channelId: this.props.channelId,
          postId: post.id,
        };
        postSavesToServer(requestBody);
      }
    } else {
      let requestBody = {
        channelId: this.props.channelId,
        postId: post.id,
      };
      postSavesToServer(requestBody);
    }
  };

  reactEditPost = (e) => {
    e.preventDefault();
    const channelId = this.props.channelId;
    const postId = this.props.post.id;
    if (!this.props.showReplies) {
      this.props.updateShowReplies(undefined, true);
    }
    this.props.PostEditAction(channelId, postId);
  };
  reactEditPostTask = (e, postToTask, taskInfo) => {
    e.preventDefault();
    document.body.click();
    const modalType = ModalTypes.TASK_MODAL;
    let isEditing =
      this.props.post.type === "TASK" && this.props.postInfo?.forwardedPost?.id;
    var modalProps = {
      show: true,
      closeButton: true,
      postToTask,
      isEditing,
      ...this.props,
    };
    if (postToTask) {
      modalProps = { ...modalProps, taskInfo };
    }
    this.props.dispatch(ModalActions.showModal(modalType, modalProps));
  };
  reactForwardPost = (e) => {
    e.preventDefault();
    document.body.click();
    const modalType = ModalTypes.POST_FORWARD_MODAL;
    const modalProps = {
      show: true,
      closeButton: true,
      ...this.props,
    };
    this.props.dispatch(ModalActions.showModal(modalType, modalProps));
  };
  reactForwardPostToEmail = (e) => {
    e.preventDefault();
    document.body.click();
    const modalType = ModalTypes.POST_FORWARD_TO_EMAIL_MODAL;
    const modalProps = {
      show: true,
      closeButton: true,
      ...this.props,
    };
    this.props.dispatch(ModalActions.showModal(modalType, modalProps));
  };

  reactHidePost = (e) => {
    // e.preventDefault();
    const channelId = this.props.channelId;
    const postId = this.props.post.id;

    this.props.postHideAction(postId, true);
  };
  reactUnhidePost = (e) => {
    const channelId = this.props.channelId;
    const postId = this.props.post.id;

    this.props.postHideAction(postId, false);
  };

  reactPostTagClicked = (e) => {
    console.log(e.target.value);
    e.preventDefault();
    const { postTagToServer, removeTag } = this.props;
    let currentTags = this.props.tagInfo;
    let deleteTag = false;
    if (currentTags.length > 0) {
      currentTags.map((tag) => {
        if (tag.tagName === TAG_IMPORTANT) {
          deleteTag = true;
        }
        let request = {
          channelId: this.props.channelId,
          postId: this.props.post.id,
          tagName: tag.tagName,
        };
        removeTag(request);
      });
    }
    if (!deleteTag) {
      let requestBody = {
        channelId: this.props.channelId,
        postId: this.props.post.id,
        tagName: TAG_IMPORTANT,
      };
      postTagToServer(requestBody);
    }
    this.setState({
      closePopupTag: true,
    });
    // );
  };

  reactPostTaskClicked = (e, taskStatus, postToTask) => {
    e.preventDefault();
    e.preventDefault();
    if (postToTask) {
      let taskInfo = {
        taskStatus,
        taskTitle: "My work",
        taskStartTime: new Date().setHours(0, 0, 0, 0),
        taskStopTime: new Date().setHours(23, 59, 0, 0),
        taskAssignee: this.props.currentUserInfo?.id,
      };
      this.reactEditPostTask(e, postToTask, taskInfo);
    } else {
      const { postTaskToServer } = this.props;
      let requestBody = {
        channelId: this.props.channelId,
        postId: this.props.post.id,
        taskStatus: taskStatus,
      };
      postTaskToServer(requestBody);
    }
  };
  showMoreAction = (e) => {
    e.persist();
    this.setState(
      {
        isshowMore: !this.state.isshowMore,
      },
      () => {
        // const wrap = document.getElementById('post-action_wrap')
        // let showMore
        // if( this.state.isshowMore){
        //   wrap.style.display = "block"
        // }else {
        //   wrap.style.display = "none"
        // }
        // if(wrap){
        //   wrap.style.top = `${e.clientY - 20}px`;
        //   wrap.style.left = `${e.clientX + 10}px`;
        // }
      }
    );
  };

  buildOptions = () => {
    const { t, post } = this.props;
    if (PostUtils.isSystemMessage(post)) {
      return;
    }
    //Reaction

    const tooltipReactCheck = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {this.hasCheckedReaction()
          ? t("postInfo:tooltip.reaction:add.checked.reaction")
          : t("postInfo:tooltip.reaction:add.check.reaction")}
      </Tooltip>
    );
    const tooltipEditPost = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.edit.post")}
      </Tooltip>
    );
    const tooltipForwardPost = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.forward.post")}
      </Tooltip>
    );
    const tooltipForwardPostToEmail = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.forward.post.to.email")}
      </Tooltip>
    );
    const tooltipHidePost = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.edit.post")}
      </Tooltip>
    );
    const tooltipMore = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {"More"}
      </Tooltip>
    );

    const reactCheck = (
      <div
        className={classNames(
          "mention-wrapper align-items-center post-react-checked",
          this.hasCheckedReaction() && "active",
          this.props.classes.mentionWrapper
        )}
      >
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipReactCheck}
        >
          <Action
            classNameic_check={classNames(
              "btn-shadow-none btn",
              this.hasCheckedReaction() && "active"
            )}
            style={{ border: "none", background: "none", paddingRight: "0px", paddingLeft: "2px" }}
            onClick={this.onReactClick}
            value={PostReactionType.CHECK}
          >
            <SVG
              alt="post reply"
              src={iconPostReactCheck}
              className="icon-tooltip"
              style={{ paddingBottom: "1px" }}
            />
          </Action>
        </OverlayTrigger>
      </div>
    );
    const checkPostDisabled = (
      <div className="mention_icon align-items-center post-react-checked disabled">
        <OverlayTrigger
          className="hidden-xs"
          isS
          delayShow={500}
          placement="top"
          overlay={tooltipReactCheck}
        >
          <Action
            className="btn-shadow-none btn"
            onClick={this.onReactClick}
            value={PostReactionType.CHECK}
          >
            <SVG alt="post reply" src={iconPostReactCheck} />
          </Action>
        </OverlayTrigger>
      </div>
    );
    const tooltipReactPlusOne = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.reaction:add.plus.one.reaction")}
      </Tooltip>
    );

    const reactPlusOne = (
      <div
        className={classNames(
          "mention-wrapper action align-items-center post-react-plus-one",
          this.hasPlusReaction() && "active",
          this.props.classes.mentionWrapper
        )}
      >
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipReactPlusOne}
        >
          <Action
            className={`btn-shadow-none btn ${
              this.hasPlusReaction() ? "active" : ""
            }`}
            value={PostReactionType.UP_ONE}
            onClick={this.onReactClick}
          >
            <div className="mention-icon">
              <SVG
                alt="post reply"
                src={iconPostReactPlusOne}
                className="icon-tooltip"
              />
              <span className="like-number">1</span>
            </div>
          </Action>
        </OverlayTrigger>
      </div>
    );
    const reactPlusOnedisabled = (
      <div className="mx-25 align-items-center post-react-plus-one disabled">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipReactPlusOne}
        >
          <Action
            className="btn-shadow-none btn "
            value={PostReactionType.UP_ONE}
            onClick={this.onReactClick}
          >
            <SVG alt="post reply" src={iconPostReactPlusOne} />
          </Action>
        </OverlayTrigger>
      </div>
    );

    const tooltipReactMinusOne = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.reaction:add.minus.one.reaction")}
      </Tooltip>
    );

    const reactMinusOne = (
      <div
        className={classNames(
          "mention-wrapper action align-items-center post-react-minus-one",
          this.hasMinusReaction() && "active",
          this.props.classes.mentionWrapper
        )}
      >
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipReactMinusOne}
        >
          <Action
            className={`btn-shadow-none btn ${
              this.hasMinusReaction() ? "active" : ""
            }`}
            value={PostReactionType.DOWN_ONE}
            onClick={this.onReactClick}
          >
            <div className="mention-icon">
              <SVG
                alt="post reply"
                src={iconPostReactMinusOne}
                className="icon-tooltip"
              />
              <span className="like-number">1</span>
            </div>
          </Action>
        </OverlayTrigger>
      </div>
    );
    const reactMinusOneDisabled = (
      <div className="mx-25 align-items-center post-react-minus-one disabled">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipReactMinusOne}
        >
          <Action
            className="btn-shadow-none btn"
            value={PostReactionType.DOWN_ONE}
            onClick={this.onReactClick}
          >
            <SVG alt="post reply" src={iconPostReactMinusOne} />
          </Action>
        </OverlayTrigger>
      </div>
    );

    // Reply

    const tooltipComment = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.reply.post")}
      </Tooltip>
    );
    const comment = (
      <PostContextConsumer>
        {(props) => {
          return (
            <>
              {/* !props.hideReplyView && */}
              {
                <div
                  className={classNames(
                    "mention-wrapper p-0 mx-25 align-items-center post-react-reply",
                    this.state.isCheckReply ? "active" : "",
                    this.props.classes.mentionWrapper
                  )}
                >
                  <OverlayTrigger
                    className="hidden-xs"
                    delayShow={500}
                    placement="top"
                    overlay={tooltipComment}
                  >
                    <Action
                      className="btn"
                      style={{
                        width: "auto",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "12px",
                        lineHeight: "12px",
                        color: "rgba(0, 0, 0, 0.7)",
                        justifyContent: "center",
                        textTransform: "inherit",
                        fontWeight: 400,
                        paddingRight: "12px",
                      }}
                      onClick={(e) => {
                        
                        e.stopPropagation();
                        props.updateShowReplies(undefined, true);
                        const channel = this.props.channel;
                        const parentPostId = this.props.postInfo.parentPostId;
                        const postInfo = this.props.postInfo;
                        this.props.setPostToReply({
                          channel,
                          focusOnEditor: 1,
                          parentPostId,
                          postInfo,
                          channelMembers: [],
                          title: "replyView",
                        });
                        //this.props.setPostToReply(this.props);
                        this.props.toggleEditor(
                          !this.state.isCheckReply,
                          this.props.post.id
                        );
                        this.setState({
                          isCheckReply:
                            this.props.lastPost !== undefined &&
                            this.props.lastPost !== this.props.post.id
                              ? false
                              : !this.state.isCheckReply,
                        });
                      }}
                      onMouseEnter={() =>
                        this.setState({
                          replyIcon: iconPostReplyGreen,
                        })
                      }
                      onMouseLeave={() =>
                        this.setState({
                          replyIcon: iconPostReply,
                        })
                      }
                    >
                      <div className="icon-reply-wrapper">
                        <SVG
                          alt="post reply"
                          src={
                            // this.state.isCheckReply
                            //   ? iconPostReply
                            //   : iconPostReplyActive
                            iconPostReply
                          }
                          className="reply_ic icon-tooltip"
                        />
                        <span className="reply-txt">Reply</span>
                      </div>
                    </Action>
                  </OverlayTrigger>
                </div>
              }
            </>
          );
        }}
      </PostContextConsumer>
    );

    // Save
    const tooltipSave = (
      <Tooltip id="save-icon-tooltip" className="hidden-xs">
        {this.props.savedPost ? (
          <>{t("postInfo:tooltip.remove.save.post")}</>
        ) : (
          <>{t("postInfo:tooltip.save.post")}</>
        )}
      </Tooltip>
    );

    const save = (
      <div
        className={classNames(
          "mention-wrapper p-0 mx-25 align-items-center post-react-saved",
          this.props.classes.mentionWrapper
        )}
      >
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipSave}
        >
          <Action
            /* className={`btn-shadow-none btn ${
              this.props.savedPost ? "active" : ""
            }`}*/
            className={classNames("btn-shadow-none btn")}
            onClick={(e) => {
              this.reactSaveClicked(e);
              this.setState({ isCheckSave: !this.state.isCheckSave });
            }}
            value={"PostReactionType.CHECK"}
            style={{
              width: "auto",
              display: "flex",
              alignItems: "center",
              fontSize: "12px",
              lineHeight: "12px",
              justifyContent: "center",
              textTransform: "inherit",
              fontWeight: 400,
              // paddingRight: "5px",
            }}
            onMouseEnter={() => {
              this.setState({
                saveIcon: iconPostSaveGreen,
              });
            }}
            onMouseLeave={() =>
              this.setState({
                saveIcon: iconSavedPost,
              })
            }
          >
            <div className="icon-save-wrapper">
              <SVG
                src={this.props.savedPost ? iconPostSaveGreen : iconSavedPost}
                // className={"tooltip-icon icon-tooltip"}
                className={"icon-tooltip"}
              />
              <span
                className="reply-txt"
                style={{
                  color: this.props.savedPost ? "#00A95B" : "#00000080",
                }}
              >
                Save
              </span>
            </div>
          </Action>
          {/* <button
            className="btn-shadow-none btn disabled"
            // onClick={this.reactSaveClicked}
          >
            <img alt="" src={iconPostSave} />
          </button> */}
        </OverlayTrigger>
      </div>
    );
    const savePostDisabled = (
      <div className="p-0 mx-25 align-items-center save-post disabled">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipSave}
        >
          <Action
            className="btn-shadow-none btn disabled"
            // onClick={this.reactSaveClicked}
          >
            {/* <SVG alt="" src={iconPostSave} /> */}
            <SVG alt="" src={iconSavedPost} />
          </Action>
        </OverlayTrigger>
      </div>
    );

    // Tags
    const tag = (
      // <PostTagMenu
      //   onClick={this.reactPostTagClicked}
      //   post={post}
      //   currentTags={this.props.tagInfo}
      // />

      <button
        style={{ margin: "0px", padding: 0 }}
        size={"12px"}
        className={this.props?.tagInfo?.length > 0 ? "tag-selected" : ""}
        onClick={(e) => this.reactPostTagClicked(e)}
      >
        <span
          className={`${this.props?.tagInfo?.length > 0 ? "" : "icon-action"}`}
        >
          <SVG
            style={{ marginRight: "9px" }}
            src={this.props?.tagInfo?.length > 0 ? iconPostTagAct : iconPostTag}
          />
          Tag
        </span>
      </button>
    );
    const tagPostDisabled = (
      <div className="p-0 align-items-center tag-post disabled">
        {/* <PostTagMenu
          onClick={this.reactPostTagClicked}
          post={post}
          currentTags={this.props.tagInfo}
        /> */}
        <span className="icon-action">
          <SVG style={{ marginRight: "9px", padding: 0 }} src={iconPostTag} />
          tag
        </span>
      </div>
    );

    // Edit
    const editPost = (
      <div className="p-0 align-items-center">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipEditPost}
        >
          <PostEdit onEditClick={this.reactEditPost} postInfo={this.props} />
        </OverlayTrigger>
      </div>
    );

    const editPostTask = (
      <div className="p-0  align-items-center">
        <PostEdit onEditClick={this.reactEditPostTask} postInfo={this.props} />
      </div>
    );
    const editPostDisabled = (
      <div className="p-0 align-items-center disabled">
        <PostEdit />
      </div>
    );

    // Post Forwarding
    const postForwarding = (
      <div className="p-0 align-items-center">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipForwardPost}
        >
          <button
            onClick={this.reactForwardPost}
            style={{
              width: "120px",
              display: "flex",
              alignItems: "center",
              margin: "0",
              padding: 0,
            }}
            // className="btn-shadow-none btn disabled"
            // onClick={null}
          >
            {/* <img alt="iconPostForward" src={iconPostForward} /> */}
            <span className="icon-action">
              <SVG src={iconPostForward} />
              <span style={{ paddingLeft: "9px" }}>Forward</span>
            </span>
          </button>
        </OverlayTrigger>
      </div>
    );
    const postForwardingDisabled = (
      <div className="p-0 align-items-center disabled">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipForwardPost}
        >
          <button className="btn-shadow-none btn disabled" onClick={null}>
            <span className="icon-action">
              <SVG src={iconPostForward} />
            </span>
            Forward
          </button>
        </OverlayTrigger>
      </div>
    );

    // Hide post
    const hidePost = (
      <div className="p-0 align-items-center">
        <PostHide
          onHideClick={this.reactHidePost}
          onUnhideClick={this.reactUnhidePost}
          postInfo={this.props}
        />
      </div>
    );
    const forwardPostToEmail = (
      <div className="p-0  align-items-center">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipForwardPostToEmail}
        >
          <button
            className="btn-shadow-none btn"
            onClick={this.reactForwardPostToEmail}
          >
            <img alt="iconPostForwardToEmail" src={iconPostForwardToEmail} />
          </button>
        </OverlayTrigger>
      </div>
    );
    const hidePostDisabled = (
      <div className="p-0  align-items-center disabled">
        {/* <OverlayTrigger
					className="hidden-xs"
					delayShow={500}
					placement="top"
					overlay={tooltipHidePost}
				> */}
        <PostHide
          onHideClick={this.reactHidePost}
          onUnhideClick={this.reactUnhidePost}
          postInfo={this.props}
        />
        {/* </OverlayTrigger> */}
      </div>
    );
    const tooltipDeletePost = (
      <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
        {t("postInfo:tooltip.delete.post")}
      </Tooltip>
    );

    // Delete
    const deletePost = (
      <div className="p-0 mx-25 align-items-center">
        <OverlayTrigger
          className="hidden-xs"
          delayShow={500}
          placement="top"
          overlay={tooltipDeletePost}
        >
          <button className="btn-shadow-none btn disabled">
            <img alt="" src={iconPostDelete} />
          </button>
        </OverlayTrigger>
      </div>
    );

    // Task
    const task = (
      <PostTaskMenu
        onClick={this.reactPostTaskClicked}
        post={post}
        taskInfo={this.props.taskInfo}
        userType={this.props.currentUserInfo.userType}
        isTaskPost={this.props.isTaskPost}
        isOwner={this.props.isOwner}
        postToTask={false}
        disabled={false}
      />
    );
    const editPostTaskModal = (
      <PostTaskMenu
        // post={post}
        onClick={this.reactPostTaskClicked}
        taskInfo={this.props.taskInfo}
        userType={this.props.currentUserInfo.userType}
        isTaskPost={this.props.isTaskPost}
        postToTask={true}
        reactEditPostTask={this.reactEditPostTask}
        isOwner={this.props.isOwner}
        disabled={false}
      />
    );
    const taskDisabled = (
      <PostTaskMenu
        // post={post}
        onClick={this.reactPostTaskClicked}
        taskInfo={this.props.taskInfo}
        userType={this.props.currentUserInfo.userType}
        isTaskPost={this.props.isTaskPost}
        postToTask={false}
        reactEditPostTask={this.reactEditPostTask}
        isOwner={this.props.isOwner}
        disabled={true}
      />
    );
    const moreBtn = (
      <MoreButtonWrapper className="p-0 m-0 align-items-center more-box">
        <Dropdown>
          <Dropdown.Toggle>
            <OverlayTrigger
              className="hidden-xs"
              delayShow={500}
              placement="top"
              overlay={tooltipMore}
            >
              <img
                alt="iconMore"
                // onMouseEnter={() => this.setState({ moreIcon: iconMoreGreen })}
                // onMouseLeave={() => this.setState({ moreIcon: iconMore })}
                src={this.state.moreIcon}
              />
            </OverlayTrigger>
          </Dropdown.Toggle>
          <Dropdown.Menu
            alignRight={true}
            rootCloseEvent="mousedown"
            className="dropdown-menu more-dropdown-menu"
          >
            <div
              ref={(ref) => (this.postInfoWrapRef = ref)}
              className="dropdown-more-action"
            >
              <Dropdown.Item toggle={true} className="dropdown-item">
                {this.props.currentUserInfo.userType !== "GUEST"
                  ? tag
                  : tagPostDisabled}
              </Dropdown.Item>
              <div className="dropdown-item">
                {this.props.channelType === ChannelConstants.INTERNAL
                  ? this.props.currentUserInfo.userType !== "GUEST"
                    ? postForwarding
                    : postForwarding
                  : postForwarding}
              </div>
              <div className="dropdown-item">
                {this.props.currentUserInfo.userType !== "GUEST"
                  ? this.props.isTaskPost
                    ? task
                    : editPostTaskModal
                  : taskDisabled}
              </div>
              <div className="dropdown-item">
                {this.props.isOwner
                  ? this.props.isTaskPost
                    ? editPostTask
                    : editPost
                  : editPostDisabled}
              </div>
              <div className="dropdown-item">
                {this.props.isOwner ? hidePost : hidePostDisabled}
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </MoreButtonWrapper>
    );

    return (
      <>
        {this.props.channelStatus !== "LOCKED" && !this.props.homeFlag && (
          <div
            id="post__toolbox__container"
            ref="post-action"
            className={"post__toolbox post__toolbox__container"}
          >
            <Mention className="mention-block">
              {this.props.currentUserInfo.userType !== "GUEST"
                ? reactCheck
                : checkPostDisabled}
              {this.props.currentUserInfo.userType !== "GUEST"
                ? reactPlusOne
                : reactPlusOnedisabled}
              {this.props.currentUserInfo.userType !== "GUEST"
                ? reactMinusOne
                : reactMinusOneDisabled}
            </Mention>
            <Divider className="divider">
              <SVG src={iconDivider}></SVG>
            </Divider>
            {/* <div style={{ width: "1px", backgroundColor: "#cccccc" }}></div> */}
            {this.props.hideReplyView === false ||
            this.props.toggleUnreadMessageFlag
              ? null
              : comment}

            {this.props.currentUserInfo.userType !== "GUEST"
              ? save
              : savePostDisabled}
            {moreBtn}

            {/*{this.props.currentUserInfo.userType !== "GUEST"*/}
            {/*  ? tag*/}
            {/*  : tagPostDisabled}*/}

            {/*{this.props.isOwner*/}
            {/*  ? this.props.isTaskPost*/}
            {/*    ? editPostTask*/}
            {/*    : editPost*/}
            {/*  : editPostDisabled}*/}

            {/*{this.props.channelType === ChannelConstants.INTERNAL*/}
            {/*  ? this.props.currentUserInfo.userType !== "GUEST"*/}
            {/*    ? postForwarding*/}
            {/*    : postForwarding*/}
            {/*  : postForwarding}*/}
            {/*{this.props.isOwner ? hidePost : hidePostDisabled}*/}
            {/* {deletePost} */}
            {/*{this.props?.isAuthenticated && forwardPostToEmail}*/}
          </div>
        )}
      </>
    );
  };

  render() {
    const post = this.props.post;
    const options = this.buildOptions(post);
    return (
      <>
        {/* <div className="col ml-0 px-0">
					{post && post.edited ? (
						<PostHistoryModal post={post} />
					) : (
						<PostTime
							eventTime={parseInt(post.createdAt)}
							postId={post.id}
							isLink={false}
						/>
					)}
				</div>
				{!PostUtils.isSystemMessage(post) ? !this.props.postForwardFlag && options : "" }
				</div> */}
        {!PostUtils.isSystemMessage(post) &&
          !this.props.postForwardFlag &&
          options}
      </>
    );
  }
}
function mapStateToProps(state, ownProps) {
  const config = state.config;
  let channelId = config.activeSelectedChannel
    ? config.activeSelectedChannel.id
    : "";
  let channel = config.activeSelectedChannel;
  const channelStatus = config.activeSelectedChannel?.status;
  const channelType = config.activeSelectedChannel?.type;
  const isPostEditing = state.editPostReducer.postId;
  const enableEmojiPicker = true;
  const currentUserInfo = state.AuthReducer.user;
  const toggle = state.channelMessages.toggleEditor;
  const lastPost = state.channelMessages.lastPost;
  return {
    isMobile: false,
    enableEmojiPicker,
    isReadOnly: false,
    channel,
    channelId,
    channelStatus,
    channelType,
    currentUserInfo,
    isPostEditing,
    toggle,
    lastPost,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        PostEditAction,
        postHideAction,
        addReactionAction,
        removeReactionAction,
        toggleEditor,
        setPostToReply,
      },
      dispatch
    ),
    postTagToServer: (criteria) => dispatch(postTagToServer(criteria)),
    postTaskToServer: (criteria) => dispatch(postTaskToServer(criteria)),
    removeTag: (criteria) => dispatch(removeTag(criteria)),
    postSavesToServer: (criteria) => dispatch(postSavesToServer(criteria)),
    removeSave: (criteria) => dispatch(removeSave(criteria)),
    PostEditAction: (channelId, postId) =>
      dispatch(PostEditAction(channelId, postId)),
    postHideAction: (channelId, postId) =>
      dispatch(postHideAction(channelId, postId)),
    toggleEditor: (toggle, currentPost) =>
      dispatch(toggleEditor(toggle, currentPost)),
    setPostToReply: (post) => dispatch(setPostToReply(post)),
    dispatch,
  };
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(PostInfo)
);
