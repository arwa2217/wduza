import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import contactsSearch from "@home/contacts-search.svg";
import { useTranslation } from "react-i18next";

const ContactsPanel = () => {
  const { t } = useTranslation();
  return (
    <Col id="right-details" className={`contacts-wrapper col-md-auto p-0 mr-0`}>
      <Row className="m-0">
        <Col xs={12} className="contacts-header pl-4 pr-4">
          <Col xs={10} className="contacts-text m-0 p-0">
            {t("user.summary:contacts")}
          </Col>
          <Col xs={2} className="m-0 p-0">
            <img
              className="contacts-search"
              alt={`contacts-search`}
              src={contactsSearch}
            />
          </Col>
        </Col>
      </Row>
    </Col>
  );
};

export default ContactsPanel;
