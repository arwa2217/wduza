import React, { useState, useEffect } from "react";
import file from "@toolbar/file.svg";
import file_active from "@toolbar/file_active.svg";
import { P, Image, Input } from "./styles/attachment-button-style";

function AttachFileButton(props) {
  const hiddenFileInput = React.useRef(null);
  const [imgSrc, setImgSrc] = useState(props.fileIcon);

  useEffect(() => {
    setImgSrc(props.fileIcon);
  }, [imgSrc, props.fileIcon]);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    props.onChangeAttach(event);
    setImgSrc(file_active);
    event.target.value = "";
  };
  return (
    <>
      <P
        className="block m-0 p-0"
        // className={
        //   props.showAttachFile ? "block m-0 p-0 disabled" : "block m-0 p-0"
        // }
        // disabled={props.showAttachFile}
        onClick={handleClick}
      >
        <Image
          src={imgSrc}
          onMouseOver={(e) => (e.currentTarget.src = file_active)}
          onMouseOut={(e) => (e.currentTarget.src = imgSrc)}
          disable={props.showAttachFile}
        />
      </P>
      <Input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        multiple
        style={{ display: "none" }}
        disabled={props.showAttachFile}
      />
    </>
  );
}
export default AttachFileButton;
