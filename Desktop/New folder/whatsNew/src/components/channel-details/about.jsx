import React from "react";
import Row from "react-bootstrap/Row";
import "./channel-details.css";

function About(props) {
  return (
    <Row className="w-100 ml-0 border-top pb-3">
      <div class="col-12 px-4">
        <h6 className="channel-info-heading pb-2">
          Created on{" "}
          {new Date(parseInt(props.channel.createdOn) * 1000).toDateString()}
        </h6>
        <p className="channel-info-text p-0">
          Created by {props.channel.creator}
        </p>
      </div>
    </Row>
  );
}

export default About;
