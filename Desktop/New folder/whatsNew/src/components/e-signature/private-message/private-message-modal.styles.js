import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const PrivateMessageStyledModal = styled(Modal)`
  .modal {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    max-width: 460px;
    max-height: 231px;
    background: #ffffff;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }
  .modal-content {
    padding: 30px;
  }
  .modal-header {
    padding: 0px !important;
    margin-bottom: 26px;
    padding: 0;
    border: none;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
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
  .sender-name {
    font-weight: 700;
    font-size: 14px;
    line-height: 134%;
    color: rgba(0, 0, 0, 0.9);
    margin-right: 8px;
  }
  .sender-details {
    margin-bottom: 16px;
  }
  .sender-email {
    font-weight: 400;
    font-size: 14px;
    line-height: 134%;
    color: rgba(0, 0, 0, 0.9);
  }
  .modal-footer {
    padding: 12px 0 0;
    margin: auto;
    p {
      font-size: 11px;
      line-height: 15px;
    }
  }
`;
