import React from "react";
import { Modal } from "react-bootstrap";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import { ESignatureStyledModal } from "./create-esignature-modal.styles";
import Close from "../../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";

function ViewHistory(props) {
  const { t } = useTranslation();
  console.log(props);
  return (
    <>
      <ESignatureStyledModal
        show={props.show}
        onHide={() => props.onModalHide()}
        centered
      >
        <ModalHeader style={{ display: "block" }}>
          <div className="header-container">
            <span> History</span>
            <button
              type="button"
              className="close"
              onClick={() => {
                props.onModalHide();
              }}
            >
              <span aria-hidden="true">
                <img src={Close} alt="" />
              </span>
              <span className="sr-only">
                {t("files:create.folder.modal:close")}
              </span>
            </button>
          </div>
        </ModalHeader>

        <Modal.Body style={{ marginBottom: "28px" }}>
          <div>
            <p className="esignature-title-sub mb-0">
              {t("esign.summary:last.change.on")}
            </p>
            <p className="esignature-summary-sub">
              {t("timeline.header", {
                time: props.esignSummaryData?.updatedAt,
              })}
              <span className="date-time-separator"></span>
              {t("postTime-child", {
                time: props.esignSummaryData?.updatedAt,
              })}
            </p>
          </div>
          <div>
            <p className="esignature-title-sub mb-0">
              {t("esign.summary:sent.on")}
            </p>
            <p className="esignature-summary-sub">
              {t("timeline.header", {
                time: props.esignSummaryData?.sentAt,
              })}
              <span className="date-time-separator"></span>
              {t("postTime-child", {
                time: props.esignSummaryData?.sentAt,
              })}
            </p>
          </div>
          <div>
            <p className="esignature-title-sub mb-0">
              {t("esign.summary:source")}
            </p>
            <p className="esignature-summary-sub">
              {props.esignSummaryData?.source ?? t("text.na")}
            </p>
          </div>
        </Modal.Body>
      </ESignatureStyledModal>
    </>
  );
}

export default ViewHistory;
