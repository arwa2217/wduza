import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import DiscussionTable from "./discussion-table";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import AdminDiscussionSearch from "../../global-search/discussion-search-input";
import AdminTopBar from "./admin-topbar";
import AdminDiscussionDetails from "./admin-discussion-details";
import "./../admin.css";
import { useSelector, useDispatch } from "react-redux";
import { getFileSize } from "../../utils/file-utility";
import { setAdminSidebarActiveState } from "../../../store/actions/config-actions";
import { fetchDiscussionData } from "../../../store/actions/admin-discussion-action";
import Nav from "react-bootstrap/Nav";
import {
  RESET_DISCUSSION_FILTER_OBJECT,
  SET_DISCUSSION_FILTER_OBJECT,
} from "../../../store/actionTypes/admin-discussion-action-types";

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

function DiscussionManagement(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const discussionListData = useSelector(
    (state) => state.AdminDiscussionReducer.discussionListData
  );
  const discussionListCount = useSelector(
    (state) => state.AdminDiscussionReducer.discussionListCount
  );
  const discussionFilteredCount = useSelector(
    (state) => state.AdminDiscussionReducer.discussionFilteredCount
  );
  const adminSidebarPanelState = useSelector(
    (state) => state.config.adminSidebarPanelState
  );

  const accountSearchCount = useSelector(
    (state) => state.AdminDiscussionReducer.accountSearchCount
  );
  const discussionFilterObj = useSelector(
    (state) => state.AdminDiscussionReducer.discussionFilterObj
  );
  const [key, setKey] = useState("all");
  const [view, setView] = useState("TABLE");
  const [isEnable, setIsEnable] = useState(false);

  let searchAccountEnabled = useSelector(
    (state) => state.AdminDiscussionReducer.searchAccountEnabled
  );
  let discussionSearchList = useSelector(
    (state) => state.AdminDiscussionReducer.discussionSearchList
  );

  useEffect(() => {
    dispatch({ type: RESET_DISCUSSION_FILTER_OBJECT });
    dispatch(fetchDiscussionData(discussionFilterObj));
    return () => {
      console.log("cleanup account data");
    };
  }, []);

  const dataset = useMemo(() => {
    return searchAccountEnabled ? discussionSearchList : discussionListData;
  }, [discussionListData, discussionSearchList, searchAccountEnabled]);


  const tableHeaders = [
    {
      id: "name",
      text: "Name",
      width: 160,
      align: "left",
      sortable: true,
    },
    {
      id: "creator",
      text: "Owner",
      sortable: true,
      width: 140,
      align: "center",
    },
    {
      id: "confidential",
      text: "Confidential",
      sortable: false,
      width: 140,
      align: "center",
    },
    {
      id: "advanced",
      text: "Advanced",
      sortable: false,
      width: 140,
      align: "center",
    },
    {
      id: "status",
      text: "Status",
      filter: true,
      filterItem: [
        {
          id: "all",
          text: "All",
        },
        {
          id: "inactive",
          text: "Inactive",
        },
        {
          id: "active",
          text: "Active",
        },
        {
          id: "locked",
          text: "Locked",
        },
        {
          id: "deleted",
          text: "Deleted",
        },
        {
          id: "deleting",
          text: "Deleting",
        },
      ],
      resize: false,
      width: 140,
      align: "center",
    },
  ];

  const toggleChannelDetails = () => {
    dispatch(setAdminSidebarActiveState(!adminSidebarPanelState));
  };

  const setActiveTab = (activeKey) => {
    setKey(activeKey);
    let obj = {};
    obj["type"] = activeKey;
    obj["offset"] = 0;
    dispatch({
      type: SET_DISCUSSION_FILTER_OBJECT,
      payload: {
        ...discussionFilterObj,
        ...obj,
      },
    });
    dispatch(
      fetchDiscussionData({
        ...discussionFilterObj,
        ...obj,
      })
    );
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
                  <AdminDiscussionSearch
                    placeholder={t(
                      "admin:discussion.management:search.placeholder"
                    )}
                  />
                  <PageHeader className="d-flex flex-row align-items-center justify-content-between w-100">
                    <PageTitle className="d-flex flex-row w-100">
                      {t("admin:discussion.management:page.title")}
                      <strong className="ml-1">
                        {searchAccountEnabled
                          ? accountSearchCount
                          : discussionListCount?.all ?? 0}
                      </strong>
                    </PageTitle>
                  </PageHeader>
                  <div
                    className="custom-tabs admin-panel-tab discussion-tab"
                    style={{ marginBottom: "28px" }}
                  >
                      {!searchAccountEnabled && (
                    <Nav variant="tabs" defaultActiveKey="all" activeKey={key}>
                      <Nav.Link
                        className="nav-item"
                        eventKey="all"
                        onClick={() => setActiveTab("all")}
                      >
                        All <strong>{discussionListCount?.all ?? 0}</strong>
                      </Nav.Link>
                      <Nav.Link
                        className="nav-item"
                        eventKey="internal"
                        onClick={() => setActiveTab("internal")}
                      >
                        Internal{" "}
                        <strong>{discussionListCount?.internal ?? 0}</strong>
                      </Nav.Link>
                      <Nav.Link
                        className="nav-item"
                        eventKey="external"
                        onClick={() => setActiveTab("external")}
                      >
                        External{" "}
                        <strong>{discussionListCount?.external ?? 0}</strong>
                      </Nav.Link>
                      <Nav.Link
                        className="nav-item"
                        eventKey="guest"
                        onClick={() => setActiveTab("guest")}
                      >
                        Guest <strong>{discussionListCount?.guest ?? 0}</strong>
                      </Nav.Link>
                    </Nav>
                      )}
                </div>

                  <DiscussionTable
                    headers={tableHeaders}
                    data={dataset}
                    dataCount={
                      searchAccountEnabled ? accountSearchCount : discussionFilteredCount
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
                  <AdminDiscussionDetails />
                </Col>
              </>
            )}
          </Row>
        </div>
      </Col>
    </>
  );
}
export default DiscussionManagement;
