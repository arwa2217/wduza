import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import "./folder.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createFolderAction,
  resetCreateFolderAction,
} from "../../../store/actions/folderAction";
import { StyledModal } from "./createFolderModal.styles";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Close from "../../../assets/icons/close.svg";

function CreateFolderModal(props) {
  const { t } = useTranslation();

  const [show, setShow] = useState(true);
  const titleKey = "files:create.folder.modal:new.file.folder";
  const modalTitle = t(titleKey);

  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });
  let { name, description } = inputs;
  const [isSubmitBtnEnabled, enableSubmitBtn] = useState(
    name && name !== "" ? true : false
  );
  const creatingFolder = useSelector(
    (state) => state.folderReducer.creatingFolder
  );
  // const createdFolder = useSelector(
  //   (state) => state.folderReducer.createdFolder
  // );

  const createFolderApiError = useSelector(
    (state) => state.folderReducer.createFolderApiError
  );
  const { folderCreateSuccess } = useSelector((state) => state.folderReducer);
  const maxChars = 64;
  const descriptionMaxChar = 94;
  const [charLeft, setCharLeft] = useState(maxChars);
  const [descriptionCharLeft, setDescriptionCharLeft] =
    useState(descriptionMaxChar);
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (createFolderApiError) {
      dispatch(resetCreateFolderAction());
    }
    setSubmitted(true);
    let folder = {};
    name = name.trim();
    if (name) {
      folder.folderName = name;
      folder.description = description;
      folder.type = "BASIC";
      dispatch(createFolderAction(folder, dispatch));
    }
  }

  useEffect(() => {
    if (folderCreateSuccess) {
      handleClose();
    }
  }, [folderCreateSuccess]);

  function handleNameChange(e) {
    var { name, value } = e.target;

    if (name === "description") {
      setDescriptionCharLeft(descriptionMaxChar - value.length);
    }
    if (name === "name") {
      setCharLeft(maxChars - value.length);
      enableSubmitBtn(value && value.length > 0);
    }

    if (createFolderApiError) {
      dispatch(resetCreateFolderAction());
    }

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  }

  const handleClose = () => {
    props.onModalHide();
    dispatch(resetCreateFolderAction());
  };

  return (
    <>
      <StyledModal
        className="create-folder-modal"
        show={show}
        onHide={handleClose}
        centered
      >
        {submitted && folderCreateSuccess && (
          <>
            <div className="custom-alert-modal">
              <Alert variant="success">
                {t("files:create.folder.modal:alerts:2001")}
              </Alert>
            </div>
          </>
        )}

        <ModalHeader>
          <span className="header-title"> {modalTitle}</span>
          <button
            type="button"
            className="close"
            onClick={() => {
              props.onModalHide();
            }}
          >
            <span aria-hidden="true">
              <img src={Close} alt="" />
            </span>
            <span className="sr-only">
              {t("files:create.folder.modal:close")}
            </span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Group className="m-0">
                    <Form.Label>
                      {t("files:create.folder.modal:new.foldername")}
                    </Form.Label>
                    <InputGroup
                      className="folder-input-field char-counter-wrapper"
                      style={{ marginBottom: "30px" }}
                    >
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        maxLength={maxChars}
                        onChange={handleNameChange}
                        className={
                          "pr-5" +
                          (submitted &&
                          (!name.trim() ||
                            (createFolderApiError &&
                              createFolderApiError.code === 40024))
                            ? " is-invalid"
                            : "")
                        }
                        placeholder={t(
                          "files:create.folder.modal:namePlaceholder"
                        )}
                      />

                      {name && !createFolderApiError && (
                        <InputGroup.Prepend>
                          <span>{charLeft}</span>
                        </InputGroup.Prepend>
                      )}
                      {submitted && !name.trim() && (
                        <div className="invalid-feedback">
                          {t("files:create.folder.modal:name.required")}
                        </div>
                      )}
                      {submitted &&
                        createFolderApiError &&
                        createFolderApiError.code === 40024 && (
                          <div className="invalid-feedback">
                            {t(
                              "files:create.folder.modal:createFolderApiError:40024"
                            )}
                          </div>
                        )}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="m-0">
                    <Form.Label>
                      {t("files:create.folder.modal:new.folder.description")}
                    </Form.Label>
                    <InputGroup className="folder-input-field char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="description"
                        value={description}
                        maxLength={descriptionMaxChar}
                        onChange={handleNameChange}
                        className={"pr-5"}
                        placeholder={t(
                          "files:create.folder.modal:descriptionPlaceHolder"
                        )}
                      />

                      {description && (
                        <InputGroup.Prepend>
                          <span>{descriptionCharLeft}</span>
                        </InputGroup.Prepend>
                      )}
                    </InputGroup>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ border: "none" }}>
          <button
            className={` ${
              !isSubmitBtnEnabled
                ? "create-folder-btn-disabled"
                : "create-folder-btn"
            }`}
            onClick={!isSubmitBtnEnabled ? null : handleSubmit}
          >
            {creatingFolder && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {t("files:create.folder.modal:create.folder")}
          </button>
        </Modal.Footer>
      </StyledModal>{" "}
    </>
  );
}

export default CreateFolderModal;
