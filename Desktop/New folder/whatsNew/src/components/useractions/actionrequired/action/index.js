import React from "react";
import RequiredActionStyle from "./requiredActionStyle";
import RequiredActionContent from "./requiredActionContent";
import RequiredActionType from "./requiredActionType";
import RequiredActionActions from "./requiredActionActions";
import { useTranslation } from "react-i18next";
import UserRequiredActionType from "../../../../props/required-actions-type"
import { ConvertToNth } from "../../../utils/date-utils" 

export const Action = ({ action }) => {
  const { t, i18n } = useTranslation()
  //const { headline, title, type } = action;
  const { headline, actionType, channelId, channelName, requesterId, requesterName, requestTime} = action;
  let title;
  var d = new Date();
  d.setTime(requestTime * 1000); //As requestTime is in second and javascript work with millisecond only.
  var dayVal = d.toLocaleDateString('en-US', {day: 'numeric' });
  var nthDayVal = `${dayVal}<sup>${ConvertToNth(dayVal)}</sup>`;
  let formatedDateTime = d.toLocaleTimeString('en-US', {hour:'numeric', minute:'numeric'}) + " "+ nthDayVal + " "+ d.toLocaleDateString('en-US', {month: 'short' });

  if (actionType === UserRequiredActionType.JOIN_CHANNEL) {
    title = t("actionRequired:join.channel") + "#"+channelName + " "+ t("actionRequired:invited.by") + "@" + requesterName + " " + t("actionRequired:from") + formatedDateTime;
  } else if (actionType === UserRequiredActionType.APPROVE_AUTHENTICATION) {
    title = t("actionRequired:authenticate.approval") + "#"+channelName + " "+ t("actionRequired:by") + "@" + requesterName + " " + t("actionRequired:from") + formatedDateTime;
  }

  return (
    <RequiredActionStyle>
      {headline && (
        <p
          className="action_headline"
          dangerouslySetInnerHTML={{ __html: headline }}
        ></p>
      )}
      <div className="card_details">
        <span className="action_schema">
          <RequiredActionType type={actionType} />
        </span>
        <div className="action_content">
          {title && <span dangerouslySetInnerHTML={{ __html: title }}></span>}
          <RequiredActionContent action={action} />
        </div>
        <RequiredActionActions action={action}></RequiredActionActions>
      </div>
    </RequiredActionStyle>
  );
};

const nth = function(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:  return "st";
    case 2:  return "nd";
    case 3:  return "rd";
    default: return "th";
  }
}