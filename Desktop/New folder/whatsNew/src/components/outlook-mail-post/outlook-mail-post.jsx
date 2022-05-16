import React, { useEffect, useRef, useState } from "react";
import ScriptWindow from "../outlook-mail-post-editor/script-window";
import "./outlook-mail-post.css";
import FormControl from "react-bootstrap/FormControl";
import {
  emailFormData,
  saveDraftFormData,
  postEmailType,
} from "../../outlook/config";
import { useDispatch, useSelector } from "react-redux";
import arrowDown from "../../assets/icons/low-important.svg";
import {
  focusBcc,
  focusCc,
  getDefaultState,
  mapAddress,
  mapEmailAddresses,
  mapOptions,
  setOptionsNewEmail,
  setOptionsReply,
  setReceiver,
  showCcBcc,
  uniqEmail,
  hideReceiveContainer,
  setValuesReceivers,
  focusTo,
  getValueToRecipientFromRefs,
  validateEmail,
} from "../../utilities/outlook";
import services from "../../outlook/apiService";
import {
  setActiveDraftMailId,
  setEnableWriteEmail,
  setPostEmailType,
  setRefreshData,
  setSaveDraftEmail,
  setSendEmailType,
  setFileAttachments,
} from "../../store/actions/outlook-mail-actions";
import { useTranslation } from "react-i18next";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReceiveListSelect from "../outlook-common/receive-list-select";
import { setActivePanelAction } from "../../store/actions/config-actions";
import Panel from "../actionpanel/panel";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const OutLookMailPost = (props) => {
  const [inputReceive, setInputReceive] = useState({
    to: "",
    cc: "",
    bcc: "",
  });
  const [defaultOptions, setDefaultOptions] = useState({
    to: [],
    cc: [],
    bcc: [],
  });
  const editor = useRef(null);
  const [forwardText, setForwardText] = useState("");
  const [attachmentsForward, setAttachmentsForward] = useState([]);
  const dispatch = useDispatch();
  const contactSenderEmail = useSelector(
    (state) => state.OutlookMailReducer?.emailSendFromContact
  );
  const listContactSenderEmail = useSelector(
    (state) => state.OutlookMailReducer?.emailListSendFromContact
  );
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer?.postEmailType
  );
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
  );
  const conversationData = useSelector(
    (state) => state.OutlookMailReducer?.conversationData
  );
  const contactData = useSelector(
    (state) => state.MailSummaryReducer?.contactData
  );
  const isOpenWriteEmailModalPopup = useSelector(
    (state) => state.OutlookMailReducer?.isOpenWriteEmailModalPopup
  );
  const activeDraftMailId = useSelector(
    (state) => state.OutlookMailReducer?.activeDraftMailId
  );
  const dataForward = useSelector(
    (state) => state.OutlookMailReducer?.dataForward
  );

  const currentReplyEmailId = useSelector(
    (state) => state.OutlookMailReducer?.currentReplyEmailId
  );
  //set init value of receiveList is default state...
  const [receiveList, setReceiveList] = useState(getDefaultState());
  const inputReceiveRefs = {
    to: useRef(null),
    cc: useRef(null),
    bcc: useRef(null),
  };
  const [subject, setSubject] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (postEmailTypeReducer === postEmailType.newEmail) {
      let suggestData = contactData.map(mapEmailAddresses);
      suggestData = suggestData.map(mapOptions);
      const updateState = getDefaultState();
      setOptionsNewEmail(updateState, suggestData);
      //In case send fast email from contact
      if (Object.keys(contactSenderEmail).length) {
        const value = {
          email: contactSenderEmail.email,
          label: contactSenderEmail.name,
          value: contactSenderEmail.email,
        };
        setReceiver(
          updateState,
          [value],
          inputReceiveRefs,
          postEmailType.newEmail
        );
      }
      if (listContactSenderEmail.length > 0) {
        setValuesReceivers(
          updateState,
          listContactSenderEmail,
          [],
          [],
          inputReceiveRefs
        );
      }
      setReceiveList(updateState);
      setSubject("");
      setForwardText("");
      dispatch(setFileAttachments([]));
    } else {
      if (
        [
          postEmailType.reply,
          postEmailType.replyAll,
          postEmailType.forward,
        ].includes(postEmailTypeReducer)
      ) {
        //console.log(conversationData);
        if (conversationData.length) {
          setForwardText("");
          let toList = [];
          let senderList = [];
          let ccList = [];
          let bccList = [];
          let conversationDataList = conversationData;
          let firstSender = conversationData[0];
          if (currentReplyEmailId !== "") {
            firstSender = conversationData.find(
              (item) => item.id === currentReplyEmailId
            );
            conversationDataList = [firstSender];
          }

          const {
            sender: {
              emailAddress: { address, name },
            },
            subject,
          } = firstSender;
          conversationDataList.map((conversation) => {
            const { toRecipients, ccRecipients, bccRecipients, sender } =
              conversation;
            const { emailAddress = {} } = sender;
            const { address, name } = emailAddress;
            senderList = [
              { value: address, email: address, label: name },
              ...senderList,
            ];
            toList = [...toRecipients.map(mapAddress), ...toList];
            ccList = [...ccRecipients.map(mapAddress), ...ccList];
            bccList = [...bccRecipients.map(mapAddress), ...bccList];
          });
          // add sender to list
          const senderOption = { value: address, label: name, email: address };
          const senderOptionValue = [senderOption];
          //const { username = "" } = instance.getActiveAccount();
          //if (username) {
          //toList = toList.filter((option) => option.value !== username);
          //senderOptionValue = senderOptionValue.filter((option) => option.value !== username);
          //}

          toList = toList.map(mapOptions);
          ccList = ccList.map(mapOptions);
          bccList = bccList.map(mapOptions);

          toList = toList.concat(senderList);

          toList = uniqEmail(toList);
          ccList = uniqEmail(ccList);
          bccList = uniqEmail(bccList);
          senderList = uniqEmail(senderList);

          const updateState = getDefaultState();
          setOptionsReply(updateState, toList, ccList, bccList);
          setDefaultOptions({
            to: [...toList].map((item) => item.value),
            cc: [...ccList].map((item) => item.value),
            bcc: [...bccList].map((item) => item.value),
          });

          if (postEmailTypeReducer === postEmailType.reply) {
            setReceiver(
              updateState,
              senderOptionValue,
              inputReceiveRefs,
              postEmailTypeReducer
            );
          }
          // forward
          if (postEmailTypeReducer === postEmailType.forward) {
            setReceiver(
              updateState,
              [],
              inputReceiveRefs,
              postEmailTypeReducer
            );
            setSubject(`FW: ${subject}`);
            setForwardText(dataForward?.content);
          }
          // replyAll
          if (postEmailTypeReducer === postEmailType.replyAll) {
            showCcBcc(updateState);
            setValuesReceivers(
              updateState,
              senderList,
              ccList,
              bccList,
              inputReceiveRefs
            );
          }
          setReceiveList([...updateState]);
        }
      }
    }
  }, [
    postEmailTypeReducer,
    contactData,
    contactSenderEmail,
    activeEmail,
    conversationData,
    listContactSenderEmail,
    currentReplyEmailId,
  ]);

  const saveDraftMail = async (content, attachments = []) => {
    saveDraftFormData.subject = subject;
    saveDraftFormData.body.content = content;
    saveDraftFormData.importance = props.importantStatus;
    if (attachments.length) {
      saveDraftFormData.attachments = attachments;
    }
    const { to, cc, bcc } = inputReceive;
    const receiveToExtra = validateEmail(to) ? to : ``;
    const receiveCcExtra = validateEmail(cc) ? cc : ``;
    const receiveBccExtra = validateEmail(bcc) ? bcc : ``;

    saveDraftFormData.toRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "to",
      receiveToExtra
    );
    saveDraftFormData.ccRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "cc",
      receiveCcExtra
    );
    saveDraftFormData.bccRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "bcc",
      receiveBccExtra
    );

    try {
      //If have email draft id, will update it otherwise create new draft mail and save draft id.
      if (activeDraftMailId) {
        await services.editEmail(activeDraftMailId, saveDraftFormData);
        props.setImportantStatus(saveDraftFormData.importance);
      } else {
        const result = await services.saveDraftEmail(saveDraftFormData);
        dispatch(setActiveDraftMailId(result.id));
      }
    } catch (e) {
      console.log(e);
    }
    dispatch(setSaveDraftEmail(false));
  };
  const handleGetFileAttachments = async (mailId, attachments) => {
    const files = [];
    for (let file of attachments) {
      const fileWithContent = await services.downloadAttachments(
        mailId,
        file.id
      );
      files.push(fileWithContent);
    }
    return files;
  };
  const onMsgSend = async (
    content,
    attachments = [],
    attachmentsForward = []
  ) => {
    if (attachmentsForward.length) {
      const attachmentFiles = await handleGetFileAttachments(
        activeEmail?.id,
        attachmentsForward
      );
      if (attachmentFiles.length) {
        attachments = attachments.concat(attachmentFiles);
      }
    }
    emailFormData.message.subject = subject;
    emailFormData.message.body.content = content;
    emailFormData.message.attachments = [];
    const { to, cc, bcc } = inputReceive;

    if (to && !to.match(emailRegex)) {
      focusTo();
      return false;
    }
    if (cc && !cc.match(emailRegex)) {
      focusCc();
      return false;
    }
    if (bcc && !bcc.match(emailRegex)) {
      focusBcc();
      return false;
    }

    if (attachments.length) {
      emailFormData.message.attachments = attachments;
    }
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
    emailFormData.message.bccRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "bcc",
      bcc
    );

    if (
      emailFormData.message.toRecipients.length === 0 &&
      emailFormData.message.ccRecipients.length === 0 &&
      emailFormData.message.bccRecipients.length === 0
    ) {
      focusTo();
      return;
    }
    if (postEmailTypeReducer === postEmailType.newEmail) {
      emailFormData.message.importance = props.importantStatus;
      try {
        dispatch(setSendEmailType("SEND_EMAIL"));
        await services.sendEmail(emailFormData).then(() => {
          if (Object.keys(activeEmail).length === 0) {
            dispatch(setPostEmailType(postEmailType.init));
            dispatch(setActivePanelAction(Panel.WELCOME_EMAIL, null));
          } else {
            dispatch(setRefreshData(true));
          }
          dispatch(setSendEmailType(""));
        });
      } catch (e) {
        console.log(e);
      }
    } else if (postEmailTypeReducer === postEmailType.reply) {
      const data = {
        message: {
          toRecipients: emailFormData.message.toRecipients,
          ccRecipients: emailFormData.message.ccRecipients,
          bccRecipients: emailFormData.message.bccRecipients,
        },
        comment: emailFormData.message.body.content,
      };
      if (attachments.length) {
        data.message.attachments = attachments;
      }
      try {
        const result = await services.replyEmail(activeEmail.id, data);
        //if (result.ok) {
        dispatch(setRefreshData(true));
        //}
      } catch (e) {
        console.log(e);
      }
    } else if (postEmailTypeReducer === postEmailType.replyAll) {
      try {
        const data = {
          comment: emailFormData.message.body.content,
        };
        if (attachments.length) {
          data.message = {};
          data.message.attachments = attachments;
        }
        await services.replyAllEmail(activeEmail.id, data);
        dispatch(setRefreshData(true));
      } catch (e) {
        console.log(e);
      }
    } else if (postEmailTypeReducer === postEmailType.forward) {
      try {
        if (!emailFormData.message.subject) {
          emailFormData.message.subject = "No Subject";
        }
        await services.forwardEmail(activeEmail.id, emailFormData);
        dispatch(setRefreshData(true));
      } catch (e) {
        console.log(e);
      }
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

  const handleCloseEditor = () => {
    hideReceiveContainer();
    dispatch(setEnableWriteEmail(false));
    dispatch(setPostEmailType(postEmailType.init));
  };

  const receiveButtons = receiveList
    .filter((receive) => !receive.display)
    .map((receive) => receive.label);

  return (
    <div
      className={`receive-container ${
        [
          postEmailType.reply,
          postEmailType.replyAll,
          postEmailType.forward,
        ].includes(postEmailTypeReducer)
          ? "editor-style rounded"
          : "editor-newEmail h-100 col-12"
      } ${
        postEmailTypeReducer === postEmailType.newEmailInPopup
          ? "rounded-editor-popup"
          : ""
      }`}
      id="receive-container"
    >
      <div className="wrapper-inputReceive">
        {[
          postEmailType.reply,
          postEmailType.replyAll,
          postEmailType.forward,
        ].includes(postEmailTypeReducer) &&
          !isOpenWriteEmailModalPopup && (
            <div className=" d-flex justify-content-end">
              <IconButton
                style={{ color: "#3E3F41" }}
                component="span"
                size="small"
                onClick={handleCloseEditor}
              >
                <CloseIcon />
              </IconButton>
            </div>
          )}

        <div
          className="receive-buttons d-flex justify-content-end position-absolute"
          style={{}}
        >
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
        />
        {![
          postEmailType.reply,
          postEmailType.replyAll,
          postEmailType.delete,
        ].includes(postEmailTypeReducer) && (
          <div
            className={`flex-row receive-item mb-3 mt-2 receive-item-subject`}
          >
            <div className="receive-input d-flex">
              <div className="receive-label align-self-center">
                {t("outlook.mail:subject")}
              </div>
              <FormControl
                className="receive-input-subject border-0"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              {props.importantStatus === "high" ? (
                <div style={{ color: "#a4262c" }}>!</div>
              ) : props.importantStatus === "low" ? (
                <img
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  src={arrowDown}
                  alt="low-important"
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
      <div style={{flex: "1 auto" }}>
        <ScriptWindow
          key={"editor"}
          onMsgSend={onMsgSend}
          saveDraftMail={saveDraftMail}
          postContent={forwardText}
          buttonRef={props.buttonRef}
          attachmentsForward={attachmentsForward}
          setAttachmentsForward={setAttachmentsForward}
          editor={editor}
        />
      </div>
    </div>
  );
};

export default React.memo(OutLookMailPost);
