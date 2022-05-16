import React, { useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useDispatch, useSelector } from "react-redux";
import { postEmailType } from "../../outlook/config";
import OutlookMailDetails from "../outlook-mail-details/outlook-mail-details";
import OutlookMailHead from "./outlook-mail-head";
import OutLookMailHeadTop from "./outlook-mail-head-top";
import OutLookMailDetailsHeadTop from "./outlook-mail-details-head-top";
import OutlookMailItem from "./outlook-mail-item";
import "./outlook-mail.css";
import { Snackbar } from "@material-ui/core";
import OutLookMailPost from "../outlook-mail-post/outlook-mail-post";
import OutlookWriteMail from "./outlook-mail-write-email";
import {
  setAttachmentsList,
  setConversationData,
  setOpenWriteEmailModalPopup,
  setIsBottomAnchorScroll,
  setPostEmailType,
  setRefreshData,
  setSendEmailType,
  setNewEmailReplyList,
} from "../../store/actions/outlook-mail-actions";

import { Alert } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import services from "../../outlook/apiService";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import SendEmail from "../../assets/icons/new-email.svg";
import {
  autoRefreshConversationTime,
  autoRefreshTime,
  showNotification,
} from "../../utilities/outlook";
import OutLookLoading from "../outlook-shared/OutLookLoading";

