import styled from "styled-components";

export const ShareButton = styled.button`
  margin-left: 10px;
  margin-top: 30px;
  width: 130px;
  height: 40px;
  background-color: ${(props) => (props.disabled ? "#F1F6FC" : "#03bd5d")};
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: ${(props) => (props.disabled ? "#65656C" : "#ffffff")};
  border-radius: 2px;
`;
