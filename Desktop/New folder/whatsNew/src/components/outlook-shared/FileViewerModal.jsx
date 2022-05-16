import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import close from "../../assets/icons/close.svg";
import services from "../../outlook/apiService";
import OutLookLoading from "./OutLookLoading";

function FileViewerModal(props) {
  const { showModal, closeModal, fileInfo, imageFile } = props;
  const [loading, setLoading] = useState(false);
  const [iframe, setIframe] = useState();

  const base64ToBlob = (base64, type = "application/octet-stream") => {
    const binStr = atob(base64);
    const len = binStr.length;
    const arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: type });
  };

  const loadFile = async (fileInfo) => {
    setLoading(true);
    await services
      .downloadAttachments(fileInfo.mailId, fileInfo.id)
      .then((f) => {
        const blob = base64ToBlob(f.contentBytes, "application/pdf");
        const url = URL.createObjectURL(blob);
        view(url, f.contentType);
      });
    setLoading(false);
  };
  const view = (url, type) => {
    let iframeBuilder = `<iframe width="100%" height="100%" src=${url} type="text/html" class="internal">
        <embed src={url} type="${type}" />
    </iframe>
    `;
    setIframe(iframeBuilder);
  };

  useEffect(() => {
    try {
      loadFile(fileInfo);
    } catch (e) {}
  }, [fileInfo]);

  return (
    <>
      <Modal
        size="lg"
        show={showModal}
        className="files"
        onHide={(e) => {
          e.stopPropagation();
          closeModal();
        }}
        aria-labelledby="file-modal-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="file-modal-title-lg">
            <span className="channel-name">OutLook mail File</span>
            <h1>{fileInfo.name}</h1>
          </Modal.Title>
          <div className="file-controls">
            <img
              src={close}
              alt="subtract"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
              className="cross-image"
            />
          </div>
        </Modal.Header>
        <Modal.Body
          style={{ padding: fileInfo.contentType.includes("pdf") ? 0 : "1rem" }}
        >
          {!fileInfo.contentType.includes("image") &&
          !fileInfo.contentType.includes("pdf")
            ? "No preview available"
            : null}
          {imageFile && fileInfo.contentType.includes("image") ? (
            <img src={imageFile} alt="fileImage" />
          ) : null}
          {loading ? (
            <div
              className="d-flex w-100 justify-content-center align-items-center"
              style={{ marginTop: "75px" }}
            >
              <OutLookLoading />
            </div>
          ) : (
            fileInfo.contentType.includes("pdf") && (
              <div
                dangerouslySetInnerHTML={{
                  __html: iframe,
                }}
                style={{ height: "100%" }}
              />
            )
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default FileViewerModal;
