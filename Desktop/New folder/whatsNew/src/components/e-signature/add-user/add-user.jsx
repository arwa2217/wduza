import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";
import CheckIcon from "@material-ui/icons/Check";
import addUserReducer from "./add-user-reducer";
import { AddUserAction } from "./add-user-actions";
import Suggestions from "../../../components/modal/channel/Suggestions";
import { fetchUserTypeAction } from "../../../store/actions/channelActions";
import CommonUtils from "../../utils/common-utils";
// import { phoneRegex } from "./../../../utilities/utils";
import debounce from "lodash/debounce";
import "./add-user.css";
import DeleteIcon from "../../../assets/icons/v2/delete-icon.svg";
import activeCheckIcon from "../../../assets/icons/v2/ic_check_active.svg";
import checkIcon from "../../../assets/icons/v2/ic_check.svg";

import {
  RECIPIENT_EMAIL_MAX_LENGTH,
  RECIPIENT_EMAIL_MIN_LENGTH,
  RECIPIENT_NAME_MAX_LENGTH,
  RECIPIENT_NAME_MIN_LENGTH,
  RECIPIENT_PASSCODE_MAX_LENGTH,
  RECIPIENT_PASSCODE_MIN_LENGTH,
} from "../../../constants/CommonConstants";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button } from "react-bootstrap";

