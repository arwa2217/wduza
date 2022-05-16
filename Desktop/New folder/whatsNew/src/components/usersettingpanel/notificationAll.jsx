import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import classNames from "classnames";
import {
  fetchNotificationAction,
  updateNotificationState,
} from "../../store/actions/notification-action";
import features from "features";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core";
import SelectIconDown from "../../assets/icons/v2/ic_arrow_down.svg";
import SelectIconUp from "../../assets/icons/v2/ic_arrow_up.svg";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import { NOTIFICATION_COUNT } from "../../constants";
import CommonUtils from "../utils/common-utils";
import InfiniteScroll from "react-infinite-scroll-component";
import DiscussionNotificationItem from "../channel-details/activity-component/discussion-notification-item";

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

const MarkAllAsRead = styled.span`
  .notification-read {
    opacity: 0.5;
  }
`;

const postsPerPage = 5;
let disabled = true;
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
    color: "rgba(0, 0, 0, 0.5)",
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
    height: "32px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
    color: state.isSelected ? "rgba(0, 0, 0, 0.9);" : "rgba(0, 0, 0, 0.4);",
    fontSize: "14px",
    fontWeight: "normal",
    padding: "7px",
    "&:focus": {
      backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
    },
    "&:hover": {
      backgroundColor: state.isSelected ? "#F0FBF5" : "#ffffff",
      color: "rgba(0, 0, 0, 0.9);",
    },
  }),
  menu: (provided) => ({
    ...provided,
    padding: 0,
    fontSize: "14px",
    fontWeight: "normal",
    width: "120px",
  }),
  menuList: (provided) => ({
    ...provided,
    position: "absolute",
    top: "-10px",
    width: "100%",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    border: "1px solid #CCCCCC",
    padding: 0,
  }),
  control: (provided) => ({
    ...provided,
    border: "1px solid #CCCCCC",
    borderRadius: "4px",
    width: "120px",
    minHeight: "32px",
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
    fontWeight: "normal",
    fontSize: "14px",
    height: "19px",
    marginLeft: "2px",
  }),
  indicatorContainer: (provided) => ({
    ...provided,
    position: "relative",
  }),
};
function NotificationAll(props) {
  const { handleClose, showNotifications } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filterOptions, setFilterOptions] = useState([
    { id: 1, value: "mention", label: "Mentioned", status: false },
    { id: 2, value: "replied", label: "Reply", status: false },
  ]);
  const notificationRef = useRef(null);
  const IconSelect = (isOpen) => {
    return !isOpen ? (
      <img
        className="icon-select"
        style={{ position: "absolute", right: "6px", top: "6px" }}
        src={SelectIconDown}
        alt="select-icon"
      />
    ) : (
      <img
        className="icon-select"
        style={{ position: "absolute", right: "6px", top: "6px" }}
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
  const [notifCount, setNotifCount] = useState(0);

  const [postsToShow, setPostsToShow] = useState([]);
  const [heightInfinite, setHeightInfinite] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const classes = useStyles();
  const [isUnread, setIsUnread] = useState(false);
  const [next, setNext] = useState(NOTIFICATION_COUNT + 1);
  const companyName = useSelector(
    (state) => state.AuthReducer.user.companyName
  );
  const notificationList = useSelector(
    (state) => state.notificationReducer.notificationDetails
  );
  const notificationTotal = useSelector(
    (state) => state.notificationReducer.notificationTotal
  );
  const { getNotifications } = useSelector(
    (state) => state.notificationReducer
  );
  const notificationReducer = useSelector((state) => state.notificationReducer);
  useEffect(() => {
    console.log("getNotifications :::", getNotifications);
    console.log("notificationList :::", notificationList);
  }, []);

  useLayoutEffect(() => {
    if (getNotifications) {
      dispatch(fetchNotificationAction(0, next, selectedFilter));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getNotifications]);
  let unreadCount = useSelector(
    (state) => state.notificationReducer.unread_count
  );
  const totalNotification = unreadCount;
  if (notificationTotal > next - 1) {
    disabled = false;
  } else {
    disabled = true;
  }
  const hasUnread = () => {
    let count = 0;
    if (notificationList && notificationList.length > 0) {
      setIsUnread(false);
      notificationList.map((notification) => {
        if (notification.state === "UNREAD") {
          count++;
        }
        return notification;
      });
    }
    if (notificationList.length > next - 1) {
      disabled = false;
    }
    setNotifCount(totalNotification);
    if (count > 0) {
      setIsUnread(true);
    }
  };
  useLayoutEffect(() => {
    const checkIfClickedOutside = (e) => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (
        showNotifications &&
        notificationRef?.current &&
        !notificationRef?.current?.contains(e.target)
      ) {
        closePopup(e);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showNotifications]);

  const closePopup = (event) => {
    markAllRead(event, "CHECKED");
    handleClose();
  };

  const markAllRead = (event, state) => {
    dispatch(updateNotificationState("all", state, selectedFilter));
    setTimeout(() => {
      dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT, selectedFilter));
    }, 1000);
  };
  const filterNotificationList  = (notificationList) => {
    let newPostsToShow = [];
    switch (selectedFilter) {
      case "All":
        newPostsToShow = notificationList?.length > 0 ? notificationList : []
        break;
      case "mention":
        newPostsToShow = notificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter || notification?.subType === "mentionreplied";
        });
        break;
      case "replied":
        newPostsToShow = notificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter || notification?.subType === "mentionreplied";
        });
        break;
      case "mentionreplied":
        newPostsToShow = notificationList.filter(notification => {
          return notification.type === selectedFilter || notification?.subType === selectedFilter;
        });
        break;
      default:
        newPostsToShow = notificationList?.length > 0 ? notificationList : []
        break;
    }
    return newPostsToShow;
  }
  const loopWithSlice = (start, end) => {
    const slicedPosts = notificationList ? filterNotificationList(notificationList).slice(start, end) : [];
    let notificationMsgs = [...new Set(slicedPosts.map((item) => item))];
    setPostsToShow(notificationMsgs);
    setHeightInfinite(notificationMsgs.length > 8 ? 612 : "auto");
  };
  useLayoutEffect(() => {
    loopWithSlice(0, next - 1);
    hasUnread();
    CommonUtils.setPageTitle(notifCount, companyName);
  }, [notificationList, notifCount, selectedFilter]);
  const handleShowMorePosts = () => {
    //loopWithSlice(next, next + postsPerPage);
    setNext(next + postsPerPage);
    dispatch(fetchNotificationAction(0, next + postsPerPage, selectedFilter));
  };

  const handleInputChange = (data) => {
    setNext(NOTIFICATION_COUNT + 1);
    dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT, data.value));
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
        ref={notificationRef}
      >
        <Col
          className="float-right m-0"
          style={{
            padding: "8px 16px",
            height: "48px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/*<CreatableSelect*/}
          {/*  options={filterOptions}*/}
          {/*  styles={customStyles}*/}
          {/*  components={customComponent}*/}
          {/*  value={selectedFilter}*/}
          {/*  onChange={(value) => handleInputChange(value)}*/}
          {/*  isSearchable={false}*/}
          {/*/>*/}
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
          <MarkAllAsRead>
            <span
              className={classNames(
                classes.markAsRead,
                isUnread ? "" : "notification-read"
              )}
              onClick={(event) => markAllRead(event, "READ")}
            >
              Mark all as read{" "}
            </span>
          </MarkAllAsRead>
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
                height={heightInfinite}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  flexWrap: "wrap",
                  alignContent: "flex-start",
                  overflow: "overlay",
                }}
                loader={null}
                className="message-list-container"
              >
                <DiscussionNotificationItem
                  postsToRender={postsToShow}
                  fromPanel={true}
                />
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
              small={`true`}
              // strong={`true`}
              onClick={() => {
                return disabled ? undefined : handleShowMorePosts();
              }}
              style={{
                color: "#18B263",
                lineHeight: "100%",
                cursor: "pointer",
              }}
            >
              {t("discussion.notification:more")}
            </TextLink>
          </div>
        )}*/}
      </div>
    </Col>
  );
}

export default NotificationAll;
