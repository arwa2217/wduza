import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  Fragment,
} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AngleLeft from "../../../../assets/icons/angle-left.svg";
import AngleRight from "../../../../assets/icons/angle-right.svg";
import SortAsc from "../../../../assets/icons/asc-sort.svg";
import SortDesc from "../../../../assets/icons/desc-sort.svg";
import FilterDown from "../../../../assets/icons/filter-down.svg";
import RedirectIcon from "../../../../assets/icons/redirect-icon.svg";
import File from "../file";
import FileActivity from "../fileActivity/fileActivity";
import PostProfilePicture from "../postProfilePicture/postProfilePicture";
import { useDispatch, useSelector } from "react-redux";
import ExternalDiscussionImg from "../../../../assets/icons/external-discussion.svg";
import NDAIconImg from "../../../../assets/icons/nda-icon.svg";
import {
  setActivePanelAction,
  setSelectedFileAction,
  updateFilePanelState,
} from "../../../../store/actions/config-actions";
import {
  clearFwdPost,
  fetchFileSummaryDetails,
  fetchForwardPost,
  setSelectedFiles,
} from "../../../../store/actions/main-files-actions";
import LocalDateTime from "../../../local-date-time/local-date-time";
import { useTranslation } from "react-i18next";
import {
  GetFilesListAction,
  GetFilesListActionNew,
} from "../../../../store/actions/main-files-actions";
import { getSearchResultWithFile } from "../../../../store/actions/folderAction";
import GuestDiscussionImg from "../../../../assets/icons/guest-discussion.svg";
import { FILES_MENU_ITEMS } from "../../../../constants/files-menu-items";
import { filesConstants } from "../../../../constants/files";
import DefaultUser from "../../../../assets/icons/default-user.svg";
import moment from "moment";
import { UPDATE_LAST_FILE_SEARCH_QUERY } from "../../../../store/actionTypes/folder-action-types";

