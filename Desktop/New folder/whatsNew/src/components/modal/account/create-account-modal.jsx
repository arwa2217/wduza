import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ModalHeader from "react-bootstrap/ModalHeader";
import { useDispatch, useSelector } from "react-redux";
import "./create-account-modal.css";
import { useTranslation } from "react-i18next";
import {
  createAccountAction,
  resetCreateAccountAction,
} from "../../../store/actions/admin-account-action";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Close from "../../../assets/icons/close.svg";
import { emailRegex, phoneRegex, nameRegex } from "./../../../utilities/utils";
import { showToast } from "../../../store/actions/toast-modal-actions";
function CreateAccountModal(props) {
  const { t } = useTranslation();
  const titleKey = "account:new.account";
  const modalTitle = t(titleKey);
  const dispatch = useDispatch();
  const [submitted, setSubmitted] = useState(false);
  const [member, setMember] = useState({
    name: "",
    email: "",
    screenName: "",
    phoneNumber: "",
    affiliation: "",
    jobTitle: "",
    assignUID: true,
  });
  const createAccountApiError = useSelector(
    (state) => state.AdminAccountReducer.createAccountApiError
  );
  const handleClose = () => {
    dispatch(resetCreateAccountAction());
    props.closeModal();
  };
  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setMember((member) => ({
      ...member,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { phoneNumber, email, screenName } = member;
    if (createAccountApiError) {
      dispatch(resetCreateAccountAction());
    }
    setSubmitted(true);
    let isNumberValidation = true;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      isNumberValidation = false;
    }
    if (
      email &&
      emailRegex.test(email) &&
      screenName.toString().trim() &&
      nameRegex.test(screenName.toString().trim()) &&
      isNumberValidation
    ) {
      const response = await dispatch(createAccountAction(member));
      if (response.error) {
        dispatch(showToast(t("account:error.message"), 3000, "failure"));
      } else {
        handleClose();
        dispatch(showToast(t("account:success.message"), 3000, "success"));
      }
    }
  };

  return (
    <>
      <Modal
        size="lg"
        show={props.showModal}
        onHide={handleClose}
        className="create-account-modal"
        centered
      >
        <ModalHeader>
          {modalTitle}
          <button type="button" className="close" onClick={handleClose}>
            <span aria-hidden="true">
              <img src={Close} alt=""/>
            </span>
            <span className="sr-only">{t("create.channel.modal:close")}</span>
          </button>
        </ModalHeader>
        <Modal.Body>
          <Form name="form">
            <Row>
              <Col xs={12}>
                <div className="form-wrapper">
                  <Form.Group>
                    <Form.Label>{t("account:name.label")}</Form.Label>
                    <Form.Control
                      placeholder={t("account:name.placeholder")}
                      type="text"
                      name="name"
                      className="customInput"
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      {t("account:screen.name.label")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder={t("account:screen.name.placeholder")}
                      type="text"
                      name="screenName"
                      className={
                        (submitted && !member.screenName.toString().trim()) ||
                        (submitted &&
                          member.screenName &&
                          !nameRegex.test(member.screenName.toString().trim()))
                          ? " is-invalid"
                          : ""
                      }
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                    {submitted && !member.screenName.toString().trim() && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:screen.name.required")}
                      </Form.Control.Feedback>
                    )}
                    {submitted &&
                      member.screenName &&
                      !nameRegex.test(member.screenName.toString().trim()) && (
                        <Form.Control.Feedback type="invalid">
                          {t("error:screen.name.invalid")}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("account:affiliation")}</Form.Label>
                    <Form.Control
                      placeholder={t("account:affiliation.placeholder")}
                      type="text"
                      name="affiliation"
                      className="customInput"
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("account:jobtitle")}</Form.Label>
                    <Form.Control
                      placeholder={t("account:jobtitle.placeholder")}
                      type="text"
                      name="jobTitle"
                      className="customInput"
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      {t("account:email")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      placeholder={t("account:email.placeholder")}
                      type="email"
                      name="email"
                      className={
                        (submitted && !member.email.toString().trim()) ||
                        (submitted &&
                          member.email &&
                          !emailRegex.test(member.email.toString().trim()))
                          ? " is-invalid"
                          : ""
                      }
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                    {submitted && !member.email.toString().trim() && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:email.required")}
                      </Form.Control.Feedback>
                    )}
                    {submitted &&
                      member.email &&
                      !emailRegex.test(member.email.toString().trim()) && (
                        <Form.Control.Feedback type="invalid">
                          {t("error:email.invalid")}
                        </Form.Control.Feedback>
                      )}
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>{t("account:phone")}</Form.Label>
                    <Form.Control
                      placeholder={t("account:phone.placeholder")}
                      type="text"
                      name="phoneNumber"
                      className="customInput"
                      onClick={handleChange}
                      onInput={handleChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <div className="custom-control custom-checkbox custom-checkbox-green">
                      <input
                        type="checkbox"
                        className="custom-control-input custom-control-input-green"
                        name="assignUID"
                        id="assing-uid"
                        checked={member.assignUID}
                        onChange={handleChange}
                      />
                      <label
                        className="custom-control-label pointer-on-hover"
                        htmlFor="assing-uid"
                      >
                        {t("account:assignUid")}
                      </label>
                    </div>
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary cancel-btn"
            onClick={handleClose}
          >
            {t("button:cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className={`btn px-5 btn-primary save-btn`}
          >
            {t("button:save")}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateAccountModal;
