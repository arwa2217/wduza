import styled from "styled-components";

export const ChannelDetailsDescription = styled.h1`
  display: inline-block;
  font-size: 12px;
  font-weight: 100;
  font-family: "Roboto", sans-serif;
  color: #999999;
  cursor: pointer;
  margin: 0;
  padding-top: 3px;

  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  max-width: calc(95%);
`;

export const Summary = styled.h1`
  font-size: 18px;
  color: #555555;
  cursor: pointer;
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
  font-weight: 400;
  line-height: 1.1;
`;
