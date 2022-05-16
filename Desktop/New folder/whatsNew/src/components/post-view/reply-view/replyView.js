import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { ReplyPost } from "./replyPost";
import {
  fetchReplies,
  setCurrentReplyParent,
} from "../../../store/actions/PostReplyActions";
import { PostEditResetAction } from "../../../store/actions/edit-post-actions";
import { useSelector } from "react-redux";
import MessagePost from "../../messages/messages-post";
import { RepliesFetcher } from "./replyFetcher";
import { store } from "../../../store/store";
import {
  focusOnPostActions,
  setPostToReply,
} from "../../../store/actions/channelMessagesAction";
import { useTranslation } from "react-i18next";
import { CLEAR_MESSAGES_REPLY_POST } from "../../../store/actionTypes/commonActionTypes";
import { CLEAR_REDIRECT_POST_FLAG } from "../../../store/actionTypes/channelMessagesTypes";
import {
  resetRedirectPostId,
  setRedirectPostId,
} from "../../../store/actions/config-actions";
import CommonUtils from "../../utils/common-utils";
import { getLastSelectedChannelId } from "../../../utilities/app-preference";
import { makeStyles } from "@material-ui/core";

let hasPosts = false;
let isPostExpanded = false;
let previousParentPostId = 0;
const useStyles = makeStyles((theme) => ({
  seeAllReplies: {
    fontWeight: 400,
    fontSize: "11px",
    cursor: "pointer",
    color: "rgba(0, 0, 0, 0.5)",
  },
}));
export const ReplyView = React.memo(
  ({
    parentPostId,
    updateShowReplies,
    focusOnEditor,
    toggleUnreadMessageFlag,
    totalReply,
    postInfo,
    showReplies,
  }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const classes = useStyles();
    const currentUser = useSelector((state) => state.AuthReducer.user);
    const channel = useSelector((state) => state.config.activeSelectedChannel);
    const globalMembers = useSelector(
      (state) => state.memberDetailsReducer.memberData
    );
    const isPostEditing = useSelector(
      (state) => state.editPostReducer.isEditing
    );
    const editingPostChannelId = useSelector(
      (state) => state.editPostReducer.channelId
    );
    const editingPostId = useSelector((state) => state.editPostReducer.postId);
    const [posts, setPosts] = useState([]);
    const [showPosts, setShowPosts] = useState(showReplies);
    const prevTotalReply = usePrevious(totalReply);
    const postsData = useSelector((store) => store.postReplies.posts);
    const postData = useMemo(() => {
      if (postsData?.length) {
        let post = postsData.find((post) => post.parentPostId === parentPostId);
        if (post) return post.posts;
        else return [];
      } else return [];
    }, [postsData]);

    hasPosts = posts && posts.length;
    const channelMessages = store.getState().channelMessages.messages || [];
    const channelLastPost = channelMessages[channelMessages.length - 1];
    const channelStatus = useSelector((state) => state.channelDetails.status);
    const channelSecondLastPost =
      channelMessages.length > 1
        ? channelMessages[channelMessages.length - 2]
        : channelMessages[channelMessages.length - 1];
    const redirectPostId = useSelector(
      (state) => state.postReplies.redirectPostOpen
    );

    let clearHighlightPostTimerId = undefined;

    const replyPostRedirectId = useSelector(
      (state) => state.postReplies.redirectPost
    );

    function usePrevious(value) {
      const ref = useRef();
      useEffect(() => {
        ref.current = value;
      });
      return ref.current;
    }

    useEffect(() => {
      if (postInfo) {
        dispatch(
          setPostToReply({
            channel,
            focusOnEditor: focusOnEditor ? 1 : 0,
            parentPostId,
            postInfo,
            channelMembers: [],
            title: "replyView",
          })
        );
      }
    }, [channel, focusOnEditor, parentPostId, postInfo]);

    useEffect(() => {
      if (!toggleUnreadMessageFlag) {
        if (!hasPosts || previousParentPostId !== parentPostId) {
          previousParentPostId = parentPostId;
          isPostExpanded = false;
          dispatch({ type: CLEAR_MESSAGES_REPLY_POST });
          dispatch(
            fetchReplies(
              parentPostId,
              channel.id,
              1,
              1,
              redirectPostId,
              null,
              "init"
            )
          );
          dispatch(
            fetchReplies(
              parentPostId,
              channel.id,
              1,
              1,
              redirectPostId,
              null,
              "init"
            )
          );
        }
      }
    }, [channel.id, dispatch, parentPostId, toggleUnreadMessageFlag]);

    useEffect(() => {
      setPosts(
        postData?.filter((post) => {
          return !(post.isHidden && currentUser?.id !== post?.user?.id);
        })
      );
    }, [postData]);
    useEffect(() => {
      if (
        !isPostExpanded &&
        posts &&
        posts.length > 0 &&
        !focusOnEditor &&
        (posts[0].parentId === channelLastPost?.post?.id ||
          posts[0].parentId === channelSecondLastPost?.post?.id)
      ) {
        isPostExpanded = true;
        dispatch(
          focusOnPostActions(channel.id, posts[0].post.id, posts[0].parentId)
        );
      }
    }, [posts]);

    useEffect(() => {
      if (replyPostRedirectId) {
        highlightPost(replyPostRedirectId);
        dispatch({
          type: CLEAR_REDIRECT_POST_FLAG,
        });
      }
    }, [replyPostRedirectId]);

    useEffect(() => {
      if (totalReply - prevTotalReply === 1) {
        setShowPosts(totalReply);
      }
    }, [totalReply]);
    const highlightPost = (postId) => {
      clearHighlightPost();
      clearHighlightPostTimerId = setTimeout(() => {
        dispatch(resetRedirectPostId());
      }, 5000);
      setTimeout(() => {
        dispatch(
          focusOnPostActions(
            channel.id,
            postId,
            postData && postData.length > 0 ? postData[0].parentId : ""
          )
        );
        dispatch(setRedirectPostId(postId));
      }, 750);
    };

    const clearHighlightPost = () => {
      clearTimeout(clearHighlightPostTimerId);
      clearHighlightPostTimerId = undefined;
    };

    const handleResetEdit = () => {
      dispatch(PostEditResetAction());
    };
    return (
      <>
        {!isPostEditing && !editingPostId && (
          <div className="ReplyView">
            <RepliesFetcher
              parentPostId={parentPostId}
              totalReply={totalReply}
              isNext={false}
            />
            {showPosts < 3 ? (
              <p
                onClick={() => setShowPosts(posts.length)}
                className={classes.seeAllReplies}
              >
                {showPosts === totalReply ? "" : "See all replies"}
              </p>
            ) : null}
            <div className="ReplyView__replies col-12">
              <div className="ReplyView__separator">&nbsp;</div>
              {posts &&
                posts.length > 0 &&
                posts.map((reply, index) => {
                  if (index < showPosts) {
                    return (
                      <>
                        {!isPostEditing && !editingPostId && (
                          <ReplyPost
                            key={reply.id}
                            message={{...reply,parentPostId:parentPostId}}
                            currentUser={currentUser}
                            channelId={channel.id}
                            channel={channel}
                            members={[]}
                          />
                        )}
                        <div
                          className={`ReplyView__divider ${
                            posts.length - 1 === index
                              ? "ReplyView__divider_transparent"
                              : ""
                          }`}
                        ></div>
                      </>
                    );
                  }
                })}
            </div>
            <RepliesFetcher
              parentPostId={parentPostId}
              totalReply={totalReply}
              isNext={true}
            />
            {/* {channelStatus !== "LOCKED" && !isPostEditing && !editingPostId && (
              <div className="ReplyView__script col-12">
                <MessagePost
                  channel={channel}
                  channelMembers={[]}
                  parentPostId={parentPostId}
                  // title={t("postInfo:tooltip.reply.post")}
                  title="replyView"
                  focusOnEditor={focusOnEditor ? 1 : 0}
                  postInfo={postInfo}
                />
              </div>
            )} */}
          </div>
        )}
      </>
    );
  }
);
