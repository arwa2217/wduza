import Badge from "react-bootstrap/Badge";
import React from "react";
import styled from "styled-components";

const Status = styled.span`
  text-transform: capitalize;
  ${({ status }) =>
    ` color: ${
      status === "ACTIVE"
        ? "#18B263"
        : status === "PENDING"
        ? "#EC801C"
        : "#CA4C70"
    };
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    `};
`;

const ActivationStatus = ({ status }) => {
  return (
    <Status status={status}>
      <Badge
        pill
        style={{
          background: `${
            status === "ACTIVE"
              ? "#18B263"
              : status === "PENDING"
              ? "#EC801C"
              : "#CA4C70"
          }`,
          borderRadius: "100%",
          marginRight: "5px",
          width: "8px",
          height: "8px",
          padding: "0",
        }}
      >
        &nbsp;
      </Badge>
      {status?.toLowerCase().split("_").join(" ") ?? ""}
    </Status>
  );
};

export default ActivationStatus;
