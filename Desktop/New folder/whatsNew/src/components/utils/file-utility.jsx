import pdf from "@fileIcon/pdf.svg";
import doc from "@fileIcon/doc.svg";
import html from "@fileIcon/html.svg";
import jpg from "@fileIcon/jpg.svg";
import png from "@fileIcon/png.svg";
import ppt from "@fileIcon/ppt.svg";
import psd from "@fileIcon/psd.svg";
import svg from "@fileIcon/svg.svg";
import tiff from "@fileIcon/tiff.svg";
import txt from "@fileIcon/txt.svg";
import xls from "@fileIcon/xls.svg";
import common from "@fileIcon/common.svg";

export function fileIcon(fileType) {
  let icon = null;
  if (fileType === "application/pdf") {
    icon = pdf;
  } else if (
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    icon = doc;
  } else if (fileType === "text/html") {
    icon = html;
  } else if (fileType === "image/jpeg") {
    icon = jpg;
  } else if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    icon = ppt;
  } else if (
    fileType === "image/vnd.adobe.photoshop" ||
    fileType === "application/x-photoshop" ||
    fileType === "application/photoshop" ||
    fileType === "application/psd" ||
    fileType === "image/psd"
  ) {
    icon = psd;
  } else if (fileType === "image/svg+xml") {
    icon = svg;
  } else if (fileType?.match("image/tiff")) {
    icon = tiff;
  } else if (fileType?.match("text/plain")) {
    icon = txt;
  } else if (
    fileType === "application/vnd.ms-excel" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    icon = xls;
  } else if (fileType?.match("image/*")) {
    icon = png;
  } else {
    icon = common;
  }

  return icon;
}

export function fileExtension(fileType) {
  let icon = null;
  if (fileType === "application/pdf" || fileType === "pdf") {
    icon = "pdf";
  } else if (
    fileType === "application/msword" ||
    fileType === "application/vnd.oasis.opendocument.text" ||
    fileType === "application/vnd.oasis.opendocument.spreadsheet" ||
    fileType === "application/vnd.oasis.opendocument.presentation" ||
    fileType === "application/vnd.oasis.opendocument.text-template"
  ) {
    icon = "doc";
  } else if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    icon = "docx";
  } else if (fileType === "text/html") {
    icon = "html";
  } else if (fileType === "image/jpeg") {
    icon = "jpeg";
  } else if (fileType === "image/jpg") {
    icon = "jpg";
  } else if (
    fileType === "application/vnd.ms-powerpoint" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    icon = "ppt";
  } else if (
    fileType === "image/vnd.adobe.photoshop" ||
    fileType === "application/x-photoshop" ||
    fileType === "application/photoshop" ||
    fileType === "application/psd" ||
    fileType === "image/psd"
  ) {
    icon = "psd";
  } else if (fileType === "image/svg+xml") {
    icon = "svg";
  } else if (fileType?.match("image/tiff")) {
    icon = "tiff";
  } else if (fileType?.match("text/plain")) {
    icon = "txt";
  } else if (
    fileType === "application/vnd.ms-excel" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    icon = "xls";
  } else if (
    fileType === "application/octet-stream" ||
    fileType?.match("image/*")
  ) {
    icon = "png";
  } else if (fileType === "video/x-flv") {
    icon = "flv";
  } else if (
    fileType === "video/mp4" ||
    fileType === "video/mp2t" ||
    fileType === "video/x-m4v" ||
    fileType === "video/x-matroska" ||
    fileType === "application/mxf" ||
    fileType === "application/vnd.adobe.flash.movie" ||
    fileType === "text/vnd.trolltech.linguist" ||
    fileType === "video/mpeg" ||
    fileType === "video/mpeg" ||
    fileType === "video/ogg" ||
    fileType === "application/vnd.rn-realmedia" ||
    fileType === "video/webm"
  ) {
    icon = "mp4";
  } else if (fileType === "video/MP2T") {
    icon = "ts";
  } else if (fileType === "video/3gpp") {
    icon = "3gpp";
  } else if (fileType === "video/quicktime") {
    icon = "mov";
  } else if (fileType === "video/x-msvideo") {
    icon = "mov";
  } else if (fileType === "video/x-ms-wmv") {
    icon = "wmv";
  } else if (fileType === "audio/mpeg") {
    icon = "mp3";
  } else if (fileType === "audio/mp4") {
    icon = "mp4";
  } else if (fileType === "audio/mid") {
    icon = "mid";
  } else if (fileType === "audio/x-aiff") {
    icon = "aif";
  } else if (fileType === "audio/vnd.wav") {
    icon = "wav";
  } else {
    icon = "unknown";
  }

  return icon;
}

export function knownFileType(fileType) {
  let isKnown = false;

  const findPattern = (term) => {
    if (fileType?.match(term)) {
      return fileType;
    }
  };

  switch (fileType) {
    case "application/pdf":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "text/html":
    case "image/jpeg":
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "image/vnd.adobe.photoshop":
    case "application/x-photoshop":
    case "application/photoshop":
    case "application/psd":
    case "image/psd":
    case "image/svg+xml":
    case findPattern("image/tiff"):
    case findPattern("text/plain"):
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "video/x-flv":
    case "video/mp4":
    case "video/MP2T":
    case "video/3gpp":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/x-ms-wmv":
    case "audio/basic":
    case "audio/mid":
    case "audio/mpeg":
    case "audio/mp4":
    case "audio/x-aiff":
    case "audio/vnd.wav":
    case findPattern("image/*"):
    case findPattern("audio/*"):
    case findPattern("video/*"):
      isKnown = true;
      break;
    default:
      isKnown = false;
      break;
  }

  return isKnown;
}

export function getFileSize(fileSize, decimalSize) {
  let size = fileSize;
  if (size >= 1024 ** 5) {
    return (size / 1024 ** 5).toFixed(decimalSize ? decimalSize : 2) + " PB";
  } else if (size >= 1024 ** 4) {
    return (size / 1024 ** 4).toFixed(decimalSize ? decimalSize : 2) + " TB";
  } else if (size >= 1024 ** 3) {
    return (size / 1024 ** 3).toFixed(decimalSize ? decimalSize : 2) + " GB";
  } else if (size >= 1024 ** 2) {
    return (size / 1024 ** 2).toFixed(decimalSize ? decimalSize : 2) + " MB";
  } else if (size >= 1024 ** 1) {
    return (size / 1024 ** 1).toFixed(decimalSize ? decimalSize : 2) + " KB";
  } else {
    return (size / 1024 ** 0).toFixed(decimalSize ? decimalSize : 2) + " B";
  }
}

export const getFileSizeBytes = (size) => {
  if (!size) {
    return size;
  }
  let lastString = size.substr(size.length - 2).toUpperCase();
  switch (lastString) {
    case "GB":
      return size.slice(0, -2) * 1024 ** 3;
    case "MB":
      return size.slice(0, -2) * 1024 ** 2;
    case "KB":
      return size.slice(0, -2) * 1024;
    default:
      return size;
  }
};
