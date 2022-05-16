import styled from "styled-components";
import Modal from "react-bootstrap/Modal";

export const StyledModal = styled(Modal)`
  .modal-dialog {
    width: 100%;
    max-width: 560px;
  }
  .modal-content {
    box-shadow: 0rem 0rem 0.25rem rgba(76, 99, 128, 0.3);
    border: 0.0625rem;
    border-radius: 0;
    // max-height: 40rem;
  }

  .modal-header {
    width: 100%;
    color: ${(props) => props.theme.colors.grey__dark};
    font-size: 20px;
    font-weight: 400;
    padding: 32px 0 32px 40px;
    border-bottom-color: #adbacd;
  }
  .modal-header .close {
    padding: 0 44px 0 0;
    margin: 0;
  }

  .modal-header .close:active,
  .modal-header .close:focus,
  .modal-header .close:hover {
    outline: none;
  }
  @-moz-document url-prefix() {
    .modal-body {
      overflow-y: auto !important;
    }
  }

  .modal-body {
    max-height: 65vh;
    overflow-x: hidden;
    overflow-y: overlay;
    padding: 0;

    .form-settings {
      .form-wrapper {
        padding: 20px 40px 5px;
        overflow-y: overlay;
      }

      .form-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .notification-form-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
      }
      .form-title {
        font-size: 16px;
        color: ${(props) => props.theme.colors.grey__dark};
      }
      .form-subtitle {
        color: ${(props) => props.theme.colors.grey__dark};
        margin: 40px 0 30px;
      }
      .notification-form-subtitle {
        color: ${(props) => props.theme.colors.grey__dark};
        margin: 24px 0 20px;
      }
      .delivery-form-subtitle {
        color: ${(props) => props.theme.colors.grey__dark};
        margin: 20px 0 20px;
      }
      .notification-setting {
        padding: 29px 40px 20px 40px;
      }
      .custom-control {
        height: 20px;
      }
      .form-label {
        font-size: 12px;
        font-weight: 400;
        line-height: 1;
        margin-bottom: 10px;
      }
      .form-control {
        font-size: 14px;
        line-height: 100%;
        height: 40px;
      }
      .form-label + p {
        color: ${(props) => props.theme.colors.grey__dark};
      }
      .form-group {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
      }
      .member-group {
        margin-bottom: 30px;
      }
      .profile-image-preview {
        position: relative;
        display: flex;
        width: 140px;
        height: 140px;
        margin: 0 auto;
        justify-content: center;
        background: #ccc;
        border-radius: 8px;
      }
      .profile-image-preview .square-profile {
        object-fit: cover;
        min-width: 140px;
        min-height: 140px;
        background: #ededed;
        border: 1px solid #d9d9d9;
        box-sizing: border-box;
        border-radius: 8px !important;
      }
      .profile-image-preview button {
        position: absolute;
        bottom: 0;
        // right: 10px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 0;
        z-index: 1;
        left: 120px;
      }
      .cropper-wrapper {
        z-index: 100;
      }
      .custom-timezone > div {
        border-radius: 0;
        border-color: #adbacd;
        padding: 1px 0.75rem;

        > div:first-child {
          padding: 0;
        }
        > div:last-child > span {
          background: none;
        }
        > div:last-child > div {
          padding: 8px 0;
        }
      }
    }

    .disabled {
      color: #999999 !important;
    }
    input#default-activity.form-check-input {
      border: 5px solid #999999 !important;
      color: #808080 !important;
    }
    .profile-img-wrapper {
      width: 140px;
      height: 140px;
      position: relative;
      margin: 0 auto 40px;

      > .profile-img {
        overflow: hidden;
        width: 100%;
        height: 100%;
        text-align: center;
        top: 0;
        left: 0;
        border-radius: 8px;

        > img {
          height: 100%;
        }
        //  > img {
        //     // width: 100%;
        //     // height: 100%;
        //     // object-fit: cover;

        //     position: absolute;
        //     left: 50%;
        //     top: 50%;
        //     transform: translate(-50%, -50%);
        //   }
      }

      > button {
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        padding: 0;
        text-align: center;
        box-shadow: none;
        border: none;
      }

      figcaption {
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: all 0.3s ease-in-out;

        > img {
          cursor: pointer;
          padding: 5px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .square-profile {
      border-radius: 0px !important;
      height: 100% !important;
      width: auto !important;
    }

    figure:hover figcaption {
      opacity: 1;
      transition: all 0.3s ease-in-out;
    }
  }

  .modal-footer {
    padding: 10px 40px 30px 40px;
    border-top: none;
    justify-content: space-between;

    > .btn {
      padding: 7px 39px;
    }
  }
`;

export const StyledModalButton = styled.button`
  //   border: 5px solid red;
  width: 230px;
  height: 40px;
  border-radius: 2px;
`;
