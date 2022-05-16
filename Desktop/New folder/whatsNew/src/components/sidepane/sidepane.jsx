import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import "./sidepane.css";
import DataPanel from "../datapanel/datapanel";
import Channels from "../channel/channel";
import NewUIAdmins from "../channel/newui-admin";
import SettingsPanel from "../settingspanel/settingsPanel";
import UserSummary from "../user-summary/user-summary";
import GlobalSearchMenu from "../global-search/global-search-menu";
import NewUIOutLook from "../channel/newui-outlook";
import { useIsAuthenticated } from "@azure/msal-react";
import services from "../../outlook/apiService";
import FilesMenu from "../files/filesMenu";
import { useLocation } from "react-router-dom";
import {
  setMailFolderInfo,
  updateUnreadInConversation,
} from "../../store/actions/outlook-mail-actions";
import NewUICollection from "../channel/newui-collection";
import { USER_ROLES } from "../../utilities/user-roles";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "../../assets/icons/v2/search.svg";
import CancelIcon from "../../assets/icons/v2/ic_cancel_circle.svg";
import SVG from "react-inlinesvg";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import arrowIcon from "../../assets/icons/v2/menu_arrow.svg";
import ESignatureMenu from "../e-signature/e-signature";
import History from "../../utilities/history";
import { MENU_ITEMS } from "../../constants/menu-items";

