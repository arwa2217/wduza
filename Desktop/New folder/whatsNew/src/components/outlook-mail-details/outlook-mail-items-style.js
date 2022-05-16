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

  // &:hover{
  //   content:attr(data-text);
  //   overflow: visible;
  //   text-overflow: inherit;
  //   background: #fff;
  //   position: absolute;
  //   left:auto;
  //   top:auto;
  //   width: auto;
  //   max-width: calc(85%);
  //   border: 1px solid #eaebec;
  //   padding: 0 .5rem;
  //   box-shadow: 0 2px 4px 0 rgba(0,0,0,.28);
  //   white-space: normal;
  //   word-wrap: break-word;
  //   display:block;
  //   color:black;
  //   margin-top:-1.25rem;
  // }
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
