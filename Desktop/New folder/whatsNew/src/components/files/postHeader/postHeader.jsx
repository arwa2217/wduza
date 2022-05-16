import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/styles/mainframe.style";
import { PostReactionType } from "../../post-view/post-reaction/post-reaction-type";
import { renderUtil } from "../../messages/mono-editor/renderUtility";

function PostHeader(props) {
  const { t } = useTranslation();
  const post = props.post;
  const { tagInfo, reactions, isOwner, isUpUser, isDownUser, isForwardOwner } =
    props;

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
            channelMembers[innerIndex].id === fwdInfoValues[index].fwdByUserID
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
          if (channelMembers[innerIndex].id === tagMemberList[index].userId) {
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
            channelMembers[innerIndex].id === reactedMemberList[index].userId
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

  return (
    <div className="post__header">
      <div className="d-flex p-0 post_tag_indicator">
        {
          <>
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
                onMouseEnter={showReactedUserList}
                value={PostReactionType.UP_ONE}
                onMouseLeave={hideReactedUserList}
              >
                {t("up", {
                  upCount: reactions?.reactionStats?.up,
                })}
              </Button>
            </div>
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
                </Button>
              )}
            </div>
          </>
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
