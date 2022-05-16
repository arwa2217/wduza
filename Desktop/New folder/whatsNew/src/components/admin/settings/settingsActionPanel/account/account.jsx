import React, { useEffect, useMemo, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
// import CustomGrid from "./customGrid";
import ListView from "../../../../../assets/icons/list-view.svg";
import GridView from "../../../../../assets/icons/grid-view.svg";
// import "../../mainframe/mainframe.css";
import { useTranslation } from "react-i18next";
// import FileSearchInput from "../../global-search/file-search-input";
// import FilesBreadcrumbs from "../filesBreadcrumbs/filesBreadcrumbs";
// import FileActions from "../filesActions/filesActions";
// import FilesSidePanel from "../filesSidePanel/filesSidePanel";
import { useSelector, useDispatch } from "react-redux";
// import FilesSummeryTopBar from "../filesSummeryTopBar";
// import {
//   updateFilePanelState,
// } from "../../../store/actions/config-actions";
// import {
//   GetFilesListAction,
//   GetFilesListActionNew,
// } from "../../../store/actions/main-files-actions";
import moment from "moment";
// import { filesConstants } from "../../../constants/files";

function Account(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const globalMembersList = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );
  let fileFilterObject = useSelector(
    (state) => state.mainFilesReducer.fileFilterObject
  );
  let selectedFolderId = useSelector(
    (state) => state.config?.activeFileMenuItem?.folderId
  );
  let filesTabCount = useSelector(
    (state) => state.mainFilesReducer.filesTabCount
  );
  let filteredCount = useSelector(
    (state) => state.mainFilesReducer.filteredCount
  );
  const channelList = useSelector((state) => state.ChannelReducer.channelList);
  const folderList = useSelector((state) => state.folderReducer.folderList);

  let folderSearchFileList = useSelector(
    (state) => state.folderReducer.folderSearchFileList
  );
  const searchFileEnabled = useSelector(
    (state) => state.folderReducer.searchFileEnabled
  );
  const searchCount = useSelector((state) => state.folderReducer.searchCount);
  let filesList = useSelector((state) => state.mainFilesReducer.filesList);
  let updater = useSelector((state) => state.fileReducer.updater);

  const [showDetails, setShowDetails] = useState(true);
  const [key, setKey] = useState("all");
  const filePanelActive = useSelector((state) => state.config.filePanelActive);
  const [view, setView] = useState("TABLE");
  const [isActive, setIsActive] = useState(filePanelActive);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isEnable, setIsEnable] = useState(false);

  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);
  let forwardFileToDiscussion = useSelector(
    (state) => state.mainFilesReducer.forwardFileToDiscussion
  );

 

  const tableHeaders = [
    {
      id: "file",
      text: "File",
      filter: true,
      filterItem: [
        {
          id: "all",
          text: "All",
        },
        {
          id: "uploaded",
          text: "My Upload",
        },
      ],
      width: 140,
    },
    {
      id: "fileType",
      text: "Type",
      filter: true,
      filterItem: [
        {
          id: "all",
          text: "All file type",
        },
        {
          id: "document",
          text: "Document",
        },
        {
          id: "pdf",
          text: "PDF",
        },
        {
          id: "presentation",
          text: "Presentation",
        },
        {
          id: "spreadsheet",
          text: "Spreadsheet",
        },
        {
          id: "image",
          text: "Image",
        },
        {
          id: "video-audio",
          text: "Video & Audio",
        },
        {
          id: "others",
          text: "Other file",
        },
      ],
      width: 70,
      align: "center",
    },
    {
      id: "size",
      text: "Size",
      sortable: true,
      width: 70,
      align: "center",
    },
    {
      id: "uploader",
      text: "Uploader",
      sortable: true,
      width: 90,
      align: "center",
    },
    {
      id: "date",
      text: "Upload Date",
      sortable: true,
      width: 105,
      align: "center",
    },
    {
      id: "folder",
      text: "Discussion/Folder",
      // sortable: true,
      width: 160,
    },
    {
      id: "activity",
      text: "Activity",
      filter: true,
      filterItem: [
        {
          id: "download",
          text: "Downloaded by me",
        },
        {
          id: "viewed",
          text: "Viewed by me",
        },
        {
          id: "forwarded",
          text: "Forwarded to internal by me",
        },
        {
          id: "shared",
          text: "Shared with external by me",
        },
      ],
      resize: false,
      width: 230,
      align: "center",
    },
  ];

  const getSelectedFiles = (files) => {
    setSelectedFiles(files);
  };

  const toggleChannelDetails = () => {
    setShowDetails(!showDetails);
    // dispatch(updateFilePanelState(!filePanelActive));
  };

  const setActiveTab = (activeKey) => {
    setKey(activeKey);
    let startDate = moment
      .utc()
      .subtract(1, "days")
      .format("YYYY-MM-DD HH:mm:ss");
    let endDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    if (activeKey === "new") {
      let dataObj = {
        searchText: "",
        // pageOffset: filesConstants.OFFSET,
        // pageCount: filesConstants.ITEM_COUNT,
        discussionId: "",
        exact: false,
        fileType:
          fileFilterObject.fileType === undefined 
            ? "all"
            : fileFilterObject.fileType,
        activityType:
          fileFilterObject.activity === undefined
            ? "all"
            : fileFilterObject.activity,
        startTime: startDate,
        stopTime: endDate,
        folderId: selectedFolderId === undefined ? "" : selectedFolderId,
        author: "",
        mention: "",
      };
      let obj = {};
      // obj["file"] = activeKey;
      obj["offset"] = 0;
      let filterObj = {
        ...fileFilterObject,
        ...obj,
        recent: fileFilterObject.recent,
        file:
          fileFilterObject.file === undefined ||
          fileFilterObject.file !== "uploaded"? "all" : fileFilterObject.file,
      };
      // dispatch(GetFilesListActionNew(dataObj, filterObj));
    } else {
      let obj = {};
      obj["file"] = activeKey;
      obj["offset"] = 0;
      dispatch(
        // GetFilesListAction({
        //   ...fileFilterObject,
        //   ...obj,
        //   recent : !!fileFilterObject.recent 
        // })
      );
    }
  };

  useEffect(() => {
    if (filePanelActive !== undefined && filePanelActive !== isActive) {
      setIsActive(filePanelActive);
      if (filePanelActive) {
        setShowDetails(true);
      }
    }
  }, [filePanelActive]);

  return (
    <div
      className="d-flex flex-column w-100"
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
      <Row className="m-0">
        <Col className="p-0">
          {/* <FilesSummeryTopBar
            isActive={isActive}
            onToggleChannelDetails={toggleChannelDetails}
          /> */}
        </Col>
      </Row>
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
              {/* <FileSearchInput placeholder={t("global.search:files")} /> */}

              {/* <FilesBreadcrumbs
                searchFileEnabled={searchFileEnabled}
                searchCount={`${searchFileEnabled ? searchCount : 0}`}
              />
              <FileActions selectedFiles={selectedFiles} /> */}

              <div className="home-panel-tab files-tab">
                {!searchFileEnabled && (
                  <Nav variant="tabs" defaultActiveKey="all" activeKey={key}>
                    <Nav.Link
                      className="nav-item"
                      eventKey="all"
                      onClick={() => setActiveTab("all")}
                    >
                      All <strong>{filesTabCount?.allFiles ?? 0}</strong>
                    </Nav.Link>
                    <Nav.Link
                      className="nav-item"
                      eventKey="new"
                      onClick={() => setActiveTab("new")}
                    >
                      New <strong>{filesTabCount?.newFiles ?? 0}</strong>
                    </Nav.Link>
                    <Nav.Link
                      className="nav-item"
                      eventKey="unread"
                      onClick={() => setActiveTab("unread")}
                    >
                      Unread <strong>{filesTabCount?.unreadFiles ?? 0}</strong>
                    </Nav.Link>
                    <Nav.Link
                      className="nav-item"
                      eventKey="read"
                      onClick={() => setActiveTab("read")}
                    >
                      Read <strong>{filesTabCount?.readFiles ?? 0}</strong>
                    </Nav.Link>
                  </Nav>
                )}

                <div className="files-view">
                  <span
                    className="files-view-icon"
                    style={view === "GRID" ? {} : { opacity: ".3" }}
                    onClick={(e) => setView("GRID")}
                  >
                    <img src={GridView} alt="" />
                  </span>
                  <span
                    className="files-view-icon"
                    style={view === "TABLE" ? {} : { opacity: ".3" }}
                    onClick={(e) => setView("TABLE")}
                  >
                    <img src={ListView} alt="" />
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        {isActive && (
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
              className={"files-side-bar detailsBar col-sm-auto p-0 mr-0"}
            >
              {/* <FilesSidePanel /> */}
            </Col>
          </>
        )}
      </Row>
    </div>
  );
}

export default Account;
