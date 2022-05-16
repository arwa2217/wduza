import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const ESignatureShareStyledModal = styled(Modal)`
  .modal {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    max-width: 650px;
    max-height: 231px;
    background: #ffffff;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .modal-dialog {
    max-width: 560px;
  }
  .modal-content {
    padding: 30px;
    border: 0;
  }
  .modal-header {
    padding: 0px;
    margin-bottom: 30px;
    border: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 18.48px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.9);

    .close {
      padding: 10px;
    }
  }
  .modal-body {
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.9);
    border: 2px dotted rgba(0, 0, 0, 0.1);
    align-self: center;
    text-align: center;
    flex-direction: column;
    width: 100%;
  }
  .upload-modal-body {
    width: 640px;
    padding: 48px !important;
  }
  .container {
    border: none;
  }

  .form-control-field {
    margin-bottom: 30px !important;
  }

  .form-control-radio {
    margin: 16.5px 0 25.5px;
  }

  .share-btn {
    height: 36px;
    background: #03bd5d;
    border-radius: 4px;
    border: none;
    color: #fff;
    margin-top: 25px;
    padding: 7.5px 12px;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
  }
  .share-btn:disabled {
    opacity: 0.35;
  }
  .modal-footer {
    padding: 12px 0 0;
    justify-content: flex-start !important;

    p {
      font-size: 11px;
      line-height: 15px;
    }
  }
  .modal-upload-footer {
    // padding: 36px 48px;
    // width: 640px;
  }

  .member-add-input,
  .passcode-input {
    border: none !important;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04) !important;
    height: 27px !important;
    padding: 4px 0 !important;
  }
  .passcode-input {
    font-size: 14px;
    line-height: 18px;
    height: 19px !important;
    padding: 0 0 4px 0 !important;
  }
  .member-add-input::placeholder,
  .passcode-input::placeholder {
    opacity: 0.35 !important;
  }
  .files-forward-add-notes {
    min-height: 108px !important;
    margin-bottom: 16px;
    > div {
      border: 1px solid rgba(0, 0, 0, 0.04) !important;
    }
  }
  .quill {
    padding: 0;
  }
  .ql-editor {
    padding: 8px 8px 0 8px !important;
  }
  .ql-editor.ql-blank::before {
    left: 8px !important;
  }
  .ql-toolbar.ql-snow {
    padding: 0 !important;
  }
  .form-group {
    margin-bottom: 16px !important;
  }
  .file-size {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: rgba(0, 0, 0, 0.5);
    margin: 8px 0 6px 0;
  }
  .expiration-date label,
  .passcode-wrapper label {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: #00a95b;
    margin-bottom: 4px !important;
  }
  .passcode-wrapper label {
    margin-bottom: 4px;
  }
  .expiration-date .date {
    color: rgba(0, 0, 0, 0.5);
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    display: inline;
    margin-left: 10px;
  }

  .divider {
    width: 1px;
    height: 33px;
    background-color: rgba(0, 0, 0, 0.04);
    margin: 0 20px;
  }

  .member-list {
    margin-bottom: 16px;
    padding: 0 !important;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-height: 100px;
    min-height: auto !important;
  }
  .member-list:hover {
    overflow-y: auto;
  }
  .member-item {
    background: rgba(240, 251, 245, 0.6);
    border: 0.5px solid #03bd5d;
    color: #03bd5d;
    border-radius: 4px;
    padding: 3.5px 6px;
    margin-right: 4px;
    margin-bottom: 4px;
    font-size: 13px;
    line-height: 17.42px;
    height: 24px;
  }
`;
