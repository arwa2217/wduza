import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import ModalActions from "../../../store/actions/modal-actions";
import { useTranslation } from "react-i18next";
import { resetCreateChannelAction } from "../../../store/actions/channelActions";
import {
  BoxDivInner,
  BoxDivLarge,
  BoxDivWrapper,
  Details,
  FileExtIcon,
  FileInfo,
  Name,
  Size,
} from "../../post-view/post-msg-view/styles/attachment-post-style";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";
import { cleanUserListState } from "../../../store/actions/user-actions";
import Close from "../../../assets/icons/close.svg";
import monolyIcon from "../../../assets/icons/monoly-icon-title.svg";
import downloadFilecon from "../../../assets/icons/download-file-icon.svg";
import "./guest-file-share-modal.css";
import { getFileSize } from "../../utils/file-utility";
import UserService from "../../../services/user-service";
import { useHistory } from "react-router";
import { updateGuestSharedDeletedFiles } from "../../../store/actions/main-files-actions";

function GuestFileShareModal(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const creatingChannel = useSelector(
    (state) => state.ChannelReducer.creatingChannel
  );
  const guestSharedDeletedFiles = useSelector(
    (state) => state.mainFilesReducer.guestSharedDeletedFiles
  );

  const handleClose = () => {
    setShow(false);
    dispatch(cleanUserListState());
    dispatch(resetCreateChannelAction());
    dispatch(ModalActions.hideModal("xyz"));
    history.push("/home");
  };

  const downloadFile = (e, fileObj) => {
    const { file_id } = fileObj;
    e.preventDefault();
    let postObj = {
      access_code: props.accessCode,
      file_id,
    };
    let result = UserService.guestFileDownload(postObj, fileObj);
    result
      .then((res) => {
        if (res) {
          dispatch(
            updateGuestSharedDeletedFiles([...guestSharedDeletedFiles, res])
          );
        }
      })
      .catch((error) => {
        console.log("Error : ", error);
      });
  };

  const getRemainingTime = (expiryDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date();
    const secondDate = new Date(expiryDate);

    const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));

    return diffDays;
  };

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        className="guest-file-share-modal"
        centered
      >
        <ModalHeader>
          <img src={monolyIcon} alt="" />
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <p className="email-msg">
              {t(
                props.fileData?.count > 1
                  ? "files:guestFilesShare.download.prefix"
                  : "files:guestFileShare.download.prefix",
                {
                  inviter: props.fileData?.inviterName,
                  count: props.fileData?.count,
                }
              )}
              <b>{props.fileData?.invitee}</b>
              {t(
                props.fileData?.count > 1
                  ? "files:guestFilesShare.download.prefix"
                  : "files:guestFileShare.download.prefix"
              )}
            </p>
            <p className="time-remaining">
              <time
                className="post__time"
                dateTime={new Date(
                  props.fileData?.fileExpiry * 1000
                ).toISOString()}
                title={new Date(props.fileData?.fileExpiry * 1000)}
              >
                {t("files:guestFileShare.expire", {
                  time: new Date(props.fileData?.fileExpiry * 1000),
                })}
              </time>
              {t(
                getRemainingTime(props.fileData?.fileExpiry * 1000) > 1
                  ? "files:guestFileShare.daysRemaining"
                  : "files:guestFileShare.dayRemaining",
                { days: getRemainingTime(props.fileData?.fileExpiry * 1000) }
              )}
            </p>
          </div>
          {props.fileData?.filesMetaData?.length &&
            props.fileData.filesMetaData.map((fileItem, index) => {
              return (
                <BoxDivWrapper
                  key={`${fileItem.id}-${index}`}
                  style={{
                    margin: "0px 0px 10px 0px",
                    width: "100%",
                  }}
                >
                  <BoxDivLarge
                    style={{
                      maxWidth: "480px",
                      justifyContent: "space-between",
                    }}
                  >
                    <BoxDivInner>
                      <FileExtIcon src={FileExtIconImage} alt="" />
                      <Details>
                        <FileInfo>
                          <Name title={`${fileItem.name}`}>
                            {fileItem.name}
                          </Name>
                          <Size>{getFileSize(fileItem.size, 1)}</Size>
                        </FileInfo>
                      </Details>
                    </BoxDivInner>
                    {!guestSharedDeletedFiles.some(
                      (file) => file === fileItem.file_id
                    ) && (
                      <FileExtIcon
                        src={downloadFilecon}
                        alt=""
                        onClick={(e) =>
                          !guestSharedDeletedFiles.some(
                            (file) => file === fileItem.file_id
                          ) && downloadFile(e, fileItem)
                        }
                      />
                    )}
                  </BoxDivLarge>
                  {guestSharedDeletedFiles.some(
                    (file) => file === fileItem.file_id
                  ) ? (
                    <div className="text-danger">
                      {t("files:guestFileShare.cantDownload")}
                    </div>
                  ) : (
                    <></>
                  )}
                </BoxDivWrapper>
              );
            })}
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className="download-btn"
            onClick={(e) =>
              props.fileData.filesMetaData.map(
                (fileItem) =>
                  !guestSharedDeletedFiles.some(
                    (file) => file === fileItem.file_id
                  ) && downloadFile(e, fileItem)
              )
            }
          >
            {creatingChannel && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {t("files:downloadAll")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GuestFileShareModal;
