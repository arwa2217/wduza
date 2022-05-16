import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
// import "./channel-details.css";
import SelectedItem from "../selected-item";
import ArrowRight from "../../../assets/icons/arrow-right.svg";
import ArrowDown from "../../../assets/icons/arrow-down.svg";
import { updateSummaryActiveIndex } from "../../../store/actions/config-actions";
import { useTranslation } from "react-i18next";

export const SidebarHeader = styled.h1`
  font-size: 18px;
  margin: 0;
  margin-top: 8px !important;
  color: #19191a;
  font-weight: 400;
  line-height: 1.2;
`;

const detailItems = (t) => {
  return [
    {
      name: t("admin:discussion.management:sidebar.details:selected.list"),
      key: "selectedListDiscussion",
      notification: 0,
      class: " ",
    },
    {
      name: t("admin:discussion.management:sidebar.details:discussion.information"),
      key: "discussionInformation",
      notification: 0,
      class: " ",
    },
    {
      name: t("admin:discussion.management:sidebar.details:members"),
      key: "discussionMembers",
      notification: 3,
      class: " ",
    },
    {
      name: t("admin:discussion.management:sidebar.details:discussion.history"),
      key: "discussionHistory",
      notification: 3,
      class: "",
    },
    {
      name: t("admin:discussion.management:sidebar.details:file"),
      key: "discussionFile",
      content: [],
      notification: 5,
      class: " ",
    },
  ];
};

function AdminDiscussionDetails(props) {
  const { t } = useTranslation();
  let propCopy = { ...props };
  delete propCopy.name;
  detailItems(t)[0] = Object.assign(detailItems(t)[0], propCopy);
  const memberCount = useSelector((state) => state.channelDetails.memberCount);
  detailItems(t)[1].notification = memberCount;

  const selectedDiscussions = useSelector(
    (state) => state.AdminDiscussionReducer.selectedDiscussions
  );

  // let channelId = useSelector(
  //   (state) => state.config?.activeSelectedChannel?.id
  // );
  let adminSidebarActiveIndex = useSelector(
    (state) => state.config?.adminSidebarActiveIndex
  );
  const [selected, setSelected] = useState(adminSidebarActiveIndex);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelected(adminSidebarActiveIndex);
  }, [adminSidebarActiveIndex]);

  useEffect(() => {}, [memberCount]);

  // useEffect(() => {
  //   if (searchEventUpdate) {
  //     setSelected(6); //'Search'
  //   }
  // }, [searchEventUpdate]);

  // useEffect(() => {
  //   setSelected(summaryPanelActiveIndex);
  // }, [channelId]);

  function handleClick(e) {
    let requestedIndex = detailItems(t).findIndex((item) => item.key === e);

    let prevState = selected;
    if (prevState === requestedIndex) requestedIndex = -1;
    setSelected(requestedIndex);
    dispatch(updateSummaryActiveIndex(requestedIndex));
  }
  return (
    <Col className="channel-details-content">
      <Row>
        <Col xs={12} className="channel-details-header pl-4 pr-4">
          <SidebarHeader>Details</SidebarHeader>
        </Col>
        <Col
          xs={12}
          className="channel-details-body channel-details-content-scroll p-0"
        >
          {detailItems(t).map((item, index) => (
            <Row
              key={"BaseRow" + item.key}
              className={"mr-0 ml-0 pr-0 border-bottom" + item.class}
            >
              <Row key={"Row" + item.key} className="center">
                <Col key={"Col" + item.key} xs={12} className="p-0 pl-4 pr-4">
                  <button
                    key={"button" + item.key}
                    onClick={() => handleClick(item.key)}
                    className="channel-details-content-button text-left btn-block p-0"
                  >
                    {item.name}{" "}
                    {index === 0 && (
                      <strong>
                        {selectedDiscussions?.filter((i) => i.checked)?.length}
                      </strong>
                    )}
                    <div key={"div" + item.key} className="float-right">
                      {selected === index ? (
                        <img src={ArrowDown} alt="" />
                      ) : (
                        <img src={ArrowRight} alt="" />
                      )}
                    </div>
                  </button>
                </Col>
              </Row>
              {selected === index && (
                <SelectedItem item={item} channel={props.channel} />
              )}
            </Row>
          ))}
        </Col>
      </Row>
    </Col>
  );
}

export default AdminDiscussionDetails;
