import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./signature-header.css";
import lineIcon from "../../../assets/icons/line.svg";

const SignatureHeader = (props) => {
  const { currentStep, totalSteps, header, stepIn, isOnlySigner } = props;
  const recipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const recipientOrder = useSelector(
    (state) => state.esignatureReducer.recipientOrder
  );
  const stephandler = (count) => {
    if (checkValidation()) {
      if (props?.onlySigner) {
        if (count !== 1) {
          stepIn(count);
        }
      } else {
        stepIn(count);
      }
    }
    /*if (step !== count) {
            setStep(count);
            props.newStep(count);
        }*/
  };

  function checkValidation() {
    let error = false;
    const rec = [...recipientList];
    if (rec?.length && rec?.length === recipientOrder?.length) {
      const nameEmpty = (rec || []).some((x) => x.name === "");
      const emailEmpty = (rec || []).some((x) => x.email === "");
      if (nameEmpty || emailEmpty) {
        //
      } else {
        error = true;
      }
    }
    return error;
  }
  return (
    <div className="rec-header-container">
      {/* <div className="rec-header-title">{header}</div> */}
      <div className="rec-step-count-wrapper">
        {[...Array(totalSteps).keys()].map((x, i) => (
          <>
            <div className="step-detail">
              <div
                onClick={() =>
                  !(props?.isOnlySigner && x === 0) && stephandler(x + 1)
                }
                style={
                  currentStep === x + 1
                    ? { background: "#03BD5D", color: "#FFFFFF" }
                    : {
                        background: "#fff",
                        color: "#000",
                        border: "1px solid rgba(0, 0, 0, 0.3)",
                      }
                }
                className="rec-step-count"
              >
                {x + 1}
              </div>
              <div
                className={`rec-step-count-label ${
                  currentStep === x + 1 && `step-active`
                }`}
              >
                {x == 0
                  ? `Select recipients`
                  : x == 1
                  ? `Prepare documents`
                  : `Review and Send`}
              </div>{" "}
            </div>
            {x < 2 && (
              <div className="step-line">
                <img src={lineIcon} />
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};
export default SignatureHeader;
