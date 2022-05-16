import React from "react";
import { useTranslation } from "react-i18next";
import Button from "react-bootstrap/Button";
import "./signature-footer.css";

const SignatureFooter = (props) => {
  const { t } = useTranslation();
  const backHandler = () => {
    props.back();
  };
  const nextHandler = () => {
    props.next();
  };
  const leaveHandler = () => {
    props.leave();
  };

  return (
    <div className="rec-footer">
      <div className="btn-left-footer">
        <Button
          onClick={leaveHandler}
         
          className="btn btn-text-leave"
        >
          {t("esign:recipient:leave")}
        </Button>
      </div>
      <div className="btn-right-footer">
        {props.currentStep > 1 && (
          <Button onClick={props.isOnlySigner ? undefined : backHandler} disabled={props.isOnlySigner} className={`btn btn-text-leave ${props.isOnlySigner ? "disabled" : ""}`}>
            {t("esign:recipient:back")}
          </Button>
        )}
        <Button
          onClick={nextHandler}
          variant="primary"
          className={"btn-next"}
          disabled={props.inactive}
        >
          {props.currentStep < 3 && t("esign:recipient:next")}

          {props.currentStep === 3 && t("esign:review:send")}
        </Button>
      </div>
    </div>
  );
};
export default SignatureFooter;
