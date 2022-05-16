import React, { useEffect } from "react";
import DefaultUser from "../../../assets/icons/default-user.svg";
import Post from "../../post-view/post";
import { fetchForwardDetailsById } from "../../../store/actions/channelMessagesAction";
import { useDispatch, useSelector } from "react-redux";

export const ForwardPost = ({
  message,
  forwardedPostId,
  currentUser,
  channelId,
  members,
  mainPostId,
  isPostToTask,
  isFileSidePanel,
  postOwnerId,
}) => {
  console.log('ForwardPost message', message)
  const dispatch = useDispatch();
  let currentChannelId = useSelector(
    (state) => state.config.activeSelectedChannel?.id
  );

  useEffect(() => {
    if (message !== undefined) {
      let queryParams = {
        channelId: currentChannelId,
        postId: forwardedPostId,
        mainPostId: mainPostId,
      };
      dispatch(fetchForwardDetailsById(queryParams));
    }
  }, [forwardedPostId, mainPostId]);

  return (
    <Post
      postInfo={message}
      id={message?.post?.id}
      createdAt={message?.post?.createdAt}
      key={`key${message?.post?.id}`}
      post={message?.post}
      fileInfo={message?.fileInfo}
      fileList={message?.fileList}
      tagInfo={message && message?.tagInfo ? message.tagInfo : []}
      reactions={message && message?.reactions ? message.reactions : {}}
      savedPost={message?.savedPost ? message?.savedPost : ""}
      user={message?.user}
      src={message?.user?.userImg === "" ? DefaultUser : message?.user?.userImg}
      consecutivePostByUser={false}
      currentUser={currentUser}
      channelId={channelId}
      isPostOwner={currentUser?.id === message?.user?.id}
      isHiddenPost={message?.isHidden}
      dispatch={() => {
        /*todo: to be worked upon*/
      }}
      redirectPostReplyId={message?.post?.id}
      members={members}
      isEmbeddedLink={message?.embededLink}
      embeddedLinkData={message?.embeddedLinkData}
      taskInfo={message?.task}
      taskStatus={message?.task?.taskStatus}
      postForwardFlag={true}
      isPostToTask={isPostToTask}
      appendId={true}
      isFileSidePanel={isFileSidePanel}
      postOwnerId={postOwnerId}
    />
  );
};
