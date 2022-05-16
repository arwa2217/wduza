import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useTranslation } from "react-i18next";
import "./channel-details.css";
import { ChannelDetailsDescription, Summary } from "./channel-details.style.js";
import ChannelDetailsItems from "./channel-details-items";
import styled from "styled-components";

const ChannelDetailsWrapper = styled.div`
  ::-webkit-scrollbar {
    width: 12px;
  }
  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: transparent !important;
    box-shadow: inset 0 0 14px 14px rgba(0, 0, 0, 0.1);
    border: solid 4px transparent !important;
    border-radius: 100px;
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;

function ChannelDetails(props) {
  const { t } = useTranslation();
  const channelDetails = props.channel;
  console.log("channel detail>>>>>>>>", channelDetails);
  return (
    <ChannelDetailsWrapper className="channel-details-content">
      <Col>
        {channelDetails.loading && (
          <div className="loading">{t("loading")}</div>
        )}
        {channelDetails.errorMessage && (
          <span className="error">{channelDetails.errorMessage}</span>
        )}
        {channelDetails.name && (
          <Row>
            {/*<Col xs={12} className="channel-details-header-top"></Col>*/}
            <ChannelDetailsItems {...channelDetails} channel={props.channel} />
          </Row>
        )}
      </Col>
    </ChannelDetailsWrapper>
  );
}
export default ChannelDetails;
