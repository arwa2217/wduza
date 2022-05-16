import React from "react";
import styled from "styled-components";
export const Body = styled.div`
  // margin: 0px 24px;
  // padding: 20px 24px;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  max-height: 300px;
  overflow: auto;
`;
export const Wrapper = styled.div`
  margin: 0px 24px;
  padding: 20px 0px;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  // max-height: 300px;
  // overflow: auto;
`;
export const SenderInfo = styled.p`
  color: #00a95b;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 20px;
`;
export const Content = styled.div`
  .subject {
    font-size: 16px;
    line-height: 21px;
  }
  .message {
    margin-top: 6px;
    max-width: 640px;
  }
  .message .post-overflow {
    max-height: 38px;
    padding-top: 0;
    line-height: 19px;
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 0 !important;
    // -webkit-line-clamp: 2;
  }
  .message .post-overflow-hidden {
    font-size: 12px;
    font-weight: 400;
    line-height: 16.06px;
    max-width: 640px;
    word-break: break-word;
  }
  .message .show-more-post{
    line-height: 19px;
    font-size: 14px;
  }
`;
export const Actions = styled.div`
  padding: 16px 0px;
  margin: 0 24px;
  border-top: ${({ addBorder }) =>
    addBorder ? `1px solid rgba(0, 0, 0, 0.2)` : `none`};
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .dropdown-toggle {
    padding: 6px 8px 7px;
  }
  .dropdown-toggle:focus {
    box-shadow: none !important;
  }
  .dropdown-toggle::after {
    position: absolute;
    top: 15px;
    right: 10px;
  }

  .dropdown-menu {
    width: 180px;
    transform: translate(0px, 30px) !important;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border: 1px solid #cccccc;
    padding: 0;
  }
  .dropdown-item {
    padding: 7px;
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
    line-height: 19px;
  }
  .dropdown-item:hover {
    color: #000000b2;
    background: #03bd5d12;
  }
`;

export const dropDownButtonStyle = {
  width: "180px",
  height: "32px",
  background: "transparent",
  border: "1px solid #CCCCCC",
  color: "#00A95B",
  boxSizing: "border-box",
  borderRadius: "4px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: "400",
};

export const Button = styled.button`
  margin-left: 16px;
  height: 32px;
  font-weight: normal;
  font-size: 14px;
  line-height: 134%;
  color: #ffffff !important;
  background: #03bd5d;
  border-radius: 4px;
`;
