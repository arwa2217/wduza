import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const ESignatureStyledModal = styled(Modal)`
  .modal {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    max-width: 460px;
    background: #ffffff;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .modal-dialog {
    max-width: 460px;
  }
  .modal-content {
    padding: 30px;
  }
  &.agreement-modal .modal-content {
    padding: 34px 30px 28px 30px;
  }
  .modal-header {
    margin-bottom: 20px;
    padding: 0;
    border: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 21px;
    color: rgba(0, 0, 0, 0.9);

    .close {
      padding: 10px;
    }
  }
  &.agreement-modal .modal-header {
    margin-bottom: 20px;
  }
  &.agreement-modal .modal-header {
    line-height: 134%;
  }
  &.agreement-modal .aggr-title {
    margin-bottom: 6px;
  }
  .modal-body {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.9);
    border: 1px dotted rgba(0, 0, 0, 0.1);
    align-self: center;
    text-align: center;
    flex-direction: column;
    max-width: 400px;
    padding: 17px 30px;
  }
  .upload-modal-body {
    padding: 0 !important;
  }
  .container {
    border: none;
  }

  .form-control-field {
    height: 30px;
  }

  .form-control-radio {
    margin: 16px 0 25px !important;
  }

  .files-forward-add-notes {
    margin-top: 1px;
    border: 1px solid #0000000a;
    max-height: 108px;
    height: 108px;
    overflow: auto;
    border-radius: 4px;

    & .ql-toolbar {
      display: none;
    }
  }

  .create-sign-btn {
    width: 142px;
    height: 36px;
    line-height: 134%;
    font-size: 16px;
    background: #03bd5d;
    border-radius: 4px;
    border: none;
    color: #fff;
    margin: 0;
  }
  .modal-footer {
    padding: 12px 0 0;
    justify-content: flex-start !important;

    p {
      font-size: 11px;
      line-height: 15px;
      font-family: "Roboto";
      font-style: normal;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.5);
    }
  }
  .modal-upload-footer {
    justify-content: center !important;
    padding: 0;
  }
  &.agreement-modal .dropzone-body-text {
    line-height: 18px;
  }
`;
