import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import UserActions from "../../store/actions/user-actions";
import { useTranslation } from "react-i18next";
import "./signup.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import { Checkbox } from "semantic-ui-react";

import InfoModal from "../modal/info-modal/info-modal";
import ValueConstants from "../../constants/rest/value-constants";
import WIPModal from "../work-in-progress/work-in-progress-modal";
import ShieldOk from "../../assets/icons/shield-ok.svg";
import BI from "../../assets/icons/BI.svg";
import sanitizeHtml from "sanitize-html";

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
function FinishSignupPage() {
  const { t } = useTranslation();
  // const nameRegex = new RegExp("^(([A-Za-z]+)(\\s[A-Za-z]+)*)$", "gm");
  const nameRegex =
    /^[\u0000-\u0019\u0021-\uffff]+((?: {0,1}[\u0000-\u0019\u0021-\uffff]+)+)*$/;
  const pwdRegex = new RegExp(
    "^((?=.*[\\d])(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[A-Z])(?=.*[^\\w\\d\\s])|(?=.*[\\d])(?=.*[a-z])(?=.*[^\\w\\d\\s])).{8,80}$",
    "gm"
  );

  const [user, setUser] = useState({
    uid: useSelector((state) => state.SignupReducer.uid),
    email: useSelector((state) => state.SignupReducer.email),
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const nameCheck = useSelector((state) => state.UserReducer.nameCheck);
  const apiError = useSelector((state) => state.UserReducer.apiError);
  const registering = useSelector((state) => state.SignupReducer.registering);
  const registered = useSelector((state) => state.SignupReducer.registered);
  const registerFail = useSelector((state) => state.SignupReducer.registerFail);
  const requiredUserInfo = useSelector(
    (state) => state.ActionRequiredReducer.requiredUserInfo
  );

  // const requiredUserInfo = useSelector((state) => state.ActionRequiredReducer.requiredUserInfo);

  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [terms_conditions, setTerms_conditions] = useState(false);
  const dispatch = useDispatch();
  const maxChars = 64;
  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    user.piterms = terms_conditions;
    if (
      user.password &&
      user.piterms &&
      user.confirmPassword &&
      user.password === user.confirmPassword &&
      pwdRegex.test(user.password) &&
      user.displayName &&
      nameRegex.test(user.displayName.toString()) &&
      user.email &&
      nameCheck
    ) {
      dispatch(UserActions.register(user, nameCheck));
    }
  }

  const handleChangeChk = (event, data) => {
    setTerms_conditions(data.checked);
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function handleDisplayNameChange(e) {
    let { value } = e.target;
    setUser((user) => ({ ...user, displayName: value }));
    if (value && nameRegex.test(value.toString())) {
      dispatch(UserActions.availabilityCheck(value));
    }
  }

  let text = requiredUserInfo
    ? requiredUserInfo.content
        .replace(/&nbsp;/g, " ")
        .trim()
        .replace(/<h2/g, "<h4")
        .trim()
        .replace(/h2>/g, "h4>")
        .trim()
    : "";
  const clean = sanitizeHtml(text, {
    allowedTags: ["b", "br", "i", "strong", "a", "li", "ul", "ol", "h2", "p"],
    allowedAttributes: {
      a: ["href", "target"],
    },
  });
  function resetState() {
    setUser({
      uid: "",
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    });
    dispatch(UserActions.resetAvailabilityCheck());
    dispatch(UserActions.resetRegistration());
  }

  function modalProps() {
    let data = "";
    if (registered) {
      data = {
        showHeader: true,
        header: "register:success.header",
        content1: "register:success.content1",
        isContent2: true,
        content2: "register:success.content2",
        showButtonMessage: false,
        showPrimaryButton: true,
        primaryButtonText: "register:success.primary.button",
        primaryButtonLink: "/signin",
        showSecondaryButton: false,
        secondaryButtonText: "register:success.secondary.button",
      };
    }

    if (apiError) {
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

    if (registerFail) {
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
    return data;
  }

  function closeModal() {
    dispatch(UserActions.resetRegistration());
    setUser((user) => ({ ...user, displayName: "" }));
  }

  function isAuthorised() {
    return localStorage.getItem(ValueConstants.STRING_AUTH);
  }

  function showWIPModal() {
    setShowModal(true);
    dispatch(UserActions.resetRegistration());
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    setShowModal(false);
  }

  useEffect(() => {
    dispatch(UserActions.GetUserPersonalInfo());
    window.addEventListener("popstate", onBackKeyDown);
    //return () => window.removeEventListener("popstate", onBackKeyDown);
  }, []);

  function handleModalClose() {
    setShowModal(false);
  }

  const handleScreenNameClass = (screenName) => {
    let myClass = "";

    if (submitted) {
      if (user.displayName.length > 0) {
        if (!nameRegex.test(user.displayName.toString())) {
          myClass = "is-invalid";
        } else {
          if (nameCheck === true) {
            myClass = "is-valid";
          }
          if (nameCheck === false) {
            myClass = "is-invalid";
          }
        }
      } else {
        myClass = "is-invalid";
      }
    } else {
      if (user.displayName.length > 0) {
        if (!nameRegex.test(user.displayName.toString())) {
          myClass = "is-invalid";
        } else {
          if (nameCheck === true) {
            myClass = "is-valid";
          }
          if (nameCheck === false) {
            myClass = "is-invalid";
          }
        }
      }

      if (user.displayName.length > maxChars) {
        if (nameRegex.test(user.displayName.toString())) {
          myClass = "is-invalid";
        }
      }
    }

    return myClass;
  };

  const link = {
    className: terms_conditions
      ? "btn btn-block btn-primary"
      : "btn btn-block btn-secondary",
  };

  const renderFeedbackMessage = () => {
    let myFeedbackContent = "";

    if (submitted) {
      if (user.displayName.length > 0) {
        if (!nameRegex.test(user.displayName.toString())) {
          myFeedbackContent = (
            <Form.Control.Feedback type="invalid" className="position-absolute">
              {t("error:screen.name.invalid")}
            </Form.Control.Feedback>
          );
        } else {
          if (nameCheck === true) {
            myFeedbackContent = (
              <Form.Control.Feedback Feedback className="position-absolute">
                {t("availability.check.available")}
              </Form.Control.Feedback>
            );
          }
          if (nameCheck === false) {
            myFeedbackContent = (
              <Form.Control.Feedback
                type="invalid"
                className="position-absolute"
              >
                {t("availability.check.unavailable")}
              </Form.Control.Feedback>
            );
          }
        }
      } else {
        myFeedbackContent = (
          <Form.Control.Feedback type="invalid" className="position-absolute">
            {t("error:screen.name.required")}
          </Form.Control.Feedback>
        );
      }
    } else {
      if (user.displayName.length > 0) {
        if (!nameRegex.test(user.displayName.toString())) {
          myFeedbackContent = (
            <Form.Control.Feedback type="invalid">
              {t("error:screen.name.invalid")}
            </Form.Control.Feedback>
          );
        } else {
          if (nameCheck === true) {
            myFeedbackContent = (
              <Form.Control.Feedback Feedback className="position-absolute">
                {t("availability.check.available")}
              </Form.Control.Feedback>
            );
          }
          if (nameCheck === false) {
            myFeedbackContent = (
              <Form.Control.Feedback
                type="invalid"
                className="position-absolute"
              >
                {t("availability.check.unavailable")}
              </Form.Control.Feedback>
            );
          }
        }
      }
    }
    return myFeedbackContent;
  };

  return isAuthorised() ? (
    <Redirect to={MENU_ITEMS.COLLECTIONS} />
  ) : (
    <>
      <PageContainer className="page-container">
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("signup:header.label")}
          </PageHeader>
          <PageSubHeader>{t("signup:finish.signup.message")}</PageSubHeader>
          <FormContainer>
            <Form name="form" onSubmit={handleSubmit} className="mt-3">
              <Form.Group>
                <Row>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("password.label")}</Form.Label>
                    <Form.Control
                      placeholder={t("placeholder:choose.password")}
                      autoComplete="new-password"
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className={
                        "form-control" +
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
                    <Form.Label>{t("confirm.password.label")}</Form.Label>
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
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>{t("screen.name.label")}</Form.Label>
                    <Form.Control
                      id="display-name"
                      placeholder={t("placeholder:screen.name")}
                      type="text"
                      name="displayName"
                      value={user.displayName}
                      onChange={handleDisplayNameChange}
                      className={handleScreenNameClass(user.displayName)}
                    />
                    {user.displayName.length > maxChars && (
                      <div className="invalid-display-name">
                        {t("display.name.exceed")}
                      </div>
                    )}
                    {renderFeedbackMessage()}
                  </Col>
                  <Col xs={{ span: 12 }} className="mt-3 mt-md-5">
                    <Form.Label>
                      {t("screen.terms-conditions.label")}
                    </Form.Label>
                    <div className="terms-conditions">
                      {/* <h5>Terms and conditions to please check</h5> */}
                      <p
                        className="text-cond"
                        dangerouslySetInnerHTML={{ __html: clean }}
                      ></p>
                    </div>
                    <div className="terms-check">
                      <Checkbox
                        onClick={(evt, data) => handleChangeChk(evt, data)}
                        className={`form-check-input ${
                          terms_conditions ? "" : "is-invalid"
                        }`}
                        label={t("screen.terms-agree.label")}
                      />
                      {submitted && !terms_conditions && (
                        <Form.Control.Feedback
                          className="terms_error"
                          type="invalid"
                        >
                          {t("error:terms.required")}
                        </Form.Control.Feedback>
                      )}
                    </div>
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
                      to="/signup"
                      onClick={resetState}
                      className="btn btn-block btn-secondary"
                    >
                      {t("button:back")}
                    </Link>
                  </Col>
                  <Col
                    xs={{ span: 12, order: "first" }}
                    md={{ span: 8, order: "last" }}
                  >
                    <button onClick={onsubmit} className={link.className}>
                      {registering && (
                        <span className="spinner-border spinner-border-sm mr-1" />
                      )}
                      {t("button:finish.registration")}
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
        showModal={registered || registerFail || apiError}
      />
      <WIPModal handleClose={handleModalClose} show={showModal} centered />
    </>
  );
}

export default FinishSignupPage;
