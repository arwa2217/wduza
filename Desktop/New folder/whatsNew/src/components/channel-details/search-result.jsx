import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchResultView from "./search-result-view";
import { TextLink } from "../shared/styles/mainframe.style";
import CommonUtils from "../utils/common-utils";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import { getSearchResultWithFilter } from "../../store/actions/channelActions";
import { fetchForwardDetailsById } from "../../store/actions/post-forward-action";
import { useTranslation } from "react-i18next";
import { getHighlightedHtml } from "../utils/post-utils";
const SearchResult = () => {
  const { t } = useTranslation();
  let getSearchPostDetails = useSelector(
    (state) => state.ChannelReducer.getSearchPostDetails
  );
  let fetchedSearchResult = useSelector(
    (state) => state.ChannelReducer.fetchedSearchResult
  );
  const channelMembers = useSelector((state) => state.channelMembers.members);

  const searchObject = useSelector(
    (state) => state.ChannelReducer.currentSearchFilter
  );
  const offset = useSelector((state) => state.ChannelReducer.fetchedOffset);
  let size = 10;

  let postSearchCount = useSelector((state) => state.ChannelReducer.totalCount);
  let terms = useSelector((state) => state.ChannelReducer?.terms);
  const dispatch = useDispatch();
  const channelDetails = useSelector((state) => state.channelDetails);
  function redirectToPost(contents) {
    let data;
    if (contents) {
      data = contents;
      if (data.channelId && data.channelName && data.post && data.post.id) {
        let postId = data
          ? data?.parentId
            ? data?.parentId
            : data?.post?.id
          : "";
        let childPostId = data ? (data?.parentId ? data?.post?.id : "") : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          data.channelName,
          "search",
          "search",
          data.channelId,
          postId,
          childPostId,
          dispatch
        );
      }
    }
  }

  const handleShowMorePosts = () => {
    if (
      !(
        getSearchPostDetails === null ||
        getSearchPostDetails.length >= postSearchCount
      )
    ) {
      if (searchObject && Object.keys(searchObject).length !== 0) {
        console.log("searchObject", searchObject);
        dispatch(
          getSearchResultWithFilter(
            searchObject.value,
            offset === undefined ? 1 : Math.ceil(offset / size),
            size === undefined ? 10 : size,
            channelDetails?.id === undefined ? "" : channelDetails.id,
            false,
            searchObject.saveFilter,
            searchObject.tagFilter,
            searchObject.fileFilter,
            searchObject.taskFilter,
            searchObject.authorValue.id ? searchObject.authorValue.id : "",
            searchObject.mentionedValue.id
              ? searchObject.mentionedValue.id
              : "",
            "",
            ""
          )
        );
      }
    }
  };
  return (
    <div className="sidebar-container-wrapper w-100 border-top">
      {getSearchPostDetails && getSearchPostDetails.length > 0 ? (
        getSearchPostDetails.filter(
          (item) => item.channel_id === channelDetails.id
        ).length > 0 ? (
          getSearchPostDetails
            .filter((item) => item.channel_id === channelDetails.id)
            .map((el) => {
              let assigneeUser = channelMembers?.filter(
                (member) =>
                  member.id === el.original_content?.task?.taskAssignee
              );
              if (
                el.original_content?.forwardedPost?.post?.id &&
                el.original_content?.post?.id
              ) {
                dispatch(
                  fetchForwardDetailsById({
                    postId: el.original_content?.forwardedPost?.post?.id,
                    channelId: el.original_content?.post?.id,
                  })
                );
              }
              return (
                <SearchResultView
                  assigneeUser={assigneeUser}
                  blockType={el.original_content?.post_type}
                  el={{
                    ...el,
                    original_content: {
                      ...el.original_content,
                      post: {
                        ...el?.original_content?.post,
                        content: getHighlightedHtml(
                          terms,
                          el?.original_content?.post.content
                        ),
                        user: {
                          ...el?.original_content?.user,
                          displayName: getHighlightedHtml(
                            terms,
                            el?.original_content?.user.displayName
                          ),
                        },
                      },
                    },
                    assignee_name: getHighlightedHtml(terms, el?.assignee_name),
                    username: getHighlightedHtml(terms, el?.username),
                  }}
                  postContent={{
                    ...el.original_content,
                    post: {
                      ...el?.original_content?.post,
                      content: getHighlightedHtml(
                        terms,
                        el?.original_content?.post.content
                      ),
                      user: {
                        ...el?.original_content?.user,
                        displayName: getHighlightedHtml(
                          terms,
                          el?.original_content?.user.displayName
                        ),
                      },
                    },
                  }}
                  postRedirection={redirectToPost}
                  isForwarded={false}
                  key={`${el.original_content?.post?.id}`}
                  terms={terms}
                />
              );
            })
        ) : (
          <div className="w-100 text-center no-data">
            <h5>
              {t("discussion.summary:search.panel:no.search.results.for.the", {
                terms: `"${terms}"`,
              })}
            </h5>
          </div>
        )
      ) : fetchedSearchResult ? (
        <div className="w-100 text-center no-data">
          <h5>
            {t("discussion.summary:search.panel:no.search.results.for.the", {
              terms: `"${terms}"`,
            })}
          </h5>
        </div>
      ) : (
        <div className="w-100 text-center no-data">
          <h5> {t("discussion.summary:search.panel:no.search.result")}</h5>
          <p>{t("discussion.summary:search.panel:try.search.on.search.bar")}</p>
        </div>
      )}

      {getSearchPostDetails &&
        getSearchPostDetails.length > 0 &&
        getSearchPostDetails.length < postSearchCount && (
          <div className="col-12 p-0 pt-3 text-center">
            <TextLink
              to="#"
              default={true}
              underline={`true`}
              onClick={handleShowMorePosts}
              disabled={
                getSearchPostDetails === null ||
                getSearchPostDetails.length >= postSearchCount
              }
            >
              {t("more")}
            </TextLink>
          </div>
        )}
    </div>
  );
};
export default SearchResult;
