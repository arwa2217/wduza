import React, { useState } from "react";
import FileAttachment from "../../assets/icons/file-icon.png";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import DownloadIcon from "../../assets/icons/download-icon.svg";
import services from "../../outlook/apiService";
import FileViewerModal from "../outlook-shared/FileViewerModal";
import OutLookLoading from "../outlook-shared/OutLookLoading";

const AttachmentItem = (props) => {
  const { file } = props;
  const [fileLoading, setFileLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleDownLoadFile = async (event, file) => {
    event.preventDefault();
    event.stopPropagation();
    setFileLoading(true);
    await services.downloadAttachments(file.mailId, file.id).then((f) => {
      const downloadLink = `data:${f.contentType};base64 ,${f.contentBytes}`;
      let link = document.createElement("a");
      link.setAttribute("download", f.name);
      link.setAttribute("href", downloadLink);
      link.click();
    });
    setFileLoading(false);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <div
      className="col-12 col-lg-4"
      style={{ padding: "5px", marginBottom: "10px" }}
    >
      <div
        className="d-flex w-100 justify-content-between file-wrapper"
        onClick={handleShowModal}
      >
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
          className="w-100 d-flex flex-column"
          style={{ overflow: "hidden" }}
        >
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 150, hide: 100 }}
            trigger={["hover", "focus"]}
            overlay={
              <Tooltip id={"file-name"}>{file.name ? file.name : ""}</Tooltip>
            }
          >
            <div
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "calc(100% - 16px)",
                fontSize: "12px",
                color: "#19191A",
                marginBottom: "4px",
              }}
            >
              {file.name}
            </div>
          </OverlayTrigger>
          <div style={{ color: "#666666" }}>
            {(file.size / 1024).toFixed(2)} KB
          </div>
        </div>
        {fileLoading ? (
          <OutLookLoading />
        ) : (
          <img
            onClick={(event) => handleDownLoadFile(event, file)}
            style={{ height: "30px", width: "30px" }}
            src={DownloadIcon}
            alt="fileDownload"
          />
        )}
      </div>
      <FileViewerModal
        showModal={showModal}
        closeModal={handleCloseModal}
        fileInfo={file}
      />
    </div>
  );
};
export default AttachmentItem;
