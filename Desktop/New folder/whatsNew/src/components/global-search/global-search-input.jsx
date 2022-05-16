import React, { useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import { GlobalSearchWrapper } from "./global-search-style";
import SearchIcon from "../../assets/icons/search-icon-primary.svg";
import ValueConstants from "../../constants/rest/value-constants";
import close from "../../assets/icons/close.svg";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  ClearPostSearchResultAction,
  GetPostSearchListAction,
  getSearchResultWithFilter,
} from "../../store/actions/channelActions";
import { updateSummaryPanelState } from "../../store/actions/config-actions";
import {
  POST_SEARCH,
  UPDATE_LAST_SEARCH_QUERY,
} from "../../store/actionTypes/channelActionTypes";
import {
  getAllUser,
  getUserByName,
  getUserByNameAndChannelId,
  getUsersByChannelId,
} from "../../utilities/caching/db-helper";
import GlobalSearchSuggestion from "../modal/channel/global-search-suggestions";
import Autosuggest from "react-autosuggest";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import todo from "../../assets/icons/task-modal-icons/to-do.svg";
import assign from "../../assets/icons/task-modal-icons/assign.svg";
import done from "../../assets/icons/task-modal-icons/done.svg";
import pending from "../../assets/icons/task-modal-icons/pending.svg";
import inProgress from "../../assets/icons/task-modal-icons/inProgress.svg";
import canceled from "../../assets/icons/task-modal-icons/canceled.svg";

