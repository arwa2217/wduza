import styled from "styled-components";
import { Link } from "react-router-dom";

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 400;
  color: ${({ theme: { colors } }) => colors.grey__dark};
  margin: 0;
  display: inline-flex;
  align-items: center;
  line-height: 1;
`;

export const Text = styled.p`
  font-size: ${(props) => (props.size === "small" ? "10px" : "14px")};
  font-weight: ${(props) => (props.strong ? 700 : 400)};
  color: ${({ theme: { colors } }) => colors.grey__light};
  text-transform: ${(props) => (props.uppercase ? "uppercase" : "initial")};
`;

export const ButtonType = {
  primary: 1,
  secondary: 2,
};

export const Button = styled.button`
  background: none;
  border: none;
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
  padding-left: 30px;
  position: relative;
  svg.check-icon {
    position: absolute;
    left: 0;
    top: 0px;
  }
  &:hover {
    color: rgba(0, 0, 0, 0.5);
  }
  &.active-tag {
    color: #00A95B;
    &:hover {
      color: #00A95B;
    }
  }
  
`;

export const ChannelType = styled(Button)`
  margin: 5px;
`;

export const Icon = styled.img`
  width: ${(props) => (props.width ? `${props.width}px` : "24px")};
  height: ${(props) => (props.width ? `${props.width}px` : "24px")};
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
`;

export const TextLink = styled(Link)`
  font-size: ${(props) =>
    props.tiny ? "10px" : props.small ? "12px" : "14px"};
  color: ${(props) =>
    props.primary
      ? props.theme.colors.primary
      : props.default
      ? props.theme.colors.default
      : props.theme.colors.grey__dark};
  font-weight: ${(props) => (props.strong ? 700 : 400)};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
`;
