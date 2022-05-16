import {
  Checkbox,
  Menu,
  MenuItem,
  FormControl,
  Select,
  makeStyles,
  Input,
} from "@material-ui/core";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import subtract from "../../assets/icons/close.svg";
import FilterNor from "../../assets/icons/filter-nor.svg";
import Filter from "../../assets/icons/filter_nor_union.svg";
import ResetIcon from "../../assets/icons/reset-icon.svg";
import SearchIcon from "../../assets/icons/search-icon-black.svg";
import CheckIcon from "../../assets/icons/check_green.svg";
import CheckboxCustom from "../../assets/icons/check-box.svg";
import {
  mailFolders as mailFoldersDefault,
  mailStatus,
} from "../../outlook/config";
import "./message-list-header.css";
import { withStyles } from "@material-ui/core/styles";
import {
  setActiveEmail,
  setCurrentMailFolder,
  setFiltering,
  setRefreshButtonClick,
  setSearching,
} from "../../store/actions/outlook-mail-actions";

import { useMsal } from "@azure/msal-react";
import { clearDataCached } from "../../utilities/outlook";

const useStyles = makeStyles({
  root: {
    marginLeft: "5px",
    "& .MuiSelect-select": {
      color: "#19191A",
      "& img": {
        display: "none",
      },
    },
    "& .MuiInput-underline:before ": {
      border: "none",
    },
    "& .MuiInput-underline:after": {
      border: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before ": {
      border: "none",
    },
    "& .MuiSelect-select:focus": {
      backgroundColor: "#ffffff",
    },
    "& .MuiInputBase-input": {
      paddingTop: "4px",
      paddingBottom: 0,
    },
    // "& .MuiListItem-root.Mui-selected": {
    //   backgroundColor: "black", // updated backgroundColor
    // },
  },
  selected: {
    backgroundColor: "#EFF6FF !important",
    border: "1px solid #DAEBFF !important",
  },
});

const StyledMenuItem = withStyles({
  root: {
    paddingLeft: "5px",
    fontSize: "12px",
    color: "#19191A",
    height: "32px",
    padding: "8px 10px",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "normal",
  },
})(MenuItem);

const checkBoxStyles = () => ({
  root: {
    color: "#c8c8c8",
    "&$checked": {
      color: "#18B263",
    },
    "&$indeterminate": {
      color: "#18B263",
    },
    "& .MuiIconButton-label": {
      width: "16px",
      height: "16px",
    },
  },
  indeterminate: {
    color: "#18B263",
  },
  checked: {},
});
const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);

