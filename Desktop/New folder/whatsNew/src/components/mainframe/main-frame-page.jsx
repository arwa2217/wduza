import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SidebarPushable, SidebarPusher } from "semantic-ui-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./mainframe.css";
import SidePane from "../sidepane/sidepane";
import ModalRoot from "../modal/modal-root";
import ActivePanel from "../actionpanel/activePanel";
import {
  initializeWebSocket,
  closeWebSocket,
} from "../../store/actions/websocket-actions";
import UserActions, { GetProfile } from "../../store/actions/user-actions";
import { GetFileConfig } from "../../store/actions/config-actions";
import { fetchNotificationAction } from "../../store/actions/notification-action";
import {
  getAuthToken,
  getAuthTokenFromSessionStorage,
  setPushNotificationPermission,
  getPushNotificationPermission,
} from "../../utilities/app-preference";
import ErrorToast from "../error-toasts/error-toast";
import CommonUtils from "../utils/common-utils";
import Snackbar from "../modal/channel/snackbar";
import { useTranslation } from "react-i18next";
import { Detector } from "react-detect-offline";
import { NOTIFICATION_COUNT } from "../../constants";
import { fileStorageDetails } from "../../store/actions/files-actions";
import ActiveMenu from "../active-menu/active-menu";
//import OutLookMailPost from "../outlook-mail-post/outlook-mail-post";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import {
  setOpenWriteEmailModalPopup,
  setPostEmailType,
} from "../../store/actions/outlook-mail-actions";
import OutLookWriteEmailModalEditor from "../outlook-mail-post/outlook-write-email-modal-editor";
import { postEmailType } from "../../outlook/config";
import ExpandWriteEmailIcon from "../../assets/icons/expand-email-icon.svg";
import CollapseWriteEmailIcon from "../../assets/icons/expand-email-close.svg";
import CloseWriteEmailModal from "../../assets/icons/close-mail-modal-icon.svg";
import { DragDropContext } from "react-beautiful-dnd";
/*
 *User is redirected to this page post successful login
 */
let prevSelectedChannel;

