import React from "react";
import LoadingOutLook from "../../assets/icons/loading-mail.svg";
import "./outlook-loading.css";
const OutLookLoading = () => {
  return (
    <div className="outlook-loading">
      <img src={LoadingOutLook} alt="loading-outlook" />
    </div>
  );
};
export default OutLookLoading;
