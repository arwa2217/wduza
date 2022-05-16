import React, { useEffect, useState, useRef } from "react";
import { Dropdown, Form, Modal, Row, Col } from "react-bootstrap";
import "./sign-document-modal.css";
import PostContentView from "../../utils/post-content-view";
import {
  SenderInfo,
  Body,
  Content,
  Actions,
  Button,
  dropDownButtonStyle,
  Wrapper,
} from "./styles";
import SignDocument from "./sign-document";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import VerifyPage from "../pages/verifyPage";
import {
  getESignatureSummary,
  setESignFileInfo,
} from "../../../store/actions/esignature-actions";
import { showToast } from "../../../store/actions/toast-modal-actions";
import server from "server";
import RestConstants from "../../../constants/rest/rest-constants";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo.png";
import { FETCH_ESIGNATURE_LIST_SUCCESS } from "../../../store/actionTypes/esignature-action-types";
import ViewHistory from "../../modal/e-signature-modal/e-sign-history-modal";
import DocumentViewerModal from "../../post-view/post-msg-view/document-viewer-modal";
import VoidESignatureModal from "../../modal/e-signature-modal/void-esignature-modal";
import { getUID, removeAuthToken } from "../../../utilities/app-preference";
import FileAttachmentService from "../../../services/file-attachment-service";
import ESignatureServices from "../../../services/esignature-services";
import ElectronicRecordModal from "../electronic-record-modal/electronic-record-modal";
import HistoryModal from "../history-modal/historyModal";
import VoidConfirmationModal from "../../modal/e-signature-modal/void-confimration-modal";

