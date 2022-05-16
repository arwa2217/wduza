import React, { useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserActions from "../../../store/actions/user-actions";
import { Paragraph, TextLink, Heading } from "@styles/onboarding.style.js";

import "./infomodal.css";

function InfoModal(props) {
  const { t } = useTranslation();
  const submit = useSelector((state) => state.SignupReducer.submit);
  const dispatch = useDispatch();

  function resendEmail() {
    dispatch(UserActions.resendEmail(props.data.user));
  }

  function onBackKeyDown(e) {
    e.preventDefault();
    props.closeModal();
  }

  useEffect(() => {
    window.addEventListener("popstate", onBackKeyDown);
    //return () => window.removeEventListener("popstate", onBackKeyDown);
  }, []);

  return (
    <Modal
      open={props.showModal}
      basic
      dimmer="blurring"
      size="small"
      className="customModal text-center"
    >
      {props.data.showHeader ? (
        <Modal.Header>
          <Heading>{t(props.data.header)}</Heading>
        </Modal.Header>
      ) : (
        <Modal.Header></Modal.Header>
      )}
      <Modal.Content>
        <Paragraph className="mb-1">
          <Trans t={t} i18nKey={props.data.content1} />
          <strong>
            {props.data.user && props.data.user.email
              ? " " + props.data.user.email + "."
              : ""}
          </strong>
        </Paragraph>
        {props.data.isContent2 ? (
          <Paragraph className="mb-1">{t(props.data.content2)}</Paragraph>
        ) : (
          <Paragraph></Paragraph>
        )}
        {props.data.isContent3 ? (
          <Paragraph className="mb-1">{t(props.data.content3)}</Paragraph>
        ) : (
          <Paragraph></Paragraph>
        )}
      </Modal.Content>

      <Modal.Actions className="p-0">
        {props.data.showButtonMessage ? (
          <Row>
            <Col xs={{ span: 12 }} className="text-center mb-3">
              <TextLink
                primary={`true`}
                underline={`true`}
                onClick={resendEmail}
              >
                {t(props.data.buttonMessage)}
              </TextLink>
            </Col>
          </Row>
        ) : (
          ""
        )}
        {props.data.showPrimaryButton ? (
          <Row>
            <Col
              xs={{ span: 12 }}
              md={{ span: 8, offset: 2 }}
              className="mt-2 mt-md-0"
            >
              <Button
                hidden={props.data.showSecondaryButton === false}
                onClick={props.closeModal}
                variant="secondary"
                block
              >
                {t(props.data.secondaryButtonText)}
              </Button>
            </Col>
            <Col
              xs={{ span: 12, order: "first" }}
              md={{ span: 8, offset: 2, order: "last" }}
              className=" mt-2"
            >
              {props.data.primaryButtonLink ? (
                <Link
                  to={props.data.primaryButtonLink}
                  className="btn btn-block btn-primary"
                  onClick={props.closeModal}
                >
                  {t(props.data.primaryButtonText)}
                </Link>
              ) : (
                <Button onClick={resendEmail} variant="primary" block>
                  {submit && (
                    <span className="spinner-border spinner-border-sm mr-1" />
                  )}
                  {t(props.data.primaryButtonText)}
                </Button>
              )}
            </Col>
          </Row>
        ) : props.data.showSecondaryButton === false ? (
          ""
        ) : (
          <Row>
            <Col xs={{ span: 12 }} md={{ span: 6, offset: 3 }} className="mt-2">
              <Button
                onClick={props.closeModal}
                variant="secondary"
                block
                autoFocus
              >
                {t(props.data.secondaryButtonText)}
              </Button>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={{ span: 12 }} className="text-center mt-3 pt-3">
            <Paragraph>
              {t("label.continue_to_have_issue")}{" "}
              <TextLink
                primary={`true`}
                underline={`true`}
                target="_blank"
                to={{
                  pathname: "https://monolyhq.github.io/docs/contact/",
                }}
                // onClick={props.showWIPModal}
              >
                {t("label.contact_support")}
              </TextLink>
            </Paragraph>
          </Col>
        </Row>
      </Modal.Actions>
    </Modal>
  );
}

export default InfoModal;
