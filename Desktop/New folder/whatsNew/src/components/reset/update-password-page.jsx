import React, { useState, useEffect } from "react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ClearUpdatePassword,
  UpdatePassword,
} from "../../store/actions/user-actions";
import { useTranslation } from "react-i18next";

import "./reset.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import InfoModal from "../modal/info-modal/info-modal";
import ValueConstants from "../../constants/rest/value-constants";
import WIPModal from "../work-in-progress/work-in-progress-modal";
import ShieldOk from "../../assets/icons/shield-ok.svg";
import BI from "../../assets/icons/BI.svg";
import { pwdRegex } from "../../utilities/utils";

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
 *user Registration page after successful Sign up
 */
function UpdatePasswordPage() {
  const location = useLocation();
  const { t } = useTranslation();
  const [user, setUser] = useState({
    resetEmail: useSelector((state) => state.UserReducer.resetEmail),
    resetPasswordCode: useSelector(
      (state) => state.UserReducer.resetPasswordCode
    ),
    password: "",
    confirmPassword: "",
  });

  const {
    passwordResetApiError,
    passwordResetSuccess,
    passwordResetting,
    passwordResetFail,
  } = useSelector((state) => state.UserReducer);

  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (
      user.password &&
      user.confirmPassword &&
      user.password === user.confirmPassword &&
      pwdRegex.test(user.password) &&
      user.resetEmail &&
      user.resetPasswordCode
    ) {
      dispatch(UpdatePassword(user));
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function resetState() {
    setUser({
      resetPasswordCode: "",
      resetEmail: "",
      password: "",
      confirmPassword: "",
    });
    dispatch(ClearUpdatePassword());
  }

  function modalProps() {
    let data = "";
    if (passwordResetSuccess) {
      data = {
        showHeader: true,
        header: "update.password:success.header",
        content1: "update.password:success.content1",
        isContent2: true,
        content2: "update.password:success.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "update.password:success.primary.button",
        primaryButtonLink: "/signin",
        showSecondaryButton: false,
        secondaryButtonText: "update.password:success.secondary.button",
      };
    }

    if (passwordResetApiError) {
      data = {
        showHeader: true,
        header: "update.password:failure.header",
        content1: "update.password:failure.content1",
        isContent2: false,
        content2: "",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "update.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "update.password:failure.secondary.button",
      };
    }

    if (passwordResetFail) {
      data = {
        showHeader: true,
        header: "update.password:failure.update.header",
        content1: "update.password:failure.update.content1",
        isContent2: true,
        content2: "update.password:failure.update.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "update.password:failure.primary.button",
        primaryButtonLink: "/signin",
        secondaryButtonText: "update.password:failure.secondary.button",
      };
    }
    return data;
  }

  function closeModal() {
    dispatch(ClearUpdatePassword());
  }

  function isAuthorised() {
    let updatePasswordParams = JSON.parse(
      '{"' +
        location.search
          .split("?")[1]
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}',
      function (key, value) {
        return key === "" ? value : decodeURIComponent(value);
      }
    );
    if (updatePasswordParams?.updatePassword) {
      return false;
    }

    return localStorage.getItem(ValueConstants.STRING_AUTH);
  }

  function showWIPModal() {
    setShowModal(true);
    dispatch(ClearUpdatePassword());
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    setShowModal(false);
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
    <div>
      <PageContainer className="page-container">
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("update.password:header.label")}
          </PageHeader>
          <PageSubHeader>{t("update.password:message.label")}</PageSubHeader>
          <FormContainer>
            <Form name="form" onSubmit={handleSubmit} className="mt-3">
              <Form.Group>
                <Row>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>
                      {t("update.password:password.label")}
                    </Form.Label>
                    <Form.Control
                      placeholder={t("placeholder:new.password")}
                      autoComplete="new-password"
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className={
                        "form-control " +
                        ((submitted && !user.password) ||
                        (submitted &&
                          user.password &&
                          !pwdRegex.test(user.password))
                          ? " is-invalid"
                          : "")
                      }
                    />

                    {submitted && !user.password && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:password.required")}
                      </Form.Control.Feedback>
                    )}
                    {submitted &&
                      user.password &&
                      !pwdRegex.test(user.password) && (
                        <Form.Control.Feedback type="invalid">
                          {t("error:password.invalid")}
                        </Form.Control.Feedback>
                      )}
                  </Col>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>
                      {t("update.password:confirm.password.label")}
                    </Form.Label>
                    <Form.Control
                      autoComplete="new-password"
                      placeholder={t("placeholder:confirm.password")}
                      type="password"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      className={
                        "form-control" +
                        ((submitted && !user.confirmPassword) ||
                        (submitted &&
                          user.confirmPassword &&
                          user.confirmPassword !== user.password)
                          ? " is-invalid"
                          : "")
                      }
                    />

                    {submitted && !user.confirmPassword && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:confirm.password.required")}
                      </Form.Control.Feedback>
                    )}
                    {submitted && user.confirmPassword && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:password.mismatch")}
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
                    <Link
                      to="/home"
                      onClick={resetState}
                      className="btn btn-block btn-secondary"
                    >
                      {t("button:cancel")}
                    </Link>
                  </Col>
                  <Col
                    xs={{ span: 12, order: "first" }}
                    md={{ span: 6, offset: 2, order: "last" }}
                  >
                    <button
                      onClick={onsubmit}
                      className="btn btn-block btn-primary"
                    >
                      {passwordResetting && (
                        <span className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t("button:update.password")}
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
          passwordResetSuccess || passwordResetFail || passwordResetApiError
        }
      />
      <WIPModal handleClose={handleModalClose} show={showModal} centered />
    </div>
  );
}

export default UpdatePasswordPage;
