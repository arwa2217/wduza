import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ESignatureServices from "../../../services/esignature-services";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import "./historyModal.css";

export const ActionTypes = {
  DOC_CREATED: "Created",
  INVITATION_SENT: "Invitation Sent",
  INVITATION_RESENT: "Invitation Resent",
  DOC_SIGNED: "Signed",
  DOC_VOIDED: "Voided",
  DOC_SIGN_COMPLETED: "Sign Completed",
  DOC_VIEWED: "Viewed",
  DOC_DOWNLOADED: "Downloaded",
  DOC_DELETED: "Deleted",
  DOC_FORWARDED: "Forwarded",
  DOC_SHARED: "Shared",
};

const HistoryModal = () => {
  const { t } = useTranslation();
  const [fileId, setFileId] = useState(null);
  const [historyCollection, setHistoryCollection] = useState({
    eSignHistory: {},
  });
  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  useEffect(() => {
    const fileMetaData = {
      fileName: esignFileInfo?.name,
      fileRename: esignFileInfo?.name,
      fileSize: esignFileInfo?.size,
      fileType: "ESIGN_DOC",
    };
    ESignatureServices.uploadEsignMetadata(fileMetaData).then(
      (responseEsignMeta) => {
        if (responseEsignMeta?.data?.fileId)
          setFileId(responseEsignMeta.data.fileId);
      }
    );
  }, [esignFileInfo]);

  useEffect(() => {
    if (fileId) {
      ESignatureServices.getHistory(fileId).then((res) => {
        if (res?.data) {
          setHistoryCollection({ ...res.data });
        }
      });
    }
  }, [fileId]);

  const getRecipients = (recipients) => {
    const names = (recipients || []).map((rec) => rec.name);
    return names?.length ? names.join(", ") : "";
  };

  const getHistoryDate = (date) => {
    return date ? moment(date).format("MMM D, YYYY") : "";
  };

  const getStatus = (status) => {
    let res = "Sent";
    if (status === "WAITING_FOR_OTHERS") {
      res = "Waiting for Others";
    }
    return res;
  };

  const getHistoryTime = (date) => {
    return date ? moment(date).format("hh:mm A") : "";
  };

  const getDocumentStatus = (doc) => {
    let res = ActionTypes.DOC_CREATED;
    if (doc === "DOC_CREATED") {
      res = ActionTypes.DOC_CREATED;
    }
    if (doc === "INVITATION_SENT") {
      res = ActionTypes.INVITATION_SENT;
    }
    return res;
  };

  const { eSignHistory } = historyCollection;
  return (
    <Modal size="lg" show={true} centered>
      <Modal.Body>
        <div className="history-modal-container">
          <div className="history-modal-row">
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="header-span-text">
                  {t("esign:history:modal:subject")}
                </span>
              </div>
              <div className="history-box-right">
                <span className="header-span-text">
                  {t("esign:history:modal:document")}
                </span>
              </div>
            </div>
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="content-span-text">
                  {historyCollection?.subject}
                </span>
              </div>
              <div className="history-box-right">
                <span className="content-span-text">
                  {historyCollection?.title}
                </span>
              </div>
            </div>
          </div>
          <div className="history-modal-row">
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="header-span-text">
                  {t("esign:history:modal:envelope")}
                </span>
              </div>
              <div className="history-box-right">
                <span className="header-span-text">
                  {t("esign:history:modal:recipients")}
                </span>
              </div>
            </div>
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="content-span-text">
                  {historyCollection?.documentId}
                </span>
              </div>
              <div className="history-box-right">
                <span className="content-span-text">
                  {getRecipients(historyCollection?.recipients)}
                </span>
              </div>
            </div>
          </div>
          <div className="history-modal-row">
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="header-span-text">
                  {t("esign:history:modal:sent")}
                </span>
              </div>
              <div className="history-box-right">
                <span className="header-span-text">
                  {t("esign:history:modal:status")}
                </span>
              </div>
            </div>
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="content-span-text">
                  {getHistoryDate(historyCollection?.sentAt)}{" "}
                  <span className="history-border-bar2"></span>{" "}
                  <span className="history-divider-right">
                    {getHistoryTime(historyCollection?.sentAt)}
                  </span>
                </span>
              </div>
              <div className="history-box-right">
                <span className="content-span-text">
                  {getStatus(historyCollection?.status)}
                </span>
              </div>
            </div>
          </div>
          <div className="history-modal-row">
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="header-span-text">
                  {t("esign:history:modal:created")}
                </span>
              </div>
              <div className="history-box-right">
                <span className="header-span-text">
                  {t("esign:history:modal:status-date")}
                </span>
              </div>
            </div>
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="content-span-text">
                  {getHistoryDate(historyCollection?.createdAt)}{" "}
                  <span className="history-border-bar2"></span>
                  <span className="history-divider-right">
                    {getHistoryTime(historyCollection?.createdAt)}
                  </span>
                </span>
              </div>
              <div className="history-box-right">
                <span className="content-span-text">
                  {getHistoryDate(historyCollection?.updatedAt)}{" "}
                  <span className="history-border-bar2"></span>
                  <span className="history-divider-right">
                    {getHistoryTime(historyCollection?.updatedAt)}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div className="history-modal-row">
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="header-span-text">
                  {t("esign:history:modal:holder")}
                </span>
              </div>
              <div className="history-box-right">
                <span className="header-span-text">
                  {t("esign:history:modal:timezone")}
                </span>
              </div>
            </div>
            <div className="history-row-content">
              <div className="history-box-left">
                <span className="content-span-text">
                  {historyCollection?.creatorName}
                </span>
              </div>
              <div className="history-box-right">
                <span className="content-span-text">
                  (UTC-08:00) Pacific Time (US &amp; Canada)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="history-modal-table">
          <Table borderless>
            <thead>
              <tr className="history-row">
                <th>
                  <span className="history-th-left history-th-left-1">
                    {t("esign:history:modal:time")}
                  </span>
                  <span className="history-border-bar"></span>
                </th>
                <th>
                  <span className="history-th-left history-th-left-2">
                    {t("esign:history:modal:user")}
                  </span>
                  <span className="history-border-bar"></span>
                </th>
                <th>
                  <span className="history-th-left history-th-left-3">
                    {t("esign:history:modal:action")}
                  </span>
                  <span className="history-border-bar"></span>
                </th>
                <th>{t("esign:history:modal:status")}</th>
              </tr>
            </thead>
            <tbody>
              {eSignHistory?.count > 0 && (
                <>
                  {(eSignHistory.history || []).map((item) => {
                    return (
                      <tr className="history-row">
                        <td>
                          {getHistoryDate(item?.timestamp)}
                          <div className="history-td-dv">
                            {getHistoryTime(item?.timestamp)}
                          </div>
                        </td>
                        <td>
                          {item?.username}
                          <div className="history-td-dv">{`[${item?.ipaddr}]`}</div>
                        </td>
                        <td>{getDocumentStatus(item?.action)}</td>
                        <td>{getStatus(historyCollection?.status)}</td>
                      </tr>
                    );
                  })}
                </>
              )}
              {eSignHistory?.count === 0 && (
                <>
                  <tr>
                    <td className="history-row-no-data">No history found</td>
                  </tr>
                </>
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HistoryModal;
