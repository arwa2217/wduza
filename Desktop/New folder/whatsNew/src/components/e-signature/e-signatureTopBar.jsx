import React, { useEffect, useState } from "react";
import "./e-signatureTopBar.css";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import UserType from "../../constants/user/user-type";
import { ESIGNATURE_STATUS } from "../../constants/esignature-status";
import CreateFolderModal from "../../components/modal/folder-modal/create-folder-modal";
import styled from "styled-components";
import { DiscussionActions } from "../messages/channel-head.style";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import Notifications from "../datapanel/notification";
import searchIcon from "../../assets/icons/v2/ic_search.svg";
import CloseIcon from "../../assets/icons/v2/ic_cancel_circle.svg";
import searchActiveIcon from "../../assets/icons/v2/ic_search_active.svg";
import openSummaryIcon from "../../assets/icons/v2/summary-toggle.svg";
import CreateESignatureModal from "../modal/e-signature-modal/create-esignature-modal";
import ForwardESignatureModal from "../modal/e-signature-modal/forward-esignature-modal";
import ShareESignatureModal from "../modal/e-signature-modal/share-esignature-modal";
import ESignatureServices from "../../services/esignature-services";
import ShareModal from "../modal/share-modal/share-modal";
import FileShareStatusModal from "../modal/file-share-status-modal/file-share-status-modal";
import {
  closeFileShareStatusModal,
  guestFilesSharing,
} from "../../store/actions/main-files-actions";
import moment from "moment";

const Label = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: 100;
  line-height: 100%;
  font-size: 14px;
  color: #999999;
  float: right;
  margin-top: 5px;
  margin-left: 5px;
