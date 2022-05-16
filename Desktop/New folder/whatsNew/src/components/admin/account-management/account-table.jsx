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
import DefaultUserImg from "./../../../assets/icons/default-user.svg";
import SortAsc from "./../../../assets/icons/asc-sort.svg";
import SortDesc from "./../../../assets/icons/desc-sort.svg";
import FilterDown from "./../../../assets/icons/filter-down.svg";
import Badge from "react-bootstrap/Badge";
import { useDispatch, useSelector } from "react-redux";
import {
  setAdminSidebarPanel,
  setAdminSidebarActiveState,
  setAdminSidebarActiveIndex,
} from "../../../store/actions/config-actions";
import { useTranslation } from "react-i18next";
import {
  setSelectedAccounts,
  getAccountSearchResult,
  fetchAccountData,
  setAccountSearchQuery,
} from "../../../store/actions/admin-account-action";
import { accountConstants } from "../../../constants/account-search";
import { SET_ACCOUNT_FILTER_OBJECT } from "../../../store/actionTypes/admin-account-action-types";

function AccountTable(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const globalMembers = useSelector(
    (state) => state.memberDetailsReducer.memberData
  );

  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );
  const activeMenuItem = useSelector((state) => state.config.activeMenuItem);
  let activeFileMenu = useSelector((state) => state.config.activeFileMenuItem);
  let selectedFileKey = useSelector(
    (state) => state.config.activeFileMenuItem?.fileKey
  );
  const fetchingAccountList = useSelector(
    (state) => state.AdminAccountReducer.accountListFetching
  );
  const searchAccountEnabled = useSelector(
    (state) => state.AdminAccountReducer.searchAccountEnabled
  );
  const searchObject = useSelector(
    (state) => state.AdminAccountReducer.accountSearchObj
  );
  const selectedAccounts = useSelector(
    (state) => state.AdminAccountReducer.selectedAccounts
  );
  const accountFilterObj = useSelector(
    (state) => state.AdminAccountReducer.accountFilterObj
  );
  const [allSelected, setAllSelected] = useState(false);
  const [fields, setFields] = useState([]);
  const [sortDirection, setSortDirection] = useState(accountFilterObj?.order);
  const [sortKey, setSortKey] = useState(accountFilterObj?.sort);
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

  useEffect(() => {
    if (activeFileMenu) {
      setSortKey(accountConstants.SORT_BY);
      setSortDirection(accountConstants.DESC);
    }
  }, [activeFileMenu]);

  useEffect(() => {
    renderRow();
  }, [globalMembers]);

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
          nextDirection = accountConstants.ASC;
        }
        if (sortDirection === accountConstants.ASC) {
          nextDirection = accountConstants.DESC;
        }
        if (sortDirection === accountConstants.DESC) {
          nextDirection = "";
        }
      } else {
        nextDirection = accountConstants.ASC;
      }

      if (
        nextDirection === accountConstants.ASC ||
        nextDirection === accountConstants.DESC
      ) {
        data &&
          data.length &&
          data.sort((a, b) => {
            let firstKey = a[sortingKey] ? a[sortingKey].toLowerCase() : null;
            let secondKey = b[sortingKey] ? b[sortingKey].toLowerCase() : null;

            // if (sortingKey === "date") {
            //   firstKey = new Date(a[sortingKey]);
            //   secondKey = new Date(b[sortingKey]);
            // }
            if (nextDirection === accountConstants.ASC) {
              return (
                (firstKey === null) - (secondKey === null) ||
                +(firstKey > secondKey) ||
                -(firstKey < secondKey)
              );
            } else if (nextDirection === accountConstants.DESC) {
              return (
                (firstKey === null) - (secondKey === null) ||
                -(firstKey > secondKey) ||
                +(firstKey < secondKey)
              );
            } else {
              return 0;
            }
          });
      }
      setSortKey(sortingKey);
      setSortDirection(nextDirection);

      //setFields(nextDirection === "" ? props.data : data);
      // dispatch({ type: RESET_ACCOUNT_FILTER_OBJECT });
      dispatch({
        type: SET_ACCOUNT_FILTER_OBJECT,
        payload: {
          ...accountFilterObj,
          sort: nextDirection ? sortingKey : "date",
          order: nextDirection
            ? nextDirection.toLocaleLowerCase()
            : accountConstants.DESC,
          offset: resetOffset ? 0 : accountFilterObj.offset,
        },
      });
      if (searchAccountEnabled) {
        dispatch(setAccountSearchQuery(searchObject));
        dispatch(
          getAccountSearchResult({
            ...accountFilterObj,
            ...searchObject,
            sort: nextDirection ? sortingKey : "email",
            order: nextDirection
              ? nextDirection.toLocaleLowerCase()
              : accountConstants.DESC,
            offset: resetOffset ? 0 : accountFilterObj.offset,
          })
        );
      } else {
        dispatch(
          fetchAccountData({
            ...accountFilterObj,
            sort: nextDirection ? sortingKey : "email",
            order: nextDirection
              ? nextDirection.toLocaleLowerCase()
              : accountConstants.DESC,
            offset: resetOffset ? 0 : accountFilterObj.offset,
          })
        );
      }
      if (resetOffset) {
        setResetOffset(false);
      }
      setFields([]);
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
    if (selectedAccounts.length > 0) {
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
      obj.offset = "0";
      setResetOffset(false);
    }
    obj.offset = "0";
    SetActivePagination(1);
    // if (
    //   filterFor === "activity" &&
    //   Object.keys(accountFilterObj).includes("activity") &&
    //   type === accountFilterObj.activity
    // ) {
    //   delete accountFilterObj.activity;
    //   delete obj.activity;
    // } else if (
    //   Object.keys(accountFilterObj).includes(filterFor) &&
    //   type === accountFilterObj[filterFor]
    // ) {
    //   obj[filterFor] = "all";
    // }

    // let activity = searchObject.activityType;
    // let fileType = searchObject.fileType;
    // let fileFilter = searchObject.fileFilter;

    // if (filterFor === "activity") {
    //   activity = type;
    // }
    // if (filterFor === "file") {
    //   fileFilter = type;
    // }
    // if (filterFor === "fileType") {
    //   fileType = type;
    // }
    dispatch({
      type: SET_ACCOUNT_FILTER_OBJECT,
      payload: {
        ...accountFilterObj,
        ...obj,
      },
    });
    if (searchAccountEnabled) {
      dispatch(
        getAccountSearchResult({
          ...accountFilterObj,
          ...searchObject,
          ...obj,
          // ...initials,
          // q: q.screenName ? q.screenName : q,
        })
      );
    } else {
      dispatch(
        fetchAccountData({
          ...accountFilterObj,
          ...obj,
        })
      );
    }
    setFields([]);
  };

  const handlePaginationClick = (e) => {
    let number = Number(e.target.textContent);
    SetActivePagination(number);
    if (searchAccountEnabled) {
      SetActivePagination(number);
      dispatch(
        getAccountSearchResult({
          ...accountFilterObj,
          ...searchObject,
          page: number,
          // ...initials,
          // q: q.screenName ? q.screenName : q,
        })
      );
    } else {
      let accountObj = {};
      if (resetOffset) {
        accountObj.offset = "0";
        setResetOffset(false);
      }
      accountObj.offset = accountConstants.ITEM_COUNT * (number - 1);
      // accountObj.folder = selectedFolderId;
      SetActivePagination(number);
      dispatch(
        fetchAccountData({
          ...accountFilterObj,
          ...accountObj,
        })
      );
    }
    if (allSelected) setAllSelected(false);
    setFields([]);
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
      accountObj.offset = "0";
      setResetOffset(false);
    }

    if (allSelected) setAllSelected(false);

    accountObj.offset = accountConstants.ITEM_COUNT * (number - 1);
    // accountObj.folder = selectedFolderId;
    // if (!selectedFolderId) delete accountObj.folder;
    // if (fileKey === FILES_MENU_ITEMS.FILES_POPULAR) accountObj.popular = true;
    // else if (fileKey === FILES_MENU_ITEMS.FILES_RECENT)
    //   accountObj.recent = true;
    if (searchAccountEnabled) {
      SetActivePagination(number);
      dispatch(
        getAccountSearchResult({
          ...accountFilterObj,
          ...searchObject,
          page: number,
          // ...initials,
          // q: q.screenName ? q.screenName : q,
        })
      );
    } else {
      SetActivePagination(number);
      dispatch(
        fetchAccountData({
          ...accountFilterObj,
          ...accountObj,
        })
      );
    }
    setFields([]);
  };

  useEffect(() => {
    SetActivePagination(1);
  }, [selectedFileKey]);

  useEffect(() => {
    dispatch(setAdminSidebarPanel(adminSelectedRow));
    dispatch(setAdminSidebarActiveState(false));
  }, [activeMenuItem]);

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
    dispatch(setSelectedAccounts(newValue));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  // useEffect(() => {
  //   setResetOffset(true);
  //   SetActivePagination(1);
  //   dispatch(setSelectedFileAction(null));
  //   dispatch(updateFilePanelState(false));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.tabKey]);

  useEffect(() => {
    if (props.data) {
      setFields(props.data);
      // renderPagination(props.dataCount);
    } else {
      setFields([]);
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
      style={{ minHeight: "20px" }}
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
                            key={`dropdown-item-${item.id}`}
                            onClick={() => handleTypeChange(id, item.id)}
                            active={
                              accountFilterObj.status === item.id
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
                      ) : sortDirection === accountConstants.ASC ? (
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
      let currentItem = globalMembers.filter(
        (el) => el.email === item.email || el.id === item.id
      );
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
          <div className="custom-table-cell">
            <div
              className="custom-control custom-checkbox custom-checkbox-green"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="custom-control-input custom-control-input-green"
                id={item.uid}
                onChange={(e) => handleRowSelection(e, item, index, "CHECKBOX")}
                checked={fields[index].checked}
              />
              <label
                className="custom-control-label pointer-on-hover"
                htmlFor={item.uid}
              ></label>
            </div>
            <span className="custom-table-cell-text">
              <img
                src={
                  currentItem.length > 0
                    ? currentItem[0].userImg === ""
                      ? DefaultUserImg
                      : currentItem[0].userImg
                    : DefaultUserImg
                }
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "10px",
                  borderRadius: "4px",
                }}
                alt=""
              />
              {item.screenName}
            </span>
          </div>
          <div className="custom-table-cell text-center">{item.name}</div>
          <div className="custom-table-cell text-center">
            <a
              href={`mailto:${item.email}`}
              style={{ textDecoration: "underline" }}
            >
              {item.email}
            </a>
          </div>
          <div className="custom-table-cell text-center">
            {item.phoneNumber || item.phone}
          </div>
          <div className="custom-table-cell text-center">
            {item.affiliation}
          </div>
          <div className="custom-table-cell text-center">{item.uid}</div>
          <div
            className={`custom-table-cell text-center ${
              item.activationStatus === "INIT"
                ? "text-info"
                : item.activationStatus === "ACTIVE"
                ? "text-primary"
                : item.activationStatus === "PENDING"
                ? "text-warning"
                : "text-danger"
            }`}
          >
            <Badge
              pill
              className={
                item.activationStatus === "INIT"
                  ? "badge-info"
                  : item.activationStatus === "ACTIVE"
                  ? "badge-primary"
                  : item.activationStatus === "PENDING"
                  ? "badge-warning"
                  : "badge-danger"
              }
            >
              &nbsp;
            </Badge>
            {t(`activation.status:${item.activationStatus}`)}
          </div>
        </div>
      );
    });
  };

  const renderPagination = (dataCount) => {
    let maxItemCount = accountConstants.MAX_ITEM_SHOW;
    let totalCount = Math.ceil(dataCount / accountConstants.ITEM_COUNT);
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
      style={{ height: "calc(100vh - 210px)" }}
    >
      <>
        <div className="table custom-table" ref={tableRef}>
          <div className="custom-table-head">{renderHead()}</div>

          <div className="custom-table-body">
            {!fetchingAccountList && fields.length > 0 && renderRow()}
          </div>
        </div>
        {fetchingAccountList ? (
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
      {!fetchingAccountList &&
        props.dataCount > accountConstants.ITEM_COUNT &&
        renderPagination(props.dataCount)}
    </div>
  );
}

export default AccountTable;
