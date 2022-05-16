import styled from "styled-components";

export const CancelButton = styled.button`
  margin-top: 30px;
  width: 130px;
  height: 40px;
  background-color: ${(props) => props.theme.colors.default};
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;
  border-radius: 2px;
`;
