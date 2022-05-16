import React from "react";
import { Icon } from "semantic-ui-react";
import UserRequiredActionType from "../../../../props/required-actions-type"
import { useTranslation } from "react-i18next";

export default ({ type }) => {
  const { t, i18n } = useTranslation();
  switch (type) {
    case UserRequiredActionType.JOIN_CHANNEL: {
      return <span style={{ background: "yellow" }}>{t("wait")}</span>;
    }
    case UserRequiredActionType.APPROVE_AUTHENTICATION: {
      return <Icon name="facebook" floated="right" />;
    }
    case UserRequiredActionType.ASK: {
      return <span style={{ background: "skyblue" }}>{t("ask")}</span>;
    }
    default: {
      return <span>&nbsp;</span>;
    }
  }
};
