import React from "react";
import { useTranslation } from "react-i18next";
import { GlobalSearchMenuDiv } from "./global-search-style";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import { NavLink } from "react-router-dom";
import Search from "../../assets/icons/side-menu/search.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Accordion } from "semantic-ui-react";
import Box from "@material-ui/core/Box";
import SVG from "react-inlinesvg";
import searchIcon from "../../assets/icons/v2/search.svg";
import classNames from "classnames";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  activeMenu: {
    backgroundColor: `${theme.palette.color.accent} !important`,
    "& p.menu-text": {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
    },
    "& .menu-icon": {
      fill: theme.palette.primary.contrastText,
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
      //   fill: theme.palette.primary.contrastText,
      // },
    },
  },
  menuIcon: {
    fill: theme.palette.primary.main,
  },
}));
const GlobalSearchMenu = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AuthReducer.user?.userType);
  const classes = useStyles();
  return (
    <GlobalSearchMenuDiv>
      <Accordion className="channelType">
        <Box className={"menu-parent-icon d-flex flex-row align-items-center"}>
          <Accordion.Title>
            <NavLink
              onClick={() => {
                if (userType !== "GUEST") {
                  dispatch(setActiveMenuItem(MENU_ITEMS.GLOBAL_SEARCH));
                }
              }}
              className={classNames("app-menu-link", classes.menuLink)}
              activeClassName={classNames(
                "app-active-menu",
                classes.activeMenu
              )}
              to={MENU_ITEMS.GLOBAL_SEARCH}
            >
              {props.isExtendMenu ? (
                <>
                  <SVG
                    src={searchIcon}
                    className={classNames("menu-icon", classes.menuIcon)}
                  />
                  <Typography color="textPrimary" className="menu-text">
                    {t("global.search:home")}
                  </Typography>
                </>
              ) : (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip id={t("global.search:home")}>
                      {t("global.search:home")}
                    </Tooltip>
                  }
                >
                  <img src={Search} alt="search" />
                </OverlayTrigger>
              )}
            </NavLink>
          </Accordion.Title>
        </Box>
      </Accordion>
    </GlobalSearchMenuDiv>
  );
};

export default GlobalSearchMenu;