function CustomTable(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);
  let selectedFileKey = useSelector(
    (state) => state.config.activeFileMenuItem?.fileKey
  );
  let fileFilterObject = useSelector(
    (state) => state.mainFilesReducer?.fileFilterObject
  );
  const activeSelectedFileId = useSelector(
    (state) => state.config.activeSelectedFileId
  );
  const fetchingFiles = useSelector(
    (state) => state.mainFilesReducer.fetchFiles
  );
  const selectedFiles = useSelector(
    (state) => state.mainFilesReducer.selectedFiles
  );
  const searchFileEnabled = useSelector(
    (state) => state.folderReducer.searchFileEnabled
  );
  const searchObject = useSelector(
    (state) => state.folderReducer.currentSearchFilter
  );
  let summaryFileDetails = useSelector(
    (state) => state.mainFilesReducer.summaryFileDetails
  );
  const filePanelActive = useSelector((state) => state.config.filePanelActive);
  const [allSelected, setAllSelected] = useState(false);
  const [fields, setFields] = useState([]);
  const [sortDirection, setSortDirection] = useState(fileFilterObject?.order);
  const [sortKey, setSortKey] = useState(fileFilterObject?.sort);
  const [x, setX] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeElWidth, SetActiveElWidth] = useState(0);
  const [activePagination, SetActivePagination] = useState(1);
  const tableRef = useRef(null);

  const terms = useSelector((state) => state.folderReducer.terms);
  const selectedFolderId = useMemo(
    () => activeFileMenu?.folderId,
    [activeFileMenu]
  );
  const [resetOffset, setResetOffset] = useState(false);
  useEffect(() => {
    if (searchFileEnabled) {
      SetActivePagination(1);
    }
  }, [searchFileEnabled]);
  useEffect(() => {
    if (activeFileMenu) {
      setSortKey(filesConstants.SORT_BY);
      setSortDirection(filesConstants.DESC);
    }
  }, [activeFileMenu]);

  const headerColumns = props.headers.map((header) => {
    return {
      ...header,
      ref: useRef(),
    };
  });

  const currentUser = useSelector((state) => state.AuthReducer.user.id);
  let startDateVal =
    searchObject.startTimeView && new Date(searchObject.startTimeView);
  let endDateVal =
    searchObject.stopTimeView && new Date(searchObject.stopTimeView);
  let startTimeSend = startDateVal
    ? moment.utc(startDateVal).format("YYYY-MM-DD HH:mm:ss")
    : "";
  let stopTimeSend = endDateVal
    ? moment.utc(endDateVal).format("YYYY-MM-DD HH:mm:ss")
    : "";
  // const selectedFiles = useMemo(
  //   () => fields.filter((file) => file.checked),
  //   [fields]
  // );

  const handleSort = (event, sortingKey) => {
    if (sortingKey) {
      // const data = [...fields];
      let nextDirection;
      if (sortingKey === sortKey) {
        if (sortDirection === "") {
          nextDirection = filesConstants.ASC;
        }
        if (sortDirection === filesConstants.ASC) {
          nextDirection = filesConstants.DESC;
        }
        if (sortDirection === filesConstants.DESC) {
          nextDirection = "";
        }
      } else {
        nextDirection = filesConstants.ASC;
      }

      // if (
      //   nextDirection === filesConstants.ASC ||
      //   nextDirection === filesConstants.DESC
      // ) {
      //   data.sort((a, b) => {
      //     let firstKey = a[sortingKey].toLowerCase();
      //     let secondKey = b[sortingKey].toLowerCase();

      //     if (sortingKey === "date") {
      //       firstKey = new Date(a[sortingKey]);
      //       secondKey = new Date(b[sortingKey]);
      //     }

      //     if (firstKey < secondKey) {
      //       return nextDirection === filesConstants.ASC
      //         ? -1
      //         : nextDirection === filesConstants.DESC
      //         ? 1
      //         : 0;
      //     }
      //     if (firstKey > secondKey) {
      //       return nextDirection === filesConstants.ASC
      //         ? 1
      //         : nextDirection === filesConstants.DESC
      //         ? -1
      //         : 0;
      //     }
      //     return 0;
      //   });
      // }
      setSortKey(sortingKey);
      setSortDirection(nextDirection);
      // setFields(nextDirection === "" ? props.data : data);
      if (searchFileEnabled) {
        dispatch({
          type: UPDATE_LAST_FILE_SEARCH_QUERY,
          payload: {
            ...{
              value: searchObject.value,
              discussionId: searchObject.discussionId,
              discussion: searchObject.discussion,
              folder: searchObject.folder,
              startTimeView: searchObject.startTimeView,
              stopTimeView: searchObject.stopTimeView,
              folderId: searchObject.folderId,
              fileType: searchObject.fileType,
              activityType: searchObject.activityType,
              authorValue: searchObject.authorValue,
              mentionedValue: searchObject.mentionedValue,
              target: searchObject.target,
              sortDirection: nextDirection
                ? nextDirection.toLocaleLowerCase()
                : "",
              sortFilter: nextDirection ? sortingKey : "",
              fileFilter: searchObject.fileFilter,
            },
          },
        });
        dispatch(
          getSearchResultWithFile(
            searchObject.value,
            filesConstants.ITEM_COUNT * (activePagination - 1),
            filesConstants.ITEM_COUNT,
            searchObject.discussionId,
            false,
            searchObject.fileType,
            searchObject.activityType,
            startTimeSend,
            stopTimeSend,
            searchObject.folderId,
            searchObject.authorValue !== undefined
              ? searchObject.authorValue.id
                ? searchObject.authorValue.id
                : ""
              : undefined,
            searchObject.mentionedValue !== undefined
              ? searchObject.mentionedValue.id
                ? searchObject.mentionedValue.id
                : ""
              : undefined,
            searchObject.target,
            nextDirection ? sortingKey : "",
            nextDirection ? nextDirection.toLocaleLowerCase() : "",
            searchObject.fileFilter
          )
        );
      } else {
        dispatch(
          GetFilesListAction(
            {
              ...fileFilterObject,
              sort: nextDirection ? sortingKey : "date",
              order: nextDirection
                ? nextDirection.toLocaleLowerCase()
                : filesConstants.DESC,
              offset: resetOffset ? 0 : fileFilterObject.offset,
            },
            true
          )
        );
      }
      if (resetOffset) {
        setResetOffset(false);
      }
    }
  };

  const clearChecks = () => {
    let newFields = fields.map((field) => ({
      ...field,
      checked: false,
    }));
    setFields(newFields);
    setAllSelected(false);
  };

  const handleAllRowSelection = () => {
    let newFields = fields.map((field) => ({
      ...field,
      checked: !allSelected,
    }));
    setFields(newFields);
    setAllSelected(!allSelected);
    dispatch(setSelectedFiles(newFields.filter((i) => i.checked)));
    if (newFields?.length)
      dispatch(updateFilePanelState(summaryFileDetails ? true : !allSelected));
  };

  const handleRowSelection = (e, item, index) => {
    e.stopPropagation();
    let newState = [...fields];
    let currentValue = newState[index].checked;
    newState[index] = {
      ...fields[index],
      checked: !currentValue,
    };
    let isAllRowSelected = newState.every((el) => el.checked);
    setAllSelected(isAllRowSelected ? true : false);
    let selectedList = newState.filter((i) => i.checked);
    dispatch(setSelectedFiles(selectedList));
    dispatch(
      updateFilePanelState(summaryFileDetails ? true : selectedList?.length > 0)
    );
    setFields(newState);
  };

  const handleMouseDown = (e, index, ref) => {
    e.preventDefault();
    e.stopPropagation();
    SetActiveElWidth(ref.current.clientWidth);
    setX(e.clientX);
    setActiveIndex(index);
  };

  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(null);
      setX(0);
      SetActiveElWidth(0);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setActiveIndex]
  );

  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      headerColumns.map((col, index) => {
        if (index === activeIndex) {
          let diff = e.clientX - x;
          let currentRef = col.ref.current;
          if (activeElWidth + diff <= col.width) {
            return (currentRef.style.width = `${col.width}px`);
          }
          let dynamicWidth = activeElWidth + diff;
          return (currentRef.style.width = `${dynamicWidth}px`);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex]
  );

  const handleTypeChange = (filterFor, type) => {
    let obj = {};
    obj[filterFor] = type;
    if (resetOffset) {
      obj.offset = 0;
      setResetOffset(false);
    }
    obj.offset = 0;
    SetActivePagination(1);
    if (
      filterFor === "activity" &&
      Object.keys(fileFilterObject).includes("activity") &&
      type === fileFilterObject.activity
    ) {
      delete fileFilterObject.activity;
      delete obj.activity;
    } else if (
      Object.keys(fileFilterObject).includes(filterFor) &&
      type === fileFilterObject[filterFor]
    ) {
      obj[filterFor] = "all";
    }

    if (props.tabKey === "new") {
      let startDate = moment
        .utc()
        .subtract(1, "days")
        .format("YYYY-MM-DD HH:mm:ss");
      let endDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
      let fileType =
        obj.fileType === undefined ? fileFilterObject.fileType : obj.fileType;
      let activity =
        obj.activity === undefined ? fileFilterObject.activity : obj.activity;

      let dataObj = {
        searchText: "",
        pageOffset: filesConstants.OFFSET,
        pageCount: filesConstants.ITEM_COUNT,
        discussionId: "",
        exact: false,
        fileType: fileType,
        activityType: activity === undefined ? "all" : activity,
        startTime: startDate,
        stopTime: endDate,
        folderId: selectedFolderId === undefined ? "" : selectedFolderId,
        author: "",
        mention: "",
      };

      let filterObj = {
        ...fileFilterObject,
        ...obj,
        popular:
          activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_POPULAR
            ? true
            : false,
        recent: activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_RECENT,
      };
      dispatch(GetFilesListActionNew(dataObj, filterObj));
    } else {
      let activity = searchObject.activityType;
      let fileType = searchObject.fileType;
      let fileFilter = searchObject.fileFilter;

      if (filterFor === "activity") {
        activity = type;
      }
      if (filterFor === "file") {
        fileFilter = type;
      }
      if (filterFor === "fileType") {
        fileType = type;
      }
      if (searchFileEnabled) {
        dispatch({
          type: UPDATE_LAST_FILE_SEARCH_QUERY,
          payload: {
            ...{
              value: searchObject.value,
              discussionId: searchObject.discussionId,
              discussion: searchObject.discussion,
              folder: searchObject.folder,
              startTimeView: searchObject.startTimeView,
              stopTimeView: searchObject.stopTimeView,
              folderId: searchObject.folderId,
              fileType: fileType,
              activityType: activity,
              authorValue: searchObject.authorValue,
              mentionedValue: searchObject.mentionedValue,
              target: searchObject.target,
              sortDirection: searchObject.sortDirection,
              sortFilter: searchObject.sortFilter,
              fileFilter: fileFilter,
            },
          },
        });
        dispatch(
          getSearchResultWithFile(
            searchObject.value,
            filesConstants.ITEM_COUNT * (activePagination - 1),
            filesConstants.ITEM_COUNT,
            searchObject.discussionId,
            false,
            fileType,
            activity,
            startTimeSend,
            stopTimeSend,
            searchObject.folderId,
            searchObject.authorValue !== undefined
              ? searchObject.authorValue.id
                ? searchObject.authorValue.id
                : ""
              : undefined,
            searchObject.mentionedValue !== undefined
              ? searchObject.mentionedValue.id
                ? searchObject.mentionedValue.id
                : ""
              : undefined,
            searchObject.target,
            searchObject.sortFilter,
            searchObject.sortDirection,
            fileFilter
          )
        );
      } else {
        dispatch(
          GetFilesListAction(
            {
              ...fileFilterObject,
              ...obj,
            },
            true
          )
        );
      }
    }
  };

  const toggleRowClick = (e, row) => {
    e.stopPropagation();
    dispatch(setSelectedFileAction(row));
    dispatch(
      fetchFileSummaryDetails(
        row.fileId,
        row.channelId,
        row.postId,
        row.folderId,
        row.queryUserType,
        true
      )
    );
    let itemFileId = `${row.fileId}-${row.folderId}-${row.channelId}-${row.postId}`;
    dispatch(
      updateFilePanelState(activeSelectedFileId === itemFileId ? false : true)
    );

    if (row?.forwardedPost?.post?.id) {
      dispatch(fetchForwardPost(row.forwardedPost.post.id, row.channelId));
    } else dispatch(clearFwdPost());
  };

  const handlePaginationClick = (e) => {
    let number = Number(e.target.textContent);
    SetActivePagination(number);
    if (searchFileEnabled) {
      // SetActivePagination(number);
      dispatch(
        getSearchResultWithFile(
          searchObject.value,
          filesConstants.ITEM_COUNT * (number - 1),
          filesConstants.ITEM_COUNT,
          searchObject.discussionId,
          false,
          searchObject.fileType,
          searchObject.activityType,
          startTimeSend,
          stopTimeSend,
          searchObject.folderId,
          searchObject.authorValue !== undefined
            ? searchObject.authorValue.id
              ? searchObject.authorValue.id
              : ""
            : undefined,
          searchObject.mentionedValue !== undefined
            ? searchObject.mentionedValue.id
              ? searchObject.mentionedValue.id
              : ""
            : undefined,
          searchObject.target,
          searchObject.sortFilter,
          searchObject.sortDirection,
          searchObject.fileFilter,
          activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_POPULAR
            ? true
            : false
        )
      );
    } else {
      let fileKey = activeFileMenu?.fileKey;
      let folderObj = {};
      if (resetOffset) {
        folderObj.offset = 0;
        setResetOffset(false);
      }
      folderObj.offset = filesConstants.ITEM_COUNT * (number - 1);
      folderObj.folder = selectedFolderId;
      if (!selectedFolderId) {
        delete folderObj.folder;
      }
      if (fileKey === FILES_MENU_ITEMS.FILES_POPULAR) {
        folderObj.popular = true;
      }
      if (fileKey === FILES_MENU_ITEMS.FILES_RECENT) {
        folderObj.recent = true;
      }
      if (props.tabKey === "new") {
        let startDate = moment
          .utc()
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ss");
        let endDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        let dataObj = {
          searchText: "",
          pageOffset: filesConstants.ITEM_COUNT * (number - 1),
          pageCount: filesConstants.ITEM_COUNT,
          discussionId: "",
          exact: false,
          fileType: fileFilterObject.fileType,
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

        let filterObj = {
          ...fileFilterObject,
          ...folderObj,
          popular:
            activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_POPULAR
              ? true
              : false,
          recent: activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_RECENT,
        };

        dispatch(GetFilesListActionNew(dataObj, filterObj));
      } else {
        // SetActivePagination(number);
        dispatch(
          GetFilesListAction(
            {
              ...fileFilterObject,
              ...folderObj,
            },
            true
          )
        );
      }
    }
    if (allSelected) setAllSelected(false);
  };

  const handlePaginationArrowClick = (e) => {
    let number = activePagination;
    if (e === "left") {
      number -= 1;
    } else {
      number += 1;
    }
    let fileKey = activeFileMenu?.fileKey;
    let folderObj = {};
    if (resetOffset) {
      folderObj.offset = 0;
      setResetOffset(false);
    }

    if (allSelected) setAllSelected(false);

    folderObj.offset = filesConstants.ITEM_COUNT * (number - 1);
    folderObj.folder = selectedFolderId;
    if (!selectedFolderId) delete folderObj.folder;
    if (fileKey === FILES_MENU_ITEMS.FILES_POPULAR) folderObj.popular = true;
    else if (fileKey === FILES_MENU_ITEMS.FILES_RECENT) folderObj.recent = true;
    if (searchFileEnabled) {
      SetActivePagination(number);
      dispatch(
        getSearchResultWithFile(
          searchObject.value,
          filesConstants.ITEM_COUNT * (number - 1),
          filesConstants.ITEM_COUNT,
          searchObject.discussionId,
          false,
          searchObject.fileType,
          searchObject.activityType,
          startTimeSend,
          stopTimeSend,
          searchObject.folderId,
          searchObject.authorValue !== undefined
            ? searchObject.authorValue.id
              ? searchObject.authorValue.id
              : ""
            : undefined,
          searchObject.mentionedValue !== undefined
            ? searchObject.mentionedValue.id
              ? searchObject.mentionedValue.id
              : ""
            : undefined,
          searchObject.target,
          searchObject.sortFilter,
          searchObject.sortDirection,
          searchObject.fileFilter,
          activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_POPULAR
            ? true
            : false
        )
      );
    } else {
      SetActivePagination(number);
      if (props.tabKey === "new") {
        let startDate = moment
          .utc()
          .subtract(1, "days")
          .format("YYYY-MM-DD HH:mm:ss");
        let endDate = moment.utc().format("YYYY-MM-DD HH:mm:ss");
        let dataObj = {
          searchText: "",
          pageOffset: filesConstants.ITEM_COUNT * (number - 1),
          pageCount: filesConstants.ITEM_COUNT,
          discussionId: "",
          exact: false,
          fileType: fileFilterObject.fileType,
          activityType:
            fileFilterObject.activity === undefined
              ? "all"
              : fileFilterObject.activity,
          startTime: startDate,
          stopTime: endDate,
          folderId: selectedFolderId === undefined ? "" : selectedFolderId,
          author: "",
          mention: "",
          file: fileFilterObject.file,
        };

        let filterObj = {
          ...fileFilterObject,
          ...folderObj,
          popular:
            activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_POPULAR
              ? true
              : false,
          recent: activeFileMenu?.fileKey === FILES_MENU_ITEMS.FILES_RECENT,
        };

        dispatch(GetFilesListActionNew(dataObj, filterObj));
      } else {
        dispatch(
          GetFilesListAction(
            {
              ...fileFilterObject,
              ...folderObj,
            },
            true
          )
        );
      }
    }
  };

  useEffect(() => {
    SetActivePagination(1);
  }, [selectedFolderId, selectedFileKey]);

  useEffect(() => {
    if (activeIndex !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    props.getSelectedFiles(selectedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFiles]);

  useEffect(() => {
    setResetOffset(true);
    SetActivePagination(1);
    dispatch(setSelectedFileAction(null));
    dispatch(updateFilePanelState(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tabKey]);

  useEffect(() => {
    if (props.data) {
      setFields(props.data);
      renderPagination(props.dataCount);
    }
    if (allSelected) setAllSelected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.dataCount, props.tabKey]);

  const customToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="d-block"
      style={{ minHeight: "20px" }}
    >
      {children}
      <span className="table-filter-icon">
        <img src={FilterDown} alt="FilterDown" />
      </span>
    </span>
  ));

  const renderHead = (viewType) => {
    return (
      <div className="custom-table-row">
        {headerColumns.map(
          (
            {
              id,
              text,
              ref,
              filter = false,
              sortable = false,
              resize = true,
              width,
              align = "left",
              filterItem = [],
            },
            index
          ) => (
            <Fragment key={`Fragment-${id}`}>
              <div
                key={id}
                className={`custom-table-cell ${filter ? "table-filter" : ""} ${
                  sortable ? "table-sort" : ""
                } ${align ? "text-" + align : ""} ${
                  activeIndex === index
                    ? " table-resize-active"
                    : " table-resize-idle"
                }`}
                ref={ref}
                onClick={sortable ? (e) => handleSort(e, id) : null}
                style={{ width: width }}
              >
                {index === 0 && (
                  <div className="custom-control custom-checkbox custom-checkbox-green">
                    <input
                      type="checkbox"
                      className="custom-control-input custom-control-input-green"
                      id="all"
                      checked={allSelected}
                      onChange={handleAllRowSelection}
                    />
                    <label
                      className="custom-control-label pointer-on-hover"
                      htmlFor="all"
                    ></label>
                  </div>
                )}
                {filter ? (
                  (props.tabKey === "unread" || props.tabKey === "read") &&
                  index === 0 ? (
                    text
                  ) : (
                    <Dropdown>
                      <Dropdown.Toggle
                        as={customToggle}
                        id="dropdown-filter-file"
                      >
                        {text}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {filterItem.map((item, index) => {
                          return (
                            <Dropdown.Item
                              key={`dropdown-item-${item.id}-${index}`}
                              onClick={() => handleTypeChange(id, item.id)}
                              active={
                                id === "file"
                                  ? fileFilterObject?.file === item.id
                                  : id === "fileType"
                                  ? fileFilterObject?.fileType === item.id
                                  : id === "activity"
                                  ? fileFilterObject?.activity === item.id
                                  : false
                              }
                              disabled={
                                (props.tabKey === "unread" ||
                                  props.tabKey === "read") &&
                                item.id === "uploaded"
                                  ? true
                                  : false
                              }
                            >
                              {item.text}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  )
                ) : (
                  text
                )}
                {sortable && (
                  <span className="table-sort-icon">
                    {sortKey === id ? (
                      sortDirection === "" ? (
                        <img
                          src={SortAsc}
                          style={{ opacity: 0.3 }}
                          alt="SortAsc"
                        />
                      ) : sortDirection === filesConstants.ASC ? (
                        <img src={SortAsc} alt="SortAsc" />
                      ) : (
                        <img src={SortDesc} alt="SortDesc" />
                      )
                    ) : (
                      <img
                        src={SortAsc}
                        style={{ opacity: 0.3 }}
                        alt="SortAsc"
                      />
                    )}
                  </span>
                )}
                {viewType === filesConstants.VIEW_TABLE && resize && (
                  <span
                    onMouseDown={(e) => handleMouseDown(e, index, ref)}
                    className={`resize-handle ${
                      activeIndex === index ? "resize-active" : "resize-idle"
                    }`}
                  ></span>
                )}
              </div>
            </Fragment>
          )
        )}
      </div>
    );
  };
  const renderRow = () => {
    return fields.map((item, index) => {
      let itemFileId = `${item.fileId}-${item.folderId}-${item.channelId}-${item.postId}`;
      return (
        <div
          key={itemFileId}
          className={`custom-table-row ${activeSelectedFileId === itemFileId ? "row-selected " : ""} ${
            item && item.checked !== undefined && item.checked
              ? "row-checked "
              : ""
          } ${item && item.creatorId === currentUser ? "row-uploaded" : ""}`}
          onClick={(e) => toggleRowClick(e, item)}
        >
          <div className="custom-table-cell">
            <div className="custom-control custom-checkbox custom-checkbox-green">
              <input
                type="checkbox"
                className="custom-control-input custom-control-input-green"
                id={itemFileId}
                onChange={(e) => handleRowSelection(e, item, index)}
                checked={fields[index].checked}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor={itemFileId}
              ></label>
            </div>
            <span className="custom-table-cell-text">{item.name}</span>
          </div>
          <div className="custom-table-cell text-center">{item.extension}</div>
          <div className="custom-table-cell text-center">{item.size}</div>
          <div className="custom-table-cell text-center">{item.uploader}</div>
          <div className="custom-table-cell text-center">
            <LocalDateTime
              eventTime={new Date(item.date).getTime()}
              timeFormat={"date.format"}
            />
          </div>
          <div className="custom-table-cell">
            <div className="d-flex justify-content-between">
              <span className="desc-text">{item.folder}</span>
              <div>
                {item.advanceChannel && (
                  <img
                    src={NDAIconImg}
                    className="advance-chanel"
                    alt="NDAIconImg"
                  />
                )}
                {item.externalChannel && (
                  <img
                    src={ExternalDiscussionImg}
                    className="external-chanel"
                    alt="ExternalDiscussionImg"
                  />
                )}
                {item.guestChannel && (
                  <img
                    src={GuestDiscussionImg}
                    className="guest-chanel"
                    alt="GuestDiscussionImg"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="custom-table-cell text-center">{item.region}</div>
          <div className="custom-table-cell text-center">
            <div className="d-flex">
              <FileActivity
                {...item}
                currentUser={currentUser}
                isSidePanel={false}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  const renderGrid = () => {
    return fields.length > 0 ? (
      fields.map((item, index) => {
        let itemFileId = `${item.fileId}-${item.folderId}-${item.channelId}-${item.postId}`;
        return (
          <div
            key={itemFileId}
            className={`custom-grid-cell ${
              item &&
              item.creatorId !== currentUser &&
              !item.viewedBySelf &&
              !item.downloadedBySelf &&
              !item.forwardedBySelf &&
              !item.sharedBySelf
                ? "row-unread"
                : ""
            } ${activeSelectedFileId === itemFileId ? "row-selected " : ""} ${
              item && item.checked !== undefined && item.checked
                ? "row-checked "
                : ""
            } ${item && item.creatorId === currentUser ? "row-uploaded" : ""}`}
            // onClick={(e) => toggleRowClick(e, item)}
          >
            <div className="custom-grid-header">
              <div className="custom-control custom-checkbox custom-checkbox-green">
                <input
                  type="checkbox"
                  className="custom-control-input custom-control-input-green"
                  id={itemFileId}
                  onChange={(e) => handleRowSelection(e, item, index)}
                  checked={fields[index].checked}
                />
                <label
                  className="custom-control-label pointer-on-hover"
                  htmlFor={itemFileId}
                ></label>
              </div>
              <div className="post__header w-75">
                <PostProfilePicture
                  // post={message.post}
                  src={item.userImg ? item.userImg : DefaultUser}
                  user={{ displayName: item.uploader }}
                  showNameOnly={false}
                  eventTime={item.date}
                  // isSystemMessage={isSystemMessage}
                  isOwner={item.creatorId === currentUser}
                />
              </div>
              <div className="redirect-icon" channelId={item.channelId}>
                <img
                  src={RedirectIcon}
                  alt=""
                  // className={!item.channelId ? "disable-redirection" : ""}
                  onClick={(e) => toggleRowClick(e, item)}
                />
              </div>
            </div>
            <div className="custom-grid-content">
              <File
                {...item}
                channelFilesList={[
                  {
                    fileId: item.fileId,
                    fileName: item.name,
                    mimeType: item.mimeType,
                    fileSize: item.size,
                    channelId: item.channelId,
                    postId: item.postId,
                    folderId: item.folderId,
                    creatorId: item.creatorId,
                  },
                ]}
                isSidePanel={false}
              />
              <div className="file-activity">
                <FileActivity
                  {...item}
                  currentUser={currentUser}
                  isSidePanel={false}
                />
              </div>
            </div>

            <div className="custom-grid-footer">
              <div className="d-flex justify-content-between">
                <span className="desc-text">{item.folder}</span>
                <div>
                  {item.advanceChannel && (
                    <img
                      src={NDAIconImg}
                      className="advance-chanel"
                      alt="NDAIconImg"
                    />
                  )}
                  {item.externalChannel && (
                    <img
                      src={ExternalDiscussionImg}
                      className="external-chanel"
                      alt="ExternalDiscussionImg"
                    />
                  )}
                </div>
              </div>
              {/* Monoly: Service */}
            </div>
          </div>
        );
      })
    ) : searchFileEnabled ? (
      <div className="text-center p-5 w-100">
        {t("discussion.summary:search.panel:no.search.results.for.the", {
          terms: `"${terms}"`,
        })}
      </div>
    ) : (
      <div className="text-center p-5 w-100">{t("no.data.available")}</div>
    );
  };

  const renderPagination = (dataCount) => {
    let maxItemCount = filesConstants.MAX_ITEM_SHOW;
    let totalCount = Math.ceil(dataCount / filesConstants.ITEM_COUNT);
    let startPage =
      Math.floor((activePagination - 1) / maxItemCount) * maxItemCount;

    let endPage = 0;
    if (startPage + maxItemCount > totalCount) {
      endPage = startPage + totalCount - startPage;
    } else {
      endPage = startPage + maxItemCount;
    }
    let finalTotalCount = [];
    for (let index = startPage; index < endPage; index++) {
      finalTotalCount.push(index + 1);
    }
    return (
      <ul className="pagination pagination-sm">
        <li
          className={`page-item ${activePagination === 1 ? "disabled" : ""}`}
          onClick={
            activePagination === 1
              ? undefined
              : () => handlePaginationArrowClick("left")
          }
        >
          <a className="page-link" role="button" tabIndex="0" href>
            <img src={AngleLeft} alt="Prev" />
          </a>
        </li>
        {finalTotalCount.map((number) => (
          <li
            className={`page-item ${
              number === activePagination ? "active" : ""
            }`}
            key={number}
            onClick={(e) => handlePaginationClick(e)}
          >
            <a className="page-link" role="button" tabIndex="0" href>
              {number}
            </a>
          </li>
        ))}
        <li
          className={`page-item ${
            activePagination === totalCount ? "disabled" : ""
          }`}
          onClick={
            activePagination === totalCount
              ? undefined
              : () => handlePaginationArrowClick("right")
          }
        >
          <a className="page-link" role="button" tabIndex="0" href>
            <img src={AngleRight} alt="Next" />
          </a>
        </li>
      </ul>
    );
  };

  return (
    <div
      className="custom-table-wrapper"
      style={
        props.searchFileEnabled
          ? { height: `calc(100vh - 252px)` }
          : { height: `calc(100vh - 210px)` }
      }
    >
      {props.view === filesConstants.VIEW_TABLE && (
        <>
          <div className="table custom-table" ref={tableRef}>
            <div className="custom-table-head">{renderHead(props.view)}</div>

            <div className="custom-table-body">
              {!fetchingFiles && fields.length > 0 && renderRow()}
            </div>
          </div>
          {fetchingFiles ? (
            <div className="text-center p-5">{t("loading")}</div>
          ) : fields.length > 0 ? (
            ""
          ) : searchFileEnabled ? (
            <div className="text-center p-5">
              {t("discussion.summary:search.panel:no.search.results.for.the", {
                terms: `"${terms}"`,
              })}
            </div>
          ) : (
            <div className="text-center p-5">{t("no.data.available")}</div>
          )}
        </>
      )}

      {props.view === filesConstants.VIEW_GRID && (
        <>
          <div className="table custom-table mb-0" ref={tableRef}>
            <div className="custom-table-head">{renderHead(props.view)}</div>
          </div>
          <div className="custom-grid-body">
            <div className="custom-grid-row">
              {fetchingFiles ? (
                <div className="text-center p-5 w-100">{t("loading")}</div>
              ) : (
                renderGrid()
              )}
            </div>
          </div>
        </>
      )}
      {!fetchingFiles &&
        props.dataCount > filesConstants.ITEM_COUNT &&
        renderPagination(props.dataCount)}
    </div>
  );
}

export default CustomTable;
