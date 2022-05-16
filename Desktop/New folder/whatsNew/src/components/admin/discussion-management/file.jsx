import React, { useEffect, useState } from "react";
import {
  fetchFileList,
  fileStorageDetails,
  updateSelectedFilter,
  updateSelectedPermissionFilter
} from "../../../store/actions/files-actions";
import { useDispatch, useSelector } from "react-redux";
import CommonUtils from "../../utils/common-utils";
import ProgressBar from "react-bootstrap/ProgressBar";
import {
  BoxDivWrapper,
  BoxDivLarge,
  BoxDivInner,
  FileExtIcon,
  Details,
  FileInfo,
  Name,
  Size,
} from "../../../components/post-view/post-msg-view/styles/attachment-post-style";
import { useTranslation } from "react-i18next";
import { requestOpenReplyPost } from "../../../store/actions/PostReplyActions";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";
// import filterNor from "../../assets/icons/file-type/filter_nor.png";
// import plus from "../../assets/icons/file-type/plus.png";
// import FileFilteredModal from "../../../components/modal/file-filtered-modal/file-filtered-modal";
// import CloseIcon from "../../assets/icons/close.svg";

import FilesFilters from "./files-filters/files-filters";
import { toggleUnreadMessage } from "../../../store/actions/channelMessagesAction";

