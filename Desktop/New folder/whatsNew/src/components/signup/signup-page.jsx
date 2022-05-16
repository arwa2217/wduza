import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserActions from "../../store/actions/user-actions";
import { useTranslation } from "react-i18next";

import "./signup.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
// import { Grid } from 'semantic-ui-react';

import InfoModal from "../modal/info-modal/info-modal";
import ValueConstants from "../../constants/rest/value-constants";
import WIPModal from "../work-in-progress/work-in-progress-modal";
import core from "core";
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
import { emailRegex } from "../../utilities/utils";
import { MENU_ITEMS } from "../../constants/menu-items";

/*
 *user Sign up page
 */
function SignupPage() {
  const { t } = useTranslation();

  const [user, setUser] = useState({
    email: "",
    uid: useSelector((state) => state.SignupReducer.uid),
  });

  const [submitted, setSubmitted] = useState(false);
  const signingUp = useSelector((state) => state.SignupReducer.signingup);
  const signedUp = useSelector((state) => state.SignupReducer.signedUp);
  const signupFailEmail = useSelector(
    (state) => state.SignupReducer.signupFailEmail
  );
  const signupFailUid = useSelector(
    (state) => state.SignupReducer.signupFailUid
  );
  const signupFail = useSelector((state) => state.SignupReducer.signupFail);
  const resendFail = useSelector((state) => state.SignupReducer.resendFail);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);

    if (user.email && emailRegex.test(user.email)) {
      dispatch(UserActions.signup(user));
    }
    // if (user.email && user.uid && emailRegex.test(user.email)) {
    //   dispatch(UserActions.signup(user));
    // }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function modalProps() {
    let data = "";
    if (signedUp) {
      data = {
        showHeader: true,
        header: "signup.modal:success.header",
        content1: "signup.modal:success.content1",
        user: user,
        isContent2: true,
        content2: "signup.modal:success.content2",
        isContent3: true,
        content3: "signup.modal:success.content3",
        showButtonMessage: true,
        buttonMessage: "signup.modal:success.email.message",
        showPrimaryButton: false,
        primaryButtonLink: "/signin",
        primaryButtonText: "signup.modal:success.primary.button",
        showSecondaryButton: false,
        secondaryButtonText: "signup.modal:success.secondary.button",
      };
    }
    if (signupFailEmail) {
      data = {
        showHeader: false,
        isContent1: true,
        content1: "signup.modal:failure.email.content1",
        isContent2: true,
        content2: "signup.modal:failure.email.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "signup.modal:failure.email.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "signup.modal:failure.email.secondary.button",
      };
    }
    if (signupFailUid) {
      data = {
        showHeader: false,
        content1: "signup.modal:failure.uid.content1",
        isContent2: true,
        content2: "signup.modal:failure.uid.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "signup.modal:failure.uid.primary.button",
        primaryButtonLink: "/newuid",
        secondaryButtonText: "signup.modal:failure.uid.secondary.button",
      };
    }

    if (signupFail) {
      data = {
        showHeader: true,
        header: "register:failure.header",
        content1: "register:failure.content1",
        isContent2: false,
        content2: "",
        showButtonMessage: false,
        showPrimaryButton: false,
        secondaryButtonText: "register:failure.secondary.button",
      };
    }

    if (resendFail) {
      data = {
        showHeader: true,
        header: "signup.modal:failure.email.send.header",
        content1: "signup.modal:failure.email.send.content1",
        isContent2: false,
        showButtonMessage: false,
        showPrimaryButton: false,
        secondaryButtonText: "signup.modal:failure.email.send.secondary.button",
      };
    }
    return data;
  }

  function closeModal() {
    dispatch(UserActions.clearSignup());
  }

  function isAuthorised() {
    return localStorage.getItem(ValueConstants.STRING_AUTH);
  }

  function showWIPModal() {
    setShowModal(true);
    dispatch(UserActions.clearSignup());
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    setShowModal(false);
    dispatch(UserActions.clearSignup());
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
      <PageContainer className="page-container">
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("signup:header.label")}
          </PageHeader>
          <PageSubHeader>{t("signup:message.label")}</PageSubHeader>

          <FormContainer>
            <Form name="form" onSubmit={handleSubmit} className="mt-3">
              <Form.Group>
                <Row>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("user.email.label")}</Form.Label>
                    <Form.Control
                      placeholder={t("placeholder:email")}
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
                    <a
                      href={core.signupUrl}
                      className="btn btn-block btn-secondary"
                    >
                      {t("button:back")}
                    </a>
                  </Col>
                  <Col
                    xs={{ span: 12, order: "first" }}
                    md={{ span: 4, offset: 4, order: "last" }}
                  >
                    <button
                      onClick={onsubmit}
                      className="btn btn-block btn-primary"
                    >
                      {signingUp && (
                        <span className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t("button:continue")}
                    </button>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center w-100 px-0 pt-3">
                    <Paragraph default>
                      {t("label.continue_to_have_issue")}{" "}
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
        showModal={
          signedUp ||
          signupFailUid ||
          signupFailEmail ||
          resendFail ||
          signupFail
        }
      />
      <WIPModal
        handleClose={handleModalClose}
        show={showModal}
        // show={true}
        centered
      />
    </>
  );
}

export default SignupPage;