`;

function ESignatureTopBar(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.AuthReducer.user);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [forwardModalShow, setforwardModalShow] = useState(false);
  const [shareModalShow, setShareModalShow] = useState(false);
  const [showConfirmShareModal, setConfirmShowShareModal] = useState(false);
  const [shareData, setShareData] = useState({});
  const [showFileShareStatusModal, setShowFileShareStatusModal] = useState(
    showGuestShareStatusModal
  );
  const [forwardableEsigns, setForwardableEsigns] = useState([]);
  const [expirationDateSelect, setExpirationDateSelect] = useState(null);

  const { showGuestShareStatusModal, showGuestShareStatusType } = useSelector(
    (state) => state.mainFilesReducer
  );
  const filePanelActive = useSelector((state) => state.config.filePanelActive);
  const selectedEsignFiles = useSelector(
    (state) => state.esignatureReducer.selectedEsignRows
  );

  const selectedRows = useSelector(
    (state) => state.esignatureReducer.selectedEsignRows
  );

  const [isDownloadable, setIsDownloadable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);
  const [isForwardable, setIsForwardable] = useState(false);
  const [isShareable, setIsShareable] = useState(false);

  const [
    isUpdatedHeaderDiscussionVisible,
    setUpdatedHeaderDiscussionVisiblity,
  ] = useState(false);

  // useEffect(() => {
  //   let isCompleted = props.selectedEsign.some((el) => {
  //     return el.status === ESIGNATURE_STATUS.COMPLETED;
  //   });
  //   let isVoided = props.selectedEsign.some((el) => {
  //     return el.status === ESIGNATURE_STATUS.VOIDED;
  //   });

  //   let isDeletableCopyReceiver = props.selectedEsign.some((el) => {
  //     return (
  //       el.isDocCopyReceiver &&
  //       el.status === ESIGNATURE_STATUS.WAITING_FOR_OTHERS
  //     );
  //   });

  //   setIsDownloadable(isCompleted);
  //   setIsDeletable(isCompleted || isVoided || isDeletableCopyReceiver);
  //   setIsForwardable(isCompleted);
  //   setIsShareable(isCompleted);
  // }, [props.selectedEsign]);

  useEffect(() => {
    if (shareData?.invitee) {
      setConfirmShowShareModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareData]);
  useEffect(() => {
    setShowFileShareStatusModal(showGuestShareStatusModal);
  }, [showGuestShareStatusModal]);

  const handleClose = () => {
    setCreateModalShow(false);
  };
  const handleOpen = () => {
    setCreateModalShow(true);
  };
  // const handleForwardClose = () => {
  //   setforwardModalShow(false);
  // };
  // const handleForwardOpen = () => {
  //   let forwardableEsigns = props.selectedEsign.filter(
  //     (file) => file.status === ESIGNATURE_STATUS.COMPLETED
  //   );
  //   // props.selectedEsign.length > 0 &&
  //   //   props.selectedEsign.forEach((file) => {
  //   //     if (file.status === ESIGNATURE_STATUS.COMPLETED) {
  //   //       forwardableEsigns.push(file);
  //   //     }
  //   //   });
  //   if (forwardableEsigns.length > 0) {
  //     setForwardableEsigns(forwardableEsigns);
  //     setforwardModalShow(true);
  //   }
  // };
  // const handleShareClose = () => {
  //   setShareModalShow(false);
  // };
  // const handleShareOpen = () => {
  //   setShareModalShow(true);
  // };
  // const downloadEsigns = () => {
  //   let downloadableEsigns = props.selectedEsign.filter(
  //     (file) => file.status === ESIGNATURE_STATUS.COMPLETED
  //   );
  //   // props.selectedEsign.length > 0 &&
  //   //   props.selectedEsign.forEach((file) => {
  //   //     if (file.status === ESIGNATURE_STATUS.COMPLETED) {
  //   //       downloadableEsigns.push(file);
  //   //     }
  //   //   });
  //   downloadableEsigns.length > 0 &&
  //     props.downloadEsignature(downloadableEsigns);
  // };

  const deleteEsigns = () => {
    let deletableEsigns = [];
    props.selectedEsign.length > 0 &&
      props.selectedEsign.forEach((file) => {
        if (
          file.status === ESIGNATURE_STATUS.COMPLETED ||
          file.status === ESIGNATURE_STATUS.VOIDED
        ) {
          deletableEsigns.push(file.fileId);
        }

        if (file.isDocCopyReceiver) {
          if (file.status === ESIGNATURE_STATUS.WAITING_FOR_OTHERS) {
            deletableEsigns.push(file.fileId);
          }
        }
      });
    deletableEsigns.length > 0 && props.deleteEsignature(deletableEsigns);
  };

  const createEsignature = (file) => {
    if (true) {
      return;
    }
  };

  // const shareFile = () => {
  //   let newPostObj = shareData;
  //   newPostObj.invitee = shareData?.invitee?.map((i) => i.memberEmail);
  //   dispatch(guestFilesSharing(shareData));
  //   setShareData(null);
  //   setExpirationDateSelect(null);
  //   setConfirmShowShareModal(false);
  // };

  // function shareModalProps() {
  //   let data = "";
  //   if (shareData?.invitee && shareData?.fileListIds) {
  //     var newDateObj = new Date(
  //       new Date().getTime() + shareData.fileExpiry * 60000
  //     );
  //     const diffDays = Math.round(
  //       Math.abs((newDateObj - new Date()) / (24 * 60 * 60 * 1000))
  //     );
  //     newDateObj = new Date(
  //       new Date().setDate(new Date().getDate() + diffDays)
  //     );
  //     const expireDate = moment(newDateObj).format("MMM D, YYYY");
  //     let passcodeStars = "";
  //     if (shareData?.passcode?.length) {
  //       for (var i = 1; i <= shareData?.passcode?.length; i++) {
  //         passcodeStars = passcodeStars + "*";
  //       }
  //     }

  //     data = {
  //       header: "confirm.share.modal:header",
  //       content1:
  //         shareData?.fileListIds?.length === 1
  //           ? "confirm.share.modal:content.single"
  //           : "confirm.share.modal:content.multiple",
  //       content2: "confirm.share.modal:content2",
  //       fileCount: shareData?.fileListIds?.length,
  //       hasPasscode: shareData?.passcodeReqd,
  //       passcode: passcodeStars,
  //       passcodeText: "confirm.share.modal:passcode",
  //       emails: shareData?.invitee?.map(({ memberEmail }) => memberEmail),
  //       primaryButtonText: "confirm.share.modal:back.button",
  //       secondaryButtonText: "confirm.share.modal:share.button",
  //       expireDate: expireDate,
  //       days: diffDays,
  //     };
  //   }
  //   return data;
  // }
  // function statusModalProps() {
  //   let data = "";
  //   let success = showGuestShareStatusType === "SUCCESS";
  //   if (showGuestShareStatusModal && showGuestShareStatusType) {
  //     data = {
  //       header: success
  //         ? "file.share.status.modal:header1"
  //         : "file.share.status.modal:header2",
  //       content: success
  //         ? "file.share.status.modal:content1"
  //         : "file.share.status.modal:content2",
  //       primaryButtonText: "file.share.status.modal:ok.button",
  //     };
  //   }
  //   return data;
  // }

  // const backAction = () => {
  //   setConfirmShowShareModal(false);
  //   setShareModalShow(true);
  //   setExpirationDateSelect(expirationDateSelect);
  //   setShareData(shareData);
  // };

  const onClosehandler = (e) => {
    // need to update
    // props.resetInputValue(e);
    setUpdatedHeaderDiscussionVisiblity(false);
  };

  const updatedDiscussionHeader = (
    <>
      <div className="d-flex align-items-center esign-inner-container">
        <img src={searchIcon} alt="search" />
        <div className="d-flex esign-input-container">
          <input
            onKeyUp={props.handleSearch}
            placeholder={t("files:search.folder.filter")}
            maxLength="80"
            value={props.value}
            autoFocus
          />
          <img src={CloseIcon} className="pointer-on-hover" alt="Close" onClick={(e) => onClosehandler(e)} />
        </div>
      </div>
      <div className="pointer-on-hover esign-btn" onClick={() => setUpdatedHeaderDiscussionVisiblity(false)}>Cancel</div>
    </>
  );

  const defaultDiscussionHeader = (
    <div className="d-flex align-items-center esign-inner-container">
      <div>
        <img
          src={searchIcon}
          alt="Search"
          onClick={() => setUpdatedHeaderDiscussionVisiblity(true)}
          className="pointer-on-hover"
        />
      </div>
    </div>
  );

  return (
    <div className="topBar-class m-0">
      <div className="d-flex align-items-center justify-content-between pr-0">
        <div className="esign-topbar">
          {user.userType !== UserType.GUEST && (
            <button
              className="btn esign-topbar-new-folder-btn"
              type="button"
              onClick={handleOpen}
            >
              <Label>{t("e-signature:new.signature")}</Label>
            </button>
          )}
          {createModalShow && (
            <CreateESignatureModal
              onModalHide={handleClose}
              changeSignatureState={props.changeSignatureState}
              createEsignature={createEsignature}
            />
          )}
        </div>
        <div className="esign-topbar">
            <button
              className={`btn esign-topbar-delete-btn ${
                selectedRows.length > 0 ? "" : "disabled"
              }`}
              type="button"
              disabled={!selectedRows.length > 0}
              onClick={selectedRows.length > 0 ? deleteEsigns : undefined}
            >
              <Label>{t("esign.topbar:delete")}</Label>
            </button>
          </div>
        {/* {props.selectedEsign.length > 0 && ( */}
        <>
          {/* <div className="esign-topbar">
              <button
                className={`btn esign-topbar-download-btn ${
                  isDownloadable ? "" : "disabled"
                }`}
                type="button"
                disabled={!isDownloadable}
                onClick={isDownloadable ? downloadEsigns : undefined}
              >
                <Label>{t("esign.topbar:download")}</Label>
              </button>
            </div> */}
          {/* <div className="esign-topbar">
            <button
              className={`btn esign-topbar-delete-btn ${
                isDeletable ? "" : "disabled"
              }`}
              type="button"
              disabled={!isDeletable}
              onClick={isDeletable ? deleteEsigns : undefined}
            >
              <Label>{t("esign.topbar:delete")}</Label>
            </button>
          </div> */}
          {/* <div className="esign-topbar">
              {props.selectedEsign &&
                props.selectedEsign.filter(
                  (file) => file.status === ESIGNATURE_STATUS.COMPLETED
                ).length === 1 && (
                  <button
                    className={`btn esign-topbar-forward-btn ${
                      isForwardable ? "" : "disabled"
                    }`}
                    type="button"
                    disabled={!isForwardable}
                    onClick={isForwardable ? handleForwardOpen : undefined}
                  >
                    <Label>{t("esign.topbar:forward")}</Label>
                  </button>
                )}
              {forwardModalShow && (
                <ForwardESignatureModal
                  onModalHide={handleForwardClose}
                  selectedFiles={forwardableEsigns}
                />
              )}
            </div> */}
          {/* <div className="esign-topbar">
              {props.selectedEsign &&
                props.selectedEsign.filter(
                  (file) => file.status === ESIGNATURE_STATUS.COMPLETED
                ).length === 1 && (
                  <button
                    className={`btn esign-topbar-share-btn ${
                      isShareable ? "" : "disabled"
                    }`}
                    type="button"
                    disabled={!isShareable}
                    onClick={isShareable ? handleShareOpen : undefined}
                  >
                    <Label>{t("esign.topbar:share")}</Label>
                  </button>
                )}
              {shareModalShow && (
                <ShareESignatureModal
                  shareData={shareData}
                  onModalHide={handleShareClose}
                  selectedFiles={selectedEsignFiles.length > 0 ? selectedEsignFiles : props.selectedEsign}
                  setShareData={setShareData}
                  expirationDateSelect={expirationDateSelect}
                  setExpirationDateSelect={setExpirationDateSelect}
                />
              )}
            </div> */}
        </>
        {/* )} */}

        <DiscussionActions className="justify-content-end">
          <div className="d-flex align-items-center position-relative">
            <div
              className={`d-flex align-items-center esign-search-container ${
                isUpdatedHeaderDiscussionVisible ? "open" : ""
              }`}
            >
              {isUpdatedHeaderDiscussionVisible
                ? updatedDiscussionHeader
                : defaultDiscussionHeader}
            </div>
            <div
              onClick={props.showRecipientPanel}
              id={filePanelActive ? "opened" : ""}
            >
              <img
                id="icon"
                src={openSummaryIcon}
                alt={"Details"}
                style={selectedEsignFiles?.length ? { cursor: "pointer" } : {}}
              />
            </div>
          </div>
        </DiscussionActions>
        {/* <ShareModal
          data={shareModalProps()}
          shareFile={shareFile}
          backAction={backAction}
          closeModal={() => setConfirmShowShareModal(false)}
          showModal={showConfirmShareModal}
        />
        <FileShareStatusModal
          data={statusModalProps()}
          closeModal={() => dispatch(closeFileShareStatusModal())}
          showModal={showFileShareStatusModal}
        /> */}
      </div>
    </div>
  );
}

export default ESignatureTopBar;
