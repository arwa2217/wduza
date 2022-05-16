import React, { useState, useEffect, useRef } from "react";
import iconPostUnhide from "../../assets/icons/post-toolbox/post-unhide.svg";
import { taskConstants } from "../../constants/task";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button } from "../shared/styles/mainframe.style";
import PostContentView from "../utils/post-content-view";
import activeTodo from "../../assets/icons/task-modal-icons/active-todo.svg";
import activeAssign from "../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../assets/icons/task-modal-icons/active-cancel.svg";
import { getHighlightedHtml } from "../utils/post-utils";
const buttonBackgroundColorNormal = "white";
const buttonBackgroundColorHovered = "tags__background_green";
const textColorNormal = "tags__color__white";
const textColorHovered = "tags__color__white";
const borderColorNormal = "post__tags__border";
const borderColorHovered = "post__tags__border__hover";

const SearchResultView = (props) => {
  const { t } = useTranslation();
  let { forwardPostData } = useSelector((state) => state.postForwardReducer);
  const { blockType, el, postContent, postAuthor, assigneeUser, terms } = props;
  const nodeRef = useRef();
  const [removeOverflow, setRemoveOverflow] = useState(false);
  const [overflowActive, setOverflowActive] = useState(false);
  const [showLess, setShowLess] = useState(false);

  const handleShowLess = () => {
    setRemoveOverflow(false);
    setOverflowActive(true);
    setShowLess(false);
  };
  const isEllipsisActive = (e) => {
    return e.offsetHeight < e.scrollHeight;
  };
  useEffect(() => {
    let isEllipsis = isEllipsisActive(nodeRef.current);
    setOverflowActive(isEllipsis);
  }, []);
  const renderElement = (
    blockType,
    el,
    postData,
    postAuthor,
    assigneeUser,
    terms
  ) => (
    <>
      <h5>
        {/* <span>
          <span>{el.username ? el.username : ""}</span>

          <span className="time-created">
            {t("tagTime", {
              date: el.created_at,
            })}
          </span>
        </span> */}

        <span>
          {el.original_content?.forwardedPost?.post?.id &&
          postData?.user?.displayName ? (
            <span
              dangerouslySetInnerHTML={{ __html: postData?.user?.displayName }}
            />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: el.username }} />
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
      {postData.post_type === "TASK" ? (
        <>
          <div className="task-header-top">
            <div className="task-info mr-0">
              {props?.taskSequenceId && (
                <span className="task-id">{props?.taskSequenceId}</span>
              )}

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
                    borderColor: "#308F65",
                    paddingBottom: "0",
                  }
                : postData.task.taskStatus === taskConstants.CANCELED ||
                  postData.task.taskStatus === taskConstants.PENDING
                ? {
                    borderColor: "#EC801C",
                    paddingBottom: "0",
                  }
                : {
                    borderColor: "#2D76CE",
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
                      <span
                        className="task-assigned"
                        dangerouslySetInnerHTML={{
                          __html: `@${getHighlightedHtml(
                            terms,
                            assigneeUser[0].screenName
                          )}`,
                        }}
                      />
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
            content={el?.original_content?.post?.content}
            index={el?.original_content?.post?.id}
          />
          {!postData?.post?.content &&
            el?.file_name !== null &&
            el?.file_name?.length > 0 && (
              <div className="post-overflow">
                <p>{t("file:attached.files.here")}</p>
              </div>
            )}
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

  return (
    <div
      className={`sidebar-container ${
        blockType === "SAVES" ? "post__desc__saved" : ""
      }`}
      style={removeOverflow ? { maxHeight: "225px" } : {}}
      ref={nodeRef}
      key={`summary-${el.original_content?.post?.id}`}
      onClick={() => {
        props.postRedirection(el.original_content);
      }}
    >
      {blockType === "TAGS" && (
        <h5 style={{ marginBottom: "10px" }}>
          <span>
            <span className="tagged-by">
              {t("postInfo:tagged.by")}
              <span
                style={{ color: " var(--link-color)" }}
              >{` @${el.createdBy}`}</span>
            </span>
            <span className="time-created">
              {t("tagTime", {
                date: el.createdAt,
              })}
            </span>
          </span>
          <Button
            size="small"
            strong={`true`}
            rounded={`true`}
            backgroundColor={buttonBackgroundColorNormal}
            textColor={textColorNormal}
            hoverBackgroundColor={buttonBackgroundColorHovered}
            hoverTextColor={textColorHovered}
            borderColor={borderColorNormal}
            hoverBorderColor={borderColorHovered}
            className="m-0 tags-position"
          >
            {t("postInfo:postTag:" + el.tagName)}
          </Button>
        </h5>
      )}
      <div
        className={`post-message__text ${
          el?.isHidden ? "post-message__text_hide" : ""
        }`}
      >
        {el.original_content?.forwardedPost?.post?.id ? (
          <>
            {renderElement(
              blockType,
              el,
              postContent,
              postAuthor,
              assigneeUser,
              terms
            )}
            <div className="sidebar-forward-post">
              {renderElement(
                blockType,
                el,
                forwardPostData,
                postAuthor,
                assigneeUser,
                terms
              )}
            </div>
          </>
        ) : (
          renderElement(
            blockType,
            el,
            postContent,
            postAuthor,
            assigneeUser,
            terms
          )
        )}
      </div>
      {overflowActive && (
        <p className="show-more-post" style={{ lineHeight: "inherit" }}>
          ...
          <span onClick={handleShowLess} style={{ cursor: "pointer" }}>
            {t("more")}
          </span>
        </p>
      )}
      {showLess && (
        <p className="show-more-post">
          ...
          <span onClick={handleShowLess} style={{ cursor: "pointer" }}>
            {t("less")}
          </span>
        </p>
      )}
    </div>
  );
};
export default SearchResultView;
