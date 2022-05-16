import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Progress from "../../utils/progress-bar";
import { useSelector, useDispatch } from "react-redux";
import options from "@toolbar/options.svg";
import rename from "@toolbar/rename.svg";
import NavDropdown from "react-bootstrap/NavDropdown";
import permissions from "@toolbar/permissions.svg";
import delete_icon from "@toolbar/delete_icon.svg";
import delete_icon_active from "@toolbar/delete_icon_active.svg";
import { Menu, Options, OptionsDropdown } from "./styles/attachment-post-style";
import ScrollComponent from "./ScrollComponent";
import FileAttachmentService from "../../../services/file-attachment-service";
import close from "../../../assets/icons/close.svg";
import download from "../../../assets/icons/download-file.svg";

const DOCUMENT_REVIEW = "document-review";

function DocumentViewerModal(props) {
  const dispatch = useDispatch();
  const channelName = useSelector((state) => state.channelDetails.name);
  const userId = useSelector((state) => state.AuthReducer.user.id);
  const [deleteIcon, setDeleteIcon] = useState(delete_icon);
  const { imageFileUrl } = useSelector((state) => state.fileReducer);

  const closeModal = () => {
    props.setLgShow(false);
    FileAttachmentService.resetImageFile(dispatch);
  };
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (props.lgShow) {
        closeModal();
      }
    }
  });

  const downloadFile = () => {
    if(props.docType === DOCUMENT_REVIEW){
      FileAttachmentService.downloadSignedFile(
        props.fileId,
        props.currentUser.email,
        `review-${props.fileInfo.signedFileName}`,
        undefined
      )
    } else {
      FileAttachmentService.downloadSignedFile(
        props.certificateId,
        props.currentUser.email,
        `certificate-${props.fileInfo.signedFileName}`,
        undefined
      )
    }
  } 
  useEffect(() => {
    const close = (e) => {
      e.stopPropagation();
      if (e.keyCode === 27) {
        props.setLgShow(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const { t } = useTranslation();
  return (
    <>
      <Modal
        size="lg"
        show={props.lgShow}
        className="files"
        onHide={(e) => {
          closeModal();
        }}
        aria-labelledby="file-modal-title-lg"
      >
        <Modal.Header>
          <Modal.Title id="file-modal-title-lg">
            <Row
              className={
                props.progressValue > 0 && props.progressValue < 100
                  ? "p-0 m-0"
                  : "p-0 m-0 d-none"
              }
            >
              <Progress height="4px" progress={props.progressValue} />
            </Row>
            <span className="channel-name">{channelName}</span>
            <h1
              dangerouslySetInnerHTML={{
                __html:
                  props.fileInfo?.status === "COMPLETED"
                    ? props.fileInfo.signedFileName
                    : props.fileInfo.fileName,
              }}
            />
          </Modal.Title>
          <div className="file-controls">
            <Menu>
              {!props.hideOptions && props.fileInfo.userId === userId && (
                <Options>
                  <OptionsDropdown
                    title={<img src={options} alt="options" />}
                    // drop="right"
                    id="nav-dropdown"
                  >
                    <NavDropdown.Item disabled className="disabled">
                      <img className="img-icon" src={rename} alt="rename" />
                      <span className="item-name">
                        {t("attachment:rename.label")}
                      </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item disabled className="disabled">
                      <img
                        className="img-icon"
                        src={permissions}
                        alt="permissions"
                      />
                      <span className="item-name">
                        {t("attachment:permissions.label")}
                      </span>
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onMouseOver={() => setDeleteIcon(delete_icon_active)}
                      onMouseOut={() => setDeleteIcon(delete_icon)}
                      onClick={() => props.setShowRemoveModal(true)}
                    >
                      <img className="img-icon" src={deleteIcon} alt="delete" />
                      <span className="item-name">
                        {t("attachment:delete.label")}
                      </span>
                    </NavDropdown.Item>
                  </OptionsDropdown>
                </Options>
              )}
            </Menu>
            <img
              src={download}
              alt="download"
              height={"24px"}
              width={"24px"}
              onClick={(e) => {
                e.stopPropagation();
                downloadFile();
              }}
              className="cross-image mr-3"
            />
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
        <Modal.Body>
          {props.fileInfo.mimeType?.split("/")[0] === "image" ? (
            <>
              {imageFileUrl ? (
                <img id="file-frame" src={imageFileUrl} alt="" title="" />
              ) : (
                <div style={{ height: "100px", margin: "30px" }}>
                  <span>{t("loading")}</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* {props.fileInfo.previewAvailable ? ( */}
              <ScrollComponent
                fileId={props.fileId}
                fileInfo={props.fileInfo}
                channelId={props.currentChannelId}
                postId={props.postId}
                folderId={props.folderId}
                fromFolder={props.fromFolder}
                viewType={props.docType}
                certificateId={props.certificateId}
              />
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DocumentViewerModal;
