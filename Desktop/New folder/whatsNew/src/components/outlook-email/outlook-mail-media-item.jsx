import React, { useEffect, useState } from "react";
import services from "../../outlook/apiService";
import { Skeleton } from "@material-ui/lab";
import "./outlook-mail-item-image.css";
import FileViewerModal from "../outlook-shared/FileViewerModal";
import DownloadIcon from "../../assets/icons/download-icon.svg";
import { ReactVideo } from "reactjs-media";
const OutlookMailMediaItem = (props) => {
  const { file } = props;
  const isImageFile = file.contentType.includes("image");
  const [mediaFileSrc, setMediaFileSrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleDownLoadFile = async () => {
    setLoading(true);
    await services.downloadAttachments(file.mailId, file.id).then((f) => {
      const downloadLink = `data:${f.contentType};base64 ,${f.contentBytes}`;
      setMediaFileSrc(downloadLink);
      setLoading(false);
    });
  };

  const handleDownloadImage = (event) => {
    event.stopPropagation();
    let link = document.createElement("a");
    link.setAttribute("download", file.name);
    link.setAttribute("href", mediaFileSrc);
    link.click();
  };

  useEffect(() => {
    handleDownLoadFile();
  }, [file]);

  return (
    <>
      {loading ? (
        <Skeleton animation="wave" variant="rect" height={128} />
      ) : isImageFile ? (
        <div
          className={isImageFile ? "image-wrapper" : ""}
          onClick={handleShowModal}
        >
          <img src={mediaFileSrc} alt={file.name} className="image-item" />
          <div className="image-des-wrapper">
            <div className="image-description" onClick={handleShowModal}>
              {file.name}
            </div>
            <div>
              <img
                onClick={(event) => handleDownloadImage(event)}
                src={DownloadIcon}
                alt="download-icon"
              />
            </div>
          </div>
          <FileViewerModal
            showModal={showModal}
            closeModal={handleCloseModal}
            fileInfo={file}
            imageFile={mediaFileSrc}
          />
        </div>
      ) : (
        <ReactVideo
          src={mediaFileSrc}
          //poster="https://sieupet.com/sites/default/files/pictures/images/1-1473150685951-5.jpg"
          primaryColor="red"
          className={"media-video"}
          type="video/mp4"
        />
      )}
    </>
  );
};

export default OutlookMailMediaItem;
