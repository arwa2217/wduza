import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import ChannelMessages from "./channel-messages";
import retrieveMessages, {
  retrieveTimelineMessages,
} from "../../utilities/messages-retriever";
import messageGrouper from "../../utilities/messages-grouper";
import styled from "styled-components";
import messagesVisibilityTracker from "../../utilities/message-visibility-tracker";
import { ReplyViewStyle } from "../post-view/reply-view/replyView.style";
import { withTranslation } from "react-i18next";
import {
  toggleUnreadMessage,
  clearScrollFlags,
  cleanMessages,
  setPostToReply,
  setLastPost,
  toggleEditor
} from "../../store/actions/channelMessagesAction";
import {
  setRedirectPostId,
  resetRedirectPostId,
  setRedirectPostIconVisibility,
  resetRedirectPostIconVisibility,
} from "../../store/actions/config-actions";
import CommonUtils from "../utils/common-utils";
import BackToBottom from "../../assets/icons/v2/ic_arrow_down_white.svg";

const MessageWindowStyle = styled.div`
  min-height: calc(100vh - 135px - var(--post-height));
  max-height: calc(100vh - 70px - var(--post-height));
  max-width: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  margin: 0 !important;

  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    min-height: 68vh;
    max-height: 68vh;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: transparent !important;
    box-shadow: inset 0 0 14px 14px rgba(0, 0, 0, 0.1);
    border: solid 4px transparent !important;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    /* Track */
    ::-webkit-scrollbar-track {
      background: transparent;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0.5);
    }
  }
`;

const TimeLine = styled.div``;

let messagesDivId = "messages-div";
let disableScrollEffect = false;
let disableScrollEffectTmp = false;
let firstMessageIdTemp, lastMessageIdTemp;
let lastScroll = 0;
//let prevChannelId;
let prevChannelStatus = undefined;
let prevRedirectedPost;
var topScrollTouchAPIRef;
var bottomScrollTouchAPIRef;

