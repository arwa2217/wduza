import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonUtils from "../../utils/common-utils";
import {
  setESignRecipientList,
  setESignRecipientOrder,
} from "../../../store/actions/esignature-actions";
import SignatureIcon from "../../../assets/icons/check-round-icon.svg";
import AddUser from "../add-user/add-user";
import RecipientLimitationModal from "./recipient-limitation-modal";
import SignatureFooter from "../signature-footer/signature-footer";
import "./recipients-view.css";
import PlusCircle from "../../../assets/icons/v2/plus-circle.svg";
import { fetchUserTypeAction } from "../../../store/actions/channelActions";
import { API_BASE_URL, API_METHODS } from "../../../constants";
import { AuthHeader } from "../../../utilities/app-preference";
import configConstants from "configConstants";
import {
  RECIPIENT_EMAIL_MAX_LENGTH,
  RECIPIENT_EMAIL_MIN_LENGTH,
  RECIPIENT_NAME_MAX_LENGTH,
  RECIPIENT_NAME_MIN_LENGTH,
  RECIPIENT_PASSCODE_MAX_LENGTH,
  RECIPIENT_PASSCODE_MIN_LENGTH,
} from "../../../constants/CommonConstants";

import { phone } from "phone";
import { ESIGN_ORDER_ENABLED } from "../../../store/actionTypes/esignature-action-types";

