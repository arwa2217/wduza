import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";

import "./share.css";
import styled from "styled-components";

const EmailContainer = styled.div`
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;
const EmailCheap = styled.span`
  border: 1px solid #c4c4c4;
  box-sizing: border-box;
  border-radius: 100px;
  padding: 7px 10px;
  font-weight: bold;
  font-size: 16px;
  line-height: 100%;
  color: #19191a;
  margin-right: 10px;
  margin-bottom: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ExpiryInfo = styled.div`
  padding: 20px 40px 0;
  border-top: 1px solid #e2e2e2;

  > span {
    font-weight: bold;
    font-size: 16px;
    line-height: 100%;
    color: #03bd5d;
  }
`;

function ShareModal(props) {
  const { t } = useTranslation();

  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="share-files-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t(props.data.header)}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="share-files-modal-content">
        <p className="content-title">
          {t(props.data.content1, { fileCount: props.data?.fileCount })}
          <br />
          {/* <b>{props.data?.emails?.toString()}</b> */}
          <EmailContainer>
            {props.data?.emails?.map((email, ind) => (
              <EmailCheap key={ind}>{email}</EmailCheap>
            ))}
          </EmailContainer>
        </p>
      </Modal.Body>
      <ExpiryInfo>
        <span className="date">
          {t(props.data.content2, {
            expireDate: props.data.expireDate,
            days: props.data.days,
          })}
        </span>
        <br />
        {props.data.hasPasscode ? (
          <span className="passcode">
            {t(props.data.passcodeText, { passcode: props.data.passcode })}
          </span>
        ) : (
          ""
        )}
      </ExpiryInfo>
      <Modal.Footer className="share-files-modal-footer">
        <Button className="back-btn" onClick={props.backAction}>
          {t(props.data.primaryButtonText)}
        </Button>
        <Button className="share-btn" onClick={props.shareFile}>
          {t(props.data.secondaryButtonText)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ShareModal;
