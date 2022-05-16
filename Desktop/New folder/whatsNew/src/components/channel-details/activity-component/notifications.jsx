import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Col from "react-bootstrap/Col";
import { TextLink } from "../../shared/styles/mainframe.style";
import DiscussionNotificationItem from "./discussion-notification-item";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDiscussionNotificationAction,
  updateDiscussionNotificationState,
  cleanDiscussionNotificationState,
} from "../../../store/actions/notification-action";
import features from "features";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import SelectIconDown from "../../../assets/icons/v2/ic_arrow_down.svg";
import SelectIconUp from "../../../assets/icons/v2/ic_arrow_up.svg";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import notificationAll from "../../usersettingpanel/notificationAll";
const postsPerPage = 5;
let disabled = true;
let currentChannel = null;
let initCall = false;
const ScrollBar = styled.div`
  .message-list-container {
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
  }
`;
const useStyles = makeStyles((theme) => ({
  customOption: {},
  list: {
    paddingTop: 0,
    "& .Mui-selected": {
      backgroundColor: theme.palette.background.default,
      color: "rgba(0, 0, 0, 0.7) !important",
      fontSize: "11px",
    },
    "& .MuiMenuItem-root": {
      padding: "5px 8px",
      color: "rgba(0, 0, 0, 0.4)",
      fontSize: "11px",
    },
  },
  paper: {
    borderRadius: "unset",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    borderTop: "none",
  },
  markAsRead: {
    fontSize: "11px",
    color: "rgba(0, 0, 0, 0.4)",
    cursor: "pointer",
  },
  filterText: {
    color: theme.palette.text.black50,
    fontSize: "12px",
    lineHeight: "134%",
    cursor: "pointer",
    "&:first-child": {
      paddingRight: "10px",
    },
  },
  activeFilterText: {
    color: theme.palette.color.accent,
    fontWeight: "bold",
    fontSize: "12px",
    cursor: "pointer",
    lineHeight: "134%",
    "&:first-child": {
      paddingRight: "10px",
    },
  },
}));
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    height: "24px",
    cursor: "pointer",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
    color: state.isSelected ? "#000000B2" : "#00000066",
    "&:focus": {
      backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
    },
    "&:hover": {
      backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
      color: "#000000B2",
    },
  }),
  menu: (provided) => ({
    ...provided,
    padding: 0,
  }),
  menuList: (provided) => ({
    ...provided,
    position: "absolute",
    top: "-10px",
    width: "104px",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    border: "1px solid #CCCCCC",
    padding: 0,
  }),
  control: (provided) => ({
    ...provided,
    border: "1px solid #CCCCCC",
    borderRadius: "4px",
    width: "104px",
    minHeight: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    "&:focus": {
      boxShadow: "unset",
    },
    "&:hover": {
      boxShadow: "unset",
    },
    boxShadow: "unset",
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    border: "1px solid #DEDEDE",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    textIndent: "10px",
    color: "#00A95B",
    fontWeight: "bold",
    fontSize: "11px",
    height: "15px",
  }),
  indicatorContainer: (provided) => ({
    ...provided,
    position: "relative",
  }),
};
function Notifications(props) {
  const { handleClose, showNotifications } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filterOptions, setFilterOptions] = useState([
    { id: 1, value: "mention", label: "Mentioned", status: false },
    { id: 2, value: "replied", label: "Reply", status: false },
  ]);
  const setHeight = () => {
    return `calc(100vh - var(--discussion-list-top-bar-height) - 110px)`;
  };
  const [selectedFilter, setSelectedFilter] = useState("All");
  const IconSelect = (isOpen) => {
    return !isOpen ? (
      <img
        className="icon-select"
        style={{ position: "absolute", right: "2px", top: "2px" }}
        src={SelectIconDown}
        alt="select-icon"
      />
    ) : (
      <img
        className="icon-select"
        style={{ position: "absolute", right: "2px", top: "2px" }}
        src={SelectIconUp}
        alt="select-icon"
      />
    );
  };
  const DropdownIndicator = (props) => {
    const { menuIsOpen } = props.selectProps;
    return (
      <components.DropdownIndicator {...props}>
        {IconSelect(menuIsOpen)}
      </components.DropdownIndicator>
    );
  };

  const CustomOption = (props) => {
    const { data } = props;
    return (
      <div>
        <components.Option {...props}>
          <div className={classes.customOption}>{data.label}</div>
        </components.Option>
      </div>
    );
  };
  const customComponent = {
    Option: CustomOption,
    DropdownIndicator: DropdownIndicator,
    ClearIndicator: null,
    IndicatorSeparator: () => null,
  };
  const [postsToShow, setPostsToShow] = useState([]);
  const classes = useStyles();
  const { activeSelectedChannel } = useSelector((state) => state.config);
  const {
    discussionNotificationList,
    discussionNotificationTotal,
    discussionRequestOffset,
  } = useSelector((state) => state.notificationReducer);
  // if (discussionNotificationTotal && discussionNotificationTotal > 5) {
  //   disabled = false;
  // }`
  useLayoutEffect(() => {
    if (activeSelectedChannel.id !== currentChannel) {
      dispatch(cleanDiscussionNotificationState());
      currentChannel = activeSelectedChannel.id;
      initCall = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSelectedChannel]);

  useLayoutEffect(() => {
    if (!initCall && activeSelectedChannel.id === currentChannel) {
      initCall = true;
      dispatch(
        fetchDiscussionNotificationAction(
          activeSelectedChannel,
          0,
          20,
          selectedFilter
        )
      );
    }
    let newPostsToShow = [];
    switch (selectedFilter) {
      case "All":
        newPostsToShow = discussionNotificationList?.length > 0 ? discussionNotificationList : []
        break;
      case "mention":
        newPostsToShow = discussionNotificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter || notification?.subType === "mentionreplied";
        });
        break;
      case "replied":
        newPostsToShow = discussionNotificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter || notification?.subType === "mentionreplied";
        });
        break;
      case "mentionreplied":
        newPostsToShow = discussionNotificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter;
        });
        break;
      default:
        newPostsToShow = discussionNotificationList?.length > 0 ? discussionNotificationList : []
        break;
    }
    setPostsToShow(newPostsToShow);
    disabled = !(
      discussionNotificationTotal &&
      discussionNotificationTotal > discussionRequestOffset
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionNotificationList, selectedFilter]);
  const markAllRead = (event) => {
    event.stopPropagation();
    dispatch(
      updateDiscussionNotificationState(
        "channel",
        "READ",
        activeSelectedChannel,
        selectedFilter
      )
    );
    setTimeout(() => {
      // dispatch(cleanDiscussionNotificationState());
      dispatch(
        fetchDiscussionNotificationAction(
          activeSelectedChannel,
          0,
          9,
          selectedFilter
        )
      );
    }, 1000);
  };

  const closePopup = (event) => {
    markAllRead(event);
    handleClose();
  };

  const handleShowMorePosts = () => {
    dispatch(
      fetchDiscussionNotificationAction(
        activeSelectedChannel,
        discussionRequestOffset,
        postsPerPage,
        selectedFilter
      )
    );
  };
  const handleInputChange = (data) => {
    setSelectedFilter(data);
  };
  const handleFilter = (id) => {
    const filters = [...filterOptions].map((item) => {
      return item.id === id ? { ...item, status: !item.status } : item;
    });
    setFilterOptions(filters);
  };
  useEffect(() => {
    if (filterOptions[0].status === true && filterOptions[1].status === true) {
      setSelectedFilter("mentionreplied");
    } else if (
      filterOptions[0].status === false &&
      filterOptions[1].status === false
    ) {
      setSelectedFilter("All");
    } else {
      setSelectedFilter(
        filterOptions.find((item) => item.status === true).value
      );
    }
  }, [filterOptions]);
  return (
    <Col className="m-0 p-0">
      {!features.disable_discussion_notification && (
        <div
          className="discussion-user-notifications"
          onClick={(event) => event.stopPropagation()}
        >
          <hr />
        </div>
      )}
      <div
        className="user-notifications"
        onClick={(event) => event.stopPropagation()}
      >
        <Col
          className="float-right m-0"
          style={{
            padding: "8px 16px",
            height: "40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {filterOptions.map((item, index) => (
              <span
                onClick={() => handleFilter(item.id)}
                className={
                  item.status ? classes.activeFilterText : classes.filterText
                }
                key={index}
              >
                {item.label}
              </span>
            ))}
          </div>
          <span
            className={classes.markAsRead}
            onClick={(event) => markAllRead(event)}
          >
            Mark all as read{" "}
          </span>
        </Col>
        <div className="m-0 p-0">
          <div
            className={` ${
              postsToShow?.length === 0
                ? "discussion-notification-body-no-height d-flex align-items-center"
                : "discussion-notification-body"
            }`}
          >
            <ScrollBar id="scrollableDiv" style={{ width: "100%" }}>
              <InfiniteScroll
                id="message-list-container"
                dataLength={postsToShow?.length}
                next={() => handleShowMorePosts()}
                hasMore={true}
                height={setHeight()}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  overflow: "hidden overlay",
                }}
                loader={null}
                className="message-list-container"
              >
                <DiscussionNotificationItem postsToRender={postsToShow} />
              </InfiniteScroll>
            </ScrollBar>
          </div>
        </div>
        {/*{postsToShow?.length > 0 && (
          <div
            className={
              "discussion-notification-footer " + (disabled ? "disabled" : "")
            }
          >
            <TextLink
              to={"#"}
              default={true}
              underline={`true`}
              small-={`true`}
              strong={`true`}
              onClick={(event) => {
                return disabled ? undefined : handleShowMorePosts(event);
              }}
              className={`${
                postsToShow?.length > 0 &&
                postsToShow?.length >= discussionNotificationTotal
                  ? "disabled"
                  : ""
              }`}
              disabled={
                postsToShow?.length > 0 &&
                postsToShow?.length >= discussionNotificationTotal
              }
            >
              {t("more")}
            </TextLink>
          </div>
        )}*/}
      </div>
    </Col>
  );
}

export default Notifications;
