import React, { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import dropdownIcon from "../../assets/icons/dropdown-arrow.svg";
let selectedSuggestion = "";
const FolderListSuggestions = (props) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState(props.folderList || []);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [...props.folderList];
    }

    const regex = new RegExp("" + escapedValue, "i");

    return props.folderList.filter((folder) =>
      regex.test(getSuggestionValue(folder))
    );
  };

  function onSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) {
    const {
      folderId: suggestionId,
      folderName: suggestionName,
      type,
    } = suggestion;
    selectedSuggestion = { id: suggestionId, name: suggestionName, type: type };
    props.handleChange(selectedSuggestion);
  }

  const getSuggestionValue = (suggestion) => {
    return `${suggestion.folderName}`;
  };

  const renderSuggestion = (suggestion, { query }) => {
    const suggestionText = `${suggestion.folderName}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    return (
      <span className={"suggestion-content " + suggestion.folderId}>
        <span className="name">
          {parts.map((part, index) => {
            const className = part.highlight ? "highlight" : null;

            return (
              <span className={className} key={index}>
                {part.text}
              </span>
            );
          })}
        </span>
      </span>
    );
  };

  const onChange = (event, { newValue, method }) => {
    setValue(newValue);
    if (
      selectedSuggestion !== "" &&
      selectedSuggestion.folderName === newValue
    ) {
      props.handleChange(selectedSuggestion);
    } else {
      props.handleChange(newValue);
    }
  };

  const onBlur = (event) => {
    if (value != null && value !== "" && suggestions?.length > 0) {
      suggestions.map((suggestion) => {
        if (suggestion?.folderName === event.target.value) {
          setValue(event.target.value);
          props.handleChange(suggestion);
        }
        return suggestion;
      });
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: props.placeholder,
    value: value,
    onChange: onChange,
    onBlur: onBlur,
    className: props.className,
    type: props.type,
    name: props.name,
  };
  return (
    <>
      {" "}
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={() => true}
        onSuggestionSelected={onSuggestionSelected}
      />
      {props.isOpenDownArrow && (
        <span className="dropdown-icon">
          <img src={dropdownIcon} />
        </span>
      )}
    </>
  );
};
export default FolderListSuggestions;
