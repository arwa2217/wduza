import React, { useEffect, useRef, useState } from "react";
import ArrowDown from "../../assets/icons/arrow-down.svg";
import ArrowRight from "../../assets/icons/arrow-right.svg";
import "./advanced-search.css";
import { mailFolders as mailFoldersDefault } from "../../outlook/config";
import {
  Checkbox,
  FormControl,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import CheckIcon from "../../assets/icons/check_green.svg";
import { withStyles } from "@material-ui/core/styles";
import Button from "react-bootstrap/Button";
import {
  clearDataCached,
  getDefaultState,
  getQuerySearchString,
  getValueToRecipientFromRefs,
  hideAllCloseButton,
  showAllInput,
} from "../../utilities/outlook";
import ReceiveListSelect from "../outlook-common/receive-list-select";
import { setSearching } from "../../store/actions/outlook-mail-actions";
import { useDispatch } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
import CalendarIcon from "./CalendarIcon";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  input: {
    "& .MuiInput-underline:before ": {
      borderBottom: "1px solid #DEDEDE",
    },
    "& .MuiInput-underline:after": {
      border: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before ": {
      borderBottom: "1px solid #DEDEDE",
    },
  },
  inputDate: {
    "& .MuiInput-underline:before ": {
      borderBottom: "1px solid #DEDEDE",
      content: "",
    },
    "& .MuiInput-underline:after": {
      border: "none",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before ": {
      borderBottom: "1px solid #DEDEDE",
    },
    "& .MuiFormLabel-root": {
      color: "#999999!important",
    },
    "& .MuiButtonBase-root.MuiIconButton-root": {
      padding: 0,
    },
  },
  root: {
    "& .MuiSelect-select": {
      border: "1px solid #DEDEDE",
      height: "32px",
      color: "#333",
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
      "&::placeholder": {
        display: "none",
      },
    },
  },
  selected: {
    backgroundColor: "#EFF6FF !important",
    border: "1px solid #DAEBFF !important",
  },

  cssFocused: {},
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
const AdvancedSearch = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    getListEmail,
    typeEmail,
    setTypeEmail,
    openSearch,
    setOpenSearch,
    keyword,
    openSearchAdvanceOption,
  } = props;
  const mailFolders = mailFoldersDefault;
  const classes = useStyles();
  const defaultSearch = {
    mailFolders: typeEmail,
    subject: "",
    keyword: keyword,
    dateStart: null,
    dateEnd: null,
    attachments: false,
  };
  const [searchObj, setSearchObj] = useState(defaultSearch);

  const [receiveList, setReceiveList] = useState(
    getDefaultState("From", "To", "Cc")
  );
  const inputReceiveRefs = {
    from: useRef(null),
    to: useRef(null),
    cc: useRef(null),
  };
  const [inputReceive, setInputReceive] = useState({
    from: "",
    to: "",
    cc: "",
  });
  const [defaultOptions] = useState({
    to: [],
    cc: [],
    bcc: [],
  });

  useEffect(() => {
    setSearchObj({
      ...searchObj,
      keyword: keyword,
    });
  }, [keyword]);

  useEffect(() => {
    setSearchObj({
      ...searchObj,
      mailFolders: typeEmail,
    });
  }, [typeEmail]);

  useEffect(() => {
    const updateState = getDefaultState("From", "To", "Cc");
    showAllInput(updateState);
    hideAllCloseButton(updateState);
    setReceiveList([...updateState]);
  }, []);
  const handleSearch = async () => {
    clearDataCached();
    const { mailFolders, subject, keyword, dateStart, dateEnd, attachments } =
      searchObj;
    const { from, to, cc } = inputReceive;
    const searchFromRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "from",
      from
    );
    const searchToRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "to",
      to
    );
    const searchCcRecipients = getValueToRecipientFromRefs(
      inputReceiveRefs,
      "cc",
      cc
    );
    const keywordSearch = getQuerySearchString(
      subject,
      keyword,
      dateStart,
      dateEnd,
      attachments,
      searchFromRecipients,
      searchToRecipients,
      searchCcRecipients
    );
    setOpenSearch(false);
    if (keywordSearch !== "") {
      dispatch(setSearching(true));
    }
    await getListEmail(mailFolders, true, false, keywordSearch, "");
    setTypeEmail(mailFolders);
  };
  const { dateStart, dateEnd } = searchObj;
  return (
    <div className="advanced-search position-relative">
      <div>
        {openSearchAdvanceOption && (
          <div
            className="advanced-search-title"
            onClick={() => setOpenSearch(!openSearch)}
          >
            <span>{t("advanced-search:title")}</span>
            {openSearch ? (
              <img src={ArrowDown} alt="arrow-down" />
            ) : (
              <img src={ArrowRight} alt="arrow-up" />
            )}
          </div>
        )}

        {openSearch && (
          <div className="advanced-search-collapse">
            <div className="search-option">
              <span className="search-label">
                {t("advanced-search:search.in")}
              </span>
              <FormControl variant="standard" className={classes.root}>
                <Select
                  labelId="mail-folder-select"
                  id="mail-folder-select"
                  value={searchObj.mailFolders}
                  placeholder="All Folder"
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  {mailFolders.map((item, index) => {
                    return (
                      <StyledMenuItem
                        value={item.value}
                        key={item.id}
                        onClick={() => {
                          setSearchObj({
                            ...searchObj,
                            mailFolders: item.value,
                          });
                        }}
                      >
                        {searchObj.mailFolders === item.value && (
                          <img src={CheckIcon} alt={"check-icon"} />
                        )}
                        <div
                          className="option-label"
                          style={{
                            marginLeft:
                              searchObj.mailFolders !== item.value
                                ? "20px"
                                : "",
                          }}
                        >
                          {t(`mailFolder:${item.label}`)}
                        </div>
                      </StyledMenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <ReceiveListSelect
              receiveList={receiveList}
              setReceiveList={setReceiveList}
              inputReceiveRefs={inputReceiveRefs}
              inputReceive={inputReceive}
              setInputReceive={setInputReceive}
              isHorizontal={true}
              defaultOptions={defaultOptions}
            />
            <div className="search-option">
              <span className="search-label">
                {t("advanced-search:subject")}
              </span>
              <TextField
                variant="standard"
                className={classes.input}
                value={searchObj.subject}
                onChange={(event) =>
                  setSearchObj({ ...searchObj, subject: event.target.value })
                }
                focused
              />
            </div>
            <div className="search-option">
              <span className="search-label">
                {t("advanced-search:keyword")}
              </span>
              <TextField
                variant="standard"
                className={classes.input}
                value={searchObj.keyword}
                onChange={(event) =>
                  setSearchObj({ ...searchObj, keyword: event.target.value })
                }
                focused
              />
            </div>
            <div className="search-option flex-row justify-content-between">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  placeholder={t("advanced-search:startDate")}
                  autoOk={true}
                  className={classes.inputDate}
                  format="MM/dd/yyyy"
                  value={dateStart}
                  onChange={(date) =>
                    setSearchObj({ ...searchObj, dateStart: date })
                  }
                  variant="inline"
                  InputProps={{
                    startAdornment: dateStart !== null && (
                      <IconButton
                        onClick={() =>
                          setSearchObj({ ...searchObj, dateStart: null })
                        }
                        style={{ order: 1 }}
                      >
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                  InputAdornmentProps={{
                    position: "end",
                    style: {
                      order: 2,
                      marginLeft: 0,
                      display: dateStart !== null ? "none" : "",
                    },
                  }}
                  keyboardIcon={<CalendarIcon />}
                />
                <KeyboardDatePicker
                  placeholder={t("advanced-search:endDate")}
                  autoOk={true}
                  className={classes.inputDate}
                  style={{
                    marginLeft: "15px",
                  }}
                  format="MM/dd/yyyy"
                  value={dateEnd}
                  onChange={(date) =>
                    setSearchObj({ ...searchObj, dateEnd: date })
                  }
                  variant="inline"
                  InputProps={{
                    startAdornment: dateEnd !== null && (
                      <IconButton
                        onClick={() =>
                          setSearchObj({ ...searchObj, dateEnd: null })
                        }
                        style={{ order: 1 }}
                      >
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}
                  InputAdornmentProps={{
                    position: "end",
                    style: {
                      order: 2,
                      marginLeft: 0,
                      display: dateEnd !== null ? "none" : "",
                    },
                  }}
                  keyboardIcon={<CalendarIcon />}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="attachment-check">
              <span className="search-label">
                {t("advanced-search:attachments")}
              </span>
              <Checkbox
                checked={searchObj.attachments}
                onChange={(event) =>
                  setSearchObj({
                    ...searchObj,
                    attachments: !searchObj.attachments,
                  })
                }
                className="check-box"
              />
            </div>
            <div className="group-button">
              <Button
                type="button"
                className="clear-button"
                onClick={() => setSearchObj({ ...defaultSearch })}
              >
                {t("advanced-search:clearFilter")}
              </Button>
              <Button type="button" onClick={handleSearch}>
                {t("advanced-search:search")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdvancedSearch;
