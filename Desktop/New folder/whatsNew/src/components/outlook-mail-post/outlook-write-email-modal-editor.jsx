import React, { useEffect, useRef, useState } from "react";
import ScriptWindow from "../outlook-mail-post-editor/script-window";
import "./outlook-mail-post.css";
import FormControl from "react-bootstrap/FormControl";
import { emailFormData, postEmailType } from "../../outlook/config";
import { useDispatch, useSelector } from "react-redux";
import {
  focusBcc,
  focusCc,
  getDefaultState,
  mapEmailAddresses,
  mapOptions,
  setOptionsNewEmail,
  setReceiver,
  focusTo,
  validateEmails,
  getValueToRecipientFromRefs,
} from "../../utilities/outlook";
import services from "../../outlook/apiService";
import {
  setOpenWriteEmailModalPopup,
  setSendEmailType,
} from "../../store/actions/outlook-mail-actions";
import { useTranslation } from "react-i18next";
import ReceiveListSelect from "../outlook-common/receive-list-select";

const OutLookWriteEmailModalEditor = (props) => {
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
    if (postEmailTypeReducer === postEmailType.newEmailInPopup) {
      let suggestData = contactData.map(mapEmailAddresses);
      suggestData = suggestData.map(mapOptions);
      const updateState = getDefaultState();
      setOptionsNewEmail(updateState, suggestData);
      setReceiver(updateState, [], inputReceiveRefs, postEmailTypeReducer);
      setReceiveList(updateState);
      setAttachmentsForward([]);
      setSubject("");
      setForwardText("");
    }
  }, [postEmailTypeReducer, contactData]);

  const onMsgSend = async (
    content,
    attachments = [],
    attachmentsForward = []
  ) => {
    emailFormData.message.subject = subject;
    emailFormData.message.body.content = content;
    const { to, cc, bcc } = inputReceive;
    const isValid = validateEmails(inputReceive);
    if (!isValid) {
      return;
    }
    emailFormData.message.attachments = [];
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
    if (postEmailTypeReducer === postEmailType.newEmailInPopup) {
      try {
        dispatch(setSendEmailType("SEND_EMAIL"));
        await services.sendEmail(emailFormData).then(() => {
          dispatch(setOpenWriteEmailModalPopup(false));
          document.getElementById("write-email-modal").style.display = "none";
          dispatch(setSendEmailType(""));
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleShowMoreReceiveButtons = (value) => {
    const writeModal = document.getElementById("write-email-modal");
    const updateReceiveList = [...receiveList];
    const receiveItemIndex = updateReceiveList.findIndex(
      (receive) => receive.label === value
    );
    const countShowInput = updateReceiveList.filter(item => item.display === true)
    updateReceiveList[receiveItemIndex].display = true;
    if (countShowInput.length >= 2 && writeModal.style.height !== "fit-content"){
      writeModal.style.height = "90%"
    }
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
      className={"receive-container  rounded-editor-popup h-100 col-12"}
      id="receive-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="wrapper-inputReceive">
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
      </div>
      <div style={{ minWidth: "740px", flex: "1 auto" }}>
        <ScriptWindow
          key={"editor"}
          onMsgSend={onMsgSend}
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

export default React.memo(OutLookWriteEmailModalEditor);
