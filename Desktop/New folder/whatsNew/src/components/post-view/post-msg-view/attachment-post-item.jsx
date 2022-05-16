import React, { useState, useEffect } from "react";
import download from "@toolbar/download.svg";
import viewCountGrey from "../../../assets/icons/v2/ic_file_view.svg";
import fileImage from "../../../assets/icons/v2/ic_file_jpg_l.svg";
import filePDF from "../../../assets/icons/v2/ic_file_pdf_l_attachment.svg";
import fileDocx from "../../../assets/icons/v2/ic_file_doc_l.svg";
import fileExcel from "../../../assets/icons/attach-file/ic_file_excel.svg";
import esignatureHover from "../../../assets/icons/v2/ic_file_esignature_hover.svg";
import downloadHover from "../../../assets/icons/v2/ic_file_download_hover.svg";
import moreHover from "../../../assets/icons/v2/ic_file_more_hover.svg";
import viewHover from "../../../assets/icons/v2/ic_file_view_hover.svg";
import downloadCount from "../../../assets/icons/download-count.svg";
import downloadCountGrey from "../../../assets/icons/v2/ic_file_download.svg";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";
import rename from "@toolbar/rename.svg";
import permissions from "@toolbar/permissions.svg";
import options from "@toolbar/options.svg";
import delete_icon from "@toolbar/delete_icon.svg";
import delete_icon_active from "@toolbar/delete_icon_active.svg";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { PermissionConstants } from "../../../constants/permission-constants";
import SVG from "react-inlinesvg";
import {
  FileStatsType,
  UploadStatus,
} from "../../../constants/channel/file-upload-status";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSelector, useDispatch } from "react-redux";
import Progress from "../../utils/progress-bar";
import Row from "react-bootstrap/Row";
import { renderUtil } from "../../utils/render-utils";
import {
  BoxDiv,
  BoxDivInner,
  FileExtIcon,
  Details,
  FileActionHover,
  FileInfoHover,
  ImageName,
  Name,
  ImageSize,
  Size,
  Menu,
  MenuDownload,
  Download,
  Options,
  OptionsDropdown,
  DeleteBox,
  DeleteMsgDiv,
  DownloadInfo,
  InfoCount,
} from "./styles/attachment-post-style";
import { useTranslation } from "react-i18next";
import ConfirmDeleteModal from "./confirm-delete-modal";
import FileAttachmentService from "../../../services/file-attachment-service";
import {
  fetchFileList,
  fileStorageDetails,
} from "../../../store/actions/files-actions";
import DocumentViewerModal from "./document-viewer-modal";
import { AuthHeader } from "../../../utilities/app-preference";
import axios from "axios";
import server from "server";
import NoPreview from "../../../assets/icons/no-preview.svg";
import LoadingPreview from "../../../assets/icons/loading-preview.svg";
import UserType from "../../../constants/user/user-type";
import { Fragment } from "react";
import FigmaIcon from "../../../assets/icons/v2/ic_file_figma.svg";
import SketchIcon from "../../../assets/icons/v2/ic_file_sketch.svg";
import PowerPoint from "../../../assets/icons/v2/ic_file_powerpoint.svg";
import FileKeyIcon from "../../../assets/icons/v2/ic_file_keynote.svg";
import AfterEffect from "../../../assets/icons/v2/ic_file_after_effects.svg";
import XdFile from "../../../assets/icons/v2/ic_file_xd.svg";
import AIFile from "../../../assets/icons/v2/ic_file_illustrator.svg";
import PhotoshopFile from "../../../assets/icons/v2/ic_file_photoshop.svg";
import PremiereFile from "../../../assets/icons/v2/ic_file_premiere.svg";
import MusicFile from "../../../assets/icons/v2/ic_file_music.svg";
import VideoFile from "../../../assets/icons/v2/ic_file_video.svg";
import FileImage from "../../../assets/icons/v2/ic_file_image.svg";
import TxtFile from "../../../assets/icons/v2/ic_file_txt.svg";
import ZipFile from "../../../assets/icons/v2/ic_file_zip.svg";
import FileWord from "../../../assets/icons/v2/ic_file_word.svg";
import FileExcel from "../../../assets/icons/v2/ic_file_excel.svg";
import FilePDF from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import FileETC from "../../../assets/icons/attach-file/ic_file_etc.svg";

