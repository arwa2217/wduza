import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "../../mainframe/mainframe.css";
import { useDispatch } from "react-redux";
import { GetAllFolders } from "../../../store/actions/folderAction";
import ESignaturePanel from "../e-signaturePanel";
import AddESignatureTopBar from "./add-e-signatureTopBar";
import PDFEditor from "../prepare-document/pdf-editor";
// import ESignatureDetailsHead from "../e-sigantureDetails/e-signatureDetailsHead";
import PdftronSideView from "./pdftron-sideview";


function AddESignatureView(props) {
  const dispatch = useDispatch();
  const activeActionPanel = "ESIGN_INBOX";

  const esignSummary = {
    display: "contents",
    paddingLeft: "0px"
}

  useEffect(() => {
    dispatch(GetAllFolders(dispatch));
  }, []);
  return (
    <>
      <div
        onMouseDown={(e) => {
          if (!props.isProjectListEnabled) {
            props.setIsProjectListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col id="middle-project" className="project-bar pl-0 pr-0">
        <ESignaturePanel />
      </Col>
      <div
        onMouseDown={(e) => {
          if (!props.isDiscussionListEnabled) {
            props.setIsDiscussionListEnabled(true);
          }
          //e.preventDefault();
          return false;
        }}
      >
        <hr className="width-resize-sidebar" />
      </div>
      <Col
        id="right-messagetab"
        className="noScroll main-post-area frameContent p-0 main-file-area"
      >
        <AddESignatureTopBar />
        <Row>
          <Col className="pr-0">
            {/* <ESignatureDetailsHead /> */}
            <PDFEditor />
          </Col>

          <Col id="middle-project" style={esignSummary}>
            <PdftronSideView />
          </Col>
        </Row>
      </Col>
    </>
  );
}

export default AddESignatureView;