const RecipientView = (props) => {
  const [showLimitationModal, setLimitationModal] = useState(false);
  const recipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const recipientOrder = useSelector(
    (state) => state.esignatureReducer.recipientOrder
  );

  const [showOrder, setOrderVisibility] = useState(
    !!(recipientOrder.length > 1)
  );
  const [isValid, setValid] = useState({ valid: false, msg: "" });

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const emitHandler = (rec, i) => {
    onAddHandler(rec, i);
  };

  const reset = () => {
    setValid({ valid: false, msg: "" });
  };

  function checkValidation() {
    const count = recipientOrder?.length;
    let error = false;
    let msg = "";
    const rec = [...recipientList];
    // if (rec.length !== count || rec.length < 1) {
    //   error = true;
    //   msg = t("esign:recipients:required");
    // } else {
    (rec || []).map((x, ind) => {
      let duplicateInd = rec.findIndex((i) => i.email === x.email);
      if (!error) {
        if (x.name === "") {
          error = true;
          msg = t("esign:recipients:required.check", { key: "Name" });
        }
        if (x.email === "") {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:required.check", {
                key: "Email",
              })}`
            : t("esign:recipients:required.check", { key: "Email" });
        }
        if (
          x.name !== "" &&
          (x.name.length < RECIPIENT_NAME_MIN_LENGTH ||
            x.name.length > RECIPIENT_NAME_MAX_LENGTH)
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:length.check", {
                key: "Name",
                min: RECIPIENT_NAME_MIN_LENGTH,
                max: RECIPIENT_NAME_MAX_LENGTH,
              })}`
            : t("esign:recipients:length.check", {
                key: "Name",
                min: RECIPIENT_NAME_MIN_LENGTH,
                max: RECIPIENT_NAME_MAX_LENGTH,
              });
        }
        if (
          x.email !== "" &&
          (x.email.length < RECIPIENT_EMAIL_MIN_LENGTH ||
            x.email.length > RECIPIENT_EMAIL_MAX_LENGTH)
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:length.check", {
                key: "Email",
                min: RECIPIENT_EMAIL_MIN_LENGTH,
                max: RECIPIENT_EMAIL_MAX_LENGTH,
              })}`
            : t("esign:recipients:length.check", {
                key: "Email",
                min: RECIPIENT_EMAIL_MIN_LENGTH,
                max: RECIPIENT_EMAIL_MAX_LENGTH,
              });
        }
        if (
          !(
            x.email === "" &&
            (x.email.length < RECIPIENT_EMAIL_MIN_LENGTH ||
              x.email.length > RECIPIENT_EMAIL_MAX_LENGTH)
          ) &&
          !CommonUtils.isValidEmail(x.email)
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:email.invalid")}`
            : t("esign:recipients:email.invalid");
        }
        if (x.verificationMode === "passcode" && x.password === "") {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:required.check", {
                key: "Passcode",
              })}`
            : t("esign:recipients:required.check", { key: "Passcode" });
        }
        if (
          (x.verificationMode === "passcode" &&
            x.password !== "" &&
            x.password.length < RECIPIENT_PASSCODE_MIN_LENGTH) ||
          (x.verificationMode === "passcode" &&
            x.password !== "" &&
            x.password.length > RECIPIENT_PASSCODE_MAX_LENGTH)
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:length.check", {
                key: "Passcode",
                min: RECIPIENT_PASSCODE_MIN_LENGTH,
                max: RECIPIENT_PASSCODE_MAX_LENGTH,
              })}`
            : t("esign:recipients:length.check", {
                key: "Passcode",
                min: RECIPIENT_PASSCODE_MIN_LENGTH,
                max: RECIPIENT_PASSCODE_MAX_LENGTH,
              });
        }
        if (
          x.verificationMode === "sms" &&
          (x.mobile === "" || x.mobile === "+")
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:required.check", {
                key: "Contact Number",
              })}`
            : t("esign:recipients:required.check", { key: "Contact Number" });
        }
        if (
          x.verificationMode === "sms" &&
          x.mobile !== "" &&
          x.mobile !== "+" &&
          !phone(x.mobile).isValid
        ) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:mobile.invalid")}`
            : t("esign:recipients:mobile.invalid");
        }
        if (duplicateInd !== ind) {
          error = true;
          msg = msg
            ? `${msg}\n${t("esign:recipients:no.duplicate")}`
            : t("esign:recipients:no.duplicate");
        }
      }
    });
    const isSignNeeded = (rec || []).some((x) => x.signNeeded);
    // if (!isSignNeeded) {
    //   error = true;
    //   msg = t("esign:recipients:oneSignerRequired");
    // }
    // }
    // error = rec.some((i) => i.email === value);
    if (!error) {
      setValid({ valid: true, msg: "" });
    } else {
      setValid({ valid: false, msg: msg });
    }
    return !error;
  }

  async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  }

  const onAddHandler = (recipient, key) => {
    let data;
    const payload = (({ name, email, signNeeded, signed }) => ({
      name,
      email,
      signNeeded,
      signed,
    }))(recipient);
    payload.xfdf = "";
    payload.recipientCID = recipient?.recipientCID;
    let itemFound = false;
    const newList = (recipientList || []).map((x) => {
      if (x?.order === key) {
        x.name = payload?.name || "";
        x.email = payload?.email || "";
        x.signNeeded = payload?.signNeeded;
        x.signed = payload?.signed;
        if (recipient.isSMSVisible) {
          x.verificationMode = "sms";
          x.mobile = "";
        }
        if (recipient.isPasscodeVisible) {
          x.verificationMode = "passcode";
          x.password = "";
        }
        if (x.password || recipient?.passcode) {
          x.password = recipient?.passcode;
          x.verificationMode = "passcode";
        }
        if ((x.mobile || recipient?.sms) && recipient?.sms !== "+") {
          x.mobile = recipient?.sms;
          x.verificationMode = "sms";
        }
        if (
          x.verificationMode &&
          !recipient.isSMSVisible &&
          !recipient.isPasscodeVisible
        ) {
          x.verificationMode = "";
          x.password = "";
          x.mobile = "";
        }

        itemFound = true;
        if (!x.userType || x.userType === "GUEST") {
          let value = "";
          const request = async () => {
            const response = await fetchWithTimeout(
              API_BASE_URL + `/ent/v1/user-type?user-emails=${recipient.email}`,
              {
                method: API_METHODS.GET,
                headers: AuthHeader(),
                timeout: configConstants.readTimeout,
              }
            );
            const json = await response.json();
            return json;
          };
          request()
            .then((value) => {
              if (
                value &&
                value.data &&
                value.data.length > 0 &&
                value.data[0]["member_type"] &&
                value.data[0]["email"] === x.email
              ) {
                x.userType = recipient.userType
                  ? recipient.userType
                  : value.data[0]["member_type"]
                  ? value.data[0]["member_type"]
                  : "GUEST";
                x.recipientCID = recipient.recipientCID
                  ? recipient.recipientCID
                  : value.data[0]["Ent"].length > 0 &&
                    value.data[0]["Ent"][0]["cid"]
                  ? value.data[0]["Ent"][0]["cid"]
                  : "";
              } else {
                x.userType = recipient.userType ? recipient.userType : "GUEST";
              }
            })
            .catch((error) => {
              x.userType = recipient.userType ? recipient.userType : "GUEST";
            });
        }
      }

      return x;
    });

    if (!itemFound) {
      payload.signed = false;
      if (recipient.isPasscodeVisible) {
        payload.password = recipient.passcode;
        payload.verificationMode = "passcode";
      }
      if (recipient.isSMSVisible) {
        payload.mobile = recipient.sms;
        payload.verificationMode = "sms";
      }
      if (
        payload.verificationMode &&
        !recipient.isSMSVisible &&
        !recipient.isPasscodeVisible
      ) {
        payload.verificationMode = "";
        payload.password = "";
        payload.mobile = "";
      }
      payload.order = key;
      if (!payload.userType || payload.userType === "GUEST") {
        let value = "";
        const request = async () => {
          const response = await fetchWithTimeout(
            API_BASE_URL + `/ent/v1/user-type?user-emails=${recipient.email}`,
            {
              method: API_METHODS.GET,
              headers: AuthHeader(),
              timeout: configConstants.readTimeout,
            }
          );
          const json = await response.json();
          return json;
        };
        request()
          .then((value) => {
            if (
              value &&
              value.data &&
              value.data.length > 0 &&
              value.data[0]["member_type"] &&
              value.data[0]["email"] === payload.email
            ) {
              payload.userType = recipient.userType
                ? recipient.userType
                : value.data[0]["member_type"]
                ? value.data[0]["member_type"]
                : "GUEST";
              payload.recipientCID = recipient.recipientCID
                ? recipient.recipientCID
                : value.data[0]["Ent"].length > 0 &&
                  value.data[0]["Ent"][0]["cid"]
                ? value.data[0]["Ent"][0]["cid"]
                : "";
            } else {
              payload.userType = recipient.userType
                ? recipient.userType
                : "GUEST";
            }
          })
          .catch((error) => {
            payload.userType = recipient.userType
              ? recipient.userType
              : "GUEST";
          });
      }
      const existingPayload = [...recipientList];
      existingPayload.push(payload);
      data = [...existingPayload];
    } else {
      data = [...newList];
    }
    dispatch(setESignRecipientList(data));
    reset();
  };

  const orderHandler = (e) => {
    dispatch({ type: ESIGN_ORDER_ENABLED, payload: !showOrder });
    setOrderVisibility(!showOrder);
  };

  const onOrderChange = (data) => {
    const state = [...recipientOrder];
    const filtered = state.filter((x) => x.index === data.index);
    const rest = state.filter((x) => x.index !== data.index);
    const tempSequence = filtered[0].sequence;
    filtered[0].sequence = data.sequence;
    rest.map((val) => {
      if (data.sequence === val.sequence) {
        val.sequence = tempSequence;
        return val;
      }
    });
    const merged = [...rest, ...filtered];
    merged.sort((a, b) => (a.index > b.index ? 1 : b.index > a.index ? -1 : 0));
    dispatch(setESignRecipientOrder([...merged]));
    // setRecipient([...merged]);
  };
  const addRecipient = () => {
    if (checkValidation()) {
      reset();
      if (recipientOrder?.length < 5) {
        const state = [...recipientOrder];
        (state || []).map((x) => {
          const nw = [...x.total];
          nw.push(x.total.length + 1);
          x.total = [...nw];
          return x;
        });
        state.push({
          total: [...state[0].total],
          sequence: state.length + 1,
          index: state.length + 1,
        });
        dispatch(setESignRecipientOrder([...state]));
        // setRecipient([...state]);
      } else {
        setLimitationModal(true);
      }
    }
  };

  const nextHandler = () => {
    if (checkValidation()) {
      props.nextHandler(recipientList.length > 0);
    }
  };
  const backHandler = () => {
    props.backHandler();
  };
  const leaveHandler = () => {
    props.leaveHandler();
  };

  const rearrangelist = (state) => {
    (state || []).map((x) => {
      if (x.order !== 1 && x.order >= state.length) {
        x.order = x.order - 1;
      }
      return x;
    });
    return state;
  };

  const rearrangeOrder = (state) => {
    const local = [];
    (state || []).forEach((x) => {
      if (x.index !== 1 && x.index >= state.length) {
        x.index = x.index - 1;
      }
      if (x.sequence !== 1 && x.sequence >= state.length) {
        x.sequence = x.sequence - 1;
      }
      const total = [...Array(state.length + 1).keys()];
      local.push({
        total: [...total.filter((y) => y !== 0)],
        sequence: x.sequence,
        index: x.index,
      });
    });
    return local;
  };

  const onRecipientRemove = (index) => {
    const stateList = [...recipientList];
    if (stateList?.length > 0) {
      const filteredList = stateList.filter((x) => x.order !== index);
      const list = rearrangelist(filteredList);
      dispatch(setESignRecipientList([...list]));
    }
    const state = [...recipientOrder];
    if (state?.length > 0) {
      const filtered = state.filter((x) => x.index !== index);
      const order = rearrangeOrder(filtered);
      dispatch(setESignRecipientOrder([...order]));
    }
  };

  return (
    <div className="container-view">
      <div
        className="mon-custom-scrollbar scrollable-container"
        style={{ margin: "8px 4px 0 0" }}
      >
        <div className="rec-subject">
          <div className="rec-subj-header">{t("esign:recipient:sender")}</div>
          <div className="rec-subj-body">
            <div className="rec-subj-body-left">{props?.senderName}</div>
            <div className="rec-subj-body-right">{props?.senderEmail}</div>
          </div>
        </div>
        <div className="recipient-sub-header">
          <div className="recipient-sub-header-left">
            {t("esign:recipient:recipient")}
          </div>
          {/* {recipient.length > 1 && <div className='recipient-sub-header-right'>
            <input className="radio-icon" style={{ background: '#00A95B' }} type="radio" onClick={orderHandler} value="signingOrder" />
            <label className="radio-text" for="signingOrder">{t("esign:recipient:set-signing")}</label>
          </div>} */}
          {recipientOrder.length > 1 && (
            <div className="recipient-sub-header-right">
              <div className="custom-radio">
                {showOrder ? (
                  <img
                    style={{ marginRight: "8px" }}
                    src={SignatureIcon}
                    alt="signature"
                    onClick={orderHandler}
                  />
                ) : (
                  <input
                    type={"radio"}
                    id="signingOrder"
                    name="signingOrder"
                    checked={showOrder}
                    onClick={orderHandler}
                    value="signingOrder"
                  />
                )}

                <label
                  className={`signing-order-label ${
                    showOrder && `signing-label-active`
                  }`}
                  htmlFor="signingOrder"
                >
                  {t("esign:recipient:set-signing")}
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="recipient-user-container">
          {(recipientOrder || []).map((rec, index) => (
            <AddUser
              recipientList={recipientList}
              key={index}
              data={recipientOrder.length > 1 && showOrder ? rec : null}
              user={recipientList[index] ? recipientList[index] : {}}
              emitData={emitHandler}
              orderChange={onOrderChange}
              index={rec?.index}
              reset={reset}
              recipientCount={recipientOrder.length || 0}
              deleteRecipient={onRecipientRemove}
            />
          ))}
          {!isValid.valid && (
            <div className="dv-required" style={{ whiteSpace: "pre" }}>
              {isValid.msg}
            </div>
          )}
          <div className="btn-add-rec1">
            <img src={PlusCircle} alt="plus circle" />
            <input
              className="btn-add-rec"
              type="button"
              value="Add members"
              onClick={addRecipient}
            />
          </div>
        </div>
      </div>

      <SignatureFooter
        next={nextHandler}
        back={backHandler}
        leave={leaveHandler}
        currentStep={props.currentStep}
        isOnlySigner={props.isOnlySigner}
      />

      {showLimitationModal && (
        <RecipientLimitationModal
          show={showLimitationModal}
          cancel={() => setLimitationModal(false)}
          okay={() => setLimitationModal(false)}
        />
      )}
    </div>
  );
};
export default RecipientView;
