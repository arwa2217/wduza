import React, { useState, useEffect, Fragment } from "react";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import "./channel-details.css";
import { Box, makeStyles } from "@material-ui/core";
import { updateSummaryActiveIndex } from "../../store/actions/config-actions";
import { useTranslation } from "react-i18next";
import { Tab, Tabs } from "@material-ui/core";
import SVG from "react-inlinesvg";
import styled from "styled-components";
import NotificationIcon from "../../assets/icons/v2/noti_inactive.svg";
import NotificationIconActive from "../../assets/icons/v2/noti_active.svg";
import FileIcon from "../../assets/icons/v2/files_inactive.svg";
import FileIconActive from "../../assets/icons/v2/files_active.svg";
import SaveIcon from "../../assets/icons/v2/saves_inactive.svg";
import SaveIconActive from "../../assets/icons/v2/saves_active.svg";
import TaskIcon from "../../assets/icons/v2/tasks_inactive.svg";
import TaskIconActive from "../../assets/icons/v2/tasks_active.svg";
import TagIcon from "../../assets/icons/v2/tags_inactive.svg";
import TagIconActive from "../../assets/icons/v2/tags_active.svg";
import PropTypes from "prop-types";
import SelectedItem from "./selected-item";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div style={{ marginTop: "-1px" }}>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const detailItems = (t) => {
  return [
    {
      name: t("channel.details:notifications"),
      key: "Notifications",
      notification: 0,
      class: " ",
    },
    {
      name: t("channel.details:files"),
      key: "Files",
      content: [],
      notification: 0,
      class: " ",
    },
    {
      name: t("channel.details:mySaves"),
      key: "Saves",
      notification: 3,
      class: "",
    },
    {
      name: t("channel.details:tasks"),
      key: "Tasks",
      content: [],
      notification: 0,
      class: " ",
    },
    {
      name: t("channel.details:tags"),
      key: "Tags",
      content: [],
      notification: 5,
      class: " ",
    },
  ];
};
const useStyles = makeStyles((theme) => ({
  summaryTabs: {
    minWidth: "320px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // borderBottom: `1px solid ${theme.palette.color.divider}`,
    "& .MuiTab-root": {
      minWidth: "calc((100% - 30px) / 5)",
      fontSize: "10px",
      fontWeight: "normal",
      padding: "0 15px",
      lineHeight: "100%",
      color: theme.palette.text.focused,
      "&:hover": {
        "& .icon-not-active": {
          color: "black",
          "& path": {
            stroke: "black",
          },
        },
        "& .task": {
          "& rect": {
            stroke: "black",
          },
        },
      },
    },
    "& .MuiTab-root:first-child": {
      flex: 1,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.primary.main,
      width: "calc(100% / 5 + 24px)!important",
    },
  },
  summaryTabPanel: {
    "& .MuiBox-root": {
      padding: 0,
    },
  },
}));

function ChannelDetailsItems(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  let propCopy = { ...props };
  delete propCopy.name;
  detailItems(t)[0] = Object.assign(detailItems(t)[0], propCopy);
  const memberCount = useSelector((state) => state.channelDetails.memberCount);
  detailItems(t)[1].notification = memberCount;
  let searchEventUpdate = useSelector(
    (state) => state.ChannelReducer.searchEventUpdate
  );
  let channelId = useSelector(
    (state) => state.config?.activeSelectedChannel?.id
  );
  let summaryPanelActiveIndex = useSelector(
    (state) => state.config?.summaryPanelActiveIndex
  );
  const [selected, setSelected] = useState(summaryPanelActiveIndex);
  const dispatch = useDispatch();

  useEffect(() => {}, [memberCount]);

  useEffect(() => {
    if (searchEventUpdate) {
      setSelected(6); //'Search'
    }
  }, [searchEventUpdate]);

  useEffect(() => {
    setSelected(summaryPanelActiveIndex);
  }, [channelId]);

  function handleClick(e) {
    let requestedIndex = detailItems(t).findIndex((item) => item.key === e);

    let prevState = selected;
    if (prevState === requestedIndex) requestedIndex = -1;
    setSelected(requestedIndex);
    dispatch(updateSummaryActiveIndex(requestedIndex));
  }
  const [selectedItem, setSelectedItem] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedItem(newValue);
  };
  const renderIcon = (key, active) => {
    switch (key) {
      case "Notifications":
        return !active ? (
          <SVG
            className={"icon-not-active"}
            src={NotificationIcon}
            alt="notification-icon"
          />
        ) : (
          <SVG src={NotificationIconActive} alt="notification-icon-active" />
        );
      case "Files":
        return !active ? (
          <SVG className={"icon-not-active"} src={FileIcon} alt="Files-icon" />
        ) : (
          <SVG src={FileIconActive} alt="Files-icon-active" />
        );
      case "Saves":
        return !active ? (
          <SVG className={"icon-not-active"} src={SaveIcon} alt="Saves-icon" />
        ) : (
          <SVG src={SaveIconActive} alt="Saves-icon-active" />
        );
      case "Tasks":
        return !active ? (
          <SVG
            className={"icon-not-active task"}
            src={TaskIcon}
            alt="Tasks-icon"
          />
        ) : (
          <SVG src={TaskIconActive} alt="Tasks-icon-active" />
        );
      case "Tags":
        return !active ? (
          <SVG className={"icon-not-active"} src={TagIcon} alt="Tags-icon" />
        ) : (
          <SVG src={TagIconActive} alt="Tags-icon-active" />
        );
      default:
        return !active ? (
          <SVG
            className={"icon-not-active"}
            src={NotificationIcon}
            alt="notification-icon"
          />
        ) : (
          <SVG src={NotificationIconActive} alt="notification-icon-active" />
        );
    }
  };
  return (
    // <TabMenuWrapper>
    <Col
      xs={12}
      className="channel-details-body channel-details-content-scroll p-0"
    >
      <Tabs
        className={classes.summaryTabs}
        value={selectedItem}
        onChange={handleChange}
      >
        {detailItems(t).map((item, index) => {
          return (
            <Tab
              style={{ color: index !== selectedItem ? "#00000066" : "" }}
              icon={renderIcon(item.key, index === selectedItem)}
              key={index}
              label={
                <span
                  className={index !== selectedItem ? "icon-not-active" : ""}
                >
                  {item.key}
                </span>
              }
              {...a11yProps(index)}
            />
          );
        })}
      </Tabs>
      {detailItems(t).map((item, index) => {
        return (
          <TabPanel
            key={index}
            value={index}
            index={selectedItem}
            className={classes.summaryTabPanel}
            key={index}
          >
            {selectedItem === index && (
              <SelectedItem item={item} channel={props.channel} />
            )}
          </TabPanel>
        );
      })}
    </Col>
    // </TabMenuWrapper>
  );
}

export default ChannelDetailsItems;
