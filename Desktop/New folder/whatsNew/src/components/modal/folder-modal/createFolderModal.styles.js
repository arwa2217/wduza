import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 660px;
    max-height: 368px;
  }
  .modal-content {
    box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
    border-radius: 8px;
    border: none;
  }
  .modal-header {
    width: 100%;
    color: #252534;
    font-size: 20px;
    font-weight: 400;
    padding: 40px 40px 34px;
    border: none;
  }
  .modal-header .header-title {
    font-size: 20px;
    color: #252534;
  }
  .modal-header .close {
    padding: 0px;
    margin: 0;
    opacity: 1;
  }
  .modal-body {
    padding: 0px 40px;
    .form-label {
      font-size: 12px;
      color: #19191a;
      line-height: 100%;
      margin-bottom: 10px;
    }
    .folder-input-field {
      width: 580px;
      height: 40px;
    }
  }

  .modal-footer {
    padding: 40px;
    border-top: none;
    .create-folder-btn {
      width: 184px;
      height: 40px;
      background: #03bd5d;
      border-radius: 2px;
      border: none;
      color: white;
      margin: 0;
    }
    .create-folder-btn-disabled {
      width: 184px;
      height: 40px;
      background: #18b2634d;
      border-radius: 2px;
      border: none;
      color: white;
      margin: 0;
    }
  }
`;

export const StyledModalButton = styled.button`
  width: 230px;
  height: 40px;
  border-radius: 2px;
`;
