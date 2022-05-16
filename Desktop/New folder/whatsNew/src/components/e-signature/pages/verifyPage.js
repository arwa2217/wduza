import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./verifyPage.css";
import Logo from "../../../assets/icons/monoly-name-logo.svg";
import ESignatureServices from "../../../services/esignature-services";
import { useSelector } from "react-redux";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { phone as phoneVerify } from "phone";

function VerifyPage(props) {
  const { t } = useTranslation();
  //   const location = useLocation();
  // const code = !!(location?.state?.code);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const { fileId, verificationMode, email } = props.fileData;
  const [passcode, setPasscode] = useState("");
  const [phone, setPhone] = useState("");
  const [passcodeVerified, verifyPasscode] = useState(false);
  const [otpNotification, setOtpNotification] = useState({ type: "", msg: "" });
  const [err, setErr] = useState(true);
  const [passcodeError, setPasscodeError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const submitHandler = (action) => {
    if (passcode) {
      setPasscodeError("");
      let postObj = {
        file_id: fileId,
        email: currentUser.email ? currentUser.email : email,
        verificationMode,
        passcode,
      };
      if (verificationMode === "sms") {
        postObj.phoneNumber = phone.replace(phoneVerify(phone).countryCode, "");
        postObj.otp = passcode;
        delete postObj.passcode;
      }
      ESignatureServices.verifyPassCode(postObj).then((res) => {
        if (res.code === 2010) {
          props.setUserVerified(true);
          verifyPasscode(true);
        } else {
          setPasscodeError(
            res?.message ? res?.message : t("esign:verify:passcode:error")
          );
        }
      });
    }
  };

  const passcodeHandler = (e) => {
    setPasscode(e.target.value);
    // if (e?.target?.value) {
    // }
  };

  const phoneHandler = (e) => {
    setPhone(e && e.toString().charAt(0) === "+" ? e : "+" + e);
  };

  const sendOtpHandler = () => {
    if (phone && phoneVerify(phone).isValid) {
      setOtpLoading(true);
      ESignatureServices.generateOtpEsign(
        {
          phoneNumber: phone.replace(phoneVerify(phone).countryCode, ""),
          countryCode: phoneVerify(phone).countryCode,
        },
        fileId
      )
        .then((res) => {
          setOtpLoading(false);
          if (res.code === 4020) {
            setOtpNotification({
              type: "error",
              msg: res?.message ?? "Something went wrong",
            });
          } else if (res.code === 40038) {
            setOtpNotification({
              type: "error",
              msg: res?.message ?? "Something went wrong",
            });
          } else {
            setOtpNotification({
              type: "success",
              msg: "OTP also sent on your email",
              // type: res?.message ? "error" : "success",
              // msg: res?.message ?? "OTP sent successfully!",
            });
          }
        })
        .catch((res) => {
          setOtpNotification({
            type: "error",
            msg: res?.message ?? "Something went wrong",
          });
        });
    } else {
      setOtpNotification({
        type: "error",
        msg: t("esign:verify:phone:validation"),
      });
    }
  };
  return (
    <div className="modal-w-verify">
      {verificationMode === "passcode" ? (
        <Modal.Dialog centered className="mt-0">
          <Modal.Header className="modal-passcode-header">
            <img src={Logo} alt="" className="verify-img" />
          </Modal.Header>
          <Modal.Body className="modal-passcode-body">
            <div className="modal-title2-verify">
              {t("esign:verify:passcode:title")}
            </div>
            {currentUser.userType == "INTERNAL" ? (
              <div className="modal-body-verify">
                {t("esign:verify:passcode:internal-user-message")}
              </div>
            ) : (
              <div className="modal-body-verify">
                {t("esign:verify:passcode:external-user-message")}
              </div>
            )}
            <div class="modal-content2">
              <input
                autoComplete="off"
                value={passcode}
                onChange={passcodeHandler}
                className="user-input"
                placeholder={t("esign:recipients:passcode")}
                type="text"
                name="passcode"
              />
              {passcodeError && (
                <p className="passcode-error">{passcodeError}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-sm-footer">
            <Button
              disabled={!passcode}
              onClick={() => submitHandler("CONTINUE")}
              className="btn-add"
              variant="primary"
            >
              {t("esign:verify:passcode:continue")}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      ) : (
        <Modal.Dialog centered className="mt-0">
          <Modal.Header className="modal-passcode-header">
            <img src={Logo} alt="" className="verify-img" />
          </Modal.Header>
          <Modal.Body className="modal-passcode-body">
            <div className="modal-title2-verify">
              {t("esign:verify:phone:title")}
            </div>
            {currentUser.userType == "INTERNAL" ? (
              <div className="modal-body-verify">
                {t("esign:verify:phone:internal-user-message")}
              </div>
            ) : (
              <div className="modal-body-verify">
                {t("esign:verify:phone:external-user-message")}
              </div>
            )}
            <div class="modal-content3">
              <div className="w-100">
                <div style={{ display: "flex", height: "26px" }}>
                  <PhoneInput
                    country={"kr"}
                    preferredCountries={["kr", "in", "us"]}
                    value={phone}
                    onChange={phoneHandler}
                    name="phone"
                    enableSearch={true}
                    placeholder={t("esign:verify:phone:text")}
                    countryCodeEditable={true}
                    prefix="+"
                    preserveOrder={["preferredCountries"]}
                  />
                  {!phone ? (
                    <p className="otp-send-btn">
                      {t("esign:verify:phone:send")}
                    </p>
                  ) : (
                    //add loader
                    //   otpLoading ? (
                    // <img alt="loader" src="/loading.gif" width="30" />
                    //   ) :
                    <p
                      onClick={sendOtpHandler}
                      className="otp-send-btn send-btn"
                    >
                      {t("esign:verify:phone:send")}
                    </p>
                  )}
                </div>
                {otpNotification.msg && (
                  <p className={`passcode-${otpNotification.type}`}>
                    {otpNotification.msg}
                  </p>
                )}
              </div>
            </div>
            <div class="modal-content2" style={{ marginTop: "20px" }}>
              <input
                autoComplete="off"
                value={passcode}
                onChange={passcodeHandler}
                className="user-input"
                placeholder={t("esign:recipients:passcode")}
                type="text"
                name="passcode"
              />
              {passcodeError && (
                <p className="passcode-error">{passcodeError}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-sm-footer">
            <Button
              disabled={!passcode}
              onClick={() => submitHandler("CONTINUE")}
              className="btn-add"
              variant="primary"
            >
              {t("esign:verify:passcode:continue")}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      )}
    </div>
  );
}

export default VerifyPage;