const SideMenu = styled.div`
  ::-webkit-scrollbar {
    width: 12px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: transparent !important;
    box-shadow: inset 0 0 14px 14px rgba(0, 0, 0, 0.1);
    border: solid 4px transparent !important;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const useStyles = makeStyles((theme) => ({
  searchBox: {
    border: `1px solid ${theme.palette.color.columnArea}`,
    height: "32px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    "& .MuiInputBase-input": {
      padding: "6px 0",
      textIndent: "6px",
      height: "32px",
      boxSizing: "border-box",
    },
    "& input::placeholder": {
      color: "rgba(0, 0, 0, 0.9) !important",
      opacity: "0.35 !important",
    },
    "& .MuiIconButton-label": {
      paddingLeft: "4px",
    },
  },
  iconSearch: {
    fill: theme.palette.color.icon1,
    width: "20px",
    height: "20px",
  },
  activeMenu: {
    backgroundColor: `${theme.palette.color.accent} !important`,
    "& p.menu-text": {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
    },
    "& .menu-icon": {
      stroke: theme.palette.primary.contrastText,
    },
  },
  menuLink: {
    "&:hover": {
      backgroundColor: theme.palette.background.sub2,
      // "& p.menu-text": {
      //   color: theme.palette.primary.contrastText,
      //   fontWeight: "bold",
      // },
      // "& .menu-icon": {
      //   stroke: theme.palette.primary.contrastText,
      // },
    },
  },
  menuItem: {
    "&:hover, &.active": {
      "& p.menu-text": {
        color: theme.palette.color.accent,
        fontWeight: "bold",
      },
      backgroundImage: `url(${arrowIcon})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left",
    },
    "& p.menu-text": {
      fontSize: 13,
      lineHeight: "20px",
    },
  },
  menuIcon: {
    stroke: theme.palette.primary.main,
  },
  inputSearch: {},
  adminWrapper: {
    display: "flex",
    alignItems: "center",
    color: theme.palette.text.black50,
    fontSize: "12px",
    height: "40px",
    cursor: "pointer",
    borderTop: `1px solid ${theme.palette.color.divider}`,
    "& :hover": {
      color: theme.palette.text.black70,
    },
  },
}));
function SidePane(props) {
  const classes = useStyles();
  const { toggleMenu, isExtendMenu } = props;
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const isAuthenticated = useIsAuthenticated();
  const [unreadNumber, setUnReadNumber] = useState(0);
  const inputRef = useRef(null);
  const activeActionPanel = useSelector(
    (state) => state.config?.activeActionPanel
  );

  const updateUnReadNumber = useSelector(
    (state) => state.OutlookMailReducer?.unReadNumber
  );
  const isUpdateUnread = useSelector(
    (state) => state.OutlookMailReducer.updateUnreadInConversation
  );
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
  );
  const emailsAffected = useSelector(
    (state) => state.OutlookMailReducer?.emailsAffected
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const getUnReadInboxEmail = async () => {
    try {
      if (isAuthenticated) {
        const result = await services.getInfoInboxFolder();
        if (result) {
          const { unreadItemCount, id } = result;
          setUnReadNumber(unreadItemCount);
          dispatch(
            setMailFolderInfo({
              inbox: id,
            })
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleToggleMenu = () => {
    toggleMenu(!isExtendMenu);
  };

  useEffect(() => {
    const emailColorInLocal = localStorage.getItem("EMAIL_COLOR");
    if (emailColorInLocal) {
      localStorage.removeItem("EMAIL_COLOR");
    }
  }, []);
  useEffect(() => {
    if (location.pathname === "/email") {
      getUnReadInboxEmail();
    }
  }, [activeActionPanel]);

  useEffect(() => {
    getUnReadInboxEmail();
    if (Object.keys(activeEmail).length) {
      getUnReadInboxEmail();
    }
  }, [activeEmail, emailsAffected]);

  useEffect(() => {
    if (updateUnReadNumber) {
      setUnReadNumber(unreadNumber + updateUnReadNumber);
    }
  }, [updateUnReadNumber]);
  useEffect(() => {
    if (isUpdateUnread) {
      setUnReadNumber(unreadNumber - 1);
      dispatch(updateUnreadInConversation(false));
    }
  }, [isUpdateUnread]);

  const [searchValue, setSearchValue] = useState("");
  const handleSearch = () => {
    History.push(`${MENU_ITEMS.GLOBAL_SEARCH}?q=${searchValue}`);
  };
  const handleClearText = () => {
    document.getElementById("search-input").focus();
    document.getElementById("search-input").value = "";
    document.getElementById("cancel-search").style.display = "none";
    document.getElementById("search-box").style.border = "1px solid #CCCCCC";
  };
  const onChange = (event) => {
    setSearchValue(event?.target?.value);
    if (document.getElementById("search-input").value === "") {
      document.getElementById("cancel-search").style.display = "none";
      document.getElementById("search-box").style.border = "1px solid #CCCCCC";
    } else {
      document.getElementById("cancel-search").style.display = "block";
      document.getElementById("search-box").style.border = "2px solid #03BD5D";
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  return (
    <>
      {props.isDesktop ? (
        <>
          {/*<DataPanel />*/}
          <Box
            className="h-100"
            sx={{ bgcolor: "background.sub1" }}
            style={{
              padding: "18px 16px 0 16px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SettingsPanel isExtendMenu={true} />
            {/*<div
            className="toggle-menu-icon"
            onClick={handleToggleMenu}
            style={
              !isExtendMenu
                ? { padding: 8, display: "flex", justifyContent: "center" }
                : {}
            }
          >
            {isExtendMenu ? (
              <img src={NarrowDownMenu} alt={"narrow-down-menu"} />
            ) : (
              <img src={ExtendMenu} alt={"extend-menu"} />
            )}
          </div>*/}
            <Box
              id="search-box"
              className={classNames("d-flex", classes.searchBox)}
              sx={{
                bgcolor: "background.sub2",
                mt: 4,
                borderRadius: 5,
              }}
            >
              <IconButton
                type="submit"
                aria-label="search"
                className="p-0"
                onClick={handleSearch}
              >
                <SVG src={SearchIcon} className={classes.iconSearch} />
              </IconButton>
              <InputBase
                id="search-input"
                placeholder="Search"
                inputProps={{ "aria-label": "Search" }}
                onKeyPress={(e) => handleKeyPress(e)}
                onChange={onChange}
                autoComplete="off"
                ref={inputRef}
                style={{
                  caretColor: "#00a95b",
                }}
              />
              <IconButton
                id="cancel-search"
                type="submit"
                aria-label="cancel"
                className="p-0"
                onClick={handleClearText}
                style={{ display: "none", marginRight: "8px" }}
              >
                <SVG src={CancelIcon} />
              </IconButton>
            </Box>
            <SideMenu className="sideMenu">
              <UserSummary isExtendMenu={true} />
              {/*<GlobalSearchMenu isExtendMenu={isExtendMenu} />*/}
              {/*<NewUIChannels*/}
              {/*  isExtendMenu={isExtendMenu}*/}
              {/*  handleToggleMenu={handleToggleMenu}*/}
              {/*/>*/}

              <NewUICollection
                isExtendMenu={true}
                handleToggleMenu={handleToggleMenu}
                location={location}
              />
              <FilesMenu isExtendMenu={true} />
              {/*<NewUIOutLook
              unreadNumber={unreadNumber}
              isExtendMenu={isExtendMenu}
              handleToggleMenu={handleToggleMenu}
              location={location}
              classes={classes}
            />*/}
              <ESignatureMenu isExtendMenu={true} />
              {/*{(currentUser.role === USER_ROLES.ADMIN ||
              currentUser.role === USER_ROLES.SUPER_ADMIN) && (
              <NewUIAdmins
                isExtendMenu={isExtendMenu}
                handleToggleMenu={handleToggleMenu}
              />
            )}*/}
            </SideMenu>
            {currentUser.role === "ADMIN" && (
              <div className={classes.adminWrapper}>
                <div>Admin</div>
              </div>
            )}
          </Box>
        </>
      ) : (
        <SideMenu className="sideMenu">
          <DataPanel />
          <Channels />
        </SideMenu>
      )}
    </>
  );
}
export default SidePane;
