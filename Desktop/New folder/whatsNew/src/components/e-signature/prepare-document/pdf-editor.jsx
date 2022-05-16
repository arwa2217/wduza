import React, { useState, useEffect } from "react";
import server from "server";
import axios from "axios";
import { AuthHeader } from "../../../utilities/app-preference";
import WebViewer from "@pdftron/webviewer";
import "./prepare-document.css";
import { useSelector } from "react-redux";
import ESignatureServices from "../../../services/esignature-services";

const PDFEditor = (props) => {
  console.log(props, "propshello")
  const currentUser = useSelector((state) => state.AuthReducer.user);
  const fileLoader = () => {
    if (props.fileInfo?.url) {
      loadPDFViewer(props.fileInfo);
    } else {
      loadPDFViewer(props.fileInfo);
    }
  };

  const loadPDFViewer = (file) => {
    const webviewerConnectionData = {
      userToken: { authorization: AuthHeader().Authorization },
      userEmail: currentUser?.email,
      baseUrl: server.apiUrl + "/ent/v1/e-sign/",
    };
    WebViewer(
      {
        path: "webviewer",
        disabledElements: [
          "ribbons",
          "toggleNotesButton",
          "searchButton",
          "menuButton",
          "annotationCommentButton",
          "linkButton",
          "annotationStyleEditButton",
          "eraserToolButton",
          "deletePage",
          "thumbDelete",
          "calloutToolGroupButton",
          "stampToolGroupButton",
          "toolsOverlay",
          "signatureToolGroupButton",
          "rubberStampToolGroupButton",
          "fileAttachmentToolGroupButton",
          "toolsHeader",
          "pageInsertionHeader",
          "insertPageAbove",
          "thumbRotateClockwise",
          "pageManipulationOverlayButton",
          "pageManipulationHeader",
          "rotateHeader",
          "rotateClockwiseButton",
          "rotateCounterClockwiseButton",
          "contextMenuPopup",
          "selectToolButton",
          "textPopup"
        ],
        useDownloader: true,
        custom: JSON.stringify(webviewerConnectionData),
      },
      props.viewer.current
    ).then((instance) => {
      const { iframeWindow, setCustomModal } = instance;

      // select only the view group
      instance.UI.openElements(["leftPanel"]);
      // instance.UI.setActiveLeftPanel('outlinesPanel');
      instance.setToolbarGroup("toolbarGroup-View");
      props.setInstance(instance);

      const iframeDoc = iframeWindow.document.body;
      iframeDoc.addEventListener("dragover", props.dragOver);
      iframeDoc.addEventListener("drop", (e) => {
        props.drop(e, instance);
      });
      if (file.url) {
        instance.UI.loadDocument(file.url, { customHeaders: AuthHeader() });
      } else {
        instance.UI.loadDocument(file);
      }

      /*
      const { Tools, documentViewer } = instance.Core;
      const signatureTool = documentViewer.getTool('AnnotationCreateSignature');
    
      signatureTool.addEventListener('locationSelected', () => {
        instance.UI.openElements(['signatureModal']);
      });
      const stampTool = documentViewer.getTool('AnnotationCreateRubberStamp');
      stampTool.addEventListener('locationSelect', () => {
        console.log("Stamp placeholder listener");
      });
      */
    });
  };
  useEffect(() => {
    if (props.fileInfo) fileLoader();
  }, [props.fileInfo]);

  return (
    <div className="file-view-div">
      <div className="webviewer" ref={props.viewer}></div>
    </div>
  );
};

export default PDFEditor;
