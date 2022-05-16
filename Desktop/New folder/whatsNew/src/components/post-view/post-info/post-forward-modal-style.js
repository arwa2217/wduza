import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const NonMemberModal = styled(Modal)`
  box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
  border-radius: 8px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  min-width: 560px;
  .modal-content {
    padding: 40px;
    height: 254px;
  }

  .modal-header {
    border: none;
    padding: 0;
    .modal-body .hide-post-content-color {
      padding: 40px 0px 30px 0px;
      margin: 0px;
    }

    .hide-post-content-color > span {
      color: #19191a;
      font-size: 20px;
      line-height: 100%;
    }

    .hide-post-content-color > img {
      float: right;
      cursor: pointer;
    }
  }

  .modal-body {
    .hide-post-content-color {
      padding: 25px 0px 0px 0px;
      margin-left: -14px;
    }
    font-size: 16px;
    line-height: 100%;
    color: #19191a;

    .ui.checkbox .box,
    .ui.checkbox label {
      font-size: 14px;
    }
  }

  .modal-footer {
    border: none;
    .edit-button {
      margin-top: 10px !important;
      margin-left: 10px !important;
      margin-right: -10px !important;
      background: #18b263 !important;
      opacity: 1;
      border-radius: 2px;
      width: 130px;
      height: 40px;
    }
  }
`;
