import React, { Fragment, useEffect, useState } from "react";
import TimelineDropdown from "../../molecules/timelineDropdown";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
const Timeline = styled.div`
  position: sticky;
  top: 0;
  padding: 7px 0px;
  z-index: 1001;
  background: #fff;
  margin: 0 27px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  /* border-top: 1px solid rgba(0, 0, 0, 0.08); */
  > hr {
    border-top: 1px solid #f8f8f8;
  }

  .timeline-dropdown {
    display: flex;
    justify-content: center;
  }
`;
export default (props) => {
  const messageDiv = document.getElementById("messages-div");
  const [timeInView, setTimeInView] = useState("");

  const { t } = useTranslation();
  useEffect(() => {
    const element = document.getElementById(props.currentOption);
    const top = element.getBoundingClientRect().top;
    const isVisible = top >= 0 && top <= window.innerHeight;
    if (isVisible) {
      const elementInView = props.currentOption;
      setTimeInView(elementInView);
      const timeMaps = props.messagesGroups.map((group, index) => {
        // const option = group.key;
        group = t("date.format", {
          date: group.posts[0].post.createdAt,
        });
        return group;
      });
      const elementIndex = timeMaps.findIndex((item) => item === elementInView);
      elementIndex > 0
        ? props.setDimentionArea(timeMaps[elementIndex - 1])
        : props.setDimentionArea(timeMaps[0]);
    }
  }, [messageDiv?.scrollTop]);

  return (
    <Fragment>
      <Timeline zIndex={props.zIndex}>
        <div className="timeline-dropdown">
          <TimelineDropdown {...props} />
        </div>
      </Timeline>
    </Fragment>
  );
};
