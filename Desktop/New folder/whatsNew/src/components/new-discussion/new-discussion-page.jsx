import {
  PageHeading,
  DiscussionContainer,
  PageBody,
  Text,
  BulletList,
  PageFooter,
  TextLink,
} from "./new-discussion-style";
import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import WelcomeHeadTop from "../welcome/welcome-head-top";
import { Button } from "../shared/styles/mainframe.style";
import { useState } from "react";
import ModalTypes from "../../constants/modal/modal-type";
import ModalActions from "../../store/actions/modal-actions";

function NewDiscussionPage(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [advanceControl, setAdvanceControl] = useState(false);
  const white = "white";
  const monolyGreen = "monoly__green";

  const monolySecurityItem = [
    "secure.connection",
    "secure.file.exchange",
    "permission",
  ];

  const agreementListItem = ["retain.tamper.proof", "retain.the.right"];

  const GetMonolySecurityItems = () => {
    return monolySecurityItem.map((key, index) => (
      <li key={`security-li-${index}`}>
        {<Text weight="700">{t(`discussion:security.monoly:${key}`)}</Text>}
      </li>
    ));
  };

  const GetAgreementListItems = () => {
    return agreementListItem.map((key, index) => (
      <li key={`agreement-li-${index}`}>
        {
          <Text key={`agreement-li-${index}`}>
            {t(`discussion:list.item:${key}`)}
          </Text>
        }
      </li>
    ));
  };
  function onCheckedChange(isEnabled) {
    setAdvanceControl(isEnabled);
  }
  function handlePrivacyClick() {}

  function handleCreateChannel(e) {
    document.documentElement.style.setProperty("--post-height", "154px");
    e.preventDefault();
    e.stopPropagation();

    const channel = {};
    channel["channel_id"] = "";
    channel.name = "";
    channel.showAdvanceControl = advanceControl;

    const channelType = "INVALID";
    const modalType = channel.showAdvanceControl
      ? ModalTypes.CREATE_DISCUSSION_ADVANCE_CTRL
      : ModalTypes.CREATE_CHANNEL;
    const modalProps = {
      show: true,
      closeButton: true,
      channel: channel,
      channelType: channelType,
    };
    dispatch(ModalActions.showModal(modalType, modalProps));
  }

  return (
    <DiscussionContainer>
      <div className="channel-head-top">
        <WelcomeHeadTop />
      </div>
      <PageBody paddingLeft="5%">
        <PageHeading>{t("discussion:new.discussion")}</PageHeading>
        <Text style={{ maxWidth: "380px", lineHeight: "1.5" }}>
          {t("discussion:new.discussion.page:page.heading")}
        </Text>
        <Text
          style={{
            lineHeight: "1.2",
            paddingTop: "40px",
            fontSize: "10px",
            letterSpacing: "1.5px",
          }}
        >
          {t("discussion:new.discussion.page:monoly.security")}
        </Text>

        <BulletList style={{ lineHeight: "1.8" }}>
          {GetMonolySecurityItems()}
        </BulletList>
        <Button
          size="16px"
          square
          bordered={true}
          backgroundColor={white}
          textColor={monolyGreen}
          hoverBackgroundColor={monolyGreen}
          hoverTextColor={white}
          borderColor={monolyGreen}
          hoverBorderColor={monolyGreen}
          onClick={handleCreateChannel}
          className="ml-0"
        >
          {t("discussion:CREATE_DISCUSSION")}
        </Button>
        <div className="container-fluid mt-3 pl-0">
          <div className="row ml-0">
            <input
              type="checkbox"
              checked={advanceControl}
              onChange={(e) => onCheckedChange(e.target.checked)}
            />

            <Text paddingLeft="10px">
              {t("discussion:new.discussion.page:audit.requirement")}
            </Text>
          </div>
          {advanceControl && <BulletList>{GetAgreementListItems()}</BulletList>}
        </div>

        <PageFooter>
          <div className="container ml-0 pb-3 align-content-center">
            <div className="row">
              <Text paddingRight="5px">
                {t("discussion:new.discussion.page:monoly.privacy")}
              </Text>
              <TextLink
                primary={`true`}
                underline={`true`}
                onClick={handlePrivacyClick}
                to={{
                  pathname: "https://monolyhq.github.io/docs/privacy-policy/",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("discussion:new.discussion.page:privacy.policy")}
              </TextLink>
            </div>
          </div>
        </PageFooter>
      </PageBody>
    </DiscussionContainer>
  );
}

export default NewDiscussionPage;
