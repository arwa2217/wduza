import React from "react";
import { Icon } from "semantic-ui-react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const ChannelDetailStyle = styled.div`
  .channel_details {
    display: block;
    font-weight: 400;
    padding-left: 10px;
  }
  .channel_name {
    color: grey;
    font-size: 16px;
    padding-left: 10px;
  }
  > ul {
    list-style: none;
    padding: 0;
    > li {
      border-bottom: 1px solid grey;
      padding: 10px;
      &:first-child {
        border-top: 1px solid grey;
      }
      &:hover {
        background: grey;
      }
    }
  }
`;

export default () => {
  const { t } = useTranslation();

  return (
    <ChannelDetailStyle>
      <label className="channel_details">{t("channel.style:details")}</label>
      <label className="channel_name">{t("channel.style:interm")}</label>
      <ul>
        <li>
          <span>{t("channel.style:about")}</span>
          <Icon name="angle right" size="small"></Icon>
        </li>
        <li>
          <span>{t("channel.style:members")}</span>
          <Icon name="angle right" size="small"></Icon>
        </li>
        <li>
          <span>{t("channel.style:my.saves")}</span>
          <Icon name="angle right" size="small"></Icon>
        </li>
        <li>
          <span>{t("channel.style:team.tags")}</span>
          <Icon name="angle right" size="small"></Icon>
        </li>
        <li>
          <span>{t("channel.style:shared.files")}</span>
          <Icon name="angle right" size="small"></Icon>
        </li>
      </ul>
    </ChannelDetailStyle>
  );
};
