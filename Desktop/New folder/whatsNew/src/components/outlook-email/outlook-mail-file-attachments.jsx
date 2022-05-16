import React, { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import "./outlook-mail-file-attachments.css";
import fileAttach from "../../assets/icons/attachment-icon.svg";
import services from "../../outlook/apiService";
import { CircularProgress } from "@material-ui/core";
import OutlookMailMediaItem from "./outlook-mail-media-item";
import DownloadAll from "../../assets/icons/download-all-active.svg";
import AttachmentItem from "./attachment-item";
import compareFile from "../outlook-mail-details/compare-file";
import {useTranslation} from "react-i18next";

const FileWrapperStyle = styled.div`
  position: relative;
  > img {
    width: 20px;
    height: 20px;
  }
  > p {
    width: 150px;
    margin: 0;
  }
  > button {
    justify-self: flex-end;
  }
`;

const ContentWrapperStyle = styled.div`
  > div:nth-child(3n - 2) {
    padding-left: 0 !important;
  }
`;

const OutlookMailFileAttachments = (props) => {
  const { fileAttachments } = props;
  const [totalFileSize, setTotalFileSize] = useState("");
  const [downloadAll, setDownloadAll] = useState(false);
  let [downLoadCount, setDownloadCount] = useState("");
  const { t } = useTranslation();

  let count = 0;
  const handleDownloadAll = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const fileList = [];
    setDownloadAll(true);
    for (const item of fileAttachments) {
      await services.downloadAttachments(item.mailId, item.id).then((file) => {
        if (Object.keys(file).length) {
          fileList.push(file);
        }
      });
      count++;
      setDownloadCount(count);
    }
    compareFile(fileList, "");
    setDownloadAll(false);
  };

  function getTotalFileSize(total, num) {
    return total + num;
  }
  useEffect(() => {
    const totalFileSize = fileAttachments
      .map((item) => item.size)
      .reduce(getTotalFileSize, 0);
    setTotalFileSize(totalFileSize);
  }, [fileAttachments]);
  return (
    <FileWrapperStyle>
      {fileAttachments.length > 0 && (
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <img src={fileAttach} alt={"attach-icon"} />
            <span style={{ fontSize: "12px", marginLeft: "5px" }}>
              {fileAttachments.length} file attachments (
              {(totalFileSize / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <div>
            {typeof downLoadCount === "number" && (
              <span className="pr-2" style={{ color: "#333" }}>
                ({downLoadCount}/{fileAttachments.length} total)
              </span>
            )}
            {fileAttachments.length > 1 && (
              <div
                className="d-flex justify-content-center align-items-center"
                onClick={handleDownloadAll}
                style={{ cursor: "pointer" }}
              >
                <span
                  style={{
                    color: "#03BD5D",
                    fontSize: "12px",
                    height: "18px",
                    marginRight: "5px",
                  }}
                >
                  {t("outlook.mail.download.all")}
                </span>
                {downloadAll ? (
                  <div className="d-flex justify-content-center flex-column">
                    <CircularProgress style={{ marginLeft: "6px" }} size={11} />
                  </div>
                ) : (
                  <img
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "2px",
                    }}
                    src={DownloadAll}
                    alt=""
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <ContentWrapperStyle
        style={{ marginBottom: "5px" }}
        className="row m-0 p-0"
      >
        {fileAttachments
          ?.filter(
            (file) =>
              file.contentType.includes("image") ||
              file.contentType.includes("mp4")
          )
          .map((file, index) => (
            <div
              key={index}
              className="col-12 col-lg-4"
              style={{ padding: "5px" }}
            >
              <OutlookMailMediaItem file={file} key={index} />
            </div>
          ))}
      </ContentWrapperStyle>
      <ContentWrapperStyle className="row m-0 p-0">
        {fileAttachments
          ?.filter(
            (file) =>
              !file.contentType.includes("image") &&
              !file.contentType.includes("mp4")
          )
          .map((file, index) => (
            <AttachmentItem file={file} key={file.id} />
          ))}
      </ContentWrapperStyle>
    </FileWrapperStyle>
  );
};

export default OutlookMailFileAttachments;
