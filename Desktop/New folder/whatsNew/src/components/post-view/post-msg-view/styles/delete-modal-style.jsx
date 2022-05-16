import Modal from "react-bootstrap/Modal";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    // margin-top: 20.625rem;
    width: 100%;
    // height: 15rem;
    max-width: 35rem;
    // max-height: 15rem;
    // min-width: 35rem;
    // min-height: 15rem;
  }
  .modal-content {
    width: 35rem;
    height: 15rem;
    box-shadow: 0rem 0rem 0.25rem rgba(76, 99, 128, 0.3);
    border: 0.0625rem;
    border-radius: 0rem;
  }

  .modal-header {
    padding: 0;
    width: 100%;
    height: 3.75rem;
    border: none;

    .heading {
      margin-left: 2.5rem;
      margin-top: 2.5rem;
      font-style: normal;
      font-weight: 400;
      font-size: 1.25rem;
      line-height: 100%;
      color: #252534;
    }
  }
  .modal-body {
    padding: 0rem;
    width: 100%;
    height: 5rem;
    overflow-y: auto;

    .info {
      margin-left: 2.5rem;
      margin-top: 1.25rem;
      font-style: normal;
      font-weight: 100;
      font-size: 16px;
      line-height: 100%;
      color: #252534;
      max-height: 2.5rem;
      max-width: 29.875rem;
    }

    .break {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 12.5rem;
      display: inline-block;
      vertical-align: middle;
      font-weight: 400;
      line-height: 1.12;
    }
    .break:focus,
    .break:hover {
      color: transparent;
    }
    .break:focus:after,
    .break:hover:after {
      content: attr(data-text);
      overflow: visible;
      text-overflow: inherit;
      background: #fff;
      position: absolute;
      left: auto;
      top: auto;
      width: auto;
      max-width: 20rem;
      border: 0.0625rem solid #eaebec;
      padding: 0 0.5rem;
      box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.28);
      white-space: normal;
      word-wrap: break-word;
      display: block;
      color: black;
      margin-top: -1.25rem;
    }
  }

  .modal-footer {
    display: block;
    width: 100%;
    height: 6.25rem;
    padding: 0;
    border: none;
  }
`;

export const CancelButton = styled.button`
  margin-left: 16.4375rem;
  margin-top: 1.25rem;
  width: 8.3125rem;
  height: 2.5rem;
  left: calc(50% - 8.3125rem / 2 + 3.09375rem);
  top: calc(50% - 2.5rem / 2 + 3.75rem);
  background-color: ${(props) => props.theme.colors.default};
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;
`;

export const DeleteButton = styled.button`
  margin-left: 0.25rem;
  margin-top: 1.25rem;
  width: 8.3125rem;
  height: 2.5rem;
  left: calc(50% - 8.3125rem / 2);
  top: calc(50% - 2.5rem / 2);
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;
`;
