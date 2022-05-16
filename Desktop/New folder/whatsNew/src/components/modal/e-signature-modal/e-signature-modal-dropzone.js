import React from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props) {
  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    accept: props.accept,
  });

  acceptedFiles.map((file) => props.onFileUpload(file));

  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p className="dropzone-body-text">
          Drop your files here or
        </p>
        <button type="button" className="upload-btn" onClick={open}>
          Upload
        </button>
      </div>
    </div>
  );
}

export default Dropzone;
