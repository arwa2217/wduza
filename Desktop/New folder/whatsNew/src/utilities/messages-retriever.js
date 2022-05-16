import {
  channelMessagesActions,
  focusOnPostActions,
  getTimelineMessagesActions,
  unreadChannelMessagesActions,
} from "../store/actions/channelMessagesAction";
import { UPDATE_CHANNEL_POST_READ_AT } from "../store/actionTypes/channelActionTypes";
import { LOAD_CHANNEL_MESSAGES_SUCCESS } from "../store/actionTypes/channelMessagesTypes";
import { setDispatcher } from "./message-visibility-tracker";
import * as dbHelper from "./caching/db-helper";
import PostUtils from "../components/utils/post-utils";

let dispatch;
export const initMessageRetriever = (storeDispatch) => {
  dispatch = storeDispatch;
  setDispatcher(dispatch);
};

const retrieveMessages = async (
  isFresh,
  channelId,
  scrollDirection,
  postId,
  clearPrevious,
  toggleUnreadMessageFlag
) => {
  let posts = {};
  // = await dbHelper.getPost(
  //isFresh,
  //channelId,
  //scrollDirection,
  //postId
  //);

  if (!posts.length) {
    if (toggleUnreadMessageFlag) {
      dispatch(
        unreadChannelMessagesActions(
          channelId,
          scrollDirection,
          postId,
          isFresh,
          undefined,
          clearPrevious
        )
      );
    } else {
      dispatch(
        channelMessagesActions(
          channelId,
          scrollDirection,
          postId,
          isFresh,
          async (posts) => {
            if (posts) {
              if (isFresh) {
                let matchFoundIndex = -1;
                for (let i = 0; i < posts.length; i++) {
                  const post = posts[i].post;
                  if (post.id === postId) {
                    dispatch({
                      type: UPDATE_CHANNEL_POST_READ_AT,
                      payload: {
                        channelId,
                        lastPostReadAt: post.createAt,
                        lastReadPostId: post.id,
                      },
                    });
                    matchFoundIndex = i;
                    break;
                  }
                }
                if (
                  matchFoundIndex !== -1 &&
                  matchFoundIndex < posts.length - 1 &&
                  PostUtils.isUserPost(posts[matchFoundIndex].post)
                ) {
                  setTimeout(() => {
                    //dispatch(RedirectMessagesActions(channelId, postId))
                    dispatch(focusOnPostActions(channelId, postId));
                  }, 1000);
                }
                await dbHelper.syncChannelRecords(channelId, posts[0]);
              }
              await dbHelper.updatePost(
                channelId,
                posts,
                scrollDirection,
                clearPrevious
              );
            }
          },
          clearPrevious,
          toggleUnreadMessageFlag ? true : false
        )
      );
    }
  } else {
    if (toggleUnreadMessageFlag) {
      dispatch(
        unreadChannelMessagesActions(
          channelId,
          scrollDirection,
          postId,
          isFresh,
          undefined,
          clearPrevious
        )
      );
    } else {
      dispatch({
        type: LOAD_CHANNEL_MESSAGES_SUCCESS,
        payload: {
          messages: posts,
          scrollDirection,
          channelId,
          clearPrevious: isFresh,
        },
      });
    }
  }
  window.goingDownwards = scrollDirection >= 0;
};

export const retrieveTimelineMessages = (channelId, timelineSelection) => {
  if (timelineSelection.toLowerCase() === "the very beginning") {
    timelineSelection = "VERY BEGINING";
  }
  timelineSelection = timelineSelection.replace(/ /g, "_").toUpperCase();
  dispatch(getTimelineMessagesActions(channelId, timelineSelection));
};

export default retrieveMessages;
