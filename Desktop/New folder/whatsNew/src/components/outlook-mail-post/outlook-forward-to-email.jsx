import React, { useEffect, useRef, useState } from "react";
import ScriptWindow from "../outlook-mail-post-editor/script-window";
import "./outlook-mail-post.css";
import FormControl from "react-bootstrap/FormControl";
import { emailFormData } from "../../outlook/config";
import { useDispatch, useSelector } from "react-redux";
import {
  focusBcc,
  focusCc,
  focusTo,
  validateEmails,
  getValueToRecipientFromRefs,
  setOptionsReply,
  convertSize,
  convertFileToContentBytes,
  removeElement,
  getDefaultStateNotBcc,
} from "../../utilities/outlook";
import services from "../../outlook/apiService";
import { useTranslation } from "react-i18next";
import ReceiveListSelect from "../outlook-common/receive-list-select";

import Alert from "@material-ui/lab/Alert";
import PostService from "../../services/post-service";
import {
  appendMessageToChannels,
  fetchForwardDetailsById,
  postMessageToServer,
} from "../../store/actions/channelMessagesAction";
import { uniqueID } from "../../utilities/utils";
import MessageType from "../../props/message-types";
import FileAttachmentService from "../../services/file-attachment-service";
import { PermissionConstants } from "../../constants/permission-constants";

