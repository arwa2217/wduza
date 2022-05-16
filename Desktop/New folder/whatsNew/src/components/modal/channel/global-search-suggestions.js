import React from "react";
import Autosuggest from "react-autosuggest";
import DefaultUser from "@icons/default-user.svg";
import { GetUserInviteList } from "../../../store/actions/user-actions";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./global-search-suggestions.css";
const GlobalSearchSuggestion = (props) => {
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
    if (props.useCachedData) {
      selectedMember = suggestion;
    }
    return `${suggestion.email}`;
  }

  function renderSuggestion(suggestion, { query }) {
    let suggestionItem = `
        <div class="mention-user-list-suggestion">
          <img class="mention-user-list-suggestion-img" src=${
            suggestion.userImg === "" ? DefaultUser : suggestion.userImg
          } /> 
          <span class="mention-user-list-suggestion-name">${
            suggestion.screenName
          }</span> 
            <span class="mention-user-list-suggestion-details">${
              suggestion.jobTitle ? suggestion.jobTitle : ``
            } ${suggestion.jobTitle ? "@" : ""} ${
      suggestion.affiliation ? suggestion.affiliation : ``
    }
                ${
                  suggestion.affiliation
                    ? `<span> (${suggestion.companyName})</span>`
                    : `<span></span>`
                }
                ${
                  !suggestion.affiliation
                    ? `<span>${suggestion.companyName}</span>`
                    : `<span></span>`
                }</span>
          ${
            suggestion.userType.toString().toUpperCase() !== "INTERNAL"
              ? `<span class="mention-user-list-suggestion-user-type"> ${suggestion.userType}</span>`
              : `<span></span>`
          }
        </div>
        `;
    return <div dangerouslySetInnerHTML={{ __html: suggestionItem }} />;
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
    if (newValue?.length > lengthCheck) {
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
    onClick: props.onClick,
    //onSuggestionsClearRequested: onSuggestionsClearRequested
  };
  return (
    <div className="search-suggestion">
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  );
};
export default GlobalSearchSuggestion;
