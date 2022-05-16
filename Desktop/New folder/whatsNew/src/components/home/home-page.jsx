import React, { PureComponent } from "react";
import { Link, Redirect } from "react-router-dom";
import { withTranslation } from "react-i18next";
import core from "core";
import Productive from "../../assets/icons/productive.svg";
import Trustworthy from "../../assets/icons/trustworthy.svg";
import Chatting from "../../assets/icons/chatting.svg";
import ShieldOk from "../../assets/icons/shield-ok.svg";
import BI from "../../assets/icons/BI.svg";
import {
  PageContainer,
  PageWrapper,
  FeatureContainer,
  PageHeader,
  PageFooter,
  PageSubHeader,
  Paragraph,
  TextLink,
  Icon,
  Heading,
  ContactUs,
  HomeFeatures,
} from "@styles/onboarding.style.js";

import "./home.css";
import { getAuthToken } from "../../utilities/app-preference";
import { MENU_ITEMS } from "../../constants/menu-items";

/*
 *User is redirected to this page in case of incorrect route or if not signed in
 */
class HomePage extends PureComponent {
  isAuthorised() {
    return getAuthToken() !== null;
  }

  render() {
    const { t } = this.props;

    return this.isAuthorised() ? (
      <Redirect to={MENU_ITEMS.COLLECTIONS} />
    ) : (
      <PageContainer className="container-fluid page-container">
        <ContactUs
          target="_blank"
          to={{
            pathname: "https://monolyhq.github.io/docs/contact/",
          }}
          weight={700}
          primary={`true`}
        >
          <Icon src={Chatting} /> {t("home:contact")}
        </ContactUs>
        <PageWrapper>
          <PageHeader>
            <Icon src={BI} size="medium" /> {t("monoly.label")}
          </PageHeader>
          <PageSubHeader>{t("home.message.label")}</PageSubHeader>
          <FeatureContainer>
            <HomeFeatures className="row onboarding-features">
              <div className="col-md-6 text-center pr-md-5">
                <div className="feature-icon">
                  <Icon src={Trustworthy} />
                </div>
                <div className="feature-info">
                  <Heading>{t("home:feature:trustworthy.title")}</Heading>
                  <Paragraph>{t("home:feature:trustworthy.desc")}</Paragraph>
                  <TextLink
                    primary={`true`}
                    underline={`true`}
                    target="_blank"
                    to={{
                      pathname:
                        "https://monolyhq.github.io/docs/most-trustworthy/",
                    }}
                  >
                    {t("home:feature:linkText")}
                  </TextLink>
                </div>
              </div>
              <div className="col-md-6 text-center pl-md-5">
                <div className="feature-icon">
                  <Icon src={Productive} />
                </div>
                <div className="feature-info">
                  <Heading>{t("home:feature:productive.title")}</Heading>
                  <Paragraph>{t("home:feature:productive.desc")}</Paragraph>
                  <TextLink
                    primary={`true`}
                    underline={`true`}
                    target="_blank"
                    to={{
                      pathname:
                        "https://monolyhq.github.io/docs/truly-productive/",
                    }}
                  >
                    {t("home:feature:linkText")}
                  </TextLink>
                </div>
              </div>
            </HomeFeatures>

            <div className="row mt-5">
              <div className="col-12 mt-3 text-center">
                <a
                  href={core.signupUrl}
                  className="btn btn-block btn-outline-primary customButton"
                >
                  {t("signup:label")}
                </a>
              </div>
              <div className="col-12 mt-3 text-center">
                <Link
                  to="signin"
                  className="btn btn-block btn-primary customButton"
                  primary={`false`}
                  underline={`false`}
                >
                  {t("signin:label")}
                </Link>
              </div>
            </div>
          </FeatureContainer>
        </PageWrapper>
        <PageFooter>
          <Paragraph default>
            <Icon src={ShieldOk} size="medium" />
            {t("footer.data.message1")}
            <strong>{t("footer.data.message2")}</strong>
          </Paragraph>
        </PageFooter>
      </PageContainer>
    );
  }
}

export default withTranslation()(HomePage);
