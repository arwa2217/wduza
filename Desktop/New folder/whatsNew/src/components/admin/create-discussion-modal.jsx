import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

function CreateDiscussionModal(props) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");

  const { t } = useTranslation();

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleOwnerChange(e) {
    setOwner(e.target.value);
  }

  function handleCreate() {
    props.onCreateDiscussion(name, owner);
    setName("");
    setOwner("");
  }

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title id="title">
          {t("discussion:CREATE_DISCUSSION")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="name">
            <Form.Label>{t("discussion:name.label")}</Form.Label>
            <Form.Control
              onChange={handleNameChange}
              name="name"
              value={name}
              type="text"
              placeholder="Enter discussion name"
            />
          </Form.Group>
          <Form.Group controlId="owner">
            <Form.Label>{t("discussion:discussion.email.owner")}</Form.Label>
            <Form.Control
              onChange={handleOwnerChange}
              name="owner"
              value={owner}
              type="text"
              placeholder={t("discussion:discussion.email.owner")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>{t("button:close")}</Button>
        <Button onClick={handleCreate}>{t("button:create")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateDiscussionModal;
