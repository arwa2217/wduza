import React, { useEffect, useState, useMemo, useRef } from "react";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Moment from "moment";
import { useDispatch, useSelector } from "react-redux"; 
import "./e-signatureDetails.css";
import IconTime from "./../../../assets/icons/v2/ic_time.svg";
import IconEsign from "./../../../assets/icons/v2/ic_esignature_active.svg";
import IconVoid from "./../../../assets/icons/v2/ic_void.svg";
import IconCompleted from "./../../../assets/icons/v2/ic_check_active.svg";
import AngleLeft from "./../../../assets/icons/angle-left.svg";
import AngleRight from "./../../../assets/icons/angle-right.svg";
import { useHistory } from "react-router-dom";
import { ITEM_COUNT, MAX_ITEM_SHOW } from "../../../constants";
import {
  getEsignSearchResult,
  getESignature,
  setSelectedRows,
} from "../../../store/actions/esignature-actions";
import { ESIGNATURE_MENU_ITEMS } from "../../../constants/esignature-menu-items";
import { ESIGNATURE_STATUS } from "../../../constants/esignature-status";
import VoidESignatureModal from "../../modal/e-signature-modal/void-esignature-modal";
import ESignatureServices from "../../../services/esignature-services";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { useTranslation } from "react-i18next";
import { Ellipsis } from "../common/ellipsis";
import ForwardESignatureModal from "../../modal/e-signature-modal/forward-esignature-modal";
import ShareESignatureModal from "../../modal/e-signature-modal/share-esignature-modal";

const tableHeaderStyle = {
  fontSize: "12px",
  fontWeight: "normal",
  lineHeight: "16px",
  alignItems: "center",
  color: "rgba(0, 0, 0, 0.5)",
  fontWeight: "400",
  whiteSpace: "nowrap",
};

const dropDownButtonStyle = {
  width: "120px",
  height: "32px",
  background: "#03BD5D",
  border: "1px solid #03BD5D",
  borderRadius: "4px",
  textAlign: "left",
  fontSize: "14px",
  lineHeight: "19px",
  padding: "0 30px 0 0",
  ".open &": {
    borderRadius: 0,
  },
};
const dropDownSplitButtonStyle = {
  ...dropDownButtonStyle,
  width: "28px",
  height: "30px",
  borderRadius: "0 4px 4px 0",
  padding: "6px 9px 7px",
  border: 0,
  borderLeft: "1px solid #e6e6e680",
  position: "absolute",
  top: 1,
  right: 1,
};

const dataSubjectStyle = {
  ...tableHeaderStyle,
  fontSize: "14px",
  color: "rgba(0, 0, 0, 0.9)",
  wordBreak: "break-all",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
};

const dataLastChangeStyle = {
  ...tableHeaderStyle,
  color: "rgba(0, 0, 0, 0.7)",
};

const dataStatusStyle = (value) => {
  if (value === ESIGNATURE_STATUS.WAITING_FOR_OTHERS)
    return {
      ...tableHeaderStyle,
      fontSize: "14px",
      color: "#0796FF",
      lineHeight: "19px",
    };
  else if (value === ESIGNATURE_STATUS.NEED_TO_SIGN)
    return {
      ...tableHeaderStyle,
      fontSize: "14px",
      color: "#00A95B",
      lineHeight: "19px",
    };
  else if (value === ESIGNATURE_STATUS.COMPLETED)
    return {
      ...tableHeaderStyle,
      fontSize: "14px",
      color: "#000000B2",
      lineHeight: "19px",
    };
  else
    return {
      ...tableHeaderStyle,
      fontSize: "14px",
      color: "#00000080",
      lineHeight: "19px",
    };
};

const getActivityButtonStyle = (value) => {
  if (value === "ACTIVE") {
    return dropDownButtonStyle;
  } else {
    return {
      ...dropDownButtonStyle,
      background: "#ffffff",
      color: "#000000B2",
      border: "1px solid #0000000A",
    };
  }
};
const getActivitySplitButtonStyle = (value) => {
  if (value === "ACTIVE") {
    return dropDownSplitButtonStyle;
  } else {
    return {
      ...dropDownSplitButtonStyle,
      background: "#ffffff",
      color: "#000000B2",
      borderLeft: "1px solid #0000000A",
    };
  }
};

