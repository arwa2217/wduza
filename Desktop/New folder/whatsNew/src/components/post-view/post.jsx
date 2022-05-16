import PropTypes from "prop-types";
import React from "react";
import PostHeader from "./post-header/post-header";
import PostMsgView from "./post-msg-view/post-msg-view";
import PostUtils from "../utils/post-utils";
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "./post.css";
import exclamation from "../../assets/icons/exclamation.svg";
import InView from "react-intersection-observer";
import { withTranslation } from "react-i18next";
import messagesVisibilityTracker from "../../utilities/message-visibility-tracker";
import logo from "../../assets/icons/logo.svg";
import defaultUser from "../../assets/icons/default-user.svg";
import systemLogo from "../../assets/icons/v2/ic_member_new.svg";
import { ReplyViewWrapper } from "./reply-view/ReplyViewWrapper";
import { PostContextProvider } from "./postContext";
import PostProfilePicture from "./post-profile-picture/post-profile-picture";
import {
  requestOpenReplyPost,
  setCurrentReplyParent,
} from "../../store/actions/PostReplyActions";
import { toggleUnreadMessage } from "../../store/actions/channelMessagesAction";
import {
  resetRedirectPostId,
  setRedirectPostId,
} from "../../store/actions/config-actions";
import { ForwardPost } from "./forward-view/forward-post";
import CommonUtils from "../utils/common-utils";
import PostForwardRedirectionModal from "../../components/post-view/post-forward-redirection-popup";
import BookMarkIcon from "../../assets/icons/v2/ic_bookmark_act.svg";
import { PostReactionType } from "./post-reaction/post-reaction-type";
import CheckIcon from "../../assets/icons/v2/ic_check.svg";
import PlusIcon from "../../assets/icons/v2/ic_plus.svg";
import MinusIcon from "../../assets/icons/v2/ic_minus.svg";
import Badge from "../../assets/icons/notification-badge.svg";
import SVG from "react-inlinesvg";
import RepliedHeader from "../messages/RepliedHeader";
import styled from "styled-components";
import MessagePost from "../messages/messages-post";
import postInfo from "./post-info/post-info";

