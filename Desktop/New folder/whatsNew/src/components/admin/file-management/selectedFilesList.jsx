import React, { useState } from "react";
import Col from "react-bootstrap/Col";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import File from "./file";
import LocalDateTime from "../../local-date-time/local-date-time";
import FileDeleteModal from "../../files/file-delete-modal";
import FileAttachmentService from "../../../services/file-attachment-service";

const Wrapper = styled.div`
  max-height: calc(100vh - 248px);
  overflow-x: auto;
`;
const Container = styled.div`
  padding: 10px 20px;
`;
const Name = styled.span`
  color: #19191a;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
  margin-right: 5px;
`;
const DateTime = styled.div`
  font-size: 12px !important;
`;
const FileOwnerInfo = styled.div`
  display: flex;
  align-items: baseline;
`;
const SelectedFile = styled.div`
  font-size: 14px;
  color: #19191a;
  margin-bottom: 10px;
  padding: 0 20px;
`;

const selectedFilesList = () => {
  const { t } = useTranslation();

  let selectedFiles = useSelector(
    (state) => state.mainFilesReducer.selectedFiles
  );

  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFileDelete = (e) => {
    e.preventDefault();
    FileAttachmentService.removeFilesById(selectedFiles, dispatch, true);
    setShowDeleteModal(false);
  };

  return (
    <Col className="w-100" style={{ padding: "20px 0" }}>
      <SelectedFile>
        {t("admin:account.management:sidebar.details:selected.list")}{" "}
        <b>{selectedFiles.length}</b>
      </SelectedFile>
      <Wrapper>
        {selectedFiles.length > 0 ? (
          selectedFiles.map((data, ind) => (
            <Container key={ind}>
              <FileOwnerInfo>
                <Name>{data.uploader}</Name>
                <DateTime>
                  <LocalDateTime
                    eventTime={parseInt(data.createdAt)}
                    timeFormat={"date.format"}
                  />
                </DateTime>
              </FileOwnerInfo>
              <File
                hideMenuOption={true}
                channelFilesList={[
                  { ...data, fileName: data.name, fileSize: data.size },
                ]}
              />
            </Container>
          ))
        ) : (
          <div className="text-center">
            {t("admin:account.management:selected.list:no.data")}
          </div>
        )}
      </Wrapper>

      <div
        className="d-flex justify-content-between w-100"
        style={{ position: "absolute", bottom: 0, left: 0 }}
      >
        <Button
          variant="outline-primary"
          onClick={() => setShowDeleteModal(true)}
          className={"btn-small w-100"}
          style={{ margin: "20px" }}
        >
          {t("button:delete")}
        </Button>
      </div>
      <FileDeleteModal
        fileCount={selectedFiles.length}
        showModal={showDeleteModal}
        handleSubmit={handleFileDelete}
        handleCancel={() => setShowDeleteModal(false)}
        showOwnFileDeleteWarning={false}
      />
    </Col>
  );
};

export default selectedFilesList;
