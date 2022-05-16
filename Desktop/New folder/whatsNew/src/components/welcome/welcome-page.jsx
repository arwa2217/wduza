import { useTranslation } from "react-i18next";
import React from "react";
// import { ProjectText, Text } from "./welcome-style";
// import { PageContainer } from "../shared/styles/onboarding.style";
import UserType from "../../constants/user/user-type";
import { useSelector } from "react-redux";
import WelcomeBg from "../../assets/landing-project-bg.svg";
import styled from "styled-components";
import WelcomeHeadTop from "./welcome-head-top";

const WelcomeImg = styled.img`
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
`;

const ChannelContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0px;
  background-color: #2c2c2c;
`;

const ChannelBody = styled.div`
  height: calc(100vh - 60px);
  //margin: 0 10px 10px 0;
  background: #ffffff;
  position: relative;
  width: 100%;
`;
export const ProjectText = styled.h1`
  font-weight: 100;
  max-width: 500px;
  font-size: 40px;
  line-height: 1.2;
  color: #2c2c2c;
  margin: 0;
  padding: 100px 50px 0 50px;
`;
export const Text = styled.h4`
  font-size: 16px;
  line-height: 1.7;
  color: #65656c;
  padding: 100px 50px 0 50px;
  margin: 0;
  font-weight: 100;
`;

function WelcomePage(props) {
  const { t } = useTranslation();
  const user = useSelector((state) => state.AuthReducer.user);
  const companyName = useSelector(
    (state) => state.AuthReducer.user.companyName
  );

  return (
    <ChannelContainer>
      <div className="channel-head-top">
        <WelcomeHeadTop />
      </div>
      <ChannelBody>
        <WelcomeImg src={WelcomeBg} />
        <ProjectText>
          {t("welcome:welcome.project")}
          <br />
          {`${companyName}`}
        </ProjectText>
        <Text>
          {user.userType !== UserType.GUEST
            ? t("welcome:create.new.discussion")
            : "Select the discussion from Left panel to join"}
          <br />
          {user.userType !== UserType.GUEST
            ? t("welcome:name.discussion.and.invite")
            : "Creating new discussion or inviting new member is not allowed for Guest user"}
        </Text>
      </ChannelBody>
    </ChannelContainer>
  );
}

export default WelcomePage;
