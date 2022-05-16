import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const CustomButton = styled(Link)`
  max-width: 300px;
  font-size: 1.2857rem;
  font-weight: 400;

  ${(props) =>
    props.primary &&
    css`
      background-color: ${props.theme.colors.primary};
      color: ${props.theme.colors.white};
      border: 1px solid ${props.theme.colors.primary};
    `}

  ${(props) =>
    props.outline &&
    css`
      background-color: ${props.theme.colors.white};
      color: ${props.theme.colors.primary};
      border: 1px solid ${props.theme.colors.primary};
    `}
`;