const OutlookMailTab = () => {
  const id = useSelector((state) => state.OutlookMailReducer?.id);
  const [loading, setLoading] = useState(false);
  const bottomAnchor = useRef(null);
  const [mailConversation, setMailConversation] = useState([]);
  const [nextLink, setNextLink] = useState("");
  const isRefresh = useSelector((state) => state.OutlookMailReducer.isRefresh);
  const postEmailTypeReducer = useSelector(
    (state) => state.OutlookMailReducer.postEmailType
  );
  const isBottomAnchorScroll = useSelector(
    (state) => state.OutlookMailReducer.isBottomAnchorScroll
  );
  const dispatch = useDispatch();
  const isSummary = useSelector((state) => state.MailSummaryReducer?.isSummary);
  const isWriteEmail = useSelector(
    (state) => state.OutlookMailReducer.isWriteEmail
  );
  const currentMailFolder = useSelector(
    (state) => state.OutlookMailReducer.currentMailFolder
  );
  const activeEmail = useSelector(
    (state) => state.OutLookMailReducer?.activeEmail
  );
  const { t } = useTranslation();
  const getConversationInfo = async () => {
    if (id !== "") {
      try {
        setLoading(true);
        const result = await services.getConversation(id, "", "");
        let listEmails = result.value;
        const newNextLink = result["@odata.nextLink"]
          ? result["@odata.nextLink"]
          : "";
        setNextLink(newNextLink);
        setMailConversation(listEmails);
      } catch (e) {}
    }
  };

  useEffect(() => {
    setMailConversation([]);
    setNextLink("");
    dispatch(setAttachmentsList({}));
    getConversationInfo();
    dispatch(setRefreshData(false));
  }, [isRefresh, id]);
  // auto refresh
  const refreshConversation = async (conversationId) => {
    const result = await services.autoRefreshConversation(conversationId);
    const newEmail = result.value.filter(
      ({ id: id1 }) => !mailConversation.some(({ id: id2 }) => id2 === id1)
    );
    if (newEmail.length > 0) {
      const emailsAdd = newEmail.filter((item) => !item.isDraft);
      const newEmailList = mailConversation.concat(emailsAdd);
      // localStorage.setItem('EMAIL_LIST',JSON.stringify(newEmailList))
      setMailConversation(newEmailList);
      dispatch(setNewEmailReplyList(emailsAdd));
      showNotification(emailsAdd, "reply");
    }
  };
  useEffect(() => {
    if (
      id !== "" &&
      mailConversation &&
      mailConversation.length > 0 &&
      currentMailFolder === "inbox"
    ) {
      const interval = setInterval(() => {
        refreshConversation(id);
      }, autoRefreshConversationTime);
      return () => clearInterval(interval);
    }
  }, [id, mailConversation, currentMailFolder]);
  useEffect(() => {
    if (nextLink !== "" && mailConversation.length > 0) {
      handleLoadMore(nextLink);
    } else {
      setLoading(false);
      bottomAnchor?.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [nextLink, mailConversation]);
  const handleLoadMore = async (nextLink) => {
    await services.getConversation(id, nextLink, "").then((response) => {
      const newNextLink = response["@odata.nextLink"]
        ? response["@odata.nextLink"]
        : "";
      setNextLink(newNextLink);
      const newConversation = mailConversation.concat(response.value);
      setMailConversation(newConversation);
    });
  };
  const setHeight = () => {
    return "calc(100vh - var(--message-list-header-height) - var(--message-list-top-bar-height) - var(--message-list-bottom-margin) - 5px)";
  };
  const sendEmailType = useSelector(
    (state) => state.OutlookMailReducer.sendEmailType
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sendEmailType) {
      setOpen(
        sendEmailType === "SEND_EMAIL" || sendEmailType === "SEND_DRAFT_EMAIL"
      );
      dispatch(setSendEmailType(""));
    }
  }, [sendEmailType]);
  useEffect(() => {
    if (mailConversation.length > 0) {
      dispatch(
        setConversationData(
          mailConversation.filter(
            (conversation) => conversation.isDraft !== true
          )
        )
      );
    }
  }, [mailConversation]);
  useEffect(() => {
    if (isBottomAnchorScroll) {
      bottomAnchor?.current?.scrollIntoView({
        behavior: "smooth",
      });
      dispatch(setIsBottomAnchorScroll(false));
    }
  }, [isBottomAnchorScroll]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  let isEnable = false;

  const handleDragElement = (element) => {
    element.style.display = "flex";
    dispatch(setOpenWriteEmailModalPopup(true));
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(element.id + "-header")) {
      /* if present, the header is where you move the DIV from:*/
      document.getElementById(element.id + "-header").onmousedown =
        dragMouseDown;
    } else {
      /* otherwise, move the DIV from anywhere inside the DIV:*/
      element.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = dragElement;
    }

    function dragElement(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      /* stop moving when mouse button is released:*/
      document.onmouseup = null;
      document.onmousemove = null;
    }
  };
  const handleOpenWriteEmailModal = () => {
    dispatch(setPostEmailType(postEmailType.newEmailInPopup));
    handleDragElement(document.getElementById("write-email-modal"));
    // setEditorFocus(postEmailType.newEmail);
  };
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        style={{ top: "10px" }}
        // key={"top" + "center"}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {t("outlook.mail:sendmail.success")}
        </Alert>
      </Snackbar>
      <div
        className="d-flex flex-column w-100"
        style={{ position: "relative" }}
        onMouseUp={(e) => {
          if (isEnable) {
            isEnable = false;
            e.stopPropagation();
            e.preventDefault();
          }
          return false;
        }}
        onMouseMove={(e) => {
          if (isEnable) {
            let pos = e.clientX;
            let min = window.innerWidth / 2;
            let max = window.innerWidth - 250;
            if (pos > min && pos < max) {
              document.getElementById("right-details").style.width =
                window.innerWidth - pos + "px";
              // document.getElementById("left-messagetab").style.width =
              //   window.innerWidth - (window.innerWidth - pos) + "px";
            }
          }
        }}
      >
        <Row className="m-0">
          <Col className="outlook-mail-tab">
            <Row className="m-0">
              <OutLookMailHeadTop />
              {mailConversation && mailConversation.length > 0 ? (
                <Col
                  className="mail-head-wrap-bg p-0"
                  style={{
                    backgroundColor: [postEmailType.newEmail].includes(
                      postEmailTypeReducer
                    )
                      ? "white"
                      : "#F8F8F8",
                  }}
                >
                  {![
                    postEmailType.newEmail,
                    postEmailType.editDraftEmail,
                  ].includes(postEmailTypeReducer) ? (
                    <div className="wrapper-body">
                      <div className="wrapper-conversation">
                        <>
                          <Col xs={12} className="mail-head-wrap">
                            <OutlookMailHead
                              subject={
                                mailConversation &&
                                mailConversation.length > 0 &&
                                mailConversation[mailConversation?.length - 1]
                                  .subject
                              }
                              mailConversationCount={mailConversation?.length}
                            />
                          </Col>
                          <Col
                            xs={12}
                            className={"px-0 h-100 position-relative"}
                            style={{
                              backgroundColor: "#F8F8F8",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              id="mail-body-scroll"
                              className="mail-body-scroll"
                              style={{
                                height: "auto",
                                overflowY: "auto",
                                overflowX: "hidden",
                              }}
                            >
                              {mailConversation?.map((item, index) => (
                                <OutlookMailItem
                                  key={index}
                                  mailItem={item}
                                  mailIndex={index}
                                  mailConversation={mailConversation}
                                />
                              ))}
                              <div ref={bottomAnchor} />
                            </div>
                            {[
                              postEmailType.reply,
                              postEmailType.replyAll,
                              postEmailType.forward,
                            ].includes(postEmailTypeReducer) && (
                              <OutLookMailPost />
                            )}
                          </Col>
                        </>
                      </div>
                    </div>
                  ) : (
                    <OutlookWriteMail />
                  )}
                </Col>
              ) : (
                <div className="d-flex mail-head-wrap-bg justify-content-center align-items-center bg-white">
                  <OutLookLoading />
                </div>
              )}
            </Row>
          </Col>
          <div
            onMouseDown={(e) => {
              if (!isEnable) {
                isEnable = true;
                e.stopPropagation();
                e.preventDefault();
              }
              return false;
            }}
          >
            <hr className="width-resize-details" />
          </div>
          {isSummary && (
            <Col id="right-details" className="detailsBar col-md-auto p-0 mr-0">
              <OutLookMailDetailsHeadTop />
              <OutlookMailDetails />
            </Col>
          )}
          {!isWriteEmail && (
            <OverlayTrigger
              placement="top"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={"write-new-email-modal-popup"}>
                  {t("outlook.mail.tooltip:write.mail")}
                </Tooltip>
              }
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.17)",
                  position: "absolute",
                  right: "20px",
                  bottom: "20px",
                  cursor: "pointer",
                }}
                onClick={handleOpenWriteEmailModal}
              >
                <img
                  src={SendEmail}
                  alt="send-email"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                />
              </div>
            </OverlayTrigger>
          )}
        </Row>
      </div>
    </>
  );
};

export default OutlookMailTab;
