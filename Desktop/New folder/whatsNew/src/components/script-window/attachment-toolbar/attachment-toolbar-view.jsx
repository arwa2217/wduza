import React, { useState, useEffect } from "react";
import remove_x from "../../../assets/icons/v2/ic_cancel_black.svg";
import {
  BoxDivWrapper,
  FileExtIcon,
  BoxDiv,
  BoxDivInner,
  FileAction,
  FileInfo,
  Details,
  Name,
  Size,
  Remove,
  FileInfoAttachToolBar,
  DetailsAttachToolBar,
  BoxDivInnerAttachToolbar,
  SizeAttachToolBar,
  BoxDivToolBar,
  BoxDivWrapperToolBar,
} from "../../../components/post-view/post-msg-view/styles/attachment-post-style";
import { getFileSize } from "../../utils/file-utility";
import CommonUtils from "../../utils/common-utils";
import FileImage from "../../../assets/icons/v2/ic_file_image.svg";
import FilePDF from "../../../assets/icons/v2/ic_file_file_pdf.svg";
import FileWord from "../../../assets/icons/v2/ic_file_word.svg";
import FileExcel from "../../../assets/icons/v2/ic_file_excel.svg";
import FileETC from "../../../assets/icons/attach-file/ic_file_etc.svg";
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
import TxtFile from "../../../assets/icons/v2/ic_file_txt.svg";
import ZipFile from "../../../assets/icons/v2/ic_file_zip.svg";
let myFilesArr = [];
function AttachmentToolbarView(props) {
  const [myFiles, setMyFiles] = useState([]);
  useEffect(() => {
    if (props.totalFiles.length === 0 && myFilesArr.length > 0) {
      myFilesArr = [];
    }
    if (!CommonUtils.arraysEqual(props.files, myFilesArr)) {
      myFilesArr = props.updateFileList(myFilesArr);
    }

    if (!CommonUtils.arraysEqual(myFilesArr, myFiles)) {
      setMyFiles([...myFilesArr]);
    }

    //  do not remove

    // props.files.length > 0 && myFiles.length > 0 && props.updateFileList(myFiles)
    // props.files.length > 0
    //   ? props.files.map((el) => {
    //       if (myFilesArr.length > 0) {
    //         let foundData = myFilesArr.findIndex((elem) => elem.id === el.id);
    //         if (foundData !== -1) {
    //           let getMyElement = myFilesArr.filter(
    //             (element) => element.id === el.id
    //           );
    //           newArr.push(...getMyElement);
    //         } else {
    //           myFilesArr.push(el);
    //         }
    //       } else {
    //         myFilesArr.push(el);
    //       }
    //     })
    //   : (myFilesArr = []);
    // if (newArr.length > 0) {
    //   myFilesArr = newArr;
    //   newArr = [];
    // }
    // setMyFiles(myFilesArr);
  }, [props.files, props.totalFiles]);

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

  const showFileName = (fileName) => {
    if (fileName.split(".").shift().length > 12) {
      let firstName = fileName.split(".").shift();
      let fileExt = fileName.split(".").pop();
      return `${fileName.substr(0, 10)}...${firstName.substr(
        firstName.length - 2,
        firstName.length
      )}.${fileExt}`;
    }
    return fileName;
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

  return (
    <div className="attached__file__list">
      {myFiles.length > 0 &&
        myFiles.map(({ file, src, id }, index) => (
          <BoxDivWrapperToolBar key={`toolbar-file${id}`}>
            <BoxDivToolBar>
              <BoxDivInnerAttachToolbar>
                <DetailsAttachToolBar key={`DetailsAttachToolBar${id}`}>
                  <FileInfoAttachToolBar>
                    <FileExtIcon
                      src={handleFileExtIcon(
                        getFileName(props.fileName, file.name, id)
                      )}
                      alt=""
                    />
                    <Name
                      key={`Name${id}`}
                      title={getFileName(props.fileName, file.name, id)}
                    >
                      {showFileName(getFileName(props.fileName, file.name, id))}
                    </Name>
                  </FileInfoAttachToolBar>
                  <FileAction>
                    <Remove key={`Remove${id}`}>
                      <img
                        key={`img${id}`}
                        src={remove_x}
                        onClick={() => props.removeFile(id)}
                        alt="remove-file"
                      />
                    </Remove>
                  </FileAction>
                </DetailsAttachToolBar>
                <SizeAttachToolBar key={`Size${id}`}>
                  {getFileSize(file.size)}
                </SizeAttachToolBar>
              </BoxDivInnerAttachToolbar>
            </BoxDivToolBar>
          </BoxDivWrapperToolBar>
        ))}
    </div>
  );
}

export default AttachmentToolbarView;
