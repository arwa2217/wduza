import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { setActiveSettingMenuItem } from "../../../store/actions/config-actions";
import { useTranslation } from "react-i18next";

const SettingItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 23px 25px;
  align-items: center;
  border-bottom: 1px solid #dedede;
  height: 67px;
  cursor: pointer;

   ${({ active }) => {
    if (active) {
      return `background: #f2f2f2;`;
    }
  }} 
  // &:hover {
  //   background: #f2f2f2;
  // }

  .options-menu {
    visibility: hidden !important;
    position: absolute;
  }

  &:hover .options-menu {
    visibility: visible !important;
    position: relative;
  }
  &:hover .setting-name {
    max-width: calc(100% - 25px);
  }
  &:hover .setting-desc {
    max-width: calc(100% - 30px);
  }
`;
const SettingInfo = styled.div`
  display: flex;
  align-items: ${({ hasDesc }) => (hasDesc ? "start" : "center")};
  width: calc(100% - 75px);
`;
const SettingNameDesc = styled.div`
  margin-left: 9px;
  width: 100%;
  cursor: pointer;
  ${({ hasDesc }) => {
    if (!hasDesc) {
      return `display: flex;
       align-items:center;
    `;
    }
  }}
`;
const SettingName = styled.label`
  //   margin-left: 10px;
  margin-bottom: ${({ hasDesc }) => (hasDesc ? "5px" : 0)};
  color: #19191a;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  // max-width: calc(100% - 1px);
  line-height: 1.2;
`;
const Description = styled.p`
  font-weight: normal;
  font-size: 12px;
  line-height: 125%;
  color: #999999;
  margin-bottom: 0px;
  width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

function SettingsListItem(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let activeSettingMenu = useSelector((state) => state.config.activeSettingMenuItem);

  let {
    settingKey,
    settingName,
    description,
    icon,
  } = props;

  const handleSettingMenuClick = () => {
    dispatch(setActiveSettingMenuItem(props));
  };

  return (
    <Fragment key={`fragment-${props.settingKey}`}>
      {console.log(activeSettingMenu,settingKey)}
      <SettingItemWrapper
        onClick={handleSettingMenuClick}
        active={
          activeSettingMenu?.settingKey === settingKey
        }
      >
        <SettingInfo hasDesc={description ? true : false}>
          <img
            src={icon}
            alt="setting"
            // onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}
            className="setting-icons"
          />
          <SettingNameDesc hasDesc={description ? true : false}>
            {settingName && (
              <SettingName
                className="setting-name"
                hasDesc={description ? true : false}
              >
                {settingName}
              </SettingName>
            )}
            {description && (
              <Description className="setting-desc">{description}</Description>
            )}
          </SettingNameDesc>
        </SettingInfo>
      </SettingItemWrapper>
      
    </Fragment>
  );
}

export default SettingsListItem;
