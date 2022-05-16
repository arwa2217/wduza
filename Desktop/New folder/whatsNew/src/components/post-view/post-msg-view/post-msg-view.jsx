import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import AttachmentPost from "./attachment-post";
import TaskHistory from "./task-history";
import LinkPreview from "./link-preview";
import hljs from "highlight.js";
import "katex/dist/katex.css";
import "highlight.js/styles/xt256.css";
import { getEmbeddedLinkData } from "../../../store/actions/channelMessagesAction";
import { getEmbeddedLinkDataReply } from "../../../store/actions/PostReplyActions";
import { withTranslation } from "react-i18next";
import { taskConstants } from "../../../constants/task";
import { ForwardPost } from "../forward-view/forward-post";
import SVG from "react-inlinesvg";
import calendarIcon from "../../../assets/icons/v2/ic_calendar.svg";
import AssignUserIcon from "../../../assets/icons/v2/ic_member.svg";
class PostMsgView extends React.PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
    enableFormatting: PropTypes.bool,
    options: PropTypes.object,
  };

  static defaultProps = {
    options: {},
    isRHS: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      hasOverflow: false,
      checkOverflow: 0,
      overflowActive: false,
      removeOverflow: false,
      showLess: false,
    };
    this.imageProps = {
      onHeightReceived: this.handleHeightReceived,
    };

    this.weblinkProps = {
      siteName: undefined,
      title: undefined,
      desc: undefined,
      image: undefined,
      fetched: false,
    };
    this.nodeRef = React.createRef();
  }

  showMore = (e) => {
    e.stopPropagation();
    this.setState(() => {
      return {
        removeOverflow: true,
        overflowActive: false,
        showLess: true,
      };
    });
  };

  showLess = (e) => {
    e.stopPropagation();
    this.setState(() => {
      return {
        removeOverflow: false,
        overflowActive: true,
        showLess: false,
      };
    });
  };
  isEllipsisActive(e) {
    if (e) {
      return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
    } else {
      return false;
    }
  }

  componentDidMount() {
    this.highlight();
    this.setState({
      overflowActive: this.isEllipsisActive(this.nodeRef.current),
    });
    this.fetchEmbeddedLinkData();
    // this.props.fetchForwardDetailsById({postId:this.props.post.id});
  }

  componentDidUpdate() {
    this.highlight();
    this.setState({
      overflowActive: this.isEllipsisActive(this.nodeRef.current),
    });
    this.fetchEmbeddedLinkData();
  }

  fetchEmbeddedLinkData = () => {
    if (
      this.props.isEmbeddedLink &&
      this.props.embeddedLinkData === undefined
    ) {
      let target_url = null;
      let htmlString = this.props.post.content;
      target_url = htmlString
        .split(/<a[^>]*href=["']([^"']*)["']/gi)
        .filter((data, index) => index % 2 !== 0);

      // htmlString.match(
      // 	/(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gi
      // );
      if (target_url !== null && target_url.length > 0) {
        let requestParams = {
          siteArray: target_url,
          channel_id: this.props.selectedChannelId,
          post_id: this.props.post.id,
        };
        if (this.props.isReply) {
          this.props.getEmbeddedLinkReply(requestParams);
        } else {
          this.props.getEmbeddedLink(requestParams);
        }
      }
    }
  };

  handleHeightReceived = (height) => {
    if (height > 0) {
      this.setState((prevState) => {
        return { checkOverflow: prevState.checkOverflow + 1 };
      });
    }
  };

  highlight = () => {
    if (this.nodeRef) {
      const nodes = this.nodeRef.current?.querySelectorAll("pre");
      if (nodes) {
        nodes.forEach((node) => {
          hljs.highlightBlock(node);
        });
      }
    }
  };
  handleShowMoreLess = () => {
    const { overflowActive, showLess } = this.state;
    const { t } = this.props;
    if (overflowActive) {
      return (<p className="show-more-post">
          <span
              onClick={(e) => {
                this.showMore(e);
              }}
              style={{ cursor: "pointer" }}
          >
            {t("more")}
          </span>
      </p>)
    }
    if (showLess) {
      return (
          <p className="show-more-post show-less-post">
        <span
            onClick={(e) => {
              this.showLess(e);
            }}
            style={{ cursor: "pointer" }}
        >
            {t("less")}
          </span>
          </p>
      )
    }
  };
  renderElememts = () => {
    const {
      post,
      fileList,
      userName,
      isEmbeddedLink,
      embeddedLinkData,
      tagInfo,
      channelMembers,
      currentUser,
      t,
      isHiddenPost,
      isPostOwner,
      isFileSidePanel,
      postOwnerId,
    } = this.props;
    console.log('this.props.post',this.props?.post)
    let content;
    if (
      isHiddenPost &&
      this.props.postForwardFlag &&
      !this.props.isTaskPost &&
      !isPostOwner
    ) {
      content = `<span class="text-muted">${t("user.post.hide")}</span>`;
    } else if (
      isHiddenPost &&
      this.props.postForwardFlag &&
      this.props.isTaskPost &&
      !isPostOwner
    ) {
      content = `<span class="text-muted">${t("user.task.hide")}</span>`;
    } else if (post?.type === "SYSTEM") {
      content = `<span class="system-post">
      ${
        post?.content.includes("added")
          ? post?.content.replace("added", "invited").replace("by", "")
          : post?.content.replace("by", "")
      } <p class="post__time s__post__system">${t("postTime-child", {
        time: post?.createdAt,
      })}</p>
      </span>`;
    } else {
      content = post?.content;
    }
    
    const isContentCode = content?.split(" ").includes("<pre");
    return this.props.isPostToTask ? (
      <div
        className="forward-post"
        style={{ cursor: "pointer" }}
        onClick={() => {
          return this.props.CheckRedirectionStatus(this.props.message);
        }}
      >
        
        <ForwardPost
          forwardedPostId={this.props.forwardedPostId}
          mainPostId={this.props.mainPostId}
          message={this.props.message}
          currentUser={this.props.currentUser}
          channelId={this.props.channelId}
          members={this.props.members}
          isPostToTask={this.props.isPostToTask}
          isFileSidePanel={this.props.isFileSidePanel}
          postOwnerId={postOwnerId}
        />
      </div>
    ) :
     content === "" && this.props.isTaskPost ? (
      <span></span>
    ) : (
      <>
      <div className="post-overflow-wrapper">
        <div
          className={`${
            this.state.removeOverflow ? "post-overflow-hidden" : "post-overflow"
          } ${isContentCode ? "post-code" : ""}`}
          ref={this.nodeRef}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {this.handleShowMoreLess()}
        {isHiddenPost && this.props.postForwardFlag && !isPostOwner
          ? ""
          : isEmbeddedLink && (
              <LinkPreview embeddedLinkData={embeddedLinkData} />
            )}

        {(isHiddenPost && this.props.postForwardFlag && !isPostOwner) ||
        isFileSidePanel
          ? ""
          : fileList &&
            fileList.length > 0 && (
              <AttachmentPost
                post={post}
                userName={userName}
                fileList={this.props.fileList}
                tagInfo={tagInfo}
                members={channelMembers}
                currentUser={currentUser}
                postForwardFlag={this.props.postForwardFlag}
                postOwnerId={postOwnerId}
              />
            )}
      </div>
      <div
        className="forward-post"
        style={{ cursor: "pointer" }}
        onClick={() => {
          return this.props.CheckRedirectionStatus(this.props.message);
        }}
      >
      <ForwardPost
          forwardedPostId={this.props.forwardedPostId}
          mainPostId={this.props.mainPostId}
          message={this.props.message}
          currentUser={this.props.currentUser}
          channelId={this.props.channelId}
          members={this.props.members}
          isPostToTask={this.props.isPostToTask}
          isFileSidePanel={this.props.isFileSidePanel}
          postOwnerId={postOwnerId}
        />
        </div>
      </>
      
    );
  };

  render() {
    const {
      isPostOwner,
      isHiddenPost,
      post,
      enableFormatting,
      taskInfo,
      t,
      taskStatus,
    } = this.props;

    if (!enableFormatting) {
      return <span>{post.content}</span>;
    }
    const link = {
      className:
        (isHiddenPost && isPostOwner) ||
        (isHiddenPost && this.props.postForwardFlag && !isPostOwner)
          ? "post-message__text_hide message-post-wrap"
          : "post-message__text message-post-wrap",
    };
    console.log('this.props.isTaskPost;',this.props.isTaskPost)
    let isLocalTaskPost = this.props.isTaskPost;
    if (this.props.isTaskPost && !isPostOwner && isHiddenPost) {
      isLocalTaskPost = false;
    }
    // if(this.props.postInfo?.task?.taskAssignee && this.props.postInfo?.forwardedPost?.task?.taskAssignee){
    //   isLocalTaskPost = true;
    // }
    let assigneeUser = this.props.members?.filter(
      (member) => member.id === taskInfo?.taskAssignee
    );

    return (
      <div
        className={link.className}
        style={this.props.addStyle ? this.props.addStyle : {}}
      >
        {/* {!isReply && !homeFlag && (
					<PostTimeOnly
						eventTime={parseInt(post.createdAt)}
						postId={post.id}
						isLink={false}
					/>
				)} */}

        {!isLocalTaskPost ? (
          this.renderElememts()
        ) : (
          <div
            className="task-wrapper"
            style={
              taskStatus &&
              (taskStatus === taskConstants.DONE ||
              taskStatus === taskConstants.ASSIGN
                ? { borderColor: "#308F65" }
                : taskStatus === taskConstants.CANCELED ||
                  taskStatus === taskConstants.PENDING
                ? { borderColor: "rgba(0, 0, 0, 0.4)" }
                : taskStatus === taskConstants.TODO
                ? { borderColor: "#F16354" }
                : { borderColor: "#0796FF" })
            }
          >
            <div className="task-header">
              <div className="task-header-top">
                <div className="task-title">
                  {taskInfo && taskInfo.taskTitle}
                </div>
                <div className="task-info mr-0">
                  {/*{taskInfo && taskInfo.taskSequenceId && (
                    <span className="task-id">{taskInfo.taskSequenceId}</span>
                  )}*/}
                  <TaskHistory
                    taskInfo={this.props.taskInfo}
                    taskStatus={this.props.taskStatus}
                    post={post}
                    members={this.props.members}
                  />
                </div>
              </div>
              <div className="w-100 task-ownership">
                {/* <SVG src={timeIcon} style={{ verticalAlign: "text-top" }} />
                {`${
                  taskInfo && taskInfo.taskStartTime
                    ? t("taskTime-12", {
                        time: taskInfo?.taskStartTime,
                      })
                    : ""
                } ${
                  taskInfo && taskInfo.taskStartTime && taskInfo.taskStopTime
                    ? "-"
                    : ""
                } ${
                  taskInfo && taskInfo.taskStopTime
                    ? t("taskTime-12", {
                        time: taskInfo?.taskStopTime,
                      })
                    : ""
                }`}{" "} */}

                {/* (taskInfo && taskInfo.taskStartTime) ||
                      (taskInfo && taskInfo.taskStopTime)
                        ? "|"
                        : "" */}
                <div className="owner-ship-left">
                  {assigneeUser && assigneeUser.length > 0 ? (
                    <span className="assigner-name">
                      {`
                      Assigned to `}
                      <span className="task-assigned">
                        {assigneeUser[0].screenName}
                      </span>
                    </span>
                  ) : (
                    t("unknown.user")
                  )}
                  {assigneeUser && assigneeUser.length > 0 ?
                  <img
                    className="assigner-icon"
                    src={AssignUserIcon}
                    alt="assign-user-icon"
                  />:''}
                </div>

                <SVG
                  className="icon-calendar"
                  src={calendarIcon}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
            </div>

            <div
              className={
                post.content === "" && !this.props.isPostToTask
                  ? ""
                  : `task-body task-bg-${taskStatus?.toLowerCase()} task-border-${taskStatus?.toLowerCase()}`
              }
            >
              {this.renderElememts()}
            </div>
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  // let embeddedLinkData=state?.channelMessages?.messages?.embeddedLinkData;
  return {
    enableFormatting: true,
    selectedChannelId: state.config?.activeSelectedChannel?.id,
    members: state.channelMembers.members,
    // embeddedLinkData:embeddedLinkData
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getEmbeddedLink: (embeddedLink) =>
      dispatch(getEmbeddedLinkData(embeddedLink, dispatch)),
    getEmbeddedLinkReply: (embeddedLink) =>
      dispatch(getEmbeddedLinkDataReply(embeddedLink, dispatch)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(PostMsgView));
