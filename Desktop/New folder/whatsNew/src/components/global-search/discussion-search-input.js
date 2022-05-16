import React, { useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import InputGroup from "react-bootstrap/InputGroup";
import { GlobalSearchWrapper } from "./discussion-search-style";
import SearchIcon from "../../assets/icons/search-icon-primary.svg";
import close from "../../assets/icons/close.svg";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GetPostSearchListAction } from "../../store/actions/channelActions";
import {
  getSearchResultWithDiscussion,
  ClearDiscussionSearchResultAction,
} from "../../store/actions/admin-discussion-action";
import { updateSummaryPanelState } from "../../store/actions/config-actions";
import { POST_SEARCH } from "../../store/actionTypes/channelActionTypes";
import {
  UPDATE_LAST_DISCUSSION_SEARCH_QUERY,
  FETCH_DISCUSSION_SEARCH_DETAILS_CLEAR,
} from "../../store/actionTypes/admin-discussion-action-types";
import {
  getAllUser,
  getUserByName,
  getUserByNameAndChannelId,
  getUsersByChannelId,
} from "../../utilities/caching/db-helper";
import GlobalSearchSuggestion from "../modal/channel/global-search-suggestions";
import Autosuggest from "react-autosuggest";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import { useEffect } from "react";

import { showToast } from "../../store/actions/toast-modal-actions";
import { updateDeleteStatus } from "../../store/actions/main-files-actions";
import SuggestionsEmail from "../modal/channel/Suggestions";
const DiscussionSearchInput = (props) => {
  let deleteFileSuccess = useSelector(
    (state) => state.mainFilesReducer.deleteFileSuccess
  );
  const myInputRef = useRef(null);
  const searchObject = useSelector(
    (state) => state.AdminDiscussionReducer.discussionFilterObj
  );
  const getSearchPostDetails = useSelector(
    (state) => state.ChannelReducer.getSearchPostDetails
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [value, setInputValue] = useState(
    searchObject?.value ? searchObject.value : ""
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  let [email, setEmailValue] = useState(
    searchObject?.email ? searchObject?.email : null
  );
  let [locked, setLocked] = useState(
    searchObject?.advanced?.includes("locked") ? true : false
  );
  let [deleted, setDeleted] = useState(
    searchObject?.advanced?.includes("deleted") ? true : false
  );
  let [status, setStatus] = useState(
    searchObject?.status ? searchObject.status : "all"
  );
  const [authorValue, setAuthorValue] = useState(
    searchObject?.authorValue ? searchObject.authorValue : ""
  );
  const [exact, setExact] = useState(false);
  const postSearchDetailsList = useSelector(
    (state) => state.ChannelReducer?.getSearchPostList
  );
  const [suggestions, setSuggestions] = useState(postSearchDetailsList || []);
  const summaryPanelActive = useSelector(
    (state) => state.config.summaryPanelActive
  );

  let [advanced, setAdvanced] = useState(
    searchObject?.advanced ? searchObject.advanced : ""
  );

  const searchAccountEnabled = useSelector(
    (state) => state.AdminDiscussionReducer.searchAccountEnabled
  );

  useEffect(() => {
    setAdvanced(searchObject?.advanced ? searchObject.advanced : "");
    setAuthorValue(searchObject?.authorValue ? searchObject.authorValue : "");
    setEmailValue(searchObject?.email ? searchObject.email : "");

    setStatus(searchObject?.status ? searchObject.status : "all");
  }, [searchObject]);

  useEffect(() => {
    if (getSearchPostDetails && getSearchPostDetails.length > 0) {
      setShowAdvanced(false);
    }
  }, [getSearchPostDetails]);
  const onSuggestionsFetchRequested = ({ value }) => {
    if (value?.length > 1) {
      dispatch(GetPostSearchListAction(value, props.channelId));
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  useEffect(() => {
    setInputValue(searchObject?.value ? searchObject.value : value);
  }, [searchObject]);

  useEffect(() => {
    if (!searchAccountEnabled) {
      setInputValue("");
    }
  }, [searchAccountEnabled]);

  const getSuggestionValue = (suggestion) => {
    if (value.indexOf("'") >= 0 || value.indexOf('"') >= 0) {
      setExact(true);
    }
    setInputValue(suggestion);
    getSearchResult();
    return `${suggestion}`;
  };

  const renderSuggestion = (suggestion, { query }) => {
    let suggestionText = "";
    if (props.channelId !== undefined) {
      suggestionText = `${
        suggestion.length > 64
          ? `${suggestion.substring(0, 64)}...`
          : suggestion
      }`;
    } else {
      suggestionText = `${
        suggestion.length > 100
          ? `${suggestion.substring(0, 100)}...`
          : suggestion
      }`;
    }

    query = query.replace(
      new RegExp(`(${/\{|\[|\}|\]|\(|\)|\\|\//})`, "gi"),
      "|\\$1|"
    );
    query = query.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
    query = query.replace(/[{()}]/g, "");

    var regex = new RegExp("(" + query + ")", "gi");
    var match = suggestionText.match(regex);

    if (match != null) {
      const className = "highlight";
      let newSuggestionText = suggestionText.replace(
        new RegExp(`(${match[0]})`, "ig"),
        `<span class=${className}>$1</span>`
      );
      return (
        <>
          <div dangerouslySetInnerHTML={{ __html: newSuggestionText }} />
        </>
      );
    } else {
      return <div>{suggestionText}</div>;
    }
  };
  const onChangeEvent = (event, { newValue, method }) => {
    if (newValue.length > 1) {
      setShowAdvanced(true);
    }
    // if (props.channelId !== undefined) {
    //   setInputValue(
    //     newValue.length > 64 ? `${newValue.substring(0, 64)}` : newValue
    //   );
    // } else {
    setInputValue(
      newValue.length > 100 ? `${newValue.substring(0, 100)}` : newValue
    );
    // }
  };
  const onBlurEvent = (event) => {
    event.preventDefault();
    if (value === "") {
      // setSearchToggle(!searchToggle);
    }
  };
  const updateOnFocus = () => {
    setShowAdvanced(true);
  };
  const inputProps = {
    placeholder: props.placeholder,
    value: value,
    onChange: onChangeEvent,
    onBlur: onBlurEvent,
    className: "form-control pointer-on-hover",
    ref: myInputRef,
    onKeyUp: handleKeyUpEvent,
    onClick: updateOnFocus,
    autoFocus: true,
  };
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (props.channelId === undefined) {
      getAllUser().then((res) => {
        var tempMembers = [...members];
        res.map((userData) => {
          if (tempMembers.indexOf(userData) === -1) {
            tempMembers.push(userData.user);
          }
          return true;
        });
        setMembers(tempMembers);
        setUsers(tempMembers);
      });
    } else {
      getUsersByChannelId(props.channelId).then((res) => {
        var tempMembers = [...members];
        res.map((userData) => {
          if (tempMembers.indexOf(userData) === -1) {
            tempMembers.push(userData.user);
          }
          return true;
        });
        setMembers(tempMembers);
        setUsers(tempMembers);
      });
    }
  }, []);

  const resetInputValue = (event) => {
    event.preventDefault();
    setInputValue("");
    setDeleted(false);
    setLocked(false);
  };

  const removeFirstCharacter = (value) => {
    if (value?.length > 0 && value.charAt(0) === "@") {
      let newValue = value.substring(1);
      return newValue;
    }
    return value;
  };

  useEffect(() => {
    if (searchAccountEnabled) {
      if (deleteFileSuccess === false)
        dispatch(showToast(t("files:delete.fail")), 3000);
      else if (deleteFileSuccess) {
        dispatch(showToast(t("files:delete.success"), 3000, "success"));
        getSearchResult();
      }
      dispatch(updateDeleteStatus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFileSuccess, searchAccountEnabled]);

  async function getSearchResult() {
    let advanceString = "";
    let advanced = [];
    if (deleted) {
      advanced.push("deleted");
    }
    if (locked) {
      advanced.push("locked");
    }
    if (advanced.length) {
      advanceString = advanced.join(",");
    }

    if (props.channelId !== undefined && !summaryPanelActive) {
      dispatch(updateSummaryPanelState(true));
    }
    if (props.channelId !== undefined) {
      setTimeout(() => {
        dispatch({ type: POST_SEARCH });
      }, 200);
    }
    var authorData = "";
    if (
      authorValue &&
      authorValue.id === undefined &&
      authorValue.name === undefined
    ) {
      var author = undefined;
      if (props.channelId === undefined) {
        author = await getUserByName(removeFirstCharacter(authorValue));
      } else {
        author = await getUserByNameAndChannelId(
          removeFirstCharacter(authorValue),
          props.channelId
        );
      }
      authorData = author ? author : undefined;
    } else {
      authorData = authorValue === undefined ? "" : authorValue;
    }
    dispatch({
      type: UPDATE_LAST_DISCUSSION_SEARCH_QUERY,
      payload: {
        ...{
          value,
          authorValue: authorData,
          emailValue: email,
          advanced: advanceString,
          status,
          ...searchObject.orderby,
          ...searchObject.order,
        },
      },
    });

    dispatch(
      getSearchResultWithDiscussion({
        value,
        authorValue:
          authorData !== undefined
            ? authorData.id
              ? authorData.id
              : ""
            : undefined,
        emailValue: email !== undefined ? (email ? email : "") : undefined,
        advanced: advanceString,
        status,
        orderby: searchObject.orderby,
        order: searchObject.order,
      })
    );
  }

  function handleKeyUpEvent(e) {
    if (e.key === "Backspace" && value && value.length > 0) {
      dispatch(ClearDiscussionSearchResultAction());
      // clearSearchFields();
      getSearchResult();
    } else if (e.key === "Backspace" && value.length === 0) {
      dispatch(ClearDiscussionSearchResultAction());
      // clearSearchFields();
      setInputValue("");
    }
    if (e.key === "Enter") {
      setInputValue(value.trim());
      setInputValue(
        value.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, "")
      );
      setInputValue(value.replace(/[{()}]/g, ""));
      if (value !== undefined && value.length >= 0) {
        if (value.indexOf("'") > 0 || value.indexOf('"') > 1) {
          setExact(true);
        }
        !isSearchDisabled() && getSearchResult();
        setShowAdvanced(!showAdvanced);
      }
    }
  }
  function isSearchDisabled() {
    if (
      value === "" &&
      status === "all" &&
      email === "" &&
      authorValue === "" &&
      deleted === false &&
      locked === false
    ) {
      return true;
    }
    return false;
  }

  let shareButtonClass = {
    className: isSearchDisabled()
      ? "btn btn-outline-primary btn-search disabled"
      : "btn btn-outline-primary btn-search",
  };
  const setAdvanceDiscussion = (e, value) => {
    if (value === "deleted") {
      setDeleted(deleted ? false : true);
    } else if (value === "locked") {
      setLocked(locked ? false : true);
    }
  };

  return (
    <>
      <GlobalSearchWrapper>
        <div className={`search-container active open`}>
          <img alt="Search" src={SearchIcon} className="icon-search" />
          <InputGroup
            style={
              props.channelId === undefined
                ? // value === ""
                  //   ? { borderColor: "#999" }
                  //   :
                  { borderColor: "#03BD5D" }
                : { border: "none" }
            }
          >
            <div
              className="search-input"
              style={
                value !== "" ||
                status !== "all" ||
                email !== "" ||
                authorValue !== "" ||
                deleted !== false ||
                locked !== false
                  ? { width: "calc(100% - 64px)" }
                  : { width: "calc(100% - 40px)" }
              }
            >
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              />
            </div>
            <InputGroup.Append>
              {(value !== "" ||
                status !== "all" ||
                email !== "" ||
                authorValue !== "" ||
                deleted !== false ||
                locked !== false) && (
                <img
                  alt="Close"
                  src={close}
                  className="icon-close 1st"
                  onClick={(e) => {
                    resetInputValue(e);
                    dispatch({ type: FETCH_DISCUSSION_SEARCH_DETAILS_CLEAR });
                    // props.onCancelClick(false);
                  }}
                />
              )}
              <Dropdown
                onToggle={(e) => {
                  setShowAdvanced(!showAdvanced);
                }}
                show={showAdvanced}
                drop="down"
              >
                <Dropdown.Toggle
                  key="down"
                  id={`dropdown-button-drop-down`}
                  drop="down"
                  variant=""
                  title=""
                />
                <DropdownMenu
                  style={
                    props.channelId !== undefined
                      ? { padding: "0px", marginTop: "5px" }
                      : {
                          padding: "0px",
                        }
                  }
                  className={
                    props.channelId !== undefined
                      ? "local-search-dropdown-menu"
                      : "global-search-dropdown-menu"
                  }
                >
                  <div className="search-content-1">
                    <div className="owner-content">
                      <div className="select-owner-content">
                        <label className="search-label form-label col-form-label">
                          {t("discussion.search:owner")}
                        </label>
                        <div
                          className="author-suggestions-content local-content"
                          style={{
                            marginLeft: "40px",
                          }}
                        >
                          <GlobalSearchSuggestion
                            handleChange={(member) => {
                              setAuthorValue(member);
                            }}
                            className={"member-add-input form-control"}
                            name="author"
                            members={members}
                            useCachedData={true}
                            isAtRequired={true}
                            placeholder=""
                            value={
                              authorValue.screenName
                                ? authorValue.screenName
                                : authorValue
                            }
                          />
                        </div>
                      </div>
                      <div className="email-content">
                        <label className="search-label form-label col-form-label">
                          {t("discussion.search:email")}
                        </label>
                        <div
                          className="author-suggestions-content local-content"
                          style={{
                            marginLeft: "50px",
                          }}
                        >
                          <SuggestionsEmail
                            showUserAffiliation={true}
                            handleChange={setEmailValue}
                            className={
                              "member-add-input form-control" +
                              " member-add-input-active"
                            }
                            type="email"
                            name="email"
                            value={email}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="advance-content">
                      <label className="search-label form-label col-form-label">
                        {t("discussion.search:advanced")}
                      </label>
                      <div
                        className="author-suggestions-content local-content"
                        style={{
                          marginLeft: "22px",
                          display: "flex",
                        }}
                      >
                        <div className="custom-control custom-checkbox custom-checkbox-green">
                          <input
                            type="checkbox"
                            className="custom-control-input custom-control-input-green"
                            id="locked-activity"
                            checked={locked}
                            onChange={(e) => {
                              setAdvanceDiscussion(e, "locked");
                            }}
                          />
                          <label
                            className="custom-control-label pointer-on-hover"
                            htmlFor="locked-activity"
                          >
                            {t("discussion.search:lockable")}
                          </label>
                        </div>
                        <div
                          className="custom-control custom-checkbox custom-checkbox-green"
                          style={{ marginLeft: "20px" }}
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input custom-control-input-green"
                            id="deleted-activity"
                            checked={deleted}
                            onChange={(e) => {
                              setAdvanceDiscussion(e, "deleted");
                            }}
                          />
                          <label
                            className="custom-control-label pointer-on-hover"
                            htmlFor="deleted-activity"
                          >
                            {t("discussion.search:deletable")}
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="status-content">
                      <label className="global-search-scope">
                        {" "}
                        {t("discussion.search:status")}
                      </label>
                      <ToggleButtonGroup
                        type="radio"
                        name="activity"
                        defaultValue={status}
                        value={status}
                        onChange={(e) => setStatus(e)}
                        style={{
                          marginLeft: "40px",
                        }}
                      >
                        <ToggleButton variant="outline-secondary" value="all">
                          {t("global.search:all")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="inactive"
                        >
                          {t("discussion.search:inactive")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="active"
                        >
                          {t("discussion.search:active")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="locked"
                        >
                          {t("discussion.search:locked")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="deleted"
                        >
                          {t("discussion.search:deleted")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="deleting"
                        >
                          {t("discussion.search:deleting")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                  <Dropdown.Divider style={{ marginTop: "-40px" }} />

                  <div className="search-btn">
                    <button
                      onClick={(e) => {
                        return (
                          isSearchDisabled() ? undefined : getSearchResult(),
                          setShowAdvanced(false)
                        );
                      }}
                      className={shareButtonClass.className}
                    >
                      {t("global.search:search")}
                    </button>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </InputGroup.Append>
          </InputGroup>
        </div>
      </GlobalSearchWrapper>
    </>
  );
};

export default DiscussionSearchInput;
