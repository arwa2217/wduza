import React, { useState, useEffect, useRef } from "react";
import "./e-signature-summary.css";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import recipientImage from "../../../assets/icons/v2/ted-profile.svg";
import File from "../file/file";
import { useDispatch, useSelector } from "react-redux";
import { SignatureState } from "../constants";
import VoidESignatureModal from "../../modal/e-signature-modal/void-esignature-modal";
import DocumentViewerModal from "../../post-view/post-msg-view/document-viewer-modal";
import { useTranslation } from "react-i18next";
import Popover from "@material-ui/core/Popover";
import Moment from "moment";
import helpImage from "../../../assets/icons/v2/ic_help.svg";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import DisplayPrivateMessageModal from "../private-message/display-private-message";
import PrivateMessageModal from "../private-message/private-message-modal";

const backgroundImgColors = [
  "#7AC448",
  "#518BDC",
  "#7579CF",
  "linear-gradient(135deg, #009099 0%, #8AFB7F 100%)",
  "linear-gradient(135deg, #136BAA 0%, #7EF5EE 100%)",
];

const randomIndexColor = (name) => {
  // get first alphabet in upper case
  if (name) {
    const firstAlphabet = name.charAt(0).toLowerCase();
    const asciiCode = firstAlphabet.charCodeAt(0);
    return asciiCode % 5;
  } else return Math.floor((Math.random() * 5) % 5);
};

