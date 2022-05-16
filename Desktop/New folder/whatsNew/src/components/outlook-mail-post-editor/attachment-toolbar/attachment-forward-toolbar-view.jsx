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
import {  getFileSize } from "../../utils/file-utility";
import FileExtIconImage from "../../../assets/icons/file-ext-icon.svg";

function AttachmentForwardToolbarView(props) {
  const {attachments = [], setAttachmentsForward} = props

  const handleRemove = (id) => {
    setAttachmentsForward(prevState => prevState.filter(item => item.id !== id))
  }
  return (
    <div
      className="attached__file__list"
    >
      {attachments.length > 0 &&
        attachments.map(({ name, id, size, fileSize = '' }, index) => (
          <BoxDivWrapper key={`toolbar-file${id}`}>
            <BoxDiv>
              <BoxDivInner>
                <FileExtIcon src={FileExtIconImage} alt="" />
                <Details key={`Details${id}`}>
                  <FileInfo style={{ maxWidth: "152px" }}>
                    <Name
                      key={`Name${id}`}
                    >
                      {name}
                    </Name>
                    {fileSize ? <Size key={`Size${id}`}>{fileSize}</Size>: <Size key={`Size${id}`}>{getFileSize(size)}</Size>}
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
    </div>
  );
}

export default AttachmentForwardToolbarView;
