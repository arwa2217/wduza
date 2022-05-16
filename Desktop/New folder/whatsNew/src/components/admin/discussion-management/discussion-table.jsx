import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Fragment,
} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import AngleLeft from "./../../../assets/icons/angle-left.svg";
import AngleRight from "./../../../assets/icons/angle-right.svg";
import SortAsc from "./../../../assets/icons/asc-sort.svg";
import SortDesc from "./../../../assets/icons/desc-sort.svg";
import FilterDown from "./../../../assets/icons/filter-down.svg";
import ExternalDiscussionIcon from "./../../../assets/icons/external-discussion.svg";
import GuestDiscussionIcon from "./../../../assets/icons/guest-discussion.svg";
import NDAIconImg from "./../../../assets/icons/nda-icon.svg";
import ChannelConstants from "../../../constants/channel/channel-constants";
import Badge from "react-bootstrap/Badge";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminSidebarPanel,
  setAdminSidebarActiveState,
  setAdminSidebarActiveIndex,
} from "../../../store/actions/config-actions";
import { useTranslation } from "react-i18next";
import { getAccountSearchResult } from "../../../store/actions/admin-account-action";
import {
  setSelectedDiscussions,
  fetchDiscussionData,
  getSearchResultWithDiscussion,
  setDiscussionSearchQuery,
  fetchDiscussionMemberData,
} from "../../../store/actions/admin-discussion-action";
import { discussionConstants } from "../../../constants/discussion-search";
import { SET_DISCUSSION_FILTER_OBJECT } from "../../../store/actionTypes/admin-discussion-action-types";