function MessageListHeader(props) {
  const {
    getListEmail,
    setEmails,
    typeEmail,
    setTypeEmail,
    handleCheckAll,
    emailChecked,
    emails,
    loading,
    setOpenSearch,
    setKeyword,
    keyword,
    setOpenSearchAdvanceOption,
  } = props;
  const classes = useStyles();
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isSearching, setIsSearching] = useState(false);

  const [emailStatus, setEmailStatus] = useState("");
  const [activeFilter, setActiveFilter] = useState(false);

  const [typeEmailOptionIndex, setTypeEmailOptionIndex] = useState(0);
  const [statusMailOptionIndex, setStatusMailOptionIndex] = useState(0);
  //define state related to filter button
  const [mailFolderValue, setMailFolderValue] = useState(
    mailFoldersDefault[0].value
  );
  const [anchorMailStatus, setAnchorMailStatus] = useState(null);
  //const [mailFolders] = useState(mailFoldersDefault);
  const handleFilterEmailByType = async (value, index) => {
    if (loading) {
      return;
    }
    clearDataCached();
    setOpenSearch(false);
    setTypeEmailOptionIndex(index);
    setMailFolderValue(value);
    setEmails([]);
    setTypeEmail(value);
    dispatch(setCurrentMailFolder(value));
    // filter flag
    if (statusMailOptionIndex === 3) {
      await getListEmail(value, true, false, "", emailStatus);
    } else {
      // to me
      let keyword = emailStatus;
      if (statusMailOptionIndex === 1) {
        keyword = keyword.replace("{email}", activeAccount?.username);
      }
      await getListEmail(value, true, false, keyword, "");
    }
    dispatch(setActiveEmail({}));
    if (statusMailOptionIndex === 0) {
      dispatch(setSearching(false));
    } else {
      dispatch(setSearching(true));
    }
  };

  useEffect(() => {
    const typeEmailOptionIndexFind = mailFoldersDefault.findIndex(
      (mail) => mail.value === typeEmail
    );
    setTypeEmailOptionIndex(typeEmailOptionIndexFind);
    setMailFolderValue(typeEmail);
  }, [typeEmail]);

  const handleFilterEmailByStatus = async (value, index, id) => {
    if (loading) {
      return;
    }
    clearDataCached();
    setOpenSearch(false);
    setEmails([]);
    setStatusMailOptionIndex(index);
    setEmailStatus(value);
    setActiveFilter(value.toLowerCase() !== "");
    dispatch(setFiltering(value.toLowerCase() !== ""));
    dispatch(setSearching(value.toLowerCase() !== ""));
    setAnchorMailStatus(null);
    // to me
    let filter = "";
    if (id === 11) {
      value = value.replace("{email}", activeAccount?.username);
    }
    // if flag use filter
    if (id === 9) {
      filter = value;
      value = "";
    }
    await getListEmail(typeEmail, true, false, value, filter);
  };

  /*const handleSearchEmail = async (keyword) => {
    if (loading) {
      return;
    }
    setOpenSearch(false);
    setEmails([]);
    await getListEmail(
      typeEmail,
      true,
      false,
      keyword.toUpperCase(),
      emailStatus
    );
  };*/
  /*const debounceSearch = useCallback(debounce(handleSearchEmail, 300), [
    typeEmail,
  ]);*/
  const handleSearch = async () => {
    if (loading) {
      return;
    }
    clearDataCached();
    if (keyword === "") {
      return;
    }
    // escape slash
    const keywordSearch = `"${keyword.toUpperCase().replaceAll("\\", "\\\\")}"`;
    const search = `&$search=${encodeURIComponent(keywordSearch)}`;
    await getListEmail(typeEmail, true, false, search, "");
  };
  const handleSetKeyword = (e) => {
    const { value = "" } = e.target;
    setKeyword(value);
  };

  const handleCloseSearchInput = (e) => {
    setIsSearching(false);
    setOpenSearchAdvanceOption(false);
    setOpenSearch(false);
    handleRefresh();
  };
  const handleRefresh = async () => {
    if (loading) {
      return;
    }
    clearDataCached();
    setOpenSearch(false);
    dispatch(setRefreshButtonClick(true));
    dispatch(setSearching(false));
    if (statusMailOptionIndex === 3) {
      await getListEmail(typeEmail, true, false, "", emailStatus);
    } else {
      // to me
      let keyword = emailStatus;
      if (statusMailOptionIndex === 1) {
        keyword = keyword.replace("{email}", activeAccount?.username);
      }
      await getListEmail(typeEmail, true, false, keyword, "");
    }
    dispatch(setRefreshButtonClick(false));
  };

  const isOpenMailStatusMenu = Boolean(anchorMailStatus);
  const handleOpenFilterMenu = (event) => {
    setAnchorMailStatus(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setAnchorMailStatus(null);
  };
  const resizeWindow = () => {
    setStatusMailOptionIndex(0);
    setActiveFilter(false);
    dispatch(setFiltering(false));
  };
  useEffect(() => {
    //resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);
  const handleOpenSearch = () => {
    setIsSearching(true);
    dispatch(setSearching(true));
    setOpenSearchAdvanceOption(true);
  };
  const defaultListMailHeader = (
    <div className="message-header-outer-container">
      <div className="inner-container">
        <div className="wrap-left d-flex align-items-center">
          <CustomCheckbox
            icon={<img src={CheckboxCustom} alt={"check-box"} />}
            onClick={handleCheckAll}
            className="p-0"
            checked={
              emailChecked.length > 0 && emails.length === emailChecked.length
            }
            indeterminate={
              emailChecked.length > 0 && emails.length !== emailChecked.length
            }
          />
          <FormControl
            variant="standard"
            className={classes.root}
            style={{ marginLeft: "24px" }}
          >
            <Select
              labelId="mail-folder-select"
              id="mail-folder-select"
              value={mailFolderValue}
              // onChange={handleFilterEmailByType}
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
            >
              {mailFoldersDefault.map((item, index) => {
                return (
                  <StyledMenuItem
                    value={item.value}
                    key={item.id}
                    classes={{ selected: classes.selected }}
                    onClick={() => handleFilterEmailByType(item.value, index)}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {typeEmailOptionIndex === index && (
                        <img
                          src={CheckIcon}
                          alt={"check-icon"}
                          style={{ paddingRight: "5px" }}
                        />
                      )}
                      <div
                        style={{
                          marginLeft:
                            typeEmailOptionIndex !== index ? "25px" : "",
                        }}
                      >
                        {t(`mailFolder:${item.label}`)}
                      </div>
                    </div>
                  </StyledMenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="feature-icon">
          <img
            src={SearchIcon}
            alt="searchIcon"
            onClick={() => handleOpenSearch()}
          />
          <img
            id="refresh-btn"
            src={ResetIcon}
            alt="reset-icon"
            className="refesh-icon"
            onClick={handleRefresh}
          />
          <img
            src={activeFilter ? FilterNor : Filter}
            alt="union"
            onClick={handleOpenFilterMenu}
          />
          <Menu
            id="filter-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorMailStatus}
            // className={classes.root}
            open={isOpenMailStatusMenu}
            onClose={handleCloseFilterMenu}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            {mailStatus.map((item, index) => {
              return (
                <StyledMenuItem
                  key={item.id}
                  selected={statusMailOptionIndex === index}
                  classes={{ selected: classes.selected }}
                  onClick={() =>
                    handleFilterEmailByStatus(item.value, index, item.id)
                  }
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {statusMailOptionIndex === index && (
                      <img src={CheckIcon} alt={"check-icon"} />
                    )}
                    <div
                      style={{
                        marginLeft:
                          statusMailOptionIndex !== index ? "20px" : "",
                        paddingLeft: 5,
                      }}
                    >
                      {t(`email-filter:${item.label}`)}
                    </div>
                  </div>
                </StyledMenuItem>
              );
            })}
          </Menu>
        </div>
      </div>
    </div>
  );

  const searchListMailHeader = (
    <div className="message-header-outer-container ">
      <img
        src={SearchIcon}
        alt="searchIcon"
        className={`image ${keyword ? "active" : ""}`}
        onClick={handleSearch}
      />
      <input
        placeholder={t("outlook.mail:search")}
        className="input-middle"
        onChange={handleSetKeyword}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <img
        src={subtract}
        alt="subtract"
        onClick={(e) => handleCloseSearchInput(e)}
      />
    </div>
  );

  return (
    <div id="message-list-header-id" className="message-list-header">
      {isSearching ? searchListMailHeader : defaultListMailHeader}
    </div>
  );
}

export default MessageListHeader;
