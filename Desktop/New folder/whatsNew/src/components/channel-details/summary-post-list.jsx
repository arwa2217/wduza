import React from "react";
import iconPostUnhide from "../../assets/icons/post-toolbox/post-unhide.svg";
import { taskConstants } from "../../constants/task";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../shared/styles/mainframe.style";
import CommonUtils from "../utils/common-utils";
import PostContentView from "../utils/post-content-view";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import activeTodo from "../../assets/icons/task-modal-icons/todo-task.svg";
import activeAssign from "../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../assets/icons/task-modal-icons/active-cancel.svg";
import { toggleUnreadMessage } from "../../store/actions/channelMessagesAction";
const hasDecision = true;
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "tags__background_green";
const textColorNormal = "tags__color__white";
const textColorHovered = "tags__color__white";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";

const SummaryPostList = (props) => {
  const { t } = useTranslation();
  let { forwardPostData } = useSelector((state) => state.postForwardReducer);
  const { blockType, el, postContent, postAuthor, assigneeUser } = props;
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  let channelId = useSelector(
    (state) => state.config?.activeSelectedChannel?.id
  );
  const isToggleUnreadMessage = useSelector(
    (state) => state.channelMessages.toggleUnreadMessage
  );

  const renderElement = (blockType, el, postData, postAuthor, assigneeUser) => (
    <>
      <h5>
        <span>
          {el.fwd_post_id && postData?.user?.displayName ? (
            <span>{postData?.user?.displayName}</span>
          ) : (
            <span>
              {blockType === "TAGS"
                ? el.postCreatorName
                : blockType === "SAVES"
                ? el.postAuthor
                : postAuthor}
            </span>
          )}
          <span className="time-created">
            {t("tagTime", {
              date: postData?.post?.createdAt,
            })}
          </span>
        </span>
        {el?.isHidden && (
          <img
            onClick={(e) => e.stopPropagation()}
            alt=""
            title=""
            src={iconPostUnhide}
            style={{
              marginLeft: "5px",
            }}
          />
        )}
      </h5>
      {postData.postType === "TASK" || postData.post_type === "TASK" ? (
        <>
          <div className="task-header-top">
            <div className="task-info mr-0">
              {/* {props?.taskSequenceId && (
                <span className="task-id">{props?.taskSequenceId}</span>
              )} */}

              {postData.task?.taskSequenceId && (
                <span className="task-id">{postData.task?.taskSequenceId}</span>
              )}

              <span
                className={`task-status task-btn-${postData.task?.taskStatus?.toLowerCase()}`}
              >
                <img
                  src={
                    postData.task.taskStatus === taskConstants.TODO
                      ? activeTodo
                      : postData.task.taskStatus === taskConstants.ASSIGN
                      ? activeAssign
                      : postData.task.taskStatus === taskConstants.INPROGRESS
                      ? activeProgress
                      : postData.task.taskStatus === taskConstants.DONE
                      ? activeDone
                      : postData.task.taskStatus === taskConstants.PENDING
                      ? activePending
                      : postData.task.taskStatus === taskConstants.CANCELED
                      ? activeCancel
                      : ""
                  }
                  alt=""
                />
                {getTaskStatusCase(postData.task.taskStatus)}
              </span>
            </div>
          </div>
          <div
            className="task-wrapper"
            style={
              postData.task.taskStatus === taskConstants.DONE
                ? {
                    borderColor: "#00A95B",
                    paddingBottom: "0",
                  }
                : postData.task.taskStatus === taskConstants.CANCELED ||
                  postData.task.taskStatus === taskConstants.PENDING
                ? {
                    borderColor: "rgba(0, 0, 0, 0.4)",
                    paddingBottom: "0",
                  }
                : {
                    borderColor: "#00A95B",
                    paddingBottom: "0",
                  }
            }
          >
            <div className="task-header mb-0">
              <div className="task-header-top">
                <div className="task-title">{postData.task.taskTitle}</div>
              </div>
              <div className="w-100 task-ownership">
                <span>
                  {`${
                    postData && postData.task && postData.task.taskStartTime
                      ? t("taskTime-12", {
                          time: postData.task?.taskStartTime,
                        })
                      : ""
                  } ${
                    postData &&
                    postData.task &&
                    postData.task.taskStartTime &&
                    postData.task.taskStopTime
                      ? "-"
                      : ""
                  } ${
                    postData && postData.task && postData.task.taskStopTime
                      ? t("taskTime-12", {
                          time: postData.task?.taskStopTime,
                        })
                      : ""
                  }`}
                </span>
                {assigneeUser && assigneeUser.length > 0 ? (
                  <>
                    <span
                      className="d-block"
                      style={
                        (postData &&
                          postData.task &&
                          postData.task.taskStartTime) ||
                        (postData &&
                          postData.task &&
                          postData.task.taskStopTime)
                          ? {
                              marginTop: "7px",
                            }
                          : { marginTop: "-7px" }
                      }
                    >
                      Assigned to{" "}
                      <span className="task-assigned">
                        @{assigneeUser[0].screenName}
                      </span>
                    </span>
                  </>
                ) : (
                  t("unknown.user")
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <PostContentView
            content={JSON.parse(el.contents).post.content}
            index={el.post_id}
          />
          {
            !JSON.parse(el.contents).post.content &&
              el.fileInfo !== null &&
              el.fileInfo.length > 0 && (
                <div className="post-overflow">
                  <p>{t("file:attached.files.here")}</p>
                </div>
              )

            // Do not remove
            // el.fileInfo.map((item, index) => (
            //   <BoxDivWrapper key={item.id}>
            //     <BoxDivLarge>
            //       <BoxDivInner>
            //         <FileExtIcon src={fileAttachment} alt="" />
            //         <Details>
            //           <FileInfo>
            //             <Name title={item.name}>{item.name}</Name>
            //             <Size>{getFileSize(item.size)}</Size>
            //           </FileInfo>
            //         </Details>
            //       </BoxDivInner>
            //     </BoxDivLarge>
            //   </BoxDivWrapper>
            // ))
          }
        </>
      )}
    </>
  );
  const getTaskStatusCase = (taskStatus) => {
    return taskStatus === taskConstants.TODO
      ? t("task.modal:status.buttons:todo")
      : taskStatus === taskConstants.ASSIGN
      ? t("task.modal:status.buttons:assign")
      : taskStatus === taskConstants.INPROGRESS
      ? t("task.modal:status.buttons:progress")
      : taskStatus === taskConstants.DONE
      ? t("task.modal:status.buttons:done")
      : taskStatus === taskConstants.PENDING
      ? t("task.modal:status.buttons:pending")
      : taskStatus === taskConstants.CANCELED
      ? t("task.modal:status.buttons:canceled")
      : "";
  };
  function redirectToPost(contents) {
    if (isToggleUnreadMessage) dispatch(toggleUnreadMessage(channelId));
    let data;
    if (contents) {
      data = typeof contents === "string" ? JSON.parse(contents) : contents;
      if (data.channelId && data.channelName && data.post && data.post.id) {
        let postId = data
          ? data.reply.parentId
            ? data.reply.parentId
            : data.post.id
          : "";
        let childPostId = data ? (data.reply.parentId ? data.post.id : "") : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          data.channelName,
          blockType.toLowerCase(),
          blockType.toLowerCase(),
          data.channelId,
          postId,
          childPostId,
          dispatch
        );
        // props.updateShowReplies(undefined, true);
        // updateShowReplies("undefined","undefined");
      }
    }
  }
  return (
    <div
      className={`sidebar-container ${
        blockType === "SAVES" ? "post__desc__saved" : ""
      }`}
      key={`summary-${el.post_id}`}
      onClick={() => {
        redirectToPost(blockType === "TASKS" ? el : el.contents);
      }}
    >
      {blockType === "TAGS" && (
        <h5 style={{ marginBottom: "5px", alignItems: "start" }}>
          <span className="d-flex flex-wrap align-items-center">
            <span className="tagged-by" style={{ marginBottom: "5px" }}>
              {t("postInfo:tagged.by")}
              <span
                style={{ color: " var(--link-color)" }}
              >{` @${el.createdBy}`}</span>
            </span>
            <span className="time-created" style={{ marginBottom: "5px" }}>
              {t("tagTime", {
                date: el.createdAt,
              })}
            </span>
          </span>
          <Button
            size="small"
            strong={`true`}
            rounded={`true`}
            backgroundColor={
              hasDecision
                ? buttonBackgroundColorHovered
                : buttonBackgroundColorNormal
            }
            textColor={hasDecision ? textColorHovered : textColorNormal}
            hoverBackgroundColor={buttonBackgroundColorHovered}
            hoverTextColor={textColorHovered}
            borderColor={hasDecision ? borderColorHovered : borderColorNormal}
            hoverBorderColor={borderColorHovered}
            className="m-0 tags-position"
          >
            {t("postInfo:postTag:" + el.tagName)}
          </Button>
        </h5>
      )}
      <div
        className={`post-message__text ${
          el?.isHidden && currentUserId === postContent.userId
            ? "post-message__text_hide"
            : ""
        }`}
      >
        {el.fwd_post_id ? (
          <>
            {renderElement(
              blockType,
              el,
              postContent,
              postAuthor,
              assigneeUser
            )}
            <div className="sidebar-forward-post">
              {renderElement(
                blockType,
                el,
                forwardPostData,
                postAuthor,
                assigneeUser
              )}
            </div>
          </>
        ) : (
          renderElement(blockType, el, postContent, postAuthor, assigneeUser)
        )}
      </div>
    </div>
  );
};
export default SummaryPostList;
