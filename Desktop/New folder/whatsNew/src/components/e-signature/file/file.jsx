import React from "react";
import { useTranslation } from "react-i18next";
import {
  BsFileEarmarkPdfFill,
  BsFileEarmarkWord,
  BsFileEarmarkExcel,
  BsFillFileEarmarkTextFill,
} from "react-icons/bs";
import { fileTypes } from "./fileTypes";
import "./file.css";
import { getFileSize } from "../../utils/file-utility";
import pdfImage from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import checkMarkIcon from "../../../assets/icons/v2/check-mark-icon.svg";
import downloadIcon from "../../../assets/icons/download-signature-file.svg";
import { render } from "enzyme";

var truncateMiddle = require("truncate-middle");
const File = (props) => {
  const { fileName, fileType, fileSize, edit, fileDetails } = props;
  const { t } = useTranslation();
  const _renderFileType = (type) => {
    switch (type) {
      case fileTypes.PDF:
        return <img src={pdfImage} style={{ borderRadius: "3px" }} alt="pdf" />;
      case fileTypes.DOCX:
        return <BsFileEarmarkWord />;
      case fileTypes.XLS:
        return <BsFileEarmarkExcel />;
      case fileTypes.XLSX:
        return <BsFileEarmarkExcel />;
      default:
        return <BsFillFileEarmarkTextFill />;
    }
  };
  const downloadFile = () => {
    var reader = new FileReader();
    reader.onloadend = function () {
      var a = document.createElement("a");
      a.href = reader.result;
      a.download = fileName;
      a.click();
    };
    reader.readAsDataURL(fileDetails);
  };
  const viewFile = () => {
    var reader = new FileReader();
    reader.onloadend = function () {
      const blob = new Blob([reader.result], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    };
    reader.readAsDataURL(fileDetails);
  };
  return (
    <>
      <div className="review-send-col4">
        <div className="file-placeholder">
          <div className="file-icon">{_renderFileType(fileType)}</div>
          <div className="file-container">
            <div className="file-name-text" title={fileName}>
              {fileName?.length > 29
                ? truncateMiddle(fileName, 18, 11, "...")
                : fileName || t("dummy.file.name")}
            </div>
            <div className="file-size">
              {getFileSize(fileSize, 1) || t("dummy.file.size")}
            </div>
          </div>
        </div>
        <div className="file-action-panel">
          <div
            className="view-section"
            onClick={() => {
              viewFile();
            }}
          >
            <img
              src={checkMarkIcon}
              style={{ borderRadius: "3px" }}
              alt="pdf"
            />
            <div className="action-text">View</div>
          </div>
          <div className="download-section">
            <img
              src={downloadIcon}
              style={{
                borderRadius: "3px",
                color: "#03BD5D",
                cursor: "pointer",
              }}
              alt="pdf"
            />
            <div
              onClick={() => {
                downloadFile();
              }}
              className="action-text"
            >
              Download
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default File;
