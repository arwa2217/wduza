import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import deletingIcon from "../../assets/icons/deleting-discussion.svg";
import { useSelector } from "react-redux";

const ArchivedStaticModal = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  z-index: 1050;
  padding-top: 50px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.5);
`;

const ArchivedStaticModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 40px;
  margin: auto;
  margin-left: 20%;
  width: 60%;
  -webkit-animation-name: animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: animatetop;
  animation-duration: 0.4s;
  height: 50%;
  max-height: 296px;
  top: 25%;
  align-content: center;
  align-items: center;
  vertical-align: middle;
  min-width: 480px;
  max-width: 560px;

  .heading {
    font-weight: 400;
    line-height: 1;
    font-size: 16px;
    color: #2c2c2c;
  }

  .image-archiving {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

function BeingArchivedModal(props) {
  const showArchivingModal = useSelector(
    (state) => state.ArchivalUnderProcess.showArchivingModal
  );
  const { t } = useTranslation();
  return (
    <ArchivedStaticModal show={showArchivingModal}>
      <ArchivedStaticModalContent>
        <span className="heading">
          {t("delete.discussion.modal:archiving.under.process.heading")}
        </span>
        <img src={deletingIcon} alt="archiving" className="image-archiving" />
      </ArchivedStaticModalContent>
    </ArchivedStaticModal>
  );
}

export default BeingArchivedModal;