function DiscussionTable(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const activeMenuItem = useSelector((state) => state.config.activeMenuItem);

  const fetchingDiscussionList = useSelector(
    (state) => state.AdminDiscussionReducer.fetchingDiscussionList
  );
  const searchAccountEnabled = useSelector(
    (state) => state.AdminDiscussionReducer.searchAccountEnabled
  );
  const searchObject = useSelector(
    (state) => state.AdminDiscussionReducer.accountSearchObj
  );
  const selectedDiscussions = useSelector(
    (state) => state.AdminDiscussionReducer.selectedDiscussions
  );
  const discussionFilterObj = useSelector(
    (state) => state.AdminDiscussionReducer.discussionFilterObj
  );
  const [allSelected, setAllSelected] = useState(false);
  const [fields, setFields] = useState([]);
  const [sortDirection, setSortDirection] = useState(
    discussionFilterObj?.order
  );
  const [sortKey, setSortKey] = useState(discussionFilterObj?.orderby);
  const [x, setX] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeElWidth, SetActiveElWidth] = useState(0);
  const [activePagination, SetActivePagination] = useState(1);
  const tableRef = useRef(null);

  const terms = useSelector((state) => state.folderReducer.terms);

  const [resetOffset, setResetOffset] = useState(false);

  useEffect(() => {
    if (searchAccountEnabled) {
      SetActivePagination(1);
    }
  }, [searchAccountEnabled]);

  const headerColumns = props.headers.map((header) => {
    return {
      ...header,
      ref: useRef(),
    };
  });

  const handleSort = (event, sortingKey) => {
    if (sortingKey) {
      const data = [...fields];
      let nextDirection;
      if (sortingKey === sortKey) {
        if (sortDirection === "") {
          nextDirection = discussionConstants.ASC;
        }
        if (sortDirection === discussionConstants.ASC) {
          nextDirection = discussionConstants.DESC;
        }
        if (sortDirection === discussionConstants.DESC) {
          nextDirection = "";
        }
      } else {
        nextDirection = discussionConstants.ASC;
      }

      if (
        nextDirection === discussionConstants.ASC ||
        nextDirection === discussionConstants.DESC
      ) {
        data &&
          data.length > 0 &&
          data.sort((a, b) => {
            let firstKey = a[sortingKey].toLowerCase();
            let secondKey = b[sortingKey].toLowerCase();
            if (firstKey < secondKey) {
              return nextDirection === discussionConstants.ASC
                ? -1
                : nextDirection === discussionConstants.DESC
                ? 1
                : 0;
            }
            if (firstKey > secondKey) {
              return nextDirection === discussionConstants.ASC
                ? 1
                : nextDirection === discussionConstants.DESC
                ? -1
                : 0;
            }
            return 0;
          });
      }
      setSortKey(sortingKey);
      setSortDirection(nextDirection);

      setFields(nextDirection === "" ? props.data : data);
      dispatch({
        type: SET_DISCUSSION_FILTER_OBJECT,
        payload: {
          ...discussionFilterObj,
          orderby: nextDirection
            ? sortingKey === "creator"
              ? "owner"
              : sortingKey
            : "name",
          order: nextDirection
            ? nextDirection.toLocaleLowerCase()
            : discussionConstants.DESC,
          offset: resetOffset ? 0 : discussionFilterObj?.offset,
        },
      });
      if (searchAccountEnabled) {
        dispatch(setDiscussionSearchQuery(searchObject));
        dispatch(
          getSearchResultWithDiscussion({
            ...discussionFilterObj,
            ...searchObject,
            orderby: nextDirection
              ? sortingKey === "creator"
                ? "owner"
                : sortingKey
              : "name",
            order: nextDirection
              ? nextDirection.toLocaleLowerCase()
              : discussionConstants.DESC,
            offset: resetOffset ? 0 : discussionFilterObj?.offset,
          })
        );
      } else {
        dispatch(
          fetchDiscussionData({
            ...discussionFilterObj,
            orderby: nextDirection
              ? sortingKey === "creator"
                ? "owner"
                : sortingKey
              : "name",
            order: nextDirection
              ? nextDirection.toLocaleLowerCase()
              : discussionConstants.DESC,
            offset: resetOffset ? 0 : discussionFilterObj.offset,
          })
        );
      }
      if (resetOffset) {
        setResetOffset(false);
      }
    }
  };

  const handleAllRowSelection = () => {
    if (fields.length > 0) {
      let newFields = fields.map((field) => ({
        ...field,
        checked: !allSelected,
      }));
      setFields(newFields);
      setAllSelected(!allSelected);
      if (adminSelectedRow !== null) {
        dispatch(setAdminSidebarActiveState(true));
        dispatch(setAdminSidebarActiveIndex(allSelected ? 1 : 0));
      } else {
        dispatch(setAdminSidebarActiveState(allSelected ? false : true));
        dispatch(setAdminSidebarActiveIndex(allSelected ? 1 : 0));
      }
    }
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
    setFields(newState);

    let isAnyRowSelected = newState.some((el) => el.checked);

    if (adminSelectedRow === null) {
      if (isAnyRowSelected) {
        dispatch(setAdminSidebarActiveState(true));
        dispatch(setAdminSidebarActiveIndex(0));
      } else {
        dispatch(setAdminSidebarActiveState(false));
        dispatch(setAdminSidebarActiveIndex(1));
      }
    } else {
      if (isAnyRowSelected) {
        dispatch(setAdminSidebarActiveIndex(0));
      } else {
        dispatch(setAdminSidebarActiveIndex(1));
      }
    }
  };

  const toggleRowClick = (e, item) => {
    if (selectedDiscussions.length > 0) {
      if (adminSelectedRow === null) {
        dispatch(setAdminSidebarActiveState(true));
        dispatch(setAdminSidebarActiveIndex(1));
      } else {
        if (item.id === adminSelectedRow?.id) {
          dispatch(setAdminSidebarActiveIndex(0));
        } else {
          dispatch(setAdminSidebarActiveIndex(1));
        }
      }
    } else {
      if (adminSelectedRow === null) {
        dispatch(setAdminSidebarActiveState(true));
        dispatch(setAdminSidebarActiveIndex(1));
      } else {
        if (item.id === adminSelectedRow?.id) {
          dispatch(setAdminSidebarActiveState(false));
        } else {
          dispatch(setAdminSidebarActiveState(true));
        }
      }
    }
    dispatch(setAdminSidebarPanel(item));
    dispatch(fetchDiscussionMemberData(item.id));
  };

  useEffect(() => {
    dispatch(setAdminSidebarPanel(adminSelectedRow));
    dispatch(setAdminSidebarActiveState(false));
  }, [activeMenuItem]);

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
    dispatch({
      type: SET_DISCUSSION_FILTER_OBJECT,
      payload: {
        ...discussionFilterObj,
        ...obj,
      },
    });
    if (searchAccountEnabled) {
      dispatch(
        getSearchResultWithDiscussion({
          ...discussionFilterObj,
          ...searchObject,
          ...obj,
        })
      );
    } else {
      dispatch(
        fetchDiscussionData({
          ...discussionFilterObj,
          ...obj,
        })
      );
    }
  };

  const handlePaginationClick = (e) => {
    let number = Number(e.target.textContent);
    SetActivePagination(number);
    SetActivePagination(number);
    let propData = [...props.data];
    let slicedData = propData.splice(
      (number - 1) * discussionConstants.ITEM_COUNT,
      discussionConstants.ITEM_COUNT
    );
    setFields(slicedData);
    if (allSelected) setAllSelected(false);
  };

  const handlePaginationArrowClick = (e) => {
    let number = activePagination;
    if (e === "left") {
      number -= 1;
    } else {
      number += 1;
    }
    let accountObj = {};
    if (resetOffset) {
      accountObj.offset = 0;
      setResetOffset(false);
    }

    if (allSelected) setAllSelected(false);
    SetActivePagination(number);
    let propData = [...props.data];
    let slicedData = propData.splice(
      (number - 1) * discussionConstants.ITEM_COUNT,
      discussionConstants.ITEM_COUNT
    );
    setFields(slicedData);
  };

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
    let values = [...fields];
    let newValue = values.filter((el) => {
      return el.checked === true;
    });
    dispatch(setSelectedDiscussions(newValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  useEffect(() => {
    setResetOffset(true);
    SetActivePagination(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.tabKey]);

  useEffect(() => {
    if (props.data) {
      let propData = [...props.data];
      let slicedData = propData.splice(
        activePagination - 1,
        discussionConstants.ITEM_COUNT
      );
      setFields(slicedData);
    }
    if (allSelected) setAllSelected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.dataCount]);

  const customToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="d-block"
      style={
        discussionFilterObj?.status === "all"
          ? { minHeight: "20px" }
          : { minHeight: "20px", color: "#03bd5d" }
      }
    >
      {children}
      <span className="table-filter-icon">
        <img src={FilterDown} alt="FilterDown" />
      </span>
    </span>
  ));

  const renderHead = () => {
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
                  <div
                    className="custom-control custom-checkbox custom-checkbox-green"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                  <Dropdown>
                    <Dropdown.Toggle as={customToggle} id="dropdown-filter">
                      {text}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {filterItem.map((item, index) => {
                        return (
                          <Dropdown.Item
                            key={`dropdown-item-${item.id}`}
                            onClick={() => handleTypeChange(id, item.id)}
                            active={
                              discussionFilterObj?.status === item.id
                                ? index
                                  ? index
                                  : index === 0
                                : 0
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
                      ) : sortDirection === discussionConstants.ASC ? (
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
                {resize && (
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
      return (
        <div
          key={`row-${item.id}`}
          className={`custom-table-row ${
            adminSelectedRow?.id === item.id ? "row-selected " : ""
          } 
          ${
            item && item.checked !== undefined && item.checked
              ? "row-checked "
              : ""
          } 
          `}
          onClick={(e) => toggleRowClick(e, item)}
        >
          <div className="custom-table-cell" style={{ paddingRight: "24px" }}>
            <div
              className="custom-control custom-checkbox custom-checkbox-green"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="custom-control-input custom-control-input-green"
                id={`checkbox-${item.id}`}
                onChange={(e) => handleRowSelection(e, item, index)}
                checked={fields[index].checked}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor={`checkbox-${item.id}`}
              ></label>
            </div>
            <span className="custom-table-cell-text">{item.name}</span>
            {item.type === ChannelConstants.EXTERNAL ? (
              <img
                src={ExternalDiscussionIcon}
                alt=""
                style={{ position: "absolute", right: "4px", top: "11px" }}
              />
            ) : item.type === ChannelConstants.GUEST ? (
              <img
                src={GuestDiscussionIcon}
                alt=""
                style={{ position: "absolute", right: "4px", top: "11px" }}
              />
            ) : (
              ""
            )}
          </div>
          <div className="custom-table-cell text-center">{item.creator}</div>
          <div className="custom-table-cell text-center">
            {item.isConfidential ? <img src={NDAIconImg} alt="" /> : ""}
          </div>
          <div className="custom-table-cell text-center">
            {item.isAdvanced
              ? item.isDeletable
                ? "Delete"
                : item.isLockable
                ? "Locked"
                : ""
              : ""}
          </div>
          <div
            className={`custom-table-cell text-center ${
              item.status === "INIT"
                ? "text-info"
                : item.status === "ACTIVE"
                ? "text-primary"
                : item.status === "PENDING"
                ? "text-warning"
                : "text-danger"
            }`}
          >
            <Badge
              pill
              className={
                item.status === "INIT"
                  ? "badge-info"
                  : item.status === "ACTIVE"
                  ? "badge-primary"
                  : item.status === "PENDING"
                  ? "badge-warning"
                  : "badge-danger"
              }
            >
              &nbsp;
            </Badge>
            {t(`activation.status:${item.status}`)}
          </div>
        </div>
      );
    });
  };

  const renderPagination = (dataCount) => {
    let maxItemCount = discussionConstants.MAX_ITEM_SHOW;
    let totalCount = Math.ceil(dataCount / discussionConstants.ITEM_COUNT);
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
      style={{ height: "calc(100vh - 260px)" }}
    >
      <>
        <div className="table custom-table" ref={tableRef}>
          <div className="custom-table-head">{renderHead()}</div>

          <div className="custom-table-body">
            {!fetchingDiscussionList && fields.length > 0 && renderRow()}
          </div>
        </div>
        {fetchingDiscussionList ? (
          <div className="text-center p-5">{t("loading")}</div>
        ) : fields.length > 0 ? (
          ""
        ) : searchAccountEnabled ? (
          <div className="text-center p-5">
            {t("discussion.summary:search.panel:no.search.results.for.the", {
              terms: `"${terms}"`,
            })}
          </div>
        ) : (
          <div className="text-center p-5">{t("no.data.available")}</div>
        )}
      </>
      {!fetchingDiscussionList &&
        props.dataCount > discussionConstants.ITEM_COUNT &&
        renderPagination(props.dataCount)}
    </div>
  );
}

export default DiscussionTable;
