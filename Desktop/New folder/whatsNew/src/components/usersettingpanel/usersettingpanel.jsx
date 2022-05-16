import React, {useState, useEffect, useRef} from "react";
import "./usersettingpanel.css";
import UserProfileModal from "../userprofile/userProfileModal";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import SignoutModal from "../signout/signout-modal";
import SignoutError from "../signout/signout-error-modal";
import UserActions from "../../store/actions/user-actions";
import Logout from "../../assets/icons/logout.svg";
import SettingsBlack from "../../assets/icons/settings_black.svg";
import { useTranslation } from "react-i18next";
import { ResetUpdateProfile } from "../../store/actions/user-actions";
import DefaultUser from "../../assets/icons/default-user.svg";
import ToggleSwitch from "../utils/toggle/toggle-switch";
import UserType from "../../constants/user/user-type";
import {
  isNotificationEnabled,
  isNewPost,
  isMentionAndReaction,
  setNotificationFilter,
  isTask,
  isReply,
  isTag,
} from "../../utilities/notification-utils";
import { UpdateProfile } from "../../store/actions/user-actions";
import notificationIconNew from "../../assets/icons/v2/ic_noti_new_l.svg";
import notificationIcon from "../../assets/icons/v2/ic_noti.svg";
import SVG from "react-inlinesvg";
import Box from "@material-ui/core/Box";
import { makeStyles, Typography } from "@material-ui/core";
import NotificationPortal from "./notificationPortal";
import NotificationAll from "./notificationAll";
const useStyles = makeStyles((theme) => ({
  notificationWrapper: {
    position: "relative",
  },
}));
function UserMenu(props) {
  const { t } = useTranslation();
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [user, setUser] = useState({ ...currentUser });
  const signoutFailed = useSelector((state) => state.AuthReducer.signoutFailed);
  const [showSignout, setShowSignout] = useState(false);
  const channelDetail = useSelector((state) => state.channelDetails);
  const classes = useStyles();
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const handleClosePopup = () => {
    setShowNotifications(false);
  };
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(
    isNotificationEnabled(user.notificationFilter)
  );

  const [allPostsFlag, setAllPostsFlag] = useState(
    isNewPost(currentUser.notificationFilter)
  );
  const [mentionReactionFlag, setMentionReactionFlag] = useState(
    isMentionAndReaction(currentUser.notificationFilter)
  );
  const [taskFlag, setTaskFlag] = useState(
    isTask(currentUser.notificationFilter)
  );
  const [tagFlag, setTagFlag] = useState(isTag(currentUser.notificationFilter));
  const [replyFlag, setReplyFlag] = useState(
    isReply(currentUser.notificationFilter)
  );
  const [unreadCountState, setUnreadCountState] = useState(0);

  const [debouncedNotificationFilter, setDebouncedNotificationFilter] = useState(null);
  let unreadCount = useSelector(
    (state) => state.notificationReducer.unread_count
  );
  useEffect(() => {
    if (unreadCount === 0) {
      setTimeout(() => {
        setUnreadCountState(unreadCount);
      }, 1000);
    } else {
      setUnreadCountState(unreadCount);
    }
  }, [unreadCount]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedNotificationFilter(
        setNotificationFilter(
          pushNotifications,
          allPostsFlag,
          mentionReactionFlag,
          taskFlag,
          tagFlag,
          replyFlag
        )
      );
    }, 200);

    return () => {
      clearTimeout(timerId);
    };
  }, [
    pushNotifications,
    allPostsFlag,
    mentionReactionFlag,
    taskFlag,
    tagFlag,
    replyFlag,
  ]);
  useEffect(() => {
    setShowNotifications(false);
  }, [channelDetail]);
  useEffect(() => {
    if (
      debouncedNotificationFilter !== null &&
      (pushNotifications !== null || pushNotifications !== undefined) &&
      pushNotifications !== debouncedNotificationFilter
    ) {
      if (user.notificationFilter !== debouncedNotificationFilter) {
        let currentUser = {
          ...user,
          notificationFilter: debouncedNotificationFilter,
        };

        dispatch(UpdateProfile(currentUser));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNotificationFilter]);

  const ToggleUserProfileModal = () => {
    dispatch(ResetUpdateProfile());
    setShowUserProfileModal(!showUserProfileModal);
  };

  useEffect(() => {
    if (signoutFailed) {
      setShowSignout(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentUser !== null && user !== null && user !== currentUser) {
      setUser({
        ...currentUser,
      });
      setPushNotifications(
        isNotificationEnabled(currentUser.notificationFilter)
      );
      setAllPostsFlag(isNewPost(currentUser.notificationFilter));
      setMentionReactionFlag(
        isMentionAndReaction(currentUser.notificationFilter)
      );
      setTaskFlag(isTask(currentUser.notificationFilter));
      setTagFlag(isTag(currentUser.notificationFilter));
      setReplyFlag(isReply(currentUser.notificationFilter));
    }
  }, [currentUser]);
  function onSignoutClick() {
    // closePopup();
    setShowSignout(true);
  }

  function handleSignout() {
    dispatch(UserActions.signout());
  }
  function handleSignoutCancel() {
    setShowSignout(false);
  }
  const notificationRef = useRef(null);
  function hideSignoutError() {
    dispatch(UserActions.cleanSignoutFail());
    setShowSignout(false);
  }

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href
      className="d-flex"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  ));
  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      <Dropdown className="setting-menu-dropdown">
        <Dropdown.Toggle
          // menuAlign="right"
          as={CustomToggle}
          id="dropdown-button-setting"
        >
          <span className="profile-image" id="profile-image">
            <img
              alt=""
              src={user.userImg ? user.userImg : DefaultUser}
              className="image"
            />
          </span>
          <Box className="d-flex justify-content-between user-wrapper align-items-center">
            <Box className={"user-name-wrapper"}>
              <Typography color="textPrimary" className="user-name" style={{ lineHeight : '134%'}}>
                {user.screenName}
              </Typography>
              <Typography color="textSecondary" className="user-organisation">
                {user.companyName}
              </Typography>
            </Box>
            <Box
              className={classes.notificationWrapper}
              onClick={(event) => handleClick(event)}
              ref={notificationRef}
            >
              <SVG
                src={unreadCount > 0 ? notificationIconNew : notificationIcon}
              />
              {showNotifications && (
                <NotificationPortal>
                  <NotificationAll
                    showNotifications={showNotifications}
                    handleClose={handleClosePopup}
                  />
                </NotificationPortal>
              )}
            </Box>
          </Box>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu bg-white">
          <Dropdown.Header
            eventKey="1"
            className="d-flex align-items-center justify-content-between"
            as="label"
          >
            {t("user.profile:disable_notification")}
            <ToggleSwitch
              small
              id="notification"
              checked={pushNotifications}
              onChange={(checked) => {
                return user.userType === UserType.GUEST
                  ? null
                  : setPushNotifications(checked);
              }}
            />
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="2" onClick={(e) => ToggleUserProfileModal()}>
            <img className="mr-3" src={SettingsBlack} alt="" />
            {t("user.profile:settings")}
          </Dropdown.Item>
          <Dropdown.Item eventKey="3" onClick={onSignoutClick}>
            <img className="mr-3" src={Logout} alt="" />
            {t("user.profile:signout")}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <SignoutModal
        show={showSignout}
        handleClose={handleSignoutCancel}
        handleSignout={handleSignout}
      />
      <SignoutError show={signoutFailed} handleClose={hideSignoutError} />

      <UserProfileModal
        show={showUserProfileModal}
        handleClose={ToggleUserProfileModal}
      />
    </>
  );
}

export default connect()(UserMenu);
