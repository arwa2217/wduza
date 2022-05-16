import Toast from "react-bootstrap/Toast";
import styled from "styled-components";

export const DeleteToast = styled(Toast)`
  padding: 0;
  border: 2px solid transparent;
  background-color: #e3f2fd;
  background: #e3f2fd;
  position: fixed;
  bottom: 95px;
  left: 28px;
  z-index: 101;
  min-width: 309px;
  max-width: 309px;
  min-height: 72px;
  max-height: 72px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2), 0px 1px 18px rgba(0, 0, 0, 0.12),
    0px 6px 10px rgba(0, 0, 0, 0.14);
  border-radius: 4px;

  .toast-body {
    z-index: 1;
    padding: 0;
    min-width: 309px;
    max-width: 309px;
    min-height: 72px;
    max-height: 72px;
    text-align: left;

    .toast__text {
      padding-left: 16px;
      padding-top: 14px;
      background-color: #e3f2fd;
      color: #0053cb;
      cursor: default;
      font-weight: 100;
      font-size: 14px;
      letter-spacing: 0.25px;
      max-width: 210px;
      min-width: 210px;
      min-height: 40px;
      float: left;
    }
    .toast__text__name {
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 1;
      vertical-align: middle;
      margin-right: 3px;
    }

    .toast__close-btn {
      border: none;
      background-color: #e3f2fd;
      color: #0053cb;
      margin-top: 26px;
      margin-right: 16px;
      margin-bottom: 26px;
      width: 49px;
      height: 16px;
      cursor: pointer;
      float: right;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 16px;
    }

    .toast__close-btn:active,
    .toast__close-btn:hover,
    .toast__close-btn:focus {
      outline: none;
    }

    .toast__div {
      min-width: 309px;
      max-width: 309px;
      min-height: 72px;
      max-height: 72px;
      background-color: #e3f2fd;
    }
  }
`;
