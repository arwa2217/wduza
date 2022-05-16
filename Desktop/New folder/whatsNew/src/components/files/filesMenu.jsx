import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import { GlobalSearchMenuDiv } from "../global-search/file-search-style";
import { NavLink } from "react-router-dom";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Accordion} from "semantic-ui-react";
import classNames from "classnames";
import SVG from "react-inlinesvg";
import fileIcon from "../../assets/icons/v2/files_inactive-fill.svg";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(
    theme => ({
        
        menuLink: {
            "&:hover": {
                // backgroundColor: "#E6E6E6",
                "& p.menu-text": {
                  color: "rgba(0,0,0,0.9)",
                  fontWeight: "normal",
                },
                "& .menu-icon": {
                  stroke: '#00A95B',
                },
              },
        },
        activeMenu: {
            backgroundColor: theme.palette.color.accent,
            "& p.menu-text":{
                color: theme.palette.primary.contrastText,
                fontWeight: "bold"
            },
            "& .menu-icon":{
                stroke: theme.palette.primary.contrastText
            },
            "&:hover": {
                backgroundColor: `#03BD5D !important`,
            },
            "&:hover p.menu-text": {
                color: theme.palette.primary.contrastText,
                fontWeight: "bold"
            },
            "&:hover .menu-icon": {
                stroke: "#fff",
            }
        },
        menuIcon: {
            stroke: theme.palette.primary.main
        }
    })
);
const FilesMenu = () => {
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
                        className={classNames("app-menu-link", classes.menuLink)}
                        onClick={() => {
                            if (userType !== "GUEST") {
                                dispatch(setActiveMenuItem(MENU_ITEMS.FILES));
                            }
                        }}
                        activeClassName={classNames("app-active-menu", classes.activeMenu)}
                        to={MENU_ITEMS.FILES}
                    >
                        <SVG src={fileIcon} fill="none" className={classNames("menu-icon", classes.menuIcon)}/>
                        <Typography color="textPrimary" className="menu-text">
                            {t("files:menu")}
                        </Typography>
                    </NavLink>
                </Accordion.Title>
            </Box>
        </Accordion>

    </GlobalSearchMenuDiv>
  );
};

export default FilesMenu;
