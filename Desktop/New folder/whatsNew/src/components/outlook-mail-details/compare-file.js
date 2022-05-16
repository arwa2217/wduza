import { saveAs } from "file-saver";
import ZsZip from "jszip";
const compareFile = (files, name = "") => {
  const zip = new ZsZip();
  const zipName = name === "" ? "all-attachments.zip" : `${name}-files.zip`;
  for (let file of files) {
    zip.file(file.name, file.contentBytes, { base64: true });
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, zipName);
  });
};

export default compareFile;
