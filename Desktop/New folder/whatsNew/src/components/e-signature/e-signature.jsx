import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import { getDashboardData } from "../../store/actions/user-home-actions";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { NavLink } from "react-router-dom";
import Box from "@material-ui/core/Box";
import SVG from "react-inlinesvg";
import eSignatureIcon from "../../assets/icons/v2/ic_esignature.svg";
import { Accordion } from "semantic-ui-react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  menuIcon: {
    stroke: "#00A95B",
    fill: "#00A95B",
  },
  menuLink: {
    "&:hover": {
      // backgroundColor: theme.palette.background.sub2,
      // "& p.menu-text": {
      //   color: theme.palette.primary.contrastText,
      //   fontWeight: "bold",
      // },
      // "& .menu-icon": {
      //   fill: theme.palette.primary.contrastText,
      //   stroke: theme.palette.primary.contrastText,
      // },
    },
  },
  activeMenu: {
    backgroundColor: `#03BD5D !important`,
    "& p.menu-text": {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
    },
    "& .menu-icon": {
      fill: "#fff",
      stroke: "#fff",
    },
    "&:hover": {
      backgroundColor: `#03BD5D !important`,
    },
   
  },
  

}));
const ESignature = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.AuthReducer.user?.userType);
  const classes = useStyles();

  return (
    <div>
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
              to={"/esignature"}
            >
              {props.isExtendMenu ? (
                <>
                  <SVG
                    src={eSignatureIcon}
                    className={classNames("menu-icon", classes.menuIcon)}
                  />
                  <Typography color="textPrimary" className="menu-text">
                    {t("user.summary:eSignature")}
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
                  <SVG src={eSignatureIcon} />
                </OverlayTrigger>
              )}
            </NavLink>
          </Accordion.Title>
        </Box>
      </Accordion>
    </div>
  );
};

export default ESignature;