function ESignatureSummary(props) {
  const { t } = useTranslation();
  const signatureState = useSelector(
    (state) => state.esignatureReducer.signatureState
  );
  const esignSummaryRecipientList = useSelector(
    (state) => state.esignatureReducer.esignatureSummaryRecipients
  );
  console.log("esignSummaryRecipientList", esignSummaryRecipientList);
  const esignSummaryRecipientListSend = useSelector(
    (state) => state.esignatureReducer.recipientList
  );

  const esignSummaryHistory = useSelector(
    (state) => state.esignatureReducer.esignatureSummaryHistory
  );
  const selectedEsignature = useSelector(
    (state) => state.esignatureReducer.selectedEsignRows
  );
  const esignSummaryData = useSelector(
    (state) => state.esignatureReducer.esignatureSummaryData
  );
  const memberData = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const docType = useRef(null);
  useEffect(() => {
    try {
      esignSummaryRecipientList.map((recipient) => {
        recipient.img = memberData.find(
          (member) => member.id === recipient.userId
        ).userImg;
        return recipient;
      });
      esignSummaryRecipientListSend.map((recipient) => {
        recipient.img = memberData.find(
          (member) => member.id === recipient.userId
        ).userImg;
        return recipient;
      });
      setIsUpdated(Math.random());
    } catch (e) {}
  }, [esignSummaryRecipientList, esignSummaryRecipientListSend, memberData]);

  const [reviewModalShow, setReviewModalShow] = useState(false);
  const [isOpenPrivateMsg, setIsOpenPrivateMsg] = useState(false);
  const [isOpenDispalyPrivateMsg, setIsOpenDispalyPrivateMsg] = useState(false);
  const [viewCertModal, setViewCertModal] = useState(false);
  const [senderEmail, setSenderEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [privateMessage, setPrivateMessage] = useState("");
  const [openDocumentId, setOpenDocumentId] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(0);
  const handleClose = () => {
    setReviewModalShow(false);
  };
  const handleOpen = () => {
    setReviewModalShow(true);
  };
  const handlePrivateMsgClose = () => {
    setIsOpenPrivateMsg(false);
  };
  const handlePrivatemsgClose = () => {
    setIsOpenDispalyPrivateMsg(false);
  };
  const handleViewCertificate = () => {
    docType.current = "certificate-view";
    setViewCertModal(!viewCertModal);
  };
  const handleReviewDocument = () => {
    docType.current = "document-review";
    setViewCertModal(!viewCertModal);
  };

  const getFileType = () => {
    let defaultType;
    const fTypeStr = props?.file?.type;
    if (fTypeStr) {
      const fTypeCollection = fTypeStr.split("/");
      const fType = fTypeCollection[1];
      defaultType = fType.toUpperCase();
    }
    return defaultType;
  };

  function setPrivateMessageModal(data) {
    let dataString = "";
    Object.keys(data).map(
      (key) => (dataString += key + " " + data[key] + " || ")
    );
  }
  return (
    <Container className="mon-custom-scrollbar esign-summary-container">
      {console.log("props?.file ", props?.file)}
      {props?.file ? (
        <File
          fileType={getFileType()}
          fileName={props?.file?.name}
          fileSize={props?.file?.size}
          edit={() => console.log("test")}
          fileDetails={props?.file}
        />
      ) : (
        ""
      )}
      {(signatureState === SignatureState.REVIEW_SEND ||
        selectedEsignature?.length > 0) && (
        <Col className="px-0">
          {signatureState === SignatureState.DEFAULT && (
            <>
              <Col className="pl-0 pr-0">
                <div className="esignature-summary-head">
                  <div className="d-flex flex-column">
                    <p className="esignature-title">
                      {esignSummaryData?.title ?? ""}
                    </p>
                    <p className="d-flex align-items-center esignature-title-sub">
                      {esignSummaryData?.status
                        ?.toLowerCase()
                        .split("_")
                        .join(" ")
                        .replace(/^\w/, (c) => c.toUpperCase()) ?? ""}

                      {esignSummaryData?.status === "VOIDED" && (
                        <OverlayTrigger
                          placement="bottom"
                          delay={{ show: 150, hide: 100 }}
                          trigger={["hover", "focus"]}
                          overlay={
                            <Tooltip>
                              {esignSummaryData?.voidReason ?? t("text.na")}
                            </Tooltip>
                          }
                        >
                          <img
                            src={helpImage}
                            alt="update"
                            style={{ marginLeft: "5px" }}
                          />
                        </OverlayTrigger>
                      )}
                    </p>
                  </div>

                  <p
                    aria-describedby="esignature-document-id"
                    className="esignature-document-id"
                    onMouseEnter={(e) => {
                      e.preventDefault();
                      setOpenDocumentId(true);
                      setAnchorEl(e.currentTarget);
                    }}
                    onMouseLeave={(e) => {
                      setTimeout(() => {
                        if (openDocumentId) {
                          setOpenDocumentId(false);
                          setAnchorEl(null);
                        }
                      }, 3000);
                    }}
                  >
                    {t("esign.summary:document.id")}
                  </p>
                </div>
              </Col>
              <Popover
                id="esignature-document-id"
                open={openDocumentId}
                anchorEl={anchorEl}
                onClose={(event) => {
                  setOpenDocumentId(false);
                  setAnchorEl(null);
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div className="esignature-document-details">
                  <p className="esignature-document-label">
                    {t("esign.summary:document.id")}
                  </p>
                  <p className="esignature-document-code">
                    {esignSummaryData?.documentId}
                  </p>
                </div>
              </Popover>
              <hr className="mt-0 mb-12px" />
              <Col className="pl-0 pr-0">
                <div className="esignature-summary-details">
                  <Row
                    className="ml-0 mr-0"
                    style={{ justifyContent: "space-between" }}
                  >
                    <p className="esignature-summary-name">
                      {esignSummaryData?.creatorName ?? ""}
                    </p>
                    <Badge
                      pill
                      bg="success"
                      className="esign-badge"
                      style={{ marginRight: "0" }}
                    >
                      {esignSummaryData?.creatorType
                        ?.toLowerCase()
                        .split("_")
                        .join(" ")
                        .replace(/^\w/, (c) => c.toUpperCase()) ?? ""}
                    </Badge>
                  </Row>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:last.change.on")}
                    </p>
                    <p className="esignature-summary-sub">
                      {t("timeline.header", {
                        time: esignSummaryData?.updatedAt,
                      })}
                      <span className="date-time-separator"></span>
                      <span style={{ color: "#00000080" }}>
                        {t("postTime-childUpper", {
                          time: esignSummaryData?.sentAt,
                        })}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:sent.on")}
                    </p>
                    <p className="esignature-summary-sub">
                      {t("timeline.header", {
                        time: esignSummaryData?.sentAt,
                      })}
                      <span className="date-time-separator"></span>
                      <span style={{ color: "#00000080" }}>
                        {t("postTime-childUpper", {
                          time: esignSummaryData?.sentAt,
                        })}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:source")}
                    </p>
                    <p className="esignature-summary-sub">
                      {esignSummaryData?.source ?? t("text.na")}
                    </p>
                  </div>
                </div>
                <Row className="ml-0 mr-0">
                  <Button
                    className="btn-class ml-0"
                    onClick={handleReviewDocument}
                    disabled={
                      esignSummaryData?.status === "DELETED" ? true : false
                    }
                  >
                    {t("esign.summary:review.document")}
                  </Button>
                  <>
                    <Button
                      className="btn-class"
                      onClick={handleViewCertificate}
                      disabled={
                        esignSummaryData?.status !== "COMPLETED" ? true : false
                      }
                    >
                      {t("esign.summary:view.cert")}
                    </Button>
                    <DocumentViewerModal
                      lgShow={viewCertModal}
                      setLgShow={() => setViewCertModal(false)}
                      fileInfo={esignSummaryData}
                      fileId={esignSummaryData?.fileId}
                      progressValue={progressValue}
                      setProgress={setProgressValue}
                      // Progress={Progress}
                      setShowRemoveModal={setShowRemoveModal}
                      currentChannelId={null}
                      postId={null}
                      certificateId={esignSummaryData?.certificateId}
                      docType={docType.current}
                      currentUser={currentUser}
                    />
                  </>
                </Row>
                {reviewModalShow && (
                  <VoidESignatureModal
                    onModalHide={handleClose}
                    esignSummaryData={esignSummaryData}
                  />
                )}
              </Col>
            </>
          )}
          {/* {signatureState !== SignatureState.RECIPIENT && (
            <hr className="mt-12px mb-12px" />
          )} */}
          {signatureState !== SignatureState.RECIPIENT && (
            <Col
              className="pl-0 pr-0 recipients"
              style={{ paddingTop: "28px" }}
            >
              <div className="esignature-summary-recipients">
                <p className="esignature-document-recipients-header">
                  {t("esign.summary:recipients")}
                </p>
              </div>
              {signatureState === SignatureState.REVIEW_SEND && (
                <>
                  {esignSummaryRecipientListSend.map((recipients, index) => {
                    return (
                      <>
                        <Row
                          className="ml-0 mr-0 recipient-details"
                          onClick={
                            signatureState === SignatureState.REVIEW_SEND
                              ? () => setPrivateMessageModal(recipients)
                              : undefined
                          }
                        >
                          <Col xs="auto" className="pl-0 pr-0">
                            {recipients.img ? (
                              <img
                                src={recipients.img}
                                height="32px"
                                alt="img"
                                style={{ "border-radius": "32px" }}
                              />
                            ) : (
                              <div
                                key={index}
                                className={"discussion-avatar-item-image"}
                                style={{
                                  background: `${
                                    backgroundImgColors[
                                      randomIndexColor(recipients.name)
                                    ]
                                  }`,
                                  height: "32px",
                                  width: "32px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: "500",
                                  color: "#FFFFFF",
                                  borderRadius: "32px",
                                }}
                              >
                                <span>
                                  {recipients.name
                                    ? recipients.name
                                        .split(" ")[0]
                                        .charAt(0)
                                        .toUpperCase()
                                    : ""}
                                </span>
                              </div>
                            )}
                          </Col>
                          <Col className="pl-12px pr-0">
                            <Row
                              className={`summary-recipient-border ml-0 mr-0`}
                            >
                              <Col className="pl-0 pr-0">
                                <div>
                                  <p className="mb-0 recipient-name">
                                    {recipients?.name ?? t("text.na")}
                                  </p>
                                  <p className=" mb-0 recipient-text">
                                    {recipients?.email ?? t("text.na")}
                                  </p>
                                  <p className="recipient-text-status mb-0">
                                    {recipients.signNeeded
                                      ? t("esign:recipients:need.sign")
                                      : t("esign:recipients:receives.copy")}
                                  </p>
                                  <button
                                    onClick={() => {
                                      setIsOpenPrivateMsg(true);
                                      setSenderEmail(recipients?.email);
                                      setSenderName(recipients?.name);
                                    }}
                                    className="private-msg-btn"
                                  >
                                    Private Message
                                  </button>
                                  {recipients.verificationMode === "sms" && (
                                    <p
                                      className=" mb-0 recipient-text"
                                      style={{
                                        fontSize: "11px",
                                        lineHeight: "15px",
                                        marginTop: "4px",
                                      }}
                                    >
                                      {`${t("esign:recipients:sms")} : ${
                                        recipients.mobile
                                      }`}
                                    </p>
                                  )}
                                  {recipients.verificationMode ===
                                    "passcode" && (
                                    <p
                                      className=" mb-0 recipient-text"
                                      style={{
                                        fontSize: "11px",
                                        lineHeight: "15px",
                                        marginTop: "4px",
                                      }}
                                    >
                                      {`${t("esign:recipients:passcode")} : ${
                                        recipients.password
                                      }`}
                                    </p>
                                  )}
                                </div>
                              </Col>
                              <Col xs="auto" className="pl-0 pr-0">
                                <Badge
                                  pill
                                  bg="success"
                                  className="esign-badge mr-0"
                                >
                                  {recipients?.userType
                                    ?.toLowerCase()
                                    .split("_")
                                    .join(" ")
                                    .replace(/^\w/, (c) => c.toUpperCase()) ??
                                    t("text.na")}
                                </Badge>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    );
                  })}

                  <div className="ml-0 mr-0 recipient-details row">
                    <span
                      style={{
                        paddingLeft: "43px",
                        fontSize: "12px",
                        lineHeight: "16px",
                        color: "#00000080",
                        fontWeight: 400,
                      }}
                    >
                      Once the envelope is completed, all recipients will
                      receive a copy of the completed envelope.
                    </span>
                  </div>
                </>
              )}
              {signatureState !== SignatureState.REVIEW_SEND &&
                esignSummaryRecipientList.map((recipients, index) => {
                  return (
                    <>
                      <Row className="ml-0 mr-0 recipient-details">
                        <Col xs="auto" className="pl-0 pr-0">
                          {recipients.img ? (
                            <img
                              src={recipients.img}
                              style={{ borderRadius: "50%" }}
                              height="32px"
                              alt="img"
                            />
                          ) : (
                            <div
                              key={index}
                              className={"discussion-avatar-item-image"}
                              style={{
                                borderRadius: "50%",
                                background: `${
                                  backgroundImgColors[
                                    randomIndexColor(recipients.name)
                                  ]
                                }`,
                                height: "32px",
                                width: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "500",
                                color: "#FFFFFF",
                                borderRadius: "32px",
                              }}
                            >
                              <span>
                                {recipients.name
                                  ? recipients.name
                                      .split(" ")[0]
                                      .charAt(0)
                                      .toUpperCase()
                                  : ""}
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col className="pl-12px pr-0">
                          <Row className={`summary-recipient-border ml-0 mr-0`}>
                            <Col className="pl-0 pr-0">
                              <div>
                                <p className="mb-0 recipient-name">
                                  {recipients?.name ?? t("text.na")}
                                </p>
                                <p className=" mb-0 recipient-text">
                                  {recipients?.email ?? t("text.na")}
                                </p>
                                <p className="recipient-text-status">
                                  {signatureState !==
                                    SignatureState.REVIEW_SEND &&
                                    recipients?.status
                                      ?.toLowerCase()
                                      .split("_")
                                      .join(" ")
                                      .replace(/^\w/, (c) => c.toUpperCase())}
                                </p>
                                <button
                                  onClick={() => {
                                    setIsOpenDispalyPrivateMsg(true);
                                    setPrivateMessage(recipients?.privateMsg);
                                    setSenderEmail(recipients?.email);
                                  }}
                                  className="private-msg-btn"
                                >
                                  Private Message
                                </button>
                              </div>
                            </Col>
                            <Col xs="auto" className="pl-0 pr-0">
                              <Badge
                                pill
                                bg="success"
                                className="esign-badge mr-0"
                              >
                                {recipients?.userType
                                  ?.toLowerCase()
                                  .split("_")
                                  .join(" ")
                                  .replace(/^\w/, (c) => c.toUpperCase()) ??
                                  t("text.na")}
                              </Badge>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  );
                })}
            </Col>
          )}
          {signatureState === SignatureState.DEFAULT && (
            <>
              <hr className="mt-12px mb-12px" />
              <Col className="pl-0 pr-0">
                <div className="esignature-summary-details pl-0 pr-0">
                  <p className="esignature-document-recipients-header">
                    {t("esign.summary:message")}
                  </p>
                  <p
                    className="recipient-text"
                    style={
                      esignSummaryData.message &&
                      esignSummaryData.message !== ""
                        ? { color: "#000000B2" }
                        : { color: "#000000B2", opacity: "0.4" }
                    }
                  >
                    {esignSummaryData?.message &&
                    esignSummaryData.message !== ""
                      ? esignSummaryData.message
                      : t("esign.summary:no.message")}
                  </p>
                </div>
              </Col>
              {/* <hr className="mt-12px mb-12px" />
              <Col className="pl-0 pr-0">
                <div className="esignature-summary-details pl-0 pr-0">
                  <p className="esignature-document-recipients-header">
                    {t("esign.summary:history")}
                  </p>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:last.change.on")}
                    </p>
                    <p className="esignature-summary-sub">
                      {t("timeline.header", {
                        time: esignSummaryData?.updatedAt,
                      })}
                      <span className="date-time-separator"></span>
                      <span style={{ color: "#00000080" }}>
                        {t("postTime-childUpper", {
                          time: esignSummaryData?.updatedAt,
                        })}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:sent.on")}
                    </p>
                    <p className="esignature-summary-sub">
                      {t("timeline.header", {
                        time: esignSummaryData?.sentAt,
                      })}
                      <span className="date-time-separator"></span>
                      <span style={{ color: "#00000080" }}>
                      {t("postTime-childUpper", {
                        time: esignSummaryData?.sentAt,
                      })}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="esignature-title-sub mb-0">
                      {t("esign.summary:source")}
                    </p>
                    <p className="esignature-summary-sub">
                      {esignSummaryData?.source ?? t("text.na")}
                    </p>
                  </div>
                </div>
              </Col> */}
            </>
          )}
        </Col>
      )}
      {isOpenDispalyPrivateMsg && (
        <DisplayPrivateMessageModal
          privateMsg={privateMessage}
          isOpen={isOpenDispalyPrivateMsg}
          handlePrivatemsgClose={handlePrivatemsgClose}
        />
      )}
      {isOpenPrivateMsg && (
        <PrivateMessageModal
          fileId={esignSummaryData?.fileId}
          senderEmail={senderEmail}
          senderName={senderName}
          handleClose={handlePrivateMsgClose}
        />
      )}
    </Container>
  );
}

export default ESignatureSummary;