export default function ESignatureDetailsTable(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const ellipsisLimit = 20;

  const [activePagination, SetActivePagination] = useState(1);
  const [resetOffset, setResetOffset] = useState(false);
  const [listCount, setListCount] = useState(0);
  const [selectedRowBg, setSelectedRowBg] = useState(0);
  const [voidModalShow, setVoidModalShow] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [allSelected, setAllSelected] = useState(false);
  const [esignData, setEsignData] = useState([]);

  const [forwardModalShow, setForwardModalShow] = useState(false);
  const [forwardableEsigns, setForwardableEsigns] = useState([]);

  const [shareModalShow, setShareModalShow] = useState(false);
  const [sharableEsigns, setShareableEsigns] = useState([]);

  const currentUser = useSelector((state) => state.AuthReducer.user);
  const activeEsignMenu = useSelector(
    (state) => state.config.activeFileMenuItem
  );
  const esignFolderSelected = useSelector(
    (state) => state.esignatureReducer.esignatureFolderSelected
  );
  const esignTabSelected = useSelector(
    (state) => state.esignatureReducer.esignatureTabSelected
  );
  const esignatureData = formatTableData(props.esignatureData?.list);
  const selectedRows = useSelector(
    (state) => state.esignatureReducer.selectedEsignRows
  );
  const searchEnabled = useSelector(
    (state) => state.esignatureReducer.searchEnabled
  );
  const searchFilters = useSelector(
    (state) => state.esignatureReducer.searchFilters
  );
  const searchTerm = useSelector((state) => state.esignatureReducer.searchTerm);
  let summaryActiveItem = useRef(undefined);

  function formatTableData(data = []) {
    (data || []).map((item) => {
      item.updatedAt = Moment(item.updatedAt);
      item.status = item.status
        .toLowerCase()
        .split("_")
        .join(" ")
        .replace(/^\w/, (c) => c.toUpperCase());
      item.isSelected = false;
      item.isDocSender = false;
      item.isDocSigner = false;
      item.isDocCopyReceiver = false;
      // DOCUMENT SENDER
      if (
        activeEsignMenu?.fileKey ===
          ESIGNATURE_MENU_ITEMS.ESIGNATURE_SENT_ITEMS &&
        item.creatorId === currentUser.id
      ) {
        item.isDocSender = true;
      } else {
        item.isDocSender = false;
      }

      let docSigner = item.recipientList.recipients.filter(
        (el) => el.userId === currentUser.id
      );

      item.isDocSigner = docSigner.length > 0 ? true : false;

      let docCopyReceiver = item.recipientList.recipients.filter(
        (el) => el.userId === currentUser.id && el.signNeeded === false
      );
      item.isDocCopyReceiver = docCopyReceiver.length > 0 ? true : false;

      item.signers = "";
      item.recipientList.recipients.forEach((recipient, index) => {
        if (index == 0) {
          item.signers = recipient.name;
        } else {
          item.signers += `, ${recipient.name}`;
        }
      });
    });
    return data;
  }

  const handlePaginationArrowClick = (e) => {
    let number = activePagination;
    if (e === "left") {
      number -= 1;
    } else {
      number += 1;
    }
    let inboxObj = {};
    if (resetOffset) {
      inboxObj.offset = "0";
      setResetOffset(false);
    }
    inboxObj.offset = ITEM_COUNT * (number - 1);
    inboxObj.count = MAX_ITEM_SHOW;

    if (searchEnabled) {
      SetActivePagination(number);
      dispatch(
        getEsignSearchResult(searchTerm, {
          ...searchFilters,
          page: number,
        })
      );
    } else {
      SetActivePagination(number);
      dispatch(getESignature(esignFolderSelected, esignTabSelected, inboxObj));
    }
  };

  const handlePaginationClick = (e) => {
    let number = Number(e.target.textContent);
    // SetActivePagination(number);
    let inboxObj = {};
    if (resetOffset) {
      inboxObj.offset = "0";
      setResetOffset(false);
    }
    inboxObj.offset = ITEM_COUNT * (number - 1);
    inboxObj.count = MAX_ITEM_SHOW;
    if (searchEnabled) {
      SetActivePagination(number);
      dispatch(
        getEsignSearchResult(searchTerm, {
          ...searchFilters,
          page: number,
        })
      );
    } else {
      SetActivePagination(number);
      dispatch(getESignature(esignFolderSelected, esignTabSelected, inboxObj));
    }
  };

  const renderPagination = (dataCount) => {
    let maxItemCount = MAX_ITEM_SHOW;
    let totalCount = Math.ceil(dataCount / ITEM_COUNT);
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

  const toggleRowSelection = (e, item, index) => {
    let newState = [...esignData];
    let currentValue = newState[index].isSelected;
    if (e.ctrlKey) {
      //is ctrl + click
      newState[index] = {
        ...esignData[index],
        isSelected: !currentValue,
      };
      let selectedRows = newState.filter((el) => el.isSelected);
      console.log(selectedRows, "selectedRows");
      props.showHideTopBarButtons(selectedRows);
      setEsignData(newState);
    } else {
      //normal click
      console.log(
        summaryActiveItem.current,
        item.fileId,
        "summaryActiveItem.current === item.fileId"
      );
      if (summaryActiveItem.current === item.fileId) {
        summaryActiveItem.current = undefined;
      } else {
        summaryActiveItem.current = item.fileId;
      }
      props.showHideTopBarButtons([item]);
    }
  };

  const handleAllRowSelection = () => {
    let newState = esignData.map((item) => ({
      ...item,
      isSelected: !allSelected,
    }));
    setEsignData(newState);
    setAllSelected(!allSelected);
  };

  const handleRowSelection = (e, item, index) => {
    e.stopPropagation();
    let newState = [...esignData];
    let currentValue = newState[index].isSelected;
    newState[index] = {
      ...esignData[index],
      isSelected: !currentValue,
    };
    let isAllRowSelected = newState.every((el) => el.checked);
    dispatch(setSelectedRows([item]));
    setAllSelected(isAllRowSelected ? true : false);
    setEsignData(newState);
  };

  const handleModalClose = () => {
    setVoidModalShow(false);
  };
  const handleModalOpen = (data) => {
    setVoidModalShow(true);
    setSummaryData(data);
  };

  const handleForwardOpen = (data) => {
    setForwardableEsigns([data]);
    setForwardModalShow(true);
  };
  const handleForwardClose = () => {
    setForwardModalShow(false);
  };

  const handleShareOpen = (data) => {
    setShareableEsigns([data]);
    setShareModalShow(true);
  };
  const handleShareClose = () => {
    setShareModalShow(false);
  };

  const handleResend = ({ fileId, subjectName, message, expiry, reminder }) => {
    ESignatureServices.sendFile(fileId, {
      resend: true,
      subject: subjectName,
      message: message,
      expiry,
      reminder,
    }).then((res) => {
      if (res.code === 2001) {
        dispatch(showToast("Mail has been sent", 3000, "success"));
      }
    });
  };

  const deleteFile = (fileIds) => {
    props.deleteEsignature([fileIds]);
  };
  const correctFile = (fileIds) => {
    props.correctEsignature([fileIds]);
  };

  useEffect(() => {
    if (props?.esignatureData?.list?.length) {
      // Setting Esign Data on Mount
      let formattedEsignData = formatTableData(props.esignatureData.list);
      setEsignData(formattedEsignData);

      const allCount = props.esignatureData?.allCount;
      setListCount(allCount);
    } else {
      let formattedEsignData = [];
      setEsignData(formattedEsignData);
      setListCount(0);
    }
  }, [props.esignatureData]);

  // Send selected Data to Topbar Actions
  const selectedEsign = useMemo(
    () => esignData.filter((file) => file.isSelected),
    [esignData]
  );

  useEffect(() => {
    props.getSelectedEsigns(selectedEsign);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEsign]);

  return (
    <div className="mon-custom-scrollbar e-signature-table-wrapper">
      <Table className="w-100 e-signature-table">
        <thead>
          <tr>
            <th
              style={{
                ...tableHeaderStyle,
                width: "20%",
                paddingLeft: "16px",
              }}
            >
              <div className="d-flex align-items-center position-relative">
                {/* <div className="custom-control custom-checkbox custom-checkbox-green mb-0">
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
                </div> */}
                <div style={{ paddingLeft: "25px" }}>
                  {t("esign.table:status")}{" "}
                </div>
                <span className="divider" />
              </div>
            </th>
            <th style={{ ...tableHeaderStyle }}>
              <div className="d-flex align-items-center">
                <div>{t("esign.table:subject")}</div>
                <span className="divider"></span>
              </div>
            </th>
            <th style={{ ...tableHeaderStyle, width: "16%" }}>
              <div className="d-flex align-items-center">
                <div>{t("esign.table:last.change")}</div>
                <span className="divider"></span>
              </div>
            </th>
            {activeEsignMenu?.fileKey !==
              ESIGNATURE_MENU_ITEMS.ESIGNATURE_DELETED_ITEMS && (
              <th style={{ ...tableHeaderStyle, width: "12%" }}>
                <div className="d-flex align-items-center">
                  <div>{t("esign.table:activity")} </div>
                  <span className="divider" />
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {esignData.length > 0
            ? esignData.map((data, index) => {
                return (
                  <tr
                    key={data.fileId}
                    id={data.fileId}
                    style={
                      data.isSelected ||
                      summaryActiveItem.current === data.fileId
                        ? { backgroundColor: "rgba(3, 189, 93, 0.1)" }
                        : {}
                    }
                    // style={
                    //   selectedRows &&
                    //   selectedRows?.findIndex(
                    //     (el) =>
                    //       el.fileId === data.fileId &&
                    //       el.fileId === summaryActiveItem.current
                    //   ) !== -1
                    //     ? { backgroundColor: "rgba(3, 189, 93, 0.1)" }
                    //     : {}
                    // }
                    className="esign-table-row"
                    onClick={(e) => toggleRowSelection(e, data, index)}
                  >
                    <td style={{ paddingLeft: "16px" }}>
                      <div className="d-flex align-items-center position-relative">
                        {/* <div
                          className="custom-control custom-checkbox custom-checkbox-green mb-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowSelection(e, data, index);
                          }}
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input custom-control-input-green"
                            id={`esign-${data.fileId}`}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleRowSelection(e, data, index);
                            }}
                            checked={data.isSelected}
                          />
                          <label
                            className="custom-control-label pointer-on-hover"
                            htmlFor={`esign-${data.fileId}`}
                          ></label>
                        </div> */}
                        <div>
                          <img
                            src={
                              data.status ===
                              ESIGNATURE_STATUS.WAITING_FOR_OTHERS
                                ? IconTime
                                : data.status === ESIGNATURE_STATUS.NEED_TO_SIGN
                                ? IconEsign
                                : data.status === ESIGNATURE_STATUS.VOIDED
                                ? IconVoid
                                : IconCompleted
                            }
                            title={data.status}
                          />
                        </div>
                        <div
                          className="d-flex flex-column"
                          style={{ paddingLeft: "8px" }}
                        >
                          <span style={dataStatusStyle(data.status)}>
                            {data.status}{" "}
                          </span>
                          <span
                            style={
                              data?.status === ESIGNATURE_STATUS.NEED_TO_SIGN ||
                              data?.status ===
                                ESIGNATURE_STATUS.WAITING_FOR_OTHERS
                                ? {
                                    ...dataLastChangeStyle,
                                    color: "rgba(0, 0, 0, 0.5)",
                                  }
                                : {}
                            }
                          >
                            {data.signedCount}/{data.totalSigners}{" "}
                            {t("esign.table.data:done")}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span
                          style={{
                            ...dataSubjectStyle,
                            lineHeight: "19px",
                          }}
                          className={`${
                            summaryActiveItem.current
                              ? "data-subject-td-sm"
                              : "data-subject-td-lg"
                          }`}
                          title={data.subjectName}
                        >
                          {data.subjectName}
                        </span>
                        <span
                          style={{
                            ...dataLastChangeStyle,
                            color: "rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <Ellipsis limit={ellipsisLimit}>
                            {data.signers}
                          </Ellipsis>{" "}
                          <span className="txt-total-count">
                            {data.totalSigners}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column">
                        <span
                          style={{
                            ...dataLastChangeStyle,
                            lineHeight: "19px",
                          }}
                        >
                          {data.updatedAt.format(`MMM DD, YYYY`)}{" "}
                        </span>
                        <span
                          style={{
                            ...dataLastChangeStyle,
                            color: "rgba(0, 0, 0, 0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          {data.updatedAt.format(`hh:mm a`)}{" "}
                        </span>
                      </div>
                    </td>

                    {activeEsignMenu?.fileKey !==
                      ESIGNATURE_MENU_ITEMS.ESIGNATURE_DELETED_ITEMS && (
                      <td>
                        <Dropdown
                          style={{ width: "max-content" }}
                          onClick={(e) => e.stopPropagation()}
                          className={
                            data.status === ESIGNATURE_STATUS.NEED_TO_SIGN &&
                            data.isDocSigner
                              ? "dropdown-active"
                              : "dropdown-default"
                          }
                        >
                          <Button
                            className={
                              data.status === ESIGNATURE_STATUS.NEED_TO_SIGN &&
                              data.isDocSigner
                                ? "dropdown-toggle-active"
                                : "dropdown-toggle-default"
                            }
                            style={getActivityButtonStyle(
                              data.status === ESIGNATURE_STATUS.NEED_TO_SIGN &&
                                data.isDocSigner
                                ? "ACTIVE"
                                : "DEFAULT"
                            )}
                          >
                            <>
                              {data.isDocSender &&
                                (data.isDocCopyReceiver ? (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onDownloadClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:download")}
                                      </div>
                                    )}
                                    {(data.status ===
                                      ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                      data.status ===
                                        ESIGNATURE_STATUS.COMPLETED) && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onSignClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:sign")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.WAITING_FOR_OTHERS && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() =>
                                          handleResend(data, index)
                                        }
                                      >
                                        {t("esign.options:resend")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onDownloadClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:download")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.VOIDED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </div>
                                    )}
                                  </>
                                ))}

                              {data.isDocSigner &&
                                data.isDocSender === false &&
                                (data.isDocCopyReceiver ? (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onDownloadClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:download")}
                                      </div>
                                    )}
                                    {(data.status ===
                                      ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                      data.status ===
                                        ESIGNATURE_STATUS.VOIDED) && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onSignClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:sign")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.WAITING_FOR_OTHERS && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() => {
                                          handleModalOpen(data);
                                        }}
                                      >
                                        {t("esign.options:decline")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={(e) =>
                                          props.onDownloadClick(
                                            esignatureData[index]
                                          )
                                        }
                                      >
                                        {t("esign.options:download")}
                                      </div>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.VOIDED && (
                                      <div
                                        style={{ padding: "6px 8px 7px" }}
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </div>
                                    )}
                                  </>
                                ))}
                            </>
                          </Button>
                          {data.isDocSigner && (
                            <>
                              {data.isDocCopyReceiver ? (
                                <>
                                  {data.status ===
                                  ESIGNATURE_STATUS.COMPLETED ? (
                                    <Dropdown.Toggle
                                      className={
                                        data.status ===
                                          ESIGNATURE_STATUS.NEED_TO_SIGN &&
                                        data.isDocSigner
                                          ? "dropdown-toggle-active"
                                          : "dropdown-toggle-default"
                                      }
                                      style={getActivitySplitButtonStyle(
                                        data.status ===
                                          ESIGNATURE_STATUS.NEED_TO_SIGN &&
                                          data.isDocSigner
                                          ? "ACTIVE"
                                          : "DEFAULT"
                                      )}
                                    />
                                  ) : (
                                    ""
                                  )}
                                </>
                              ) : (
                                <>
                                  {data.status === ESIGNATURE_STATUS.VOIDED ? (
                                    ""
                                  ) : (
                                    <Dropdown.Toggle
                                      className={
                                        data.status ===
                                          ESIGNATURE_STATUS.NEED_TO_SIGN &&
                                        data.isDocSigner
                                          ? "dropdown-toggle-active"
                                          : "dropdown-toggle-default"
                                      }
                                      style={getActivitySplitButtonStyle(
                                        data.status ===
                                          ESIGNATURE_STATUS.NEED_TO_SIGN &&
                                          data.isDocSigner
                                          ? "ACTIVE"
                                          : "DEFAULT"
                                      )}
                                    />
                                  )}
                                </>
                              )}
                            </>
                          )}

                          <Dropdown.Menu>
                            <>
                              {data.isDocSender &&
                                (data.isDocCopyReceiver ? (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </Dropdown.Item>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN && (
                                      <Dropdown.Item
                                        onClick={() =>
                                          handleResend(data, index)
                                        }
                                      >
                                        {t("esign.options:resend")}
                                      </Dropdown.Item>
                                    )}
                                    {(data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN ||
                                      data.status ===
                                        ESIGNATURE_STATUS.WAITING_FOR_OTHERS) && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          handleModalOpen(data);
                                        }}
                                      >
                                        {t("esign.options:void")}
                                      </Dropdown.Item>
                                    )}
                                    {(data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN ||
                                      data.status ===
                                        ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                      data.status ===
                                        ESIGNATURE_STATUS.COMPLETED) && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          deleteFile(data.fileId);
                                        }}
                                      >
                                        {t("esign.options:delete")}
                                      </Dropdown.Item>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.COMPLETED && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          handleShareOpen(data);
                                        }}
                                      >
                                        {t("esign.options:share")}
                                      </Dropdown.Item>
                                    )}
                                    {(data.status ===
                                      ESIGNATURE_STATUS.NEED_TO_SIGN ||
                                      data.status ===
                                        ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                      data.status ===
                                        ESIGNATURE_STATUS.COMPLETED) && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          handleForwardOpen(data);
                                        }}
                                      >
                                        {t("esign.options:forward")}
                                      </Dropdown.Item>
                                    )}
                                    {data.status ===
                                      ESIGNATURE_STATUS.VOIDED && (
                                      <Dropdown.Item
                                        onClick={() => {
                                          correctFile(data);
                                        }}
                                      >
                                        {t("esign.options:correct")}
                                      </Dropdown.Item>
                                    )}
                                  </>
                                ))}

                              {data.isDocSigner && data.isDocSender === false && (
                                <>
                                  {data.isDocCopyReceiver ? (
                                    <>
                                      {data.status ===
                                        ESIGNATURE_STATUS.COMPLETED && (
                                        <Dropdown.Item
                                          onClick={() => {
                                            deleteFile(data.fileId);
                                          }}
                                        >
                                          {t("esign.options:delete")}
                                        </Dropdown.Item>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      {data.status ===
                                        ESIGNATURE_STATUS.NEED_TO_SIGN && (
                                        <Dropdown.Item
                                          onClick={() => {
                                            handleModalOpen(data);
                                          }}
                                        >
                                          {t("esign.options:decline")}
                                        </Dropdown.Item>
                                      )}

                                      {(data.status ===
                                        ESIGNATURE_STATUS.NEED_TO_SIGN ||
                                        data.status ===
                                          ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                        data.status ===
                                          ESIGNATURE_STATUS.COMPLETED) && (
                                        <Dropdown.Item
                                          onClick={() => {
                                            deleteFile(data.fileId);
                                          }}
                                        >
                                          {t("esign.options:delete")}
                                        </Dropdown.Item>
                                      )}
                                      {data.status ===
                                        ESIGNATURE_STATUS.COMPLETED && (
                                        <Dropdown.Item
                                          onClick={() => {
                                            handleShareOpen(data);
                                          }}
                                        >
                                          {t("esign.options:share")}
                                        </Dropdown.Item>
                                      )}
                                      {(data.status ===
                                        ESIGNATURE_STATUS.NEED_TO_SIGN ||
                                        data.status ===
                                          ESIGNATURE_STATUS.WAITING_FOR_OTHERS ||
                                        data.status ===
                                          ESIGNATURE_STATUS.COMPLETED) && (
                                        <Dropdown.Item
                                          onClick={() => {
                                            handleForwardOpen(data);
                                          }}
                                        >
                                          {t("esign.options:forward")}
                                        </Dropdown.Item>
                                      )}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                );
              })
            : ""}
        </tbody>
      </Table>
      {listCount > MAX_ITEM_SHOW && renderPagination(listCount)}
      {voidModalShow && (
        <VoidESignatureModal
          onModalHide={handleModalClose}
          esignSummaryData={summaryData}
        />
      )}
      {forwardModalShow && (
        <ForwardESignatureModal
          onModalHide={handleForwardClose}
          selectedFiles={forwardableEsigns}
        />
      )}
      {forwardModalShow && (
        <ForwardESignatureModal
          onModalHide={handleForwardClose}
          selectedFiles={forwardableEsigns}
        />
      )}
      {shareModalShow && (
        <ShareESignatureModal
          shareData={{}}
          onModalHide={handleShareClose}
          selectedFiles={sharableEsigns}
          // setShareData={setShareData}
          // expirationDateSelect={expirationDateSelect}
          // setExpirationDateSelect={setExpirationDateSelect}
        />
      )}
    </div>
  );
}
