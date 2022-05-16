import styled from "styled-components";
import { Link } from "react-router-dom";

export const FlexContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  flex: 1;
`;
export const PageContainer = styled(FlexContainer)`
  min-height: 100vh;
  position: relative;
`;

export const PageWrapper = styled(FlexContainer)`
  max-width: 880px;
  margin: 145px auto 50px;
`;

export const FormContainer = styled(FlexContainer)`
  max-width: 400px;
  margin: 0 auto;
  width: 100%;

  .form-label {
    font-weight: 400;
    color: ${({ theme: { colors } }) => colors.grey__dark};
  }
`;

export const FeatureContainer = styled(FlexContainer)`
  max-width: 550px;
  margin: 0 auto;

  .feature-info {
    margin-top: 20px;
  }
`;

export const HomeFeatures = styled.div`
  display: flex;

  > div {
    margin-top: 66px;
  }

  > div:first-child {
    @media (min-width: 768px) {
      border-right: 1px solid #f2f2f2;
    }
  }

  .feature-icon > img {
    width: 40px;
    height: 40px;
  }
`;

export const PageHeader = styled.h1`
  font-size: 40px;
  margin-bottom: 8px;
  font-weight: 400;
  color: ${({ theme: { colors } }) => colors.grey__dark};
  position: relative;
  text-align: center;
  margin-left: -50px;

  @media (max-width: 767px) {
    font-size: 20px;
    margin-left: -34px;
  }

  > img {
    margin-top: -70px;

    @media (max-width: 767px) {
      width: 30px;
    }
  }
`;

export const PageSubHeader = styled.h6`
  font-size: 16px;
  font-weight: 100;
  text-align: center;
`;

export const PageFooter = styled.div`
  text-align: center;
  padding: 15px 15px 20px;

  > img {
    // margin-top: -4.5rem;
  }
`;

export const Icon = styled.img``;

// export const Icon = styled.img`
//   width: ${(props) =>
// 	props.size === "large"
// 	  ? `3.75rem`
// 	  : props.size === "medium"
// 	  ? "2.5rem"
// 	  : "1.25rem"};
//   height: ${(props) =>
// 	props.size === "large"
// 	  ? `3.75rem`
// 	  : props.size === "medium"
// 	  ? "2.5rem"
// 	  : "1.25rem"};
//   // width: ${(props) => (props.width ? `${props.width}px` : "1.25rem")};
//   // height: ${(props) => (props.width ? `${props.width}px` : "1.25rem")};
//   margin-right: 0.3125rem;
// `;

export const Heading = styled.h3`
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0 0 30px;
  color: ${({ theme: { colors } }) => colors.grey__dark};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")}; ;
`;
export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: ${(props) => (props.weight ? props.weight : 400)};
  color: ${(props) =>
    props.primary
      ? props.theme.colors.primary
      : props.default
      ? props.theme.colors.default
      : props.danger
      ? props.theme.colors.danger
      : props.theme.colors.grey__light};

  > img {
    margin-right: 10px;
  }
`;

export const TextLink = styled(Link)`
  font-size: 14px;
  color: ${(props) =>
    props.primary ? props.theme.colors.primary : props.theme.colors.grey__dark};
  font-weight: ${(props) => (props.weight ? props.weight : 400)};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")}; ;
`;

export const ContactUs = styled(TextLink)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 20px;
  top: 20px;

  > img {
    margin-right: 5px;
  }
`;
