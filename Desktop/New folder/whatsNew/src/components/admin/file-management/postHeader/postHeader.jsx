import PropTypes from "prop-types";
import React from "react";
// import PostUtils from "../../utils/post-utils";
// import PostInfo from "../post-info/post-info";
import { useTranslation } from "react-i18next";
// import "../post.css";
// import PostProfilePicture from "../post-profile-picture/post-profile-picture";
// import { useSelector } from "react-redux";
// import redirectionArrow from "../../../assets/icons/redirection-arrow.svg";
import { Button } from "../../../shared/styles/mainframe.style";
import { PostReactionType } from "../../../post-view/post-reaction/post-reaction-type";
import { renderUtil } from "../../../messages/mono-editor/renderUtility";
import { TAG_DECISION } from "../../../post-view/post-tag-menu/post-tag-type";
// import iconPostUnhide from "../../../assets/icons/post-toolbox/post-unhide.svg";
// import { ReplyViewStyle } from "../reply-view/replyView.style";

function PostHeader(props) {
  const { t, i18n } = useTranslation();
  // const isSystemMessage = PostUtils.isSystemMessage(props.post);
  const post = props.post;
  // const redirectPostId = useSelector((state) => state.config.redirectPostId);
  // const iconVisibility = useSelector((state) => state.config.iconVisibility);
  const {
    isUserPost,
    hasCheckedReaction,
    hasDOWNReaction,
    hasUPReaction,
    savedPost,
    tagInfo,
    reactions,
    isOwner,
    isUpUser,
    isDownUser,
    getLatestTag,
    channelMembers,
    isForwardOwner,
    isPostToTask,
    isTaskModal,
  } = props;

  const showFwdUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      "forward_update_container" + props.post.id
    );
    if (parentTarget) {
      const channelMembers = props.members;
      const fwdInfoValues =
        props && props.fwdPostStatus ? props.fwdPostStatus.forwards : [];
      var index = 0;
      const memberList = [];
      for (index = 0; index < fwdInfoValues?.length; index++) {
        var innerIndex = 0;
        for (
          innerIndex = 0;
          innerIndex < channelMembers?.length;
          innerIndex++
        ) {
          if (
            channelMembers[innerIndex].id == fwdInfoValues[index].fwdByUserID
          ) {
            let newMemberUpdated = {
              ...channelMembers[innerIndex],
              timestamp: `${t("postTime-12", {
                time: fwdInfoValues[index].timestamp,
              })}`,
              fwdFlag: true,
              fwdChannelName: fwdInfoValues[index].fwdChannelName,
            };
            memberList.push(newMemberUpdated);
            break;
          }
        }
      }

      if (memberList.length > 0) {
        renderUtil.renderMemberList(
          parentTarget,
          memberList,
          props.channel,
          props.currentUser.id
        );
      }
    }
  };
  const hideFwdUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      "forward_update_container" + props.post.id
    );
    setTimeout(() => {
      renderUtil.removeMemberList(parentTarget, [], 0, "");
    }, 200);
  };

  const showTagUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      "tag_update_container" + props.post.id
    );
    if (parentTarget) {
      const channelMembers = props.members;
      const tagInfoValues = props && props.tagInfo ? props.tagInfo : [];
      let tagMemberList = [
        {
          screenName: tagInfoValues[0].createdBy,
          userId: tagInfoValues[0].creatorId,
        },
      ];
      var index = 0;
      const memberList = [];
      for (index = 0; index < tagMemberList.length; index++) {
        var innerIndex = 0;
        for (
          innerIndex = 0;
          innerIndex < channelMembers?.length;
          innerIndex++
        ) {
          if (channelMembers[innerIndex].id == tagMemberList[index].userId) {
            memberList.push(channelMembers[innerIndex]);
            break;
          }
        }
      }

      if (memberList.length > 0) {
        renderUtil.renderMemberList(
          parentTarget,
          memberList,
          props.channel,
          props.currentUser.id
        );
      }
    }
  };

  const hideTagUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      "tag_update_container" + props.post.id
    );
    setTimeout(() => {
      renderUtil.removeMemberList(parentTarget, [], 0, "");
    }, 200);
  };

  const showReactedUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    const reactionType = event.currentTarget.value;
    switch (reactionType) {
      case PostReactionType.CHECK:
        parentTarget = document.getElementById(
          "reaction_check_container" + props.post.id
        );
        break;
      case PostReactionType.UP_ONE:
        parentTarget = document.getElementById(
          "reaction_up_container" + props.post.id
        );
        break;
      case PostReactionType.DOWN_ONE:
        parentTarget = document.getElementById(
          "reaction_down_container" + props.post.id
        );
        break;
      default:
    }
    if (parentTarget) {
      const channelMembers = props.members;
      const reactionInfo = props.reactions.reactionStats.Reactions?.filter(
        (item) => item.type === reactionType
      );
      const reactedMemberList =
        reactionInfo?.length > 0 ? reactionInfo[0].users : [];
      var index = 0;
      const memberList = [];
      for (index = 0; index < reactedMemberList.length; index++) {
        var innerIndex = 0;
        for (innerIndex = 0; innerIndex < channelMembers.length; innerIndex++) {
          if (
            channelMembers[innerIndex].id == reactedMemberList[index].userId
          ) {
            memberList.push(channelMembers[innerIndex]);
            break;
          }
        }
      }
      if (memberList.length > 0) {
        renderUtil.renderMemberList(
          parentTarget,
          memberList,
          props.channel,
          props.currentUser.id
        );
      }
    }
  };

  const hideReactedUserList = (event) => {
    event.stopPropagation();
    event.preventDefault();
    var parentTarget;
    const reactionType = event.currentTarget.value;
    switch (reactionType) {
      case PostReactionType.CHECK:
        parentTarget = document.getElementById(
          "reaction_check_container" + props.post.id
        );
        break;
      case PostReactionType.UP_ONE:
        parentTarget = document.getElementById(
          "reaction_up_container" + props.post.id
        );
        break;
      case PostReactionType.DOWN_ONE:
        parentTarget = document.getElementById(
          "reaction_down_container" + props.post.id
        );
        break;
      default:
    }
    setTimeout(() => {
      renderUtil.removeMemberList(parentTarget, [], 0, "");
    }, 200);
  };

  const currentUser = props.currentUser; //useSelector(state => state.AuthReducer.user.id)

  return (
    <div className="post__header">
      {/* <ReplyViewStyle /> */}
      {/* {redirectPostId === post.id && !(props.globalSearch)&&
				(iconVisibility === undefined || iconVisibility) && (
					<img
						className='post-redirect-arrow'
						src={redirectionArrow}
						alt='redirection-arrow'
					/>
				)} */}
      {/* <div className="col mr-auto d-flex p-0"> */}
      {/* <div className="col__name">
        <PostProfilePicture
          post={post}
          src={props.src}
          user={props.user}
          showNameOnly={false}
          isSystemMessage={isSystemMessage}
          isOwner={currentUser.id === props.user.id}
          isHiddenPost={props.isHiddenPost}
        />
      </div>
      <div className="ml-0 pl-0">
        <PostInfo
          postInfo={props.postInfo}
          post={post}
          handleCommentClick={props.handleCommentClick}
          handleDropdownOpened={props.handleDropdownOpened}
          hover={props.hover}
          tagInfo={props.tagInfo ? props.tagInfo : []}
          hideReplyView={props.hideReplyView}
          isOwner={currentUser.id === props.user.id}
          reactions={props.reactions ? props.reactions : []}
          userType={props.user.userType}
          savedPost={props.savedPost ? props.savedPost : ""}
          isHiddenPost={props.isHiddenPost}
          homeFlag={props.homeFlag}
          postForwardFlag={props.postForwardFlag}
          isTaskPost={props.isTaskPost}
          taskInfo={props.taskInfo}
          toggleUnreadMessageFlag={props.toggleUnreadMessageFlag}
        />
      </div> */}

      {/* </div> */}

      <div className="d-flex p-0 post_tag_indicator">
        {
          // isUserPost &&
          // (hasCheckedReaction ||
          //   hasDOWNReaction ||
          //   hasUPReaction ||
          //   savedPost ||
          //   (tagInfo && tagInfo.length > 0) ||
          //   props.fwdPostStatus?.total != 0) && (
          // <div
          //   className="d-flex ml-auto p-0 post_tag_indicator"
          // ><>
          <>
            {/* {props.fwdPostStatus && props.fwdPostStatus.total != 0 && ( */}
            <div className="position-relative">
              <div
                className="ReplyView__tooltip"
                id={"forward_update_container" + post?.id}
              ></div>

              <Button
                style={{ marginRight: "5px" }}
                backgroundColor={
                  isForwardOwner
                    ? "reaction_background"
                    : "reaction_background_other"
                }
                textColor={
                  isForwardOwner
                    ? "post__reaction__color"
                    : "post__reaction__color_other"
                }
                borderColor={
                  isForwardOwner
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                hoverBorderColor={
                  isForwardOwner
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                size={"small"}
                onMouseEnter={showFwdUserList}
                onMouseLeave={hideFwdUserList}
                bordered
                rounded
                strong
              >
                {t("forward.indicator", {
                  forwarded: props.fwdPostStatus?.total
                    ? props.fwdPostStatus?.total
                    : "0",
                })}
              </Button>
            </div>
            {/* )} */}
            {/* {hasCheckedReaction && !props.postForwardFlag && ( */}
            <div className="position-relative">
              <div
                className="ReplyView__tooltip"
                id={"reaction_check_container" + post?.id}
              ></div>
              <Button
                backgroundColor={
                  isOwner ? "reaction_background" : "reaction_background_other"
                }
                textColor={
                  isOwner
                    ? "post__reaction__color"
                    : "post__reaction__color_other"
                }
                borderColor={
                  isOwner
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                hoverBorderColor={
                  isOwner
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                // onMouseEnter={showReactedUserList}
                // onMouseLeave={hideReactedUserList}
                value={PostReactionType.CHECK}
                bordered
                rounded
                wrapContent
              >
                {" "}
                {t("checked", {
                  checkedCount: reactions?.reactionStats?.checked,
                })}
              </Button>
            </div>
            {/* )} */}

            {/* {hasUPReaction && !props.postForwardFlag && ( */}
            <div className="position-relative">
              <div
                className="ReplyView__tooltip"
                id={"reaction_up_container" + post?.id}
              ></div>

              <Button
                style={{ marginLeft: "5px" }}
                backgroundColor={
                  isUpUser ? "reaction_background" : "reaction_background_other"
                }
                textColor={
                  isUpUser
                    ? "post__reaction__color"
                    : "post__reaction__color_other"
                }
                borderColor={
                  isUpUser
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                hoverBorderColor={
                  isUpUser
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                bordered
                rounded
                wrapContent
                onMouseEnter={
                  showReactedUserList && showReactedUserList.length > 0
                    ? showReactedUserList
                    : []
                }
                value={PostReactionType.UP_ONE}
                onMouseLeave={hideReactedUserList}
              >
                {t("up", {
                  upCount: reactions?.reactionStats?.up,
                })}
              </Button>
            </div>
            {/* )} */}
            {/* {hasDOWNReaction && !props.postForwardFlag && ( */}
            <div className="position-relative">
              <div
                className="ReplyView__tooltip"
                id={"reaction_down_container" + post?.id}
              ></div>

              <Button
                style={{ marginLeft: "5px" }}
                backgroundColor={
                  isDownUser
                    ? "reaction_background"
                    : "reaction_background_other"
                }
                textColor={
                  isDownUser
                    ? "post__reaction__color"
                    : "post__reaction__color_other"
                }
                borderColor={
                  isDownUser
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                hoverBorderColor={
                  isUpUser
                    ? "post__reaction__border"
                    : "post__reaction__border__other"
                }
                bordered
                rounded
                wrapContent
                onMouseEnter={!props.postForwardFlag ? showReactedUserList : ""}
                value={PostReactionType.DOWN_ONE}
                onMouseLeave={hideReactedUserList}
              >
                {t("down", {
                  downCount: reactions?.reactionStats?.down,
                })}
              </Button>
            </div>
            {/* )} */}

            {/* {tagInfo && tagInfo.length > 0 && !props.postForwardFlag && ( */}
            <div className="position-relative">
              <div
                className="ReplyView__tooltip"
                id={"tag_update_container" + post?.id}
              ></div>
              {tagInfo && tagInfo.length > 0 && (
                <Button
                  style={{ marginLeft: "5px" }}
                  backgroundColor={"tags__background_green"}
                  textColor={"tags__color__white"}
                  borderColor={"tags__border__green"}
                  hoverBorderColor={"tags__border__green"}
                  size={"small"}
                  onMouseEnter={!props.postForwardFlag ? showTagUserList : ""}
                  onMouseLeave={hideTagUserList}
                  bordered
                  rounded
                  strong
                >
                  {t("postInfo:postTag:" + props.getLatestTag(tagInfo))}
                  {/* {t(
                  "postInfo:postTag:" + tagInfo?.length
                    ? getLatestTag(tagInfo)
                    : TAG_DECISION
                )} */}
                </Button>
              )}
            </div>
            {/* )} */}
          </>
          // )
        }
      </div>
    </div>
  );
}

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,
  user: PropTypes.object,
  handleCommentClick: PropTypes.func.isRequired,
  handleDropdownOpened: PropTypes.func,
  status: PropTypes.string,
  hover: PropTypes.bool.isRequired,
  showTimeWithoutHover: PropTypes.bool,
};

export default PostHeader;