function MainFrame() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const discussionListRef = useRef(null);
  const [isExtendMenu, setIsExtendMenu] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isProjectListEnabled, setIsProjectListEnabled] = useState(false);
  const [isDiscussionListEnabled, setIsDiscussionListEnabled] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 768);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fileConfig = useSelector((state) => state.config.fileConfig);
  const activeActionPanel = useSelector(
    (state) => state.config.activeActionPanel
  );
  const activeSelectedChannel = useSelector(
    (state) => state.config.activeSelectedChannel
  );
  const uid = useSelector((state) => state.AuthReducer.uid);
  const isWebSocketAvailable = useSelector(
    (state) => state.websocketReducer.isWebSocketAvailable
  );
  const companyName = useSelector(
    (state) => state.AuthReducer.user.companyName
  );
  const { toastShow, toastMessage, toastDelay, toastType } = useSelector(
    (state) => state.ToastReducer
  );
  const notificationList = useSelector(
    (state) => state.notificationReducer.notificationDetails
  );
  let unreadCount = useSelector(
    (state) => state.notificationReducer.unread_count
  );
  const isOpenWriteEmailModalPopup = useSelector(
    (state) => state.OutlookMailReducer?.isOpenWriteEmailModalPopup
  );
  const [collapseModalEmail, setCollapseModalEmail] = useState(false);
  const [refresh, doRefresh] = useState({});
  useEffect(() => {
    CommonUtils.setPageTitle(unreadCount, companyName);
  }, [notificationList, companyName, unreadCount]);

  const pageLoadCall = () => {
    if (profileLoading && uid) {
      dispatch(GetProfile(uid));
      setProfileLoading(false);
    }
  };

  const toggleMenu = (isExtend) => {
    const sidebar = document.getElementById("left-sidebar");
    if (isExtend) {
      sidebar.style.width = "240px";
      sidebar.style.transition = "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms";
    } else {
      sidebar.style.width = "72px";
      sidebar.style.transition = "width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms";
    }
    setIsExtendMenu(isExtend);
  };

  const updateMedia = () => {
    setDesktop(window.innerWidth > 768);
  };

  const handleExpandFullScreen = () => {
    const writeModal = document.getElementById("write-email-modal");
    //const expandWriteEmail = document.getElementById("expand-write-email");
    if (isFullScreen) {
      writeModal.style.inset = "unset";
      writeModal.style.width = "800px";
      writeModal.style.height = "fit-content";
      writeModal.style.bottom = "15px";
      writeModal.style.right = "10px";
    } else {
      writeModal.style.width = "80%";
      writeModal.style.height = "80%";
      writeModal.style.left = "10%";
      writeModal.style.top = "10%";
    }
    if (writeModal) {
      const joditContainer = writeModal.querySelector(".jodit-container");
      const height = !isFullScreen ? "100%" : "200px";
      if (joditContainer) {
        joditContainer.style.height = height;
      }
    }

    setIsFullScreen(!isFullScreen);
  };
  const handleCloseWriteEmailModalPopup = () => {
    dispatch(setOpenWriteEmailModalPopup(false));
    dispatch(setPostEmailType(postEmailType.init));
    document.getElementById("write-email-modal").style.display = "none";
    // document.querySelectorAll("#receive-container")[1].style.display = "none";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      if (getAuthTokenFromSessionStorage()) {
        dispatch(UserActions.signout());

        var confirmationMessage = "o/";
        (e || window.event).returnValue = confirmationMessage; //Gecko + IE
        return "";
      }
    });

    if (
      !getPushNotificationPermission() ||
      getPushNotificationPermission() !== "granted" ||
      getPushNotificationPermission() !== "denied"
    )
      if (
        Notification &&
        (Notification.permission !== "granted" ||
          Notification.permission !== "denied")
      ) {
        Notification.requestPermission(function (status) {
          setPushNotificationPermission(status);
        });
      }

    return () => {
      window.removeEventListener("beforeunload", () => {});
    };
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    window.addEventListener("load", pageLoadCall);
    if (
      uid &&
      (!prevSelectedChannel ||
        prevSelectedChannel.id !== activeSelectedChannel.id)
    ) {
      initializeWebSocket(getAuthToken());
      //dispatch(GetAllChannelMembers());
      //dispatch(GetChannelListAction(dispatch));
      prevSelectedChannel = activeSelectedChannel;
    }

    return () => {
      window.removeEventListener("resize", updateMedia);
      window.removeEventListener("load", pageLoadCall);
      closeWebSocket();
    };
  }, [uid]);

  useEffect(() => {
    dispatch(GetProfile(uid));
    setProfileLoading(false);
    dispatch(fetchNotificationAction(0, NOTIFICATION_COUNT));
    dispatch(fileStorageDetails());
  }, [uid]);

  useEffect(() => {
    if (fileConfig === undefined) {
      dispatch(GetFileConfig());
    }
  }, []);
  const handleCollapseWriteEmail = (collapse) => {
    setCollapseModalEmail(collapse);
    const writeModal = document.getElementById("write-email-modal");
    const expandModal = document.getElementById("expand-write-email");
    if (!collapseModalEmail) {
      expandModal.style.display = "block";
      writeModal.style.display = "none";
    } else {
      writeModal.style.display = "flex";
      expandModal.style.display = "none";
    }
  };
  const onDragEnd = (result) => {
    if (discussionListRef && discussionListRef.current) {
      discussionListRef.current.handleOnDragEnd(result);
    }
  };
  const showHideProfileImage = (leftBarWidth) => {
    const profileImage = document.getElementById("profile-image");
    if (leftBarWidth >= 250) {
      profileImage.style.display = "flex";
    } else {
      profileImage.style.display = "none";
    }
  };
  return (
    <>
      <ErrorToast
        show={toastShow}
        errorMessage={toastMessage}
        delay={toastDelay}
        type={toastType}
      />
      <Detector
        render={({ online }) => (
          <div className={online ? "normal" : "warning"}>
            {!online && (
              <Snackbar
                show={true}
                message={t("error:network.error")}
                handleClose={() => {}}
              />
            )}
            {online && (
              <Snackbar
                show={false === isWebSocketAvailable}
                message={t("error:websocket.error")}
                handleClose={() => {}}
              />
            )}
          </div>
        )}
      />
      {isDesktop ? (
        <>
          <div
            onMouseUp={(e) => {
              setIsProjectListEnabled(false);
              setIsDiscussionListEnabled(false);
              return false;
            }}
            onMouseMove={(e) => {
              let pos = e.clientX;
              let max = window.innerWidth / 2;
              if (isProjectListEnabled) {
                let minWidthOfSideBar = 72;
                if (pos > minWidthOfSideBar && pos < max) {
                  const sidebar = document.getElementById("left-sidebar");
                  sidebar.style.width = pos + "px";
                  sidebar.style.transition = "none";
                  setIsExtendMenu(true);
                  showHideProfileImage(pos);
                } else if (pos <= minWidthOfSideBar) {
                  setIsExtendMenu(false);
                  showHideProfileImage(pos);
                }
              } else if (isDiscussionListEnabled) {
                let left = getComputedStyle(
                  document.getElementById("left-sidebar")
                ).getPropertyValue("width");
                let leftWidth = parseInt(left.substr(0, left.length - 2), 10);
                let min = leftWidth + 200;
                if (pos > min && pos < max) {
                  document.getElementById("middle-project").style.width =
                    "320px";
                  // pos - leftWidth + "px";
                }
              }
              return false;
            }}
          >
            <div className="app noScroll">
              <Row className="pr-0 mr-0 ml-0">
                <DragDropContext
                  onDragEnd={onDragEnd}
                  className="discussion-list-body"
                >
                  <Col
                    id="left-sidebar"
                    className="sideBar col-auto p-0 mr-0 ml-0"
                  >
                    <SidePane
                      isDesktop={isDesktop}
                      toggleMenu={toggleMenu}
                      isExtendMenu={isExtendMenu}
                    />
                  </Col>
                  <ActiveMenu
                    isProjectListEnabled={isProjectListEnabled}
                    setIsDiscussionListEnabled={setIsDiscussionListEnabled}
                    isDiscussionListEnabled={isDiscussionListEnabled}
                    setIsProjectListEnabled={setIsProjectListEnabled}
                    discussionListRef={discussionListRef}
                  />
                </DragDropContext>

                <div
                  id={"write-email-modal"}
                  style={{
                    position: "fixed",
                    bottom: "15px",
                    right: "10px",
                    height: "fit-content",
                    width: "800px",
                    zIndex: 9,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DEDEDE",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.17)",
                    borderRadius: "10px",
                    display: "none",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    id={"write-email-modal-header"}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      cursor: "move",
                      zIndex: 10,
                      color: "#fff",
                      height: "55px",
                      borderBottom: "1px solid #18B263",
                    }}
                  >
                    <div
                      style={{
                        color: "#19191A",
                        fontSize: "18px",
                      }}
                    >
                      {t("email-contact:newEmail")}
                    </div>
                    <div>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleCollapseWriteEmail(true)}
                      >
                        <img
                          src={CloseWriteEmailModal}
                          alt="close-write-email-modal"
                          style={{
                            width: "16px",
                          }}
                        />
                      </IconButton>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleExpandFullScreen("collapse")}
                      >
                        {isFullScreen ? (
                          <img
                            src={CollapseWriteEmailIcon}
                            alt="expand-email-icon"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        ) : (
                          <img
                            src={ExpandWriteEmailIcon}
                            alt="expand-email-icon"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        )}
                      </IconButton>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleCloseWriteEmailModalPopup()}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                  {isOpenWriteEmailModalPopup ? (
                    <div style={{ flex: "1 auto" }}>
                      <OutLookWriteEmailModalEditor />
                    </div>
                  ) : null}
                </div>
                <div
                  id="expand-write-email"
                  style={{
                    position: "absolute",
                    bottom: "15px",
                    right: "10px",
                    height: "fit-content",
                    width: "320px",
                    zIndex: 9,
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #DEDEDE",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.17)",
                    borderRadius: "10px",
                    display: "none",
                  }}
                >
                  <div
                    id={"write-email-modal-header"}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      cursor: "move",
                      zIndex: 10,
                      color: "#fff",
                      height: "55px",
                      borderBottom: "1px solid #18B263",
                    }}
                  >
                    <div
                      style={{
                        color: "#19191A",
                        fontSize: "18px",
                      }}
                    >
                      {t("email-contact:newEmail")}
                    </div>
                    <div>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleCollapseWriteEmail(false)}
                      >
                        <img
                          src={CloseWriteEmailModal}
                          alt="close-write-email-modal"
                          style={{
                            width: "16px",
                          }}
                        />
                      </IconButton>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleCollapseWriteEmail(false)}
                      >
                        {isFullScreen ? (
                          <img
                            src={CollapseWriteEmailIcon}
                            alt="expand-email-icon"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        ) : (
                          <img
                            src={ExpandWriteEmailIcon}
                            alt="expand-email-icon"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          />
                        )}
                      </IconButton>
                      <IconButton
                        component="span"
                        size="small"
                        onClick={() => handleCloseWriteEmailModalPopup()}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </Row>
            </div>
          </div>
          <ModalRoot />
        </>
      ) : (
        <SidebarPushable className="app noScroll">
          <SidePane
            isDesktop={isDesktop}
            toggleMenu={toggleMenu}
            isExtendMenu={isExtendMenu}
          />
          <SidebarPusher className="bottom">
            <ActivePanel
              panelName={activeActionPanel}
              channel={activeSelectedChannel}
            />
            <ModalRoot />
          </SidebarPusher>
        </SidebarPushable>
      )}
    </>
  );
}

export default MainFrame;
