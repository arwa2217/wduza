import styled from "styled-components";

export const UserSummaryDiv = styled.div`
  // padding: 0px 7px 0px 8px ;
`;

export const UserSummaryHomeDiv = styled.div`
  width: 100%;
  color: rgba(181, 181, 181, 1);
  padding: 8px 0 8px 20px;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  line-height: 1;

  &:hover {
    background: var(--black);
    color: var(--white);
  }
  &.active,
  &.active:hover {
    background: var(--primary) !important;
    color: var(--white);
  }
`;
