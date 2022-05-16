import React, { useEffect, useRef, useState } from "react";
import ScriptWindow from "../script-window/script-window";
import { useDispatch, useSelector } from "react-redux";
import { uniqueID } from "../../utilities/utils";
import {
  appendMessageToChannels,
  postMessageToServer,
  focusOnPostActions,
} from "../../store/actions/channelMessagesAction";
import MessageType from "../../props/message-types";
import DefaultUser from "../../assets/icons/default-user.svg";
import { PostEditEndAction } from "../../store/actions/edit-post-actions";
import { store } from "../../store/store";

import { RESET_EMBEDDED_LINK_DATA } from "../../store/actionTypes/channelMessagesTypes";

function MessagePost(props) {
  const channelMessages = store.getState().channelMessages.messages || [];
  const channelLastPost = channelMessages[channelMessages.length - 1];
  const messageRef = useRef();
  const channelSecondLastPost =
    channelMessages.length > 1
      ? channelMessages[channelMessages.length - 2]
      : channelMessages[channelMessages.length - 1];
  const user = useSelector((state) => state.AuthReducer.user);

  // const [replyValue, setReplyValue] = useState(
  //   props.post ? props.post.post.content : ""
  // );
  const dispatch = useDispatch();
  const createPost = (msgValue) => {
    return {
      createdAt: new Date().getTime(),
      id: uniqueID(),
      content: msgValue,
    };
  };
  function updatePost(msgValue) {
    props.post.post.updatedAt = new Date().getTime();
    props.post.post.content = msgValue;
  }

  useEffect(() => {
    if (
      props.post &&
      (props.post.post.id === channelLastPost.post.id ||
        props.post.post.id === channelSecondLastPost.post.id)
    ) {
      dispatch(focusOnPostActions(props.channel.id, props.post.post.id));
    }
  }, []);
  /*const handleClickOutSide = (event) => {
    //const { target } = event;
    //props.setMinEditor(!messageRef?.current?.contains(target));
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutSide);
    return () => {
      document.removeEventListener("click", handleClickOutSide);
    };
  }, []);*/

  useEffect(() => {
    //Do Nothing
  }, [props.postInfo]);

  const createAttachment = (
    fileId,
    files,
    internalPermission,
    externalPermission,
    fileName
  ) => {
    let fileData = [];
    files.forEach((el) => {
      let singleFileName = fileName.find((fileN) => {
        return fileN.id === el.id;
      });
      let newFileObj = {
        fileId: el.id,
        fileName:
          fileName.length > 0
            ? singleFileName?.names.oldName === el.file.name
              ? singleFileName?.names.newName
              : el.file.name
            : el.file.name,
        mimeType: el.file.type,
        fileSize: el.file.size,
        extPerm: externalPermission,
        intPerm: internalPermission,
        status: "INIT",
        userId: user.id,
      };
      fileData.push(newFileObj);
    });
    return fileData;

    //  do not remove

    // var file = files[0].file;
    // return {
    //   fileId: fileId,
    //   fileName:
    //     fileName && fileName.oldName === file.name
    //       ? fileName.newName
    //       : file.name,
    //   mimeType: file.type,
    //   fileSize: file.size,
    //   extPerm: externalPermission,
    //   intPerm: internalPermission,
    //   status: "INIT",
    //   userId: user.id,
    // };
  };

  const setChannelMessage = (postValue, fileInfo) => {
    if (fileInfo) {
      return {
        post: postValue,
        src: user.userImg ? user.userImg : DefaultUser,
        user: {
          displayName: user.screenName,
          id: user.id,
          userImg: user.userImg ? user.userImg : DefaultUser,
        },
        fileInfo: fileInfo,
      };
    } else {
      return {
        post: postValue,
        src: user.userImg ? user.userImg : DefaultUser,
        user: {
          displayName: user.screenName,
          id: user.id,
          userImg: user.userImg ? user.userImg : DefaultUser,
        },
      };
    }
  };

  const createPostRequest = (
    postValue,
    mentionIds,
    fileId,
    taskObject,
    forwardedPost
  ) => {
    // const fileList = fileId.map(re => re.fileId);
    const isObjectEmpty = Object.keys(taskObject).length === 0;

    return {
      channelId: props.channel.id,
      channelType: props.channel.type,
      postType: isObjectEmpty ? MessageType.MESSAGE : MessageType.TASK,
      post: {
        id: postValue.id,
        content: postValue.content,
        createdAt: postValue.createdAt,
        type: isObjectEmpty ? MessageType.MESSAGE : MessageType.TASK,
      },
      reply: {
        isReply: false,
        broadcastReply: false,
        parentId: null,
      },
      userId: user.id,
      task: { ...taskObject },
      forwardedPost: { ...forwardedPost },
      fileId: "",
      fileListIDs: props.fileListIDs
        ? props.fileListIDs
        : fileId
        ? fileId.map((re) => re.fileId)
        : [],
      mentions: mentionIds,
      fileForwarding: props.fileForwarding,
      folderId: props.folderId,
    };
  };

  const updatePostRequest = (
    post,
    mentionIds,
    fileId,
    taskObject,
    forwardedPost
  ) => {
    const isObjectEmpty = taskObject?.taskAssignee;
    post.channelId = props.channel.id;
    post.channelType = props.channel.type;
    post.userId = props.post.user.id;
    post.postType = isObjectEmpty ? MessageType.TASK : MessageType.MESSAGE;
    post.post.type = isObjectEmpty ? MessageType.TASK : MessageType.MESSAGE;
    post.post.edited = true;
    // post.fileId = fileId ? fileId : null;
    post.fileId = "";
    post.fileListIDs = props.post.fileList
      ? props.post.fileList.length > 0
        ? props.post.fileList.map((re) => re.fileId)
        : []
      : [];
    post.mentions = mentionIds;
    post.task = { ...taskObject };
    post.forwardedPost = { ...forwardedPost };
    return post;
  };

  function callDispatch(message, postRequest) {
    if (!props.isPostForwardModal) {
      if (!props.post) {
        if (props.parentPostId === undefined || props.parentPostId === "") {
          dispatch(
            appendMessageToChannels(
              props.channel.id,
              message,
              props.postInfo?.parentPostContent?.id
                ? props.postInfo.parentPostContent.id
                : props.parentPostId
            )
          );
        }
      } else {
        dispatch(PostEditEndAction());
        dispatch({
          type: RESET_EMBEDDED_LINK_DATA,
          payload: {
            postId: props.post.post.id,
          },
        });
      }
    }
    dispatch(
      postMessageToServer(
        postRequest,
        !props.post && !props.parentPostId,
        props.postInfo?.parentPostContent?.id
          ? props.postInfo.parentPostContent.id
          : props.parentPostId,
        dispatch
      )
    );
  }

  function onMsgSend(
    msgValue,
    mentionIds,
    fileId,
    files,
    internalPermission,
    externalPermission,
    fileName
  ) {
    let forwardedPost = {};
    if (props.isPostForwardModal || props.isPostToTask) {
      forwardedPost = {
        post: {
          id: props.fwdPost.post.id,
        },
        //"fwdPostContent": props.fwdPost.post.content,
        userId: props.creatorId,
        channelId: props.channelId,
      };
    }

    if (
      Object.keys(forwardedPost).length === 0 &&
      props.post &&
      props.post.forwardedPost
    ) {
      forwardedPost = props.post.forwardedPost;
    }
    let taskObject = {};
    if (props.isTaskModal) {
      let startEpoch = new Date(props.taskStartTime);
      startEpoch = startEpoch.getTime();

      let endEpoch = new Date(props.taskStopTime);
      endEpoch = endEpoch.getTime();

      taskObject.taskAssignee = props.taskAssigneeId;
      taskObject.taskTitle = props.taskTitle;
      taskObject.taskStartTime = startEpoch;
      taskObject.taskStopTime = endEpoch;
      taskObject.isApprovalRequired = false;
      taskObject.taskStatus = props.taskStatus;
    }

    let distinctMentionIds = [];
    // eslint-disable-next-line no-unused-expressions
    mentionIds?.map((item) => {
      if (distinctMentionIds.indexOf(item) === -1) {
        distinctMentionIds.push(item);
      }
      return item;
    });
    mentionIds = distinctMentionIds;
    let postValue = null;
    let message = null;
    let postRequest = null;
    let fileInfo = null;
    if (props.post) {
      updatePost(msgValue);
    } else {
      postValue = createPost(msgValue);
    }
    if (fileId && fileId.length > 0) {

      fileInfo = createAttachment(
        fileId,
        files,
        internalPermission,
        externalPermission,
        fileName
      );
      message = setChannelMessage(postValue, fileInfo);
      postRequest = props.post
        ? updatePostRequest(
            props.post,
            mentionIds,
            fileId,
            taskObject,
            forwardedPost
          )
        : createPostRequest(
            postValue,
            mentionIds,
            fileId,
            taskObject,
            forwardedPost
          );
    
    } else {

      message = setChannelMessage(postValue);
      postRequest = props.post
        ? updatePostRequest(
            props.post,
            mentionIds,
            [],
            taskObject,
            forwardedPost
          )
        : createPostRequest(
            postValue,
            mentionIds,
            [],
            taskObject,
            forwardedPost
          );
    
    }
    if (props.isPostToTask) {
      postRequest.post.content = "";
    }
    if (props.postInfo?.parentPostContent?.id || props.parentPostId) {
      postRequest.reply = {
        isReply: true,
        parentId: props.postInfo?.parentPostContent?.id
          ? props.postInfo.parentPostContent.id
          : props.parentPostId,
      };
    }

    //if(!props.post){
    //dispatch(channelMessagesActions(props.channel.id, 0, 0, 0, () => {setTimeout(()=>{callDispatch(message, postRequest)},1000)}, true));
    //}else{
    callDispatch(message, postRequest);
    //}
  }
  return (
    <ScriptWindow
      channel={props.channel}
      ref={messageRef}
      channelMembers={props.channelMembers}
      onMsgSend={onMsgSend}
      channelId={props.channelId}
      title={props.title}
      postContent={props.post ? props.post.post.content : ""}
      isEditing={props.isEditing}
      userId={user.id}
      userType={user.type}
      isReply={props.openReplyView}
      isTaskModal={!!props.isTaskModal}
      isPostForwardModal={!!props.isPostForwardModal}
      taskOnToolbar={!!props.taskOnToolbar}
      refscriptWindowSendButton={props.refscriptWindowSendButton}
      refAttachmentFileButton={props.refAttachmentFileButton}
      onTaskSendClick={props.onTaskSendClick}
      parentPostId={props.parentPostId}
      isFileForwardModal={!!props.isFileForwardModal}
      isShareFilesModal={!!props.isShareFilesModal}
      post={props?.post}
      postInfo={props?.postInfo}
      minEditor={props.minEditor}
      isEsignForwarding={props.isEsignForwarding}
      updateShowReplies={props.updateShowReplies}
    />
  );
}

export default MessagePost;
