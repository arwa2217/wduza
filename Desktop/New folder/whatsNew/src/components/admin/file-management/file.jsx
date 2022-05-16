import React, { Fragment, useEffect, useState } from "react";
import {
  BoxDivInner,
  ThumbnailPreview,
  BoxDivLarge,
  BoxDivWrapper,
  Details,
  FileExtIcon,
  FileInfo,
  Name,
  Size,
  FileActionHover,
  MenuDownload,
  Download,
  Menu,
  Options,
  OptionsDropdown,
  NoPreview,
} from "../../post-view/post-msg-view/styles/attachment-post-style";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import download from "@toolbar/download.svg";
import { NavDropdown } from "react-bootstrap";
import rename from "@toolbar/rename.svg";
import options from "@toolbar/options.svg";
import permissions from "@toolbar/permissions.svg";
import delete_icon from "@toolbar/delete_icon.svg";
import delete_icon_active from "@toolbar/delete_icon_active.svg";
import DocumentViewerModal from "../../post-view/post-msg-view/document-viewer-modal";
import Progress from "../../utils/progress-bar";
import FileAttachmentService from "../../../services/file-attachment-service";
// import FileDeleteModal from "./file-delete-modal";
import { updateDeleteStatus } from "../../../store/actions/main-files-actions";
import { showToast } from "../../../store/actions/toast-modal-actions";
import { AuthHeader } from "../../../utilities/app-preference";
import axios from "axios";
import server from "server";
import { updateFilePanelState } from "../../../store/actions/config-actions";
import FileDeleteModal from "../../files/file-delete-modal";

