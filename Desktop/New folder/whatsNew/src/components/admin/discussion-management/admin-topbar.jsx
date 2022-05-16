import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { DiscussionActions } from "../../messages/channel-head.style";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import Notifications from "../../datapanel/notification";
import OpenedChannelDetails from "../../../assets/icons/context-panel.svg";
import OpenChannelDetails from "../../../assets/icons/context-panel-active.svg";
import DeleteDiscussionModal from "../../../components/modal/discussion/delete-discussion-modal";
import CreateOwnerDiscussionModal from "../../modal/channel/create-owner-discussion-modal";
import { showToast } from "../../../store/actions/toast-modal-actions";

import { adminDeleteDiscussionData } from "../../../store/actions/admin-discussion-action";
import "../admin.css";
import DeleteWarningModal from "../../../components/modal/account/delete-warning-modal";
import AdminService from "../../../services/admin-service";
import SuccessModal from "../../modal/account/success-modal";
import { RESET_USER_STATUS_ACTIVITY } from "../../../store/actionTypes/admin-account-action-types";
import { useHistory } from "react-router-dom";
import { ADMIN_SUB_MENU, MENU_ITEMS } from "../../../constants/menu-items";

function AdminTopBar(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const selectedDiscussions = useSelector(
    (state) => state.AdminDiscussionReducer.selectedDiscussions
  );
  let filteredSelectedDiscussion = selectedDiscussions.filter(
    (el) => el.checked && el.status !== "DELETED"
  );
  const importedMemberList = useSelector(
    (state) => state.AdminAccountReducer.importedMemberList
  );
  const failedToImportMemberList = useSelector(
    (state) => state.AdminAccountReducer.failedToImportMemberList
  );

  const [showDeleteDiscussionModal, setShowDeleteDiscussionModal] =
    useState(false);

  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [discussionCreateModal, setDiscussionCreateModal] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(null);
  const [warningList, setWarningList] = useState([]);
  const [showCreateDiscussionBtn, setShowCreateDiscussionBtn] = useState(false);

  useEffect(() => {
    if (
      history.location.pathname ===
        `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.DISCUSSION_MANAGEMENT}` ||
      (adminSidebarPanelState && adminSelectedRow.activationStatus === "ACTIVE")
    )
      setShowCreateDiscussionBtn(true);
  }, [history, adminSidebarPanelState, adminSelectedRow]);

  useEffect(() => {
    if (importedMemberList) {
      dispatch(showToast(t("account:import.successful"), 3000, "success"));
    } else if (failedToImportMemberList) {
      dispatch(showToast(t("account:import.fail")), 3000, "failure");
    }
  }, [importedMemberList, failedToImportMemberList]);

  const adminSidebarPanelState = useSelector(
    (state) => state.config.adminSidebarPanelState
  );

  const openDiscussionCreateModal = () => {
    setDiscussionCreateModal(true);
  };
  const closeDiscussionCreateModal = () => {
    setDiscussionCreateModal(false);
  };

  const submitDelete = async (list) => {
    let reqSelectedList = list.map((value) => value.id);
    let requestBody = {
      channels: reqSelectedList,
    };
    if (reqSelectedList.length) {
      const response = await dispatch(adminDeleteDiscussionData(requestBody));
      if (response.payload.code === 2001) {
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            t(
              `admin:discussion.management:success.code:${response.payload.code}`
            ),
            3000,
            "success"
          )
        );
      } else if (response.payload.code === 2011) {
        let myList = [...filteredSelectedDiscussion];
        let newList = [];
        myList.forEach((el) => {
          response.payload.data.forEach((element) => {
            if (element.channelID === el.id) {
              let newObj = {
                id: el.id,
                errCode: element.errCode,
                channelName: el.name,
              };
              newList.push(newObj);
            }
          });
        });
        setShowDeleteDiscussionModal(false);
        dispatch(
          showToast(
            newList.map((el) => (
              <span className="d-flex" key={el.id}>
                {el.channelName}
                {" - "}
                {t(`admin:discussion.management:error.code:${el.errCode}`)}
              </span>
            )),
            3000,
            "failure"
          )
        );
      }
    }
  };
  return (
    <div className="topBar m-0">
      <div className="d-flex align-items-center justify-content-between pr-0">
        <DiscussionActions className="justify-content-start">
          <div className="d-flex align-items-center left-spacing">
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            >
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip
                    id={t("admin:account.management:topbar.tooltip:delete")}
                  >
                    {t("admin:account.management:topbar.tooltip:delete")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__removeUser text-white ${
                    filteredSelectedDiscussion?.length ? "" : "disabled"
                  }`}
                  onClick={() => {
                    setShowDeleteDiscussionModal(true);
                  }}
                >
                  {t("admin:account.management:topbar.text:delete")}
                </div>
              </OverlayTrigger>
            </div>
          </div>
        </DiscussionActions>
        <DiscussionActions className="justify-content-end">
          <div
            className="d-flex align-items-center justify-content-between"
            style={showCreateDiscussionBtn ? { width: "321px" } : {}}
          >
            {showCreateDiscussionBtn && (
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip
                    id={t(
                      "admin:account.management:topbar.text:create.discussion"
                    )}
                  >
                    {t(
                      "admin:account.management:topbar.text:create.discussion"
                    )}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__newDiscussion text-white`}
                  onClick={() => openDiscussionCreateModal()}
                >
                  {t("admin:account.management:topbar.text:create.discussion")}
                </div>
              </OverlayTrigger>
            )}
            <div className="d-flex">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                show={showTooltip}
                overlay={
                  <Tooltip id={t("header.tooltip:notifications")}>
                    {t("header.tooltip:notifications")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon ${showBg === true ? "active" : ""}`}
                >
                  <Notifications
                    showToolTip={(val) => setShowTooltip(val)}
                    setShowBg={(val) => setShowBg(val)}
                    showBg={showBg}
                  />
                </div>
              </OverlayTrigger>

              {adminSelectedRow !== null ||
                (selectedDiscussions.length > 0 && (
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 150, hide: 100 }}
                    trigger={["hover", "focus"]}
                    overlay={
                      <Tooltip
                        id={t(
                          "admin:account.management:topbar.tooltip:details"
                        )}
                      >
                        {t("admin:account.management:topbar.tooltip:details")}
                      </Tooltip>
                    }
                  >
                    <div
                      onClick={props.onToggleChannelDetails}
                      className={`topBar__icon topBar__icon__summary ${
                        adminSidebarPanelState ? "active" : ""
                      }`}
                      id={adminSidebarPanelState ? "opened" : ""}
                    >
                      <img
                        id="icon"
                        src={
                          adminSidebarPanelState
                            ? OpenedChannelDetails
                            : OpenChannelDetails
                        }
                        alt={""}
                      />
                    </div>
                  </OverlayTrigger>
                ))}
            </div>
          </div>
        </DiscussionActions>
      </div>
      <CreateOwnerDiscussionModal
        showModal={discussionCreateModal}
        closeModal={() => {
          closeDiscussionCreateModal();
        }}
      />
      <DeleteDiscussionModal
        showModal={showDeleteDiscussionModal}
        onSubmit={() => submitDelete(filteredSelectedDiscussion)}
        discussionCount={filteredSelectedDiscussion.length}
        closeModal={() => {
          setShowDeleteDiscussionModal(false);
        }}
      />
    </div>
  );
}

export default AdminTopBar;