const SignDocumentModal = (props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  // const [show, setShow] = useState(true);
  const [askPermission, setAskPermission] = useState(false);
  const [permission, setPermission] = useState(false);
  const [electronicModal, showElectronicModal] = useState(false);
  const [electronicContent, setElectronicContent] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [docData, setDocData] = useState({});
  const [userVerified, setUserVerified] = useState(false);
  const [finishModal, setFinishModal] = useState(false);
  const [otherActions, setOtherActions] = useState({
    show: null,
    label: t("esign.modal:other.actions"),
  });
  const [viewHistory, setViewHistory] = useState(false);
  const [viewCertModal, setViewCertModal] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [voidConfirm, setVoidConfirm] = useState(false);
  const [voidModalShow, setVoidModalShow] = useState(false);
  const signDocument = useRef(null);
  const esignSummaryData = useSelector(
    (state) => state.esignatureReducer.esignatureSummaryData
  );
  const esignFileData = useSelector(
    (state) => state.esignatureReducer.fileData
  );
  const annotationType = useSelector(
    (state) => state.esignatureReducer.annotationType
  );
  const esignFileInfo = useSelector(
    (state) => state.esignatureReducer.fileInfo
  );
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  let currentUser = useSelector((state) => state.AuthReducer.user);
  // const summaryData = location?.state;

  useEffect(() => {
    if (!esignSummaryData.fileId && esignFileInfo?.fileId)
      dispatch(getESignatureSummary(esignFileInfo.fileId));
  }, []);

  // useEffect(() => {
  //   if (voidConfirm) {
  //     setVoidModalShow(true);
  //     setVoidConfirm(false);
  //   }
  // }, [voidConfirm]);

  useEffect(() => {
    // if (summaryData?.responseData) {
    //   setDocData(summaryData.responseData);
    // } else
    if (esignSummaryData) {
      let data = {
        ...esignSummaryData,
        ...esignFileInfo,
      };
      setDocData(data);
      setUserVerified(!data.verificationMode);
    }
  }, [esignSummaryData, esignFileInfo]);

  // useEffect(() => {
  //   setShow(props.show);
  // }, [props]);

  // useEffect(() => {
  //   if (summaryData.verificationMode === "passcode") {

  //   }
  // },[summaryData])

  const handelFinishModal = (open) => {
    setFinishModal(open);
    if (!open) {
      history.goBack();
      currentUser.userType !== "INTERNAL" && removeAuthToken();
    }
  };
  const redirectToHomePage = (open) => {
    setFinishModal(open);
    if (!open) {
      history.push("/home");
      removeAuthToken();
    }
  };

  // const handleOtherTypes = (type) => {
  //   switch (type) {
  //     case "finishLater":
  //       // history.goBack();
  //       signDocument.current();
  //       // currentUser.userType != "INTERNAL" && removeAuthToken();
  //       break;
  //     case "decline":
  //       setVoidModalShow(true);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handleContinue = () => {
    // if (otherActions.type) {
    //   // handleOtherTypes(otherActions.type);
    // } else
    if (!askPermission) {
      setAskPermission(true);
    } else if (permission) {
      setHasPermission(true);
      setAskPermission(false);
      // signDocument.current();
    }
  };
  const handleSubmit = (finishLater) => {
    // if (otherActions.type) {
    //   // handleOtherTypes(otherActions.type);
    // } else {
    signDocument.current(finishLater);
    // }
  };
  const handleActions = (type, label) => {
    if (type === "viewHistory") {
      setViewHistory(true);
    } else if (type === "viewCertificate") {
      setViewCertModal(true);
    } else if (type === "finishLater") {
      handleSubmit(type === "finishLater");
      // history.goBack();
      // currentUser.userType != "INTERNAL" && removeAuthToken();
    } else if (type === "decline") {
      setVoidConfirm(true);
    } else if (type === "downloadSignedFile") {
      FileAttachmentService.downloadSignedFile(
        docData.fileId,
        docData.email,
        docData.signedFileName,
        undefined
      );
    }
    setOtherActions({ type, label });
  };

  useEffect(() => {
    return () => {
      !getUID() && removeAuthToken();
    };
  }, []);

  const getElectronicRecordDoc = () => {
    ESignatureServices.getElectronicRecond().then((res) => {
      if (res && res?.data?.content) {
        setElectronicContent(res.data.content);
        showElectronicModal(true);
      }
    });
  }

  return (
    <div className="overview-modal">
      {electronicModal && <ElectronicRecordModal content={electronicContent} onHide={() => showElectronicModal(false)} />}
      {!userVerified ? (
        <VerifyPage setUserVerified={setUserVerified} fileData={docData} />
      ) : (
        <div
          className={`modal-fullscreen ${
            !hasPermission &&
            docData.status !== "COMPLETED" &&
            docData.status !== "WAITING_FOR_OTHERS" &&
            docData.status !== "VOIDED"
              ? "overlay-content"
              : ""
          }`}
        >
          <div className="modal-content">
            <div className="modal-body m-b-100">
              {!hasPermission ? (
                docData.status === "COMPLETED" ||
                docData.status === "WAITING_FOR_OTHERS" ? (
                  <span />
                ) : docData.status === "VOIDED" ? (
                  <Body>
                    <Wrapper>
                      <Content>
                        <b className="subject">
                          {t("esign.modal:void.heading")}
                        </b>
                        <div className="message">
                          <PostContentView
                            content={t("esign.modal:void.by", {
                              name: docData.voidedBy
                                ? docData.voidedBy
                                : "Some one",
                            })}
                          />
                          <PostContentView content={docData.voidReason ?? ""} />
                        </div>
                      </Content>
                    </Wrapper>
                  </Body>
                ) : (
                  <Body>
                    <Wrapper>
                      <SenderInfo>
                        {t("esign.modal:message", {
                          creatorName: docData?.creatorName ?? "",
                          creatorEmail: docData?.creatorEmail
                            ? ` (${docData.creatorEmail})`
                            : "",
                        })}
                      </SenderInfo>
                      <Content>
                        <b className="subject">{docData?.subjectName ?? ""}</b>
                        <div className="message">
                          <PostContentView content={docData?.message ?? ""} />
                        </div>
                      </Content>
                    </Wrapper>
                  </Body>
                )
              ) : (
                <></>
              )}
              <Actions addBorder={!hasPermission}>
                <div className="flex-between">
                  {docData.status === "COMPLETED" ? (
                    <div className="message">{t("sign.completed.message")}</div>
                  ) : docData.status === "VOIDED" ? (
                    <div className="message">{t("sign.void.message")}</div>
                  ) : askPermission ? (
                    <div className="message">
                      <div className="custom-radio">
                        <input
                          type={"radio"}
                          id="permission"
                          name="permission"
                          checked={permission}
                          onChange={(e) => setPermission(true)}
                        />
                        <label htmlFor="permission">
                          {t("permission.message")}
                        </label>
                        <label>
                          <a onClick={getElectronicRecordDoc} className="permission-link">
                            {t("permission.message.link")}
                          </a>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="message">{t("review.message")}</div>
                  )}
                  <div className="flex-between">
                    <Dropdown>
                      <Dropdown.Toggle
                        id="dropdown-basic"
                        style={dropDownButtonStyle}
                        className="ddp-esign"
                      >
                        {otherActions.label} 
                        <span className="custom-caret">
                        <svg width="14" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M6.9971 9.94463L11.7777 5.16406L12.3276 5.71403L7.27208 10.7696H6.72211L1.66655 5.71403L2.21653 5.16406L6.9971 9.94463Z" fill="black" fill-opacity="0.4"/>
                        </svg>
                        </span>

                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {docData.status === "COMPLETED" && (
                          <Dropdown.Item
                            onClick={() =>
                              handleActions(
                                "downloadSignedFile",
                                t("download.signed.file")
                              )
                            }
                          >
                            {t("download.signed.file")}
                          </Dropdown.Item>
                        )}
                        {docData.status !== "COMPLETED" &&
                          docData.status !== "WAITING_FOR_OTHERS" &&
                          docData.status !== "VOIDED" && (
                            <Dropdown.Item
                              onClick={() =>
                                handleActions(
                                  null,
                                  t("esign.modal:other.actions")
                                )
                              }
                            >
                              {t("esign.modal:other.actions")}
                            </Dropdown.Item>
                          )}
                        {docData.status !== "COMPLETED" &&
                        docData.status !== "WAITING_FOR_OTHERS" &&
                        docData.status !== "VOIDED" &&
                        !docData?.isDocCopyReceiver ? (
                          <>
                            <Dropdown.Item
                              onClick={() =>
                                handleActions("finishLater", t("finish.later"))
                              }
                            >
                              {t("finish.later")}
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleActions("decline", t("decline.to.sign"))
                              }
                            >
                              {t("decline.to.sign")}
                            </Dropdown.Item>
                          </>
                        ) : (
                          <></>
                        )}
                        <Dropdown.Item
                          onClick={() =>
                            handleActions("viewHistory", t("view.history"))
                          }
                        >
                          {t("view.history")}
                        </Dropdown.Item>
                        <Dropdown.Item
                          disabled={docData.status !== "COMPLETED"}
                          onClick={
                            docData.status !== "COMPLETED"
                              ? undefined
                              : () =>
                                  handleActions(
                                    "viewCertificate",
                                    t("view.certificate(PDF)")
                                  )
                          }
                        >
                          {t("view.certificate(PDF)")}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* {askPermission ? ( */}

                    {docData.status === "COMPLETED" ||
                    docData.status === "WAITING_FOR_OTHERS" ||
                    docData.status === "VOIDED" ? (
                      <Button
                        className="btn finish-btn"
                        type="button"
                        onClick={() => redirectToHomePage(false)}
                      >
                        {t("document.sign.modal:close")}
                      </Button>
                    ) : hasPermission ? (
                      <Button
                        className="btn finish-btn"
                        type="button"
                        onClick={handleSubmit}
                      >
                        {/* {t("document.sign.modal:finish")} */}
                        {t("document.sign.modal:continue")}
                      </Button>
                    ) : (
                      <Button
                        className="btn continue-btn"
                        type="button"
                        onClick={handleContinue}
                      >
                        {t("document.sign.modal:continue")}
                        {/* {askPermission
                          ? t("document.sign.modal:agree")
                          : t("document.sign.modal:continue")} */}
                      </Button>
                    )}
                  </div>
                </div>
              </Actions>
              <SignDocument
                isReadOnly={
                  !hasPermission &&
                  docData.status !== "COMPLETED" &&
                  docData.status !== "WAITING_FOR_OTHERS" &&
                  docData.status !== "VOIDED"
                }
                signRef={signDocument}
                handleFinish={handelFinishModal}
                // setShow={setShow}
              ></SignDocument>
            </div>
          </div>
          <Modal className={"finishModal"} show={finishModal}>
            {/* <Modal.Header>
              <Modal.Title>
                <img src={logo} alt="" />
              </Modal.Title>
            </Modal.Header> */}
            <Modal.Body>
              <Row>
                <Col xs={12} className="cong-large-text">
                  {otherActions.type === "finishLater"
                    ? t("document.sign.modal:finsih.later")
                    : t("document.sign.modal:all.done")}
                </Col>
                <Col xs={12} className="cong-text">
                  {otherActions.type === "finishLater"
                    ? t("document.sign.modal:come.back") 
                    : t("document.sign.modal:recive.copy")}
                </Col>
              </Row>
              <Row>
                <Col xs={12} className="w-100 text-center">
                  {currentUser.userType !== "INTERNAL" ? (
                    <Button
                      className="btn cong-btn"
                      type="button"
                      onClick={() => redirectToHomePage(false)}
                    >
                      {t("document.sign.modal:recive.copy")}
                    </Button>
                  ) : (
                    <Button
                      className="btn cong-btn"
                      type="button"
                      onClick={() => {
                        handelFinishModal(false);
                      }}
                    >
                      {t("document.sign.modal:ok")}
                    </Button>
                  )}
                </Col>
                {currentUser.userType !== "INTERNAL" ? (
                  <Col
                    xs={12}
                    className={"cong-sign-in"}
                    onClick={() => redirectToHomePage(false)}
                  >
                    {t("document.sign.modal:signin")}
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            </Modal.Body>
          </Modal>
          {viewHistory && (
            <HistoryModal onModalHide={() => setViewHistory(false)} />
          )}
          {/* <ViewHistory
            show={viewHistory}
            esignSummaryData={docData}
            onModalHide={() => setViewHistory(false)}
          /> */}
          <DocumentViewerModal
            lgShow={viewCertModal}
            setLgShow={() => setViewCertModal(false)}
            fileInfo={docData}
            fileId={docData?.fileId}
            progressValue={progressValue}
            setProgress={setProgressValue}
            // Progress={Progress}
            setShowRemoveModal={() => setViewCertModal(false)}
            currentChannelId={null}
            postId={null}
            certificateId={docData?.certificateId}
            docType="certificate-view"
          />
          {voidModalShow && (
            <VoidESignatureModal
              onModalHide={() => setVoidModalShow(false)}
              esignSummaryData={docData}
              isSigning={true}
            />
          )}
          {voidConfirm && (
            <VoidConfirmationModal
              onModalHide={() => setVoidConfirm(false)}
              onClick={() => {
                setVoidModalShow(true);
                setVoidConfirm(false);
              }}
            />
          )}
        </div>
      )}
      {/* {electronicModal && <ScrollComponent
                fileId={props.fileId}
                fileInfo={props.fileInfo}
                channelId={props.currentChannelId}
                postId={props.postId}
                folderId={props.folderId}
                fromFolder={props.fromFolder}
                viewType={props.docType}
                certificateId={props.certificateId}
              />} */}
    </div>
  );
};

export default SignDocumentModal;