class ChannelMessagesWrapper extends PureComponent {
  static propTypes = {
    actions: PropTypes.shape({
      clearScrollFlags: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.messagesContainer = React.createRef();
    this.state = {
      firstMessageId:
        this.props.messages.length > 0 ? this.props.messages[0]?.post?.id : "",
      lastMessageId:
        this.props.messages.length > 0
          ? this.props.messages[this.props.messages.length - 1]?.post?.id
          : "",
      messageGroups: messageGrouper(
        this.props.messages,
        this.props.currentUser
      ),
      prevChannelId: undefined,
      toggleUnreadMessageFlag: this.props.toggleUnreadMessageFlag,
      messages: this.props.messages,
      redirectTimer: null,
      moveToLastPostVisible: false,
      lastPostToastVisible: false,
      dimensionArea: "",
    };
  }

  componentDidMount() {
    this.messagesContainer.current.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount() {
    this.messagesContainer.current.removeEventListener("scroll", this.onScroll);
    messagesVisibilityTracker.pushUpdate();
  }

  moveToLastPost = () => {
    const data = this.props.lastPostData;
    // this.props.actions.setRedirectPostIconVisibility(false);
    let redirectPostIconVisibility = false;
    CommonUtils.performNotificationAction(
      data.name,
      "saves",
      "saves",
      data.id,
      data.LastPost.post.id,
      "",
      this.props.dispatch,
      "LAST_POST",
      redirectPostIconVisibility
    );
  };

  onScroll = (e) => {
    if (disableScrollEffectTmp) {
      disableScrollEffectTmp = false;
    }
    const { target } = e;
    const currentScrollTop = target.scrollTop;
    // Toggle Move to Last Post Starts
    let currentPosition = currentScrollTop + target.offsetHeight;
    let finalPosition = target.scrollHeight;
    if (currentPosition + 80 >= finalPosition) {
      this.setState({
        lastPostToastVisible: false,
      });
    }
    if (
      currentPosition + 80 < finalPosition &&
      !this.state.lastPostToastVisible
    ) {
      this.setState({
        moveToLastPostVisible: true,
      });
    } else {
      this.setState({
        moveToLastPostVisible: false,
      });
    }
    if (disableScrollEffect) return;

    window.goingDownwards = currentScrollTop >= lastScroll;
    lastScroll = currentScrollTop;

    // Toggle Move to Last Post Ends
    if (currentScrollTop === 0) {
      this.onScrollTouchTopEdge();
    } else if (
      target.offsetHeight + Math.ceil(target.scrollTop) >=
      target.scrollHeight
    ) {
      this.onScrollTouchBottomEdge();
    }
  };

  onScrollTouchBottomEdge = () => {
    this.setState({ lastPostToastVisible: false });

    //this.cancelScrollBottomTouchAPICall();
    this.cancelScrollTopTouchAPICall();
    if (bottomScrollTouchAPIRef || this.props.moveToBottom) {
      console.log(
        "Can't make an API call as condition does not matched {topScrollTouchAPIRef, bottomScrollTouchAPIRef,moveToBottom}={" +
          topScrollTouchAPIRef +
          "," +
          bottomScrollTouchAPIRef +
          "," +
          this.props.moveToBottom +
          "}"
      );
      return;
    }
    if (this.props.messages.length > 0) {
      console.log("Retrieving message on scroll touch Bottom edge");
      const channelId = this.props.channel.id;
      const lastMessageId = this.state.lastMessageId;
      const toggleUnreadMessageFlag = this.props.toggleUnreadMessageFlag;
      bottomScrollTouchAPIRef = setTimeout(function () {
        retrieveMessages(
          0,
          channelId,
          1,
          lastMessageId,
          false,
          toggleUnreadMessageFlag
        );
        setTimeout(() => {
          bottomScrollTouchAPIRef = null;
        }, 1000);
      }, 500);
    }
  };

  onScrollTouchTopEdge = () => {
    //this.cancelScrollTopTouchAPICall();
    this.cancelScrollBottomTouchAPICall();
    if (topScrollTouchAPIRef) {
      console.log(
        "Can't make an API call as condition does not matched {topScrollTouchAPIRef, bottomScrollTouchAPIRef,moveToBottom}={" +
          topScrollTouchAPIRef +
          "," +
          bottomScrollTouchAPIRef +
          "," +
          this.props.moveToBottom +
          "}"
      );
      return;
    }
    if (this.props.messages.length > 0) {
      console.log("Retrieving message on scroll touch Top edge");
      const channelId = this.props.channel.id;
      const lastMessageId = this.state.firstMessageId;
      const toggleUnreadMessageFlag = this.props.toggleUnreadMessageFlag;
      topScrollTouchAPIRef = setTimeout(function () {
        retrieveMessages(
          0,
          channelId,
          -1,
          lastMessageId,
          false,
          toggleUnreadMessageFlag
        );
        setTimeout(() => {
          topScrollTouchAPIRef = null;
        }, 1000);
      }, 500);
    }
  };

  cancelScrollBottomTouchAPICall = () => {
    if (bottomScrollTouchAPIRef) {
      clearTimeout(bottomScrollTouchAPIRef);
      bottomScrollTouchAPIRef = null;
    }
  };

  cancelScrollTopTouchAPICall = () => {
    if (topScrollTouchAPIRef) {
      clearTimeout(topScrollTouchAPIRef);
      topScrollTouchAPIRef = null;
    }
  };

  toasthandler = () => {
    this.setState({ lastPostToastVisible: false });
    this.moveToLastPost();
  };

  static getDerivedStateFromProps(nextProps, state) {
    let messagesArr = nextProps.messages || [];
    if (
      nextProps.channelStatus === "DELETED" &&
      prevChannelStatus !== "DELETED" &&
      prevChannelStatus !== undefined
    ) {
      messagesVisibilityTracker.pushUpdate();
      //state.prevChannelId = nextProps.channel.id;
      prevChannelStatus = nextProps.channelStatus;
      nextProps.actions.cleanMessages(nextProps.channel.id);
      const { id, lastPostReadAt, lastReadPostId } =
        nextProps.activeSelectedChannel;
      // Once channel is deleted toggle filter should be off
      // retrieveMessages(1, nextProps.channel.id, 0, lastReadPostId || 0, false, nextProps.toggleUnreadMessageFlag);
      // retrieveMessages(1, nextProps.channel.id, 0, lastReadPostId || 0, false);
      retrieveMessages(1, nextProps.channel.id, 0, 0, false);
      messagesVisibilityTracker.updateSelectedChannel(
        id,
        lastPostReadAt,
        lastReadPostId
      );
    }

    if (
      state.prevChannelId !== nextProps.activeSelectedChannel.id ||
      state.toggleUnreadMessageFlag !== nextProps.toggleUnreadMessageFlag
    ) {
      let isUnreadMessageFilter = nextProps.toggleUnreadMessageFlag;

      if (state.prevChannelId !== nextProps.activeSelectedChannel.id) {
        isUnreadMessageFilter = false;
        nextProps.actions.toggleUnreadMessage(
          nextProps.activeSelectedChannel.id,
          false
        );
      }

      //Update the lastReadId to BE for the previous channel
      messagesVisibilityTracker.pushUpdate();
      const { id, lastPostReadAt, lastReadPostId } =
        nextProps.activeSelectedChannel;
      // const myLastReadPostId = state.toggleUnreadMessageFlag === false && isUnreadMessageFilter ? 0 : lastReadPostId || 0
      const myLastReadPostId = 0;
      retrieveMessages(
        1,
        nextProps.channel.id,
        0,
        myLastReadPostId,
        false,
        isUnreadMessageFilter
      );
      messagesVisibilityTracker.updateSelectedChannel(
        id,
        lastPostReadAt,
        lastReadPostId
      );
      prevChannelStatus = nextProps.channel.status;
      return {
        prevChannelId: nextProps.channel.id,
        toggleUnreadMessageFlag: isUnreadMessageFilter,
        //To make sure message updated correctly on UI
        firstMessageId: messagesArr.length > 0 ? messagesArr[0]?.post?.id : 0,
        // prevChannelId: nextProps.channel.id,
        lastMessageId:
          messagesArr.length > 0
            ? messagesArr[messagesArr.length - 1]?.post?.id
            : 0,
        messageGroups: messageGrouper(messagesArr, nextProps.currentUser),
        messages: messagesArr,
        moveToLastPostVisible: false,
      };
    }
    if (
      messagesArr !== undefined &&
      (messagesArr.length > 0 || messagesArr.length !== state.messages.length)
    ) {
      return {
        firstMessageId: messagesArr.length > 0 ? messagesArr[0].post.id : 0,
        prevChannelId: nextProps.channel.id,
        toggleUnreadMessageFlag: nextProps.toggleUnreadMessageFlag,
        lastMessageId:
          messagesArr.length > 0
            ? messagesArr[messagesArr.length - 1].post?.id
            : 0,
        messageGroups: messageGrouper(messagesArr, nextProps.currentUser),
        messages: messagesArr,
      };
    }
    return null;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    let preserveScrollPosition = this.props.preserveScrollPosition;
    if (preserveScrollPosition) {
      const messages = this.messagesContainer.current;
      let elementHeight = document.getElementById(firstMessageIdTemp)
        ? document.getElementById.clientHeight
        : 0;
      preserveScrollPosition = !(
        messages.scrollTop + messages.offsetHeight >
        messages.scrollHeight - elementHeight
      );
    }

    if (
      prevProps.messages?.length !== this.props.messages?.length &&
      !this.props.redirectPost &&
      !preserveScrollPosition &&
      !this.props.focusPostId
    ) {
      const messages = this.messagesContainer.current;
      if (this.props.loadingTop) {
        let snapshot = messages.scrollHeight - messages.scrollTop;
        return snapshot;
      } else if (this.props.loadingBottom) {
        return (
          messages.scrollHeight - (messages.scrollTop + messages.clientHeight)
        );
      }
      let snapshot = messages.scrollHeight - messages.scrollTop;
      return snapshot;
    } else if (this.props.preserveScrollPosition) {
      const messages = this.messagesContainer.current;
      let elementHeight = document.getElementById(firstMessageIdTemp)
        ? document.getElementById(firstMessageIdTemp).clientHeight
        : 0;
      if (
        messages.scrollTop + messages.offsetHeight >
        messages.scrollHeight - elementHeight
      ) {
        let snapshot = messages.scrollHeight - messages.scrollTop;
        return snapshot;
      }
    }
    return null;
  }

  displayNewMsgToastHandler = () => {
    this.setState({ lastPostToastVisible: true, moveToLastPostVisible: false });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items or removed items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (prevProps?.lastPost !== this.props.lastPost) {
      this.displayNewMsgToastHandler();
    }

    if (snapshot !== null) {
      const list = this.messagesContainer.current;
      console.log(
        "componentDidUpdate snapshot=" +
          snapshot +
          " , scrollHeight=" +
          list.scrollHeight
      );

      if (this.props.loadingBottom) {
        //No Nothing
      } else {
        if (snapshot > list.scrollHeight) {
          // let prevScrollHeight = snapshot[1];
          // let diff = prevScrollHeight - list.scrollHeight;
          // let snp = snapshot[0] - diff;

          let elementId = document.getElementById(firstMessageIdTemp);
          if (elementId) {
            list.scrollTop = elementId.offsetTop;
          } else {
            list.scrollTop = list.scrollHeight - snapshot;
          }
        } else {
          list.scrollTop = list.scrollHeight - snapshot;
        }
      }
      if (this.props.loadingBottom || this.props.loadingTop) {
        this.props.actions.clearScrollFlags();
      }
    }
    if (this.props.preserveScrollPosition) {
      this.props.actions.clearScrollFlags();
    }

    if (this.props.moveToBottom) {
      const list = this.messagesContainer.current;
      list.scrollTop = list.scrollHeight;
      this.props.actions.clearScrollFlags();
    }

    if (this.props.scrollToTop) {
      const list = this.messagesContainer.current;
      list.scrollTop = 0;
      this.props.actions.clearScrollFlags();
    }

    firstMessageIdTemp = this.state.firstMessageId;
    lastMessageIdTemp = this.state.lastMessageId;
    if (this.props.redirectPost) {
      prevRedirectedPost = this.props.redirectPost;
      if (document.getElementById(this.props.redirectPost)) {
        let offsetValue =
          this.props.moveToBottomPostFlag === "LAST_POST" ? -100 : -200;
        this.focusOnPost(this.props.redirectPost, offsetValue, "auto", true);
      } else {
        setTimeout(() => {
          this.focusOnPost(this.props.redirectPost, -300, "auto", true);
        }, 2000);
      }
    }

    if (this.props.focusPostId) {
      this.focusOnPost(this.props.focusPostId, -200, "auto", false);
    }
    if (this.props.focusLastPostIfVisible) {
      if (this.state.moveToLastPostVisible === false) {
        const list = this.messagesContainer.current;
        list.scrollTop = list.scrollHeight;
      }
      this.props.actions.clearScrollFlags();
    }

    if (
      this.state.moveToLastPostVisible === false &&
      this.props.minEditor === false
    ) {
      const list = this.messagesContainer.current;
      list.scrollTop = list.scrollHeight;
    }

    lastScroll = this.messagesContainer.current.scrollTop;
  }

  focusOnPost = (
    redirectPostId,
    yOffsetForScroll,
    scrollBehaviour,
    highlightBackground
  ) => {
    disableScrollEffect = true;
    const elementId = document.getElementById(redirectPostId);
    if (!elementId) {
      this.props.actions.clearScrollFlags();
      disableScrollEffect = false;
      return;
    }
    const clientRect = elementId.getBoundingClientRect();
    const y = clientRect.top;
    const main = document.getElementById(messagesDivId);
    main.scrollTo({
      top: y + main.scrollTop + yOffsetForScroll,
      behavior: scrollBehaviour,
    });
    this.cancelScrollBottomTouchAPICall();
    this.cancelScrollTopTouchAPICall();
    this.props.actions.clearScrollFlags();
    setTimeout(() => {
      disableScrollEffect = false;
    }, 500);

    if (!highlightBackground) {
      return;
    }
    if (this.state.redirectTimer !== null) {
      clearTimeout(this.state.redirectTimer);
    }
    this.props.actions.setRedirectPostId(redirectPostId);
    let timerId = setTimeout(() => {
      this.props.actions.resetRedirectPostId();
      this.props.actions.resetRedirectPostIconVisibility();
    }, 8000);
    this.setState({ redirectTimer: timerId });
  };
  setDimentionArea = (area) => {
    this.setState({ dimensionArea: area });
  };
  handleClickMessageTab = (e) => {
    this.props.setMinEditor(true);
    this.props.setPostToReply(null);
    this.props.setLastPost();
    this.props.toggleEditor(false,undefined);
  };
  render() {
    return (
      <>
        {/*this.state.dimensionArea !== "" && (
          <p
            style={{
              padding: "9px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: "1px solid #CCCCCC",
              fontSize: "12px",
              color: "rgba(0, 0, 0, 0.4)",
              fontWeight: "400",
            }}
          >
            {this.props.t(`timeline.header`, {
              time: this.state.dimensionArea,
            })}
          </p>
          )*/}
        <MessageWindowStyle
          id={messagesDivId}
          className="message-window mt-0 mb-0"
          ref={this.messagesContainer}
          style={{
            maxHeight: this.props.minEditor
              ? `calc(100vh - 135px - 20px)`
              : `calc(100vh - 57px - var(--post-height))`,
          }}
          onBlur={() => messagesVisibilityTracker.pushUpdate()}
          onClick={this.handleClickMessageTab}
        >
          {/* <Snackbar
            show={
              this.state.lastPostToastVisible
            }
            classForImage="btn back-to-top"
            message="A new Message appears, Click to view"
            handleClick={this.toasthandler}
          /> */}
          <ReplyViewStyle />
          <ChannelMessages
            messagesGroups={this.state.messageGroups}
            currentUser={this.props.currentUser}
            loadingTop={this.props.loadingTop}
            loadingBottom={this.props.loadingBottom}
            navigateTo={(selectedTimeline) => {
              retrieveTimelineMessages(this.props.channel.id, selectedTimeline);
            }}
            setDimentionArea={this.setDimentionArea}
            channelId={this.props.channel.id}
            channel={this.props.channel}
            dispatch={this.props.dispatch}
            members={this.props.members}
            redirectPost={prevRedirectedPost}
            lastReadPostId={this.props.lastPostData.lastReadPostId}
          />
        </MessageWindowStyle>
        {this.state.moveToLastPostVisible && (
          <button
            id="scrollBottom"
            className="btn back-to-top"
            onClick={this.moveToLastPost}
          >
            <img src={BackToBottom} alt="" />
          </button>
        )}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.channelMessages.messages,
    loadingTop: state.channelMessages.loadingTop,
    loadingBottom: state.channelMessages.loadingBottom,
    autoScroll: state.channelMessages.autoScroll,
    selectedTimeline: state.channelMessages.selectedTimeline,
    scrollToBottom: state.channelMessages.scrollToBottom,
    moveToBottom: state.channelMessages.moveToBottom,
    scrollToTop: state.channelMessages.scrollToTop,
    skipScrolling: state.channelMessages.skipScrolling,
    redirectPost: state.channelMessages.redirectPost,
    focusPostId: state.channelMessages.focusPostId,
    preserveScrollPosition: state.channelMessages.preserveScrollPosition,
    moveToBottomPostFlag: state.channelMessages.moveToBottomPostFlag,
    activeSelectedChannel: state.config.activeSelectedChannel,
    redirectPostOpen: state.postReplies?.redirectPostOpen,
    channelStatus: state.channelDetails.status,
    lastPostData: state.config.activeSelectedChannel,
    focusLastPostIfVisible: state.channelMessages.focusLastPostIfVisible,
    lastPost: state.config.activeSelectedChannel?.LastPost?.post,
    toggleUnreadMessageFlag: state.channelMessages?.toggleUnreadMessage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        clearScrollFlags,
        cleanMessages,
        setRedirectPostId,
        resetRedirectPostId,
        setRedirectPostIconVisibility,
        resetRedirectPostIconVisibility,
        toggleUnreadMessage,
      },
      dispatch
    ),
    setPostToReply: (post) => dispatch(setPostToReply(post)),
    toggleEditor: (state,post) => dispatch(toggleEditor(state,post)),
    setLastPost: () => dispatch(setLastPost()),
    dispatch,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ChannelMessagesWrapper));
