import React, { useEffect, useState } from "react";
import "./outlook-mail-details.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import SummaryList from "./summary-list";
import ContactList from "./contact-list";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const OutlookMailDetails = () => {
  const [currentTab, setCurrentTab] = useState("summary");
  const { t } = useTranslation();
  const activeEmail = useSelector(
    (state) => state.OutlookMailReducer?.activeEmail
  );

  useEffect(() => {
    setCurrentTab("summary");
  }, [activeEmail]);
  return (
    <Col className="channel-details-content contact-details-content">
      <Row>
        <Col
          xs={12}
          className="channel-details-header outlook-summary-header pl-4 pr-4"
        >
          <Tabs
            id="uncontrolled-tab-example"
            className="main-tab-summary"
            activeKey={currentTab}
            onSelect={(tab) => setCurrentTab(tab)}
          >
            <Tab eventKey="summary" title={t("mail-contact:summary")}>
              <Col
                xs={12}
                className="channel-details-body channel-details-content-scroll p-0"
              >
                <SummaryList />
              </Col>
            </Tab>
            <Tab eventKey="contact" title={t("mail-contact:contact")}>
              <ContactList />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Col>
  );
};

export default OutlookMailDetails;
