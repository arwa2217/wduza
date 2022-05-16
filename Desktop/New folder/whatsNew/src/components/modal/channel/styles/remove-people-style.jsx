import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    // margin-top: 275px;
    width: 660px;
    max-width: 660px;
    max-height: ${(props) => (props.extraheight ? "500px" : "476px")};
    min-width: 660px;
  }
  .modal-content {
    width: 660px;
    max-height: ${(props) => (props.extraheight ? "515px" : "476px")};
    box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
    border: 1px;
    border-radius: ${(props) => (props.has_modal_radius ? "8px" : "0px")};
  }

  .modal-header {
    padding-top: 40px;
    padding-left: 40px;
    width: 100%;
    height: 75px;
    border-bottom: 0;

    .heading {
      position: absolute;
      width: calc(75%);
      max-height: 45px;
      font-weight: 400;
      font-size: 20px;
      line-height: 100%;
      color: #252534;
      text-overflow: ellipsis;
      word-break: keep-all;
      max-width: 100%;
      overflow: hidden;
      display: block;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
  .modal-body {
    padding: 0px;
    width: 100%;
    // min-height: 300px;
    overflow-y: auto;

    .message {
      margin-top: 20px;
      margin-left: 40px;
      width: calc(100% - 80px);
      // height: 56px;
      font-weight: 100;
      font-size: 16px;
      line-height: 172.5%;
      color: #252534;
    }

    .message-input {
      margin-top: -20px;
      margin-left: 40px;
      width: calc(100% - 80px);
      height: 30px;
      font-weight: 100;
      font-size: 16px;
      line-height: 1;
      color: #252534;
    }
    .error-input {
      margin-bottom: 10px;
      color: #d23c02;
      font-size: 14px;
      height: 18px;
      font-weight: 100;
      margin-left: 40px;
      width: calc(100% - 80px);
    }

    .delete-radio-div {
      padding-bottom: 20px;
    }
    .delete-radio-button {
      display: block;
      margin-left: 40px;
      margin-top: 10px;
      font-size: 16px;
      color: #252534;
      cursor: pointer;
      width: fit-content;
    }
    .delete-radio-button-input {
      margin-right: 10px;
    }
  }

  .modal-footer {
    width: 100%;
    padding: 0;
    border-top: none;
  }
`;

export const SaveButton = styled.button`
  bottom: 0;
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  left: calc(50% - 120px / 2);
  top: calc(50% - 40px / 2);
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
`;

export const CancelButton = styled.button`
  bottom: 0;
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  left: calc(50% - 120px / 2);
  top: calc(50% - 40px / 2);
  background-color: ${(props) => props.theme.colors.default};
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
`;

export const LeaveButton = styled.button`
  bottom: 0;
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  left: calc(50% - 120px / 2);
  top: calc(50% - 40px / 2);
  background-color: #d23c02;
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
`;

export const BlueButton = styled.button`
  bottom: 0;
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  left: calc(50% - 120px / 2);
  top: calc(50% - 40px / 2);
  background-color: #2d76ce;
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  ${(props) => props.disabled && "cursor: not-allowed"};
`;

export const RenameInput = styled.input`
  width: 100%;
  border-color: ${(props) => props.borderColor};
  height: 100%;
  border-width: 1px;
  border-radius: 4px;
  font-size: 15.5px;
  line-height: 1;
  box-sizing: border-box;
  display: block;

  &:focus {
    outline: none;
  }
`;

export const RenameInputDiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const RenameSpan = styled.span`
  align-self: flex-end;
  font-size: 12px;
  margin: 9px 10px 0px 0px;
  position: absolute;
`;

export const GreenButton = styled.button`
  bottom: 0;
  width: 120px;
  height: 40px;
  margin-bottom: 20px;
  margin-right: 40px;
  left: calc(50% - 120px / 2);
  top: calc(50% - 40px / 2);
  background-color: #18b263;
  border: none;
  color: #ffffff;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};
  ${(props) => props.disabled && "cursor: not-allowed"};
`;
