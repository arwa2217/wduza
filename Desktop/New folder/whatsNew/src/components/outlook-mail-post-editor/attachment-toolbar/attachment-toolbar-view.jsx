import React, { useState, useEffect } from "react";
import remove_x from "../../../assets/icons/remove_x.svg";
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
} from "../../../components/post-view/post-msg-view/styles/attachment-post-style";

import { getFileSize } from "../../utils/file-utility";
import CommonUtils from "../../utils/common-utils";
import { useSelector } from "react-redux";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";
import { Alert } from "@material-ui/lab";

let myFilesArr = [];
function AttachmentToolbarView(props) {
  const [myFiles, setMyFiles] = useState([]);
  const { attachments = [], setAttachmentsForward, error } = props;
  const loadingDraftAttachments = useSelector(
    (state) => state.OutlookMailReducer.loadingDraftAttachments
  );
  const handleRemove = (id) => {
    setAttachmentsForward((prevState) =>
      prevState.filter((item) => item.id !== id)
    );
  };
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

  return (
    <div
      className="attached__file__list"
      style={{ position: "absolute", bottom: "40px", paddingLeft: 0 }}
    >
      <>
        {loadingDraftAttachments ? (
          <p>Loading File...</p>
        ) : (
          myFiles.length > 0 &&
          myFiles.map(
            ({ file, src, id, outlookId, isInline }, index) =>
              !isInline && (
                <BoxDivWrapper key={`toolbar-file${index}`}>
                  <BoxDiv>
                    <BoxDivInner>
                      <FileExtIcon src={FileExtIconImage} alt="" />
                      <Details key={`Details${id}`}>
                        <FileInfo style={{ maxWidth: "152px" }}>
                          <Name
                            key={`Name${id}`}
                            title={getFileName(props.fileName, file.name, id)}
                          >
                            {getFileName(props.fileName, file.name, id)}
                          </Name>
                          <Size key={`Size${id}`}>
                            {getFileSize(file.size)}
                          </Size>
                        </FileInfo>
                        <FileAction>
                          <Remove key={`Remove${id}`}>
                            <img
                              key={`img${id}`}
                              src={remove_x}
                              onClick={() => props.removeFile(id, outlookId)}
                              alt="remove-file"
                            />
                          </Remove>
                        </FileAction>
                      </Details>
                    </BoxDivInner>
                  </BoxDiv>
                </BoxDivWrapper>
              )
          )
        )}
        {error && (
          <Alert variant="outlined" severity="error" className="mb-4">
            {error}
          </Alert>
        )}
        {attachments.length > 0 &&
          attachments.map(({ name, id, size }, index) => (
            <BoxDivWrapper key={`toolbar-file${index}`}>
              <BoxDiv>
                <BoxDivInner>
                  <FileExtIcon src={FileExtIconImage} alt="" />
                  <Details key={`Details${id}`}>
                    <FileInfo style={{ maxWidth: "152px" }}>
                      <Name key={`Name${id}`}>{name}</Name>
                      <Size key={`Size${id}`}>{getFileSize(size)}</Size>
                    </FileInfo>
                    <FileAction>
                      <Remove key={`Remove${id}`}>
                        <img
                          key={`img${id}`}
                          src={remove_x}
                          onClick={() => handleRemove(id)}
                          alt="remove-file"
                        />
                      </Remove>
                    </FileAction>
                  </Details>
                </BoxDivInner>
              </BoxDiv>
            </BoxDivWrapper>
          ))}
      </>
    </div>
  );
}

export default AttachmentToolbarView;
