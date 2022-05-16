import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const NoNotificationWrapper = styled.div`
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  margin: 20px 60px 0 60px;
  padding-bottom: 15px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 14px;
  font-weight: initial;
`;

const NotificationMessage = () => {
  const { t } = useTranslation();

  return (
    <NoNotificationWrapper className="d-flex justify-content-center w-100">
      <span className="notification-text">
        <p>{t("user.profile:noNotificationsYet")}</p>
      </span>
    </NoNotificationWrapper>
  );
};

export default NotificationMessage;
