import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ResetPassword,
  ClearResetPassword,
} from "../../store/actions/user-actions";
import { useTranslation } from "react-i18next";

import "./reset.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
// import { Grid } from 'semantic-ui-react';

import InfoModal from "../modal/info-modal/info-modal";
import ValueConstants from "../../constants/rest/value-constants";
import WIPModal from "../work-in-progress/work-in-progress-modal";

import { emailRegex } from "../../utilities/utils";

import ShieldOk from "../../assets/icons/shield-ok.svg";
import BI from "../../assets/icons/BI.svg";
import {
  PageContainer,
  PageWrapper,
  FormContainer,
  PageHeader,
  PageFooter,
  PageSubHeader,
  Paragraph,
  TextLink,
  Icon,
} from "@styles/onboarding.style.js";
import { MENU_ITEMS } from "../../constants/menu-items";

/*
 *reset password page
 */
function ResetPasswordRequest() {
  const { t } = useTranslation();

  const [user, setUser] = useState({
    email: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const { resetting, resetSuccess, resetFail, resetFailEmail } = useSelector(
    (state) => state.UserReducer
  );
  // const resetting = true;

  // const resetSuccess = true;
  // const resetFail = true;
  // const resetFailEmail = true;

  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);

    if (user.email && emailRegex.test(user.email)) {
      dispatch(ResetPassword(user));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function modalProps() {
    let data = "";
    if (resetSuccess) {
      data = {
        showHeader: true,
        header: "reset.password:success.header",
        content1: "reset.password:success.content1",
        user: user,
        isContent2: true,
        content2: "reset.password:success.content2",
        isContent3: false,
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:success.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:success.secondary.button",
      };
    }
    if (resetFail) {
      data = {
        showHeader: false,
        content1: "reset.password:failure.content1",
        isContent2: true,
        content2: "reset.password:failure.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:failure.secondary.button",
      };
    }
    if (resetFailEmail) {
      data = {
        showHeader: true,
        header: "reset.password:failure.email.header",
        content1: "reset.password:failure.email.content1",
        isContent2: true,
        content2: "reset.password:failure.email.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "reset.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "reset.password:failure.secondary.button",
      };
    }

    return data;
  }

  function closeModal() {
    dispatch(ClearResetPassword());
  }

  function isAuthorised() {
    return localStorage.getItem(ValueConstants.STRING_AUTH);
  }

  function showWIPModal() {
    setShowModal(true);
    dispatch(ClearResetPassword());
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    setShowModal(false);
    dispatch(ClearResetPassword);
  }

  useEffect(() => {
    window.addEventListener("popstate", onBackKeyDown);
    //return () => window.removeEventListener("popstate", onBackKeyDown);
  }, []);

  function handleModalClose() {
    setShowModal(false);
  }

  return isAuthorised() ? (
    <Redirect to={MENU_ITEMS.COLLECTIONS} />
  ) : (
    <>
      <PageContainer
        className="home-container"
        style={{ height: "100vh", overflowY: "auto" }}
      >
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("reset.password:header.label")}
          </PageHeader>
          <PageSubHeader>{t("reset.password:message.label")}</PageSubHeader>
          <FormContainer>
            <Form name="form" onSubmit={handleSubmit} className="mt-3">
              <Form.Group>
                <Row>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("reset.password:email.label")}</Form.Label>
                    <Form.Control
                      placeholder={t("reset.password:email.placeholder")}
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className={
                        "form-control" +
                        ((submitted && !user.email) ||
                        (submitted && !emailRegex.test(user.email))
                          ? " is-invalid"
                          : "")
                      }
                    />

                    {submitted && !user.email && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:email.required")}
                      </Form.Control.Feedback>
                    )}

                    {submitted &&
                      user.email &&
                      !emailRegex.test(user.email) && (
                        <Form.Control.Feedback type="invalid">
                          {t("error:email.pattern")}
                        </Form.Control.Feedback>
                      )}
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group className="mt-5">
                <Row>
                  <Col
                    xs={{ span: 12 }}
                    md={{ span: 4 }}
                    className="mt-4 mt-md-0"
                  >
                    <Link to="/signin" className="btn btn-block btn-secondary">
                      {t("button:back")}
                    </Link>
                  </Col>
                  <Col
                    xs={{ span: 12, order: "first" }}
                    md={{ span: 4, offset: 4, order: "last" }}
                  >
                    <button
                      onClick={onsubmit}
                      className="btn btn-block btn-primary"
                    >
                      {resetting && (
                        <span className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t("button:reset")}
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center w-100 px-0 pt-3">
                    <Paragraph default>
                      {t("signin.label.continue_to_have_issue")}{" "}
                      <TextLink
                        primary={`true`}
                        underline={`true`}
                        target="_blank"
                        to={{
                          pathname: "https://monolyhq.github.io/docs/contact/",
                        }}
                        // onClick={() => setShowModal(true)}
                      >
                        {t("label.contact_support")}
                      </TextLink>
                    </Paragraph>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </FormContainer>
        </PageWrapper>
        <PageFooter>
          <Paragraph default>
            <Icon src={ShieldOk} size="medium" />
            {t("footer.data.message1")}
            <strong>{t("footer.data.message2")}</strong>
          </Paragraph>
        </PageFooter>
      </PageContainer>
      <InfoModal
        data={modalProps()}
        showWIPModal={showWIPModal}
        closeModal={closeModal}
        showModal={resetSuccess || resetFail || resetFailEmail}
      />
      <WIPModal handleClose={handleModalClose} show={showModal} centered />
    </>
  );
}

export default ResetPasswordRequest;
