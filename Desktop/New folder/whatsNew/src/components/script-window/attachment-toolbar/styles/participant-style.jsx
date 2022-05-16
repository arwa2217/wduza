import styled from "styled-components";

export const StyledDiv = styled.div`
  max-height: 3.125rem;
  padding-left: 2.5rem;
  min-width: 41.125rem;
  max-width: 41.125rem;
  overflow-x: hidden;

  &:hover {
    background: #f1f6fc;
  }

  .remove {
    display: none;
  }

  &:hover .remove {
    float: right;
    right: 0;
    margin-top: 0.875rem;
    margin-right: 2.8125rem;
    display: inline-block;
  }
`;

export const StyledImg = styled.img`
  border-radius: 6.25rem;
  flex: none;
  order: 0;
  align-self: center;
  flex-grow: 0;
  width: 1.875rem;
  height: 1.875rem;
  margin-top: 0.625rem;
  margin-bottom: 0.625rem;
`;

export const Name = styled.span`
  font-weight: 400;
  font-size: 1rem;
  line-height: 100%;
  color: #252534;
  margin: 0.625rem 0.625rem 0.625rem 1.25rem;
`;

export const Details = styled.span`
  font-style: normal;
  font-weight: 100;
  font-size: 1rem;
  line-height: 100%;
  color: #95979d;
  margin: 0.625rem 0rem;
`;
