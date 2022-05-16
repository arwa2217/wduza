import React, { useState, useEffect, useRef } from "react";
import NotificationCenterItem from "./notification-center-item";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { fetchNotificationAction } from "../../store/actions/notification-action";
import { useDispatch, useSelector } from "react-redux";
import { TextLink } from "../shared/styles/mainframe.style";
import CommonUtils from "../utils/common-utils";
import { updateNotificationState } from "../../store/actions/notification-action";
import NotificationMessage from "./no-notifications-message";
import { useTranslation } from "react-i18next";
import { NOTIFICATION_COUNT } from "../../constants";
import NotificationFilters from "./notification-filters";

const postsPerPage = NOTIFICATION_COUNT;
let disabled = true;

function Notifications(props) {
  const { t } = useTranslation();
  const [notifCount, setNotifCount] = useState(0);
  const dispatch = useDispatch();
  const [postsToShow, setPostsToShow] = useState([]);
  const [next, setNext] = useState(NOTIFICATION_COUNT + 1);
  const [isUnread, setIsUnread] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
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
  const ref = useRef();

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        props.setShowBg(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  useEffect(() => {
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
  const markAllRead = () => {
    dispatch(updateNotificationState("all", "READ", selectedFilter));
    setTimeout(() => {
      dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT, selectedFilter));
    }, 1000);
  };

  const loopWithSlice = (start, end) => {
    const slicedPosts = notificationList
      ? selectedFilter === "All"
        ? notificationList.slice(start, end)
        : notificationList
            .filter((notif) => notif.type === selectedFilter)
            .slice(start, end)
      : "";
    let notificationMsgs = [...new Set(slicedPosts.map((item) => item))];
    setPostsToShow(notificationMsgs);
  };

  useEffect(() => {
    loopWithSlice(0, next - 1);
    hasUnread();
    CommonUtils.setPageTitle(notifCount, companyName);
  }, [notificationList, notifCount]);

  const handleShowMorePosts = () => {
    //loopWithSlice(next, next + postsPerPage);
    setNext(next + postsPerPage);
    dispatch(fetchNotificationAction(0, next + postsPerPage, selectedFilter));
  };
  useEffect(() => {
    setNext(NOTIFICATION_COUNT + 1);
    dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT, selectedFilter));
  }, [selectedFilter]);
  const linkDisable = {
    className: !unreadCount ? "text-link-disabled" : "",
    // className:
    //   unreadCount - (notificationList.length - postsToShow.length) <= 0
    //     ? "text-link-disabled"
    //     : "",
  };
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    const dispatch = useDispatch();

    return (
      <a
        className="notification-icon"
        ref={ref}
        onMouseEnter={() => {
          props.showToolTip(true);
        }}
        onMouseLeave={() => props.showToolTip(false)}
        onClick={(e) => {
          props.showToolTip(false);
          props.setShowBg(!props.showBg);
          e.preventDefault();
          onClick(e);
          // this.notificationShow();
          dispatch(fetchNotificationAction(0, 7, selectedFilter));
        }}
        href
      >
        {children}
      </a>
    );
  });
  const onFilterSelect = (selectedValue) => {
    if (selectedFilter === selectedValue) {
      setSelectedFilter("All");
    } else {
      setSelectedFilter(selectedValue);
    }
  };
  return (
    <>
      <Dropdown ref={ref}>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-button-setting">
          {/* <img src={notificationWhite} /> */}
          {unreadCount > 0 && postsToShow.length > 0 && (
            <Badge variant="primary">
              <span className="sr-only">
                {t("discussion.summary:unread.messages")}
              </span>
            </Badge>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu bg-white">
          <div className="user-notifications">
            <div className="notification-header" style={{ height: "55px" }}>
              <h6
                className="notifications-header-notifications"
                style={{ width: "86px", height: "15px", lineHeight: "normal" }}
              >
                {t("setting.modal:notifications:header")}
              </h6>
              {/* <TextLink
                to={"#"}
                onClick={() => {
                  return unreadCount <= 0 ? undefined : markAllRead();
                }}
                className={linkDisable.className}
                primary={`true`}
                underline={`true`}
                tiny={`true`}
                strong={`true`}
                style={{}}
              >
                {t("setting.modal:notifications:mark.all.as.read")}
              </TextLink> */}
              <NotificationFilters
                markAllRead={() => {
                  return unreadCount <= 0 ? undefined : markAllRead();
                }}
                linkDisable={linkDisable.className}
                selectedFilter={selectedFilter}
                handleClick={onFilterSelect}
                global={true}
              />
            </div>
            <div
              className={`notification-body ${
                postsToShow.length === 0 ? "d-flex align-items-center" : ""
              }`}
            >
              {!!postsToShow && postsToShow.length > 0 ? (
                <NotificationCenterItem
                  postsToRender={postsToShow}
                  hasUnread={hasUnread}
                />
              ) : (
                <NotificationMessage />
              )}
            </div>
            {postsToShow.length > 0 && (
              <div
                className={
                  "notification-footer " + (disabled ? "disabled" : "")
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
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default Notifications;
