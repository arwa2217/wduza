import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./admin.css";
import { useTranslation } from "react-i18next";

function DefaultPasswordModal(props) {
  const [pwd, setPwd] = useState("");
  const [repwd, setRepwd] = useState("");
  const [valid, setValid] = useState(true);

  const { t } = useTranslation();

  function handlePwdChange(e) {
    setValid(true);
    setPwd(e.target.value);
  }

  function handleRepwdChange(e) {
    setRepwd(e.target.value);
  }

  function handleSetPassword() {
    let result = false;
    if (pwd !== "" && pwd === repwd) {
      props.onSetPassword(pwd);
      result = true;
    }

    setPwd("");
    setRepwd("");
    setValid(result);
    document.getElementById("pwd").focus();
  }

  return (
    <Modal {...props} centered>
      <Modal.Header closeButton>
        <Modal.Title id="title">
          {t("password.modal:default.password")}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="pwd">
            <Form.Label>{t("password.modal:enter.password")}</Form.Label>
            <Form.Control
              onChange={handlePwdChange}
              name="pwd"
              value={pwd}
              type="password"
            />
          </Form.Group>
          <Form.Group controlId="repwd">
            <Form.Label>{t("password.modal:confirm.password")}</Form.Label>
            <Form.Control
              onChange={handleRepwdChange}
              name="repwd"
              value={repwd}
              type="password"
            />
            {valid === false && (
              <Form.Text className="form-text">
                {t("password.modal:not.matched")}
              </Form.Text>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>{t("button:close")}</Button>
        <Button onClick={handleSetPassword}>{t("button:set")}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DefaultPasswordModal;
