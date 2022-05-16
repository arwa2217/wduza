/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./settingsList.css";
import SettingsListHeader from "./settingsListHeader";
import { useDispatch, useSelector } from "react-redux";
import SettingsListItem from "./settingsListItem";
import AccountIcon from "../../../assets/icons/setting-account.svg";
import DiscussionIcon from "../../../assets/icons/setting-discussion.svg";
import FileIcon from "../../../assets/icons/setting-file.svg";
import DeviceIcon from "../../../assets/icons/setting-device.svg";
import PostIcon from "../../../assets/icons/setting-post.svg";
import TaskIcon from "../../../assets/icons/setting-task.svg";
import OutOfOfficePolicyIcon from "../../../assets/icons/setting-out-of-office-policy.svg";
import NotificationIcon from "../../../assets/icons/setting-notification.svg";
import PresetIcon from "../../../assets/icons/setting-preset.svg";
import { SETTINGS_MENU_ITEMS } from "../../../constants/settings-menu-items";

function SettingList(props) {
  const dispatch = useDispatch();
  const folderList = useSelector((state) => state.folderReducer.folderList);
  const allFilesCount = useSelector(
    (state) => state.folderReducer.allFilesCount
  );
  const [filterState, setFilterState] = useState(false);
  const [inputs, setInputs] = useState("");
  const [settingsList, setSettingsList] = useState([
    { name: "Account", icon: AccountIcon, settingKey: SETTINGS_MENU_ITEMS.ACCOUNT },
    { name: "Discussion", icon: DiscussionIcon, settingKey: SETTINGS_MENU_ITEMS.DISCUSSION },
    { name: "File", icon: FileIcon, settingKey: SETTINGS_MENU_ITEMS.FILE },
    { name: "Device", icon: DeviceIcon, settingKey: SETTINGS_MENU_ITEMS.DEVICE },
    { name: "Post", icon: PostIcon, settingKey: SETTINGS_MENU_ITEMS.POST },
    { name: "Task", icon: TaskIcon, settingKey: SETTINGS_MENU_ITEMS.TASK },
    { name: "Out of the office policy", icon: OutOfOfficePolicyIcon, settingKey: SETTINGS_MENU_ITEMS.OUT_OF_THE_OFFICE_POLICY },
    { name: "Notification", icon: NotificationIcon, settingKey: SETTINGS_MENU_ITEMS.NOTIFICATION },
    { name: "Preset", icon: PresetIcon, settingKey: SETTINGS_MENU_ITEMS.PRESET },
  ]);

  function resetInputValue(event) {
    event.preventDefault();
    setInputs("");
    applyFilter("");
  }

  function handleNameChange(e) {
    e.preventDefault();
    let value = e.target.value;
    //remove leading white space, Used replace method as trimStart does not support by IE browser
    value = value.replace(/^\s+/g, "");

    setInputs(value);
    applyFilter(value);
  }

  return (
    <div className="setting-list">
      <SettingsListHeader
        toggleFilter={() => filterToggled()}
        isActiveFilter={filterState}
        handleSearchDiscussion={handleNameChange}
        value={inputs}
        resetInputValue={resetInputValue}
      />
      <div className="setting-list-body">
        {settingsList?.length ? (
          settingsList.map((setting, ind) => (
            <SettingsListItem
              {...setting}
              key={ind}
              settingKey={setting.settingKey}
              settingName={setting.name}
              icon={setting.icon}
              showTotalSize={false}
              showUsedSpace={false}
              showUnreadCount={false}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default SettingList;
