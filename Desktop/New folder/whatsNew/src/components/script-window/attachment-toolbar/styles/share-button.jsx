import styled from "styled-components";

export const ShareButton = styled.button`
  margin-left: 4px;
  margin-top: 40px;
  width: 133px;
  height: 40px;
  background-color: ${(props) => (props.disabled ? "#F1F6FC" : "#03BD5D")};
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: ${(props) => (props.disabled ? "#65656C" : "#ffffff")};
`;