// const Reaction = styled.div`
//   .reaction-type-check {
//     path {
//       stroke: #00a95b;
//     }
//     .check-number {
//       color: #00a95b;
//     }
//   }
//   .reaction-type-up {
//     path {
//       stroke: #0796ff;
//     }
//     .plus-number {
//       color: #0796ff;
//     }
//   }
//   .reaction-type-down {
//     path {
//       stroke: #f16354;
//     }
//     .minus-number {
//       color: #f16354;
//     }
//   }
// `;
class Post extends React.PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    user: PropTypes.object,
    currentUser: PropTypes.object.isRequired,
    consecutivePostByUser: PropTypes.bool,
  };

  static defaultProps = {
    post: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpened: false,
      hover: false,
      sameRoot: this.hasSameRoot(props),
      showReplies: false,
      showReplyRqstByPTBox: false,
      openFwdModal: false,
      showUnreadReplies: true,
    };
    this.updateShowReplies = this.updateShowReplies.bind(this);
    this.updateUnreadShowReplies = this.updateUnreadShowReplies.bind(this);
    this.forceHideReplies = this.forceHideReplies.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps &&
      nextProps.redirectFlag &&
      nextProps.redirectPost &&
      nextProps.redirectPost !== "undefined" &&
      nextProps.redirectPost === nextProps.parentPostId
    ) {
      return { showReplies: true };
    }

    let hasSameRoot = false;
    const post = nextProps.post;
    // if (nextProps.consecutivePostByUser) {
    //   hasSameRoot = true;
    // } else if (post.root_id) {reactionInfoVal
  }

  handleCommentClick = (e) => {
    e.preventDefault();

    const post = this.props.post;
    if (!post) {
      return;
    }
  };

  handleDropdownOpened = (opened) => {
    this.setState({
      dropdownOpened: opened,
    });
  };
  hasSameRoot = (props) => {
    const post = props.post;
    // if (props.consecutivePostByUser) {
    //   return true;
    // } else if (post.root_id) {
    //   return true;
    // }

    return false;
  };

  getClassName = (post, isSystemMessage) => {
    let className = "post post-view";

    let rootUser = "other--root";
    // if (this.state.sameRoot) {
    //   rootUser = "same--root";
    // } else {
    //   rootUser = "other--root";
    // }

    let currentUserCss = "";
    if (this.props.currentUser.id === post.user_id && !isSystemMessage) {
      currentUserCss = "current--user";
    }

    let sameUserClass = "";
    if (this.props.consecutivePostByUser) {
      sameUserClass = "same--user";
    }

    if (isSystemMessage) {
      className += " post--system";
      sameUserClass = "";
      currentUserCss = "";
      rootUser = "";
    }

    if (this.state.dropdownOpened) {
      className += " post--hovered";
    }

    return (
      className + " " + sameUserClass + " " + rootUser + " " + currentUserCss
    );
  };

  getRef = (node) => {
    this.domNode = node;
  };

  setHover = () => {
    this.setState({ hover: true });
  };

  setFwdValue = () => {
    this.setState({ openFwdModal: !this.state.openFwdModal });
  };

  unsetHover = () => {
    this.setState({ hover: false });
  };

  getLatestTag = (tagArray) => {
    let time = 0;
    let tagName = "";
    tagArray.map((tag) => {
      if (new Date(tag.createdAt).getTime() > time) {
        tagName =
          tag.tagName === "IMPORTANT"
            ? "Important"
            : tag.tagName === "DECISION"
            ? "Done"
            : tag.tagName === "QUESTION"
            ? "In Progress"
            : tag.tagName === "FOLLOW-UP"
            ? "To-Do"
            : tag.tagName === "APPROVALREQUIRED"
            ? "Request approved"
            : tag.tagName === "APPROVED"
            ? "Approved"
            : "";
        time = new Date(tag.createdAt).getTime();
      }
      return tag;
    });

    return tagName;
  };

  getUserProfile = (id) => {
    let img = undefined;
    if (id === "system") {
      return systemLogo;
    }
    if (id === "monoly") {
      return logo;
    }
    if (this.props.members && this.props.members.length > 0) {
      this.props.members.map((member) => {
        if (member.id === id && member.userImg && member.userImg !== "") {
          img = member.userImg;
        }
        return member;
      });
    }
    return img;
  };
  updateShowReplies(overRideFlagValue, requestedByPostToolbox) {
    setCurrentReplyParent(this.props.post.id);
    this.setState({ showReplyRqstByPTBox: requestedByPostToolbox });
    
    if (typeof overRideFlagValue !== "undefined") {
      this.setState({ showReplies: overRideFlagValue });
    } else {
      this.setState({ showReplies: !this.state.showReplies });
    }
  }
  updateUnreadShowReplies() {
    // setCurrentReplyParent(this.props.post.id)
    this.setState({ showUnreadReplies: !this.state.showUnreadReplies });
  }
  forceHideReplies() {
    this.setState({ showReplies: false });
  }
  getUserInfo = (id, userData) => {
    let user = userData;
    let userDisplayName = userData?.displayName;
    if (id === "system") {
      return user;
    }
    if (this.props.members && this.props.members.length > 0) {
      this.props.members.map((member) => {
        if (member.id === id) {
          user = member;
          if (userDisplayName !== undefined || userDisplayName !== "") {
            user.displayName = userDisplayName;
          }
        }
        return member;
      });
    }
    return user;
  };
  CheckRedirectionStatus = (fwdMessageContent) => {
    console.log("fwdMessageContent", fwdMessageContent);
    if (fwdMessageContent?.channelId === "") {
      this.setFwdValue();
    } else {
      let channelExists = this.props.channelList.filter(
        (item) =>
          item.id === fwdMessageContent?.channelId && item.status !== "DELETED"
      );
      if (this.props.forwardedPost?.isHidden) {
        if (channelExists && channelExists.length < 1) {
          this.setFwdValue();
        } else if (
          this.props.forwardedPost?.user.id !== this.props.currentUser?.id
        ) {
          return;
        } else {
          this.redirectToPost(fwdMessageContent);
        }
      } else if (channelExists && channelExists.length < 1) {
        this.setFwdValue();
      } else {
        this.redirectToPost(fwdMessageContent);
      }
    }
  };

  redirectToPost = (fwdMessageContent) => {
    let data;
    if (fwdMessageContent) {
      data = fwdMessageContent;

      if (data.channelId && data.channelName && data.post && data.post.id) {
        let postId = data
          ? data.parentId
            ? data.parentId
            : data.post?.id
          : "";
        let childPostId = data ? (data?.parentId ? data.post.id : "") : "";
        if (this.props.toggleUnreadMessageFlag) {
          this.props.toggleUnreadMessage(data.channelId, false);
        }
        this.props.requestOpenReplyPost(childPostId);
        CommonUtils.performNotificationAction(
          data.channelName,
          "forward",
          "forward",
          data.channelId,
          postId,
          childPostId,
          this.props.dispatch
        );
        // props.updateShowReplies(undefined, true);
        // updateShowReplies("undefined","undefined");
      }
    }
  };

  callback = (done) => {
    done();
  };

  isOwnerReaction = (reactions = {}, type) => {
    // console.log("isOwnerReaction");
    const {
      reactionStats: { Reactions = [] },
    } = reactions;
    const usersReactions =
      Reactions.find((item) => item.type === type).users || [];
    const usersIdReactions = usersReactions.map((item) => item.userId);
    const {
      currentUser: { id },
    } = this.props;
    return usersIdReactions.includes(id);
  };

  render() {
    const reactionInfoVal =
      this.props.reactions?.reactionStats?.Reactions?.filter(
        (item) =>
          item.type === "CHECKED" || item.type === "UP" || item.type === "DOWN"
      );
    const checkedMemberList =
      reactionInfoVal?.length > 0 ? reactionInfoVal[0].users : [];
    const upMemberList =
      reactionInfoVal?.length > 0 ? reactionInfoVal[1].users : [];
    const downMemberList =
      reactionInfoVal?.length > 0 ? reactionInfoVal[2].users : [];

    let userId = this.props.currentUser?.id;

    let isForwardOwner =
      this.props.fwdStats &&
      this.props.fwdStats.forwards &&
      this.props.fwdStats.forwards.filter((el) => el.fwdByUserID === userId)
        .length > 0;

    let isOwner =
      checkedMemberList &&
      checkedMemberList.some(function (el) {
        return el.userId === userId;
      });
    let isUpUser =
      upMemberList &&
      upMemberList.some(function (el) {
        return el.userId === userId;
      });
    let isDownUser =
      downMemberList &&
      downMemberList.some(function (el) {
        return el.userId === userId;
      });

    const { post, savedPost, tagInfo, reactions, hideReplyView, isUnread } =
      this.props;
    const {
      isPostEditing,
      editingPostChannelId,
      editingPostId,
      redirectPostId,
      iconVisibility,
    } = this.props;
    if (!post.id) {
      return null;
    }
    let hasCheckedReaction = false;
    let hasUPReaction = false;
    let hasDOWNReaction = false;
    // let usersCheck = reactions?.reactionStats?.Reactions?.find((item) => item.type === "CHECKED")?.users || [];
    // const usersId = usersCheck.map((item) => item.userId);

    // console.log('usersId ::', usersId);
    // console.log('reactions?.reactionStats?.Reactions ::', reactions?.reactionStats?.Reactions);
    // console.log('current ID ::', this.props.currentUser.id);

    if (reactions && reactions.reactionStats) {
      hasCheckedReaction = reactions.reactionStats.checked > 0;
      hasUPReaction = reactions.reactionStats.up > 0;
      hasDOWNReaction = reactions.reactionStats.down > 0;
    }
    const isSystemMessage = PostUtils.isSystemMessage(post);
    const isUserPost = PostUtils.isUserPost(post);
    const isTaskPost = PostUtils.isTaskPost(post);
    let user = this.getUserInfo(this.props.user?.id, this.props.user);
    let profilePic = this.getUserProfile(this.props.user?.id);
    const hideProfilePicture =
      this.state.sameRoot && this.props.consecutivePostByUser && !post.root_id;
    if (!hideProfilePicture) {
      profilePic = (
        <PostProfilePicture
          src={this.getUserProfile(this.props.user?.id)}
          user={this.getUserInfo(this.props.user?.id, this.props.user)}
          isSystemMessage={isSystemMessage}
        />
      );
    }
    // const showReactedUserList = (event) => {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   var parentTarget;
    //   const reactionType = this?.refs?.reaction.getAttribute("data-reaction");
    //   switch (reactionType) {
    //     case PostReactionType.CHECK:
    //       parentTarget = document.getElementById(
    //         "reaction_check_container" + this.props.post.id
    //       );
    //       break;
    //     case PostReactionType.UP_ONE:
    //       parentTarget = document.getElementById(
    //         "reaction_up_container" + this.props.post.id
    //       );
    //       break;
    //     case PostReactionType.DOWN_ONE:
    //       parentTarget = document.getElementById(
    //         "reaction_down_container" + this.props.post.id
    //       );
    //       break;
    //     default:
    //   }
    //   if (parentTarget) {
    //     const channelMembers = this.props.members;
    //     const reactionInfo =
    //       this.props.reactions.reactionStats.Reactions?.filter(
    //         (item) => item.type === reactionType
    //       );
    //     const reactedMemberList =
    //       reactionInfo?.length > 0 ? reactionInfo[0].users : [];
    //     var index = 0;
    //     const memberList = [];
    //     for (index = 0; index < reactedMemberList.length; index++) {
    //       var innerIndex = 0;
    //       for (
    //         innerIndex = 0;
    //         innerIndex < channelMembers.length;
    //         innerIndex++
    //       ) {
    //         if (
    //           channelMembers[innerIndex].id === reactedMemberList[index].userId
    //         ) {
    //           memberList.push(channelMembers[innerIndex]);
    //           break;
    //         }
    //       }
    //     }
    //     if (memberList.length > 0) {
    //       renderUtil.renderMemberList(
    //         parentTarget,
    //         memberList,
    //         this.props.channel,
    //         this.props.currentUser.id
    //       );
    //     }
    //   }
    // };
    // const hideReactedUserList = (event) => {
    //   event.stopPropagation();
    //   event.preventDefault();
    //   var parentTarget;
    //   const reactionType = this?.refs?.reaction.getAttribute("data-reaction");
    //   switch (reactionType) {
    //     case PostReactionType.CHECK:
    //       parentTarget = document.getElementById(
    //         "reaction_check_container" + this.props.post.id
    //       );
    //       break;
    //     case PostReactionType.UP_ONE:
    //       parentTarget = document.getElementById(
    //         "reaction_up_container" + this.props.post.id
    //       );
    //       break;
    //     case PostReactionType.DOWN_ONE:
    //       parentTarget = document.getElementById(
    //         "reaction_down_container" + this.props.post.id
    //       );
    //       break;
    //     default:
    //   }
    //   setTimeout(() => {
    //     renderUtil.removeMemberList(parentTarget, [], 0, "");
    //   }, 200);
    // };
    // console.log("props", this.props)
    return (
      <PostContextProvider
        value={{
          updateShowReplies: this.updateShowReplies,
          hideReplyView: this.props.hideReplyView,
        }}
      >
        {/* <div className={this.state.showReplies ? "post_showingReplies" : ""}> */}
        <InView
          id={`${this.props.appendId ? "fwd_" : ""}${this.props.id}`}
          ref={this.getRef}
          className={`${this.getClassName(post, isSystemMessage)} ${
            this.state.showReplies ? "post_showingReplies" : ""
          } ${
            this.props.toggleUnreadMessageFlag && isUnread ? "post__unread" : ""
          } `}
          onMouseOver={this.setHover}
          onMouseLeave={this.unsetHover}
          onTouchStart={this.setHover}
          as="div"
          onChange={(inView, entry) => {
            if (
              inView &&
              !this.props.homeFlag &&
              this.props.postInfo.isUnread
            ) {
              const { createdAt, id, isReply } = this.props;
              let parentPostId = undefined;
              if (isReply) {
                parentPostId = this.props.postInfo.parentId;
              }
              const { sequence_id } = this.props.postInfo;
              const lastPostReadAt =
                messagesVisibilityTracker.updateLastReadPost(
                  id,
                  createdAt,
                  sequence_id,
                  parentPostId
                );
            }
          }}
        >
          <div className={`post__content  ${savedPost ? "mt-0" : "mt-1"}`}>
            <div
              className={`post__desc ${
                this.props.forwardedPostId ? "post-foward-wrap" : ""
              }`}
            >
              <div className="left-border">
                <div
                  className={`post__desc__inner  
                  ${
                    this.props.user && this.props.user?.id === "system"
                      ? "owner-add"
                      : ""
                  } 
                  `}
                >
                  {isUserPost && savedPost && (
                    <img
                      className="post_bookmark"
                      src={BookMarkIcon}
                      alt="book-mark-icon"
                    />
                  )}
                  {/*{this.props.user.id !== this.props.currentUser.id &&*/}
                  {/*  isUnread && (*/}
                  {/*    <img*/}
                  {/*        className="post_notification"*/}
                  {/*        src={Badge}*/}
                  {/*        alt="notification-icon"*/}
                  {/*    />*/}
                  {/*)}*/}

                  {/* Do not remove this comment */}

                  {/* Do not remove this comment */}

                  {/* {redirectPostId === post.id && !(props.globalSearch)&&
                  (iconVisibility === undefined || iconVisibility) && (
                    <img
                      className='post-redirect-arrow'
                      src={redirectionArrow}
                      alt='redirection-arrow'
                    />
                  )} */}
                  {/* {isUserPost && savedPost && (
                    <div className="post_save_indicator">
                      <img alt="" src={iconPostSave} />
                      <label className="ml-2 mb-0">
                              {t("postInfo:added.to.my.saves")}
                            </label>
                    </div>
                  )} */}

                  <PostHeader
                    //fwdUserProfileImage={}
                    forwardedPostId={this.props.forwardedPostId}
                    mainPostId={this.props.post.id}
                    message={this.props.forwardedPost}
                    currentUser={this.props.currentUser}
                    channelId={this.props.channel?.id}
                    members={this.props.members}
                    isPostToTask={this.props.isPostToTask}
                    isUnread={this.props.isUnread}
                    postOwnerId={this.props.user}
                    fwdPostStatus={this.props?.fwdStats}
                    emailFwdHistory={this.props?.emailFwdHistory}
                    postInfo={this.props.postInfo}
                    post={post}
                    handleCommentClick={this.handleCommentClick}
                    handleDropdownOpened={this.handleDropdownOpened}
                    user={this.getUserInfo(this.props.user?.id, this.props.user)}
                    src={this.getUserProfile(this.props.user?.id)}
                    hover={this.state.hover}
                    tagInfo={tagInfo}
                    reactions={reactions}
                    savedPost={savedPost}
                    isUserPost={isUserPost}
                    isTaskPost={isTaskPost}
                    hasCheckedReaction={hasCheckedReaction}
                    hasDOWNReaction={hasDOWNReaction}
                    hasUPReaction={hasUPReaction}
                    isOwner={isOwner}
                    isUpUser={isUpUser}
                    isDownUser={isDownUser}
                    getLatestTag={this.getLatestTag}
                    isHiddenPost={this.props.isHiddenPost}
                    homeFlag={this.props?.homeFlag ? this.props.homeFlag : ""}
                    postForwardFlag={!!this.props.postForwardFlag}
                    taskInfo={this.props.taskInfo}
                    globalSearch={
                      this.props?.globalSearch ? this.props.globalSearch : false
                    }
                    isForwardOwner={isForwardOwner}
                    toggleUnreadMessageFlag={this.props.toggleUnreadMessageFlag}
                    updateShowReplies={this.updateShowReplies}
                    showReplies={this.state.showReplies}
                    isStyleInline={this.props.isStyleInline || false}
                    hasParentPostContent={
                      this.props.parentPostContent &&
                      Object.keys(this.props.parentPostContent).length > 0
                    }
                    parentPostContent={this.props.parentPostContent}
                    forwardedPost={this.props.forwardedPost}
                    CheckRedirectionStatus={this.CheckRedirectionStatus}
                  />

                  {/* {this.props.parentPostContent &&
                Object.keys(this.props.parentPostContent).length > 0 && (
                  <RepliedHeader
                    props={this.props}
                    parent={this.props.parentPostContent}
                  />
                )} */}
                  {this.props.isForwardPostInclude ? (
                    <>
                      {!(isPostEditing && editingPostId === post.id) && (
                        <PostMsgView
                       
                          post={post}
                          userData={this.getUserProfile(
                            this.props.taskInfo?.taskAssignee
                          )}
                          
                          handleCommentClick={this.handleCommentClick}
                          fileList={this.props.fileList}
                          userName={this.props.user?.displayName}
                          currentUser={this.props.currentUser}
                          tagInfo={tagInfo}
                          isReply={this.props.isReply}
                          isEmbeddedLink={this.props.isEmbeddedLink}
                          embeddedLinkData={this.props.embeddedLinkData}
                          channelMembers={this.props.members}
                          isPostOwner={this.props.isPostOwner}
                          isHiddenPost={this.props.isHiddenPost}
                          homeFlag={
                            this.props?.homeFlag ? this.props.homeFlag : ""
                          }
                          taskInfo={this.props.taskInfo}
                          isTaskPost={isTaskPost}
                          taskStatus={this.props.taskStatus}
                          isPostToTask={
                            this.props.forwardedPost?.id &&
                            this.props.taskInfo &&
                            this.props.post.content === ""
                          }
                          postInfo={this.props.postInfo}
                          forwardedPostId={this.props.forwardedPostId}
                          mainPostId={this.props.post.id}
                          message={this.props.forwardedPost}
                          channelId={this.props.channel.id}
                          members={this.props.members}
                          CheckRedirectionStatus={this.CheckRedirectionStatus}
                          postOwnerId={
                            this.props.postOwnerId
                              ? this.props.postOwnerId
                              : this.props.user?.id
                          }
                        />
                      )}

                      {/* Edit Post File */}
                      {isUserPost &&
                        isPostEditing &&
                        editingPostChannelId ===
                          (this.props.channel && this.props.channel.id) &&
                        editingPostId === post.id && (
                          <Modal
                              show={isPostEditing}
                              aria-labelledby="contained-modal-title-center"
                              centered
                              className="edit-post"
                          >
                            <Modal.Header className="modal-head-container">
                              <Modal.Title className="heading-title">Edit Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form.Group className="mention-block">
                                <div className="post-edit-editor">
                                  <MessagePost
                                    post={this.props.postInfo}
                                    channel={this.props.channel}
                                    title="Post1"
                                    channelMembers={this.props.members}
                                    isEditing={!!editingPostId}
                                    updateShowReplies={this.updateShowReplies}
                                    isTaskModal={true}
                                  />
                                </div>
                              </Form.Group>
                            </Modal.Body>
                          </Modal>
                       )}

                      {post.postStatus && post.postStatus === "failed" && (
                        <img
                          src={exclamation}
                          height="10px"
                          width="10px"
                          alt="exclamation"
                        />
                      )}
                      {this.props.forwardedPost?.id &&
                        this.props.taskInfo? (
                        ""
                      ) : (
                        <div
                          className="forward-post"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            this.CheckRedirectionStatus(
                              this.props.forwardedPost
                            );
                          }}
                        >
                          <ForwardPost
                            forwardedPostId={this.props.forwardedPostId}
                            mainPostId={this.props.post.id}
                            message={this.props.forwardedPost}
                            currentUser={this.props.currentUser}
                            channelId={this.props.channel?.id}
                            members={this.props.members}
                            isPostToTask={this.props.isPostToTask}
                            postOwnerId={this.props.user}
                          />
                        </div>
                      )}
                      {/* {this.state.openFwdModal && (
                        <PostForwardRedirectionModal
                          fwdPopup={this.state.openFwdModal}
                          togglePopup={this.setFwdValue}
                        />
                      )} */}
                    </>
                  ) : (
                    <>
                      {!(isPostEditing && editingPostId === post.id) && (
                        <PostMsgView
                          post={post}
                          
                          userData={this.getUserProfile(
                            this.props.taskInfo?.taskAssignee
                          )}
                          handleCommentClick={this.handleCommentClick}
                          fileList={this.props.fileList}
                          userName={this.props.user?.displayName}
                          currentUser={this.props.currentUser}
                          tagInfo={tagInfo}
                          isReply={this.props.isReply}
                          isEmbeddedLink={this.props.isEmbeddedLink}
                          embeddedLinkData={this.props.embeddedLinkData}
                          channelMembers={this.props.members}
                          isPostOwner={this.props.isPostOwner}
                          isHiddenPost={this.props.isHiddenPost}
                          homeFlag={
                            this.props?.homeFlag ? this.props.homeFlag : ""
                          }
                          postInfo={this.props.postInfo}
                          taskInfo={this.props.taskInfo}
                          isTaskPost={isTaskPost}
                          taskStatus={this.props.taskStatus}
                          postForwardFlag={this.props.postForwardFlag}
                          CheckRedirectionStatus={this.CheckRedirectionStatus}
                          isFileSidePanel={this.props.isFileSidePanel}
                          postOwnerId={
                            this.props.postOwnerId
                              ? this.props.postOwnerId
                              : this.props.user?.id
                          }
                        />
                      )}

                      {/* Edit post */}
                      {isUserPost &&
                        isPostEditing &&
                        editingPostChannelId ===
                          (this.props.channel && this.props.channel.id) &&
                        editingPostId === post.id && (
                          <Modal
                              show={isPostEditing}
                              aria-labelledby="contained-modal-title-center"
                              centered
                              className="edit-post"
                          >
                            <Modal.Header className="modal-head-container">
                              <Modal.Title className="heading-title">Edit Post</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              <Form.Group className="mention-block">
                                <div className="post-edit-editor">
                                  <MessagePost
                                    post={this.props.postInfo}
                                    channel={this.props.channel}
                                    channelMembers={this.props.members}
                                    title="Post2"
                                    isTaskModal={true}
                                  />
                                </div>
                              </Form.Group>
                            </Modal.Body>
                          </Modal>
                        )}
                      {post.postStatus && post.postStatus === "failed" && (
                        <img
                          src={exclamation}
                          height="10px"
                          width="10px"
                          alt="exclamation"
                        />
                      )}
                    </>
                  )}
                </div>
                {/* {isUserPost &&
                  !isSystemMessage &&
                  !hideReplyView &&
                  this.props.replyCount > 0 && (
                    <div className="post-reply-divider"></div>
                  )} */}
                <div className="post-footer d-flex justify-content-between align-items-center">
                  {/* {!this.state.showReplies && (
                    <div
                      className="post-reaction d-flex"
                      style={{ paddingLeft: "50px" }}
                    >
                      {hasCheckedReaction && !this.props.postForwardFlag && (
                        <Reaction
                          // onMouseEnter={showReactedUserList}
                          // onMouseLeave={hideReactedUserList}
                          ref="reaction"
                          data-reaction={PostReactionType.CHECK}
                        >
                          <div
                            className="ReplyView__tooltip"
                            id={"reaction_check_container" + post.id}
                          ></div>
                          <span
                            className={`d-flex align-items-center ${
                              this.isOwnerReaction(reactions, "CHECKED") &&
                              "reaction-type-check"
                            }`}
                            style={{
                              fontSize: "11px",
                              color: "rgba(0, 0, 0, 0.4)",
                              marginRight: "8px",
                            }}
                          >
                            <SVG
                              src={CheckIcon}
                              alt="check-icon"
                              className={"post-react-img "}
                            />
                            <span
                              style={{ fontSize: "11px", height: "14px" }}
                              className="check-number"
                            >
                              {reactions.reactionStats.checked}
                            </span>
                          </span>
                        </Reaction>
                      )}
                      {hasUPReaction && !this.props.postForwardFlag && (
                        <Reaction
                          // onMouseEnter={showReactedUserList}
                          // onMouseLeave={hideReactedUserList}
                          ref="reaction"
                          data-reaction={PostReactionType.UP_ONE}
                        >
                          <div
                            className="ReplyView__tooltip"
                            id={"reaction_up_container" + post.id}
                          ></div>

                          <span
                            className={`d-flex align-items-center ${
                              this.isOwnerReaction(reactions, "UP") &&
                              "reaction-type-up"
                            }`}
                            style={{
                              fontSize: "11px",
                              color: "rgba(0, 0, 0, 0.4)",
                              marginRight: "8px",
                            }}

                            // onMouseEnter={showReactedUserList}
                            // onMouseLeave={hideReactedUserList}
                          >
                            <SVG
                              src={PlusIcon}
                              alt="plus-icon"
                              className={"post-react-img "}
                            />
                            <span
                              style={{ fontSize: "11px", height: "13px" }}
                              className="plus-number"
                            >
                              {reactions.reactionStats.up}
                            </span>
                          </span>
                        </Reaction>
                      )}
                      {hasDOWNReaction && !this.props.postForwardFlag && (
                        <Reaction
                          // onMouseEnter={showReactedUserList}
                          // onMouseLeave={hideReactedUserList}
                          ref="reaction"
                          data-reaction={PostReactionType.DOWN_ONE}
                          className="reaction-type-down"
                        >
                          <div
                            className="ReplyView__tooltip"
                            id={"reaction_down_container" + post.id}
                          ></div>

                          <span
                            // onMouseEnter={
                            //   !props.postForwardFlag ? showReactedUserList : ""
                            // }
                            // onMouseLeave={hideReactedUserList}
                            className={`d-flex align-items-center ${
                              this.isOwnerReaction(reactions, "DOWN") &&
                              "reaction-type-down"
                            }`}
                            style={{
                              fontSize: "11px",
                              color: "rgba(0, 0, 0, 0.4)",
                            }}
                          >
                            <SVG
                              src={MinusIcon}
                              alt="minus-icon"
                              className={"post-react-img "}
                            />
                            <span
                              style={{ fontSize: "11px", height: "13px" }}
                              className="minus-number"
                            >
                              {reactions.reactionStats.down}
                            </span>
                          </span>
                        </Reaction>
                      )}
                    </div>
                  )} */}
                  {isUserPost && !isSystemMessage && !hideReplyView && (
                    <ReplyViewWrapper
                      showReplies={this.state.showReplies}
                      showUnreadReplies={
                        this.props.postInfo?.unreadReplyCount &&
                        this.props.postInfo?.unreadReplyCount > 0
                          ? this.state.showUnreadReplies
                          : false
                      }
                      toggleUnreadMessageFlag={
                        this.props.toggleUnreadMessageFlag
                      }
                      focusOnEditor={
                        this.state.showReplies &&
                        this.state.showReplyRqstByPTBox
                      }
                      updateShowReplies={this.updateShowReplies}
                      updateUnreadShowReplies={this.updateUnreadShowReplies}
                      totalReply={this.props.replyCount}
                      parentPostId={this.props.parentPostId}
                      postInfo={this.props?.postInfo}
                      forceHideReplies={this.forceHideReplies}
                      isHiddenReplyPost={this.props.isHiddenPost}
                      unreadReplyCount={this.props.unreadReplyCount}
                      fwdStats={this.props?.fwdStats}
                      hasCheckedReaction={hasCheckedReaction}
                      postForwardFlag={this.props.postForwardFlag}
                      PostReactionType={PostReactionType}
                      post={this.props.post}
                      reactions={this.props.reactions}
                      isOwnerReaction={this.isOwnerReaction}
                      CheckIcon={CheckIcon}
                      hasUPReaction={hasUPReaction}
                      postForwardFlagAction={this.props.postForwardFlag}
                      PlusIcon={PlusIcon}
                      MinusIcon={MinusIcon}
                      hasDOWNReaction={hasDOWNReaction}
                      currentUser={this.props.currentUser}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </InView>
        {/* </div> */}
      </PostContextProvider>
    );
  }
}
function mapStateToProps(state) {
  return {
    isPostEditing: state.editPostReducer.isEditing,
    editingPostChannelId: state.editPostReducer.channelId,
    editingPostId: state.editPostReducer.postId,
    isPostSaved: state.mySaveReducer.fetchedSaveDetails,
    savedPostId: state.mySaveReducer.postId,
    redirectFlag: state.postReplies?.redirectFlag,
    redirectPostId: state.config.redirectPostId,
    iconVisibility: state.config.iconVisibility,
    channelList: state.ChannelReducer?.channelList,
    toggleUnreadMessageFlag: state.channelMessages.toggleUnreadMessage,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    requestOpenReplyPost: (postId) => dispatch(requestOpenReplyPost(postId)),
    setRedirectPostId: (redirectPostId) =>
      dispatch(setRedirectPostId(redirectPostId)),
    resetRedirectPostId: () => dispatch(resetRedirectPostId()),
    setCurrentReplyParent: (id) => dispatch(setCurrentReplyParent()),
    toggleUnreadMessage: (channelId, isMessageFilterEnabled) =>
      dispatch(toggleUnreadMessage(channelId, isMessageFilterEnabled)),
    dispatch,
  };
}
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Post)
);
