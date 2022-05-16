import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseIcon from "../../../assets/icons/close.svg";
import styled from "styled-components";
import "./delete-warning-modal.css";

const NameContainer = styled.div`
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  max-height: 240px;
`;
const NameChip = styled.span`
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

function DeleteWarningModal(props) {
  const { t } = useTranslation();
  return (
    <Modal
      show={props.showModal}
      size="m"
      aria-labelledby="contained-modal-title-center"
      centered
      className="delete-warning-container"
    >
      <Modal.Header className="modal-head-container">
        <Modal.Title className="heading-title">
          {t(props.data.header, {
            count: props.data?.userIndex,
            total: props.data?.total,
          })}
        </Modal.Title>
        <Modal.Title className="close-btn">
          <img onClick={props.closeModal} src={CloseIcon} alt="" />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="delete-warning-modal-content">
        <p className="content-title">
          <b>{props.data?.ownerName}</b>
          {props.data?.total === 1
            ? t(props.data.content1, {
                discussionCount: props.data?.discussionList?.length
                  ? props.data?.discussionList?.length
                  : 0,
              })
            : t(props.data.content1, {
                discussionCount: props.data?.discussionList?.length
                  ? props.data?.discussionList?.length
                  : 0,
              })}
          <br />
          {t(props.data.content2)}
          <br />
          <NameContainer
            className={`names-container ${
              props.data?.discussionList?.length > 10 ? "overflow" : ""
            }`}
          >
            {props.data?.discussionList?.map((name, ind) => (
              <NameChip key={ind}>{name}</NameChip>
            ))}
          </NameContainer>
        </p>
      </Modal.Body>
      <Modal.Footer className="delete-warning-modal-footer">
        {props.data?.userIndex > 1 ? (
          <Button className="prev-btn" onClick={props.previousAction}>
            {t(props.data.thirdButtonText)}
          </Button>
        ) : (
          ""
        )}
        {props.data?.userIndex === props.data?.total ||
        props.data?.total === 1 ? (
          ""
        ) : (
          <Button className="next-btn" onClick={props.nextAction}>
            {t(props.data.secondaryButtonText)}
          </Button>
        )}
        <Button className="ok-btn" onClick={props.okAction}>
          {t(props.data.primaryButtonText)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteWarningModal;
