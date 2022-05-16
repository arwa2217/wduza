import React from "react";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import {
  GetPostSearchListAction,
  GetPostSearchResultAction,
  ClearPostSearchResultAction,
  PostSearchAction,
} from "../../store/actions/channelActions";
import { useTranslation } from "react-i18next";
import SearchIcon from "../../assets/icons/search-icon.svg";
import closeWhite from "../../assets/icons/close-white.svg";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import InputGroup from "react-bootstrap/InputGroup";
let currentChannelId;
const SearchSuggestions = (props) => {
  let exact = false;
  let [value, setInputValue] = useState("");
  const postSearchDetailsList = useSelector(
    (state) => state.ChannelReducer?.getSearchPostList
  );
  const { t } = useTranslation();

  const [searchToggle, setSearchToggle] = useState(false);
  const [suggestions, setSuggestions] = useState(postSearchDetailsList || []);
  const dispatch = useDispatch();
  const channelDetails = useSelector((state) => state.channelDetails);
  const summaryPanelActive = useSelector(
    (state) => state.config.summaryPanelActive
  );
  useEffect(() => {
    setSuggestions(postSearchDetailsList || []);
  }, [postSearchDetailsList]);

  const myInputRef = useRef(null);

  const getSuggestionValue = (suggestion) => {
    if (value.indexOf("'") >= 0 || value.indexOf('"') >= 0) {
      exact = true;
    }
    //updateSummaryPanel();
    dispatch(PostSearchAction(summaryPanelActive, dispatch));
    dispatch(
      GetPostSearchResultAction(suggestion, 5, channelDetails?.id, exact)
    );
    return `${suggestion}`;
  };

  useEffect(() => {
    if (!(currentChannelId && currentChannelId === channelDetails.id)) {
      currentChannelId = channelDetails.id;
      setInputValue("");
      setSearchToggle(false);
      dispatch(ClearPostSearchResultAction());
      // dispatch(GetPostSearchResultAction(value, 0, "null", exact));
    }
  }, [channelDetails.id]);

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${
      suggestion.length > 35 ? `${suggestion.substring(0, 35)}...` : suggestion
    }`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);
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
    setInputValue(
      newValue.length > 35 ? `${newValue.substring(0, 35)}` : newValue
    );
  };

  const handleKeyUp = (e) => {
    if (e.key === "Backspace" && value && value.length > 0) {
      dispatch(GetPostSearchResultAction(value, 0, "null", exact));
    } else if (e.key === "Backspace" && value.length === 0) {
      dispatch(ClearPostSearchResultAction());
      setInputValue("");
    }
    value = value.trim();
    value = value.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, "");
    value = value.replace(/[{()}]/g, "");
    if (value && value.length > 1) {
      if (e.key === "Enter") {
        //updateSummaryPanel();
        dispatch(PostSearchAction(summaryPanelActive, dispatch));
        if (value.indexOf("'") >= 0 || value.indexOf('"') >= 0) {
          exact = true;
        }
        dispatch(
          GetPostSearchResultAction(value, 5, channelDetails?.id, exact)
        );
      }
    }
  };

  const resetInputValue = (event) => {
    event.preventDefault();
    dispatch(ClearPostSearchResultAction()); //GetPostSearchResultAction(value, 0, "null", false)
    setInputValue("");
    const { current } = myInputRef;
    current.focus();
  };
  const onBlurEvent = (event) => {
    event.preventDefault();
    if (value === "") {
      setSearchToggle(!searchToggle);
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value?.length > 1) {
      dispatch(GetPostSearchListAction(value, channelDetails?.id));
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  const inputProps = {
    placeholder: t("discussion:search.discussion"),
    value: value,
    onChange: onChangeEvent,
    onBlur: onBlurEvent,
    className: "form-control pointer-on-hover",
    ref: myInputRef,
    onKeyUp: handleKeyUp,
  };

  return (
    <div
      className={`topBar__icon search__icon active ${
        searchToggle ? "open" : ""
      }`}
      style={
        value === "" ? { borderColor: "#999" } : { borderColor: "#18b263" }
      }
      onClick={(e) => setSearchToggle(true)}
    >
      <img alt="Search" src={SearchIcon} className="icon-search" />
      <InputGroup>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
        />
        {value !== "" && (
          <InputGroup.Append>
            <img
              alt="Close"
              src={closeWhite}
              className="icon-close"
              onClick={resetInputValue}
            />
          </InputGroup.Append>
        )}
      </InputGroup>
    </div>
  );
};

export default SearchSuggestions;
