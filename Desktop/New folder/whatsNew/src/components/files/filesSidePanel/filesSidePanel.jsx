import React, { useState, useEffect } from "react";
import "./filesSidePanel.css";
import RedirectIcon from "../../../assets/icons/redirect-icon.svg";
import PostProfilePicture from "../postProfilePicture/postProfilePicture";
import { useDispatch, useSelector } from "react-redux";
import File from "../file";
import FileActivity from "../fileActivity/fileActivity";
import FileSidePanelTabs from "../fileSidePanelTabs/fileSidePanelTabs";
import PostHeader from "../postHeader/postHeader";
import { requestOpenReplyPost } from "../../../store/actions/PostReplyActions";
import CommonUtils from "../../utils/common-utils";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { useTranslation } from "react-i18next";
import PostMsgView from "../../post-view/post-msg-view/post-msg-view";

function FilesSidePanel(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.AuthReducer.user.id);
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const activeSelectedFile = useSelector(
    (state) => state.config.activeSelectedFile
  );
  const activeSelectedFileId = useSelector(
    (state) => state.config.activeSelectedFileId
  );

  const [currentFileDetails, setCurrentFileDetails] = useState([]);
  const [currentUserInfo, setCurrentUserInfo] = useState([]);
  // const isUserPost = PostUtils.isUserPost(messageDetails?.post);
  // const isTaskPost = PostUtils.isTaskPost(messageDetails?.post);

  let messageDetails = useSelector(
    (state) => state.mainFilesReducer.summaryFileDetails?.result
  );

  let queryUserType = useSelector(
    (state) => state.mainFilesReducer.queryUserType
  );
  let forwardPost = useSelector(
    (state) => state.mainFilesReducer.fetchedForwardPost
  );
  const folderId = useSelector(
    (state) => state.mainFilesReducer.summaryFileDetails?.folderId
  );
  let fileStats =
    currentFileDetails?.length > 0 && currentFileDetails[0].fileDLStats.stats;

  let { intPerm, intPermOOO, extPerm, fileForwardDisabled } =
    currentFileDetails?.length > 0 && currentFileDetails[0];
  let { viewedBySelf, downloadedBySelf, forwardedBySelf, sharedBySelf } =
    activeSelectedFile;
  let viewCount = !fileStats
    ? 0
    : fileStats.find((el) => el.type === "VIEWED").total;
  let downloadCount = !fileStats
    ? 0
    : fileStats.find((el) => el.type === "DOWNLOADED").total;
  let forwardCount = !fileStats
    ? 0
    : fileStats.find((el) => el.type === "FORWARDED").total;
  let sharedCount = !fileStats
    ? 0
    : fileStats.find((el) => el.type === "SHARED").total;

  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const folderList = useSelector((state) => state.folderReducer.folderList);
  let selectedDiscussion = channelList?.filter(
    (channelItem) => channelItem.id === messageDetails?.channelId
  );
  let selectedFolder = folderList?.filter(
    (folderItem) => folderItem.folderId === folderId
  );
  const reactionInfoVal =
    messageDetails?.reactions?.reactionStats?.Reactions?.filter(
      (item) =>
        item.type === "CHECKED" || item.type === "UP" || item.type === "DOWN"
    );

  const checkedMemberList =
    reactionInfoVal?.length > 0 ? reactionInfoVal[0].users : [];
  const upMemberList =
    reactionInfoVal?.length > 0 ? reactionInfoVal[1].users : [];
  const downMemberList =
    reactionInfoVal?.length > 0 ? reactionInfoVal[2].users : [];

  let userId = currentUser.id;

  let isForwardOwner =
    messageDetails?.fwdStats &&
    messageDetails?.fwdStats.forwards &&
    messageDetails?.fwdStats.forwards.filter((el) => el.fwdByUserID === userId)
      .length > 0;

  let isOwner =
    checkedMemberList &&
    checkedMemberList.some(function (el) {
      return el.userId === userId;
    });
  let isUpUser =
    upMemberList &&
    upMemberList.some(function (el) {
      return el.userId === userId;
    });
  let isDownUser =
    downMemberList &&
    downMemberList.some(function (el) {
      return el.userId === userId;
    });

  const handleCommentClick = (e) => {
    e.preventDefault();

    const post = messageDetails?.post;
    if (!post) {
      return;
    }
  };

  const getLatestTag = (tagArray) => {
    let time = 0;
    let tagName = "";
    tagArray.map((tag) => {
      if (new Date(tag.createdAt).getTime() > time) {
        tagName = tag.tagName;
        time = new Date(tag.createdAt).getTime();
      }
    });

    return tagName;
  };
  useEffect(() => {
    const userData =
      globalMembersList &&
      globalMembersList.length > 0 &&
      globalMembersList.filter((member) => {
        return member.id === messageDetails?.user?.id;
      });
    setCurrentUserInfo(userData);
  }, [messageDetails]);
  useEffect(() => {
    let currentFileList =
      messageDetails?.fileList?.length &&
      messageDetails?.fileList.filter((item) => {
        let itemFileId = `${item.fileId}-${folderId ? folderId : ""}-${
          item.channelId ? item.channelId : ""
        }-${item.postId ? item.postId : ""}`;
        return itemFileId === activeSelectedFileId;
      });
    if (forwardPost?.post?.id) {
      currentFileList =
        forwardPost?.fileList?.length &&
        forwardPost?.fileList.filter((item) => {
          let itemFileId = `${item.fileId}`;
          return itemFileId === activeSelectedFileId.split("-")[0];
        });
    }
    setCurrentFileDetails(
      currentFileList?.length
        ? [
            ...currentFileList.map((i) => ({
              ...i,
              folderId,
            })),
          ]
        : []
    );
  }, [messageDetails, forwardPost]);

  const redirectToPost = (contents) => {
    let data;
    if (contents && contents.id) {
      data = contents;
      if (data.id && data.channelId && data.post && data.post?.id) {
        let postId = data
          ? data?.parentId
            ? data?.parentId
            : data?.post?.id
          : "";
        let childPostId = data ? (data?.parentId ? data?.post?.id : "") : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          "",
          "saves",
          "saves",
          data.channelId,
          postId,
          childPostId,
          dispatch
        );
      }
    } else {
      dispatch(showToast(t("files:redirection.fail")), 3000);
    }
  };

  return messageDetails ? (
    <div className="files-side-panel">
      <div className="side-panel">
        <div className="discussion-info-main">
          <div>
            <div className="discussion-name">
              {selectedDiscussion.length > 0
                ? selectedDiscussion[0].name
                : selectedFolder.length > 0
                ? selectedFolder[0].folderName
                : t("discussion:name.label")}
            </div>
            <div className="discussion-desc">
              {selectedDiscussion.length > 0
                ? selectedDiscussion[0].description
                : selectedFolder.length > 0
                ? selectedFolder[0].description
                : ""}
            </div>
          </div>
          <div>
            <img
              src={RedirectIcon}
              onClick={() => redirectToPost(messageDetails)}
              alt=""
            />
          </div>
        </div>
        <div className="post-details-wrapper">
          <div
            className="post post-details"
            // style={{ maxHeight: "344px", overflowY: "auto" }}
          >
            <div className="post__header profile-wrapper">
              <PostProfilePicture
                post={messageDetails?.post}
                src={currentUserInfo[0]?.userImg}
                user={currentUserInfo[0]}
                showNameOnly={false}
                isOwner={currentUser.id === currentUserInfo[0]?.id}
              />
            </div>
            <PostHeader
              //fwdUserProfileImage={}
              fwdPostStatus={messageDetails?.fwdStats}
              postInfo={messageDetails?.postInfo}
              post={messageDetails?.post}
              handleCommentClick={handleCommentClick}
              // handleDropdownOpened={handleDropdownOpened}
              user={messageDetails?.user}
              currentUser={messageDetails?.currentUser}
              src={messageDetails?.user.userImg}
              hover={false}
              tagInfo={messageDetails?.tagInfo}
              reactions={messageDetails?.reactions}
              savedPost={messageDetails?.savedPost}
              // isUserPost={isUserPost}
              // isTaskPost={isTaskPost}
              hasCheckedReaction={false}
              hasDOWNReaction={false}
              hasUPReaction={false}
              isOwner={currentUser.id === messageDetails?.user?.id}
              isUpUser={isUpUser}
              isDownUser={isDownUser}
              getLatestTag={getLatestTag}
              members={messageDetails?.members}
              isHiddenPost={messageDetails?.isHiddenPost}
              homeFlag={
                messageDetails?.homeFlag ? messageDetails?.homeFlag : ""
              }
              postForwardFlag={!!messageDetails?.postForwardFlag}
              taskInfo={messageDetails?.taskInfo}
              globalSearch={
                messageDetails?.globalSearch
                  ? messageDetails?.globalSearch
                  : false
              }
              isForwardOwner={isForwardOwner}
              toggleUnreadMessageFlag={messageDetails?.toggleUnreadMessageFlag}
              forwardCount={messageDetails?.fwdStats?.total}
            />
            <PostMsgView
              addStyle={{ padding: "0px", position: "initial" }}
              post={messageDetails?.post}
              userData={messageDetails?.user}
              handleCommentClick={undefined}
              fileList={[]}
              userName={messageDetails?.user?.displayName}
              currentUser={currentUser}
              tagInfo={messageDetails?.tagInfo ? messageDetails?.tagInfo : []}
              isReply={false}
              isEmbeddedLink={false}
              embeddedLinkData={undefined}
              channelMembers={globalMembersList}
              isPostOwner={currentUser.id === messageDetails?.user?.id}
              isHiddenPost={messageDetails?.isHidden}
              homeFlag={false}
              taskInfo={messageDetails?.taskInfo}
              isTaskPost={messageDetails?.post?.type === "TASK"}
              taskStatus={messageDetails?.task?.taskStatus}
              mainPostId={messageDetails?.post?.id}
              message={forwardPost}
              channelId={messageDetails?.channelId}
              members={globalMembersList}
              CheckRedirectionStatus={undefined}
              isFileSidePanel={true}
            />
            {forwardPost?.post?.id ? (
              <PostMsgView
                addStyle={{ padding: "0px", position: "initial" }}
                post={messageDetails?.post}
                userData={messageDetails?.user}
                handleCommentClick={undefined}
                fileList={[]}
                userName={messageDetails?.user?.displayName}
                currentUser={currentUser}
                tagInfo={messageDetails?.tagInfo ? messageDetails?.tagInfo : []}
                isReply={false}
                isEmbeddedLink={false}
                embeddedLinkData={undefined}
                channelMembers={globalMembersList}
                isPostOwner={currentUser.id === messageDetails?.user?.id}
                isHiddenPost={messageDetails?.isHidden}
                homeFlag={false}
                taskInfo={messageDetails?.taskInfo}
                isTaskPost={messageDetails?.post?.type === "TASK"}
                taskStatus={messageDetails?.task?.taskStatus}
                postForwardFlag={true}
                isPostToTask={
                  forwardPost?.post?.id
                  // messageDetails?.forwardedPost?.id &&
                  // messageDetails?.taskInfo &&
                  // messageDetails?.post.content === ""
                }
                forwardedPostId={forwardPost?.post?.id}
                mainPostId={messageDetails?.post?.id}
                message={forwardPost}
                channelId={messageDetails?.channelId}
                members={globalMembersList}
                CheckRedirectionStatus={undefined}
                isFileSidePanel={true}
              />
            ) : (
              ""
            )}
            <File
              channelFilesList={currentFileDetails}
              queryUserType={queryUserType}
              internalPermission={intPerm}
              internalPermissionOoo={intPermOOO}
              externalPermission={extPerm}
              fileForwardDisabled={fileForwardDisabled}
            />
            <div style={{ padding: "10px 0" }}>
              <FileActivity
                fileInfo={currentFileDetails}
                currentUser={currentUser}
                forwarded={forwardCount}
                shared={sharedCount}
                downloaded={downloadCount}
                viewed={viewCount}
                queryUserType={queryUserType}
                internalPermission={intPerm}
                internalPermissionOoo={intPermOOO}
                externalPermission={extPerm}
                fileForwardDisabled={fileForwardDisabled}
                viewedBySelf={viewedBySelf}
                downloadedBySelf={downloadedBySelf}
                forwardedBySelf={forwardedBySelf}
                sharedBySelf={sharedBySelf}
              />
            </div>
          </div>

          <div className="post-stats">
            <FileSidePanelTabs userInfo={currentFileDetails} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <span />
  );
}
// document.getElementsByClassName('post-details')[0].getBoundingClientRect();
export default FilesSidePanel;
