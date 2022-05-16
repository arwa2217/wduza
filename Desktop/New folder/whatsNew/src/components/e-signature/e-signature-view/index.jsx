import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "../../mainframe/mainframe.css";
import { useDispatch, useSelector } from "react-redux";
import { GetAllFolders } from "../../../store/actions/folderAction";
import ESignaturePanel from "../e-signaturePanel";
import ESignatureTopBar from "../e-signatureTopBar";
import ESignatureDetailsTable from "../e-sigantureDetails/e-signatureDetailsTable";
import ESignatureDetailsHead from "../e-sigantureDetails/e-signatureDetailsHead";
import ESignatureSummary from "../review-n-send/e-signature-summary";
import ESignatureServices from "../../../services/esignature-services";
import ProcessingModal from "../../../components/modal/e-signature-modal/proccessing-modal";
import server from "server";
import moment from "moment";

import {
  downloadEsignatureFile,
  getESignature,
  deleteEsignatureFile,
  setEsignatureFolder,
  setEsignatureTab,
  setESignFileInfo,
  setESignRecipientList,
  setRecipientList,
  setSelectedRows,
  switchPanelView,
  toggleTopBarButtons,
  getESignatureSummary,
  saveESignaturePrepareFile,
  getESignatureSummaryRecipients,
  getESignatureSummaryHistory,
  setESignRecipientOrder,
  getEsignSearchResult,
} from "../../../store/actions/esignature-actions";
import RecipientView from "../recipients-view/recipients-view";
import SignatureHeader from "../signature-header/signature-header";
import SignatureFooter from "../signature-footer/signature-footer";
import { SignatureState } from "../constants";
import PrepareDocument from "../prepare-document/prepare-document";
import RecipientLeaveModal from "../recipients-view/recipient-leave";
import ReviewNSend from "../review-n-send/review-n-send";
import RestConstants from "../../../constants/rest/rest-constants";
import SignDocumentModal from "../sign-document/sign-document-modal";
import { MENU_ITEMS } from "../../../constants/menu-items";
import { Prompt, useHistory } from "react-router-dom";
import { showToast } from "../../../store/actions/toast-modal-actions";

