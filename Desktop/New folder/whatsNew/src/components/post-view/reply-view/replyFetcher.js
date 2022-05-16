import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReplies } from "../../../store/actions/PostReplyActions";

export const RepliesFetcher = ({ parentPostId, isNext, totalReply }) => {
  const dispatch = useDispatch();
  const [loading, setUpdateLoading] = useState(false);
  const [hideLink, setHideLink] = useState(false);
  const [replyPost, setReplyPost] = useState([]);

  const { posts, hidePreviousLoading, hideNextLoading } = useSelector(
    (store) => store.postReplies
  );

  useEffect(() => {
    let filterReplyPosts = posts.filter(
      (el) => el.parentPostId === parentPostId
    );
    setReplyPost(
      filterReplyPosts.length > 0
        ? filterReplyPosts[0].posts?.length > 0
          ? filterReplyPosts[0].posts
          : []
        : []
    );
  }, [posts]);

  const { id: channelId } = useSelector(
    (state) => state.config.activeSelectedChannel
  );

  const updateLoading = (loadedPosts) => {
    if (!replyPost.length) {
      setHideLink(true);
    }
    setUpdateLoading(false);
  };

  const loadRecords = () => {
    if (loading) {
      return;
    }
    updateLoading(true);
    const post = isNext ? replyPost[replyPost.length - 1] : replyPost[0];
    dispatch(
      fetchReplies(
        parentPostId,
        channelId,
        isNext ? 1 : -1,
        false,
        post.post.id,
        updateLoading,
        isNext ? "next" : "prev"
      )
    );
  };
  const link = {
    className: isNext
      ? "ReplyView__link ReplyView__link_next" +
        " " +
        (hideNextLoading ? "ReplyView__link ReplyView__link_disabled" : "")
      : "ReplyView__link ReplyView__link_previous" +
        " " +
        (hidePreviousLoading ? "ReplyView__link ReplyView__link_disabled" : ""),
    text: isNext
      ? hideNextLoading
        ? ""
        : "Load next replies"
      : hidePreviousLoading
      ? ""
      : "Load previous replies",
  };
  if (hideLink) {
    return null;
  }

  return (
    <>
      {totalReply > replyPost.length && (
        <span
          className={link.className}
          onClick={() => {
            loadRecords();
          }}
        >
          {loading ? "Loading" : link.text}
        </span>
      )}
    </>
  );
};