const AddUser = (props) => {
  const { t } = useTranslation();
  const [isValidEmail, setValidEmail] = useState(true);

  const [fetchingUserType, setFetchingUser] = useState(false);
  const [fetchedUserType, setFetchedUserType] = useState(false);
  const [isValidName, setValidName] = useState(true);
  const [isPhoneValid, setValidPhone] = useState(true);
  const phoneRegex = /^[6-9]\d{9}$/;
  let initialState = {
    name: "",
    email: "",
    passcode: "",
    sms: "",
    xfdf: "",
    userId: "",
    userType: "",
    isPasscodeVisible: false,
    isSMSVisible: false,
    signNeeded: true,
    signed: false,
    recipientCID: "",
  };
  const [state, dispatch] = useReducer(addUserReducer, initialState);

  useEffect(() => {
    if (Object.values(props?.user).length > 0) {
      initialState = { ...initialState, ...props?.user };
    } else {
      initialState = {
        name: "",
        email: "",
        passcode: "",
        sms: "",
        xfdf: "",
        userId: "",
        userType: "",
        isPasscodeVisible: false,
        isSMSVisible: false,
        signNeeded: true,
        signed: false,
        recipientCID: "",
      };
    }
    if (props?.user?.password) {
      initialState.isPasscodeVisible = true;
      initialState.passcode = props?.user?.password;
      initialState.isSMSVisible = false;
      initialState.sms = "";
    } else if (props?.user?.mobile) {
      initialState.isSMSVisible = true;
      initialState.sms = props?.user?.mobile;
      initialState.isPasscodeVisible = false;
      initialState.passcode = "";
    }
    dispatch({
      type: AddUserAction.RE_INITIALIZE_STATE,
      payload: { ...initialState },
    });
  }, [props?.user]);

  // COMMENTED BCZ OF CORRECT FLOW

  // useEffect(() => {
  //   props.emitData(state, props.index);
  // }, [state.isPasscodeVisible, state.isSMSVisible]);

  const actionhanlderForPasscode = () => {
    dispatch({
      type: AddUserAction.IS_PASSCODE_VISIBLE,
      payload: state.isPasscodeVisible,
    });
    onSMSORPasscodeOutSideClick("PASSCODE");
  };

  const actionhanlderForSMS = () => {
    dispatch({
      type: AddUserAction.IS_SMS_VISIBLE,
      payload: state.isSMSVisible,
    });
    onSMSORPasscodeOutSideClick("SMS");
  };

  const handleEmail = (value) => {
    if (CommonUtils.isValidEmail(value)) {
      setValidEmail(true);
      let data = handleUserType(value);
      setFetchingUser(true);
      setFetchedUserType(false);
      setTimeout(() => {
        setFetchingUser(false);
        setFetchedUserType(true);
      }, 1500);
    } else {
      setValidEmail(false);
      setFetchingUser(false);
      setFetchedUserType(false);
    }
    dispatch({
      type: AddUserAction.INPUT_CHANGE,
      field: "email",
      payload: value,
    });
  };

  const handleUserType = debounce(function (value) {
    dispatch(fetchUserTypeAction(value));
  }, 500);

  const deletehandler = (index) => {
    props.deleteRecipient(index);
  };

  const ddpSelectHandler = (selector) => {
    dispatch({
      type: AddUserAction.SIGNNEEDED,
      field: "signNeeded",
      payload: !!(selector === "SIGN"),
    });
    // dispatch({
    //   type: AddUserAction.SIGNNEEDED,
    //   field: "signed",
    //   payload: selector === "COPY",
    // });
  };

  const onChangehandler = (event) => {
    const { target } = event;
    if (target.name === "sms") {
      if (phoneRegex.test(target.value)) {
        dispatch({
          type: AddUserAction.INPUT_CHANGE,
          field: target.name,
          payload: target.value,
        });
      }
    } else {
      if (target) {
        dispatch({
          type: AddUserAction.INPUT_CHANGE,
          field: target.name,
          payload: target.value,
        });
      }
    }
  };
  const onSMSChangeHandler = (event) => {
    dispatch({
      type: AddUserAction.INPUT_CHANGE,
      field: "sms",
      payload: event.toString().charAt(0) === "+" ? event : "+" + event,
    });
  };

  const orderClick = (data) => {
    props.orderChange(data);
  };

  const onBlurHandler = () => {
    if (!state.name) {
      setValidName(false);
    } else {
      setValidName(true);
    }
    // if (state?.sms && state.sms.match(phoneRegex)) {
    //   setValidPhone(false);
    // } else {
    //   setValidPhone(true);
    // }
    props.reset();
    props.emitData(state, props.index);
  };

  const onSMSORPasscodeOutSideClick = (isSMSOrPasscode) => {
    const localState = {...state};
    if (isSMSOrPasscode === 'SMS') {
      localState.isSMSVisible = !localState.isSMSVisible;
    }
    if (isSMSOrPasscode === 'PASSCODE') {
      localState.isPasscodeVisible = !localState.isPasscodeVisible;
    }
    props.emitData(localState, props.index);
  }

  const handleCID = (cid) => {
    if (cid)
      dispatch({
        type: AddUserAction.RECIPIENT_CID,
        field: "recipientCID",
        payload: cid,
      });
  };

  const fetchUserType = (type) => {
    dispatch({
      type: AddUserAction.USER_TYPE,
      field: "userType",
      payload: type,
    });
  };

  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const [globalMembers, setGlobalMembers] = useState([]);
  useEffect(() => {
    setGlobalMembers(
      CommonUtils.getFilteredMembers(globalMembersList, undefined)
    );
  }, [globalMembersList]);

  const getMembers = (memberList) => {
    return memberList && memberList.length > 0
      ? memberList.filter((member) => member.userType !== "GUEST")
      : [];
  };

  return (
    <div className="user-container">
      <div className="user-box">
        <div className="container-left">
          {props?.data && (
            <div className="order-container">
              <span className="order-text">{t("esign:recipient:order")}</span>
              {(props?.data?.total || []).map((x, i) => (
                <span
                  className="order-count"
                  style={
                    props?.data?.sequence === i + 1
                      ? { color: "#00A95B", fontSize: "18px" }
                      : { color: "rgba(0, 0, 0, 0.4)", fontSize: "13px" }
                  }
                  onClick={() =>
                    orderClick({ index: props?.data?.index, sequence: x })
                  }
                >
                  {x}
                </span>
              ))}
            </div>
          )}
          <div className="container-gap">
            <input
              value={state?.name}
              onChange={onChangehandler}
              onBlur={onBlurHandler}
              autoComplete="off"
              className="user-input"
              style={!isValidName ? { borderBottom: "2px solid red" } : {}}
              placeholder={t("esign:recipients:name")}
              maxLength={RECIPIENT_NAME_MAX_LENGTH}
              minLength={RECIPIENT_NAME_MIN_LENGTH}
              type="text"
              name="name"
            />
          </div>
          <div className="container-gap">
            <Suggestions
              members={getMembers(globalMembers)}
              useCachedData={true}
              handleChange={handleEmail}
              type="email"
              name="email"
              style={{ borderBottom: "3px solid red" }}
              placeholder={t("esign:recipients:email")}
              maxLength={RECIPIENT_EMAIL_MAX_LENGTH}
              minLength={RECIPIENT_EMAIL_MIN_LENGTH}
              className={isValidEmail ? "user-input" : "input-invalid"}
              value={state?.email}
              getCID={true}
              handleCID={handleCID}
              onBlur={onBlurHandler}
              getUserType={true}
              fetchUserType={fetchUserType}
              noSelectedMember={true}
            />
          </div>
          <div className="container-gap d-flex" style={{ marginBottom: "7px" }}>
            <div onClick={actionhanlderForPasscode} className="item-container">
              <span>
                {" "}
                <CheckIcon
                  className="icon-check"
                  style={
                    state?.isPasscodeVisible
                      ? { color: "#00A95B" }
                      : { color: "rgba(0, 0, 0, 0.7)" }
                  }
                />
              </span>
              <span
                className="lbl-txt"
                style={
                  state?.isPasscodeVisible
                    ? { color: "#00A95B", fontWeight: "700" }
                    : { color: "rgba(0, 0, 0, 0.7)" }
                }
              >
                {t("esign:recipients:passcode")}
              </span>
            </div>
            <div onClick={actionhanlderForSMS} className="item-container">
              <span>
                <CheckIcon
                  className="icon-check"
                  style={
                    state?.isSMSVisible
                      ? { color: "#00A95B" }
                      : { color: "rgba(0, 0, 0, 0.7)" }
                  }
                />
              </span>
              <span
                className="lbl-txt"
                style={
                  state?.isSMSVisible
                    ? { color: "#00A95B", fontWeight: "700" }
                    : { color: "rgba(0, 0, 0, 0.7)" }
                }
              >
                {t("esign:recipients:sms")}
              </span>
            </div>
          </div>
          {state?.isPasscodeVisible && (
            <div className="container-gap container-width">
              <input
                autoComplete="off"
                value={state?.passcode}
                onChange={onChangehandler}
                onBlur={onBlurHandler}
                className="user-input"
                placeholder={t("esign:recipients:passcode")}
                maxLength={RECIPIENT_PASSCODE_MAX_LENGTH}
                minLength={RECIPIENT_PASSCODE_MIN_LENGTH}
                type="text"
                name="passcode"
              />
            </div>
          )}
          {state?.isSMSVisible && (
            <div className="container-gap container-width">
              <PhoneInput
                country={"kr"}
                preferredCountries={["kr", "in", "us"]}
                value={state?.sms}
                onChange={onSMSChangeHandler}
                name="sms"
                enableSearch={true}
                placeholder={t("esign:recipients:mobile")}
                preserveOrder={["preferredCountries"]}
                countryCodeEditable={true}
                prefix="+"
                onBlur={onBlurHandler}
              />
              {/* <input
                maxlength="10"
                autoComplete="off"
                value={state?.sms}
                onChange={onChangehandler}
                onBlur={onBlurHandler}
                className="user-input"
                placeholder={t("esign:recipients:mobile")}
                type="text"
                name="sms"
                style={
                  isPhoneValid && state?.sms
                    ? { borderBottom: "2px solid red" }
                    : {}
                }
              /> */}
            </div>
          )}
        </div>
        <div className="container-right">
          <div className="ddp-container">
            <Dropdown className="ddp-signin">
              <Dropdown.Toggle
                className="ddp-signin-text"
                variant="default"
                id="dropdown-basic"
              >
                {state.signNeeded
                  ? t("esign:recipients:need.sign")
                  : t("esign:recipients:receives.copy")}
              </Dropdown.Toggle>
              <Dropdown.Menu className="ddp-menu-box">
                <Dropdown.Item
                  className="ddp-item"
                  onClick={() => ddpSelectHandler("SIGN")}
                  onBlur={onBlurHandler}
                >
                  {t("esign:recipients:need.sign")}
                </Dropdown.Item>
                <Dropdown.Item
                  className="ddp-item"
                  onClick={() => ddpSelectHandler("COPY")}
                  onBlur={onBlurHandler}
                >
                  {t("esign:recipients:receives.copy")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {props?.recipientCount && props.recipientCount > 1 ? (
              <div className="icon-delete-box">
                <img
                  src={DeleteIcon}
                  onClick={() => deletehandler(props?.index)}
                  className="icon-delete"
                  alt="delete"
                />
              </div>
            ) : (
              <div className="icon-delete-box">
                <img
                  src={DeleteIcon}
                  style={{ cursor: "no-drop" }}
                  className="icon-delete"
                  alt="delete"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
