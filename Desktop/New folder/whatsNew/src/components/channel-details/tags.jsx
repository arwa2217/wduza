import React, { useEffect, useState } from "react";
import TagFilters from "../tag-filters/tag-filters";
import { fetchTagDetails } from "../../store/actions/tag-actions";
import { useDispatch, useSelector } from "react-redux";
import { TextLink } from "../shared/styles/mainframe.style";
import { useTranslation } from "react-i18next";
import SummaryPostList from "./summary-post-list";
import { fetchForwardDetailsById } from "../../store/actions/post-forward-action";
const postsPerPage = 5;

let currentChannelId, currentEventUpdate;

const Tags = () => {
  const { t } = useTranslation();
  const { channelTagList, channelTagCount, eventUpdate } = useSelector(
    (state) => state.tagReducer
  );
  const dispatch = useDispatch();
  const channelDetails = useSelector((state) => state.channelDetails);
  const channelMembers = useSelector((state) => state.channelMembers.members);
  const activeFilter = useSelector((state) => state.tagReducer.activeTag);
  const showMore = useSelector((state) => state.tagReducer.showMore);
  const currentUserId = useSelector((state) => state.AuthReducer.user.id);
  const [selectedFilter, setSelectedFilter] = useState(activeFilter);
  const [isForwarded, setIsForwarded] = useState(false);

  useEffect(() => {
    if (!(currentChannelId && currentChannelId === channelDetails.id)) {
      currentChannelId = channelDetails.id;
      let queryParams = {
        channelId: channelDetails.id,
        tagName: "All",
        offset: 0,
        count: postsPerPage,
      };
      dispatch(fetchTagDetails(queryParams));
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
        tagName: selectedFilter,
        offset: 0,
        count: channelTagList ? channelTagList.length : postsPerPage,
      };
      dispatch(fetchTagDetails(queryParams));
    }
  }, [eventUpdate]);

  const handleShowMorePosts = (e) => {
    e.preventDefault();
    if (
      !(channelTagList === null || channelTagList.length >= channelTagCount)
    ) {
      let size = channelTagList ? channelTagList.length : 0;
      let queryParams = {
        channelId: channelDetails.id,
        tagName: selectedFilter,
        offset: 0,
        count: size + postsPerPage,
      };
      dispatch(fetchTagDetails(queryParams));
    }
  };

  const onFilterSelect = (selectedValue) => {
    let filter = selectedFilter;
    if (selectedFilter === selectedValue) {
      setSelectedFilter("All");
      filter = "All";
    } else {
      setSelectedFilter(selectedValue);
      filter = selectedValue;
    }
    let requestBody = {
      tagName: filter,
      channelId: channelDetails.id,
      offset: 0,
      count: postsPerPage,
    };
    dispatch(fetchTagDetails(requestBody));
  };

  return (
    <div className="sidebar-container-wrapper w-100 border-top">
      <TagFilters handleClick={onFilterSelect} />
      {channelTagList ? (
        channelTagList.length > 0 ? (
          <>
            {channelTagList.map((post) => {
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
                  blockType={"TAGS"}
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
          <p>{t("file:tags:tag.for.team")}</p>
        </div>
      )}

      {showMore && (
        <div className="col-12 p-0 pt-3 text-center">
          <TextLink
            to="#"
            default={true}
            underline={`true`}
            small={`true`}
            // strong={true}
            onClick={handleShowMorePosts}
            // disabled={
            //   channelTagList === null ||
            //   channelTagList.length >= channelTagCount
            // }
          >
            {t("more")}
          </TextLink>
        </div>
      )}
    </div>
  );
};

export default Tags;
