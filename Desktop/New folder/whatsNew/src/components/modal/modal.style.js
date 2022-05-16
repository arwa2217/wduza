import styled from "styled-components";

export const StyledButton = styled.button`
  border-radius: 0.25rem;
  font-family: "Roboto", sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  flex: none;
  order: 0;
  align-self: right;
  padding: 0.625rem;
  color: ${(props) => (props.disabled ? "#000000" : "#2196f3")};
  background: ${(props) => (props.disabled ? "#e8e8e8" : "#e3f2fd")};
`;
