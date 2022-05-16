import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgress, IconButton } from "@material-ui/core";
import {
  getRecipientInputValue,
  uniqEmail,
  validateEmail,
} from "../../utilities/outlook";
import CreatableSelect from "react-select/creatable";
import CloseIcon from "@material-ui/icons/Close";
import { components } from "react-select";
import { useTranslation } from "react-i18next";
import debounce from "lodash/debounce";
import services from "../../outlook/apiService";
import { useDispatch, useSelector } from "react-redux";
import { refreshContactData } from "../../store/actions/mail-summary-action";
import { useMsal } from "@azure/msal-react";
import AddContactICon from "../../assets/icons/add-email-summary.svg";
import defaultUser from "../../assets/icons/default-user.svg";
const ReceiveListSelect = (props) => {
  const {
    defaultOptions,
    receiveList,
    setReceiveList,
    inputReceiveRefs,
    inputReceive,
    setInputReceive,
    handleHideMoreReceiveButtons,
    isHorizontal = false,
    enableSearch = true,
  } = props;
  const { t } = useTranslation();
  const { instance } = useMsal();
  const contactData = useSelector(
    (state) => state.MailSummaryReducer?.contactData
  );
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
  );
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [contactEmail, setContactEmails] = useState([]);
  // const { username } = instance.getActiveAccount();
  const dispatch = useDispatch();
  const customStyles = {
    option: (provided) => ({
      ...provided,
      borderBottom: "1px solid #ccc",
      color: "#666",
      padding: 10,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      boxShadow: "none",
      width: "auto",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
    control: (provided) => ({
      ...provided,
      border: "none",
      boxShadow: "none",
      backgroundColor: "transparent",
      width: "90%",
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      border: "1px solid #DEDEDE",
    }),
    multiValue: (provided) => ({
      ...provided,
      border: "1px solid #E9E9E9",
      backgroundColor: "white",
      borderRadius: "10px",
      padding: "3px 8px",
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: isHorizontal ? "2px 0px" : "2px 8px",
      marginLeft: isHorizontal ? "-5px" : "",
    }),
  };
  useEffect(() => {
    const emailData = contactData?.map((item) => {
      return item.emailAddresses[0]?.address;
    });
    setContactEmails([...emailData]);
    setLoadingAdd(false);
  }, [contactData]);
  const handleAddContact = async (event, label, email) => {
    event.stopPropagation();
    setLoadingAdd(true);
    const data = {
      givenName: label,
      emailAddresses: [
        {
          address: email,
          name: label,
        },
      ],
    };
    try {
      await services.addContact(data);
      dispatch(refreshContactData(true));
    } catch (e) {}
  };
  const CustomOption = (props) => {
    const {
      data: { email, label, isFromSearch = false },
    } = props;
    const displayClass = label ? `flex` : `d-none`;
    return (
      <div
        className={`${displayClass} flex-column border row-option`}
        key={email}
      >
        <components.Option {...props}>
          <div className="avatar mr-2">
            <img
              src={defaultUser}
              alt="alt-avatar"
              width="32"
              height="32"
              className="rounded"
            />
          </div>
          <div className="suggest-user-info">
            {label}
            <div className="email position-relative">
              {email}
              {!contactEmail.includes(email) && !isFromSearch &&
              // email !== username &&
              Object.keys(activeEmail).length ? (
                loadingAdd ? (
                  <CircularProgress
                    style={{
                      marginLeft: "6px",
                      position: "absolute",
                      bottom: "15px",
                      right: "10px",
                    }}
                    size={11}
                  />
                ) : (
                  <img
                    src={AddContactICon}
                    alt="add-contact-icon"
                    style={{
                      position: "absolute",
                      bottom: "15px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                    onClick={(event) => handleAddContact(event, label, email)}
                  />
                )
              ) : null}
            </div>
          </div>
        </components.Option>
      </div>
    );
  };
  const updateInputReceive = (value, label) => {
    const inputValue = inputReceive;
    inputValue[label] = value;
    setInputReceive(inputValue);
  };
  const handleInputChange = (index, value, action, label) => {
    if (action.action === "input-change") {
      updateInputReceive(value, label);
    }
    const isChange = !!value;
    const updateReceiveList = [...receiveList];
    updateReceiveList[index].isChange = isChange;
    setReceiveList(updateReceiveList);
    // after select clear input
    if (action.action === "set-value") {
      updateInputReceive("", label);
    }
  };
  const handleOnChange = (option, action, index) => {
    const updateReceiveList = [...receiveList];
    let updateValues = [];
    if (action.action === "select-option") {
      updateValues = updateReceiveList[index]?.value?.concat(option);
    } else if (action.action === "remove-value") {
      updateValues = updateReceiveList[index]?.value?.filter(
        (item) => item?.value !== action?.removedValue?.value
      );
    }
    updateReceiveList[index].value = uniqEmail(updateValues);
    setReceiveList(updateReceiveList);
  };
  const handleSearchContact = async (label) => {
    const keyword = getRecipientInputValue(label);
    const defaultOptionsData = defaultOptions[label] || [];
    if (keyword) {
      const result = await services.searchContact(keyword);
      const { value = [] } = result;
      if (value) {
        const searchData = [];
        value.map((item) => {
          let email = item?.emailAddresses[0]?.address;
          let displayName = item?.displayName;
          if (!validateEmail(email) && validateEmail(displayName)) {
            email = displayName;
          } else if (!validateEmail(email) && !validateEmail(displayName)) {
            email = displayName;
          }
          if (!defaultOptionsData.includes(email)) {
            searchData.push({
              value: email,
              email,
              label: displayName,
              isFromSearch: true
            });
          }
        });
        if (searchData.length) {
          const index = Object.keys(inputReceive).findIndex((key) => {
            return key === label;
          });
          const updateReceiveList = [...receiveList];
          const updateOptions =
            updateReceiveList[index]?.options?.concat(searchData);
          updateReceiveList[index].options = uniqEmail(updateOptions);
          setReceiveList(updateReceiveList);
        }
      }
    }
  };
  const debounceSearch = useCallback(debounce(handleSearchContact, 500), [
    defaultOptions,
    receiveList,
    inputReceive,
    enableSearch,
  ]);
  const handleSearch = (label) => {
    debounceSearch(label);
  };

  const onKeyDown = (event) => {
    const parentNode =
      event.target.parentNode?.parentNode?.parentNode?.parentNode;
    const label = parentNode?.id.replace("receive_input_option_", "");
    const refs = inputReceiveRefs[label];
    if (refs && refs.current) {
      const focusedOption = refs.current.state?.focusedOption || {};
      const { value, __isNew__ } = focusedOption;
      if (event.key === "Enter" || event.key === "Tab") {
        if (!validateEmail(value) && __isNew__) {
          event.preventDefault();
        } else {
          updateInputReceive("", label);
        }
      }
    }
    if (enableSearch) {
      handleSearch(label);
    }
  };
  const customComponent = {
    Option: CustomOption,
    DropdownIndicator: null,
    ClearIndicator: null,
  };

  return (
    <div className="receive-list-wrapper receive-input">
      {receiveList.length > 0 &&
        receiveList.map((receiveItem, index) => {
          const {
            label,
            options,
            isChange,
            display,
            value,
            isShowCloseButton,
          } = receiveItem;
          if (!display) {
            return null;
          }
          return (
            <div
              key={index}
              className={`flex-row receive-item receive-item-to`}
            >
              <div className={` d-flex ${isHorizontal ? `flex-column` : ``}`}>
                <div
                  className={`receive-label ${
                    !isHorizontal ? `align-self-center` : ``
                  }`}
                >
                  {t(`outlook.mail:${label.toLowerCase()}`)}
                </div>
                <CreatableSelect
                  isClearable
                  id={`receive_input_option_${label.toLowerCase()}`}
                  isMulti
                  inputValue={inputReceive[label.toLowerCase()]}
                  ref={inputReceiveRefs[label.toLowerCase()]}
                  styles={customStyles}
                  components={customComponent}
                  options={options}
                  placeholder=""
                  cache={false}
                  defaultValue={value}
                  menuIsOpen={isChange}
                  onInputChange={(value, action) =>
                    handleInputChange(index, value, action, label.toLowerCase())
                  }
                  onChange={(option, action) =>
                    handleOnChange(option, action, index)
                  }
                  onKeyDown={onKeyDown}
                  formatCreateLabel={() => null}
                  className="receive-input-option"
                />
                {isShowCloseButton && (
                  <IconButton
                    style={{ color: "#3E3F41" }}
                    component="span"
                    size="small"
                    onClick={() => handleHideMoreReceiveButtons(label)}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default ReceiveListSelect;
