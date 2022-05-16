import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  isNotificationEnabled,
  isNewPost,
  isMentionAndReaction,
  setNotificationFilter,
  isTask,
  isTag,
  isReply,
} from "../../../utilities/notification-utils";
import { UPDATE_CHANNEL_NOTIFICATION_FILTER } from "../../../store/actionTypes/channelActionTypes";

function Filter(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { activeSelectedChannel } = useSelector((state) => state.config);
  const { notificationFilter } = useSelector((state) => state.channelDetails);
  const { updateFailed } = useSelector((state) => state.ChannelReducer);
  const globalFilter = useSelector(
    (state) => state.AuthReducer.user.notificationFilter
  );
  const [globalEnabled, setGlobalEnabled] = useState(
    isNotificationEnabled(globalFilter)
  );
  const [discussionNotificationEnabled, setDiscussionNotificationEnabled] =
    useState(isNotificationEnabled(notificationFilter));
  const [discussionAllPostsFlag, setDiscussionAllPostsFlag] = useState(
    isNewPost(notificationFilter)
  );
  const [discussionMentionReactionFlag, setDiscussionMentionReactionFlag] =
    useState(isMentionAndReaction(notificationFilter));

  const [discussionTaskFlag, setDiscussionTaskFlag] = useState(
    isTask(notificationFilter)
  );

  const [discussionTagFlag, setDiscussionTagFlag] = useState(
    isTag(notificationFilter)
  );

  const [discussionReplyFlag, setDiscussionReplyFlag] = useState(
    isReply(notificationFilter)
  );

  const [debouncedNotificationFilter, setDebouncedNotificationFilter] =
    useState(null);

  useEffect(() => {
    if (globalEnabled !== isNotificationEnabled(globalFilter)) {
      setGlobalEnabled(isNotificationEnabled(globalFilter));
    }
  }, [globalFilter]);

  useEffect(() => {
    if (updateFailed) {
      dispatch({
        type: UPDATE_CHANNEL_NOTIFICATION_FILTER,
        payload: {
          channel: activeSelectedChannel,
          notificationFilter: activeSelectedChannel.notificationFilter,
        },
      });
    }
  }, [updateFailed]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedNotificationFilter(
        setNotificationFilter(
          discussionNotificationEnabled,
          discussionAllPostsFlag,
          discussionMentionReactionFlag,
          discussionTaskFlag,
          discussionTagFlag,
          discussionReplyFlag
        )
      );
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [
    discussionNotificationEnabled,
    discussionAllPostsFlag,
    discussionMentionReactionFlag,
    discussionTaskFlag,
    discussionTagFlag,
    discussionReplyFlag,
  ]);

  // useEffect(() => {
  //   if (
  //     debouncedNotificationFilter !== null &&
  //     (notificationFilter !== null || notificationFilter !== undefined) &&
  //     notificationFilter !== debouncedNotificationFilter
  //   ) {
  //     dispatch(
  //       updateDiscussionNotificationFilter(
  //         activeSelectedChannel,
  //         setNotificationFilter(
  //           discussionNotificationEnabled,
  //           discussionAllPostsFlag,
  //           discussionMentionReactionFlag
  //         ),
  //         dispatch
  //       )
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [debouncedNotificationFilter]);
  return (
    <Col xs={12}>
      <div
        disabled={!globalEnabled}
        className={`form-wrapper  ${globalEnabled ? "" : "disabled-div"}`}
        style={{ marginTop: "20px" }}
      >
        <Form.Group>
          <Row>
            <h5
              disabled={!globalEnabled}
              className={`d-flex align-center justify-content-between form-subtitle col-12 notification-title-color ${
                discussionNotificationEnabled ? "" : "disabled"
              }`}
              style={{
                marginBottom: "15px",
              }}
            >
              {t("setting.modal:notifications:activity.title")}
              <Form.Check
                disabled={!globalEnabled}
                className="float-right"
                type="switch"
                id="discussion-custom-switch"
                label=""
                checked={discussionNotificationEnabled}
                onChange={() => {
                  setDiscussionNotificationEnabled(
                    !discussionNotificationEnabled
                  );
                }}
              />
            </h5>
          </Row>
          <div
            disabled={!globalEnabled}
            class="custom-control custom-checkbox custom-checkbox-green"
          >
            <input
              type="checkbox"
              class="custom-control-input custom-control-input-green"
              id="discussion-default-activity"
              disabled={!discussionNotificationEnabled || !globalEnabled}
              checked={discussionAllPostsFlag}
              onChange={() => {
                setDiscussionAllPostsFlag(!discussionAllPostsFlag);
              }}
            />
            <label
              class="custom-control-label pointer-on-hover"
              for="discussion-default-activity"
            >
              {t("setting.modal:notifications:activity.all.label")}
            </label>
          </div>

          <div
            disabled={!globalEnabled}
            class="custom-control custom-checkbox custom-checkbox-green"
          >
            <input
              type="checkbox"
              class="custom-control-input custom-control-input-green"
              id="discussion-default-mentions"
              disabled={!discussionNotificationEnabled || !globalEnabled}
              checked={discussionMentionReactionFlag}
              onChange={() => {
                setDiscussionMentionReactionFlag(
                  !discussionMentionReactionFlag
                );
              }}
            />
            <label
              class="custom-control-label pointer-on-hover"
              for="discussion-default-mentions"
            >
              {t("setting.modal:notifications:activity.reply.label")}
            </label>
          </div>
          <div
            disabled={!globalEnabled}
            className="custom-control custom-checkbox custom-checkbox-green"
          >
            <input
              type="checkbox"
              className="custom-control-input custom-control-input-green"
              id="discussion-default-reply"
              disabled={!discussionNotificationEnabled || !globalEnabled}
              checked={discussionReplyFlag}
              onChange={() => {
                setDiscussionReplyFlag(!discussionReplyFlag);
              }}
            />
            <label
              className="custom-control-label pointer-on-hover"
              htmlFor="discussion-default-reply"
            >
              {t("setting.modal:notifications:activity.replies.label")}
            </label>
          </div>
          <div
            disabled={!globalEnabled}
            className="custom-control custom-checkbox custom-checkbox-green"
          >
            <input
              type="checkbox"
              className="custom-control-input custom-control-input-green"
              id="discussion-default-tag"
              disabled={!discussionNotificationEnabled || !globalEnabled}
              checked={discussionTagFlag}
              onChange={() => {
                setDiscussionTagFlag(!discussionTagFlag);
              }}
            />
            <label
              className="custom-control-label pointer-on-hover"
              htmlFor="discussion-default-tag"
            >
              {t("setting.modal:notifications:activity.tag.label")}
            </label>
          </div>
          <div
            disabled={!globalEnabled}
            className="custom-control custom-checkbox custom-checkbox-green"
          >
            <input
              type="checkbox"
              className="custom-control-input custom-control-input-green"
              id="discussion-default-tasks"
              disabled={!discussionNotificationEnabled || !globalEnabled}
              checked={discussionTaskFlag}
              onChange={() => {
                setDiscussionTaskFlag(!discussionTaskFlag);
              }}
            />
            <label
              className="custom-control-label pointer-on-hover"
              htmlFor="discussion-default-tasks"
            >
              {t("setting.modal:notifications:activity.task.label")}
            </label>
          </div>
        </Form.Group>
      </div>
    </Col>
  );
}

export default Filter;
