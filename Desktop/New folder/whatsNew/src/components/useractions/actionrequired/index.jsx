import React from "react";
import { Icon } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { Action } from "./action";
import RequiredActionStyle from "./requiredActionStyle";
import UserRequiredActionType from "../../../props/required-actions-type";
import { useTranslation } from "react-i18next";

export default () => {
  const requiredActions = useSelector(
    (state) => state.ActionRequiredReducer.requiredActions
  );
  const { t } = useTranslation();

  return (
    <RequiredActionStyle>
      <div className="required_action__header">
        <div className="required_action__dropdown">
          <button>
            {t("channel.createChannel:channel.actions:action.required")}{" "}
            {requiredActions.length > 0 ? requiredActions.length : ""}{" "}
            <Icon name="dropdown" floated="right" />
          </button>
          <ul>
            <li className="active">
              {t("channel.createChannel:channel.actions:join.channel")}
            </li>
            <li>
              {t(
                "channel.createChannel:channel.actions:approve.authentication"
              )}
            </li>
            <li>{t("channel.createChannel:channel.actions:ask")}</li>
          </ul>
        </div>
      </div>
      <div className="required_action__actions">
        {requiredActions &&
          requiredActions.map((action, index) => {
            if (action.actionType === UserRequiredActionType.JOIN_CHANNEL) {
              return <Action key={"key_" + index} action={action} />;
            }
          })}
      </div>
    </RequiredActionStyle>
  );
};
