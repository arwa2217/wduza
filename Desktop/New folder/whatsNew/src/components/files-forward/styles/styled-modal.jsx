import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    width: 100%;
    max-width: 660px;
    min-height: 39.375rem;
  }
  .modal-content {
    width: 100%;
    min-height: 697px;
    box-shadow: 0rem 0rem 0.25rem rgba(76, 99, 128, 0.3);
    border: 0.0625rem;
    border-radius: 8px;
    overflow: hidden;
  }

  .modal-header {
    padding: 0;
    width: 100%;
    max-height: 376px;
    border-bottom: 1px solid #18b263;

    .modal-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 40px 40px 0;

      .heading {
        font-size: 20px;
        font-weight: 400;
        color: #252534;
      }

      .uploading {
        font-size: 14px;
        font-weight: 100;
        color: #308f65;
        margin: 0px 22px;
      }

      .upload_error {
        font-size: 14px;
        font-weight: 100;
        color: #dc3545;
        margin: 0px 22px;
      }
    }

    .thumbnail-container {
      margin: 30px 40px;
    }
    .thumbnail-container > div {
      margin-bottom: 10px;

      .text-warning,
      .text-danger,
      .text-primary {
        margin-left: 80px;
        font-size: 10px;
      }
    }
    .thumbnail-wrapper {
      width: 100%;
      margin: 0;
      height: 32px;
      display: flex;
      justify-content: space-between;

      .thumbnail {
        margin: 0;
        height: 100%;
        line-height: 1;
        max-width: 1.75rem;
        max-height: 2.5rem;
      }

      .thumbnail-caption {
        margin-left: 10px;
        width: 100%;
        height: 32px;
        background: #ffffff;
        border: 1px solid #adbacd;
        padding: 9px 32px 9px 10px !important;
        border-radius: 2px;
        box-sizing: border-box;
      }

      .thumbnail-caption:focus {
        outline: none;
      }

      .thumbnail-caption + .input-group-append {
        position: absolute;
        top: 0;
        right: 9px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        cursor: pointer;
        z-index: 9;
      }

      :last-child {
        margin-bottom: 0;
      }
    }
  }
  .modal-body {
    padding: 0rem;
    width: 100%;
    min-height: 198px;
    // overflow-y: auto;
    border-bottom: 1px solid #adbacd;
    svg {
      height: 15px;
      width: 15px;
    }
    .title {
      margin-top: 30px;
      font-size: 12px;
      font-weight: 100;
      color: #95979d;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .upload-select {
      input {
        opacity: 0 !important;
      }
    }

    .permission {
      text-align-last: left;
      cursor: pointer;
      margin-top: 28px;
      font-size: 14px;
      font-weight: 100;
      line-height: 1;
      color: #308f65;
      text-align: right;
      text-decoration-line: underline;
      direction: rtl;
      border: none;
      // width: 24% !important;
    }

    .remove-select {
      border-width: 0rem;
    }

    .remove-select:focus {
      border-width: 0rem;
      outline: none;
    }

    .members-div {
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;
      overflow-x: hidden;
    }

    .select-option {
      font-weight: 100;
      display: contents;
      white-space: none;
      min-height: 0.875rem;
      padding: 0rem;
      direction: ltr;
    }

    .disabled-option {
      background: #adbacd;
    }
  }

  .scrollable-y {
    overflow-y: overlay;
  }

  /* Track */
  .scrollable-y::-webkit-scrollbar-track,
/* Handle */
.scrollable-y::-webkit-scrollbar-thumb {
    background: transparent;
  }

  /* Track */
  .scrollable-y:hover::-webkit-scrollbar-track,
  .scrollable-y:active::-webkit-scrollbar-track,
  .scrollable-y:focus::-webkit-scrollbar-track,
  .scrollable-y:focus-within::-webkit-scrollbar-track {
    background: transparent;
  }
  /* Handle */
  .scrollable-y:hover::-webkit-scrollbar-thumb,
  .scrollable-y:active::-webkit-scrollbar-thumb,
  .scrollable-y:focus::-webkit-scrollbar-thumb,
  .scrollable-y:focus-within::-webkit-scrollbar-thumb {
    background: rgba(136, 136, 136, 0.5);
  }
  .border-none {
    border: none !important;
  }

  .modal-footer {
    display: block;
    width: 100%;
    height: 120px;
    padding: 0 35px;
    text-align: right;
    border-top: none;
  }
`;
