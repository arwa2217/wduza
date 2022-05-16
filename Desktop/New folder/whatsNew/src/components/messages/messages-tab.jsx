import React, { useState, useEffect, useRef } from "react";
import ChannelHead from "./channel-head";
import ChannelHeadTop from "./channel-head-top";
import MessagePost from "./messages-post";
import MessagePostSmall from "./messages-post-small";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ChannelDetails from "../channel-details/channel-details";
import ChannelMessagesWrapper from "./message-window-scroll-component";
import { useSelector, useDispatch } from "react-redux";
import { channelDetailAction } from "../../store/actions/channelActions";
import {
  showDeletionUnderProcess,
  hideDeletionUnderProcess,
  showDeletionFooter,
} from "../../store/actions/deletion-under-process-actions";
import {
  showArchivalUnderProcess,
  hideArchivalUnderProcess,
} from "../../store/actions/archival-under-process-actions";
import { useTranslation } from "react-i18next";
import "./messages-tab.css";
import { updateSummaryPanelState } from "../../store/actions/config-actions";
import { Box, makeStyles } from "@material-ui/core";
import classNames from "classnames";
import { setCurrentReplyParent } from "../../store/actions/PostReplyActions";
let isCurrentDelete = false;
let isCurrentArchive = false;
const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: "bold",
    fontSize: "13px",
    color: theme.palette.text.primary,
  },
  normalText: {
    fontWeight: "normal",
    fontSize: "13px",
    color: theme.palette.text.primary,
  },
  channelHeadTop: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: 0,
    borderBottom: "1px solid #CCCCCC",
  },
  messagePostSmall: {
    borderTop: `1px solid ${theme.palette.color.columnArea}`,
  },
  leftMessageTabCol: {
    backgroundColor: theme.palette.background.sub1,
    paddingLeft: 16,
    paddingRight: 16,
  },
}));
function MessagesTab(props) {
  const attachmentFileButton = useRef(null);
  const [showDetails, setShowDetails] = useState(true);
  const summaryPanelActive = useSelector(
    (state) => state.config.summaryPanelActive
  );
  const toggleEditor = useSelector(
    (state) => state.channelMessages.toggleEditor
  );
  const [currentToggle, setCurrentToggle] = useState(toggleEditor);
  const postToReply = useSelector((state) => state.channelMessages.postToReply);
  const isSummary = useSelector((state) => state.MailSummaryReducer.isSummary);
  const classes = useStyles();
  const [isActive, setIsActive] = useState(summaryPanelActive);
  const [minEditor, setMinEditor] = useState(true);
  const [clearReply, setClearReply] = useState(false);
  const dispatch = useDispatch();
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const channelStatus = useSelector((state) => state.channelDetails.status);
  const toggleUnreadMessageFlag = useSelector(
    (state) => state.channelMessages.toggleUnreadMessage
  );

  function toggleChannelDetails() {
    setShowDetails(!showDetails);
    dispatch(updateSummaryPanelState(!summaryPanelActive));
  }
  useEffect(() => {
    if (summaryPanelActive !== undefined && summaryPanelActive !== isActive) {
      setIsActive(summaryPanelActive);
      if (summaryPanelActive) {
        setShowDetails(true);
      }
    }
  }, [summaryPanelActive]);
  useEffect(() => {
    if (currentToggle !== toggleEditor) {
      setMinEditor(!toggleEditor);
      setCurrentToggle(toggleEditor);
    }
    
  }, [toggleEditor]);

  const deletingDiscussionStatus = useSelector(
    (state) => state.ChannelReducer.deletingDiscussionStatus
  );
  const deletingDiscussionList = useSelector(
    (state) => state.ChannelReducer.deletingDiscussionList
  );
  const archivingDiscussionStatus = useSelector(
    (state) => state.ChannelReducer.archivingDiscussionStatus
  );
  const archivingDiscussionList = useSelector(
    (state) => state.ChannelReducer.archivingDiscussionList
  );

  /*const {
    deletingDiscussionStatus,
    deletingDiscussionList,
    archivingDiscussionStatus,
    archivingDiscussionList,
  } = useSelector((state) => state.ChannelReducer);*/

  const { t } = useTranslation();
  useEffect(() => {
    toggleUnreadMessageFlag
      ? document.documentElement.style.setProperty("--post-height", "0px")
      : document.documentElement.style.setProperty("--post-height", "154px");
  }, [toggleUnreadMessageFlag]);
  useEffect(() => {
    if (channelStatus === "LOCKED" || channelStatus === "DELETED") {
      document.documentElement.style.setProperty("--post-height", "154px");
    }
    /* Code commented to remove "Discussion deleted notice pop-up" as per new requirement(28-feb-21)*/
    // if (!deletedNoticeShown && channelStatus === "DELETED") {
    //   setDeletedNoticeShown(true);
    //   const modalType = ModalTypes.DISCUSSION_DELETED;
    //   const modalProps = {
    //     show: true,
    //     closeButton: true,
    //     skipButton: false,
    //     title: t("discussion.deleted.modal:header"),
    //     modalType: modalType,
    //     setDeletedNoticeShown:setDeletedNoticeShown
    //   };
    //   dispatch(ModalActions.showModal(modalType, modalProps));
    // }
  }, [channelStatus]);

  useEffect(() => {
    if (props.channel.status === "DELETING" && !isCurrentDelete) {
      let isPresent = false;
      deletingDiscussionList &&
        deletingDiscussionList.length > 0 &&
        deletingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            isPresent = true;
          }
          return item;
        });
      if (isPresent) {
        dispatch(showDeletionUnderProcess());
        isCurrentDelete = true;
      }
    }

    if (props.channel.status === "DELETED" && isCurrentDelete) {
      let stillPresent = false;
      deletingDiscussionList &&
        deletingDiscussionList.length > 0 &&
        deletingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            stillPresent = true;
          }
          return item;
        });
      if (!stillPresent) {
        if (props.channel.isOwner) {
          dispatch(showDeletionFooter());
        } else {
          dispatch(hideDeletionUnderProcess());
        }
        isCurrentDelete = false;
      }
    }
    if (
      !(
        props.channel.status === "DELETED" ||
        props.channel.status === "DELETING"
      )
    ) {
      dispatch(hideDeletionUnderProcess());
    } else if (
      props.channel.status === "DELETING" ||
      props.channel.status === "DELETED"
    ) {
      let index = deletingDiscussionList?.findIndex(
        (item) => item === props.channel.id
      );
      if (index === -1) {
        dispatch(hideDeletionUnderProcess());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMinEditor(true);
  }, [props.channel.id]);

  useEffect(() => {
    let timerFetch;
    if (isCurrentDelete) {
      timerFetch = setTimeout(() => {
        dispatch(channelDetailAction(props.channel.id));
      }, 4000);
    }
    dispatch(channelDetailAction(props.channel.id));
    return () => {
      if (timerFetch) {
        clearTimeout(timerFetch);
      }
    };
  }, [dispatch, props.channel.id, isCurrentDelete]);

  useEffect(() => {
    //Already deleting is true
    if (isCurrentDelete) {
      let stillPresent = false;
      deletingDiscussionList &&
        deletingDiscussionList.length > 0 &&
        deletingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            stillPresent = true;
          }
          return item;
        });
      if (!stillPresent) {
        if (props.channel.isOwner) {
          dispatch(showDeletionFooter());
        } else {
          dispatch(hideDeletionUnderProcess());
        }
        isCurrentDelete = false;
        dispatch(channelDetailAction(props.channel.id));
      }
    }
    //deleting is not true
    if (deletingDiscussionStatus && !isCurrentDelete) {
      let isPresent = false;
      deletingDiscussionList &&
        deletingDiscussionList.length > 0 &&
        deletingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            isPresent = true;
          }
          return item;
        });
      if (isPresent) {
        dispatch(showDeletionUnderProcess());
        isCurrentDelete = true;
      }
    }
  }, [
    deletingDiscussionStatus,
    deletingDiscussionList,
    dispatch,
    props.channel.id,
  ]);

  useEffect(() => {
    //Already archiving is true
    if (isCurrentArchive) {
      let stillPresent = false;
      archivingDiscussionList &&
        archivingDiscussionList.length > 0 &&
        archivingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            stillPresent = true;
          }
          return item;
        });
      if (!stillPresent) {
        dispatch(hideArchivalUnderProcess());
        isCurrentArchive = false;
      }
    }
    //archiving is not true
    if (archivingDiscussionStatus && !isCurrentArchive) {
      let isPresent = false;
      archivingDiscussionList &&
        archivingDiscussionList.length > 0 &&
        archivingDiscussionList.map((item) => {
          if (item === props.channel.id) {
            isPresent = true;
          }
          return item;
        });
      if (isPresent) {
        dispatch(showArchivalUnderProcess());
        isCurrentArchive = true;
      }
    }
  }, [
    archivingDiscussionStatus,
    archivingDiscussionList,
    dispatch,
    props.channel.id,
  ]);
  const handleClearReply = () => {
    setCurrentReplyParent(null, {});
    setClearReply(true);
  };
  let isEnable = false;

  return (
    <div
      className="d-flex flex-column w-100"
      onMouseUp={(e) => {
        if (isEnable) {
          isEnable = false;
          e.stopPropagation();
          e.preventDefault();
        }
        return false;
      }}
      onMouseMove={(e) => {
        if (isEnable) {
          let pos = e.clientX;
          let min = window.innerWidth / 2;
          let max = window.innerWidth - 250;
          if (pos > min && pos < max) {
            const rightDetails = document.getElementById("right-details");
            rightDetails.style.width = window.innerWidth - pos + "px";
            // document.getElementById("left-messagetab").style.width =
            //   window.innerWidth - (window.innerWidth - pos) + "px";
          }
        }
      }}
    >
      <Row className="m-0">
        <Col xs={12} className={classes.channelHeadTop}>
          <ChannelHeadTop
            channel={props.channel}
            isActive={isActive}
            onToggleChannelDetails={toggleChannelDetails}
          />
        </Col>
      </Row>
      <Row className="flex-nowrap flex-row m-0 w-100">
        <div
          id="left-messagetab"
          className="message-tab"
          style={{ width: isSummary ? "100%" : "calc(100% - 331px)" }}
        >
          <Row className="m-0">
            <Col
              className={classNames(
                "channel-head-wrap-bg p-0",
                minEditor && "channel-head-wrap-bg-editor-small"
              )}
            >
              <Col xs={12} className={classes.leftMessageTabCol}>
                <ChannelHead
                  channel={props.channel}
                  isActive={isActive}
                  onToggleChannelDetails={toggleChannelDetails}
                />
              </Col>
              <Col xs={12} className="p-0" style={{ zIndex: "999" }}>
                <ChannelMessagesWrapper
                  channelId={props.channel.id}
                  channel={props.channel}
                  members={globalMembers}
                  currentUser={currentUser}
                  minEditor={minEditor}
                  setMinEditor={setMinEditor}
                />
              </Col>
              {channelStatus === "LOCKED" ? (
                <div className="disabled-script-window">
                  {t("script.window:channel.archived")}
                </div>
              ) : channelStatus === "DELETED" ? (
                <div className="disabled-script-window">
                  {t("script.window:channel.deleted")}
                </div>
              ) : (
                !toggleUnreadMessageFlag && (
                  <Col
                    xs={12}
                    className={classNames(
                      "message-post-wrap",
                      minEditor && classes.messagePostSmall,
                      minEditor && "message-post-wrap-small"
                    )}
                  >
                    <div
                      className={`${
                        minEditor
                          ? "d-flex align-items-center justify-content-between w-100 h-100"
                          : "d-none"
                      }`}
                    >
                      <MessagePostSmall
                        channel={props.channel}
                        channelMembers={globalMembers}
                        taskOnToolbar={true}
                        setMinEditor={setMinEditor}
                        refAttachmentFileButton={attachmentFileButton}
                      />
                    </div>
                    <div className={`${minEditor ? "d-none" : "d-flex"}`}>
                    {postToReply?.parentPostId ? (
                       
                        <MessagePost {...postToReply } openReplyView={true} />
                      ) : (
                        <MessagePost
                          channel={props.channel}
                          setMinEditor={setMinEditor}
                          channelMembers={globalMembers}
                          taskOnToolbar={true}
                          refAttachmentFileButton={attachmentFileButton}
                          minEditor={minEditor}
                          openReplyView={false}
                        />
                      )}
                    </div>
                  </Col>
                )
              )}
            </Col>
          </Row>
        </div>

        {isActive && (
          <div
            onMouseDown={(e) => {
              if (!isEnable) {
                isEnable = true;
                e.stopPropagation();
                e.preventDefault();
              }
              return false;
            }}
          >
            <hr className="width-resize-details" />
          </div>
        )}
        {isActive && (
          <Col
            id="right-details"
            className={
              showDetails ? "detailsBar col-md-auto p-0 mr-0" : "d-none"
            }
          >
            <Box
              sx={{
                bgcolor: "background.default",
                height: "100%",
              }}
            >
              <ChannelDetails
                id="channel-details"
                channel={props.channel}
                toggleChannelDetails={toggleChannelDetails}
              />
            </Box>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default MessagesTab;
