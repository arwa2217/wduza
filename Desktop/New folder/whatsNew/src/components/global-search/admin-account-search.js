import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import InputGroup from "react-bootstrap/InputGroup";
import { GlobalSearchWrapper } from "./file-search-style";
import SearchIcon from "../../assets/icons/search-icon-primary.svg";
import close from "../../assets/icons/close.svg";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  getAllUser,
  getUsersByChannelId,
} from "../../utilities/caching/db-helper";
import GlobalSearchSuggestion from "../modal/channel/global-search-suggestions";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import { useEffect } from "react";

import { Form } from "react-bootstrap";
import {
  getAccountSearchResult,
  setAccountSearchQuery,
} from "../../store/actions/admin-account-action";
import {
  FETCH_ACCOUNT_SEARCH_DETAILS_CLEAR,
  RESET_ACCOUNT_FILTER_OBJECT,
} from "../../store/actionTypes/admin-account-action-types";
import { accountConstants } from "../../constants/account-search";
const AdminAccountSearch = (props) => {
  const searchObject = useSelector(
    (state) => state.AdminAccountReducer.accountSearchObj
  );
  const getSearchPostDetails = useSelector(
    (state) => state.ChannelReducer.getSearchPostDetails
  );
  const accountFilterObj = useSelector(
    (state) => state.AdminAccountReducer.accountFilterObj
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [initials, setInitials] = useState({
    name: "",
    email: "",
    phone: "",
    affiliation: "",
    status: accountConstants.STATUS,
    q: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [value, setInputValue] = useState(
    searchObject?.value ? searchObject.value : ""
  );
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

  const handleChange = (value, type) => {
    let obj = { ...initials };
    obj[type] = value;
    setInitials(obj);

    if (type === "q" && value === "") {
      dispatch({ type: FETCH_ACCOUNT_SEARCH_DETAILS_CLEAR });
      dispatch({ type: RESET_ACCOUNT_FILTER_OBJECT });
    }
  };

  useEffect(() => {
    setInitials({ ...searchObject });
    // setAccountStatus(searchObject?.accountStatus ? searchObject.accountStatus : "all");
    // setAuthorValue(searchObject?.authorValue ? searchObject.authorValue : "");
  }, [searchObject]);

  useEffect(() => {
    if (getSearchPostDetails && getSearchPostDetails.length > 0) {
      setShowAdvanced(false);
    }
  }, [getSearchPostDetails]);

  const { name, email, phone, status, affiliation, q } = initials;

  useEffect(() => {
    setInputValue(searchObject?.value ? searchObject.value : value);
  }, [searchObject]);

  const updateOnFocus = () => {
    setShowAdvanced(true);
  };

  const resetInputValue = (event) => {
    event.preventDefault();
    setInputValue("");
  };

  function getSearchResult() {
    dispatch(setAccountSearchQuery(initials));
    dispatch({ type: RESET_ACCOUNT_FILTER_OBJECT });
    dispatch(
      getAccountSearchResult({
        ...accountFilterObj,
        ...initials,
        q: q.screenName ? q.screenName : q,
      })
    );
  }

  function isSearchDisabled() {
    if (
      name === "" &&
      status === accountConstants.STATUS &&
      phone === "" &&
      affiliation === "" &&
      email === "" &&
      q === ""
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
                (name !== "" ||
                  status !== accountConstants.STATUS ||
                  email !== "" ||
                  phone !== "" ||
                  affiliation !== "" ||
                  q !== "") &&
                props.channelId === undefined
                  ? { width: "calc(100% - 64px)" }
                  : { width: "calc(100% - 40px)" }
              }
            >
              <GlobalSearchSuggestion
                handleChange={(member) => {
                  updateOnFocus();
                  handleChange(member, "q");
                }}
                className={"member-add-input form-control"}
                name="q"
                members={members}
                useCachedData={true}
                isAtRequired={true}
                placeholder={props.placeholder}
                value={q.screenName ? q.screenName : q}
                onClick={updateOnFocus}
              />
              {/* <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
              /> */}
            </div>
            <InputGroup.Append>
              {(name !== "" ||
                status !== accountConstants.STATUS ||
                email !== "" ||
                affiliation !== "" ||
                phone !== "" ||
                q !== "") && (
                <img
                  alt="Close"
                  src={close}
                  className="icon-close 1st"
                  onClick={(e) => {
                    resetInputValue(e);
                    dispatch({ type: FETCH_ACCOUNT_SEARCH_DETAILS_CLEAR });
                    dispatch({ type: RESET_ACCOUNT_FILTER_OBJECT });
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
                    <div className="date-content">
                      <div className="start-date-content">
                        <label
                          className="search-label form-label col-form-label"
                          style={{ minWidth: "71px" }}
                        >
                          {t("admin:account.management:search.label:name")}
                        </label>
                        <div className="author-suggestions-content local-content">
                          <Form.Control
                            onChange={(e) =>
                              handleChange(e.target.value, "name")
                            }
                            name="name"
                            value={name}
                            type="text"
                          />
                          {/* <GlobalSearchSuggestion
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
                              authorValue.name
                                ? authorValue.name
                                : authorValue
                            }
                          /> */}
                        </div>
                      </div>
                      <div className="end-date-content">
                        <label
                          className="search-label form-label col-form-label"
                          style={{ minWidth: "71px" }}
                        >
                          {t("admin:account.management:search.label:email")}
                        </label>
                        <div className="author-suggestions-content local-content">
                          <Form.Control
                            onChange={(e) =>
                              handleChange(e.target.value, "email")
                            }
                            name="email"
                            value={email}
                            type="email"
                          />
                          {/* <GlobalSearchSuggestion
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
                              authorValue.email
                                ? authorValue.email
                                : authorValue
                            }
                          /> */}
                        </div>
                      </div>
                    </div>
                    <div className="date-content">
                      <div className="start-date-content">
                        <label
                          className="search-label form-label col-form-label"
                          style={{ minWidth: "71px" }}
                        >
                          {t("admin:account.management:search.label:phone")}
                        </label>
                        <div className="author-suggestions-content local-content">
                          <Form.Control
                            onChange={(e) =>
                              handleChange(e.target.value, "phone")
                            }
                            name="phone"
                            value={phone}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="end-date-content">
                        <label
                          className="search-label form-label col-form-label"
                          style={{ minWidth: "71px" }}
                        >
                          {t(
                            "admin:account.management:search.label:affiliation"
                          )}
                        </label>
                        <div className="author-suggestions-content local-content">
                          <Form.Control
                            onChange={(e) =>
                              handleChange(e.target.value, "affiliation")
                            }
                            name="affiliation"
                            value={affiliation}
                            type="email"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="filter-type-content">
                      <div className="post-filter">
                        <label
                          className="search-label form-label col-form-label"
                          style={{ minWidth: "71px" }}
                        >
                          {t("admin:account.management:search.label:status")}
                        </label>

                        <ToggleButtonGroup
                          type="radio"
                          name="status"
                          defaultValue={accountConstants.STATUS}
                          value={status}
                          onChange={(e) => handleChange(e, "status")}
                        >
                          <ToggleButton
                            variant="outline-secondary"
                            value={"ALL"}
                          >
                            {t("ALL")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"INACTIVE"}
                          >
                            {t("activation.status:INACTIVE")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"PENDING"}
                          >
                            {t("activation.status:PENDING")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"ACTIVE"}
                          >
                            {t("activation.status:ACTIVE")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"ACTIVATION_FAILED"}
                          >
                            {t("activation.status:ACTIVATION_FAILED")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"ADMIN_BLOCKED"}
                          >
                            {t("activation.status:ADMIN_BLOCKED")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"PASSWORD_LOCKED"}
                          >
                            {t("activation.status:PASSWORD_LOCKED")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"DELETED"}
                          >
                            {t("activation.status:DELETED")}
                          </ToggleButton>
                          <ToggleButton
                            variant="outline-secondary"
                            value={"INIT"}
                          >
                            {t("activation.status:INIT")}
                          </ToggleButton>
                        </ToggleButtonGroup>
                      </div>
                    </div>
                  </div>
                  <Dropdown.Divider
                    style={{ marginTop: "0px", marginBottom: "20px" }}
                  />
                  <div className="search-btn">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
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

export default AdminAccountSearch;