const OutlookForwardToEmail = (props) => {
  const {
    postInfo,
    globalMembers,
    hidePopup,
    setIsDisabled,
    postId,
    activeSelectedChannel,
  } = props;
  const [inputReceive, setInputReceive] = useState({ to: "", cc: "" });
  const [defaultOptions, setDefaultOptions] = useState({ to: [], cc: [] });
  const editor = useRef(null);
  const [forwardText, setForwardText] = useState(props.forwardText);
  const [attachmentsForward, setAttachmentsForward] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  //const dispatch = useDispatch();
  //set init value of receiveList is default state...
  const [receiveList, setReceiveList] = useState(getDefaultStateNotBcc());
  const inputReceiveRefs = {
    to: useRef(null),
    cc: useRef(null),
    //bcc: useRef(null),
  };
  const { t } = useTranslation();
  const [subject, setSubject] = useState(`MonolyFW: ${t("outlook.forward.post.to.email")}`);
  const user = useSelector((state) => state.AuthReducer.user);
  useEffect(() => {
    setAttachmentsForward([]);
    if (postInfo?.fileList?.length) {
      const formatFileList = postInfo.fileList.map((file) => {
        return {
          ...file,
          name: file.fileName,
          id: file.fileId,
        };
      });
      setAttachmentsForward(formatFileList);
    }
    const dataSuggest = globalMembers.map((member) => {
      return {
        value: member?.email,
        email: member?.email,
        label: member?.firstName || member?.screenName,
      };
    });
    const updateState = getDefaultStateNotBcc();
    setOptionsReply(updateState, dataSuggest, dataSuggest, dataSuggest);
    setDefaultOptions({
      to: dataSuggest.map((item) => item.value),
      cc: dataSuggest.map((item) => item.value),
      //bcc: dataSuggest.map(item => item.value),
    });

    setReceiveList([...updateState]);
  }, []);

  const isOutLookForward = true;
  const createPost = (msgValue) => {
    return {
      createdAt: new Date().getTime(),
      id: uniqueID(),
      content: msgValue,
    };
  };

  const createPostRequest = (postValue, fileId) => {
    const isObjectEmpty = true;
    return {
      channelId: activeSelectedChannel?.id,
      channelType: activeSelectedChannel?.type,
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
      task: {},
      forwardedPost: {},
      fileId: "",
      fileListIDs: fileId ? fileId.map((re) => re.fileId) : [],
      mentions: [],
    };
  };

  const callDispatch = (message, postRequest) => {
    dispatch(
      appendMessageToChannels(
        activeSelectedChannel?.id,
        message,
        props.parentPostId,
        isOutLookForward
      )
    );
    dispatch(
      postMessageToServer(
        postRequest,
        !props.post && !props.parentPostId,
        props.parentPostId,
        dispatch,
        isOutLookForward
      )
    );
  };

  const onMsgSend = async (content, attachments = []) => {
    emailFormData.message.subject = subject;
    const { to, cc } = inputReceive;
    emailFormData.message.toRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "to",
      to
    );
    emailFormData.message.ccRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "cc",
      cc
    );
    //emailFormData.message.bccRecipients = getValueToRecipientFromRefs(inputReceiveRefs, "bcc", bcc);
    emailFormData.message.attachments = [];
    if (
      emailFormData.message.toRecipients.length === 0 &&
      emailFormData.message.ccRecipients.length === 0
      //emailFormData.message.bccRecipients.length === 0
    ) {
      focusTo();
      setIsDisabled(false);
      return;
    }
    const usersToShare = emailFormData.message.toRecipients.concat(
      emailFormData.message.ccRecipients
    );
    let postIdShare = postId;
    if (!postIdShare) {
      const message = null;
      const postValue = createPost(content);
      const postRequest = createPostRequest(postValue, []);
      callDispatch(message, postRequest);
      postIdShare = postValue.id;
    }
    const dataShare = {
      channelId: activeSelectedChannel?.id,
      postId: postIdShare,
      users: usersToShare.map((item) => item?.emailAddress?.address),
    };

    const isValid = validateEmails(inputReceive);
    if (!isValid) {
      setIsDisabled(false);
      return;
    }
    const maxSize = 3000000;
    let totalSize = 0;
    if (attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        const { fileSize } = attachments[i];
        const bytes = convertSize(fileSize);
        totalSize = totalSize + bytes;
      }
    }
    if (totalSize >= maxSize) {
      setIsDisabled(false);
      return setError(t(`outlook.mail.validate:attach.max.size`));
    }

    const postContent = document.getElementById("post-content");
    if (postContent) {
      const postContentClone = postContent ? postContent.cloneNode(true) : "";
      removeElement(postContentClone, "attachment_wrapper");
      const postContentHtml = postContentClone
        ? postContentClone.innerHTML
        : "";
      emailFormData.message.body.content = content + "<hr/>" + postContentHtml;
    } else {
      emailFormData.message.body.content = content;
    }

    const { newAttachments = [] } = await convertFileToContentBytes(
      attachments
    );
    if (newAttachments.length) {
      emailFormData.message.attachments = newAttachments;
    }
    try {
      //dispatch(setSendEmailType("SEND_EMAIL"));
      const itemAttachment = {
        AttachmentItem: {
          attachmentType: "file",
          name: "flower",
          size: 3483322,
        },
      };

      await services.sendEmail(emailFormData).then(() => {
        //dispatch(setRefreshData(true));
        //dispatch(setSendEmailType(""));
        if (dataShare.users.length && postIdShare) {
          PostService.postShare(dataShare);
        }
        hidePopup();
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleShowMoreReceiveButtons = (value) => {
    const updateReceiveList = [...receiveList];
    const receiveItemIndex = updateReceiveList.findIndex(
      (receive) => receive.label === value
    );
    updateReceiveList[receiveItemIndex].display = true;
    setReceiveList(updateReceiveList);
    if (value.toLowerCase() === "cc") {
      focusCc();
    } else {
      focusBcc();
    }
  };
  const handleHideMoreReceiveButtons = (value) => {
    const updateReceiveList = [...receiveList];
    const receiveItemIndex = updateReceiveList.findIndex(
      (receive) => receive.label === value
    );
    updateReceiveList[receiveItemIndex].display = false;
    setReceiveList(updateReceiveList);
  };

  const receiveButtons = receiveList
    .filter((receive) => !receive.display)
    .map((receive) => receive.label);
  return (
    <div
      className={"receive-container rounded-editor-popup"}
      id="receive-container"
      style={{ display: "block" }}
    >
      <div className="receive-buttons d-flex justify-content-end position-absolute">
        {receiveButtons.map((receiveButton, index) => {
          return (
            <button
              key={index}
              className="btn btn-link text-black-50 receive-label"
              onClick={() => handleShowMoreReceiveButtons(receiveButton)}
            >
              {t(`outlook.mail:${receiveButton.toLowerCase()}`)}
            </button>
          );
        })}
      </div>
      <ReceiveListSelect
        receiveList={receiveList}
        setReceiveList={setReceiveList}
        inputReceiveRefs={inputReceiveRefs}
        inputReceive={inputReceive}
        setInputReceive={setInputReceive}
        defaultOptions={defaultOptions}
        handleHideMoreReceiveButtons={handleHideMoreReceiveButtons}
        enableSearch={false}
      />
      <div className={`flex-row receive-item mb-3 mt-2 receive-item-subject`}>
        <div className="receive-input d-flex">
          <div className="receive-label align-self-center">
            {t("outlook.mail:subject")}
          </div>
          <FormControl
            className="receive-input-subject border-0"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>
      <ScriptWindow
        key={"editor"}
        onMsgSend={onMsgSend}
        classNameToolbar="d-none"
        postContent={forwardText}
        refscriptWindowSendButton={props.refscriptWindowSendButton}
        editor={editor}
        attachmentsForward={attachmentsForward}
        setAttachmentsForward={setAttachmentsForward}
        isOutLookForward={true}
        attachError={error}
        isForwardToEmail={true}
      />
      {error && (
        <Alert variant="outlined" severity="error" className="mb-4">
          {error}
        </Alert>
      )}
    </div>
  );
};

export default React.memo(OutlookForwardToEmail);
