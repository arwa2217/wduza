import PropTypes from "prop-types";
import React, { useState, useRef } from "react";
import PostUtils from "../../utils/post-utils";
import PostInfo from "../post-info/post-info";
import { useTranslation } from "react-i18next";
import "../post.css";
import PostProfilePicture from "../post-profile-picture/post-profile-picture";
//import { useSelector } from "react-redux";

import { Button } from "../../shared/styles/mainframe.style";
import { PostReactionType } from "./../post-reaction/post-reaction-type";
import { renderUtil } from "../../messages/mono-editor/renderUtility";
import RepliedHeader from "../../messages/RepliedHeader";
import FowardHeader from "../../messages/FowardHeader";
import { useIsAuthenticated } from "@azure/msal-react";
import defaultUser from "../../../assets/icons/default-user.svg";
import arrowUp from "../../../assets/icons/arrow-up.svg";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import ActionIcon from "../../../assets/icons/v2/ic_tag.svg";
import CheckIcon from "../../../assets/icons/v2/ic_check.svg";
import PlusIcon from "../../../assets/icons/v2/ic_plus.svg";
import MinusIcon from "../../../assets/icons/v2/ic_minus.svg";
import taskDropdown from "../../../assets/icons/task-modal-icons/task_arrow_down_s.svg";
import SVG from "react-inlinesvg";
import { red } from "@material-ui/core/colors";
import { Dropdown } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import PostTagMenu from "../post-tag-menu/post-tag-menu";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  postTagToServer,
  postTaskToServer,
  removeTag,
} from "../../../store/actions/channelMessagesAction";
const useStyles = makeStyles((theme) => ({
  actionButton: {
    color: theme.palette.text.focused,
    fontSize: "11px",
    fontWeight: "normal",
    '& .action-icon': {
      marginRight: '3px'
    }
  },
  notificationTag: {
    color: theme.palette.text.black40,
    fontSize: "11px",
    fontWeight: "normal",
    lineHeight: "100%",
  },
  btnTooltip: {
    "&.active": {
      color: theme.palette.text.focused,
      "& .tooltip-icon": {
        fill: theme.palette.text.focused,
        stroke: theme.palette.text.focused,
      },
    },
    "& .tooltip-icon": {
      fill: "none",
      stroke: theme.palette.color.icon1,
    },
    color: theme.palette.text.black70,
  },
  mentionWrapper: {
    "& .icon-tooltip": {
      fill: theme.palette.text.black50,
    },
    "& .like-number": {
      color: theme.palette.text.black50,
      fontSize: "14px",
    },
    "& .icon-reply-wrapper": {
      display: "flex",
      alignItems: "center",
    },
    "& .icon-save-wrapper": {
      display: "flex",
      alignItems: "center",
      marginLeft: "-6px",
      "& .icon-tooltip": {
        marginRight: "0",
      },
    },
    "&.post-react-checked": {
      marginTop: "-3px",
    },
    "&.post-react-checked.active": {
      "& .icon-tooltip": {
        fill: theme.palette.text.focused1,
      },
    },
    "& .reply-txt": {
      color: theme.palette.text.black50,
    },
    "&.post-react-plus-one.active": {
      "& .icon-tooltip": {
        fill: theme.palette.color.guest,
      },
      "& .like-number": {
        color: theme.palette.color.guest,
      },
    },
    "&.post-react-minus-one.active": {
      "& .icon-tooltip": {
        fill: theme.palette.color.external,
      },
      "& .like-number": {
        color: theme.palette.color.external,
      },
    },
    "&.post-react-reply.active": {
      "& .icon-tooltip": {
        fill: theme.palette.text.focused1,
        // marginRight: "0px",
      },
      "& .icon-reply-wrapper": {
        // marginLeft: "-4px",
      },
      "& .reply-txt": {
        // color: theme.palette.text.focused1,
      },
    },
    "&.post-react-save.active": {
      "& .icon-tooltip": {
        fill: theme.palette.text.focused1,
        marginRight: "0px",
      },
      "& .icon-save-wrapper": {
        marginLeft: "-8px",
      },
      "& .reply-txt": {
        color: theme.palette.text.focused1,
      },
    },
    "&:hover": {
      "& .icon-tooltip": {
        fill: theme.palette.text.black70,
      },
      "& .like-number": {
        color: theme.palette.text.black70,
      },
      // "& .reply-txt": {
      //   color: theme.palette.text.black70,
      // },
    },
  },
}));
function PostHeader(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const isAuthenticated = useIsAuthenticated();
  const isSystemMessage = PostUtils.isSystemMessage(props.post);
  const post = props.post;
  const postInfoWrapRef = useRef(null)
  //Below code is to be used if we want to show green arrow
  //const redirectPostId = useSelector((state) => state.config.redirectPostId);
  //const iconVisibility = useSelector((state) => state.config.iconVisibility);
  const [showMore, setShowMore] = useState(false);
  const [showPopupTag, setShowPopupTag] = useState(false);
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
    isForwardOwner,
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

  const currentUser = props.currentUser; //useSelector(state => state.AuthReducer.user.id)
  const styleProfile = props?.isStyleInline
    ? {
        marginRight: 5,
        fontWeight: 100,
        overflow: "hidden",
        color: "#19191a",
        minWidth: "10px",
        lineHeight: "18px",
      }
    : { color: "#19191a" };
  const stylePostInfo = props?.isStyleInline
    ? {
        display: "inline-block",
      }
    : { cursor: "pointer" };

  const findUserInfo = (id) => {
    return props.members.find((user) => user.id === id || user.email === id);
  };
  const handleShowRecipients = () => {
    setShowMore(!showMore);
  };
  
  // const handleShowTag = (toggle) => {

  //   setShowPopupTag(toggle)
  // };

  const reactPostTagClicked = (e) => {
    e.preventDefault();
    const { postTagToServer, removeTag } = props;
    let currentTags = props.tagInfo;
    let deleteTag = false;
    if (currentTags.length > 0) {
      currentTags.map((tag) => {
        if (tag.tagName === e.target.value) {
          deleteTag = true;
        }
        let request = {
          channelId: props.channelId,
          postId: props.post.id,
          tagName: tag.tagName,
        };
        removeTag(request);
      });
    }
    if (!deleteTag) {
      let requestBody = {
        channelId: props.channelId,
        postId: props.post.id,
        tagName: e.target.value,
      };
      postTagToServer(requestBody);
    }
    // );
  };
  const createRecipientsWrapper = (emailFwdHistory) => {
    if (!emailFwdHistory) {
      return null;
    }
    const senderInfo = findUserInfo(emailFwdHistory[0]?.userId);
    const senderInfoImage = senderInfo?.userImg
      ? senderInfo?.userImg
      : defaultUser;
    const currentUserYouName =
      senderInfo?.id === props.currentUser.id ? "(you)" : "";
    if (!senderInfo) {
      return null;
    }
    return (
      <div className="recipients-wrapper">
        <div
          className="sender-wrapper ReplyView__mentions"
          onClick={handleShowRecipients}
        >
          <img
            src={senderInfoImage}
            alt="sender-img"
            className="mention-user-list-item-img"
          />
          <div className="sender-send-info">
            <span
              className="mention-user-list-item-name"
              style={{ marginRight: 10 }}
            >
              {senderInfo.screenName} {currentUserYouName}
            </span>
            <span className="wrap-forward-text">
              forward to email |{" "}
              {moment(emailFwdHistory[0]?.createdAt).format(
                "ddd, MMM DD, hh:mmA"
              )}
            </span>
          </div>
          <div className={"show-more-wrapper"}>
            <img
              src={arrowUp}
              alt="show-more"
              className={`show-more-user-recipients ${
                showMore ? "show-more-active" : ""
              }`}
            />
          </div>
        </div>
        <div className={`recipients-list ${showMore ? "" : "d-none"}`}>
          <div className="recipients-list-text">Receiver</div>
          {emailFwdHistory.map((item, index) => {
            const user = findUserInfo(item.userEmail);
            const userImage = user?.userImg ? user?.userImg : defaultUser;
            return (
              <div key={index} className="user-item">
                <div className="wrapper-image">
                  <img
                    src={userImage}
                    alt="user-img"
                    className="mention-user-list-item-img"
                  />
                </div>
                {user?.screenName && (
                  <div className="wrapper-screenName">{user?.screenName}</div>
                )}
                <div className="wrapper-email">
                  {user?.email || item.userEmail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const CheckRedirectionStatus = (parentPost) => {
    props.CheckRedirectionStatus(parentPost);
  };
  return (
    <div className="post__header">
      {props.hasParentPostContent && (
        <RepliedHeader
          parent={props.parentPostContent}
          CheckRedirectionStatus={CheckRedirectionStatus}
        />
      )}

      {props.forwardedPost?.id && !props.taskInfo?.taskAssignee && (
        <FowardHeader
          CheckRedirectionStatus={CheckRedirectionStatus}
          parent={props.parentPostContent}
          taskInfo={props.taskInfo}
          forwardedPost={props.forwardedPost}
        />
      )}
      <div className="col__name" style={styleProfile}>
        <PostProfilePicture
          post={post}
          src={props.src}
          user={props.user}
          currentUser={props.currentUser}
          showNameOnly={false}
          isUnread={props.isUnread}
          isSystemMessage={isSystemMessage}
          isOwner={currentUser.id === props?.user?.id}
          isHiddenPost={props.isHiddenPost}
          isStyleInline={props?.isStyleInline}
        />
      </div>
      <div className="ml-0 pl-0" style={stylePostInfo}>
        <PostInfo
          postInfo={props.postInfo}
          isAuthenticated={isAuthenticated}
          post={post}
          handleCommentClick={props.handleCommentClick}
          handleDropdownOpened={props.handleDropdownOpened}
          hover={props.hover}
          tagInfo={props.tagInfo ? props.tagInfo : []}
          hideReplyView={props.hideReplyView}
          isOwner={currentUser.id === props?.user?.id}
          reactions={props.reactions ? props.reactions : []}
          userType={props.user?.userType}
          savedPost={props.savedPost ? props.savedPost : ""}
          isHiddenPost={props.isHiddenPost}
          homeFlag={props.homeFlag}
          postForwardFlag={props.postForwardFlag}
          isTaskPost={props.isTaskPost}
          taskInfo={props.taskInfo}
          toggleUnreadMessageFlag={props.toggleUnreadMessageFlag}
          updateShowReplies={props.updateShowReplies}
          showReplies={props.showReplies}
          classes={classes}
          refs={postInfoWrapRef}
        />
      </div>

      {/* </div> */}
      {isUserPost &&
        (hasCheckedReaction ||
          hasDOWNReaction ||
          hasUPReaction ||
          savedPost ||
          (tagInfo && tagInfo.length > 0) ||
          props.fwdPostStatus?.total !== 0 ||
          props.emailFwdHistory?.TotalCount !== 0) && (
            <div className="d-flex ml-auto p-0 post_tag_indicator">
               
                {/*{((props.fwdPostStatus && props.fwdPostStatus.total !== 0) ||*/}
                {/*  (props.emailFwdHistory &&*/}
                {/*    props.emailFwdHistory.TotalCount !== 0)) && (*/}
                {/*  <div className="position-relative forwarded-to-email-wrapper">*/}
                {/*    <div className="ReplyView__tooltip">*/}
                {/*      <div*/}
                {/*        className="forward-container"*/}
                {/*        id={"forward_update_container" + post.id}*/}
                {/*      ></div>*/}
                {/*      {createRecipientsWrapper(*/}
                {/*        props.emailFwdHistory?.emailFwdHistory*/}
                {/*      )}*/}
                {/*    </div>*/}

                {/*    <Button*/}
                {/*      style={{ marginRight: "5px" }}*/}
                {/*      backgroundColor={*/}
                {/*        isForwardOwner*/}
                {/*          ? "reaction_background"*/}
                {/*          : "reaction_background_other"*/}
                {/*      }*/}
                {/*      textColor={*/}
                {/*        isForwardOwner*/}
                {/*          ? "post__reaction__color"*/}
                {/*          : "post__reaction__color_other"*/}
                {/*      }*/}
                {/*      borderColor={*/}
                {/*        isForwardOwner*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      hoverBorderColor={*/}
                {/*        isForwardOwner*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      size={"small"}*/}
                {/*      // onMouseEnter={showFwdUserList}*/}
                {/*      bordered*/}
                {/*      rounded*/}
                {/*      strong*/}
                {/*    >*/}
                {/*      {t("forward.indicator", {*/}
                {/*        forwarded:*/}
                {/*          props.fwdPostStatus.total +*/}
                {/*            props?.emailFwdHistory?.TotalCount || 0,*/}
                {/*      })}*/}
                {/*    </Button>*/}
                {/*  </div>*/}
                {/*)}*/}

                {/*{hasCheckedReaction && !props.postForwardFlag && (*/}
                {/*  <div>*/}
                {/*    <div*/}
                {/*      className="ReplyView__tooltip"*/}
                {/*      id={"reaction_check_container" + post.id}*/}
                {/*    ></div>*/}
                {/*    <span*/}
                {/*      className={classes.notificationTag}*/}
                {/*      backgroundColor={*/}
                {/*        isOwner*/}
                {/*          ? "reaction_background"*/}
                {/*          : "reaction_background_other"*/}
                {/*      }*/}
                {/*      textColor={*/}
                {/*        isOwner*/}
                {/*          ? "post__reaction__color"*/}
                {/*          : "post__reaction__color_other"*/}
                {/*      }*/}
                {/*      borderColor={*/}
                {/*        isOwner*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      hoverBorderColor={*/}
                {/*        isOwner*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      onMouseEnter={showReactedUserList}*/}
                {/*      onMouseLeave={hideReactedUserList}*/}
                {/*      value={PostReactionType.CHECK}*/}
                {/*      bordered*/}
                {/*      rounded*/}
                {/*      wrapContent*/}
                {/*    >*/}
                {/*      <img src={CheckIcon} alt="check-icon" />*/}
                {/*      {reactions.reactionStats.checked}*/}
                {/*    </span>*/}
                {/*  </div>*/}
                {/*)}*/}

                {/*{hasUPReaction && !props.postForwardFlag && (*/}
                {/*  <div className="position-relative">*/}
                {/*    <div*/}
                {/*      className="ReplyView__tooltip"*/}
                {/*      id={"reaction_up_container" + post.id}*/}
                {/*    ></div>*/}

                {/*    <Button*/}
                {/*      style={{ marginLeft: "5px" }}*/}
                {/*      backgroundColor={*/}
                {/*        isUpUser*/}
                {/*          ? "reaction_background"*/}
                {/*          : "reaction_background_other"*/}
                {/*      }*/}
                {/*      textColor={*/}
                {/*        isUpUser*/}
                {/*          ? "post__reaction__color"*/}
                {/*          : "post__reaction__color_other"*/}
                {/*      }*/}
                {/*      borderColor={*/}
                {/*        isUpUser*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      hoverBorderColor={*/}
                {/*        isUpUser*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      bordered*/}
                {/*      rounded*/}
                {/*      wrapContent*/}
                {/*      onMouseEnter={showReactedUserList}*/}
                {/*      value={PostReactionType.UP_ONE}*/}
                {/*      onMouseLeave={hideReactedUserList}*/}
                {/*    >*/}
                {/*      {t("up", {*/}
                {/*        upCount: reactions.reactionStats.up,*/}
                {/*      })}*/}
                {/*    </Button>*/}
                {/*  </div>*/}
                {/*)}*/}
                {/*{hasDOWNReaction && !props.postForwardFlag && (*/}
                {/*  <div className="position-relative">*/}
                {/*    <div*/}
                {/*      className="ReplyView__tooltip"*/}
                {/*      id={"reaction_down_container" + post.id}*/}
                {/*    ></div>*/}

                {/*    <Button*/}
                {/*      style={{ marginLeft: "5px" }}*/}
                {/*      backgroundColor={*/}
                {/*        isDownUser*/}
                {/*          ? "reaction_background"*/}
                {/*          : "reaction_background_other"*/}
                {/*      }*/}
                {/*      textColor={*/}
                {/*        isDownUser*/}
                {/*          ? "post__reaction__color"*/}
                {/*          : "post__reaction__color_other"*/}
                {/*      }*/}
                {/*      borderColor={*/}
                {/*        isDownUser*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      hoverBorderColor={*/}
                {/*        isUpUser*/}
                {/*          ? "post__reaction__border"*/}
                {/*          : "post__reaction__border__other"*/}
                {/*      }*/}
                {/*      bordered*/}
                {/*      rounded*/}
                {/*      wrapContent*/}
                {/*      onMouseEnter={*/}
                {/*        !props.postForwardFlag ? showReactedUserList : ""*/}
                {/*      }*/}
                {/*      value={PostReactionType.DOWN_ONE}*/}
                {/*      onMouseLeave={hideReactedUserList}*/}
                {/*    >*/}
                {/*      {t("down", {*/}
                {/*        downCount: reactions.reactionStats.down,*/}
                {/*      })}*/}
                {/*    </Button>*/}
                {/*  </div>*/}
                {/*)}*/}
               {tagInfo && tagInfo.length > 0 && !props.postForwardFlag && (
                  <Dropdown
                   
                   >
                  <Dropdown.Toggle >
                
                  <div className="" >
                         
                      <div className={`position-relative `}>
                        <div
                          className="ReplyView__tooltip"
                          id={"tag_update_container" + post.id}
                        ></div>
                        {/* {tagInfo[0]?.tagName !== "QUESTION" && (
                          <SVG className="action-icon" src={ActionIcon} />
                        )}
                        {tagInfo[0]?.tagName === "QUESTION" && (
                          <SVG className="red-tag" src={ActionIcon} />
                        )} */}

                        <span
                          className={`${classes.actionButton} ${
                            tagInfo[0]?.tagName === 'IMPORTANT'? 'important-tag':
                            tagInfo[0]?.tagName === 'DECISION'? 'done-tag': 
                            tagInfo[0]?.tagName === 'QUESTION'? 'inprogress-tag': 
                            tagInfo[0]?.tagName === 'FOLLOW-UP'? 'todo-tag':
                            tagInfo[0]?.tagName === 'APPROVALREQUIRED'? 'approved-require-tag':
                            tagInfo[0]?.tagName === 'APPROVED'? 'approved-tag': ''
                            
  
                          } tag-status`}
                          style={{ marginLeft: "5px" }}
                          // onMouseEnter={!props.postForwardFlag ? showTagUserList : ""}
                          // onMouseLeave={hideTagUserList}
                        >
                          <SVG className="action-icon" src={ActionIcon} />
                          {/* {t("postInfo:postTag:" + getLatestTag(tagInfo))} */}
                          {getLatestTag(tagInfo)}
                          <SVG className="tag-dropdown" width={12} src={taskDropdown}/>
                        </span>
                        
                      </div>
                 
                  </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu
                    alignRight={true}
                    rootCloseEvent="mousedown"
                    className="dropdown-menu tag-dropdown-menu"
                  >
                    <div className="dropdown-content">
                      <PostTagMenu
                        onClick={reactPostTagClicked}
                        post={post}
                        currentTags={props.tagInfo ? props.tagInfo : []}
                        // handleShowTag={handleShowTag}
                      />
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
               )}
            </div>
           
        )}
      
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
function mapStateToProps(state, ownProps) {
  const config = state.config;
  let channelId = config.activeSelectedChannel
    ? config.activeSelectedChannel.id
    : "";
  const channelStatus = config.activeSelectedChannel?.status;
  const channelType = config.activeSelectedChannel?.type;
  const isPostEditing = state.editPostReducer.postId;
  const enableEmojiPicker = true;
  const currentUserInfo = state.AuthReducer.user;
  return {
    isMobile: false,
    enableEmojiPicker,
    isReadOnly: false,
    channelId,
    channelStatus,
    channelType,
    currentUserInfo,
    isPostEditing,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(
      {
        postTagToServer
      },
      dispatch
    ),
    postTagToServer: (criteria) => dispatch(postTagToServer(criteria)),
    removeTag: (criteria) => dispatch(removeTag(criteria)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostHeader)
