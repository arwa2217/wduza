import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import moment from "moment";
import { CircularProgress } from "@material-ui/core";
import DownloadIcon from "../../assets/icons/download-icon.svg";
import services from "../../outlook/apiService";
import FileAttachment from "../../assets/icons/file-attachment.svg";
import { useDispatch } from "react-redux";
import { setMailHighLight } from "../../store/actions/outlook-mail-actions";

const FileItem = (props) => {
  const [fileLoading, setFileLoading] = useState(false);
  const { file, label } = props;
  const dispatch = useDispatch();
  const handleDownLoadFile = async (event, file) => {
    event.stopPropagation();
    setFileLoading(true);
    await services.downloadAttachments(file.mailId, file.id).then((file) => {
      if (Object.keys(file).length) {
        const downloadLink = `data:${file.contentType};base64 ,${file.contentBytes}`;
        let link = document.createElement("a");
        link.setAttribute("download", file.name);
        link.setAttribute("href", downloadLink);
        link.click();
      }
    });
    setFileLoading(false);
  };
  const handleHighLight = (mailId) => {
    dispatch(setMailHighLight(mailId));
  };
  return (
    <div
      className=" w-100 d-flex align-items-center justify-content-between"
      key={file.id}
      style={{
        cursor: "pointer",
        margin: "10px 20px",
      }}
      onClick={() => handleHighLight(file.mailId)}
    >
      <div className="d-flex w-100 file-body">
        <img
          src={FileAttachment}
          alt="file-icon"
          style={{
            marginRight: "10px",
            height: "32px",
            width: "32px",
          }}
        />
        <div
          className="d-flex flex-column"
          style={{
            width: "calc(100% - 76px)",
          }}
        >
          <OverlayTrigger
            placement="top"
            delay={{ show: 150, hide: 100 }}
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip id={"file-name"}>{file.name ? file.name : ""}</Tooltip>
            }
          >
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "12px",
                color: "#19191A",
                marginBottom: "4px",
                marginRight: "10px",
              }}
            >
              {file.name}
            </span>
          </OverlayTrigger>

          {/*<div style={{ marginBottom: "4px", color: "#999999" }}>{label}</div>*/}
          <div style={{ color: "#666666" }}>
            {(file.size / 1024).toFixed(2)} KB
          </div>
        </div>
        {fileLoading ? (
          <div className="d-flex justify-content-center flex-column">
            <CircularProgress style={{ marginLeft: "6px" }} size={18} />
          </div>
        ) : (
          <img
            src={DownloadIcon}
            alt="fileDownload"
            style={{ height: "30px", width: "30px" }}
            onClick={(event) => handleDownLoadFile(event, file)}
          />
        )}
      </div>
    </div>
  );
};
export default FileItem;