import activeTodo from "../../assets/icons/task-modal-icons/active-todo.svg";
import activeAssign from "../../assets/icons/task-modal-icons/active-assign.svg";
import activeDone from "../../assets/icons/task-modal-icons/active-done.svg";
import activePending from "../../assets/icons/task-modal-icons/active-pending.svg";
import activeProgress from "../../assets/icons/task-modal-icons/active-progress.svg";
import activeCancel from "../../assets/icons/task-modal-icons/active-cancel.svg";
import { useEffect } from "react";
import { taskConstants } from "../../constants/task";
const GlobalSearchInput = (props) => {
  const myInputRef = useRef(null);
  const searchObject = useSelector(
    (state) => state.ChannelReducer.currentSearchFilter
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
  const [tagFilter, setTagFilter] = useState(
    searchObject?.tagFilter ? searchObject.tagFilter : "all"
  );
  const [saveFilter, setSaveFilter] = useState(
    searchObject?.saveFilter ? searchObject.saveFilter : false
  );
  const [fileFilter, setFileFilter] = useState(
    searchObject?.fileFilter ? searchObject.fileFilter : "all"
  );
  const [taskImageActive, setTaskImageActive] = useState(false);
  const [target, setTarget] = useState("all");
  const [assignImageActive, setAssignImageActive] = useState(false);
  const [inprogressImageActive, setInprogressImageActive] = useState(false);
  const [doneImageActive, setDoneImageActive] = useState(false);
  const [pendingImageActive, setPendingImageActive] = useState(false);
  const [canceledImageActive, setCanceledImageActive] = useState(false);
  const [taskFilter, setTaskFilter] = useState(
    searchObject?.taskFilter ? searchObject.taskFilter : "all"
  );
  const [authorValue, setAuthorValue] = useState(
    searchObject?.authorValue ? searchObject.authorValue : ""
  );
  const [assigneeValue, setAssigneeValue] = useState(
    searchObject?.assigneeValue ? searchObject.assigneeValue : ""
  );
  const [mentionedValue, setMentionedValue] = useState(
    searchObject?.mentionedValue ? searchObject.mentionedValue : ""
  );
  const [exact, setExact] = useState(false);
  const postSearchDetailsList = useSelector(
    (state) => state.ChannelReducer?.getSearchPostList
  );
  const [suggestions, setSuggestions] = useState(postSearchDetailsList || []);
  const summaryPanelActive = useSelector(
    (state) => state.config.summaryPanelActive
  );
  useEffect(() => {
    if (getSearchPostDetails && getSearchPostDetails.length > 0) {
      setShowAdvanced(false);
    }
  }, [getSearchPostDetails]);
  const onSuggestionsFetchRequested = ({ value }) => {
    if (value?.length > 1 && props.channelId !== undefined) {
      dispatch(GetPostSearchListAction(value, props.channelId));
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  useEffect(() => {
    setAuthorValue(searchObject?.authorValue ? searchObject.authorValue : "");
    setAssigneeValue(
      searchObject?.assigneeValue ? searchObject.assigneeValue : ""
    );
    setMentionedValue(
      searchObject?.mentionedValue ? searchObject.mentionedValue : ""
    );
    setTaskFilter(searchObject?.taskFilter ? searchObject.taskFilter : "all");
    setTagFilter(searchObject?.tagFilter ? searchObject.tagFilter : "all");
    setFileFilter(searchObject?.fileFilter ? searchObject.fileFilter : "all");
    setSaveFilter(searchObject?.saveFilter ? searchObject.saveFilter : false);
  }, [searchObject]);

  const langValue = localStorage.getItem(ValueConstants.CONTENT_LANGUAGE);
  useEffect(() => {
    setInputValue(searchObject?.value ? searchObject.value : value);
  }, [searchObject]);

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
    query = query.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[]\\\/]/gi, "");
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
    if (props.channelId !== undefined) {
      setInputValue(
        newValue.length > 64 ? `${newValue.substring(0, 64)}` : newValue
      );
    } else {
      setInputValue(
        newValue.length > 100 ? `${newValue.substring(0, 100)}` : newValue
      );
    }
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
      });
    }
  }, []);

  const resetInputValue = (event) => {
    event.preventDefault();
    setInputValue("");
  };

  const removeFirstCharacter = (value) => {
    if (value?.length > 0 && value.charAt(0) === "@") {
      let newValue = value.substring(1);
      return newValue;
    }
    return value;
  };

  async function getSearchResult() {
    if (props.channelId !== undefined && !summaryPanelActive) {
      dispatch(updateSummaryPanelState(true));
    }
    if (props.channelId !== undefined) {
      setTimeout(() => {
        dispatch({ type: POST_SEARCH });
      }, 200);
    }
    var authorData = "";
    var mentionData = "";
    var assigneeData = "";
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
    if (
      mentionedValue &&
      mentionedValue.id === undefined &&
      mentionedValue.name === undefined
    ) {
      var mention = "";
      if (props.channelId === undefined) {
        mention = await getUserByName(removeFirstCharacter(mentionedValue));
      } else {
        mention = await getUserByNameAndChannelId(
          removeFirstCharacter(mentionedValue),
          props.channelId
        );
      }
      mentionData = mention ? mention : undefined;
    } else {
      mentionData = mentionedValue === undefined ? "" : mentionedValue;
    }
    if (
      assigneeValue &&
      assigneeValue.id === undefined &&
      assigneeValue.name === undefined
    ) {
      var assignee = "";
      if (props.channelId === undefined) {
        assignee = await getUserByName(removeFirstCharacter(assigneeValue));
      } else {
        assignee = await getUserByNameAndChannelId(
          removeFirstCharacter(assigneeValue),
          props.channelId
        );
      }
      assigneeData = assignee ? assignee : undefined;
    } else {
      assigneeData = assigneeValue === undefined ? "" : assigneeValue;
    }
    dispatch({
      type: UPDATE_LAST_SEARCH_QUERY,
      payload: {
        ...{
          value,
          saveFilter,
          tagFilter,
          fileFilter,
          taskFilter,
          authorValue: authorData,
          mentionedValue: mentionData,
          assigneeValue: assigneeData,
        },
      },
    });

    dispatch(
      getSearchResultWithFilter(
        value,
        0,
        props.size === undefined ? 10 : props.size,
        props.channelId === undefined ? "" : props.channelId,
        exact,
        saveFilter,
        tagFilter,
        fileFilter,
        taskFilter,
        authorData !== undefined
          ? authorData.id
            ? authorData.id
            : ""
          : undefined,
        mentionData !== undefined
          ? mentionData.id
            ? mentionData.id
            : ""
          : undefined,
        assigneeData !== undefined
          ? assigneeData.id
            ? assigneeData.id
            : ""
          : undefined,
        target,
        true
      )
    );
  }

  function handleKeyUpEvent(e) {
    if (e.key === "Backspace" && value && value.length > 0) {
      dispatch(ClearPostSearchResultAction());
      getSearchResult();
    } else if (e.key === "Backspace" && value.length === 0) {
      dispatch(ClearPostSearchResultAction());
      setInputValue("");
    }
    if (e.key === "Enter") {
      setInputValue(value.trim());
      setInputValue(
        value.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>{}[]\\\/]/gi, "")
      );
      setInputValue(value.replace(/[{()}]/g, ""));
      if (value !== undefined && value.length >= 0) {
        if (value.indexOf("'") > 0 || value.indexOf('"') > 1) {
          setExact(true);
        }
        setShowAdvanced(!showAdvanced);
        !isSearchDisabled() && getSearchResult();
      }
    }
  }

  function isSearchDisabled() {
    if (
      value === "" &&
      tagFilter === "all" &&
      saveFilter === false &&
      taskFilter === "all" &&
      fileFilter === "all" &&
      mentionedValue === "" &&
      assigneeValue === "" &&
      authorValue === ""
    ) {
      return true;
    }
    return false;
  }
  function getAuthorSpacing(target, channelId, langVal) {
    if (target === "post") {
      if (langVal === "ko") {
        return "41px";
      } else {
        return "35px";
      }
    } else {
      if (langVal === "ko") {
        return "8px";
      } else {
        return "15px";
      }
    }
  }
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
                (value !== "" ||
                  mentionedValue !== "" ||
                  authorValue !== "" ||
                  assigneeValue !== "" ||
                  tagFilter !== "all" ||
                  fileFilter !== "all" ||
                  saveFilter !== false ||
                  taskFilter !== "all") &&
                props.channelId === undefined
                  ? { width: "calc(100% - 64px)" }
                  : { width: "calc(100% - 64px)" }
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
              <img
                width="0px"
                height="0px"
                className="icon-close"
                alt="Close"
                src={close}
              />
              {(value !== "" ||
                mentionedValue !== "" ||
                authorValue !== "" ||
                assigneeValue !== "" ||
                tagFilter !== "all" ||
                fileFilter !== "all" ||
                saveFilter !== false ||
                taskFilter !== "all") &&
                props.channelId === undefined && (
                  <img
                    alt="Close"
                    src={close}
                    className="icon-close"
                    onClick={(e) => {
                      dispatch(ClearPostSearchResultAction());
                      resetInputValue(e);
                    }}
                  />
                )}
              {props.channelId !== undefined && (
                <img
                  alt="Close"
                  src={close}
                  className="icon-close"
                  onClick={() => {
                    dispatch(ClearPostSearchResultAction());

                    props.onCancelClick(false);
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
                    <div className="target-content">
                      <label className="search-label form-label col-form-label">
                        {t("global.search:target")}
                      </label>

                      <div className="target-radio-btn-container">
                        <input
                          type="radio"
                          id="all"
                          style={{ display: "none" }}
                          name="target"
                          value="all"
                          checked={target === "all"}
                          className="target-radio-btn"
                          onChange={(e) => {
                            setAssigneeValue("");
                            setTarget(e.target.value);
                          }}
                        />
                         {" "}
                        <label
                          className="search-label form-label  target-radio-btn-label col-form-label"
                          htmlFor="all"
                        >
                          {t("global.search:all")}
                        </label>
                         
                        <input
                          type="radio"
                          id="post"
                          name="target"
                          style={{ display: "none" }}
                          value="post"
                          checked={target === "post"}
                          className="target-radio-btn"
                          onChange={(e) => {
                            setTarget(e.target.value);
                          }}
                        />
                        <label
                          className="search-label form-label  target-radio-btn-label col-form-label"
                          htmlFor="post"
                        >
                          {t("global.search:post")}
                        </label>
                         
                        <input
                          type="radio"
                          id="task"
                          name="target"
                          value="task"
                          checked={target === "task"}
                          style={{ display: "none" }}
                          className="target-radio-btn"
                          onChange={(e) => {
                            setMentionedValue("");
                            setTarget(e.target.value);
                          }}
                        />
                         
                        <label
                          className="search-label form-label  target-radio-btn-label col-form-label"
                          htmlFor="task"
                        >
                          {t("global.search:task")}
                        </label>
                      </div>
                    </div>
                    <div
                      className={
                        props.channelId !== undefined
                          ? ``
                          : `author-mention-content`
                      }
                    >
                      <div
                        className="author-content"
                        style={{
                          marginBottom:
                            props.channelId !== undefined || target !== "post"
                              ? "20px"
                              : "0px",
                        }}
                      >
                        <label className="search-label form-label col-form-label">
                          {" "}
                          {t("global.search:author")}
                          <br />
                          {target !== "post" && t("global.search:assigner")}
                        </label>
                        <div
                          className={
                            props.channelId !== undefined
                              ? "author-suggestions-content local-content"
                              : "author-suggestions-content global-content"
                          }
                          style={{
                            marginLeft: getAuthorSpacing(
                              target,
                              props.channelId,
                              langValue
                            ),
                          }}
                          // style={{
                          //   marginLeft:
                          //     target === "post"
                          //       ? props.channelId !== undefined
                          //         ? "41px"
                          //         : "35px"
                          //       : langValue === "ko"
                          //       ? "8px"
                          //       : "15px",
                          // }}
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
                            placeholder="" /*{t("task.modal:assignee.placeholder")}*/
                            value={
                              authorValue.screenName
                                ? authorValue.screenName
                                : authorValue
                            }
                          />
                        </div>
                      </div>

                      <div
                        className="mention-content"
                        style={
                          props.channelId !== undefined
                            ? {}
                            : {
                                marginLeft: "21px",
                                marginBottom:
                                  props.channelId !== undefined ||
                                  target !== "post"
                                    ? "20px"
                                    : "0px",
                              }
                        }
                      >
                        {target === "post" ? (
                          <>
                            <label className="search-label form-label col-form-label">
                              {t("global.search:mentioned")}
                            </label>
                            <div
                              style={{
                                marginLeft:
                                  langValue === "ko" ? "15px" : "14px",
                              }}
                              className="mention-suggestions-content"
                            >
                              <GlobalSearchSuggestion
                                handleChange={(member) => {
                                  setMentionedValue(member);
                                }}
                                className={"member-add-input form-control"}
                                name="mention"
                                members={members}
                                useCachedData={true}
                                isAtRequired={true}
                                placeholder="" /*{t("task.modal:assignee.placeholder")}*/
                                value={
                                  mentionedValue.screenName
                                    ? mentionedValue.screenName
                                    : mentionedValue
                                }
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        props.channelId !== undefined
                          ? ``
                          : `mention-assignee-content`
                      }
                    >
                      {target !== "post" && (
                        <div
                          className="mention-content"
                          style={
                            props.channelId !== undefined
                              ? { marginBottom: "20px" }
                              : {}
                          }
                        >
                          <label className="search-label form-label col-form-label">
                            {t("global.search:mentioned")}
                          </label>
                          <div
                            style={{
                              marginLeft: langValue === "ko" ? "15px" : "14px",
                            }}
                            className="mention-suggestions-content"
                          >
                            <GlobalSearchSuggestion
                              handleChange={(member) => {
                                setMentionedValue(member);
                              }}
                              className={"member-add-input form-control"}
                              name="mention"
                              members={members}
                              useCachedData={true}
                              isAtRequired={true}
                              placeholder="" /*{t("task.modal:assignee.placeholder")}*/
                              value={
                                mentionedValue.screenName
                                  ? mentionedValue.screenName
                                  : mentionedValue
                              }
                            />
                          </div>
                        </div>
                      )}

                      {target !== "post" && (
                        <div
                          className="assignee-content"
                          style={
                            props.channelId !== undefined
                              ? {}
                              : { marginLeft: "21px" }
                          }
                        >
                          <label className="search-label form-label col-form-label">
                            {t("global.search:assignee")}
                          </label>
                          <div
                            className="assignee-suggestions-content"
                            style={
                              props.channelId !== undefined
                                ? {
                                    marginLeft:
                                      langValue === "ko" ? "15px" : "21px",
                                  }
                                : { marginLeft: "28px" }
                            }
                          >
                            <GlobalSearchSuggestion
                              handleChange={(member) => {
                                setAssigneeValue(member);
                              }}
                              className={"member-add-input form-control"}
                              name="assignee"
                              members={members}
                              useCachedData={true}
                              isAtRequired={true}
                              placeholder="" /*{t("task.modal:assignee.placeholder")}*/
                              value={
                                assigneeValue.screenName
                                  ? assigneeValue.screenName
                                  : assigneeValue
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Dropdown.Divider style={{ margin: "0px" }} />
                  <div className="search-content-2">
                    <label className="global-search-scope">
                      {t("global.search:scope")}
                    </label>
                    <div className="post-filter">
                      <label className="search-label form-label col-form-label">
                        {t("global.search:tag")}
                      </label>

                      <ToggleButtonGroup
                        type="radio"
                        name="tags"
                        value={tagFilter}
                        defaultValue={tagFilter}
                        onChange={(e) => setTagFilter(e)}
                        style={{
                          marginLeft: langValue === "ko" ? "49px" : "51px",
                        }}
                      >
                        <ToggleButton
                          variant="outline-secondary"
                          value="all"
                          // className="mr-2"
                        >
                          {t("global.search:all")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="decision"
                          // className="mr-2"
                        >
                          {t("decision")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="question"
                          // className="mr-2"
                        >
                          {t("question")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="follow-up"
                          // className="mr-2"
                        >
                          {t("follow-up")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="important"
                        >
                          {t("important")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    <div className="post-filter">
                      <label className="search-label form-label col-form-label">
                        {t("global.search:file")}
                      </label>

                      <ToggleButtonGroup
                        type="radio"
                        name="tags"
                        defaultValue={fileFilter}
                        value={fileFilter}
                        onChange={(e) => setFileFilter(e)}
                        style={{
                          marginLeft: langValue === "ko" ? "49px" : "46px",
                        }}
                      >
                        <ToggleButton
                          variant="outline-secondary"
                          value="all"
                          // className="mr-2"
                        >
                          {t("global.search:all")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="uploaded"
                          // className="mr-2"
                        >
                          {t("global.search:uploaded")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="downloaded"
                        >
                          {t("global.search:downloaded")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    <div className="post-filter">
                      <label className="search-label form-label col-form-label">
                        {t("global.search:my-save")}
                      </label>

                      <ToggleButtonGroup
                        type="checkbox"
                        name="tags"
                        value={saveFilter ? "saved" : ""}
                        defaultValue={saveFilter ? "saved" : ""}
                        onChange={(e) => setSaveFilter(e.length > 1)}
                        style={{
                          marginLeft: langValue === "ko" ? "49px" : "26px",
                        }}
                      >
                        <ToggleButton
                          type="checkbox"
                          variant="outline-secondary"
                          value="saved"
                        >
                          {t("global.search:saved")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    <div
                      style={{ alignItems: "baseline" }}
                      className="post-filter"
                    >
                      <label
                        style={{ marginTop: "3px" }}
                        className="search-label form-label col-form-label"
                      >
                        {t("global.search:task")}
                      </label>

                      <ToggleButtonGroup
                        type="radio"
                        name="tags"
                        defaultValue={taskFilter}
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e)}
                        style={{
                          marginLeft: langValue === "ko" ? "49px" : "45px",
                        }}
                      >
                        <ToggleButton
                          // className="mr-2"
                          variant="outline-secondary"
                          value="all"
                        >
                          {t("global.search:all")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.TODO
                              ? "task-state active-task-state"
                              : "task-state"
                          }
                          variant="outline-secondary"
                          value="TODO"
                          onMouseOver={() => setTaskImageActive(true)}
                          onMouseLeave={() => setTaskImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.TODO ||
                              taskImageActive
                                ? activeTodo
                                : todo
                            }
                            alt={t("task.modal:status.buttons:todo")}
                          />
                          {t("global.search:todo")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.ASSIGN
                              ? "task-state active-task-state"
                              : "task-state"
                          }
                          variant="outline-secondary"
                          value="ASSIGN"
                          onMouseOver={() => setAssignImageActive(true)}
                          onMouseLeave={() => setAssignImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.ASSIGN ||
                              assignImageActive
                                ? activeAssign
                                : assign
                            }
                            alt={t("task.modal:status.buttons:assign")}
                          />
                          {t("global.search:assigned")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.INPROGRESS
                              ? "task-state active-task-state"
                              : "task-state"
                          }
                          variant="outline-secondary"
                          value="INPROGRESS"
                          onMouseOver={() => setInprogressImageActive(true)}
                          onMouseLeave={() => setInprogressImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.INPROGRESS ||
                              inprogressImageActive
                                ? activeProgress
                                : inProgress
                            }
                            alt={t("task.modal:status.buttons:progress")}
                          />
                          {t("global.search:in-progress")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.DONE
                              ? "done-state active-done-state"
                              : "done-state"
                          }
                          variant="outline-secondary done-state"
                          value="DONE"
                          onMouseOver={() => setDoneImageActive(true)}
                          onMouseLeave={() => setDoneImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.DONE ||
                              doneImageActive
                                ? activeDone
                                : done
                            }
                            alt={t("task.modal:status.buttons:done")}
                          />
                          {t("global.search:done")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.PENDING
                              ? "pending-canceled-state active-pending-canceled-state"
                              : "pending-canceled-state"
                          }
                          variant="outline-secondary"
                          value="PENDING"
                          onMouseOver={() => setPendingImageActive(true)}
                          onMouseLeave={() => setPendingImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.PENDING ||
                              pendingImageActive
                                ? activePending
                                : pending
                            }
                            alt={t("task.modal:status.buttons:pending")}
                          />
                          {t("global.search:pending")}
                        </ToggleButton>
                        <ToggleButton
                          className={
                            taskFilter === taskConstants.CANCELED
                              ? "pending-canceled-state active-pending-canceled-state"
                              : "pending-canceled-state"
                          }
                          variant="outline-secondary"
                          value="CANCELED"
                          onMouseOver={() => setCanceledImageActive(true)}
                          onMouseLeave={() => setCanceledImageActive(false)}
                        >
                          <img
                            src={
                              taskFilter === taskConstants.CANCELED ||
                              canceledImageActive
                                ? activeCancel
                                : canceled
                            }
                            alt={t("task.modal:status.buttons:canceled")}
                          />
                          {t("global.search:canceled")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <div className="search-btn">
                    <button
                      onClick={(e) => {
                        return isSearchDisabled()
                          ? undefined
                          : () => {
                              getSearchResult();
                              setShowAdvanced(false);
                            };
                      }}
                      className="btn btn-outline-primary btn-search"
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

export default GlobalSearchInput;
