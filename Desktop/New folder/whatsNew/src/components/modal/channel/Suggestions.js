import React from "react";
import Autosuggest from "react-autosuggest";
import AutosuggestHighlightMatch from "autosuggest-highlight/match";
import AutosuggestHighlightParse from "autosuggest-highlight/parse";
import { GetUserInviteList } from "../../../store/actions/user-actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Suggestions = (props) => {
  const [value, setValuesUser] = useState("");
  const userSearchList = useSelector(
    (state) => state.ActionRequiredReducer?.requiredUserSearchList?.result
  );
  const [suggestions, setSuggestions] = useState(userSearchList || []);
  const dispatch = useDispatch();
  let selectedMember = "";
  useEffect(() => {
    setSuggestions(userSearchList || []);
  }, [userSearchList]);

  function getSuggestionValue(suggestion) {
    if (props.useCachedData && !props.noSelectedMember) {
      selectedMember = suggestion;
    }
    if (props.getCID) {
      props.handleCID(
        suggestion?.cid ? suggestion?.cid : suggestion?.id ? suggestion?.id : ""
      );
    }
    if (props.getUserType) {
      props.fetchUserType(suggestion?.userType ? suggestion.userType : "Guest");
    }
    return `${suggestion.email}`;
  }

  function renderSuggestion(suggestion, { query }) {
    let newQuery = removeFirstCharacter(query);
    let affiliation =
      suggestion && suggestion.affiliation ? `| ${suggestion.affiliation}` : "";
    let fullName =
      suggestion && suggestion.firstName ? `| ${suggestion.firstName}` : "";
    const suggestionText = `${suggestion.screenName} ${fullName} | ${
      suggestion.email
    } ${props.showUserAffiliation ? affiliation : ""}`;
    const matches = AutosuggestHighlightMatch(suggestionText, newQuery);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    newQuery = newQuery.replace(/[()|+\-.,<>\{\}\[\]\\\/]/gi, "");
    var regex = new RegExp("(" + newQuery + ")", "gi");
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
  }

  const onChange = (event, { newValue, method }) => {
    setValuesUser(newValue);
    props.handleChange(selectedMember !== "" ? selectedMember : newValue);
  };

  const removeFirstCharacter = (value) => {
    if (value?.length > 0 && value.charAt(0) === "@") {
      let newValue = value.substring(1);
      return newValue;
    }
    return value;
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    let newValue = value;
    let lengthCheck = 1;
    let trigger = true;
    if (props.isAtRequired) {
      trigger = newValue.charAt(0) === "@";
      newValue = removeFirstCharacter(value);
      lengthCheck = -1;
    }
    if (newValue?.length > lengthCheck && !props.onlyGuest) {
      if (!!!props.useCachedData) {
        dispatch(GetUserInviteList(newValue, 100, 1));
      } else {
        setSuggestions(
          props.members?.length > 0
            ? props.members.filter((member) =>
                checkCharacterContains(member, newValue)
              )
            : []
        );
      }
    }
  };

  const checkCharacterContains = (member, query) => {
    let fullName = member && member.firstName ? `| ${member.firstName}` : "";
    const suggestionText = `${member.screenName} ${fullName} | ${member.email}`;
    const matches = AutosuggestHighlightMatch(suggestionText, query);
    const parts = AutosuggestHighlightParse(suggestionText, matches);

    query = query.replace(/[()|+\-.,<>\{\}\[\]\\\/]/gi, "");
    var regex = new RegExp("(" + query + ")", "gi");
    var match = suggestionText.match(regex);

    if (match != null) {
      return true;
    } else {
      return false;
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: props.placeholder,
    value: props.value,
    onChange: onChange,
    className: props.className,
    type: props.type,
    name: props.name,
    onBlur: props.onBlur,
    maxLength:props.maxLength,
    //onSuggestionsClearRequested: onSuggestionsClearRequested
  };
  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};
export default Suggestions;
