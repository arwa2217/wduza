import React from "react";
import { useTranslation } from "react-i18next";
import { UserSummaryDiv } from "./user-summary-style";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import { getDashboardData } from "../../store/actions/user-home-actions";
import Home from "../../assets/icons/side-menu/home.svg";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { NavLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import SVG from "react-inlinesvg";
import HomeIcon from "../../assets/icons/v2/ic_whats.svg";
import { Accordion } from "semantic-ui-react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
const useStyles = makeStyles((theme) => ({
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
    // "&:hover": {
    //   backgroundColor: theme.palette.background.sub2,
      // "& p.menu-text": {
      //   color: theme.palette.primary.contrastText,
      //   fontWeight: "bold",
      // },
      // "& .menu-icon": {
      //   stroke: theme.palette.primary.contrastText,
      // },
    // },
  },
  menuIcon: {
    stroke: theme.palette.primary.main,
  },
}));
const UserSummary = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AuthReducer.user?.userType);
  const classes = useStyles();
  return (
    <UserSummaryDiv>
      <Accordion className="channelType">
        <Box className={"menu-parent-icon d-flex flex-row align-items-center"}>
          <Accordion.Title>
            <NavLink
              onClick={() => {
                if (userType !== "GUEST") {
                  dispatch(setActiveMenuItem(MENU_ITEMS.HOME));
                  dispatch(getDashboardData());
                }
              }}
              className={classNames("app-menu-link", classes.menuLink)}
              activeClassName={classNames(
                "app-active-menu",
                classes.activeMenu
              )}
              to={MENU_ITEMS.HOME}
            >
              {props.isExtendMenu ? (
                <>
                  <SVG
                    src={HomeIcon}
                    fill="none"
                    className={classNames("menu-icon", classes.menuIcon)}
                  />
                  <Typography color="textPrimary" className="menu-text">
                    {t("user.summary:whatsNew")}
                  </Typography>
                </>
              ) : (
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip id={t("user.summary:home")}>
                      {t("user.summary:home")}
                    </Tooltip>
                  }
                >
                  <SVG src={HomeIcon} />
                </OverlayTrigger>
              )}
            </NavLink>
          </Accordion.Title>
        </Box>
      </Accordion>
    </UserSummaryDiv>
  );
};

export default UserSummary;