const Files = () => {
  let channelFilesList = useSelector(
    (state) => state.fileReducer.channelFilesList
  );
  let fileStorageDetails = useSelector(
    (state) => state.fileReducer.fileStorageDetails
  );

  let fetchingFilesDetails = useSelector(
    (state) => state.fileReducer.fetchingFilesDetails
  );
  const { selectedFilter, selectedPermissionFilter } = useSelector(
    (state) => state.fileReducer
  );
  const [fileState, setFileState] = useState(
    selectedFilter ? selectedFilter : ""
  );
  const [filePermissionState, setFilePermissionState] = useState(
    selectedPermissionFilter ? selectedPermissionFilter : ""
  );
  const { t } = useTranslation();
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const [user, setUser] = useState({ ...currentUser });
  let channelId = useSelector(
    (state) => state.config?.activeSelectedChannel?.id
  );
  const isToggleUnreadMessage = useSelector(
    (state) => state.channelMessages.toggleUnreadMessage
  );
  const selectedDiscussion = useSelector(
    (state) => state.config.adminSelectedRow
  );

  channelFilesList =
    channelFilesList &&
    channelFilesList.sort(
      (a, b) =>
        (a.updatedAt === undefined || a.updatedAt === null) -
          (b.updatedAt === undefined || b.updatedAt === null) ||
        b.updatedAt - a.updatedAt
    );

  const bytesToSize = (bytes, precision) => {
    if (bytes !== undefined) {
      bytes = bytes * 1024;
      var kilobyte = 1024;
      var megabyte = kilobyte * 1024;
      var gigabyte = megabyte * 1024;
      var terabyte = gigabyte * 1024;
      var bytesValue = 0;
      var bytesValueUnit = "B";
      if (bytes >= 0 && bytes < kilobyte) {
        bytesValue = bytes;
        bytesValueUnit = "B";
      } else if (bytes >= kilobyte && bytes < megabyte) {
        bytesValue = bytes / kilobyte;
        bytesValueUnit = "KB";
      } else if (bytes >= megabyte && bytes < gigabyte) {
        bytesValue = bytes / megabyte;
        bytesValueUnit = "MB";
      } else if (bytes >= gigabyte && bytes < terabyte) {
        bytesValue = bytes / gigabyte;
        bytesValueUnit = "GB";
      } else if (bytes >= terabyte) {
        bytesValue = bytes / terabyte;
        bytesValueUnit = "TB";
      } else {
        bytesValue = bytes;
        bytesValueUnit = "B";
      }
      if (Number.isInteger(bytesValue)) {
        return (bytesValue = bytesValue.toFixed(0) + bytesValueUnit);
      }
      return bytesValue.toFixed(precision) + bytesValueUnit;
    }
  };
  // var latestFileList =
  //   channelFilesList &&
  //   channelFilesList.filter(function (el) {
  //     if (el.fileId === undefined) {
  //       return false;
  //     }
  //     return (
  //       new Date(el.createdAt * 1000).toString().slice(0, 15) ===
  //       new Date().toString().slice(0, 15)
  //     );
  //   });
  // var olderFileList =
  //   channelFilesList &&
  //   channelFilesList.filter(function (el) {
  //     if (el.fileId === undefined) {
  //       return false;
  //     }
  //     return (
  //       new Date(el.createdAt * 1000).toString().slice(0, 15) !==
  //       new Date().toString().slice(0, 15)
  //     );
  //   });

  let totalAllowed =
    fileStorageDetails && fileStorageDetails.discussionQuotaAllowed;
  let totalUsed = fileStorageDetails && fileStorageDetails.discussionQuotaUsed;
  let now = parseFloat((totalUsed * 100) / totalAllowed);

  let memoryUsed = bytesToSize(
    fileStorageDetails && fileStorageDetails.discussionQuotaUsed,
    2
  );
  let totalMemory = bytesToSize(
    fileStorageDetails && fileStorageDetails.discussionQuotaAllowed,
    1
  );
  let freeMemory = bytesToSize(
    parseInt(fileStorageDetails && fileStorageDetails.discussionQuotaAllowed) -
      parseInt(fileStorageDetails && fileStorageDetails.discussionQuotaUsed)
  );
  const dispatch = useDispatch();
  // const channelDetails = useSelector((state) => state.channelDetails);
  const adminSelectedRow = useSelector(
    (state) => state.config.adminSelectedRow
  );

  useEffect(() => {
    setFileState("");
    setFilePermissionState("");
  }, [selectedDiscussion]);
  const redirectToPost = (elem) => {
    if (isToggleUnreadMessage) dispatch(toggleUnreadMessage(channelId));
    let data;
    if (elem) {
      data = elem;
      if (selectedDiscussion.id && selectedDiscussion.name && data.postUUID) {
        let postId = data
          ? data.ParentPostID
            ? data.ParentPostID
            : data.postUUID
          : "";
        let childPostId = data ? (data.ParentPostID ? data.postUUID : "") : "";
        dispatch(requestOpenReplyPost(childPostId));
        CommonUtils.performNotificationAction(
          selectedDiscussion.name,
          "files",
          "files",
          selectedDiscussion.id,
          postId,
          childPostId,
          dispatch
        );
      }
    }
  };

  useEffect(() => {
    if (adminSelectedRow !== null) {
      let queryParams = {
        channelId: adminSelectedRow.id,
        user: true,
      };
      dispatch(fetchFileList(queryParams, false, true));
      return () => {
        dispatch(updateSelectedFilter(""));
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSelectedRow]);

  // useEffect(() => {
  //     dispatch(resetFileDetails());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [ channelStatus]);

  // const filteredValueDisplay = (props) => <div>{props.children}</div>;
  // const onFilteredHandler = (value) => {
  //   if (filteredValues.includes(value)) {
  //     setFilteredValues(filteredValues.filter((f_value) => f_value !== value));
  //   } else {
  //     setFilteredValues([...filteredValues, value]);
  //   }
  // };

  const handleFilterSelect = (selectedValue) => {
    let type = ["internal-in", "internal-out", "external", "all"];
    let perm = ["ro", "dl", "all"];
    setFileState(selectedValue);
    dispatch(updateSelectedFilter(selectedValue));
    let queryParams = {
      channelId: selectedDiscussion.id,
      user: false,
      fileType: type.some((i) => i === selectedValue) ? selectedValue : "all",
      perm: filePermissionState,
    };
    dispatch(fetchFileList(queryParams, false, true));
    dispatch(fileStorageDetails());
  };

  const handlePermissionFilterSelect = (selectedValue) => {
    let type = ["internal-in", "internal-out", "external", "all"];
    let perm = ["ro", "dl", "all"];
    setFilePermissionState(selectedValue);
    dispatch(updateSelectedPermissionFilter(selectedValue));
    let queryParams = {
      channelId: selectedDiscussion.id,
      user: false,
      fileType: fileState,
      perm: perm.some((i) => i === selectedValue) ? selectedValue : "all",
    };
    dispatch(fetchFileList(queryParams, false, true));
  };

  return (
    <div className="sidebar-container-wrapper files-container w-100 border-top">
      {/* <FileFilteredModal
        setFilteredValues={setFilteredValues}
        filteredValues={filteredValues}
      /> */}
      <div className="files-memory-container">
        <div className="files-company-header">
          <span>
            {t("file:header", {
              companyName: user.companyName,
              totalMemory,
            })}
          </span>
        </div>
        <div className="files-memory">
          <span>
            <span className="green">{memoryUsed} </span> /{" "}
            <span className="black">{totalMemory} </span>
          </span>
          <span>
            {" "}
            {freeMemory} {t("file:available")}
          </span>
        </div>
        <ProgressBar
          variant={`${
            now < 90 ? "success" : now >= 90 && now < 95 ? "warning" : "danger"
          }`}
          now={now}
        />
        {/* <h5 className="text-uppercase">{t("file:latest")}</h5> */}
      </div>
      {/* {latestFileList && latestFileList.length ? (
            latestFileList.length > 0 ? (
              <>
                {latestFileList &&
                  // eslint-disable-next-line array-callback-return
                  latestFileList.map((el) => {
                    let createdAt = new Date(el.createdAt * 1000)
                      .toString()
                      .slice(0, 15);
                    let todayDate = new Date().toString().slice(0, 15);
                    if (createdAt === todayDate) {
                      return (
                        <div
                          className="sidebar-container"
                          onClick={() => {
                            redirectToPost(el);
                          }}
                          key={el.id}
                          style={{
                            paddingTop: "0",
                            paddingBottom: "0",
                          }}
                        >
                          <BoxDivWrapper>
                            <BoxDiv>
                              <BoxDivInner>
                                <FileExtIcon src={FileExtIconImage} alt="" />
                                <Details>
                                  <FileInfo>
                                    <Name title={el.fileName}>
                                      {el.fileName}
                                    </Name>
                                    <Size>{el.fileSize}</Size>
                                  </FileInfo>
                                </Details>
                              </BoxDivInner>
                            </BoxDiv>
                          </BoxDivWrapper>
                        </div>
                      );
                    }
                  })}
              </>
            ) : (
              <h5 className="w-100 text-center">{t("file:loading")}</h5>
            )
          ) : (
            <h5 className=" w-100 text-center">{t("file:no.latest.data")}</h5>
          )} */}
      {/* {olderFileList && olderFileList.length > 0 && (
            <h5
              style={{ padding: "18px 20px 0", margin: "0" }}
              className="text-uppercase"
            >
              {t("file:older")}
            </h5>
          )} */}

      <FilesFilters
        selectedValue={fileState}
        selectedPermissionValue={filePermissionState}
        handleFilterSelect={handleFilterSelect}
        handlePermissionFilterSelect={handlePermissionFilterSelect}
      />
      {fetchingFilesDetails === true ? (
        <div className="w-100 text-center no-data">
          <h5 className="w-100 text-center mt-4">{t("file:loading")}</h5>
        </div>
      ) : channelFilesList && channelFilesList.length > 0 ? (
        <>
          {channelFilesList.map((el, index) => {
            if (el.fileId) {
              return (
                <div
                  className="sidebar-container"
                  onClick={() => {
                    redirectToPost(el);
                  }}
                  key={el.id}
                  style={{
                    paddingTop: "9px",
                    paddingBottom: "9px",
                    border: "none",
                  }}
                >
                  <div className="post-message__text">
                    <h5>
                      <span>
                        <span>{el.screenName}</span>
                        <span className="time-created">
                          {t("tagTime", {
                            date: new Date(el.createdAt * 1000),
                          })}
                        </span>
                      </span>
                    </h5>
                    <BoxDivWrapper>
                      <BoxDivLarge>
                        <BoxDivInner>
                          <FileExtIcon src={FileExtIconImage} alt="" />
                          <Details>
                            <FileInfo>
                              <Name title={el.fileName}>{el.fileName}</Name>
                              <Size>{el.fileSize}</Size>
                            </FileInfo>
                          </Details>
                        </BoxDivInner>
                      </BoxDivLarge>
                    </BoxDivWrapper>
                  </div>
                </div>
              );
            } else {
              return <span />;
            }
          })}
        </>
      ) : (
        <div className="w-100 text-center no-data">
          <h5>{t("file:no.updates")}</h5>
          <p>{t("file:file.appear.here")}</p>
        </div>
      )}
    </div>
  );
};
export default Files;
