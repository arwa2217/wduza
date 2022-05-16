import React, {Fragment} from "react";
import {useSelector} from "react-redux";
import TimelineDivider from "../organisms/timelineDivider";
import Post from "../post-view/post";
import {getDropDownOptions} from "../../utilities/messages-grouper";
import DefaultUser from "../../assets/icons/default-user.svg";
import {useTranslation} from "react-i18next";
import {putOrdinals} from "../../utilities/utils";

const dateTimeFormat = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
});
const ChannelMessages = (props) => {
  const { t } = useTranslation();
  const {
    messagesGroups,
    currentUser,
    loadingTop,
    loadingBottom,
    channelId,
    dispatch,
    members,
    redirectPost,
    lastReadPostId,
    setDimentionArea,
  } = props;
  const navigateTo = (selectedOption) => {
    props.navigateTo(selectedOption);
  };
  const redirectPostId = useSelector((state) => state.config.redirectPostId);
  const iconVisibility = useSelector((state) => state.config.iconVisibility);
  function _getDateParentPost(date) {
    date = new Date(date);
    const [{ value: month }, , { value: weekday }] = dateTimeFormat.formatToParts(date);
    return `${weekday}, ${month} ${putOrdinals(date.getDate())}`;
  }
  function _getPreviewText(parentPost) {
    let previewText = "";
    if (parentPost?.post.content === "") {
      if (parentPost.fileListIDs) {
        previewText = `${parentPost.user.displayName} uploads ${parentPost.fileListIDs.length} files`;
      } else if (Object.keys(parentPost.task).length > 0) {
        previewText = `${parentPost.user.displayName} create a task`;
      }
    } else {
      previewText = parentPost?.post.content;
    }
    return previewText;
  }
  function _handleParentPostContentPreviewText(message, messagesGroups) {
    let parentPostContent = {...message?.parentPostContent};
    //Check reply or fw post
    if (Object.keys(parentPostContent).length > 0) {
      const groupParenPost = messagesGroups.find(messagesGroup => messagesGroup.key === _getDateParentPost(parentPostContent.createdAt));
      let parentPost = groupParenPost?.posts.find(post => parentPostContent.id === post.id);
      parentPostContent.previewText = _getPreviewText(parentPost);
    }
    return parentPostContent;
  }
  
  return (
    <Fragment key={`channel-messages-fragment`}>
      {loadingTop && (
        <p className="loading-messages loading-top">
          <img alt="loader" src="/loading.gif" width="30" />
        </p>
      )}
      {messagesGroups && messagesGroups.length > 0
        ? messagesGroups.map((group, index) => {
            const createAt = group.posts[0].post.createdAt;
            // const option = group.key;
            const option = t("date.format", {
              date: group.posts[0].post.createdAt,
            });
            let counter = -2;
            let previousPost = null;

            return (
              <Fragment key={`channel-messages-group-fragment-${index}`}>
                <div id={option} key={option}>
                  <TimelineDivider
                    setDimentionArea={setDimentionArea}
                    messagesGroups={messagesGroups}
                    zIndex={100 - index}
                    options={getDropDownOptions(createAt)}
                    currentOption={option}
                    navigateTo={(text) => {
                      navigateTo(text);
                    }}
                  />

                  {group.posts.length > 0 &&
                    group.posts.map((message, index) => {
                      counter++;
                      previousPost = counter >= 0 ? group.posts[counter] : null;
                      const lengthOfUnreadMessage =
                        message.post.id === lastReadPostId
                          ? group.posts.length - 1 - index
                          : 0;
                      let replyMsgCount = message.replyCount - message.hiddenReplyCount;
                      return (
                        <div
                          className={`post-wrapper ${
                            props.showUnRead ||
                            (redirectPostId === message.post.id &&
                              !props.postForwardFlag &&
                              !props.isHomeTab &&
                              (iconVisibility === undefined || iconVisibility))
                              ? "post__desc__redirect"
                              : ""
                          } `}
                          key={`Post-view-${message.post.id}`}
                        >
                          <Post
                            id={message.post.id}
                            createdAt={message.post.createdAt}
                            key={`key${message.post.id}`}
                            post={message.post}
                            postInfo={message}
                            isPostOwner={currentUser.id === message?.user?.id}
                            isHiddenPost={message.isHidden}
                            forwardedPost={message.forwardedPost}
                            // consecutivePostByUser={isConsecutivePostByUser(
                            //   message,
                            //   previousPost
                            // )}
                            /*New-UX-changes we are considering all Post as post from different user*/
                            consecutivePostByUser={false}
                            user={message.user}
                            src={
                              message.user.userImg === ""
                                ? DefaultUser
                                : message.user.userImg
                            }
                            currentUser={currentUser}
                            channelId={channelId}
                            channel={props.channel}
                            dispatch={dispatch}
                            fileInfo={message.fileInfo}
                            fileList={message.fileList}
                            tagInfo={
                              message && message.tagInfo ? message.tagInfo : []
                            }
                            reactions={
                              message.reactions ? message.reactions : []
                            }
                            savedPost={
                              message.savedPost ? message.savedPost : ""
                            }
                            members={members}
                            replyCount={replyMsgCount}
                            parentPostId={message.post.id}
                            redirectPost={redirectPost}
                            isReply={false}
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
                            taskInfo={message.task}
                            taskStatus={message.task?.taskStatus}
                            isForwardPostInclude={
                              message?.forwardedPost?.post?.id ? true : false
                            }
                            forwardedPostId={message?.forwardedPost?.post?.id}
                            fwdStats={message?.fwdStats}
                            emailFwdHistory={message?.emailFwdHistory}
                            forwardedPostIsHidden={
                              message?.forwardedPost?.isHidden
                            }
                            postType={message.postType}
                            isUnread={message.isUnread}
                            unreadReplyCount={message.unreadReplyCount}
                            isHasParent={message?.isHasParent}
                            parentPostContent={_handleParentPostContentPreviewText(message, messagesGroups)}
                          />
                          {/* {lengthOfUnreadMessage > 0 && (
                              <div className="unread-post-divider">
                                <img src={UnreadPostIcon}/>
                                Unread messages from here.
                              </div>
                            )} */}
                        </div>
                      );
                    })}
                </div>
              </Fragment>
            );
          })
        : null}
      {loadingBottom && (
        <p className="loading-messages loading-bottom">
          {t("loading.messages")}
        </p>
      )}
    </Fragment>
  );
};

export default ChannelMessages;
