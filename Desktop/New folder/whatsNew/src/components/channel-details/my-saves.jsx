import React, { useState, useEffect } from "react";
import { fetchSaveDetails } from "../../store/actions/my-saves-actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TextLink } from "../shared/styles/mainframe.style";

import { fetchForwardDetailsById } from "../../store/actions/post-forward-action";

import SummaryPostList from "./summary-post-list";

const postsPerPage = 5;

let currentChannelId, currentEventUpdate;
const MySaves = () => {
  const { t } = useTranslation();
  let { channelSaveList, channelSaveCount, eventUpdate } = useSelector(
    (state) => state.mySaveReducer
  );
  const dispatch = useDispatch();
  const channelDetails = useSelector((state) => state.channelDetails);
  const showMore = useSelector((state) => state.mySaveReducer.showMore);
  const channelMembers = useSelector((state) => state.channelMembers.members);
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const [isForwarded, setIsForwarded] = useState(false);

  useEffect(() => {
    if (!(currentChannelId && currentChannelId === channelDetails.id)) {
      currentChannelId = channelDetails.id;
      let queryParams = {
        channelId: channelDetails.id,
        offset: 0,
        count: postsPerPage,
      };
      dispatch(fetchSaveDetails(queryParams));
    }
  }, [channelDetails.id]);

  useEffect(() => {
    if (
      !(currentEventUpdate && currentEventUpdate === eventUpdate) &&
      eventUpdate
    ) {
      currentEventUpdate = eventUpdate;
      let queryParams = {
        channelId: channelDetails.id,
        offset: 0,
        count: channelSaveList ? channelSaveList.length + 1 : postsPerPage,
      };
      dispatch(fetchSaveDetails(queryParams));
    }
  }, [eventUpdate]);

  const handleShowMorePosts = () => {
    if (
      !(channelSaveList === null || channelSaveList.length >= channelSaveCount)
    ) {
      let size = channelSaveList ? channelSaveList.length : 0;
      let queryParams = {
        channelId: channelDetails.id,
        offset: 0,
        count: size + postsPerPage,
      };
      dispatch(fetchSaveDetails(queryParams));
    }
  };

  return (
    <div className="sidebar-container-wrapper w-100 border-top">
      {channelSaveList ? (
        channelSaveList.length > 0 ? (
          <>
            {channelSaveList &&
              channelSaveList.map((post) => {
                let postContent = JSON.parse(post.contents);
                if (postContent?.task?.taskStatus && post?.taskStatus) {
                  postContent.task.taskStatus = post.taskStatus;
                }
                let assigneeUser = channelMembers?.filter(
                  (member) => member.id === postContent?.task?.taskAssignee
                );
                if (assigneeUser && assigneeUser.length === 0) {
                  if (post?.taskAssignee) {
                    assigneeUser = channelMembers?.filter(
                      (member) => member.id === post?.taskAssignee
                    );
                  }
                }
                let currentUserIdFlag = currentUserId === post.userId;
                if (post?.fwd_post_id && post?.channel_id) {
                  dispatch(
                    fetchForwardDetailsById({
                      postId: post.fwd_post_id,
                      channelId: post.channel_id,
                    })
                  );
                }

                return (
                  <SummaryPostList
                    blockType={"SAVES"}
                    currentUserIdFlag={currentUserIdFlag}
                    el={post}
                    postContent={postContent}
                    taskSequenceId={post?.taskSequenceId}
                    assigneeUser={assigneeUser}
                    isForwarded={isForwarded}
                    key={`summary-item-${post.post_id}`}
                  />
                );
              })}
          </>
        ) : (
          <div className="w-100 text-center no-data">
            <h5 className="w-100 text-center mt-4">{t("file:loading")}</h5>
          </div>
        )
      ) : (
        <div className="w-100 text-center no-data">
          <h5>{t("file:no.updates")}</h5>
          <p>{t("file:my.saves:my.saves.reference")}</p>
        </div>
      )}
      {showMore && (
        <div class="col-12 p-0 pt-3 text-center">
          <TextLink
            to={"#"}
            default={true}
            underline={`true`}
            small={`true`}
            onClick={handleShowMorePosts}
          >
            {t("more")}
          </TextLink>
        </div>
      )}
    </div>
  );
};
export default MySaves;
