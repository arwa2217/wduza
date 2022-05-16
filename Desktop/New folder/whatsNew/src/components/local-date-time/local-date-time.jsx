import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

function LocalDateTime(props) {
  const { t } = useTranslation();

  const time_format = props.timeFormat ? props.timeFormat : "postTime-12";

  const date = props.eventTime ? new Date(props.eventTime) : new Date();

  return (
    <time className="post__time" dateTime={date.toISOString()} title={date}>
      {t(time_format, { time: date })}
    </time>
  );
}

LocalDateTime.propTypes = {
  eventTime: PropTypes.number,

  useMilitaryTime: PropTypes.bool,

  timeZone: PropTypes.string,

  enableTimezone: PropTypes.bool,
};

export default LocalDateTime;
