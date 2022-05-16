import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    margin-top: 134px;
    width: 700px;
    max-width: 700px;
    max-height: 756px;
    min-width: 700px;
  }
  .modal-content {
    width: 700px;
    max-height: 756px;
    box-shadow: 0px 0px 4px rgba(76, 99, 128, 0.3);
    border: 1px;
    border-radius: 0px;
  }

  .modal-header {
    padding-top: 20px;
    padding-right: 26px;
    width: 100%;
    height: 120px;

    .close {
      opacity: 0px;
      font-size: 30px;
      font-weight: 100;
    }

    .heading {
      width: 599px;
      height: 48px;
      padding-top: 16px;
      padding-left: 20px;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 34px;
      line-height: 48px;

      letter-spacing: 0.25px;

      color: #000000;
    }
  }
  .modal-body {
    padding: 0px;
    width: 100%;
    min-height: 250px;
    overflow-y: auto;

    .discussion-name {
      padding-left: 34px;
      padding-top: 20px;
      padding-right: 33px;
    }
    .discussion-name-label {
      padding-left: 12px;
      height: 16px;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 12px;
      line-height: 16px;

      letter-spacing: 0.4px;

      color: rgba(0, 0, 0, 0.6);
    }
    .discussion-name-input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      border-bottom: 1px solid black;
      padding-left: 12px;
      padding-bottom: 0px;
      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 18px;
      line-height: 24px;
      display: flex;
      align-items: flex-end;
      letter-spacing: 0.15px;
      color: rgba(0, 0, 0, 0.87);
    }
    .discussion-suggestion-label {
      padding-left: 12px;
      padding-top: 5px;
      height: 15px;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 12px;
      line-height: 16px;

      letter-spacing: 0.4px;

      color: rgba(0, 0, 0, 0.54);

      .discussion-name-count {
        padding-left: 132px;
      }
    }

    .member-add {
      padding-top: 45px;
      padding-left: 34px;
      padding-right: 33px;
    }

    .member-add-label {
      padding-left: 11px;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 12px;
      line-height: 16px;

      letter-spacing: 0.4px;

      color: rgba(0, 0, 0, 0.6);
    }

    .member-add-input {
      padding-left: 11px;

      height: 56px;
      background: #ffffff;
      border: 2px solid;
      box-sizing: border-box;
      border-radius: 5px;

      font-family: "Roboto", sans-serif;
      font-style: normal;
      font-weight: 100;
      font-size: 18px;
      line-height: 24px;

      display: flex;
      align-items: flex-end;
      letter-spacing: 0.15px;

      color: rgba(0, 0, 0, 0.54);
    }

    .member-add-input-active {
      border: 2px solid #1e88e5;
    }

    .member-add-input-invalid {
      border: 2px solid #fe2626;
    }

    .invalid-feedback {
      display: block;
    }

    .break {
      margin-left: 35px;
      margin-right: 32px;
      margin-top: 32px;
      border: 1px solid #f2f2f2;
      height: 0px;
    }
  }

  .modal-footer {
    display: block;
    width: 100%;
    height: 144px;
    padding: 0;
  }
`;

export const SaveButton = styled.button`
  bottom: 0;
  margin-top: 76px;
  margin-left: 497px;
  margin-right: 32px;
  margin-bottom: 32px;
  width: 171px;
  height: 36px;
  left: calc(50% - 171px / 2);
  top: calc(50% - 36px / 2);
  background-color: ${(props) => (props.disabled ? "#E0E0E0" : "#42A5F5")};
  border: none;
  border-radius: 4px;
  color: ${(props) => (props.disabled ? "#9E9E9E" : "#FFFFFF")};
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 16px;
  align-items: center;
  text-align: center;
  letter-spacing: 1.25px;
  text-transform: uppercase;
`;
