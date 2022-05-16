import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const HideUnHideModal = styled(Modal)`
  box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
  border-radius: 8px;
  display: flex !important;
  justify-content: center;
  align-items: center;
  min-width: 560px;
  .modal-content {
    padding: 40px;
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
      padding: 34px 0px 30px 0px;
      margin: 0px;
    }
    font-size: 16px;
    line-height: 100%;
    color: #19191a;

    .ui.checkbox .box,
    .ui.checkbox label {
      font-size: 14px;
    }
  }

  .modal-body > input {
    font-size: 16px;
    margin-bottom: 33px;
    padding-right: 40px;
  }

  .modal-footer {
    border: none;
    padding: 40px 0px 0px 0px;
    .edit-button {
      margin-left: 10px !important;
      background: #18b263 !important;
      opacity: 1;
      border-radius: 2px;
      width: 130px;
      height: 40px;
    }

    .cancel-button {
      background: #999999 !important;
      opacity: 1;
      border: 1px solid #999999;
      border-radius: 2px;
      width: 130px;
      height: 40px;
    }
  }
`;
