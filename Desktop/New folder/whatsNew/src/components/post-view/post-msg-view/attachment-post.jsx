import React from "react";
import AttachmentPostItem from "./attachment-post-item";
import { BoxDivWrapper, DownloadAll } from "./styles/attachment-post-style";
import UserType from "../../../constants/user/user-type";
import { PermissionConstants } from "../../../constants/permission-constants";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import FileAttachmentService from "../../../services/file-attachment-service";
import downloadAllIcon from "../../../assets/icons/download-all.svg";
import downloadAllIconActive from "../../../assets/icons/v2/ic_download.svg";
import { UploadStatus } from "../../../constants/channel/file-upload-status";
function AttachmentPost(props) {
  const { t } = useTranslation();
  const { post, currentUser, members, channel, fileList, postOwnerId } = props;
  const userNetwork = useSelector((state) => state.AuthReducer.networkType);
  const userType = useSelector((state) => state.AuthReducer.user.userType);
  const currentChannelId = useSelector(
    (state) => state.config.activeSelectedChannel?.id
  );
  let files = fileList.filter(
    (el) =>
      el.mimeType?.split("/")[0] === "image" &&
      el.status !== UploadStatus.DELETED
  );
  let documents = fileList.filter(
    (el) =>
      el.mimeType?.split("/")[0] !== "image" &&
      el.status !== UploadStatus.DELETED
  );
  let deletedFiles = fileList.filter(
    (el) => el.status === UploadStatus.DELETED
  );
  let downloadPermissionArr = [];
  function downloadEnabled(myFile) {
    if (myFile.queryUserType === "INTERNAL") {
      if (
        myFile.intPerm === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "INTERNAL"
      ) {
        return myFile;
      }
      if (
        myFile.intPermOOO === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "EXTERNAL"
      ) {
        return myFile;
      }
      if (
        myFile.extPerm === PermissionConstants(t).DOWNLOAD_ENUM &&
        (userType === UserType.EXTERNAL || userType === UserType.GUEST) &&
        userNetwork === "EXTERNAL"
      ) {
        return myFile;
      }
    }
    if (myFile.queryUserType === "EXTERNAL") {
      if (myFile.extPerm === PermissionConstants(t).DOWNLOAD_ENUM) {
        return myFile;
      }
    }
    return null;
  }
  fileList.forEach((file) => {
    let result = downloadEnabled(file);
    if (result !== null) {
      downloadPermissionArr.push(result);
    }
  });

  const downloadAll = () => {
    downloadPermissionArr.forEach((file) => {
      FileAttachmentService.download(
        file.fileId,
        file.mimeType,
        file.fileName,
        currentChannelId,
        post?.id
      );
    });
  };
  return (
    <div id="attachment_wrapper">
      <div className="d-flex flex-row flex-wrap mr-0 attachment-file-list">
        {files.length > 0 &&
          files.map((file) => (
            <BoxDivWrapper key={file.fileId} className="attach-image">
              <AttachmentPostItem
                fileInfo={file}
                currentUser={currentUser}
                members={members}
                channel={channel}
                post={post}
                postForwardFlag={props.postForwardFlag}
                postOwnerId={postOwnerId}
              />
            </BoxDivWrapper>
          ))}
        {documents.length > 0 &&
          documents.map((document) => (
            <BoxDivWrapper key={document.fileId} className="attach-document">
              <AttachmentPostItem
                fileInfo={document}
                currentUser={currentUser}
                members={members}
                channel={channel}
                post={post}
              />
            </BoxDivWrapper>
          ))}
        {downloadPermissionArr.length > 1 && (
          <DownloadAll>
            <div
              className="download__all"
              style={
                downloadPermissionArr.length > 0 ? { color: "#03BD5D" } : {}
              }
              onClick={downloadPermissionArr.length > 0 && downloadAll}
            >
              <img
                src={
                  downloadPermissionArr.length > 0
                    ? downloadAllIconActive
                    : downloadAllIcon
                }
                alt=""
              />
              <span>{t("attachment:download.all")} </span>
            </div>
          </DownloadAll>
        )}
      </div>
      <div className="d-flex flex-row flex-wrap mr-0 attachment-file-list attachment-delete">
        {deletedFiles.length > 0 &&
          deletedFiles.map((file) => (
            <BoxDivWrapper key={file.fileId}>
              <AttachmentPostItem
                fileInfo={file}
                currentUser={currentUser}
                members={members}
                channel={channel}
                post={post}
                postForwardFlag={props.postForwardFlag}
              />
            </BoxDivWrapper>
          ))}
      </div>
    </div>
  );
}

export default AttachmentPost;
