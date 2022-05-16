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
  mapEmailAddresses,
  mapOptions,
  setOptionsNewEmail,
  hideReceiveContainer,
  showCc,
  showBcc,
  setValuesReceivers,
  focusTo,
  validateEmails,
  getValueToRecipientFromRefs,
  validateEmail,
  mapDraftOption,
} from "../../utilities/outlook";
import services from "../../outlook/apiService";
import {
  setActiveDraftMailId,
  setEnableWriteEmail,
  setPostEmailType,
  setSaveDraftEmail,
  setSendEmailType,
  setFileAttachments,
  loadingDraftAttachments,
  setFileLoading,
  setAttachmentsList,
  setIsPreventLoading,
} from "../../store/actions/outlook-mail-actions";
import { useTranslation } from "react-i18next";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import ReceiveListSelect from "../outlook-common/receive-list-select";
import moment from "moment";

const OutLookMailEditDraftEditor = (props) => {
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
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer?.postEmailType
  );
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
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

  //set init value of receiveList is default state...
  const [receiveList, setReceiveList] = useState(getDefaultState());
  const inputReceiveRefs = {
    to: useRef(null),
    cc: useRef(null),
    bcc: useRef(null),
  };
  const [subject, setSubject] = useState("");
  const { t } = useTranslation();

  const getFileAttachments = async () => {
    try {
      dispatch(loadingDraftAttachments(true));
      const attachments = await services.getContentBytesFileAttachments(
        activeEmail.id
      );
      if (attachments?.value) {
        dispatch(setFileAttachments(attachments.value));
      }
      dispatch(loadingDraftAttachments(false));
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetImagesFileAttachments = async (attachments) => {
    let mailContent = activeEmail.body && activeEmail.body.content;
    if (attachments.length > 0) {
      for (let file of attachments) {
        if (file.isInline) {
          await services
            .downloadAttachments(file.mailId, file.id)
            .then((file) => {
              if (file.contentType.includes("image")) {
                const imageSrc = `src="data:image/png;base64 , ${file.contentBytes}"`;
                let imageContentId = `src="cid:${file.contentId}"`;
                mailContent = mailContent.replace(imageContentId, imageSrc);
              }
            });
        }
      }
    }
    setForwardText(mailContent);
  };

  const showImageAttachments = async () => {
    const result = await services.getFileAttachments(activeEmail.id);
    const newResult = [...result.value].map((item) => {
      return { ...item, mailId: activeEmail.id };
    });
    await handleGetImagesFileAttachments(newResult);
  };

  useEffect(() => {
    if (postEmailTypeReducer === postEmailType.editDraftEmail) {
      if (Object.keys(activeEmail).length > 0) {
        props.setImportantStatus(activeEmail.importance);
        //following code to add suggestion receiver to To, Cc and Bcc input
        let suggestData = contactData.map(mapEmailAddresses);
        suggestData = suggestData.map(mapOptions);
        const updateState = getDefaultState();
        setOptionsNewEmail(updateState, suggestData);
        setReceiveList(updateState);
        //add default receiver
        const toReceivers = activeEmail?.toRecipients?.map(mapDraftOption);
        const ccReceivers = activeEmail?.ccRecipients?.map(mapDraftOption);
        const bccReceivers = activeEmail?.bccRecipients?.map(mapDraftOption);
        //Check and show it if have cc or bcc
        if (ccReceivers.length > 0) {
          showCc(updateState);
        }
        if (bccReceivers.length > 0) {
          showBcc(updateState);
        }
        setValuesReceivers(
          updateState,
          toReceivers,
          ccReceivers,
          bccReceivers,
          inputReceiveRefs
        );
        setSubject(activeEmail.subject);
        // setForwardText(activeEmail.body.content);
        setReceiveList([...updateState]);
        getFileAttachments();
        showImageAttachments();
      }
    }
  }, [postEmailTypeReducer, contactData, activeEmail]);

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
      const refreshBtn = document.getElementById("refresh-btn");
      if (refreshBtn) {
        refreshBtn.click();
      }
    } catch (e) {
      console.log(e);
    }
    dispatch(setSaveDraftEmail(false));
  };
  const onMsgSend = async (
    content,
    attachments = [],
    attachmentsForward = []
  ) => {
    emailFormData.message.subject = subject;
    emailFormData.message.body.content = content;
    emailFormData.message.attachments = [];
    const { to, cc, bcc } = inputReceive;
    const isValid = validateEmails(inputReceive);
    if (!isValid) {
      return;
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
      emailFormData.message.toRecipients.length === 0 &&
      emailFormData.message.bccRecipients
    ) {
      focusTo();
      return;
    }
    if (postEmailTypeReducer === postEmailType.editDraftEmail) {
      saveDraftFormData.subject = subject;
      saveDraftFormData.body.content = content;
      saveDraftFormData.toRecipients = emailFormData.message.toRecipients;
      saveDraftFormData.ccRecipients = emailFormData.message.ccRecipients;
      saveDraftFormData.bccRecipients = emailFormData.message.bccRecipients;
      saveDraftFormData.importance = props.importantStatus;
      try {
        await services
          .editEmail(activeEmail.id, saveDraftFormData)
          .then(async () => {
            await services.sendDraftEmail(activeEmail.id);
            dispatch(setSendEmailType("SEND_DRAFT_EMAIL"));
            dispatch(setActiveDraftMailId(activeEmail.id));
          });
        //TODO: Add function call API in case user add file attachments here.
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
      </div>
      <div style={{ flex: "1 auto" }}>
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

export default React.memo(OutLookMailEditDraftEditor);
