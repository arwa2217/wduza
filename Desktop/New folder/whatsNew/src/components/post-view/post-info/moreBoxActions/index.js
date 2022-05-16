import React, {useEffect, useReducer, useState} from "react";
import PostTagMenu from "../post-tag-menu/post-tag-menu";
import PostTaskMenu from "../post-task-menu/post-task-menu";
import PostEdit from "./post-edit";
import PostHide from "./post-hide";
import iconPostForward from "../../../assets/icons/post-toolbox/post-forward.svg";
import iconPostForwardToEmail from "../../../assets/icons/outlook-toolbox/forward-email.svg";
import iconSavedPost from "../../../assets/icons/post-toolbox/my-saves.svg";
import iconPostDelete from "../../../assets/icons/post-toolbox/post-delete.svg";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
const moreBoxActions = (props) => {
     // Tags

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

      const reactPostTaskClicked = (e, taskStatus, postToTask) => {
        e.preventDefault();
        if (postToTask) {
          let taskInfo = {
            taskStatus,
            taskTitle: "My work",
            taskStartTime: new Date().setHours(0, 0, 0, 0),
            taskStopTime: new Date().setHours(23, 59, 0, 0),
            taskAssignee: props.currentUserInfo?.id,
          };
          console.log("reactEditPostTask************")
          reactEditPostTask(e, postToTask, taskInfo);
        } else {
          const { postTaskToServer } = props;
          let requestBody = {
            channelId: props.channelId,
            postId: props.post.id,
            taskStatus: taskStatus,
          };
          postTaskToServer(requestBody);
        }
      };

     const tag = (
        <PostTagMenu
          onClick={reactPostTagClicked}
          post={post}
          currentTags={props.tagInfo}
        />
      );
      const tagPostDisabled = (
        <div className="p-0 m-0 align-items-center tag-post disabled">
          <PostTagMenu
            onClick={reactPostTagClicked}
            post={post}
            currentTags={props.tagInfo}
          />
        </div>
      );
  
      // Edit
      const editPost = (
        <div className="p-0 m-0 align-items-center">
          <OverlayTrigger
            className="hidden-xs"
            delayShow={500}
            placement="top"
            overlay={tooltipEditPost}
          >
            <PostEdit onEditClick={reactEditPost} postInfo={props} />
          </OverlayTrigger>
        </div>
      );
  
      const editPostTask = (
        <div className="p-0 m-0 align-items-center">
          {/* <OverlayTrigger
                      className="hidden-xs"
                      delayShow={500}
                      placement="top"
                      overlay={tooltipEditPost}
                  > */}
          <PostEdit onEditClick={reactEditPostTask} postInfo={props} />
          {/* </OverlayTrigger> */}
        </div>
      );
      const editPostDisabled = (
        <div className="p-0 m-0 align-items-center disabled">
          {/* <OverlayTrigger
                      className="hidden-xs"
                      delayShow={500}
                      placement="top"
                      overlay={tooltipEditPost}
                  > */}
          <PostEdit />
          {/* </OverlayTrigger> */}
        </div>
      );
  
      // Post Forwarding
      const postForwarding = (
        <div className="p-0 m-0 align-items-center">
          <OverlayTrigger
            className="hidden-xs"
            delayShow={500}
            placement="top"
            overlay={tooltipForwardPost}
          >
            <button
              className="btn-shadow-none btn"
              onClick={reactForwardPost}
  
              // className="btn-shadow-none btn disabled"
              // onClick={null}
            >
              <img alt="iconPostForward" src={iconPostForward} />
            </button>
          </OverlayTrigger>
        </div>    
    // const moreBoxAction = (
    //   <div className="dropdown-more-action">
    //     {props.currentUserInfo.userType !== "GUEST"
    //         ? tag
    //       : tagPostDisabled}

    //       {props.channelType === ChannelConstants.INTERNAL
    //          ? props.currentUserInfo.userType !== "GUEST"
    //            ? postForwarding
    //            : postForwarding
    //          : postForwarding}

    //     {props.currentUserInfo.userType !== "GUEST"
    //       ? props.isTaskPost
    //         ? task
    //         : editPostTaskModal
    //       : taskDisabled}
    //     {props.isOwner ? hidePost : hidePostDisabled}
        
    //   </div>
    // )
      );
      const postForwardingDisabled = (
        <div className="p-0 m-0 align-items-center disabled">
          <OverlayTrigger
            className="hidden-xs"
            delayShow={500}
            placement="top"
            overlay={tooltipForwardPost}
          >
            <button className="btn-shadow-none btn disabled" onClick={null}>
              <img alt="iconPostForward" src={iconPostForward} />
            </button>
          </OverlayTrigger>
        </div>
      );
  
      // Hide post
      const hidePost = (
        <div className="p-0 m-0 align-items-center">
          {/* <OverlayTrigger
                      className="hidden-xs"
                      delayShow={500}
                      placement="top"
                      overlay={tooltipHidePost}
                  > */}
          <PostHide
            onHideClick={reactHidePost}
            onUnhideClick={reactUnhidePost}
            postInfo={props}
          />
          {/* </OverlayTrigger> */}
        </div>
      );
      const forwardPostToEmail = (
        <div className="p-0 m-0 align-items-center">
          <OverlayTrigger
            className="hidden-xs"
            delayShow={500}
            placement="top"
            overlay={tooltipForwardPostToEmail}
          >
            <button
              className="btn-shadow-none btn"
              onClick={reactForwardPostToEmail}
            >
              <img alt="iconPostForwardToEmail" src={iconPostForwardToEmail} />
            </button>
          </OverlayTrigger>
        </div>
      );
      const hidePostDisabled = (
        <div className="p-0 m-0 align-items-center disabled">
          {/* <OverlayTrigger
                      className="hidden-xs"
                      delayShow={500}
                      placement="top"
                      overlay={tooltipHidePost}
                  > */}
          <PostHide
            onHideClick={reactHidePost}
            onUnhideClick={reactUnhidePost}
            postInfo={props}
          />
          {/* </OverlayTrigger> */}
        </div>
      );
      const tooltipDeletePost = (
        <Tooltip id="reaction-icon-tooltip" className="hidden-xs">
          {t("postInfo:tooltip.delete.post")}
        </Tooltip>
      );
  
      // Delete
      const deletePost = (
        <div className="p-0 m-0 align-items-center">
          <OverlayTrigger
            className="hidden-xs"
            delayShow={500}
            placement="top"
            overlay={tooltipDeletePost}
          >
            <button className="btn-shadow-none btn disabled">
              <img alt="" src={iconPostDelete} />
            </button>
          </OverlayTrigger>
        </div>
      );
  
      // Task
      const task = (
        <PostTaskMenu
          onClick={reactPostTaskClicked}
          post={post}
          taskInfo={props.taskInfo}
          userType={props.currentUserInfo.userType}
          isTaskPost={props.isTaskPost}
          isOwner={props.isOwner}
          postToTask={false}
          disabled={false}
        />
      );
      const editPostTaskModal = (
        <PostTaskMenu
          // post={post}
          onClick={reactPostTaskClicked}
          taskInfo={props.taskInfo}
          userType={props.currentUserInfo.userType}
          isTaskPost={props.isTaskPost}
          postToTask={true}
          reactEditPostTask={reactEditPostTask}
          isOwner={props.isOwner}
          disabled={false}
        />
      );
      const taskDisabled = (
        <PostTaskMenu
          // post={post}
          onClick={reactPostTaskClicked}
          taskInfo={props.taskInfo}
          userType={props.currentUserInfo.userType}
          isTaskPost={props.isTaskPost}
          postToTask={false}
          reactEditPostTask={reactEditPostTask}
          isOwner={props.isOwner}
          disabled={true}
        />
      );
    return (
        <div>

            {props.currentUserInfo.userType !== "GUEST"
                ? tag
            : tagPostDisabled}

            {props.channelType === ChannelConstants.INTERNAL
                ? props.currentUserInfo.userType !== "GUEST"
                ? postForwarding
                : postForwarding
                : postForwarding}

            {props.currentUserInfo.userType !== "GUEST"
            ? props.isTaskPost
                ? task
                : editPostTaskModal
            : taskDisabled}
            {props.isOwner ? hidePost : hidePostDisabled}
        </div>
    )

}



function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(
        {
          PostEditAction,
          postHideAction,
          addReactionAction,
          removeReactionAction,
        },
        dispatch
      ),
      postTagToServer: (criteria) => dispatch(postTagToServer(criteria)),
      postTaskToServer: (criteria) => dispatch(postTaskToServer(criteria)),
      removeTag: (criteria) => dispatch(removeTag(criteria)),
      postSavesToServer: (criteria) => dispatch(postSavesToServer(criteria)),
      removeSave: (criteria) => dispatch(removeSave(criteria)),
      PostEditAction: (channelId, postId) =>
        dispatch(PostEditAction(channelId, postId)),
      postHideAction: (channelId, postId) =>
        dispatch(postHideAction(channelId, postId)),
      dispatch,
    };
  }
  
  export default withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(moreBoxActions)
  );