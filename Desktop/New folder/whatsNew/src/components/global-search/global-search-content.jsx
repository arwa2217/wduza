import React, { useState, Fragment, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GlobalSearchInput from "./global-search-input";
import ContactsPanel from "../user-home/contacts-panel";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { TextLink } from "../shared/styles/mainframe.style";
import { requestOpenReplyPost } from "../../store/actions/PostReplyActions";
import CommonUtils from "../utils/common-utils";
import { GlobalSearchResultWrapper } from "./global-search-style";
import { getSearchResultWithFilter } from "../../store/actions/channelActions";
import Post from "../post-view/post";
import { getHighlightedHtml } from "../utils/post-utils";
import { getAllUser } from "../../utilities/caching/db-helper";

const GlobalSearchContent = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isEnable, setIsEnable] = useState(false);
  const fetchedSearchResult = useSelector(
    (state) => state.ChannelReducer.fetchedSearchResult
  );
  const getSearchPostDetails = useSelector(
    (state) => state.ChannelReducer.getSearchPostDetails
  );
  const terms = useSelector((state) => state.ChannelReducer?.terms);
  const postSearchCount = useSelector(
    (state) => state.ChannelReducer.totalCount
  );
  const offset = useSelector((state) => state.ChannelReducer.fetchedOffset);
  const searchObject = useSelector(
    (state) => state.ChannelReducer.currentSearchFilter
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    getAllUser().then((res) => {
      var tempMembers = [...members];
      res.map((userData) => {
        if (tempMembers.indexOf(userData) === -1) {
          tempMembers.push(userData.user);
        }
        return true;
      });
      setMembers(tempMembers);
    });
  }, []);

  let size = 20;
  let channelId = undefined;

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
      if (Object.keys(searchObject).length !== 0) {
        dispatch(
          getSearchResultWithFilter(
            searchObject.value,
            offset === undefined ? 1 : Math.ceil(offset / size),
            size === undefined ? 20 : size,
            channelId === undefined ? "" : channelId,
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
    <div
      className="d-flex flex-column w-100 home-content"
      onMouseUp={(e) => {
        if (isEnable) {
          setIsEnable(false);
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
            document.getElementById("right-details").style.width =
              window.innerWidth - pos + "px";
          }
        }
      }}
    >
      <Row className="flex-nowrap flex-row m-0">
        <Col id="left-messagetab" className="message-tab">
          <Row className="m-0">
            <Col
              className="channel-head-wrap-bg m-0 p-0"
              style={{ backgroundColor: "#F8F8F8" }}
            >
              <div style={{ padding: "32px 20px 0px 20px" }}>
                <GlobalSearchInput
                  offset={offset}
                  size={size}
                  channelId={channelId}
                  placeholder={t("global.search:placeholder")}
                />
                {/* <FileSearchInput
                  offset={offset}
                  size={size}
                  channelId={channelId}
                  placeholder={t("global.search:placeholder")}
                /> */}
              </div>
              <GlobalSearchResultWrapper>
                <div className="w-100 mb-0">
                  {getSearchPostDetails && getSearchPostDetails.length > 0 ? (
                    getSearchPostDetails.map((el) => {
                      return (
                        <Fragment key={el.original_content.id}>
                          <div
                            style={{
                              padding: "20px 20px 5px 20px",
                            }}
                          >
                            {el.original_content.channelName}
                          </div>
                          {/* <SearchResultView
                              searchData={el}
                              postRedirection={redirectToPost}
                            /> */}

                          <div
                            onClick={() => {
                              redirectToPost(el.original_content);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                            className="global-search-result-view"
                          >
                            <Post
                              post={{
                                ...el?.original_content?.post,
                                content: getHighlightedHtml(
                                  terms,
                                  el?.original_content?.post.content
                                ),
                              }}
                              homeFlag={true}
                              currentUser={currentUser}
                              user={{
                                ...el?.original_content?.user,
                                displayName: getHighlightedHtml(
                                  terms,
                                  el?.original_content?.user.displayName
                                ),
                              }}
                              tagInfo={el && el.tagInfo ? el.tagInfo : []}
                              reactions={el.reactions ? el.reactions : []}
                              fileList={
                                el?.original_content?.fileList !== undefined &&
                                el?.original_content?.fileList?.map((item) => {
                                  /*item.fileName = getHighlightedHtml(
                                    terms,
                                    item.fileName
                                  );*/
                                  return item;
                                })
                              }
                              isEmbeddedLink={false}
                              // isEmbeddedLink={el?.original_content?.embededlink}
                              embeddedLinkData={
                                Object.values({
                                  ...el?.original_content?.embeddedLinkData,
                                }).length === 0
                                  ? undefined
                                  : Object.values({
                                      ...el?.original_content?.embeddedLinkData,
                                    })
                              }
                              taskInfo={el?.original_content?.task}
                              globalSearch={true}
                              taskStatus={el?.state}
                              members={members}
                            />
                          </div>
                        </Fragment>
                      );
                    })
                  ) : fetchedSearchResult ? (
                    <div className="w-100 text-center no-data">
                      <h5>
                        {t(
                          "discussion.summary:search.panel:no.search.results.for.the",
                          { terms: `"${terms}"` }
                        )}
                      </h5>
                    </div>
                  ) : (
                    <div className="w-100 text-center no-data">
                      <h5> {t("global.search:search.result.appear.here")}</h5>
                      <p>
                        {t(
                          "discussion.summary:search.panel:try.search.on.search.bar"
                        )}
                      </p>
                    </div>
                  )}

                  {getSearchPostDetails &&
                    getSearchPostDetails.length > 0 &&
                    getSearchPostDetails.length < postSearchCount && (
                      <div className="col-12 p-0 pt-3 text-center">
                        <TextLink
                          to={"#"}
                          default={true}
                          underline={`true`}
                          // strong={false}
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
              </GlobalSearchResultWrapper>
            </Col>
          </Row>
        </Col>

        {props.isActive && (
          <div
            onMouseDown={(e) => {
              if (!isEnable) {
                setIsEnable(true);
                e.stopPropagation();
                e.preventDefault();
              }
              return false;
            }}
          >
            <hr className="width-resize-details" />
          </div>
        )}
        {props.isActive && <ContactsPanel />}
      </Row>
    </div>
  );
};

export default GlobalSearchContent;
