import React, { useReducer, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import reviewNSendReducer from "./review-n-send-reducer";
import { reviewNSendActions } from "./review-n-send-actions";
import SignatureFooter from "../signature-footer/signature-footer";
import {
  Reminders,
  ReminderKeys,
  Expiration,
  ExpirationKeys,
} from "../constants";

import "./review-n-send.css";
import ESignatureSummary from "./e-signature-summary";
import { Col } from "react-bootstrap";
import {
  MESSAGE_MAX_LENGTH,
  SUBJECT_MAX_LENGTH,
} from "../../../constants/CommonConstants";

let initialState = {
  subject: "",
  message: "",
  expiry: ExpirationKeys["7_DAYS"],
  reminder: ReminderKeys.OFF,
  isDisabled: true,
};

const ReviewNSend = (props) => {
  const { t } = useTranslation();
  if (Object.values(props?.reviewSendData).length > 0) {
    initialState = { ...initialState, ...props?.reviewSendData };
  } else {
    initialState = {
      subject: "",
      message: "",
      expiry: ExpirationKeys["7_DAYS"],
      reminder: ReminderKeys.OFF,
      isDisabled: true,
    };
  }
  const [state, dispatch] = useReducer(reviewNSendReducer, initialState);
  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  const esignRecipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const [isDisabled, setDisable] = useState(true);
  const [isSubjectValid, setSubject] = useState(true);

  const esignSummary = {
    display: "contents",
    paddingLeft: "0px",
  };
  useEffect(() => {
    dispatch({
      type: reviewNSendActions.IS_DISABLED,
      payload: !(state?.subject && state?.message),
    });
    if (state?.subject) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [state?.subject, state?.message]);

  const onExpirationSelect = (value) => {
    dispatch({
      type: reviewNSendActions.DDP_SELECT,
      field: "expiry",
      payload: value,
    });
  };

  const onReminderSelect = (value) => {
    dispatch({
      type: reviewNSendActions.DDP_SELECT,
      field: "reminder",
      payload: value,
    });
  };

  const inputOnChange = (event) => {
    const { target } = event;
    if (target) {
      dispatch({
        type: reviewNSendActions.DDP_SELECT,
        field: target.name,
        payload: target.value,
      });
    }
  };

  const bindExpiryDate = () => {
    let currentDate = new Date();
    const daysToAdd = +state?.expiry;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    let expDate = currentDate?.toDateString()?.split(" ")?.slice(1);
    return expDate[0] + " " + expDate[1] + ", " + expDate[2];
  };

  const onBlurHandler = () => {
    const copyState = { ...state };
    const initial = {
      invitee: esignRecipientList.map((i) => i.email),
      resend: false,
    };
    delete copyState.isDisabled;
    const payload = { ...initial, ...copyState };
    if (!copyState.subject) {
      setSubject(false);
    } else {
      setSubject(true);
    }
    props.emitData(payload);
  };

  // useEffect(() => {
  //   onBlurHandler();
  // }, [esignRecipientList]);

  function renderkeyFromValue(object, value, action) {
    const key = Object.keys(object).find((key) => object[key] === value);
    return action === "expiry" ? Expiration[key] : Reminders[key];
  }
  const nextHandler = () => {
    if (!isDisabled) {
      props.nextHandler();
    }
    onBlurHandler();
  };
  const backHandler = () => {
    props.backHandler();
  };
  const leaveHandler = () => {
    props.leaveHandler();
  };

  return (
    <div className="review-container">
      <div
        className="mon-custom-scrollbar scrollable-container"
        style={{ height: "calc(100vh - 154px)" }}
      >
        <div className="sub-container">
          <div className="lbl-text">{t("esign:review:subject")}</div>
          <div>
            <input
              autoComplete="off"
              className="txt-input"
              onChange={(e) => inputOnChange(e)}
              value={state?.subject}
              placeholder="Subject"
              type="text"
              name="subject"
              maxLength={SUBJECT_MAX_LENGTH}
              style={!isSubjectValid ? { borderBottom: "2px solid red" } : {}}
              onBlur={onBlurHandler}
            />
          </div>
        </div>
        <div className="sub-container">
          <div className="lbl-text">{t("esign:review:message")}</div>
          <div className="txt-box">
            <textarea
              name="message"
              className="txt-area"
              value={state?.message}
              onChange={(e) => inputOnChange(e)}
              placeholder={t("esign:review:enter.message")}
              maxLength={MESSAGE_MAX_LENGTH}
              rows="5"
              onBlur={onBlurHandler}
              //style={!isBodyValid ? { borderBottom: "2px solid red" } : {}}
              style={{ resize: "none" }}
            ></textarea>
          </div>
        </div>
        <div className="sub-container">
          <div className="lbl-text">{t("esign:review:expiration")}</div>
          <div className="exp-box">
            <div>
              <Dropdown className="ddp-container review-send-dropdown">
                <Dropdown.Toggle
                  className="ddp-container-text"
                  variant="success"
                  id="dropdown-basic"
                >
                  {renderkeyFromValue(ExpirationKeys, state.expiry, "expiry")}
                </Dropdown.Toggle>
                <Dropdown.Menu className="ddp-menu-box">
                  {(Object.keys(Expiration) || []).map((key) => (
                    <Dropdown.Item
                      key={key}
                      className="ddp-rw-item"
                      onSelect={() => onExpirationSelect(ExpirationKeys[key])}
                      onBlur={onBlurHandler}
                    >
                      {Expiration[key]}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="ddp-render">
              {t("esign:review:expiry.on")} {bindExpiryDate()}
            </div>
          </div>
        </div>
        <div className="sub-container">
          <div className="lbl-text">{t("esign:review:reminders")}</div>
          <div className="exp-box">
            <div>
              <Dropdown className="ddp-container review-send-dropdown">
                <Dropdown.Toggle
                  className="ddp-container-text"
                  variant="success"
                  id="dropdown-basic"
                >
                  {renderkeyFromValue(ReminderKeys, state.reminder, "reminder")}
                </Dropdown.Toggle>
                <Dropdown.Menu className="ddp-menu-box">
                  {(Object.keys(Reminders) || []).map((key) => (
                    <Dropdown.Item
                      key={key}
                      className="ddp-rw-item"
                      onSelect={() => onReminderSelect(ReminderKeys[key])}
                      onBlur={onBlurHandler}
                    >
                      {Reminders[key]}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <SignatureFooter
        next={nextHandler}
        back={backHandler}
        leave={leaveHandler}
        currentStep={props.currentStep}
        inactive={!state.subject}
        //inactive={!state.subject || !state.message}
        isOnlySigner={props.isOnlySigner}
      />
    </div>
  );
};

export default ReviewNSend;
