import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import "./create-channel-modal.css";
import Close from "../../../assets/icons/close.svg";
import { useTranslation } from "react-i18next";
import ModalTypes from "../../../constants/modal/modal-type";
import ModalActions from "../../../store/actions/modal-actions";
import {
  GetChannelListAction,
  resetControlFlags,
  renameDiscussionAction,
} from "../../../store/actions/channelActions";
import { showToast } from "../../../store/actions/toast-modal-actions";
import {
  StyledModal,
  GreenButton,
  CancelButton,
} from "./styles/remove-people-style";
import { useDispatch, useSelector } from "react-redux";
import StatusCode from "../../../constants/rest/status-codes";

const maxChars = 64;
const descriptionMaxChar = 94;
function RenameDiscussionModal(props) {
  const [show, setShow] = useState(props.show);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [nameError, setNameError] = useState("");
  const [remainingNameLength, setRemainingNameLength] = useState(
    props.channel?.name
      ? maxChars - props.channel.name.toString().length
      : maxChars
  );
  const [remainingDescLength, setRemainingDescLength] = useState(
    props.channel?.description
      ? descriptionMaxChar - props.channel.description.toString().length
      : descriptionMaxChar
  );
  const dispatch = useDispatch();
  const channel = props.channel;
  const [inputs, setInputs] = useState({
    name: (channel && channel.name) || "",
    description: (channel && channel.description) || "",
  });

  let { name, description } = inputs;

  const { t } = useTranslation();
  const { renamingDiscussion, renameSuccessful, errorCode } = useSelector(
    (state) => state.ChannelReducer
  );

  useEffect(() => {
    if (renameSuccessful) {
      dispatch(GetChannelListAction());
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.RENAME_DISCUSSION));
    } else if (renameSuccessful === false) {
      if (
        errorCode &&
        (errorCode === StatusCode.COMMON_ERROR ||
          errorCode === StatusCode.SERVER_ERROR)
      ) {
        dispatch(showToast(t("error.code.message:COMMON_ERROR"), 3000));
      }
      if (errorCode && errorCode === StatusCode.NAME_TAKEN) {
        dispatch(showToast(t("error.code.message:NAME_TAKEN"), 3000));
      }
      dispatch(resetControlFlags());
      setShow(false);
      dispatch(ModalActions.hideModal(ModalTypes.RENAME_DISCUSSION));
    }
  }, [renameSuccessful]);

  // useEffect(() => {

  // }, [newDesc])

  function handleClose() {
    dispatch(resetControlFlags());
    setShow(false);
    dispatch(ModalActions.hideModal(ModalTypes.RENAME_DISCUSSION));
  }

  function handleRenameDiscussion() {
    dispatch(renameDiscussionAction(channel, name, description));
  }

  function handleOnNameInputChange(e) {
    const { name, value } = e.target;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
    if (name === "name") {
      setRemainingNameLength(maxChars - value.length);
      if (value === props.channel.name) {
        setNameError(t("rename.discussion.modal:error.same.name"));
        setButtonDisabled(true);
      } else if (value.length === 0) {
        setNameError(t("rename.discussion.modal:error.length.zero"));
        setButtonDisabled(true);
      } else if (value.length > maxChars) {
        setNameError(t("rename.discussion.modal:error.length.exceed"));
        setButtonDisabled(true);
      } else {
        setNameError("");
        setButtonDisabled(false);
      }
      // setNewName(value);
    }
    if (name === "description") {
      setRemainingDescLength(descriptionMaxChar - value.length);
      if (value === props.channel.description) {
        setButtonDisabled(true);
      } else if (value.length === 0) {
        setButtonDisabled(true);
      } else if (value.length > descriptionMaxChar) {
        setButtonDisabled(true);
      } else {
        setButtonDisabled(false);
      }
    }
  }

  if (channel.isOwner) {
    return (
      <StyledModal
        show={show}
        onHide={handleClose}
        centered
        className="create-channel-modal"
        has_modal_radius={`true`}
      >
        <Modal.Header>
          <div className="heading">{props.title}</div>
          <button
            type="button"
            className="close rename-close"
            onClick={handleClose}
          >
            <span aria-hidden="true">
              <img src={Close} alt={`close-button`} />
            </span>
            <span className="sr-only">{t("rename.discussion.modal:close")}</span>
          </button>
        </Modal.Header>

        <Modal.Body className="rename-modal-body">
          {/* <div className="rename-discussion-message">{t("rename.discussion.modal:body")}</div> */}
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Group>
                    <Form.Label>{t("rename.discussion.modal:body")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="name"
                        value={name}
                        maxLength={64}
                        onChange={(e) => handleOnNameInputChange(e)}
                        className={
                          "pr-5" + nameError && nameError !== ""
                            ? " is-invalid"
                            : ""
                        }
                      />
                      {name && nameError === "" && (
                        <InputGroup.Prepend>
                          <span>{remainingNameLength}</span>
                        </InputGroup.Prepend>
                      )}
                      {nameError && nameError !== "" && (
                        <div className="invalid-feedback">{nameError}</div>
                      )}
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("discussion:description.label")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="description"
                        value={description}
                        maxLength={94}
                        placeholder={t("discussion:description.placeholder")}
                        onChange={(e) => handleOnNameInputChange(e)}
                        className={"pr-5"}
                      />
                      {(description || description === "") && (
                        <InputGroup.Prepend>
                          <span>{remainingDescLength}</span>
                        </InputGroup.Prepend>
                      )}
                    </InputGroup>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <CancelButton onClick={handleClose}>
            {t("leave.discussion.modal:cancel")}
          </CancelButton>
          <GreenButton
            disabled={buttonDisabled}
            onClick={buttonDisabled ? null : handleRenameDiscussion}
          >
            {renamingDiscussion && (
              <span className="spinner-border spinner-border-sm mr-1"></span>
            )}
            {t("rename.discussion.modal:rename")}
          </GreenButton>
        </Modal.Footer>
      </StyledModal>
    );
  } else {
    return (
      <StyledModal
        show={show}
        onHide={handleClose}
        centered
        className="create-channel-modal"
        has_modal_radius={`true`}
      >
        <Modal.Header>
          <div className="heading">{t("rename.discussion.modal:details")}</div>
          <button
            type="button"
            className="close rename-close"
            onClick={handleClose}
          >
            <span aria-hidden="true">
              <img src={Close} alt={`close-button`} />
            </span>
            <span className="sr-only">{t("rename.discussion.modal:close")}</span>
          </button>
        </Modal.Header>

        <Modal.Body className="rename-modal-body">
          {/* <div className="rename-discussion-message">{t("rename.discussion.modal:body")}</div> */}
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Group>
                    <Form.Label>{t("rename.discussion.modal:name")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="name"
                        readOnly={true}
                        value={name}
                      />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("discussion:description.label")}</Form.Label>
                    <InputGroup className="char-counter-wrapper">
                      <Form.Control
                        type="text"
                        name="description"
                        readOnly={true}
                        value={description}
                        placeholder={t("discussion:description.placeholder")}
                      />
                    </InputGroup>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <GreenButton onClick={handleClose}>
            {t("leave.discussion.modal:ok")}
          </GreenButton>
        </Modal.Footer>
      </StyledModal>
    );
  }
}

export default RenameDiscussionModal;
