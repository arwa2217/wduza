import React, { Fragment, useRef } from "react";
import viewCount from "../../../assets/icons/view-count.svg";
import viewCountGrey from "../../../assets/icons/view-count-grey.svg";
import downloadCount from "../../../assets/icons/download-count.svg";
import downloadCountGrey from "../../../assets/icons/download-count-grey.svg";
import forward from "../../../assets/icons/file-forward.svg";
import share from "../../../assets/icons/file-share.svg";
import shareGreen from "../../../assets/icons/file-share-active.svg";
import forwardGreen from "../../../assets/icons/file-forward-active.svg";
import { useSelector } from "react-redux";
import {
  FileDownloadInfo,
  Count,
} from "../../post-view/post-msg-view/styles/attachment-post-style";

function FileActivity(props) {
  const currentNetworkType = useSelector(
    (state) => state.AuthReducer.networkType
  );
  let isDownloadable = useRef(false);
  let isForwardable = useRef(false);

  const {
    fileForwardDisabled,
    queryUserType,
    internalPermission,
    internalPermissionOoo,
    externalPermission,
  } = props;

  // Setting Download Permission
  if (queryUserType === "INTERNAL") {
    if (currentNetworkType === "INTERNAL" && internalPermission === "DL") {
      isDownloadable.current = true;
    } else if (
      currentNetworkType === "EXTERNAL" &&
      internalPermissionOoo === "DL"
    ) {
      isDownloadable.current = true;
    }
  } else if (queryUserType === "EXTERNAL") {
    if (externalPermission === "DL") {
      isDownloadable.current = true;
    }
  }

  // Setting Forward & Share Permission
  if (fileForwardDisabled) {
    isForwardable.current = false;
  } else {
    isForwardable.current = true;
    if (queryUserType === "INTERNAL") {
      if (currentNetworkType === "INTERNAL" && internalPermission === "DL") {
        isForwardable.current = true;
      } else if (
        currentNetworkType === "EXTERNAL" &&
        internalPermissionOoo === "DL"
      ) {
        isForwardable.current = true;
      }
    } else if (queryUserType === "EXTERNAL") {
      if (externalPermission === "DL") {
        isForwardable.current = true;
      }
    }
  }

  return (
    <Fragment
      key={`attached-file-fragment-${props.fileId}-${props.folderId}-${props.channelId}-${props.postId}`}
    >
      <FileDownloadInfo className="d-flex align-items-center m-0">
        <div className="position-relative divide">
          <div
            className="d-flex align-items-center"
            style={{
              marginRight: 0,
              cursor: "pointer",
            }}
          >
            <img src={props.viewedBySelf ? viewCount : viewCountGrey} alt="" />
            <Count
              hasDoneByCurrentUser={props.viewedBySelf}
              data={props.viewed}
            >
              {props.viewed}
            </Count>
          </div>
        </div>
        {isDownloadable.current && (
          <div className="position-relative divide">
            <div
              className="d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <img
                src={props.downloadedBySelf ? downloadCount : downloadCountGrey}
                alt=""
              />{" "}
              <Count
                hasDoneByCurrentUser={props.downloadedBySelf}
                data={props.downloaded}
              >
                {props.downloaded}
              </Count>
            </div>
          </div>
        )}

        {isForwardable.current && (
          <>
            <div className="position-relative divide">
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={props.forwardedBySelf ? forwardGreen : forward}
                  alt=""
                />{" "}
                <Count
                  hasDoneByCurrentUser={props.forwardedBySelf}
                  data={props.forwarded}
                >
                  {props.forwarded}
                </Count>
              </div>
            </div>

            <div className="position-relative">
              <div
                className="d-flex align-items-center"
                style={{ cursor: "pointer" }}
              >
                <img src={props.sharedBySelf ? shareGreen : share} alt="" />{" "}
                <Count
                  hasDoneByCurrentUser={props.sharedBySelf}
                  data={props.shared}
                >
                  {props.shared}
                </Count>
              </div>
            </div>
          </>
        )}
      </FileDownloadInfo>
    </Fragment>
  );
}

export default FileActivity;
