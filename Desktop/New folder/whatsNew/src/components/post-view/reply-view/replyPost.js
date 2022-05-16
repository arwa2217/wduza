import React from "react";
import DefaultUser from "../../../assets/icons/default-user.svg";
import Post from "../../post-view/post";

export const ReplyPost = ({ message, currentUser, channelId, members, channel }) => {
  return (
    <Post
      postInfo={{...message, parentPostContent: {creatorId : message?.user?.id }}}
      id={message.post.id}
      createdAt={message.post.createdAt}
      key={`key${message.post.id}`}
      post={message.post}
      fileInfo={message.fileInfo}
      fileList={message.fileList}
      tagInfo={message && message.tagInfo ? message.tagInfo : []}
      reactions={message && message.reactions ? message.reactions : {}}
      savedPost={message.savedPost ? message.savedPost : ""}
      user={message.user}
      src={message.user.userImg === "" ? DefaultUser : message.user.userImg}
      consecutivePostByUser={false}
      currentUser={currentUser}
      channelId={channelId}
      channel = {channel}
      isPostOwner={currentUser.id === message?.user?.id}
      isHiddenPost={message.isHidden}
      parentPostId={message.parentId}
      dispatch={() => {
        /*todo: to be worked upon*/
      }}
      redirectPostReplyId={message.post.id}
      members={members}
      hideReplyView={true}
      isReply={true}
      isEmbeddedLink={message.embededlink}
      embeddedLinkData={
        Object.values({
          ...message.embeddedLinkData,
        }).length === 0
          ? undefined
          : Object.values({
              ...message.embeddedLinkData,
            })
      }
      fwdStats={message?.fwdStats}
      isUnread={message.isUnread}
    />
  );
};
