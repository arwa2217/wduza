import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import AccountTable from "./account-table";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import AdminAccountSearch from "../../global-search/admin-account-search";
import AdminTopBar from "./admin-topbar";
import AdminAccountDetails from "./admin-account-details";
import "./../admin.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAccountData } from "../../../store/actions/admin-account-action";
import { setAdminSidebarActiveState } from "../../../store/actions/config-actions";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import { RESET_ACCOUNT_FILTER_OBJECT } from "../../../store/actionTypes/admin-account-action-types";

const PageHeader = styled.div`
  margin: 10px 0;
`;
const PageTitle = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 120%;
  color: #19191a;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PageAction = styled.button`
  background: #c6c6c6;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  color: #fff;

  &:hover {
    color: #fff;
  }
`;

function AdminAccountPage(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const account_data = useSelector(
    (state) => state.AdminAccountReducer.account_data
  );
  const adminSidebarPanelState = useSelector(
    (state) => state.config.adminSidebarPanelState
  );

  let searchAccountEnabled = useSelector(
    (state) => state.AdminAccountReducer.searchAccountEnabled
  );
  let accountSearchData = useSelector(
    (state) => state.AdminAccountReducer.accountSearchData
  );
  const accountSearchCount = useSelector(
    (state) => state.AdminAccountReducer.accountSearchCount
  );
  const accountCount = useSelector(
    (state) => state.AdminAccountReducer.accountCount
  );
  const accountFilterObj = useSelector(
    (state) => state.AdminAccountReducer.accountFilterObj
  );

  const [key, setKey] = useState("all");
  const [view, setView] = useState("TABLE");
  const [isEnable, setIsEnable] = useState(false);
  useEffect(() => {
    dispatch({ type: RESET_ACCOUNT_FILTER_OBJECT });
    dispatch(fetchAccountData(accountFilterObj));
    return () => {
      console.log("cleanup account data");
    };
  }, []);

  const dataset = useMemo(() => {
    return searchAccountEnabled ? accountSearchData : account_data;
  }, [account_data, accountSearchData, searchAccountEnabled]);

  const tableHeaders = [
    {
      id: "screenName",
      text: "Screen",
      width: 140,
      sortable: true,
    },
    {
      id: "firstName",
      text: "Name",
      width: 100,
      align: "center",
      sortable: true,
    },
    {
      id: "email",
      text: "Email",
      sortable: true,
      width: 100,
      align: "center",
    },
    {
      id: "phone",
      text: "Phone",
      sortable: true,
      width: 100,
      align: "center",
    },
    {
      id: "affiliation",
      text: "Affiliation",
      sortable: true,
      width: 100,
      align: "center",
    },
    {
      id: "uid",
      text: "UID",
      sortable: true,
      width: 100,
      align: "center",
    },
    {
      id: "status",
      text: "Status",
      filter: true,
      filterItem: [
        {
          id: "ALL",
          text: "All",
        },
        {
          id: "INACTIVE",
          text: "Inactive",
        },
        {
          id: "PENDING",
          text: "Pending",
        },
        {
          id: "ACTIVE",
          text: "Active",
        },
        {
          id: "ACTIVATION_FAILED",
          text: "Failed",
        },
        {
          id: "ADMIN_BLOCKED",
          text: "Blocked",
        },
        {
          id: "PASSWORD_LOCKED",
          text: "Password Locked",
        },
        {
          id: "DELETED",
          text: "Deleted",
        },
        {
          id: "INIT",
          text: "Unassigned",
        },
      ],
      resize: false,
      width: 100,
      align: "center",
    },
  ];

  const toggleChannelDetails = () => {
    dispatch(setAdminSidebarActiveState(!adminSidebarPanelState));
  };

  const handleUidModal = (e) => {
    e.preventDefault();
    const modalType = ModalTypes.AVAILABLE_UID;
    const modalProps = {
      show: true,
      closeButton: true,
      skipButton: false,
      title: t("addPeople.modal:add.people"),
      modalType: modalType,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  };

  return (
    <>
      <div
        onMouseDown={(e) => {
          if (!props.isProjectListEnabled) {
            props.setIsProjectListEnabled(true);
          }
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col
        id="right-messagetab"
        className="noScroll main-post-area frameContent p-0 main-file-area"
      >
        <Row className="m-0">
          <Col className="p-0">
            <AdminTopBar onToggleChannelDetails={toggleChannelDetails} />
          </Col>
        </Row>
        <div
          className="d-flex flex-column w-100"
          style={{paddingRight: '10px'}}
          onMouseUp={(e) => {
            if (isEnable) {
              setIsEnable(false);
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
              }
            }
          }}
        >
          <Row className="flex-nowrap flex-row m-0">
            <Col id="left-messagetab" className="message-tab col-sm-auto">
              <Row className="m-0">
                <Col
                  className="channel-head-wrap-bg"
                  style={{
                    padding: "20px",
                    backgroundColor: "#F8F8F8",
                  }}
                >
                  <AdminAccountSearch
                    placeholder={t(
                      "admin:account.management:search.placeholder"
                    )}
                  />
                  <PageHeader className="d-flex flex-row align-items-center justify-content-between w-100">
                    <PageTitle className="d-flex flex-row w-100">
                      Account Management
                      <strong className="ml-1">
                        {searchAccountEnabled
                          ? accountSearchCount
                          : accountCount}
                      </strong>
                    </PageTitle>
                    <PageAction
                      className="btn btn-default"
                      onClick={handleUidModal}
                    >
                      Available UID
                    </PageAction>
                  </PageHeader>
                  <AccountTable
                    headers={tableHeaders}
                    data={dataset}
                    dataCount={
                      searchAccountEnabled ? accountSearchCount : accountCount
                    }
                    view={view}
                    minCellWidth={100}
                    // getSelectedFiles={getSelectedFiles}
                    tabKey={key}
                    searchAccountEnabled={searchAccountEnabled}
                  />
                </Col>
              </Row>
            </Col>
            {adminSidebarPanelState && (
              <>
                <div
                  onMouseDown={(e) => {
                    if (!isEnable) {
                      setIsEnable(true);
                      e.stopPropagation();
                      e.preventDefault();
                    }
                    return false;
                  }}
                >
                  <hr className="width-resize-details" />
                </div>
                <Col
                  id="right-details"
                  className={"detailsBar col-sm-auto p-0 mr-0"}
                >
                  <AdminAccountDetails />
                </Col>
              </>
            )}
          </Row>
        </div>
      </Col>
    </>
  );
}
export default AdminAccountPage;
