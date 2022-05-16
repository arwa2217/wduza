//Code commented in this file is to be used in future releases, please don't remove the same
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PermissionConstants } from "../../../constants/permission-constants";
import Progress from "../../utils/progress-bar";
import { StyledModal } from "./styles/styled-modal";
import { Break, FileExt } from "./styles/break";
import { CancelButton } from "./styles/cancel-button";
import { ShareButton } from "./styles/share-button";
import Close from "../../../assets/icons/attach-close.svg";
import UploadedFileIcon from "../../../assets/icons/uploaded-file.svg";
import RejectedFileIcon from "../../../assets/icons/rejected-file.svg";
import {
  fileIcon,
  getFileSizeBytes,
  knownFileType,
  fileExtension,
  getFileSize,
} from "../../utils/file-utility";
import { UploadStatus } from "../../../constants/channel/file-upload-status";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import ArrowUp from "../../../assets/icons/attach-arrow-up.svg";
import ArrowDown from "../../../assets/icons/attach-arrow-down.svg";

function AttachFileModal(props) {
  let fileNameDataArr = [];
  let myPermission = useRef(true);
  const { t, i18n } = useTranslation();
  var validFileNameExp =
    /^[^\/\\<>:"\|\?\x00\r\n\s]([^\/\\<>:"\|\?\x00\t\r\n]{0,192}[^\/\\<>:"\|\?\x00\r\n\s]|)$/;
  const [internalPermission, setInternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [internalPermissionOOO, setInternalPermissionOOO] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [externalPermission, setExternalPermission] = useState(
    PermissionConstants(t).DOWNLOAD
  );
  const [internalPermissionSelect, setInternalPermissionSelect] = useState({
    label: PermissionConstants(t).DOWNLOAD,
    value: PermissionConstants(t).DOWNLOAD,
  });
  const [internalPermissionOOOSelect, setInternalPermissionOOOSelect] =
    useState({
      label: PermissionConstants(t).DOWNLOAD,
      value: PermissionConstants(t).DOWNLOAD,
    });
  const [externalPermissionSelect, setExternalPermissionSelect] = useState({
    label: PermissionConstants(t).DOWNLOAD,
    value: PermissionConstants(t).DOWNLOAD,
  });
  const fileConfig = useSelector((state) => state.config.fileConfig);
  const [fileName, setFileName] = useState([]);
  const [viewPermission, setViewPermission] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [applyCss, setApplyCss] = useState(false);
  const allOptions = [
    { label: PermissionConstants(t).VIEW, value: PermissionConstants(t).VIEW },
    {
      label: PermissionConstants(t).DOWNLOAD,
      value: PermissionConstants(t).DOWNLOAD,
    },
    {
      label: PermissionConstants(t).NOT_ALLOWED,
      value: PermissionConstants(t).NOT_ALLOWED,
    },
  ];
  const options = [
    { label: PermissionConstants(t).VIEW, value: PermissionConstants(t).VIEW },
    {
      label: PermissionConstants(t).DOWNLOAD,
      value: PermissionConstants(t).DOWNLOAD,
    },
  ];
  let channelFilesStorage = useSelector(
    (state) => state.fileReducer.channelFilesStorage
  );

  let totalAllowed =
    channelFilesStorage && channelFilesStorage.fileQuotaAllowed;
  let totalUsed = channelFilesStorage && channelFilesStorage.fileQuotaUsed;

  const calculateQuotaSize = () => {
    let selectedFileSize = 0;
    if (props.totalFiles.length > 0) {
      props.totalFiles.map((el) => {
        selectedFileSize = selectedFileSize + el.file.size;
      });
    }
    if (props.files.length > 0) {
      props.files.map((el) => {
        selectedFileSize = selectedFileSize + el.file.size;
      });
    }
    return selectedFileSize + totalUsed < totalAllowed;
  };
  const updateName = (id, oldName, newName) => {
    // Set File Name
    let fileNameArr = [...fileName];
    fileNameArr.find((el) => el.id === id).name = newName;
    setFileName(fileNameArr);

    // Disabled Share Button if File name is invalid or blank
    setIsDisabled(
      fileNameArr.some(
        (el) => el.name === "" || !validFileNameExp.test(newName)
      )
    );

    // File Extension
    let splitFileName = oldName.split(".");
    let fileExt = splitFileName.length > 1 ? splitFileName.pop() : "";

    if (newName !== "" || validFileNameExp.test(newName)) {
      let fileNameMap = {
        oldName: oldName,
        newName: newName.toString() + "." + fileExt,
      };
      props.updateFileName(id, fileNameMap);
    }
  };

  const setFileNameAndExt = (id, fullName) => {
    let fileNameArr = [...fileName];
    let selectedId = fileNameArr.find((el) => el.id === id);

    const last_dot = fullName.lastIndexOf(".");
    const myFileName = fullName.slice(0, last_dot);
    let fileNameObj = {};
    fileNameObj.id = id;
    fileNameObj.name = selectedId === undefined ? myFileName : selectedId.name;
    fileNameDataArr.push(fileNameObj);
  };
  const handleModalClose = (value) => {
    props.handleClose();

    fileNameDataArr = [];
  };

  const handleFileDelete = (id) => {
    let fileNameArr = [...fileName];
    let selectedData = fileNameArr.find((el) => el.id === id);
    let filteredArr = fileNameArr.filter((el) => el.id !== id);
    let checkBlank = filteredArr.some(
      (el) => el.name === "" || !validFileNameExp.test(el.name)
    );

    if (selectedData.name !== "" && !validFileNameExp.test(selectedData.name)) {
      if (checkBlank) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } else {
      if (checkBlank) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
    props.DeleteFile(id);
  };
  useEffect(() => {
    if (props.files?.length > 3) {
      props.files.map(({ file, src, id }, index) =>
        internalPermission === PermissionConstants(t).VIEW ||
        internalPermissionOOO === PermissionConstants(t).VIEW ||
        externalPermission === PermissionConstants(t).VIEW
          ? fileConfig && fileConfig.mime.indexOf(file.type) !== -1
            ? file.size < getFileSizeBytes(fileConfig.maxfilesize)
              ? ""
              : setApplyCss(true)
            : file.type.split("/")[0] === "image" ||
              file.type === "application/pdf"
            ? ""
            : setApplyCss(true)
          : ""
      );
    }
  }, [internalPermission, internalPermissionOOO, externalPermission]);

  useEffect(() => {
    props.files.map(({ file, src, id }, index) => {
      setFileNameAndExt(id, file.name);
      setFileName(fileNameDataArr);
      if (myPermission.current === true) {
        if (
          (fileConfig &&
            // fileConfig.mime.indexOf(file.type) !== -1 &&
            file.size < getFileSizeBytes(fileConfig.maxfilesize)) ||
          file.type.split("/")[0] === "image" ||
          file.type === "application/pdf"
        ) {
          myPermission.current = true;
        } else {
          myPermission.current = false;
        }
      }
    });

    if (
      props.files.length + props.totalFiles.length >
      fileConfig.maxAllowedFilesInPost
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }

    if (props.files.length > fileConfig.maxAllowedFilesInPost) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }

    setViewPermission(myPermission.current);
    setInternalPermission(PermissionConstants(t).DOWNLOAD);
    setInternalPermissionOOO(PermissionConstants(t).DOWNLOAD);
    setExternalPermission(PermissionConstants(t).DOWNLOAD);
    if (props.files.length === 0) {
      handleModalClose(false);
    }
  }, [props.files]);
  return (
    <StyledModal
      show={props.show}
      onHide={() => handleModalClose(true)}
      centered
      backdrop={"static"}
      keyboard={false}
    >
      <Modal.Header className={`attach-header border-none`}>
        <div className="modal-heading">
          <div className="heading">{t("upload.modal:file.sharing.header")}</div>
          <div className="d-flex align-items-center">
            {props.status === UploadStatus.LOADED.toString() ? (
              <div
                // className={`d-flex ${
                //   props.files.length + props.totalFiles.length >
                //   fileConfig.maxAllowedFilesInPost
                //     ? "justify-content-between"
                //     : "justify-content-end"
                // }`}
                className={`d-flex ${
                  props.files.length > fileConfig.maxAllowedFilesInPost
                    ? "justify-content-between"
                    : "justify-content-end"
                }`}
                // style={{ paddingRight: "38px" }}
              >
                <div>
                  {/*{props.files.length + props.totalFiles.length >*/}
                  {/*  fileConfig.maxAllowedFilesInPost && (*/}
                  {/*  <div*/}
                  {/*    className="text-danger"*/}
                  {/*    style={{ fontSize: "13px", margin: "0px 22px" }}*/}
                  {/*  >*/}
                  {/*    {t("upload.modal:sharing.limit", {*/}
                  {/*      count: fileConfig.maxAllowedFilesInPost,*/}
                  {/*    })}*/}
                  {/*  </div>*/}
                  {/*)}*/}
                  {props.files.length > fileConfig.maxAllowedFilesInPost && (
                    <div
                      className="text-danger"
                      style={{ fontSize: "13px", margin: "0px 22px" }}
                    >
                      {t("upload.modal:sharing.limit", {
                        count: fileConfig.maxAllowedFilesInPost,
                      })}
                    </div>
                  )}
                  {calculateQuotaSize() === false && (
                    <div className="text-danger" style={{ fontSize: "13px" }}>
                      {t("upload.modal:quota.limit")}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "14px", margin: "0px 22px" }}>
                  <span
                    // className={`${
                    //   props.files.length + props.totalFiles.length >
                    //   fileConfig.maxAllowedFilesInPost
                    //     ? "text-danger"
                    //     : "text-primary"
                    // }`}
                    className={`${
                      props.files.length > fileConfig.maxAllowedFilesInPost
                        ? "text-danger"
                        : "text-primary"
                    }`}
                  >
                    {/*{`${t("upload.modal:file.count", {*/}
                    {/*  selectedFilesCount: (*/}
                    {/*    "0" +*/}
                    {/*    (props.files.length + props.totalFiles.length)*/}
                    {/*  ).slice(-2),*/}
                    {/*})}`}*/}
                    {`${t("upload.modal:file.count", {
                      selectedFilesCount: ("0" + props.files.length).slice(-2),
                    })}`}
                  </span>
                  <span style={{ color: "#19191A", fontWeight: "normal" }}>
                    {fileConfig?.maxAllowedFilesInPost
                      ? ` / ${fileConfig.maxAllowedFilesInPost}`
                      : 10}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}
            {props.status === UploadStatus.PENDING.toString() ? (
              <span className="uploading" status={props.status}>
                {t("upload.modal:uploading.text")}
              </span>
            ) : (
              props.status === UploadStatus.UPLOAD_ERROR.toString() && (
                <span className="upload_error">
                  {t("upload.modal:upload.failed.text")}
                </span>
              )
            )}
            <button
              type="button"
              className="close attachment-close"
              onClick={(e) => handleModalClose(true)}
            >
              <span aria-hidden="true">
                <img src={Close} alt="" />
              </span>
              <span className="sr-only">
                {t("rename.discussion.modal:close")}
              </span>
            </button>
          </div>
        </div>
      </Modal.Header>
      <Modal.Header
        className={`attach-header ${
          props.files?.length > 6 || applyCss ? "scrollable-y" : ""
        }`}
      >
        <div className="thumbnail-container">
          {props.files.length > 0 &&
            props.files.map(({ file, src, id }, index) => (
              <div className="d-flex flex-column" key={`thumb-${id}`}>
                <div id={id} className="thumbnail-wrapper">
                  <FileExt className="btn thumbnail">{`.${fileExtension(
                    file.type
                  )}`}</FileExt>
                  <div className="input-group">
                    <input
                      className="form-control thumbnail-caption"
                      value={fileName.length > 0 && fileName[index]?.name}
                      onChange={(e) => {
                        updateName(id, file.name, e.target.value);
                      }}
                      disabled={
                        props.status === UploadStatus.PENDING.toString()
                      }
                    />
                    {props.status !== UploadStatus.PENDING.toString() && (
                      <div className="input-group-append">
                        <span onClick={() => handleFileDelete(id)}>
                          <img src={Close} alt="" style={{ width: "13px" }} />
                        </span>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      height: "20px",
                      textAlign: "right",
                      // margin: "6px 0px 6px 20px",
                    }}
                  >
                    {Object.keys(props.uploaded).length > 0
                      ? Object.keys(props.uploaded).includes(id.toString()) && (
                          <img
                            src={UploadedFileIcon}
                            alt=""
                            style={{
                              width: "20px",
                              height: "20px",
                              marginLeft: "20px",
                            }}
                          />
                        )
                      : ""}
                  </div>
                </div>
                {fileName.length > 0 &&
                  !validFileNameExp.test(fileName[index]?.name?.toString()) && (
                    <div className="text-danger">
                      {t("upload.modal:invalid.name.error")}
                    </div>
                  )}
                {/*{internalPermission === PermissionConstants(t).VIEW ||*/}
                {/*internalPermissionOOO === PermissionConstants(t).VIEW ||*/}
                {/*externalPermission === PermissionConstants(t).VIEW ? (*/}
                {/*  fileConfig && fileConfig.mime.indexOf(file.type) !== -1 ? (*/}
                {/*    file.size < getFileSizeBytes(fileConfig.maxfilesize) ? (*/}
                {/*      ""*/}
                {/*    ) : (*/}
                {/*      <div*/}
                {/*        className="text-primary"*/}
                {/*        style={{ height: "12px", marginBottom: "15px" }}*/}
                {/*      >*/}
                {/*        {t("upload.modal:not.support.view.only")}*/}
                {/*      </div>*/}
                {/*    )*/}
                {/*  ) : file.type.split("/")[0] === "image" ||*/}
                {/*    file.type === "application/pdf" ? (*/}
                {/*    ""*/}
                {/*  ) : (*/}
                {/*    <div*/}
                {/*      className="text-primary"*/}
                {/*      style={{ height: "12px", marginBottom: "15px" }}*/}
                {/*    >*/}
                {/*      {t("upload.modal:not.support.view.only")}*/}
                {/*    </div>*/}
                {/*  )*/}
                {/*) : (*/}
                {/*  ""*/}
                {/*)}*/}
              </div>
            ))}
        </div>
      </Modal.Header>
      <Modal.Footer>
        <CancelButton onClick={(e) => handleModalClose(true)}>
          {t("upload.modal:cancel.button")}
        </CancelButton>
        <ShareButton
          onClick={(e) => {
            props.setIsFileAdded(true);
            setIsDisabled(true);
            props.onSubmit(e);
          }}
          disabled={isDisabled || calculateQuotaSize() === false ? true : false}
        >
          {t("upload.modal:share.button")}
        </ShareButton>
      </Modal.Footer>
    </StyledModal>
  );
}

export default AttachFileModal;
