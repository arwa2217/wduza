import React, { useState } from "react";
import "./settingsListHeader.css";
import { useDispatch, useSelector } from "react-redux";
// import Filter from "../../assets/icons/filter_nor_union.svg";
// import FilterNor from "../../assets/icons/filter-nor.svg";

// import inactiveFilter from "../../assets/icons/filter-inactive-bookmark.svg";
import searchIcon from "../../../assets/icons/search-icon-black.svg";
// import union from "../../assets/icons/union.png";
import subtract from "../../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";

// import closeWhite from "../../assets/icons/close-white.svg";
// import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";

function SettingsListHeader(props) {
  const { t, i18n } = useTranslation();

  const currentUser = useSelector((state) => state.AuthReducer.user);
  let title = `Settings`;
  const [inputs, setInputs] = useState("");
  const [
    isUpdatedHeaderDiscussionVisible,
    setUpdatedHeaderDiscussionVisiblity,
  ] = useState(false);

  let { name } = inputs;
  function filterDiscussion() {
    // need to update
    // props.toggleFilter();
  }
  function searchDiscussionList(e) {
    props.handleNameChange(e.target.value);
  }

  const onClosehandler = (e) => {
    // need to update
    props.resetInputValue(e);
    setUpdatedHeaderDiscussionVisiblity(false);
  };

  const updatedDiscussionHeader = (
    <div className="files-header-outer-container">
      <div className="image-container">
        <img
          src={searchIcon}
          alt="search"
          // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}
          // className="image"
        />
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

  const defaultHeader = (
    <div className="files-header-outer-container">
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
    <div id="files-list-header-id" className="files-list-header">
      {defaultHeader}
    </div>
  );
}

export default SettingsListHeader;
