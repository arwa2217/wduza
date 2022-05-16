import React, {useState, useEffect, useRef} from "react";
import ScriptWindow from "../outlook-mail-post-editor/script-window";
import { useDispatch, useSelector } from "react-redux";
import { uniqueID } from "../../utilities/utils";
import {
  appendMessageToChannels,
  postMessageToServer,
} from "../../store/actions/channelMessagesAction";
import MessageType from "../../props/message-types";
import FileAttachmentService from "../../services/file-attachment-service";

import services from "../../outlook/apiService";
import {PermissionConstants} from "../../constants/permission-constants";
import {useTranslation} from "react-i18next";

function MessagePost(props) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.AuthReducer.user);
  const file = useRef(null)
  const {editor, attachments,} = props;
  const [attachmentsForward, setAttachmentsForward] = useState(attachments);

  const dispatch = useDispatch();
  const isOutLookForward = true;
  const createPost = (msgValue) => {
    return {
      createdAt: new Date().getTime(),
      id: uniqueID(),
      content: msgValue,
    };
  };
  useEffect(() => {
    setAttachmentsForward(attachments)
  }, [attachments.length])

  const createPostRequest = (postValue, fileId) => {
    const isObjectEmpty = true
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
      task: { },
      forwardedPost: {  },
      fileId: "",
      fileListIDs: fileId ? fileId.map((re) => re.fileId) : [],
      mentions: [],
    };
  };

  const callDispatch = (message, postRequest) => {
    dispatch(appendMessageToChannels(props.channel.id, message, props.parentPostId, isOutLookForward));
    dispatch(postMessageToServer(postRequest, !props.post && !props.parentPostId, props.parentPostId, dispatch, isOutLookForward));
  }
  const uploadFileToMNL = async (file) => {
    let fileId = {}
    const fileName = undefined
    await FileAttachmentService.uploadMetaData(
        file,
        fileName,
        props.channel.id,
        PermissionConstants(t).DOWNLOAD_ENUM,
        PermissionConstants(t).DOWNLOAD_ENUM,
        PermissionConstants(t).DOWNLOAD_ENUM
    )
        .then((response) => {
          fileId = {fileId: response.data.data.fileId}
          FileAttachmentService.uploadFile(
              file,
              fileName,
              response.data.data.fileId
          )
              .catch((error) => {
                console.error(error);
              });
        })
        .catch((error) => {
          console.error(error);
        });
    return fileId
  }

  function dataURLtoFile(dataUrl, filename) {
    let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }
  const uploadToMonoly = async (attachmentsForward) => {
    let fileIds = []
    for (const item of attachmentsForward) {
      const blob = await services.downloadAttachments(item.mailId, item.id);
      const fileName = item.name
      const fileType = item.contentType
      var file = dataURLtoFile(`data:${fileType};base64,${blob.contentBytes}`,fileName);
      const fileId = await uploadFileToMNL(file)
      fileIds.push(fileId)

    }
    return fileIds

  };
  const onMsgSend = async (msgValue, attachmentsForward = []) => {
    let fileIds = []
    if (attachmentsForward.length){
      fileIds = await uploadToMonoly(attachmentsForward)
    }
    const message = null;
    const postValue = createPost(msgValue);
    const postRequest = createPostRequest(postValue, fileIds);
    callDispatch(message, postRequest);
    props.hideModal()
  }
  return (
      <div>
        <ScriptWindow
            key={"editor"}
            isOutLookForward={true}
            classNameToolbar={'d-none'}
            onMsgSend={onMsgSend}
            postContent={props.post}
            refscriptWindowSendButton={props.refscriptWindowSendButton}
            editor={editor}
            attachmentsForward={attachmentsForward}
            setAttachmentsForward={setAttachmentsForward}
        />
      </div>
  );
}

export default MessagePost;
