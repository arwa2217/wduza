import styled from "styled-components";
export const ProjectText = styled.h1`
  font-weight: 400;
  width:362px;
  font-size: 40px;
  line-height: 100%;
  color: ${(props) => props.theme.colors.dark__grey};
  margin: 100px 0px 0px 66px;
`;
export const Text = styled.h4`
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
  font-size: 16px;
  line-height: 100%;
  color: ${props => props.theme.colors.dark__grey};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "0px")};
  margin-bottom: ${(props) =>
    props.marginBottom ? props.marginBottom : "0px"};
  margin-left: ${(props) =>
    props.marginLeft ? props.marginLeft : "0px"};
  margin-right: ${(props) =>
    props.marginRight ? props.marginRight : "0px"};
`;
