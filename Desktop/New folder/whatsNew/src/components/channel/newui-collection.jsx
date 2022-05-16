import React, { useEffect, useRef, useState } from "react";
import "./newui-channel.css";
import { List, HeaderContent, Accordion } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import {
  setActiveMenuItem,
  setActivePanelAction,
  setSelectedChannelAction,
} from "../../store/actions/config-actions";
import { MENU_ITEMS } from "../../constants/menu-items";
import Panel from "../actionpanel/panel";
import CollectionServices from "../../services/collection-services";
import {
  getCollectionData,
  setActiveCollection,
} from "../../store/actions/collection-action";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import { collectionConstants } from "../../constants/collection";
import { makeStyles, MenuItem } from "@material-ui/core";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Collection from "../../assets/icons/side-menu/collection.svg";
import CollectionMenuItem from "../collection/collection-menu-item";
import { NavLink, useHistory } from "react-router-dom";
import { Droppable } from "react-beautiful-dnd";
import {
  addSelectedCollectionClass,
  removeSelectedCollectionClass,
} from "../utils/collection";
import Typography from "@material-ui/core/Typography";
import SVG from "react-inlinesvg";
import Box from "@material-ui/core/Box";
import collectionIcon from "../../assets/icons/v2/discussions.svg";
import newCollectionIcon from "../../assets/icons/v2/ic_new_collection.svg";
import arrowIcon from "../../assets/icons/v2/ic_check_green.svg";
import cancelIcon from "../../assets/icons/v2/ic_cancel_circle_orange.svg";
import classNames from "classnames";
const useStyles = makeStyles((theme) => ({
  newCollection: {
    display: "none",
    position: "absolute",
    right: "10px",
  },
  moreBtn: {
    position: "absolute",
    right: "9px",
    display: "none",
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
    "&:hover .newCollection": {
      display: "block",
      "& path": {
        stroke: "white !important",
      },
    },
    "&:hover p.menu-text": {
      color: theme.palette.primary.contrastText,
    },
  },
  menuItem: {
    "&:hover": {
      "& p.menu-text": {
        color: "rgba(0, 0, 0, 0.9)",
      },
      "& .moreBtn": {
        display: "block",
      },
    },
    "&.active": {
      "& p.menu-text": {
        color: "#00A95B",
        fontWeight: "bold",
      },
      backgroundImage: `url(${arrowIcon})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "17px",
      backgroundColor: "rgba(3, 189, 93, 0.07)",
    },
    "& p.menu-text": {
      fontSize: 13,
      lineHeight: "20px",
      color: theme.palette.text.black70,
    },

    // padding: "5px 0 !important",
    height: 28,
  },
  menuLink: {
    position: "relative",
    "&:hover .newCollection": {
      "& path": {
        stroke: theme.palette.primary.main,
      },
    },
  },
  menuIcon: {
    stroke: theme.palette.primary.main,
  },
}));
const NewUICollection = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { location } = props;
  const inputNewCollectionRef = useRef(null);
  const [subActiveIndex, setSubActiveIndex] = useState(0);
  const [selectedChannelActive, setSelectedChannelActive] = useState("ALL");
  const collectionData = useSelector(
    (state) => state.CollectionReducer?.collectionData
  );
  const [allNotification, setAllNotification] = useState(0);
  const activeMenuItem = useSelector((state) => state.config.activeMenuItem);
  const currentChannelClick = useSelector((state) => state.channelDetails);
  const [show, setShow] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [errorCollectionName, setCollectionNameError] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const handleSubClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChannelActive(collectionData?.collections?.[0]?.id);

    if (Object.keys(currentChannelClick).length) {
      dispatch(setSelectedChannelAction(Panel.CHANNEL, currentChannelClick));
    } else {
      dispatch(setActivePanelAction(Panel.WELCOME, null));
    }
    dispatch(setActiveCollection(collectionData?.collections?.[0]));
    setSubActiveIndex(subActiveIndex === 0 ? 1 : 0);
    history.push(MENU_ITEMS.COLLECTIONS);
  };
  const getCollections = async () => {
    const result = await CollectionServices.getCollections();
    dispatch(getCollectionData(result.data));
  };
  useEffect(() => {
    try {
      let menu = MENU_ITEMS.COLLECTIONS;
      dispatch(setActiveMenuItem(menu));
      getCollections();
    } catch (e) {}
  }, []);
  useEffect(() => {
    console.log("Location", location);
  }, [location]);

  const handleChange = (e) => {
    setCollectionName(e.target.value);
    if (e.target.value === "") {
      setCollectionNameError("Collection name is required");
    } else {
      setCollectionNameError("");
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  const handleSubmit = async () => {
    const collection = {
      name: collectionName,
      description: `Create ${collectionName}`,
    };
    const result = await CollectionServices.createCollection(collection);
    console.log("create collection", result);
    if (result.data) {
      setShow(false);
      setCollectionNameError("");
      setCollectionName("");
    } else {
      console.log(result.message);
      setCollectionNameError(`${result.message}`);
    }
  };
  const handleBlur = (e) => {
    if (e.target.value === "") {
      setCollectionNameError("Collection name is required");
    } else {
      setCollectionNameError("");
    }
  };
  const handleChannelItemClick = (e, collection) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChannelActive(collection?.id);
    history.push(MENU_ITEMS.COLLECTIONS);
    if (Object.keys(currentChannelClick).length) {
      dispatch(setSelectedChannelAction(Panel.CHANNEL, currentChannelClick));
    } else {
      dispatch(setActivePanelAction(Panel.WELCOME, null));
    }
    dispatch(setActiveCollection(collection));
  };
  const handleTriggerModal = (event, menuName, collectionItem) => {
    event.preventDefault();
    event.stopPropagation();
    const modalType = ModalTypes.COLLECTION_MODAL_SHOW;
    const modalProps = {
      show: true,
      closeButton: true,
      menuName: menuName,
      collectionItem: collectionItem,
      ...props,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };
  const getListStyle = (isDraggingOver) => {
    if (isDraggingOver) {
      return {
        /*backgroundColor: "var(--primary)",*/
        borderRadius: 0,
      };
    }
  };
  const handleSumNotification = (notificationCount) => {
    setAllNotification(allNotification + notificationCount);
  };
  const handleOnShow = (collectionId) => {
    removeSelectedCollectionClass(".collection-menu-wrapper");
    addSelectedCollectionClass(".collection-menu-wrapper", collectionId);
  };
  const handleOnMouseLeave = () => {
    removeSelectedCollectionClass(".collection-menu-wrapper");
  };
  useEffect(() => {
    if (show) {
      inputNewCollectionRef.current.focus();
    }
  }, [show]);
  return (
    <>
      {props.isExtendMenu ? (
        <div className="accordion-project">
          <Accordion className="channelType">
            <Box
              className={"menu-parent-icon d-flex flex-row align-items-center"}
            >
              <Accordion.Title
                active={subActiveIndex === 0}
                index={subActiveIndex}
                onClick={handleSubClick}
              >
                <NavLink
                  className={classNames(
                    "app-menu-link colections",
                    classes.menuLink
                  )}
                  activeClassName={classNames(
                    "app-active-menu",
                    classes.activeMenu
                  )}
                  to={MENU_ITEMS.COLLECTIONS}
                >
                  <SVG
                    src={collectionIcon}
                    fill="none"
                    className={classNames("menu-icon", classes.menuIcon)}
                  />
                  <Typography color="textPrimary" className="menu-text">
                    {t("Collections")}
                  </Typography>
                  <SVG
                    src={newCollectionIcon}
                    fill="none"
                    className={classNames(
                      "newCollection",
                      classes.newCollection
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setShow(!show);
                    }}
                  />
                </NavLink>
              </Accordion.Title>
            </Box>
            <Accordion.Content
              active={subActiveIndex === 0}
              className="content-colection"
            >
              <List.Item
                className={classNames(
                  "channelListItem",
                  selectedChannelActive === "ALL" &&
                    location.pathname === MENU_ITEMS.COLLECTIONS &&
                    "active",
                  classes.menuItem
                )}
                onClick={(event) =>
                  handleChannelItemClick(
                    event,
                    collectionData?.collections?.[0]
                  )
                }
              >
                <HeaderContent className="all-title">
                  <Typography
                    sx={{ color: "text.black70" }}
                    className="menu-text"
                    onClick={(event) =>
                      handleChannelItemClick(
                        event,
                        collectionData?.collections?.[0]
                      )
                    }
                  >
                    ALL
                  </Typography>
                </HeaderContent>
              </List.Item>
              <List>
                {_.orderBy(
                  collectionData?.collections?.filter(
                    (item) => item.id !== "ALL"
                  ),
                  [(item) => item?.name.toLowerCase()],
                  ["asc"]
                ).map((listItem, listIndex) => (
                  <Droppable
                    droppableId={`Collection_DroppableId_${listItem.id}`}
                    key={listIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        className="collection-droppable-wrapper"
                      >
                        <ContextMenuTrigger id={listItem.id}>
                          <CollectionMenuItem
                            listChannels={collectionData?.channels}
                            listItem={listItem}
                            location={location}
                            selectedChannelActive={selectedChannelActive}
                            activeMenuItem={activeMenuItem}
                            listIndex={listIndex}
                            classes={classes}
                            handleChannelItemClick={(event, listItem) =>
                              handleChannelItemClick(event, listItem)
                            }
                            handleSumNotification={handleSumNotification}
                          />
                        </ContextMenuTrigger>
                        <ContextMenu
                          id={listItem.id}
                          className="trigger-menu"
                          hideOnLeave
                          onShow={() => handleOnShow(listItem.id)}
                          onMouseLeave={handleOnMouseLeave}
                        >
                          {collectionConstants.MENU_COLLECTION_FUNCTION.map(
                            (menu) => {
                              return (
                                <MenuItem
                                  className="trigger-menu-item"
                                  key={menu.id}
                                  onClick={(e) =>
                                    handleTriggerModal(e, menu.name, listItem)
                                  }
                                >
                                  {menu.name}
                                </MenuItem>
                              );
                            }
                          )}
                        </ContextMenu>
                      </div>
                    )}
                  </Droppable>
                ))}
              </List>
              {show ? (
                <div className="add-colection-form">
                  <div className="input-item">
                    <input
                      placeholder={"New collection"}
                      className="form-control"
                      value={collectionName}
                      onBlur={handleBlur}
                      ref={inputNewCollectionRef}
                      onChange={handleChange}
                      onKeyDown={(e) => handleKeyDown(e)}
                    />
                    <SVG
                      src={cancelIcon}
                      alt="cancel"
                      onClick={() => {
                        setShow(false);
                        setCollectionName("");
                      }}
                      className="ic-cancel"
                    />
                  </div>

                  {errorCollectionName ? (
                    <p className="err-colection">{errorCollectionName}</p>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </Accordion.Content>
          </Accordion>
        </div>
      ) : (
        <div
          style={{
            padding: 8,
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => props.handleToggleMenu()}
        >
          <OverlayTrigger
            placement="right"
            delay={{ show: 150, hide: 100 }}
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip id={t("collections:home")}>
                {t("collections:home")}
              </Tooltip>
            }
          >
            <img src={Collection} alt="collection" />
          </OverlayTrigger>
          {/*{allNotification > 0 && <div className="menu-item-label ">New</div>}*/}
        </div>
      )}
    </>
  );
};
export default NewUICollection;
