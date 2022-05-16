import React, { useState } from "react";
import "./e-signatureListHeader.css";
import { useSelector } from "react-redux";

import searchIcon from "../../assets/icons/search-icon-black.svg";
import subtract from "../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";

function ESignatureListHeader(props) {
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.AuthReducer.user);
  let title = `Monoly, Inc`;
  const [
    isUpdatedHeaderDiscussionVisible,
    setUpdatedHeaderDiscussionVisiblity,
  ] = useState(false);

  const onClosehandler = (e) => {
    // need to update
    props.resetInputValue(e);
    setUpdatedHeaderDiscussionVisiblity(false);
  };

  const updatedDiscussionHeader = (
    <div className="esign-header-outer-container">
      <div className="image-container">
        <img src={searchIcon} alt="search" />
      </div>
      <div className="inner-container">
        <input
          onChange={props.handleSearchDiscussion}
          placeholder={t("files:search.folder.filter")}
          maxLength="80"
          value={props.value}
          className="input-middle"
          autoFocus
        />
        <img
          src={subtract}
          alt="subtract"
          onClick={(e) => onClosehandler(e)}
          className="cross-image"
        />
      </div>
    </div>
  );

  const defaultDiscussionHeader = (
    <div className="esign-header-outer-container">
      <div className="inner-container">
        <span className="title">{title}</span>
        {/* <div>
          <img
            src={searchIcon}
            alt="searchIcon"
            className="image"
            onClick={() => setUpdatedHeaderDiscussionVisiblity(true)}
          />
        </div> */}
      </div>
    </div>
  );

  return (
    <div id="esign-list-header-id" className="esign-list-header">
      {isUpdatedHeaderDiscussionVisible
        ? updatedDiscussionHeader
        : defaultDiscussionHeader}
    </div>
  );
}

export default ESignatureListHeader;