const File = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let fetchingFilesDetails = useSelector(
    (state) => state.fileReducer.fetchingFilesDetails
  );
  const activeSelectedFile = useSelector(
    (state) => state.config.activeSelectedFile
  );
  let deleteFileSuccess = useSelector(
    (state) => state.mainFilesReducer.deleteFileSuccess
  );
  let deletedFiles = useSelector(
    (state) => state.mainFilesReducer.deletedFiles
  );
  const currentUser = useSelector((state) => state.AuthReducer.user.id);
  const currentNetworkType = useSelector(
    (state) => state.AuthReducer.networkType
  );

  const [deleteIcon, setDeleteIcon] = useState(delete_icon);
  const [thumbnailPreview, setThumbnailPreview] = useState("NoPreview");
  const [lgShow, setLgShow] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [localFolderId, setLocalFolderId] = useState("");
  const [localPostId, setLocalPostId] = useState("");
  const [localChannelId, setLocalChannelId] = useState("");

  const {
    channelFilesList,
    isSidePanel = true,
    queryUserType,
    internalPermission,
    internalPermissionOoo,
    externalPermission,
  } = props;

  let isDownloadable = false;

  // Setting Download Permission
  if (queryUserType === "INTERNAL") {
    if (currentNetworkType === "INTERNAL" && internalPermission === "DL") {
      isDownloadable = true;
    } else if (
      currentNetworkType === "EXTERNAL" &&
      internalPermissionOoo === "DL"
    ) {
      isDownloadable = true;
    }
  } else if (queryUserType === "EXTERNAL") {
    if (externalPermission === "DL") {
      isDownloadable = true;
    }
  }

  useEffect(() => {
    if (channelFilesList?.length) {
      channelFilesList.map((file) => getThumbnailFromID(file));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getThumbnailFromID = ({ fileId, channelId, postId, folderId }) => {
    axios
      .create({
        baseURL: server.apiUrl,
        headers: AuthHeader(),
      })
      .get(
        !folderId
          ? `/ent/v2/filecontent/${fileId}?q=thumbnail&channelId=${channelId}&postId=${postId}`
          : `/ent/v2/filecontent/${fileId}?q=thumbnail&folderId=${folderId}`
      )
      .then((response) => {
        setThumbnailPreview(`data:image/jpeg;base64,${response.data.data}`);
      })
      .catch((error) => {
        setThumbnailPreview("NoPreview");
      });
  };

  const documentViewer = (fileId, mimeType, channelId, postId, folderId) => {
    !folderId
      ? FileAttachmentService.viewFile(
          fileId,
          mimeType,
          channelId,
          postId,
          dispatch,
          true
        )
      : FileAttachmentService.viewFileFromFolder(
          fileId,
          mimeType,
          folderId,
          dispatch
        );
    setLgShow(true);
  };

  const handleDeleteFiles = () => {
    FileAttachmentService.removeFilesById(channelFilesList, dispatch, true);
    setShowRemoveModal(false);
  };

  useEffect(() => {
    if (deleteFileSuccess === false)
      dispatch(showToast(t("files:delete.fail")), 3000);
    else if (deleteFileSuccess) {
      dispatch(showToast(t("files:delete.success"), 3000, "success"));
      if (
        deletedFiles.length &&
        deletedFiles.some((file) => file === activeSelectedFile.fileId)
      ) {
        dispatch(updateFilePanelState(false));
      }
      // if (channelFilesList?.length) {
      //   // let itemFileId = `${channelFilesList[0].fileId}-${
      //   //   channelFilesList[0]?.folderId ?? ""
      //   // }-${channelFilesList[0]?.channelId ?? ""}-${
      //   //   channelFilesList[0]?.postId ?? ""
      //   // }`;
      //   // dispatch(
      //   //   updateFilePanelState(
      //   //     activeSelectedFileId === itemFileId ? false : true
      //   //   )
      //   // );
      // }
    }
    dispatch(updateDeleteStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteFileSuccess, deletedFiles]);

  return (
    <Fragment>
      <div className="post-message__text ">
        {fetchingFilesDetails === true ? (
          <div className="w-100 text-center no-data">
            <h5 className="w-100 text-center mt-4">{t("file:loading")}</h5>
          </div>
        ) : channelFilesList && channelFilesList.length > 0 ? (
          <>
            {channelFilesList.map((el, index) => {
              if (el.fileId) {
                return (
                  <div
                    style={isSidePanel ? { marginTop: "5px" } : {}}
                    key={el?.fileId}
                    onClick={(e) => {
                      e.stopPropagation();
                      documentViewer(
                        el.fileId,
                        el.mimeType,
                        el.channelId,
                        el?.postId,
                        el?.folderId
                      );
                      setLocalFolderId(el?.folderId);
                      setLocalChannelId(el.channelId);
                      setLocalPostId(el?.postId);
                    }}
                  >
                    <BoxDivWrapper style={{ margin: 0 }}>
                      <BoxDivLarge
                        style={!isSidePanel ? { borderRadius: "4px" } : {}}
                        className="p-0"
                      >
                        {!isSidePanel && (
                          <ThumbnailPreview
                            style={{
                              borderRadius: "4px 4px 0 0",
                              overflow: "hidden",
                              width: "100%",
                              borderBottom: "1px solid #e9e9e9",
                            }}
                          >
                            {thumbnailPreview === "NoPreview" ? (
                              <NoPreview>
                                {t("preview.not.available")}
                              </NoPreview>
                            ) : (
                              <img src={thumbnailPreview} alt="" />
                            )}
                          </ThumbnailPreview>
                        )}
                        <BoxDivInner style={{ padding: "10px" }}>
                          <FileExtIcon src={FileExtIconImage} alt="" />
                          <Details>
                            <FileInfo>
                              <Name
                                className={"summary-file-name"}
                                title={el.fileName}
                              >
                                {el.fileName}
                              </Name>
                              <Size>{el.fileSize}</Size>
                            </FileInfo>
                          </Details>
                          {!props?.hideMenuOption ? (
                            <FileActionHover
                              style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                              }}
                            >
                              <MenuDownload>
                                {isDownloadable && (
                                  <Download>
                                    {true && (
                                      // {downloadEnabled() && (
                                      <img
                                        src={download}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          FileAttachmentService.fileDownloadFromFolder(
                                            el?.fileId,
                                            el?.mimeType,
                                            el?.fileName,
                                            el?.channelId,
                                            el?.postId,
                                            (event) => {
                                              setProgressValue(
                                                Math.round(
                                                  (100 * event.loaded) /
                                                    event.total
                                                )
                                              );
                                              if (event.loaded === event.total)
                                                setProgressValue(0);
                                            },
                                            el?.folderId,
                                            true
                                          );
                                        }}
                                        alt="download"
                                      />
                                    )}
                                  </Download>
                                )}
                              </MenuDownload>
                              {(el.creatorId === currentUser ||
                                el.userId === currentUser) && (
                                // {el.userId === userId && (
                                <Menu>
                                  <Options id={`nav-dropdown-${el?.fileId}`}>
                                    <OptionsDropdown
                                      id={`nav-dropdown`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                      title={
                                        <img src={options} alt="options" />
                                      }
                                      // drop="auto"
                                      alignRight
                                      onMouseEnter={(e) => {
                                        // setShowOverlay(false);
                                      }}
                                      onMouseLeave={() => {
                                        // setShowOverlay(true);
                                      }}
                                    >
                                      <NavDropdown.Item
                                        disabled
                                        className="disabled"
                                      >
                                        <img
                                          className="img-icon"
                                          src={rename}
                                          alt="rename"
                                        />
                                        <span className="item-name">
                                          {t("attachment:rename.label")}
                                        </span>
                                      </NavDropdown.Item>
                                      <NavDropdown.Item
                                        disabled
                                        className="disabled"
                                      >
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
                                        onMouseOut={() =>
                                          setDeleteIcon(delete_icon)
                                        }
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
                          ) : (
                            <></>
                          )}
                        </BoxDivInner>
                      </BoxDivLarge>
                    </BoxDivWrapper>
                  </div>
                  // </div>
                );
                // }
              } else {
                return <span />;
              }
            })}
          </>
        ) : (
          <></>
          // <div className="w-100 text-center no-data">
          //   <h5>{t("file:no.updates")}</h5>
          //   <p>{t("file:file.appear.here")}</p>
          // </div>
        )}
      </div>
      <DocumentViewerModal
        hideOptions
        lgShow={lgShow}
        setLgShow={() => setLgShow(false)}
        fileInfo={
          props?.channelFilesList?.length ? props.channelFilesList[0] : []
        }
        fileId={
          props?.channelFilesList?.length ? props.channelFilesList[0].fileId : []
        }
        progressValue={progressValue}
        setProgress={setProgressValue}
        Progress={Progress}
        setShowRemoveModal={setShowRemoveModal}
        currentChannelId={localChannelId}
        postId={localPostId}
        folderId={localFolderId}
        fromFolder={true}
      />
      <FileDeleteModal
        fileCount={1}
        showModal={showRemoveModal}
        handleSubmit={handleDeleteFiles}
        handleCancel={() => setShowRemoveModal(false)}
      />
    </Fragment>
  );
};

export default File;
