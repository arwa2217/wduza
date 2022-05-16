import React, { useState, useEffect } from "react";
// import { Icon } from 'semantic-ui-react';
import "./settingspanel.css";
import UserStatus from "../../constants/user/user-status";
import { useSelector } from "react-redux";
import UserMenu from "../usersettingpanel/usersettingpanel";
import online from "../../assets/icons/online.svg";
import offline from "../../assets/icons/offline.svg";
import away from "../../assets/icons/away.svg";

function SettingPanel(props) {
  const user = useSelector((state) => state.AuthReducer.user);
  const profileLoading = useSelector(
    (state) => state.AuthReducer.profileLoading
  );
  const ICON_ACTIVE = online;
  const ICON_OFFLINE = offline;
  const ICON_AWAY = away;

  const OnlineStatus = useSelector(
    (state) => state.AuthReducer.user.onlineStatus
  );

  const [userStatus, setUserStatus] = useState({
    state: user.onlineStatus,
    value:
      user.onlineStatus === UserStatus.ACTIVE.state
        ? UserStatus.ACTIVE.value
        : user.onlineStatus === UserStatus.AWAY.state
        ? UserStatus.AWAY.value
        : UserStatus.OFFLINE.value,
  });

  const [userStatusIcon, setUserStatusIcon] = useState(
    user.onlineStatus === UserStatus.ACTIVE.state
      ? ICON_ACTIVE
      : user.onlineStatus === UserStatus.AWAY.state
      ? ICON_AWAY
      : ICON_OFFLINE
  );

  useEffect(() => {
    setUserStatus({
      state: user.onlineStatus,
      value:
        user.onlineStatus === UserStatus.ACTIVE.state
          ? UserStatus.ACTIVE.value
          : user.onlineStatus === UserStatus.AWAY.state
          ? UserStatus.AWAY.value
          : UserStatus.OFFLINE.value,
    });
    setUserStatusIcon(
      user.onlineStatus === UserStatus.ACTIVE.state
        ? ICON_ACTIVE
        : user.onlineStatus === UserStatus.AWAY.state
        ? ICON_AWAY
        : ICON_OFFLINE
    );
  }, [OnlineStatus]);

  return profileLoading ? (
    <div className="d-flex justify-content-center user-settings">
      Loading...
    </div>
  ) : (
    <div className="user-settings">
      <UserMenu isExtendMenu={props.isExtendMenu} />
    </div>
  );
}

export default SettingPanel;