function AttachmentPostItem(props) {
  const { channelUpdate } = useSelector((state) => state.channelMessages);

  const dispatch = useDispatch();
  const userNetwork = useSelector((state) => state.AuthReducer.networkType);

  const { t } = useTranslation();
  const [thumbnailPreview, setThumbnailPreview] = useState(LoadingPreview);
  const [deleteIcon, setDeleteIcon] = useState(delete_icon);
  const userId = useSelector((state) => state.AuthReducer.user.id);
  const userType = useSelector((state) => state.AuthReducer.user.userType);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const channelId = useSelector((state) => state.channelDetails.id);
  let queryParams = { channelId: channelId, user: false };
  const [progressValue, setProgressValue] = useState(0);
  const fileDLStats = props.fileInfo && props.fileInfo.fileDLStats?.stats;
  let currentChannelId = useSelector(
    (state) => state.config.activeSelectedChannel?.id
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const viewerData =
    fileDLStats &&
    fileDLStats !== null &&
    fileDLStats.filter((stat) => stat.type === FileStatsType.VIEWED);

  const downloadData =
    fileDLStats &&
    fileDLStats !== null &&
    fileDLStats.filter((stat) => stat.type === FileStatsType.DOWNLOADED);

  const hasViewedCurrentUser =
    viewerData[0].users !== null &&
    viewerData[0].users.length > 0 &&
    viewerData[0].users.some((el) => el.userId === props.currentUser.id);

  const hasDownloadCurrentUser =
    downloadData[0].users !== null &&
    downloadData[0].users.length > 0 &&
    downloadData[0].users.some((el) => el.userId === props.currentUser.id);

  const [lgShow, setLgShow] = useState(false);

  useEffect(() => {
    getThumbnailFromID(props.fileInfo.fileId, currentChannelId, props.post?.id);
  }, [props.fileInfo.fileId]);

  useEffect(() => {}, [channelUpdate]);
  useEffect(() => {
    downloadEnabled();
  }, [userNetwork]);

  function downloadEnabled() {
    //let userNetwork = FileAttachmentService.currentNetwork();
    if (props.fileInfo.queryUserType === "INTERNAL") {
      if (
        props.fileInfo.intPerm === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "INTERNAL"
      ) {
        return true;
      }
      if (
        props.fileInfo.intPermOOO === PermissionConstants(t).DOWNLOAD_ENUM &&
        userType === UserType.INTERNAL &&
        userNetwork === "EXTERNAL"
      ) {
        return true;
      }
      if (
        props.fileInfo.extPerm === PermissionConstants(t).DOWNLOAD_ENUM &&
        (userType === UserType.EXTERNAL || userType === UserType.GUEST) &&
        userNetwork === "EXTERNAL"
      ) {
        return true;
      }
    }
    if (props.fileInfo.queryUserType === "EXTERNAL") {
      if (props.fileInfo.extPerm === PermissionConstants(t).DOWNLOAD_ENUM) {
        return true;
      }
    }
    return false;
  }

  const showViewerUserList = (event) => {
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      `${props.postForwardFlag ? "forward_" : ""} viewer_update_container ${
        props.fileInfo.fileId
      }`
    );
    if (parentTarget) {
      const channelMembers = props.members;

      const fileInfoValues =
        fileDLStats !== null &&
        fileDLStats.filter((stat) => stat.type === FileStatsType.VIEWED)[0]
          .users;
      const fileInfoUserList =
        fileInfoValues !== null && fileInfoValues.length > 0
          ? fileInfoValues
          : [];
      let memberList = [];
      for (let index = 0; index < fileInfoUserList.length; index++) {
        let matchedUser = channelMembers.find(
          (el) => el.id === fileInfoUserList[index].userId
        );
        if (matchedUser !== undefined) {
          let newMemberUpdated = {
            ...matchedUser,
            timestamp: `${t("postTime-12", {
              time: fileInfoUserList[index].timestamp,
            })}`,
          };
          memberList.push(newMemberUpdated);
        } else {
          let newMemberUpdated = {
            ...fileInfoUserList[index],
            timestamp: `${t("postTime-12", {
              time: fileInfoUserList[index].timestamp,
            })}`,
          };
          memberList.push(newMemberUpdated);
        }
      }

      if (memberList.length > 0) {
        renderUtil.renderMemberList(
          parentTarget,
          memberList,
          props.channel,
          props.currentUser.id,
          ""
        );
      }
    }
  };
  const hideViewerUserList = (event) => {
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      `${props.postForwardFlag ? "forward_" : ""} viewer_update_container ${
        props.fileInfo.fileId
      }`
    );
    setTimeout(() => {
      renderUtil.removeMemberList(parentTarget, [], 0, "");
    }, 200);
  };

  const showDownloadUserList = (event) => {
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      `${props.postForwardFlag ? "forward_" : ""} download_update_container ${
        props.fileInfo.fileId
      }`
    );
    if (parentTarget) {
      const channelMembers = props.members;
      const fileInfoValues =
        fileDLStats !== null &&
        fileDLStats.filter((stat) => stat.type === FileStatsType.DOWNLOADED)[0]
          .users;
      const fileInfoUserList =
        fileInfoValues !== null && fileInfoValues.length > 0
          ? fileInfoValues
          : [];
      const memberList = [];
      for (let index = 0; index < fileInfoUserList.length; index++) {
        let matchedUser = channelMembers.find(
          (el) => el.id === fileInfoUserList[index].userId
        );
        if (matchedUser !== undefined) {
          let newMemberUpdated = {
            ...matchedUser,
            location: fileInfoUserList[index].location,
            timestamp: `${t("postTime-12", {
              time: fileInfoUserList[index].timestamp,
            })}`,
          };
          memberList.push(newMemberUpdated);
        } else {
          memberList.push(fileInfoUserList[index]);
        }
      }

      if (memberList.length > 0) {
        renderUtil.renderMemberList(
          parentTarget,
          memberList,
          props.channel,
          props.currentUser.id,
          "LOCATION"
        );
      }
    }
  };

  const getThumbnailFromID = (fileId, channelId, postId) => {
    axios
      .create({
        baseURL: server.apiUrl,
        headers: AuthHeader(),
      })
      .get(
        `/ent/v1/filecontent/${fileId}?q=thumbnail&channelId=${channelId}&postId=${postId}`
      )
      .then((response) => {
        setThumbnailPreview(`data:image/jpeg;base64,${response.data.data}`);
      })
      .catch((error) => {
        setThumbnailPreview(NoPreview);
      });
  };

  const hideDownloadUserList = (event) => {
    event.preventDefault();
    var parentTarget;
    parentTarget = document.getElementById(
      `${props.postForwardFlag ? "forward_" : ""} download_update_container ${
        props.fileInfo.fileId
      }`
    );
    setTimeout(() => {
      renderUtil.removeMemberList(parentTarget, [], 0, "");
    }, 200);
  };

  const documentViewer = (fileId, mimeType, channelId, postId) => {
    FileAttachmentService.viewFile(
      fileId,
      mimeType,
      channelId,
      postId,
      dispatch
    );
    setLgShow(true);
  };
  const getFileName = (fileName, actualName, id) => {
    let myFileName;
    if (fileName.length > 0) {
      let selected = fileName.find((el) => el.id === id);
      if (selected !== undefined && selected.names.oldName === actualName) {
        myFileName = selected.names.newName;
      } else {
        myFileName = actualName;
      }
    } else {
      myFileName = actualName;
    }
    return myFileName;
  };
  const handleFileExtIcon = (fileExt) => {
    fileExt = fileExt.split(".").pop();
    switch (fileExt) {
      case "fig":
        return FigmaIcon;
      case "sketch":
        return SketchIcon;
      case "ppt" ||
        "pptx" ||
        "pptm" ||
        "potx" ||
        "pps" ||
        "potm" ||
        "pot" ||
        "ppsx" ||
        "ppsm":
        return PowerPoint;
      case "key" || "kth":
        return FileKeyIcon;
      case "aep" || "aepx" || "aet":
        return AfterEffect;
      case "xd":
        return XdFile;
      case "ai":
        return AIFile;
      case "psd" || "pdd" || "psdt" || "psb":
        return PhotoshopFile;
      case "prproj" || "prel" || "prmr" || "prmp" || "pproj":
        return PremiereFile;
      case "mp3" || "aac" || "wav" || "wma" || "flac" || "ogg":
        return MusicFile;
      case "mp4" || "avi" || "mkv" || "wmv" || "mov" || "ts" || "tp" || "flv":
        return VideoFile;
      case "jpg" || "jpeg" || "bmp" || "gif" || "png" || "svg":
        return FileImage;
      case "txt" || "hwp" || "hwpx":
        return TxtFile;
      case "zip":
        return ZipFile;
      case "docx" || "doc" || "dot" || "docm" || "dotm":
        return FileWord;
      case "xlsx":
        return FileExcel;
      case "pdf":
        return FilePDF;
      default:
        return FileETC;
    }
  };

  const file = props.fileInfo.mimeType.split("/");
  const fileType =
    file[0].toLowerCase() === "image"
      ? file[0].toLowerCase()
      : file[1].toLowerCase() === "pdf"
      ? file[1].toLowerCase()
      : file[1].split(".").pop().toLowerCase();
  const fileExts =
    fileType === "image"
      ? fileImage
      : fileType === "pdf"
      ? filePDF
      : fileType === "document"
      ? fileDocx
      : fileType === "sheet"
      ? fileExcel
      : FileExtIconImage;
  // const fileExts = props.fileInfo.mimeType?.split("/")[0] !== "image" && ()
  // FileExtIconImage
  let fileName = props.fileInfo.fileName.split('.');
  const lengthToSubstring = fileName[0].length - 4
   fileName = fileName[0].length > 20? `${fileName[0].substring(0, 15)}...${fileName[0].substring(lengthToSubstring)}.${fileName[1]}`: props.fileInfo.fileName
  // console.log('fileName',fileName)
  return props.fileInfo.status === UploadStatus.DELETED ? (
    <Fragment key={`deleted-file-fragment-${props.fileInfo.fileId}`}>
      <DeleteBox className="delete-box">
        <DeleteMsgDiv className="delete-message">
          <p>
            <span
              className="break"
              data-text={`${props.fileInfo.fileName}`}
              dangerouslySetInnerHTML={{
                __html: `${props.fileInfo.fileName}`,
              }}
            ></span>
            <span className="static">
              &nbsp;{t("attachment:deleted.static")}&nbsp;
            </span>
            <span
              className="static d-block delete-time"
              // style={{ marginTop: "6px" }}
            >
              {t(`attachment:delete.time`, { date: new Date() })}
            </span>
          </p>
        </DeleteMsgDiv>
      </DeleteBox>
      {props.currentUser.userType !== "GUEST" &&
        fileDLStats &&
        fileDLStats !== null && (
          <DownloadInfo className="info-file d-flex align-items-center">
            <div className="file-size">
              {props.fileInfo.mimeType?.split("/")[0] === "image" ? (
                <ImageSize className="image-size">
                  {`${props.fileInfo.fileSize.match(/\d+/g).join(".")} ${props.fileInfo.fileSize.match(/[a-zA-Z]+/g)}`}
                </ImageSize>
              ) : (
                <Size className="size">{`${props.fileInfo.fileSize.match(/\d+/g).join(".")} ${props.fileInfo.fileSize.match(/[a-zA-Z]+/g)}`}</Size>
              )}
            </div>

            <InfoCount className="info-count">
              {viewerData.length > 0 &&
                viewerData.map((el, index) => (
                  <div
                    className="position-relative"
                    key={`viewerData-${index}`}
                  >
                    <div
                      className="ReplyView__tooltip"
                      id={`${
                        props.postForwardFlag ? "forward_" : ""
                      } viewer_update_container ${props.fileInfo.fileId}`}
                    ></div>
                    <div
                      className="d-flex align-items-center"
                      onMouseEnter={showViewerUserList}
                      onMouseLeave={hideViewerUserList}
                      style={{
                        marginRight: 0,
                        cursor: "pointer",
                      }}
                    >
                      {/* <img
                      src={hasViewedCurrentUser ? viewCount : viewCountGrey}
                      className="mr-1"
                      alt=""
                    /> */}
                      <SVG
                        className={`${
                          hasViewedCurrentUser ? "active-view" : ""
                        }`}
                        src={viewCountGrey}
                      />
                    </div>
                  </div>
                ))}
              {downloadData.length > 0 &&
                downloadData.map((el, index) => (
                  <div
                    className="position-relative"
                    key={`downloadData-${index}`}
                  >
                    <div
                      className="ReplyView__tooltip"
                      id={`${
                        props.postForwardFlag ? "forward_" : ""
                      } download_update_container ${props.fileInfo.fileId}`}
                    ></div>
                    <div
                      className="d-flex align-items-center"
                      onMouseEnter={showDownloadUserList}
                      onMouseLeave={hideDownloadUserList}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={
                          hasDownloadCurrentUser
                            ? downloadCount
                            : downloadCountGrey
                        }
                        alt=""
                        className="mr-1"
                      />
                      <SVG
                        className={`${
                          hasDownloadCurrentUser ? "active-view" : ""
                        }`}
                        src={downloadCountGrey}
                      />
                      <span
                        style={
                          hasDownloadCurrentUser
                            ? { color: "rgba(0, 0, 0, 0.5)" }
                            : { color: "rgba(0, 0, 0, 0.5)" }
                        }
                      >
                        {el.total}
                      </span>
                    </div>
                  </div>
                ))}
            </InfoCount>
          </DownloadInfo>
        )}
    </Fragment>
  ) : (
    <Fragment key={`attached-file-fragment-${props.fileInfo.fileId}`}>
      <Fragment key={`attached-file-sub-fragment-${props.fileInfo.fileId}`}>
        <BoxDiv
          className="box-div"
          style={
            props.fileInfo.mimeType?.split("/")[0] === "image"
              ? {
                  background: `url(${thumbnailPreview}) no-repeat center center / 100%`,
                  height: "50px",
                }
              : {}
          }
        >
          <OverlayTrigger
            className="overlay-trigger"
            placement="top"
            delay={{ show: 10, hide: 10 }}
            trigger={["hover", "focus"]}
            show={showOverlay}
            overlay={
              <Tooltip id={props.fileInfo.fileId}>
                {props.fileInfo.fileName}
              </Tooltip>
            }
          >
            <BoxDivInner
              className="box-div-inner"
              onMouseEnter={() => {
                setShowOverlay(true);
              }}
              onMouseOut={() => {
                setShowOverlay(false);
              }}
              onMouseLeave={() => {
                setShowOverlay(false);
              }}
            >
              
              {/* {props.fileInfo.mimeType?.split("/")[0] !== "image" && (
                <FileExtIcon className="file-extention-icon" src={FileExtIconImage} alt="" />
              )} */}
              {props.fileInfo.mimeType?.split("/")[0] !== "image" && (
                <FileExtIcon
                  src={handleFileExtIcon(props.fileInfo.fileName)}
                  alt=""
                />
              )}
              <Details
                className="detail"
                style={
                  props.fileInfo.mimeType?.split("/")[0] === "image"
                    ? { width: "100%" }
                    : {}
                }
              >
                <FileInfoHover className="file-hover">
                  {props.fileInfo.mimeType?.split("/")[0] === "image" ? (
                    <ImageName
                      className="image-name"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "1px 1px 4px rgba(0, 0, 0)",
                      }}
                    >
                      {props.fileInfo.fileName}
                    </ImageName>
                  ) : (
                    <Name
                      className="name"
                      dangerouslySetInnerHTML={{
                        __html: fileName,
                      }}
                    ></Name>
                  )}

                  {/* {props.fileInfo.mimeType?.split("/")[0] === "image" ? (
                    <ImageSize
                     className="image-size"
                      style={{
                        color: "#FFFFFF",
                        textShadow: "1px 1px 4px rgba(0, 0, 0)",
                      }}
                    >
                      {props.fileInfo.fileSize}
                    </ImageSize>
                  ) : (
                    <Size className="size">{props.fileInfo.fileSize}</Size>
                  )} */}
                </FileInfoHover>
                <FileActionHover className="file-action-hover">
                  <MenuDownload className="menu-download">
                    <Download className="download-file">
                      {downloadEnabled() && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            FileAttachmentService.download(
                              props.fileInfo.fileId,
                              props.fileInfo.mimeType,
                              props.fileInfo.fileName,
                              currentChannelId,
                              props.post?.id,
                              (event) => {
                                setProgressValue(
                                  Math.round((100 * event.loaded) / event.total)
                                );
                                if (event.loaded === event.total)
                                  setProgressValue(0);
                              }
                            );
                          }}
                        >
                          <SVG src={downloadHover} />
                          Download
                        </span>
                      )}
                    </Download>
                  </MenuDownload>
                  <MenuDownload className="menu-download">
                    <Download className="e-signature">
                      <span>
                        <SVG
                          onClick={(e) => {
                            e.stopPropagation();
                            documentViewer(
                              props.fileInfo.fileId,
                              props.fileInfo.mimeType,
                              currentChannelId,
                              props.post?.id
                            );
                          }}
                          src={viewHover}
                        />
                        View
                      </span>
                    </Download>
                  </MenuDownload>
                  <MenuDownload className="menu-download">
                    <Download className="e-signature">
                      {downloadEnabled() && (
                        <span>
                          <SVG src={esignatureHover} />
                        </span>
                      )}
                    </Download>
                  </MenuDownload>
                  {(props.fileInfo.userId === userId ||
                    props.postOwnerId === userId) && (
                    <Menu className="menu">
                      <Options id={`nav-dropdown-${props.fileInfo.fileId}`}>
                        <OptionsDropdown
                          id={`nav-dropdown`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          title={<SVG src={moreHover} />}
                          // drop="auto"
                          alignRight
                          onMouseEnter={(e) => {
                            setShowOverlay(false);
                          }}
                          onMouseLeave={() => {
                            setShowOverlay(true);
                          }}
                        >
                          <NavDropdown.Item disabled className="disabled">
                            <img
                              className="img-icon"
                              src={rename}
                              alt="rename"
                            />
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
                            onMouseOver={() =>
                              setDeleteIcon(delete_icon_active)
                            }
                            onMouseOut={() => setDeleteIcon(delete_icon)}
                            onClick={() => setShowRemoveModal(true)}
                          >
                            <img
                              className="img-icon"
                              src={deleteIcon}
                              alt="delete"
                            />
                            <span className="item-name">
                              {t("attachment:delete.label")}
                            </span>
                          </NavDropdown.Item>
                        </OptionsDropdown>
                      </Options>
                    </Menu>
                  )}
                </FileActionHover>
              </Details>
            </BoxDivInner>
          </OverlayTrigger>
        </BoxDiv>
        {props.currentUser.userType !== "GUEST" &&
          fileDLStats &&
          fileDLStats !== null && (
            <DownloadInfo className={`download-info ${progressValue > 0 && progressValue < 100? 'download-progress': ''}`}>
              <div className="progress-download">
                <Row
                className={
                  progressValue > 0 && progressValue < 100
                    ? "p-0 m-0"
                    : "p-0 m-0 d-none"
                }
              >
                <Progress
                  className="progress"
                  height="1px"
                  progress={progressValue}
                />
              </Row>
              </div>
              <div className="file-info d-flex align-items-center">
                <div className="file-size">
                  {props.fileInfo.mimeType?.split("/")[0] === "image" ? (
                    <ImageSize className="image-size">
                      {props.fileInfo.fileSize}
                    </ImageSize>
                  ) : (
                    <Size className="size">{props.fileInfo.fileSize}</Size>
                  )}
                </div>

                <InfoCount className="info-count">
                  {viewerData.length > 0 &&
                    viewerData.map((el, index) => (
                      <div
                        className="position-relative view-data"
                        key={`viewerData-${index}`}
                      >
                        <div
                          className="ReplyView__tooltip"
                          id={`${
                            props.postForwardFlag ? "forward_" : ""
                          } viewer_update_container ${props.fileInfo.fileId}`}
                        ></div>
                        <div
                          className="d-flex align-items-center"
                          onMouseEnter={showViewerUserList}
                          onMouseLeave={hideViewerUserList}
                          style={{
                            marginRight: 0,
                            cursor: "pointer",
                          }}
                        >
                          {/* <img
                          src={hasViewedCurrentUser ? viewCount : viewCountGrey}
                          style={{ marginRight: "6px" }}
                          alt=""
                        /> */}
                          <SVG
                            style={{ marginRight: "2px" }}
                            className={hasViewedCurrentUser ? "active-view" : ""}
                            src={viewCountGrey}
                          />
                          <span
                            style={
                              hasViewedCurrentUser
                                ? { color: "rgba(0, 0, 0, 0.5)" }
                                : { color: "rgba(0, 0, 0, 0.5)" }
                            }
                          >
                            {/* {t("attachment:viewed.count", {
                            viewCount: el.total,
                          })} */}
                            {el.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  {downloadData.length > 0 &&
                    downloadData.map((el, index) => (
                      <div
                        className="position-relative view-data-2"
                        key={`downloadData-${index}`}
                      >
                        <div
                          className="ReplyView__tooltip"
                          id={`${
                            props.postForwardFlag ? "forward_" : ""
                          } download_update_container ${props.fileInfo.fileId}`}
                        ></div>
                        <div
                          className="d-flex align-items-center"
                          onMouseEnter={showDownloadUserList}
                          onMouseLeave={hideDownloadUserList}
                          style={{ cursor: "pointer" }}
                        >
                          {props.fileInfo.extPerm !== "RO" && (
                            // <img
                            //   src={
                            //     hasDownloadCurrentUser
                            //       ? downloadCount
                            //       : downloadCountGrey
                            //   }
                            //   alt=""
                            //   style={{ marginRight: "6px" }}
                            // />
                            <SVG
                              style={{ marginRight: "2px" }}
                              className={
                                hasDownloadCurrentUser ? "active-view" : ""
                              }
                              src={downloadCountGrey}
                            />
                          )}
                          <span
                            style={
                              hasDownloadCurrentUser
                                ? { color: "rgba(0, 0, 0, 0.5)" }
                                : { color: "rgba(0, 0, 0, 0.5)" }
                            }
                          >
                            {/* {t("attachment:downloaded.count", {
                            downloadedCount: el.total,
                          })} */}
                            {el.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </InfoCount>
              </div>
              
            </DownloadInfo>
          )}
      </Fragment>

      <DocumentViewerModal
        lgShow={lgShow}
        setLgShow={() => setLgShow(false)}
        fileInfo={props.fileInfo}
        fileId={props.fileInfo.fileId}
        progressValue={progressValue}
        setProgress={setProgressValue}
        Progress={Progress}
        setShowRemoveModal={setShowRemoveModal}
        currentChannelId={currentChannelId}
        postId={props.post?.id}
      />
      <ConfirmDeleteModal
        showModal={showRemoveModal}
        handleCancel={() => setShowRemoveModal(false)}
        handleSubmit={async () => {
          await FileAttachmentService.removeFile([
            {
              fileId: props.fileInfo.fileId,
              postId: props.fileInfo.postId,
              channelId: props.fileInfo.channelId,
            },
          ]);
          dispatch(fetchFileList(queryParams, false));
          dispatch(fileStorageDetails());
          setShowRemoveModal(false);
        }}
        fileName={props.fileInfo.fileName}
      />
    </Fragment>
  );
}

export default AttachmentPostItem;