function ESignatureView(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecipientDirty, setRecipientDirty] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [canLeave, setLeave] = useState(false);
  const [recipientPanel, setRecipientPanel] = useState(false);
  const [isOnlySigner, setIsOnlySigner] = useState(false);
  const [reviewSendData, setReviewSendData] = useState({});
  const [selectedEsign, setSelectedEsign] = useState([]);
  const [actionCorrect, setActionCorrect] = useState(false);
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const searchFilters = useSelector(
    (state) => state.esignatureReducer.searchFilters
  );
  const esignSummary = {
    display: "contents",
    paddingLeft: "0px",
  };

  const esignatureData = useSelector(
    (state) => state.esignatureReducer.esignatureList
  );
  const isOrderEnabled = useSelector(
    (state) => state.esignatureReducer.isOrderEnabled
  );
  const recipientOrder = useSelector(
    (state) => state.esignatureReducer.recipientOrder
  );
  const esignRecipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const esignFolderSelected = useSelector(
    (state) => state.esignatureReducer.esignatureFolderSelected
  );

  const esignTabSelected = useSelector(
    (state) => state.esignatureReducer.esignatureTabSelected
  );

  console.log(esignTabSelected, "esignTabSelected");

  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  const recipientList = useSelector(
    (state) => state.esignatureReducer.recipientList
  );
  const privateMsgList = useSelector(
    (state) => state.esignatureReducer.privateMsgList
  );

  const signatureState = useSelector(
    (state) => state.esignatureReducer.signatureState
  );

  const esignPreparedFile = useSelector(
    (state) => state.esignatureReducer.esignPreparedFile
  );
  const selectedEsignature = useSelector(
    (state) => state.esignatureReducer.selectedEsignRows
  );
  const esignSummaryData = useSelector(
    (state) => state.esignatureReducer.esignatureSummaryData
  );

  const searchEnabled = useSelector(
    (state) => state.esignatureReducer.searchEnabled
  );
  const searchResultData = useSelector(
    (state) => state.esignatureReducer.searchResultData
  );

  // useEffect(() => {
  //   if (signatureState === SignatureState.SIGN_DOCUMENT) {
  //     history.push(MENU_ITEMS.SIGN_DOCUMENT);
  //   }
  // }, [signatureState]);

  // useEffect(() => {
  //   console.log(recipientPanel.current);
  //   //just reset page
  // }, [recipientPanel.current]);

  const getEsignatureList = (folderSelected, tabSelected) => {
    dispatch(getESignature(folderSelected, tabSelected));
  };

  function deleteEsignature(fileIds) {
    ESignatureServices.deleteESign(fileIds).then((res) => {
      if (res.code === 2001) {
        if (fileIds.some((i) => i === esignSummaryData.fileId)) {
          dispatch(toggleTopBarButtons(false));
          showRecipientPanel(false);
        }
        dispatch(getESignature(esignFolderSelected, esignTabSelected));
        dispatch(showToast("File deleted successfully", 3000, "success"));
      } else {
        dispatch(showToast("Something went wrong", 3000, "failure"));
      }
    });
  }
  function correctEsignature(esignFileData) {
    let fileData = esignFileData[0];

    // SET FOR CORRECTED STATE
    if (actionCorrect === false) {
      setActionCorrect(true);
    }

    let onlySigner =
      fileData.isDocSender &&
      fileData.isDocSigner &&
      fileData.totalSigners === 1;
    changeSignatureState(onlySigner);

    // SET REVIEW SEND DATA
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(fileData.createdAt);
    const secondDate = new Date(fileData.expiry * 1000);
    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
    let reviewSendData1 = {
      expiry: diffDays,
      message: fileData.message,
      subject: fileData.subjectName,
      reminder: fileData.reminder,
    };
    setReviewSendData(reviewSendData1);

    // SET REC LIST
    if (esignRecipientList.length > 0) {
      dispatch(setESignRecipientList());
    }
    dispatch(setESignRecipientList(fileData.recipientList.recipients));

    // ADD SIGNING ORDER
    let totalRecipients = fileData.recipientList.recipients.length;

    if (totalRecipients > 1) {
      let mapRec = fileData.recipientList.recipients.map(
        (el, index, total) => ({
          total: total.map((i, ind) => ind + 1),
          sequence: el.order,
          index: index + 1,
        })
      );
      dispatch(setESignRecipientOrder(mapRec));
    }

    // SET ESIGN FILE INFO DATA
    const downloadDetails = {
      fileId: fileData.fileId,
      requestingUserEmail: currentUser.email,
      thumbnailOrDl: "DL",
      wopiCapable: false,
      isFresh: true,
      page: 1,
      requestedpages: 1,
      mimetype: fileData.mimetype,
      fileName: fileData.fileName,
    };
    let esignFileInfoTemp = fileData;
    esignFileInfoTemp.url =
      server.apiUrl +
      RestConstants.BASE_URL +
      RestConstants.ESIGN +
      RestConstants.ESIGN_FILE_CONTENT +
      `${downloadDetails.fileId}?email=${downloadDetails.requestingUserEmail}&q=${downloadDetails.thumbnailOrDl}&wopiCapable=${downloadDetails.wopiCapable}&isFresh=${downloadDetails.isFresh}`;

    dispatch(setESignFileInfo(esignFileInfoTemp));
  }

  function downloadEsignature(selectedEsignFiles) {
    selectedEsignFiles.forEach((row) => {
      const downloadDetails = {
        fileId: row.fileId,
        requestingUserEmail: currentUser.email,
        thumbnailOrDl: "DL",
        wopiCapable: false,
        isFresh: true,
        page: 1,
        requestedpages: 5,
        mimetype: row.mimetype,
        fileName:
          row.status === "Completed" ? row?.signedFileName : row?.fileName,
      };
      dispatch(downloadEsignatureFile(downloadDetails));
    });
  }

  function setEsignTab(tab) {
    dispatch(setEsignatureTab(tab.toUpperCase().split(" ").join("_")));
  }

  function setEsignFolder(folder) {
    dispatch(setEsignatureFolder(folder.toUpperCase().split(" ")));
  }

  function showHideTopBarButtons(selectedRows) {
    if (selectedRows.length > 0) {
      dispatch(toggleTopBarButtons(true));
      dispatch(
        getESignatureSummary(selectedRows[selectedRows.length - 1].fileId)
      );
      dispatch(
        getESignatureSummaryRecipients(
          selectedRows[selectedRows.length - 1].fileId
        )
      );
      dispatch(
        getESignatureSummaryHistory(
          selectedRows[selectedRows.length - 1].fileId
        )
      );
      setRecipientPanel(true);
    } else {
      dispatch(toggleTopBarButtons(false));
      setRecipientPanel(false);
    }
    dispatch(setSelectedRows(selectedRows));
  }

  function showRecipientPanel(data) {
    setRecipientPanel(data);
  }

  // CODE FOR SIDEBAR PANEL HIDE ON SWITCH MENU
  // PLEASE DO NOT REMOVE

  useEffect(() => {
    showRecipientPanel(selectedEsignature.length > 0);
    // if(selectedEsignature.length > 0){
    // dispatch(setSelectedRows([]));
    // }
  }, [selectedEsignature]);
  // END HERE

  function onDownloadClick(signInfo) {
    downloadEsignature([signInfo]);
  }

  function onSignClick(signInfo) {
    //prepare for signing
    const downloadDetails = {
      fileId: signInfo.fileId,
      requestingUserEmail: currentUser.email,
      thumbnailOrDl: "DL",
      wopiCapable: false,
      isFresh: true,
      page: 1,
      requestedpages: 1,
      mimetype: signInfo.mimetype,
      fileName: signInfo.fileName,
    };

    let esignFileInfoTemp = signInfo;
    esignFileInfoTemp.verificationMode =
      signInfo?.recipientList?.recipients.find(
        (i) => i.email === currentUser.email
      )?.verificationMode;
    esignFileInfoTemp.url =
      server.apiUrl +
      RestConstants.BASE_URL +
      RestConstants.ESIGN +
      RestConstants.ESIGN_FILE_CONTENT +
      `${downloadDetails.fileId}?email=${downloadDetails.requestingUserEmail}&q=${downloadDetails.thumbnailOrDl}&wopiCapable=${downloadDetails.wopiCapable}&isFresh=${downloadDetails.isFresh}`;

    dispatch(setESignFileInfo(esignFileInfoTemp));
    dispatch(switchPanelView(SignatureState.SIGN_DOCUMENT));
    history.push(MENU_ITEMS.SIGN_DOCUMENT);
  }

  function changeSignatureState(onlyOwnerSigner) {
    if (onlyOwnerSigner) {
      setIsOnlySigner(true);
      dispatch(switchPanelView(SignatureState.PREPARE_DOCUMENT));
    } else {
      setIsOnlySigner(false);
      dispatch(switchPanelView(SignatureState.RECIPIENT));
    }
  }

  function onSignComplete() {
    dispatch(switchPanelView(SignatureState.DEFAULT));
  }

  useEffect(() => {
    dispatch(GetAllFolders(dispatch));
    try {
      getEsignatureList(esignFolderSelected, esignTabSelected);
    } catch (e) {}
  }, [esignFolderSelected, esignTabSelected]);

  useEffect(() => {
    if (signatureState == SignatureState.RECIPIENT) {
      setCurrentStep(1);
    } else if (signatureState == SignatureState.PREPARE_DOCUMENT) {
      setCurrentStep(2);
    } else if (signatureState == SignatureState.REVIEW_SEND) {
      stepHandler(3);
    } else if (signatureState === SignatureState.DEFAULT) {
      stepHandler(0);
    }
  }, [signatureState]);

  const stepHandler = (step) => {
    if (step === currentStep) {
      return;
    }
    switch (step) {
      case 0:
        dispatch(setESignRecipientList());
        dispatch(setESignRecipientOrder());
        dispatch(setESignFileInfo());
        dispatch(saveESignaturePrepareFile());
        dispatch(switchPanelView(SignatureState.DEFAULT));
        break;
      case 1:
        dispatch(switchPanelView(SignatureState.RECIPIENT));
        break;
      case 2:
        dispatch(switchPanelView(SignatureState.PREPARE_DOCUMENT));
        break;
      case 3:
        dispatch(switchPanelView(SignatureState.REVIEW_SEND));
      default:
        break;
    }
    setCurrentStep(step);
  };

  const backHandler = () => {
    stepHandler(currentStep - 1);
  };
  const leaveHandler = () => {
    if (currentStep === 1) {
      setReviewSendData({});
      setLeave(true);
      setActionCorrect(false);
    }
    // check for step 2 & add your condition for dirty
    if (currentStep === 2) {
      setReviewSendData({});
      setLeave(true);
      setActionCorrect(false);
    }
    // check for step 3 & add your condition for dirty
    if (currentStep === 3) {
      setReviewSendData({});
      setLeave(true);
      setActionCorrect(false);
    }
  };
  const nextHandler = async (canLeave) => {
    if (currentStep <= 2) {
      stepHandler(currentStep + 1);
    } else if (currentStep === 3) {
      let myFileId = undefined;
      if (actionCorrect === false) {
        const fileMetaData = {
          fileName: esignFileInfo?.name,
          fileRename: esignFileInfo?.name,
          fileSize: esignPreparedFile?.size,
          fileType: "ESIGN_DOC",
        };

        let responseEsignMeta = await ESignatureServices.uploadEsignMetadata(
          fileMetaData
        );
        myFileId = responseEsignMeta?.data.fileId;
      } else {
        myFileId = esignFileInfo?.fileId;
      }
      // ESignatureServices.uploadEsignMetadata(fileMetaData).then((response) => {
      // if (!response.err) {
      setIsProcessing(true);
      let formData = new FormData();
      formData.append("file", esignPreparedFile);
      ESignatureServices.uploadEsignFile(
        myFileId,
        formData,
        actionCorrect
      ).then((result) => {
        ESignatureServices.addRecipients(
          myFileId,
          isOrderEnabled
            ? recipientList.map((recipient, index) => {
                recipient.order = recipientOrder[index].sequence;
                recipient.actionCorrect = actionCorrect;
                return recipient;
              })
            : recipientList.map((recipient) => {
                delete recipient.order;
                recipient.actionCorrect = actionCorrect;
                return recipient;
              })
        ).then((result) => {
          ESignatureServices.sendFile(myFileId, reviewSendData).then(
            (result) => {
              setIsProcessing(false);
              stepHandler(0);
              setReviewSendData({});
              setActionCorrect(false);
            }
          );
          ESignatureServices.addPrivateMessage(myFileId, privateMsgList);
          getEsignatureList(esignFolderSelected, esignTabSelected);
        });
      });
      // }
      // });
    }
  };

  const emitReviewSend = (state) => {
    setReviewSendData({ ...reviewSendData, ...state });
  };

  // useEffect(() => {
  //   if (actionCorrect) {
  //     setReviewSendData({ ...reviewSendData });
  //   }
  // }, [actionCorrect]);

  const handleSearch = (e) => {
    let searchText = e.target.value;
    let filterObject = { ...searchFilters };
    if (searchText.length > 2 && e.key === "Enter") {
      dispatch(getEsignSearchResult(searchText, filterObject));
    }
  };

  // function handleKeyUpEvent(e) {
  //   if (e.key === "Backspace" && value && value.length > 0) {
  //     dispatch(ClearFileSearchResultAction());
  //     // clearSearchFields();
  //     getSearchResult();
  //   } else if (e.key === "Backspace" && value.length === 0) {
  //     dispatch(ClearFileSearchResultAction());
  //     // clearSearchFields();
  //     setInputValue("");
  //   }
  //   if (e.key === "Enter") {
  //     setInputValue(value.trim());
  //     setInputValue(
  //       value.replace(/[`~!@#$%^&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi, "")
  //     );
  //     setInputValue(value.replace(/[{()}]/g, ""));
  //     if (value !== undefined && value.length >= 0) {
  //       if (value.indexOf("'") > 0 || value.indexOf('"') > 1) {
  //         setExact(true);
  //       }
  //       !isSearchDisabled() && getSearchResult();
  //       setShowAdvanced(!showAdvanced);
  //     }
  //   }
  // }

  const getSelectedEsigns = (esignData) => {
    setSelectedEsign(esignData);
  };

  return (
    <>
      <div
        onMouseDown={(e) => {
          if (!props.isProjectListEnabled) {
            props.setIsProjectListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col id="middle-project" className="project-bar pl-0 pr-0">
        <ESignaturePanel />
      </Col>
      <div
        onMouseDown={(e) => {
          if (!props.isDiscussionListEnabled) {
            props.setIsDiscussionListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col
        id="right-messagetab"
        className="noScroll main-post-area frameContent p-0 main-file-area"
      >
        {signatureState === SignatureState.DEFAULT && (
          <ESignatureTopBar
            changeSignatureState={changeSignatureState}
            deleteEsignature={deleteEsignature}
            downloadEsignature={downloadEsignature}
            showRecipientPanel={() => showRecipientPanel(!recipientPanel)}
            isOnlySigner={isOnlySigner}
            selectedEsign={selectedEsign}
            handleSearch={handleSearch}
          />
        )}
        {signatureState === SignatureState.RECIPIENT && (
          <SignatureHeader
            header={"Select recipients"}
            totalSteps={3}
            currentStep={currentStep}
            stepIn={stepHandler}
            isOnlySigner={isOnlySigner}
          />
        )}
        {signatureState === SignatureState.PREPARE_DOCUMENT && (
          <SignatureHeader
            header={"Prepare Document"}
            totalSteps={3}
            currentStep={currentStep}
            stepIn={stepHandler}
            isOnlySigner={isOnlySigner}
          />
        )}
        {signatureState === SignatureState.REVIEW_SEND && (
          <SignatureHeader
            header={"Review and Send"}
            totalSteps={3}
            currentStep={currentStep}
            stepIn={stepHandler}
            isOnlySigner={isOnlySigner}
          />
        )}
        <Row className="m-0">
          <Col className="p-0">
            {signatureState === SignatureState.DEFAULT && (
              <>
                <ESignatureDetailsHead
                  esignTabSelected={esignTabSelected}
                  setEsignTab={setEsignTab}
                  disableAll={esignFolderSelected === "DELETED"}
                />
                <ESignatureDetailsTable
                  esignatureData={
                    searchEnabled ? searchResultData : esignatureData
                  }
                  onSignClick={onSignClick}
                  onDownloadClick={onDownloadClick}
                  deleteEsignature={deleteEsignature}
                  correctEsignature={correctEsignature}
                  showHideTopBarButtons={showHideTopBarButtons}
                  getSelectedEsigns={getSelectedEsigns}
                  toggleTopBarButtons={toggleTopBarButtons}
                  showRecipientPanel={(data) => showRecipientPanel(data)}
                />
              </>
            )}
            {signatureState !== SignatureState.DEFAULT && (
              <>
                {signatureState === SignatureState.RECIPIENT && (
                  <RecipientView
                    isDirty={() => setRecipientDirty(true)}
                    senderName={currentUser.screenName}
                    senderEmail={currentUser.email}
                    nextHandler={nextHandler}
                    leaveHandler={leaveHandler}
                    backHandler={backHandler}
                    currentStep={currentStep}
                    isOnlySigner={isOnlySigner}
                  />
                )}
                {signatureState === SignatureState.PREPARE_DOCUMENT && (
                  <PrepareDocument
                    nextHandler={nextHandler}
                    leaveHandler={leaveHandler}
                    backHandler={backHandler}
                    currentStep={currentStep}
                    isOnlySigner={isOnlySigner}
                  />
                )}
                {signatureState === SignatureState.REVIEW_SEND && (
                  <ReviewNSend
                    emitData={emitReviewSend}
                    senderEmail={currentUser?.email}
                    nextHandler={nextHandler}
                    leaveHandler={leaveHandler}
                    backHandler={backHandler}
                    currentStep={currentStep}
                    isOnlySigner={isOnlySigner}
                    reviewSendData={reviewSendData}
                  />
                )}
                {/* <Prompt message={"leave?"} /> */}
                {canLeave && (
                  <RecipientLeaveModal
                    show={canLeave}
                    cancel={() => setLeave(false)}
                    okay={() => {
                      dispatch(switchPanelView(SignatureState.DEFAULT));
                      setCurrentStep(0);
                      dispatch(setESignRecipientList());
                      dispatch(setESignRecipientOrder());
                      dispatch(setESignFileInfo());
                      setLeave(false);
                    }}
                  />
                )}
              </>
            )}
          </Col>

          {signatureState !== SignatureState.DEFAULT ? (
            <Col id="middle-project" style={esignSummary}>
              {signatureState === SignatureState.RECIPIENT ? (
                <ESignatureSummary file={esignFileInfo} />
              ) : (
                <></>
              )}
              {signatureState === SignatureState.REVIEW_SEND ? (
                <ESignatureSummary file={esignFileInfo} />
              ) : (
                <></>
              )}
            </Col>
          ) : (
            <></>
          )}

          {signatureState === SignatureState.DEFAULT ? (
            <Col id="middle-project" style={esignSummary}>
              {recipientPanel ? <ESignatureSummary /> : <></>}
            </Col>
          ) : (
            <></>
          )}
        </Row>
      </Col>
      {/* <SignDocumentModal
        show={signatureState === SignatureState.SIGN_DOCUMENT}
        onClose={onSignComplete}
      /> */}
      {isProcessing && <ProcessingModal isOpen={isProcessing} />}
    </>
  );
}

export default ESignatureView;
