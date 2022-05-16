import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReplyCount } from "./replyCount";
import { ReplyView } from "./replyView";
import { CLEAR_MESSAGES_REPLY_POST } from "../../../store/actionTypes/commonActionTypes";
import { makeStyles } from "@material-ui/core";
import styled from "styled-components";
import SVG from "react-inlinesvg";
const useStyles = makeStyles((theme) => ({
  forwardCount: {
    fontWeight: 400,
    paddingLeft: "8px",
    "& .forward__text": {
      fontSize: "11px",
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
}));
const Reaction = styled.div`
  .reaction-type-check {
    path {
      stroke: #00a95b;
    }
    .check-number {
      color: #00a95b;
    }
  }
  .reaction-type-up {
    path {
      stroke: #0796ff;
    }
    .plus-number {
      color: #0796ff;
    }
  }
  .reaction-type-down {
    path {
      stroke: #f16354;
    }
    .minus-number {
      color: #f16354;
    }
  }
`;
export const ReplyViewWrapper = ({
  totalReply,
  showReplies,
  showUnreadReplies,
  updateShowReplies,
  updateUnreadShowReplies,
  forceHideReplies,
  parentPostId,
  focusOnEditor,
  isHiddenReplyPost,
  toggleUnreadMessageFlag,
  unreadReplyCount,
  postInfo,
  fwdStats,
  hasCheckedReaction,
  postForwardFlag,
  PostReactionType,
  post,
  reactions,
  CheckIcon,
  hasUPReaction,
  postForwardFlagAction,
  PlusIcon,
  MinusIcon,
  hasDOWNReaction,
  currentUser
}) => {
  const selectedParentId = useSelector(
    (state) => state.postReplies.selectedParentId
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    if (showReplies) {
      if (parentPostId && parentPostId !== selectedParentId) {
        forceHideReplies();
      }
    }
  }, [parentPostId, selectedParentId, showReplies]);
  let replyClass = {
    className: isHiddenReplyPost
      ? "post-message__text_hide message-post-wrap"
      : "",
  };
  const isOwnerReaction = (reactions = {}, type) => {
    const {
      reactionStats: { Reactions = [] },
    } = reactions;
    const usersReactions =
      Reactions.find((item) => item.type === type).users || [];
    const usersIdReactions = usersReactions.map((item) => item.userId);
    
    const id = currentUser?.id
    return usersIdReactions.includes(id);
  };
  return (
    <div
      className={replyClass.className}
      style={{ width: "100%", justifyContent: "flex-end" }}
    >
      
      <div className={`post-statistic ${ showReplies? 'show-all':''}`}>
      <div
        className="post-reaction d-flex"
      >
        {hasCheckedReaction && !postForwardFlagAction && (
          <Reaction
            // onMouseEnter={showReactedUserList}
            // onMouseLeave={hideReactedUserList}
            
            data-reaction={PostReactionType?.CHECK}
          >
            <div
              className="ReplyView__tooltip"
              id={"reaction_check_container" + post.id}
            ></div>
            <span
              className={`d-flex align-items-center ${
                isOwnerReaction(reactions, "CHECKED") &&
                "reaction-type-check"
              }`}
              style={{
                fontSize: "11px",
                color: "rgba(0, 0, 0, 0.4)",
                marginRight: "8px",
              }}
            >
              <SVG
                src={CheckIcon}
                alt="check-icon"
                className={"post-react-img "}
              />
              <span
                style={{ fontSize: "11px", height: "14px" }}
                className="check-number"
              >
                {reactions?.reactionStats?.checked}
              </span>
            </span>
          </Reaction>
        )}
        {hasUPReaction && !postForwardFlagAction && (
          <Reaction
            // onMouseEnter={showReactedUserList}
            // onMouseLeave={hideReactedUserList}
            
            data-reaction={PostReactionType?.UP_ONE}
          >
            <div
              className="ReplyView__tooltip"
              id={"reaction_up_container" + post.id}
            ></div>

            <span
              className={`d-flex align-items-center ${
                isOwnerReaction(reactions, "UP") &&
                "reaction-type-up"
              }`}
              style={{
                fontSize: "11px",
                color: "rgba(0, 0, 0, 0.4)",
                marginRight: "8px",
              }}

              // onMouseEnter={showReactedUserList}
              // onMouseLeave={hideReactedUserList}
            >
              <SVG
                src={PlusIcon}
                alt="plus-icon"
                className={"post-react-img "}
              />
              <span
                style={{ fontSize: "11px", height: "13px" }}
                className="plus-number"
              >
                {reactions.reactionStats.up}
              </span>
            </span>
          </Reaction>
        )}
        {hasDOWNReaction && !postForwardFlagAction && (
          <Reaction
            // onMouseEnter={showReactedUserList}
            // onMouseLeave={hideReactedUserList}
            
            data-reaction={PostReactionType.DOWN_ONE}
            className="reaction-type-down"
          >
            <div
              className="ReplyView__tooltip"
              id={"reaction_down_container" + post.id}
            ></div>

            <span
              // onMouseEnter={
              //   !postForwardFlag ? showReactedUserList : ""
              // }
              // onMouseLeave={hideReactedUserList}
              className={`d-flex align-items-center ${
                isOwnerReaction(reactions, "DOWN") &&
                "reaction-type-down"
              }`}
              style={{
                fontSize: "11px",
                color: "rgba(0, 0, 0, 0.4)",
              }}
            >
              <SVG
                src={MinusIcon}
                alt="minus-icon"
                className={"post-react-img "}
              />
              <span
                style={{ fontSize: "11px", height: "13px" }}
                className="minus-number"
              >
                {reactions.reactionStats.down}
              </span>
            </span>
          </Reaction>
        )}
      </div>
      <div className="post-count">
        {toggleUnreadMessageFlag ? (
          unreadReplyCount !== undefined &&
          unreadReplyCount > 0 && (
            <ReplyCount
              totalReply={totalReply}
              updateShowReplies={() => {
                if (toggleUnreadMessageFlag) {
                  updateUnreadShowReplies();
                } else {
                  if (!showReplies) {
                    dispatch({
                      type: CLEAR_MESSAGES_REPLY_POST,
                    });
                  }
                  updateShowReplies();
                }
              }}
              showReplies={showReplies}
              showUnreadReplies={showUnreadReplies}
              toggleUnreadMessageFlag={toggleUnreadMessageFlag}
            ></ReplyCount>
          )
        ) : (totalReply ? totalReply : 0) > 0 ? (
          <ReplyCount
            totalReply={totalReply}
            updateShowReplies={() => {
              if (toggleUnreadMessageFlag) {
                updateUnreadShowReplies();
              } else {
                if (!showReplies) {
                  dispatch({ type: CLEAR_MESSAGES_REPLY_POST });
                }
                updateShowReplies();
              }
            }}
            showReplies={showReplies}
            showUnreadReplies={showUnreadReplies}
            toggleUnreadMessageFlag={toggleUnreadMessageFlag}
          ></ReplyCount>
        ) : (
          ""
        )}
        {fwdStats && fwdStats?.total !== 0 && (
          <div className={classes.forwardCount}>
            <span className="forward__text">{fwdStats?.total} {fwdStats?.total > 1 ? "Forwards" : "Forward"}</span>
          </div>
        )}
      </div>
         
      </div>
      {toggleUnreadMessageFlag
        ? unreadReplyCount !== undefined &&
          unreadReplyCount > 0 &&
          showUnreadReplies && (
            <div className="all-reply">
              <ReplyView
              totalReply={totalReply}
              parentPostId={parentPostId}
              updateShowReplies={updateShowReplies}
              focusOnEditor={focusOnEditor || !totalReply}
              toggleUnreadMessageFlag={toggleUnreadMessageFlag}
              postInfo={postInfo}
              showReplies={2}
            ></ReplyView>
            </div>
            
          )
        : showReplies && (
            <ReplyView
              totalReply={totalReply}
              parentPostId={parentPostId}
              updateShowReplies={updateShowReplies}
              focusOnEditor={focusOnEditor || !totalReply}
              toggleUnreadMessageFlag={toggleUnreadMessageFlag}
              postInfo={postInfo}
              showReplies={2}
            ></ReplyView>
          )}

      
    </div>
  );
};
