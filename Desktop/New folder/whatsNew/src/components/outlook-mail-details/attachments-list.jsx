import React, { useEffect, useState } from "react";
import DownloadAll from "../../assets/icons/download-all-active.svg";
import SummaryFile from "./summary-file";
import { useSelector } from "react-redux";
import services from "../../outlook/apiService";
import { CircularProgress } from "@material-ui/core";
import compareFile from "./compare-file";
import _ from "lodash";
import { useTranslation } from "react-i18next";

const AttachmentsList = () => {
  const attachmentsList = useSelector(
    (state) => state.OutlookMailReducer?.activeAttachmentFiles
  );
  const { t } = useTranslation();
  const [downloadAll, setDownloadAll] = useState(false);
  const [totalFile, setTotalFile] = useState("");
  let [downLoadCount, setDownloadCount] = useState("");
  const [attachments, setAttachments] = useState([]);
  let count = 0;
  const handleDownloadAll = async (event) => {
    const fileList = [];
    event.preventDefault();
    let allAttachments = [];
    for (const item of attachmentsList) {
      for (const attachments of item.attachments) {
        allAttachments.push(attachments);
      }
    }
    for (const item of allAttachments) {
      setDownloadAll(true);
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
  useEffect(() => {
    if (attachmentsList.length > 0) {
      const result = _(attachmentsList)
        .groupBy("sender", "lastModifiedDateTime")
        .map((g) =>
          _.mergeWith({}, ...g, (obj, src) => {
            return _.isArray(obj) ? obj.concat(src) : undefined;
          })
        )
        .value();
      setAttachments(result);
    }
  }, [attachmentsList]);
  useEffect(() => {
    const total = attachmentsList.reduce((acc, item) => {
      acc += item.attachments.length;
      return acc;
    }, 0);
    setTotalFile(total);
  }, [attachmentsList]);
  useEffect(() => {
    if (downLoadCount === totalFile) {
      setTimeout(() => {
        setDownloadCount("");
      }, [1000]);
    }
  }, [downLoadCount]);
  return (
    <>
      <div
        className={"mr-0 ml-0 pr-0 pb-5 list-file-hover"}
        style={{
          width: "100%",
        }}
      >
        <div
          className="d-flex flex justify-content-end"
          style={{ margin: "0 20px" }}
        >
          {typeof downLoadCount === "number" && (
            <span className="pr-2" style={{ color: "#333", fontSize: "10px" }}>
              {t("mail-summary-action:compressingFile")}
            </span>
          )}
          {totalFile > 0 ? (
            <div
              className="d-flex justify-content-center align-items-center mt-3"
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
                {t("mail-summary-action:DownloadAll")}
              </span>
              {downloadAll ? (
                <div className="d-flex justify-content-center flex-column">
                  <CircularProgress style={{ marginLeft: "6px" }} size={11} />
                </div>
              ) : (
                <img
                  style={{ width: "14px", height: "14px", borderRadius: "2px" }}
                  src={DownloadAll}
                  alt=""
                />
              )}
            </div>
          ) : null}
        </div>
        <div
          className="d-flex flex-column file-list position-relative"
          style={{ margin: totalFile > 0 ? "10px 20px" : "0" }}
        >
          {totalFile > 0 ? (
            attachments?.map((item, index) => {
              return <SummaryFile key={index} item={item} />;
            })
          ) : (
            <p
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                padding: "10px 20px",
              }}
            >
              {t("mail-summary-action:noAttachments")}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
export default AttachmentsList;
