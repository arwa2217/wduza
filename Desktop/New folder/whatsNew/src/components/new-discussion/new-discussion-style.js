import { Link } from "react-router-dom";
import styled from "styled-components";

export const DiscussionContainer = styled.div`
  width: 100%;
  height: 100vh;
  margin: 0px;
  background-color: #2c2c2c;

  .custom-width {
    max-width: 85%;
  }
`;

export const PageBody = styled.div`
  height: calc(100vh - 60px);
  //margin: 0px 10px 10px 0px;
  //padding-left: 50px;
  padding-right: ${(props) =>
    props.paddingRight ? props.paddingRight : "0px"};
  //border-radius: 8px;
  background: #ffffff;
  position: relative;
  overflow-y: auto;
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : 0)};

  .custom-margin {
    margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
  }
`;

export const PageHeading = styled.h1`
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "500px")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "40px")};
  line-height: 100%;
  color: #19191a;
  padding-top: 60px;
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "700")};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)};
`;

export const Text = styled.h4`
  // font-family: "Noto Sans";
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "14px")};
  line-height: 100%;
  padding-left: ${(props) => (props.paddingLeft ? props.paddingLeft : "0px")};
  padding-right: ${(props) =>
    props.paddingRight ? props.paddingRight : "0px"};
  padding-top: ${(props) => (props.paddingTop ? props.paddingTop : "0px")};
  padding-bottom: ${(props) =>
    props.paddingBottom ? props.paddingBottom : "0px"};
  color: #3e3f41;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "0px")};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : "0px"};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : "0px")};
  margin-right: ${(props) => (props.marginRight ? props.marginRight : "0px")};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
  letter-spacing: ${(props) =>
    props.letterSpacing ? props.letterSpacing : "initial"};
`;

export const TextLink = styled(Link)`
  font-size: ${(props) =>
    props.tiny ? "10px" : props.small ? "12px" : "14px"};
  color: ${(props) =>
    props.primary ? props.theme.colors.primary : props.theme.colors.grey__dark};
  font-weight: ${(props) => (props.strong ? 700 : 400)};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
  line-height: 100%;
`;

export const BulletList = styled.ul`
  margin: 0;
  padding: 0;
  padding-left: 10px;
  padding-top: 20px;
  padding-bottom: 50px;
`;
export const PageFooter = styled.footer`
  position: absolute;
  left: 50px;
  bottom: 5px;
  right: 0;
`;

export const Terms = styled.span`
  display: inline-block;
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "100%")};
  font-size: 18px;
  transform: translateY(15%);
  color: #00000099;
`;
