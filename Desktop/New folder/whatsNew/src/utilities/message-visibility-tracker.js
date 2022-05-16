import { IntervalUpdateLastReadMessage } from "../constants";
import { updateLastReadPost } from "../store/actions/channelMessagesAction";
import { store } from "../store/store";

let dispatch;

class MessagesVisibilityTracker {
  currentChannelId = 0;
  currentReadPostId = 0;
  lastSendPostId = 0;
  lastPostReadAt = 0;
  lastPostSequenceId = 0;
  childPostMap = new Map();
  mainPostMap = new Map();

  updateLastReadPost(
    currentReadPostId,
    lastPostReadAt,
    postSequenceId,
    parentPostId
  ) {
    if (parentPostId) {
      if (this.childPostMap.get(parentPostId) === undefined) {
        this.childPostMap.set(parentPostId, [currentReadPostId]);
      } else {
        const index = this.childPostMap
          .get(parentPostId)
          .findIndex((item) => item === currentReadPostId);
        if (index === -1) {
          this.childPostMap.get(parentPostId).push(currentReadPostId);
        }
      }
    } else {
      if (this.mainPostMap.get(this.currentChannelId) === undefined) {
        this.mainPostMap.set(this.currentChannelId, [currentReadPostId]);
      } else {
        //this.mainPostMap.get(this.currentChannelId).push(currentReadPostId);
        const index = this.mainPostMap
          .get(this.currentChannelId)
          .findIndex((item) => item === currentReadPostId);
        if (index === -1) {
          this.mainPostMap.get(this.currentChannelId).push(currentReadPostId);
        }
      }

      /* if (
        window.goingDownwards ||
        typeof window.goingDownwards === "undefined"
      ) {*/
      if (
        lastPostReadAt > this.lastPostReadAt ||
        (postSequenceId && postSequenceId > this.lastPostSequenceId)
      ) {
        this.currentReadPostId = currentReadPostId;
        this.lastPostReadAt = lastPostReadAt;
        this.lastPostSequenceId = postSequenceId;
        //let child know, i have updated last read post at, so it can further update same in channel
        return this.lastPostReadAt;
      }

      //}
    }
  }
  updateSelectedChannel(channelId, lastPostReadAt, lastReadPostId) {
    if (this.currentChannelId !== 0 && this.currentChannelId !== channelId) {
      this.pushUpdate();
    }
    this.currentChannelId = channelId;
    this.lastPostReadAt = lastPostReadAt || 0;
    this.lastSendPostId = lastReadPostId || 0;
    this.currentReadPostId = 0;
    this.lastPostSequenceId = 0;
  }
  initTimer() {
    setInterval(() => {
      this.pushUpdate();
    }, IntervalUpdateLastReadMessage);
  }
  pushUpdate() {
    let state = store.getState();

    if (this.childPostMap.size > 0) {
      this.childPostMap.forEach((childMsgList, parentPostId) => {
        let hasMessage = false;
        state.channelMessages.messages &&
          state.channelMessages.messages.map((message) => {
            if (message.post.id === parentPostId) {
              hasMessage = true;
            }
            return message;
          });

        if (
          hasMessage &&
          state.config.activeSelectedChannel?.id &&
          this.currentChannelId === state.channelMessages.channelId
        ) {
          dispatch(
            updateLastReadPost(
              this.currentChannelId,
              childMsgList,
              dispatch,
              parentPostId
            )
          );
        }
      });

      this.childPostMap.clear();
    }

    if (this.mainPostMap.size > 0) {
      this.mainPostMap.forEach((msgList, channelId) => {
        if (
          state.config.activeSelectedChannel?.id &&
          this.currentChannelId === channelId &&
          state.channelMessages.channelId === channelId
        ) {
          dispatch(
            updateLastReadPost(this.currentChannelId, msgList, dispatch)
          );
        }
      });
      this.mainPostMap.clear();
    }
  }
}

const messagesVisibilityTracker = new MessagesVisibilityTracker();
messagesVisibilityTracker.initTimer();

export default messagesVisibilityTracker;
export const setDispatcher = (dispatchFunc) => {
  dispatch = dispatchFunc;
};
