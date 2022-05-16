import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useTranslation } from "react-i18next";

import "./signin.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import InfoModal from "../modal/info-modal/info-modal";
import UserActions from "../../store/actions/user-actions";
import "./signin.css";
import ValueConstants from "../../constants/rest/value-constants";
import WIPModal from "../work-in-progress/work-in-progress-modal";
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
 *user Sign in page
 */

function SigninPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    username: "",
    password: "",
    clear_cache: false,
  });

  const { signingIn, signinFail, errorCode } = useSelector(
    (state) => state.AuthReducer
  );

  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    if (user.password && user.username && emailRegex.test(user.username)) {
      dispatch(
        UserActions.signin(user.username, user.password, user.clear_cache)
      );
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
    //[name]:value =>[username] [password]
    // console.log("user state>>>>", user);
    // console.log("name>>>", [name]);
    // console.log("value>>>", value);
  }

  function modalProps() {
    let data = "";
    if (signinFail) {
      data = {
        showHeader: true,
        header: "signin.modal:failure.header",
        content1: `signin.modal:failure.content1:${errorCode}`,
        isContent2: false,
        showButtonMessage: false,
        showPrimaryButton: false,
        showSecondaryButton: true,
        secondaryButtonText: "signin.modal:failure.secondary.button",
      };
    }
    return data;
  }

  function closeModal() {
    dispatch(UserActions.clearSignin());
  }

  function showWIPModal() {
    setShowModal(true);
    dispatch(UserActions.clearSignin());
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    setShowModal(false);
    dispatch(UserActions.clearSignin());
  }

  useEffect(() => {
    window.addEventListener("popstate", onBackKeyDown);
    //return () => window.removeEventListener("popstate", onBackKeyDown);
  }, []);

  function handleModalClose() {
    setShowModal(false);
  }

  function isAuthorised() {
    return localStorage.getItem(ValueConstants.STRING_AUTH);
  }

  return isAuthorised() ? (
    <Redirect to={MENU_ITEMS.COLLECTIONS} />
  ) : (
    <>
      <PageContainer className="page-container">
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("signin:header.label")}
          </PageHeader>
          <PageSubHeader>{t("signin:message.label")}</PageSubHeader>

          <FormContainer>
            <Form name="form" onSubmit={handleSubmit} className="mt-3">
              <Form.Group>
                <Row>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("signin:email.label")}</Form.Label>
                    <Form.Control
                      placeholder={t("placeholder:email")}
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      className={
                        "form-control" +
                        ((submitted && !user.username) ||
                        (submitted && !emailRegex.test(user.username))
                          ? " is-invalid"
                          : "")
                      }
                    />
                    {submitted && !user.username && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:email.required")}
                      </Form.Control.Feedback>
                    )}
                    {submitted &&
                      user.username &&
                      !emailRegex.test(user.username) && (
                        <Form.Control.Feedback type="invalid">
                          {t("error:email.pattern")}
                        </Form.Control.Feedback>
                      )}
                  </Col>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("password.label")}</Form.Label>
                    <Form.Label
                      //   size="lg"
                      className="text-danger float-right"
                    >
                      <TextLink primary={`true`} underline={`true`} to="/reset">
                        {t("signin:reset.password.message")}
                      </TextLink>
                    </Form.Label>
                    <Form.Control
                      placeholder={t("placeholder:password")}
                      autoComplete="password"
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className={
                        "form-control" +
                        (submitted && !user.password ? " is-invalid" : "")
                      }
                    />
                    {submitted && !user.password && (
                      <Form.Control.Feedback type="invalid">
                        {t("error:password.required")}
                      </Form.Control.Feedback>
                    )}
                  </Col>

                  {/* please do not remove */}
                  {/* <Col xs={{ span: 12 }} className="mt-2">
                    <Form.Label>
                      <Form.Check
                        name="clear_cache"
                        checked={user.clear_cache}
                        onChange={handleToggle}
                        aria-label="shared-computer"
                        className="customCheckbox"
                        inline
                      />
                      {t("signin:shared.computer.message")}
                    </Form.Label>
                  </Col> */}
                  {/* please do not remove */}
                </Row>
              </Form.Group>

              <Form.Group className="mt-5">
                <Row>
                  <Col
                    xs={{ span: 12 }}
                    md={{ span: 4 }}
                    className="mt-4 mt-md-0"
                  >
                    <Link to="/" className="btn btn-block btn-secondary">
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
                      {signingIn && (
                        <span className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t("button:signin")}
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
        showModal={signinFail}
      />
      <WIPModal handleClose={handleModalClose} show={showModal} centered />
    </>
  );
}

export default SigninPage;
