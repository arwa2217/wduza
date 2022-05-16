import React, { useEffect, useState } from "react";
import "../channel-details/channel-details.css";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import IConDownload from "../../assets/icons/_Icon Download.png";
import { CircularProgress } from "@material-ui/core";
import services from "../../outlook/apiService";
import download from "@toolbar/download.svg";
import FileItem from "./file-item";
import compareFile from "./compare-file";
import _ from "lodash";
const ChannelMemberStyle = styled.div`
  display: flex;
  align-items: center;
  // margin: 0 16px;
  overflow: hidden;
  //padding: 0 10px;
  flex-direction: column;
  width: 100%;
  //margin-bottom: 10px;
  > img {
    width: 20px;
    height: 20px;
  }
  > p {
    width: 150px;
    margin: 0;
    margin-bottom: 0;
  }
  > button {
    justify-self: flex-end;
  }
  .name-sender {
    width: 100%;
    font-family: Roboto, serif;
    font-style: normal;
    font-weight: bold;
    font-size: 12px;
    line-height: 16px;
    color: #19191a;
    padding-bottom: 10px;
  }
  .file-body {
    border: 1px solid #dedede;
    border-radius: 5px;
    padding: 10px;
    font-size: 12px;
    line-height: 12px;
    cursor: pointer;
  }
  .file-body:hover {
    background: #f8f8f8;
  }
`;

function SummaryFile(props) {
  const { t, i18n } = useTranslation();
  const [fileDownloadAll, setFileDownloadAll] = useState(false);
  let [downLoadCount, setDownloadCount] = useState("");
  const { item } = props;
  let count = 0;
  const handleDownLoadAllSenderFile = async (event) => {
    const listItem = [...item.attachments];
    const fileList = [];
    for (const item of listItem) {
      setFileDownloadAll(true);
      await services.downloadAttachments(item.mailId, item.id).then((file) => {
        if (Object.keys(file).length) {
          fileList.push(file);
        }
      });
      count++;
      setDownloadCount(count);
    }
    compareFile(fileList, item.sender);
    setFileDownloadAll(false);
  };
  const isHaveAttachment = _.uniqBy(
    item.attachments.filter((item) => item.isInline === false),
    "id"
  );
  useEffect(() => {
    if (downLoadCount === item.attachments.length) {
      setTimeout(() => {
        setDownloadCount("");
      }, [1000]);
    }
  }, [downLoadCount]);
  return (
    <ChannelMemberStyle>
      {isHaveAttachment.length ? (
        <div className="name-sender w-100 d-flex justify-content-between">
          <div
            className="d-flex"
            onClick={handleDownLoadAllSenderFile}
            style={{ cursor: "pointer" }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "120px",
                display: "block",
                paddingRight: "10px",
              }}
              title={item?.sender}
            >
              {item.sender}
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "120px",
                display: "block",
                fontWeight: "normal",
                color: "#999999",
              }}
              title={item?.sender}
            >
              {item.lastModifiedDateTime}
            </span>
            {fileDownloadAll ? (
              <div className="d-flex justify-content-center flex-column">
                <CircularProgress style={{ marginLeft: "6px" }} size={18} />
              </div>
            ) : (
              <img
                src={IConDownload}
                alt="i-con-all-download"
                style={{
                  paddingLeft: "3px",
                  cursor: "pointer",
                  width: "14px",
                  height: "14px",
                }}
              />
            )}
            {typeof downLoadCount === "number" && (
              <span className="pl-2" style={{ color: "#333", fontSize: "9px" }}>
                {t("mail-summary-action:compressingFile")}
              </span>
            )}
          </div>
        </div>
      ) : null}
      {isHaveAttachment.map((file, index) => (
        <FileItem key={index} file={file} label={item.lastModifiedDateTime} />
      ))}
    </ChannelMemberStyle>
  );
}

export default SummaryFile;
