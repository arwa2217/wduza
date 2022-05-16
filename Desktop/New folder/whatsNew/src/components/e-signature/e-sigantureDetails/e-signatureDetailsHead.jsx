import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import IconCheck from "./../../../assets/icons/v2/ic_check_s.svg";
import IconCheckActive from "./../../../assets/icons/v2/ic_check_s_active.svg";
import IconFilter from "./../../../assets/icons/v2/ic_filter.svg";
import moment from "moment";
import {
  getEsignSearchResult,
} from "../../../store/actions/esignature-actions";

const useStyles = makeStyles((theme) => ({
  flatButton: {
    border: "none",
    backgroundColor: theme.palette.background.sub1,
    color: "#00000066",
    margin: "0 12px 0 0",
    padding: 0,
    fontSize: "11px",
    lineHeight: "15px",
    fontWeight: 400,

    "&:first-child": {
      display: "none",
    },

    "&:hover:not([disabled])": {
      color: theme.palette.text.black70,
    },

    "& > img": {
      marginRight: 4,
    },
  },
  flatButtonActive: {
    border: "none",
    backgroundColor: theme.palette.background.sub1,
    fontWeight: "700",
    color: '#00A95B',

    "&:hover:not([disabled])": {
      color: '#00A95B',
    },
  },
  leftMessageTab: {
    padding: "0 16px",
    height: 40,
    backgroundColor: theme.palette.background.sub1,
    width: "100%",
  },
  searchFilterDropdown: {
    margin: 0,
  },
  searchFilterDropdownMenu: {
    border: "1px solid #CCCCCC",
    borderRadius: "4px",
    minWidth: "114px",
    maxWidth: "114px",
    transform: 'translate(-100px, 21px) !important'
  },
  searchFilterDropdownItem: {
    fontSize: "12px",
    lineHeight: "16px",
    color: "#00000066",
    padding: "4px 8px 4px 30px",
    background: "transparent !important",
    position: 'relative',

    "&:hover": {
      background: "transparent !important",
    },
    "&.active": {
      color: "#00A95B",
    },

    "& > img" : {
      position: 'absolute',
      top: '4px',
      left: '8px',
      width: '16px',
    }
  },
}));
const tabButtons = [
  "All",
  "Need to sign",
  "Waiting for others",
  "Voided",
  "Completed",
];
const searchFilterField = [
  { field: "all", text: "All" },
  { field: "sender", text: "Sender" },
  { field: "receipient", text: "Receipient" },
  { field: "subject", text: "Subject" },
  { field: "message", text: "Message" },
];
const searchFilterTime = [
  { date: "any", text: "Any time" },
  { date: moment().subtract(1, "hours").utc().format(), text: "Past hour" },
  { date: moment().subtract(1, "days").utc().format(), text: "Past 24 hour" },
  { date: moment().subtract(1, "weeks").utc().format(), text: "Past week" },
  { date: moment().subtract(1, "months").utc().format(), text: "Past month" },
  { date: moment().subtract(1, "years").utc().format(), text: "Past year" },
];

function ESignatureDetailsHead(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const searchEnabled = useSelector(
    (state) => state.esignatureReducer.searchEnabled
  );
  const searchFilters = useSelector(
    (state) => state.esignatureReducer.searchFilters
  );
  const searchTerm = useSelector((state) => state.esignatureReducer.searchTerm);
  const [activeTabItem, setActiveTabItem] = useState(tabButtons[0]);

  useEffect(() => {
    if (props.disableAll) {
      setActiveTabItem(tabButtons[0]);
      props.setEsignTab(tabButtons[0]);
    }
  }, [props.disableAll]);

  const handleTabSelection = (tabButton) => {
    if (activeTabItem === tabButton) {
      setActiveTabItem(tabButtons[0]);
      props.setEsignTab(tabButtons[0]);
    } else {
      setActiveTabItem(tabButton);
      props.setEsignTab(tabButton);
    }
  };

  const handleFieldChange = (e, field) => {
    let searchText = searchTerm;
    let filterObject = { ...searchFilters, field: field };
    if (searchText.length > 2) {
      dispatch(getEsignSearchResult (searchText, filterObject));
    }
  };
  const handleDateChange = (e, date) => {
    let searchText = searchTerm;
    let filterObject = { ...searchFilters, date: date };
    if (searchText.length > 2) {
      dispatch(getEsignSearchResult(searchText, filterObject));
    }
  };

  const filterDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      {/* &#x25bc; */}
    </a>
  ));

  return (
    <Box
      className={classNames(
        "m-0 left-message-tab d-flex align-items-center justify-content-between",
        classes.leftMessageTab
      )}
    >
      {!props.disableAll && (
        <>
          {searchEnabled ? (
            <>
              <Box className="btn-groups btn-filter">
                <button className={classNames(classes.flatButton)}>All</button>
                <button className={classNames(classes.flatButton)}>
                  <img src={IconCheck} alt="" />
                  {
                    searchFilterField.find(
                      (el) => el.field === searchFilters.field
                    ).text
                  }
                </button>
                <button className={classNames(classes.flatButton)}>
                  <img src={IconCheck} alt="" />
                  {
                    searchFilterTime.find(
                      (el) => el.date === searchFilters.date
                    ).text
                  }
                </button>
              </Box>
              <Dropdown
               
                className={classNames(
                  "esign-filter-dropdown",
                  classes.searchFilterDropdown
                )}
              >
                <Dropdown.Toggle as={filterDropdownToggle}  id="esign-filter-dropdown">
                  <img src={IconFilter} alt="" />
                </Dropdown.Toggle>

                <Dropdown.Menu
                 align="end"
                  className={classNames(
                    "esign-filter-dropdown-menu",
                    classes.searchFilterDropdownMenu
                  )}
                >
                  {searchFilterField.map((el) => (
                    <Dropdown.Item
                      className={classNames(
                        `${searchFilters.field === el.field ? "active" : ""}`,
                        classes.searchFilterDropdownItem
                      )}
                      key={`esign-field-${el.field}`}
                      onClick={(e) => handleFieldChange(e, el.field)}
                    >
                      {searchFilters.field === el.field && (
                        <img src={IconCheckActive} alt="" />
                      )}
                      {el.text}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  {searchFilterTime.map((el) => (
                    <Dropdown.Item
                      className={classNames(
                        `${searchFilters.date === el.date ? "active" : ""}`,
                        classes.searchFilterDropdownItem
                      )}
                      key={`esign-time-${el.date}`}
                      onClick={(e) => handleDateChange(e, el.date)}
                    >
                      {searchFilters.date === el.date && (
                        <img src={IconCheckActive} alt="" />
                      )}
                      {el.text}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Box className="btn-groups btn-filter">
              {tabButtons.map((tabButton, index) => {
                return (
                  <button
                    key={index}
                    onClick={() =>
                      !props.disableAll && handleTabSelection(tabButton)
                    }
                    className={classNames(
                      classes.flatButton,
                      activeTabItem.toLowerCase().split("_").join(" ") ===
                        tabButton.toLowerCase() && classes.flatButtonActive
                    )}
                    disabled={props.disableAll}
                  >
                    <img src={activeTabItem.toLowerCase().split("_").join(" ") ===
                        tabButton.toLowerCase() ? IconCheckActive : IconCheck} alt="" />
                    {tabButton}
                  </button>
                );
              })}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default ESignatureDetailsHead;
