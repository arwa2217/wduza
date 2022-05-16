import React, { useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InputGroup from "react-bootstrap/InputGroup";
import { GlobalSearchWrapper } from "./file-search-style";
import SearchIcon from "../../assets/icons/search-icon-primary.svg";
import close from "../../assets/icons/close.svg";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { GetPostSearchListAction } from "../../store/actions/channelActions";
import moment from "moment";
import {
  getSearchResultWithFile,
  ClearFileSearchResultAction,
} from "../../store/actions/folderAction";
import { updateSummaryPanelState } from "../../store/actions/config-actions";
import { POST_SEARCH } from "../../store/actionTypes/channelActionTypes";
import { UPDATE_LAST_FILE_SEARCH_QUERY } from "../../store/actionTypes/folder-action-types";
import {
  getAllUser,
  getUserByName,
  getUserByNameAndChannelId,
  getUsersByChannelId,
} from "../../utilities/caching/db-helper";
import GlobalSearchSuggestion from "../modal/channel/global-search-suggestions";
import Autosuggest from "react-autosuggest";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import UserType from "../../constants/user/user-type";
import { useEffect } from "react";
import DiscussionListSuggestions from "../post-forward/discussion-suggestion";
import FolderListSuggestions from "../utils/folder-suggestion";
import { FETCH_FILE_SEARCH_DETAILS_CLEAR } from "../../store/actionTypes/folder-action-types";

import { showToast } from "../../store/actions/toast-modal-actions";

import { updateDeleteStatus } from "../../store/actions/main-files-actions";
const FileManagementSearchInput = (props) => {
  let deleteFileSuccess = useSelector(
    (state) => state.mainFilesReducer.deleteFileSuccess
  );
  const myInputRef = useRef(null);
  const searchObject = useSelector(
    (state) => state.folderReducer.currentSearchFilter
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
  const [fileType, setFileType] = useState(
    searchObject?.fileType ? searchObject.fileType : "all"
  );

  const currentUser = useSelector((state) => state.AuthReducer.user);
  var isAdmin = false;
  if (currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") {
    isAdmin = true;
  }

  const [target, setTarget] = useState(
    searchObject?.target ? searchObject.target : "all"
  );
  let [startTime, setStartTime] = useState(
    searchObject?.startTimeView ? searchObject?.startTimeView : null
  );
  let [stopTime, setStopTime] = useState(
    searchObject?.stopTimeView ? searchObject.stopTimeView : null
  );
  const [dateIsInvalid, setDateIsInvalid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  let [activityType, setActivityType] = useState(
    searchObject?.activityType ? searchObject.activityType : "all"
  );
  const [authorValue, setAuthorValue] = useState(
    searchObject?.authorValue ? searchObject.authorValue : ""
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
  let channelList = useSelector((state) => state.ChannelReducer.channelList);

  let [discussion, setDiscussion] = useState(
    searchObject?.discussion ? searchObject.discussion : ""
  );
  let [discussionId, setDiscussionId] = useState(
    searchObject?.discussionId ? searchObject.discussionId : ""
  );

  const searchFileEnabled = useSelector(
    (state) => state.folderReducer.searchFileEnabled
  );

  let folderList = useSelector((state) => state.folderReducer.folderList);
  const [folder, setFolder] = useState(
    searchObject?.folder ? searchObject.folder : ""
  );
  // const [discussionId, setDiscussionId] = useState("");
  const [folderId, setFolderId] = useState(
    searchObject?.folderId ? searchObject.folderId : ""
  );

  const [discussionFound, setDiscussionFound] = useState(true);
  const [folderFound, setFolderFound] = useState(true);

  useEffect(() => {
    setDiscussion(searchObject?.discussion ? searchObject.discussion : "");
    setDiscussionId(
      searchObject?.discussion?.id ? searchObject.discussion.id : ""
    );
    setFileType(searchObject?.fileType ? searchObject.fileType : "all");
    setAuthorValue(searchObject?.authorValue ? searchObject.authorValue : "");
    setTarget(searchObject?.target ? searchObject.target : "all");
    setFolder(searchObject?.folder ? searchObject.folder : "");
    setFolderId(searchObject?.folder?.id ? searchObject.folder.id : "");
    setStartTime(
      searchObject?.startTimeView ? new Date(searchObject?.startTimeView) : null
    );
    setStopTime(
      searchObject?.stopTimeView ? new Date(searchObject.stopTimeView) : null
    );
    setMentionedValue(
      searchObject?.mentionedValue ? searchObject.mentionedValue : ""
    );
    setActivityType(
      searchObject?.activityType ? searchObject.activityType : "all"
    );
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
    if (!searchFileEnabled) {
      setInputValue("");
    }
  }, [searchFileEnabled]);

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
  };

  const handleStartDate = (date) => {
    if (date === null) {
      setStopTime(null);
      setStartTime(null);
      setDateIsInvalid(false);
    } else {
      setDateIsInvalid(false);
      setStartTime(date);

      if (
        stopTime === null ||
        (stopTime && date && Date.parse(date) > stopTime)
      ) {
        let endDate = new Date(Date.parse(date) + 86340000);
        setStopTime(endDate);
      }
    }
  };

  const handleStopDate = (date) => {
    if (date === null) {
      setStopTime(null);
      setStartTime(null);
      setDateIsInvalid(false);
    } else {
      setDateIsInvalid(false);
      let endDate = date;
      if (stopTime === null) {
        endDate = new Date(Date.parse(date) + 86340000);
      }
      setStopTime(endDate);

      if (
        startTime === null ||
        (startTime && date && Date.parse(date) < startTime)
      ) {
        let startDate = new Date(Date.parse(date));
        setStartTime(startDate);
      }
    }
  };
  const removeFirstCharacter = (value) => {
    if (value?.length > 0 && value.charAt(0) === "@") {
      let newValue = value.substring(1);
      return newValue;
    }
    return value;
  };
  const handleDiscussion = (filterDiscussion) => {
    if (typeof filterDiscussion === "object") {
      setDiscussion(filterDiscussion);
      setDiscussionId(
        filterDiscussion && filterDiscussion.id ? filterDiscussion.id : ""
      );
      setDiscussionFound(true);
    } else if (typeof filterDiscussion === "string") {
      if (filterDiscussion === "") {
        setDiscussion("");
        setDiscussionId("");
        setDiscussionFound(true);
      } else {
        var discussion = channelList.find(
          (discussionItem) => discussionItem.name === filterDiscussion
        );
        if (typeof discussion === "object") {
          setDiscussion(discussion);
          setDiscussionId(discussion && discussion.id ? discussion.id : "");
          setDiscussionFound(true);
        } else {
          setDiscussion("");
          setDiscussionId("");
          setDiscussionFound(false);
        }
      }
    } else {
      setDiscussion("");
      setDiscussionId("");
    }
  };

  const handleFolderList = (filterFolder) => {
    if (typeof filterFolder === "object") {
      setFolder(filterFolder);
      setFolderId(
        filterFolder && filterFolder.id
          ? filterFolder.id
          : filterFolder && filterFolder.folderId
          ? filterFolder.folderId
          : ""
      );
      //setFolderId(filterFolder && filterFolder.id ? filterFolder.id : "");
      setFolderFound(true);
    } else if (typeof filterFolder === "string") {
      if (filterFolder === "") {
        setFolder("");
        setFolderId("");
        setFolderFound(true);
      } else {
        var folder = folderList.find(
          (folderItem) => folderItem.folderName === filterFolder
        );
        if (typeof folder === "object") {
          setFolder(folder);
          setFolderId(folder && folder.folderId ? folder.folderId : "");
          setFolderFound(true);
        } else {
          setFolder("");
          setFolderId("");
          setFolderFound(false);
        }
      }
    } else {
      setFolder("");
      setFolderId("");
    }
  };
  const getChannelList = (channelList) => {
    return channelList.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  };

  useEffect(() => {
    if (searchFileEnabled) {
      if (deleteFileSuccess === false)
        dispatch(showToast(t("files:delete.fail")), 3000);
      else if (deleteFileSuccess) {
        dispatch(showToast(t("files:delete.success"), 3000, "success"));
        getSearchResult();
      }
      dispatch(updateDeleteStatus());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFileSuccess, searchFileEnabled]);

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

    //let folderId = activeFileMenu?.folderId ? activeFileMenu.folderId : ''//"1c7f1680-7ecd-431e-95bf-9140057763a3"
    let startTimeView,
      stopTimeView,
      startTimeSend,
      stopTimeSend = null;
    if (startTime !== null && stopTime !== null) {
      startTimeView = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
      stopTimeView = moment(stopTime).format("YYYY-MM-DD HH:mm:ss");
      startTimeSend = moment.utc(startTime).format("YYYY-MM-DD HH:mm:ss");
      stopTimeSend = moment.utc(stopTime).format("YYYY-MM-DD HH:mm:ss");
    }

    dispatch({
      type: UPDATE_LAST_FILE_SEARCH_QUERY,
      payload: {
        ...{
          value,
          discussionId,
          discussion,
          folder,
          startTimeView,
          stopTimeView,
          folderId,
          fileType,
          activityType,
          authorValue: authorData,
          mentionedValue: mentionData,
          target,
        },
      },
    });

    dispatch(
      getSearchResultWithFile(
        value,
        0,
        props.size === undefined ? 10 : props.size,
        discussionId,
        exact,
        fileType,
        activityType,
        startTimeSend,
        stopTimeSend,
        folderId,
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
        target,
        searchObject.sortFilter,
        searchObject.sortDirection,
        searchObject.fileFilter,
        "",
        isAdmin
      )
    );
  }

  function handleKeyUpEvent(e) {
    if (e.key === "Backspace" && value && value.length > 0) {
      dispatch(ClearFileSearchResultAction());
      // clearSearchFields();
      getSearchResult();
    } else if (e.key === "Backspace" && value.length === 0) {
      dispatch(ClearFileSearchResultAction());
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
      fileType === "all" &&
      activityType === "all" &&
      mentionedValue === "" &&
      authorValue === "" &&
      discussionId === "" &&
      startTime === null &&
      stopTime === null &&
      folderId === ""
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
                  fileType !== "all" ||
                  activityType !== "all" ||
                  mentionedValue !== "" ||
                  authorValue !== "" ||
                  discussionId !== "" ||
                  startTime !== null ||
                  stopTime !== null ||
                  folderId !== "") &&
                props.channelId === undefined
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
                fileType !== "all" ||
                activityType !== "all" ||
                mentionedValue !== "" ||
                authorValue !== "" ||
                discussionId !== "" ||
                startTime !== null ||
                stopTime !== null ||
                folderId !== "") &&
                props.channelId === undefined && (
                  <img
                    alt="Close"
                    src={close}
                    className="icon-close 1st"
                    onClick={(e) => {
                      resetInputValue(e);
                      dispatch({ type: FETCH_FILE_SEARCH_DETAILS_CLEAR });
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
                    {/* <div className="target-content">
                      <label className="search-label form-label col-form-label">
                        {t("global.search:target")}
                      </label>

                      <div className="target-radio-btn-container">
                        <input
                          type="radio"
                          id="all"
                          style={{ display: "none" }}
                          name="target"
                          value={"all"}
                          checked={target === "all"}
                          className="target-radio-btn"
                          onChange={(e) => {
                            // setAssigneeValue("");
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
                          id="discussion"
                          name="target"
                          style={{ display: "none" }}
                          value={"discussion"}
                          checked={target === "discussion"}
                          className="target-radio-btn"
                          onChange={(e) => {
                            setTarget(e.target.value);
                          }}
                        />
                        <label
                          className="search-label form-label  target-radio-btn-label col-form-label"
                          htmlFor="discussion"
                        >
                          {t("global.search:discussion")}
                        </label>

                        <input
                          type="radio"
                          id="folder"
                          name="target"
                          value={"folder"}
                          checked={target === "folder"}
                          style={{ display: "none" }}
                          className="target-radio-btn"
                          onChange={(e) => {
                            setMentionedValue("");
                            setTarget(e.target.value);
                          }}
                        />

                        <label
                          className="search-label form-label  target-radio-btn-label col-form-label"
                          htmlFor="folder"
                        >
                          {t("global.search:folder")}
                        </label>
                      </div>
                    </div> */}

                    <div className="uploader-content">
                      <label className="search-label form-label col-form-label">
                        {t("files:search.uploader")}
                      </label>
                      <div
                        className="author-suggestions-content local-content"
                        style={{
                          marginLeft: "22px",
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
                    <div className="folder-content">
                      <label
                        style={{ paddingBottom: "18px" }}
                        className="search-label form-label col-form-label"
                      >
                        {t("files:search.discussion")}
                      </label>
                      <div
                        className="author-suggestions-content local-content"
                        style={{
                          marginLeft: "12px",
                        }}
                      >
                        <DiscussionListSuggestions
                          handleChange={handleDiscussion}
                          className={`member-add-input form-control ${
                            submitted &&
                            (discussion === ""
                              ? "is-invalid"
                              : discussionId === undefined
                              ? "is-invalid"
                              : "")
                          }`}
                          name="discussion"
                          channelList={getChannelList(channelList)}
                          // placeholder={t(
                          //   "file.forward:discussion.placeholder"
                          // )}
                          value={discussion.name ? discussion.name : discussion}
                        />
                        <p
                          style={{
                            height: "20px",
                            paddingTop: "3.5px",
                            paddingBottom: "3.5px",
                          }}
                        >
                          {!discussionFound && (
                            <div
                              style={{ lineHeight: "1", marginTop: "0px" }}
                              className="invalid-feedback"
                            >
                              {t("file.forward:error.discussion.not.found")}
                            </div>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="date-content">
                      <div className="start-date-content">
                        <label className="search-label form-label col-form-label">
                          {t("files:search.start.date")}
                        </label>
                        <div
                          className="author-suggestions-content local-content"
                          style={{
                            marginLeft: "18px",
                          }}
                        >
                          <DatePicker
                            style={{ width: "100% !important" }}
                            onFocus={(e) => e.target.blur()}
                            selected={startTime}
                            onChange={(date) =>
                              currentUser.userType === UserType.GUEST
                                ? null
                                : handleStartDate(date)
                            }
                            selectsStart
                            startDate={startTime}
                            endDate={stopTime}
                            dateFormat="MMM dd, yyyy h:mm aa"
                            placeholder={t("file.forward:start.date")}
                            // minDate={new Date()}
                            isClearable={!startTime ? false : true}
                            className={`form-control ${
                              submitted && dateIsInvalid ? "is-invalid" : ""
                            }`}
                          />
                        </div>
                      </div>
                      <div className="end-date-content">
                        <label className="search-label form-label col-form-label">
                          {t("files:search.end.date")}
                        </label>
                        <div
                          className="author-suggestions-content local-content"
                          style={{
                            marginLeft: "24px",
                          }}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            onFocus={(e) => e.target.blur()}
                            selected={stopTime}
                            onChange={(date) =>
                              currentUser.userType === UserType.GUEST
                                ? null
                                : handleStopDate(date)
                            }
                            selectsEnd
                            dateFormat="MMM dd, yyyy h:mm aa"
                            placeholder={t("file.forward:end.date")}
                            startDate={startTime}
                            endDate={stopTime}
                            minDate={startTime}
                            className={`form-control ${
                              submitted && dateIsInvalid ? "is-invalid" : ""
                            }`}
                            isClearable={!stopTime ? false : true}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="filter-type-content">
                      <div className="post-filter">
                        <label className="search-label form-label col-form-label">
                          {t("files:search.filetype")}
                        </label>

                        <ToggleButtonGroup
                          type="radio"
                          name="fileType"
                          defaultValue={fileType}
                          value={fileType}
                          onChange={(e) => setFileType(e)}
                          style={{
                            marginLeft: "26px",
                          }}
                        >
                          <ToggleButton variant="outline-secondary" value="all">
                            {t("files:search.all")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="image"
                          >
                            {t("files:search.image")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="video-audio"
                          >
                            {t("files:search.video.audio")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="document"
                          >
                            {t("files:search.document")}
                          </ToggleButton>
                          <ToggleButton variant="outline-secondary" value="pdf">
                            {t("files:search.pdf")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="spreadsheet"
                          >
                            {t("files:search.spreadSheet")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="presentation"
                          >
                            {t("files:search.Presentation")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value="others"
                          >
                            {t("files:search.other.files")}
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Divider style={{ margin: "0px" }} />
                  <div className="search-content-2">
                    <label className="global-search-scope">
                      {" "}
                      {t("files:search.activity")}
                    </label>
                    <div className="users-content">
                      <label className="search-label form-label col-form-label">
                        {t("files:search.users")}
                      </label>
                      <div className="users-input">
                        <GlobalSearchSuggestion
                          handleChange={(members) => {
                            setMentionedValue(members);
                          }}
                          className={"member-add-input form-control"}
                          name="mention"
                          members={members}
                          useCachedData={true}
                          isAtRequired={true}
                          placeholder=""
                          value={
                            mentionedValue.screenName
                              ? mentionedValue.screenName
                              : mentionedValue
                          }
                        />
                      </div>
                    </div>
                    <div
                      className="post-filter"
                      style={{ marginBottom: "5px" }}
                    >
                      <label className="search-label form-label col-form-label">
                        {t("files:search.activity")}
                      </label>

                      <ToggleButtonGroup
                        type="radio"
                        name="activity"
                        defaultValue={activityType}
                        value={activityType}
                        onChange={(e) => setActivityType(e)}
                        style={{
                          marginLeft: "31px",
                        }}
                      >
                        <ToggleButton variant="outline-secondary" value="all">
                          {t("global.search:all")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="viewed"
                        >
                          {t("files:search.viewed")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="download"
                        >
                          {t("files:search.downloaded")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="forwarded"
                        >
                          {t("files:search.forwarded")}
                        </ToggleButton>
                        <ToggleButton
                          variant="outline-secondary"
                          value="shared"
                        >
                          {t("files:search.shared")}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                  </div>
                  <Dropdown.Divider
                    style={{ marginTop: "0px", marginBottom: "20px" }}
                  />
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

export default FileManagementSearchInput;
