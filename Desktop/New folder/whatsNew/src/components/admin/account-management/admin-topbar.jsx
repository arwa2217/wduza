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
import CreateAccountModal from "../../modal/account/create-account-modal";
import DeleteAccountModal from "../../modal/account/delete-account-modal";
import DeleteDiscussionModal from "../../modal/discussion/delete-discussion-modal";
import DeleteAccountFailedModal from "../../modal/account/delete-account-failed-modal";
import CreateOwnerDiscussionModal from "../../modal/channel/create-owner-discussion-modal";
import { showToast } from "../../../store/actions/toast-modal-actions";

import {
  deleteUser,
  importMemberList,
} from "../../../store/actions/admin-account-action";
import "../admin.css";
import DeleteWarningModal from "../../modal/account/delete-warning-modal";
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
  const selectedAccounts = useSelector(
    (state) => state.AdminAccountReducer.selectedAccounts
  );
  const importedMemberList = useSelector(
    (state) => state.AdminAccountReducer.importedMemberList
  );
  const failedToImportMemberList = useSelector(
    (state) => state.AdminAccountReducer.failedToImportMemberList
  );
  let { userStatusChangeSuccess, userStatusChangeType } = useSelector(
    (state) => state.AdminAccountReducer
  );
  const adminSidebarPanelState = useSelector(
    (state) => state.config.adminSidebarPanelState
  );

  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteDiscussionModal, setShowDeleteDiscussionModal] =
    useState(false);
  const [showDeleteFailedModal, setShowDeleteFailedModal] = useState(false);
  const [discussionCreateModal, setDiscussionCreateModal] = useState(false);
  const [showDeleteWarningModal, setDeleteWarningModal] = useState(false);
  const [currentData, setCurrentData] = useState(false);
  const [currentDataIndex, setCurrentDataIndex] = useState(null);
  const [warningList, setWarningList] = useState([]);
  const [showModal, setShowModal] = useState({
    show: false,
    msg: "",
    title: "",
  });
  const [showCreateDiscussionBtn, setShowCreateDiscussionBtn] = useState(false);

  const openModal = (msg, title) => {
    setShowModal({ show: true, msg, title });
  };

  const closeModal = () => {
    setShowModal({ show: false, msg: "", title: "" });
  };

  useEffect(() => {
    if (userStatusChangeType === "DELETED") {
      if (userStatusChangeSuccess) {
        setShowDeleteModal(false);
        setDeleteWarningModal(false);
        openModal(t("account:account.delete.success"), t("account:deleted"));
      } else if (userStatusChangeSuccess === false) {
        setDeleteWarningModal(false);
        setShowDeleteModal(false);
        dispatch(
          showToast(
            t("admin:account.management:user.information:error.message"),
            3000
          )
        );
      }
    }
    return () =>
      dispatch({
        type: RESET_USER_STATUS_ACTIVITY,
      });
  }, [userStatusChangeSuccess]);

  useEffect(() => {
    if (
      history.location.pathname ===
        `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.DISCUSSION_MANAGEMENT}` ||
      (adminSidebarPanelState &&
        adminSelectedRow?.activationStatus === "ACTIVE")
    )
      setShowCreateDiscussionBtn(true);
  }, [history, adminSidebarPanelState, adminSelectedRow]);

  const onExportClick = () => {
    const input = document.getElementById("export-file");
    if (input) {
      input.click();
    }
  };

  useEffect(() => {
    if (importedMemberList) {
      dispatch(showToast(t("account:import.successful"), 3000, "success"));
    } else if (failedToImportMemberList) {
      dispatch(showToast(t("account:import.fail")), 3000, "failure");
    }
  }, [importedMemberList, failedToImportMemberList]);

  const closeDeleteFailedModal = () => {
    setShowDeleteFailedModal(false);
  };
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const closeDeleteDiscussionModal = () => {
    setShowDeleteDiscussionModal(false);
  };

  const openAccountModal = () => {
    setShowAccount(true);
  };
  const closeAccountModal = () => {
    setShowAccount(false);
  };
  const openDiscussionCreateModal = () => {
    setDiscussionCreateModal(true);
  };
  const closeDiscussionCreateModal = () => {
    setDiscussionCreateModal(false);
  };

  const exportAccount = (e) => {
    e.preventDefault();
    let memberData =
      selectedAccounts.length > 0
        ? selectedAccounts.map((memberItem) => memberItem.id)
        : [];
    let postData = {
      users: memberData,
    };
    AdminService.exportAccount(postData);
  };

  useEffect(() => {
    if (warningList && warningList.length > 0) {
      setCurrentData(warningList[0]);
      setCurrentDataIndex(0);
      setDeleteWarningModal(true);
    }
  }, [warningList]);

  const handleDelete = () => {
    if (selectedAccounts.length) {
      var list = selectedAccounts.filter(
        (item) => item?.ownedDiscussionCount > 0
      );
      if (list.length) {
        setWarningList(list);
      } else {
        openDeleteModal();
      }
    }
  };

  const submitDelete = (list) => {
    if (list.length) {
      let reqSelectedList = list
        .filter((item) => item.activationStatus !== "DELETED")
        .map((value) => ({
          userId: value.id,
          activationStatus: "DELETED",
        }));
      if (reqSelectedList.length) {
        dispatch(
          deleteUser(
            reqSelectedList,
            "DELETED",
            "Successfully deleted the selected account."
          )
        );
      }
    } else {
      setDeleteWarningModal(false);
      setShowDeleteModal(false);
    }
  };
  const onInputClick = (event) => {
    event.target.value = ''
}
  const importCSVFile = (e) => {
    e.preventDefault();
    const input = e.target.files[0];
    const reader = new FileReader();
    if (
      input &&
      (input?.type === "application/vnd.ms-excel" || input?.type === "text/csv")
    ) {
      reader.onload = function (e) {
        let text = e.target.result;
        let textHeaders = text?.split("\n")[0];
        if (textHeaders?.split(",").length === 3) {
          const data = csvToArray(text);
          let csvArray = data;
          let importDataArray = [];
          csvArray &&
            csvArray.length > 0 &&
            csvArray.map((csvItem) => {
              if (importDataArray?.indexOf(csvItem?.email) === -1) {
                if(csvItem!==undefined)
                importDataArray.push(csvItem);
              }
              return csvItem;
            });
          dispatch(importMemberList(importDataArray, dispatch));
        } else {
          dispatch(showToast(t("account:import.fail.invalid.fields")), 3000);
        }
      };
      reader.readAsText(input);
    } else {
      dispatch(showToast(t("account:import.fail.invalid.type")), 3000);
    }
  };

  const csvToArray = (str, delimiter = ",") => {
    var rows;
    var headers;
    if(str.includes("\r")){
      headers=str.slice(0, str.indexOf("\r\n")).split(delimiter);
      rows=rows = str.slice(str.indexOf("\r\n") + 1).split("\r\n");
    }else{
       headers = str.slice(0, str.indexOf("\n")).split(delimiter);
       rows = str.slice(str.indexOf("\n") + 1).split("\n");
    }
    
    const arr = rows.map(function (row) {
      row = row.replace("\n", "");
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        if(values[index]){
          object[header] = values[index];
          return object;
        }
        
      }, {});
      return el;
    });
    return arr;
  };

  const nextAction = () => {
    if (warningList?.length) {
      setCurrentData(warningList[currentDataIndex + 1]);
      setCurrentDataIndex(currentDataIndex + 1);
    }
  };

  const previousAction = () => {
    if (warningList?.length) {
      setCurrentData(warningList[currentDataIndex - 1]);
      setCurrentDataIndex(currentDataIndex - 1);
    }
  };
  const okAction = () => {
    if (selectedAccounts.length) {
      var list = selectedAccounts.filter(
        (item) => item?.ownedDiscussionCount === 0
      );
      if (list.length) {
        submitDelete(list);
      } else {
        setDeleteWarningModal(false);
        setShowDeleteModal(false);
      }
    }
  };

  function modalProps() {
    let data = "";
    data = {
      header: "delete.warning.modal:header",
      content1:
        currentData?.ownedDiscussionCount?.length === 1
          ? "delete.warning.modal:content.firstline.single"
          : "delete.warning.modal:content.firstline.multiple",
      total: warningList?.length,
      userData: currentData,
      userIndex: currentDataIndex + 1,
      discussionList: currentData?.discussionList?.map(({ name }) => name),
      ownerName:
        currentData.name === "" ? currentData.screenName : currentData.name,
      content2: "delete.warning.modal:content.secondline",
      primaryButtonText: "delete.warning.modal:ok.button",
      secondaryButtonText: "delete.warning.modal:next.button",
      thirdButtonText: "delete.warning.modal:previous.button",
    };
    return data;
  }
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
                    id={t("admin:account.management:topbar.tooltip:add")}
                  >
                    {t("admin:account.management:topbar.tooltip:add")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__addMember text-white`}
                  onClick={() => {
                    openAccountModal();
                  }}
                >
                  {t("admin:account.management:topbar.text:add")}
                </div>
              </OverlayTrigger>
            </div>
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
                    selectedAccounts.filter(
                      (item) => item.activationStatus !== "DELETED"
                    )?.length
                      ? ""
                      : "disabled"
                  }`}
                  onClick={() => {
                    //openDeleteDiscussionModal
                    handleDelete();
                  }}
                >
                  {t("admin:account.management:topbar.text:delete")}
                </div>
              </OverlayTrigger>
            </div>
            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            >
              <input
                type="file"
                id="export-file"
                style={{ display: "none" }}
                onChange={importCSVFile}
                onClick={onInputClick} 
              />
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 100 }}
                trigger={["hover", "focus"]}
                overlay={
                  <Tooltip
                    id={t("admin:account.management:topbar.tooltip:import")}
                  >
                    {t("admin:account.management:topbar.tooltip:import")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__import  text-white
                  `}
                  onClick={(e) => {
                    onExportClick(e);
                  }}
                >
                  {t("admin:account.management:topbar.text:import")}
                </div>
              </OverlayTrigger>
            </div>
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
                    id={t("admin:account.management:topbar.tooltip:export")}
                  >
                    {t("admin:account.management:topbar.tooltip:export")}
                  </Tooltip>
                }
              >
                <div
                  className={`topBar__icon topBar__icon__export text-white
                  `}
                  onClick={(e) => {
                    exportAccount(e);
                  }}
                >
                  {t("admin:account.management:topbar.text:export")}
                </div>
              </OverlayTrigger>
            </div>

            <div
              className="d-flex align-items-center"
              style={{ marginRight: "0px" }}
            ></div>
          </div>
        </DiscussionActions>
        <DiscussionActions className="justify-content-end">
          <div
            className="d-flex align-items-center justify-content-between"
            style={showCreateDiscussionBtn ? { width: "321px" } : {}}
          >
            {showCreateDiscussionBtn && (
              <button
                className={`btn topBar__icon ${
                  showCreateDiscussionBtn
                    ? `topBar__icon__newDiscussion text-white`
                    : `topBar__icon__newDiscussion disabled`
                }`}
                type="button"
                onClick={() => {
                  if (showCreateDiscussionBtn) {
                    openDiscussionCreateModal();
                  }
                }}
              >
                {t("admin:account.management:topbar.text:create.discussion")}
              </button>
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

              {(adminSelectedRow !== null || selectedAccounts.length > 0) && (
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 150, hide: 100 }}
                  trigger={["hover", "focus"]}
                  overlay={
                    <Tooltip
                      id={t("admin:account.management:topbar.tooltip:details")}
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
              )}
            </div>
          </div>
        </DiscussionActions>
      </div>
      <CreateOwnerDiscussionModal
        showModal={discussionCreateModal}
        closeModal={() => {
          closeDiscussionCreateModal();
        }}
        owner={
          history.location.pathname ===
          `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.DISCUSSION_MANAGEMENT}`
            ? ""
            : adminSelectedRow?.email
        }
      />
      <CreateAccountModal
        showModal={showAccount}
        closeModal={() => {
          closeAccountModal();
        }}
      />
      <DeleteAccountModal
        showModal={showDeleteModal}
        onSubmit={() => submitDelete(selectedAccounts)}
        accounts={selectedAccounts.length}
        closeModal={() => {
          closeDeleteModal();
        }}
      />
      <DeleteDiscussionModal
        showModal={showDeleteDiscussionModal}
        // onSubmit={submitDelete(selectedAccounts)}
        discussionCount={selectedAccounts.length}
        closeModal={() => {
          closeDeleteDiscussionModal();
        }}
      />
      <DeleteAccountFailedModal
        showModal={showDeleteFailedModal}
        closeModal={() => {
          closeDeleteFailedModal();
        }}
      />
      <DeleteWarningModal
        data={modalProps()}
        nextAction={nextAction}
        previousAction={previousAction}
        closeModal={() => setDeleteWarningModal(false)}
        okAction={() => okAction()}
        showModal={showDeleteWarningModal}
      />
      <SuccessModal
        title={showModal.title}
        message={showModal.msg}
        showModal={showModal.show}
        closeModal={() => {
          closeModal();
        }}
      />
    </div>
  );
}

export default AdminTopBar;
