import styled from "styled-components";

export const BoxDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-left: 20px;
  margin-top: 0;
  margin-bottom: 15px;
  background: #ffffff;
  border: 0.0625rem solid #adbacd;
  box-sizing: border-box;
  width: 400px;
  height: 60px;
  border-radius: 2px;
`;

export const Image = styled.img`
  max-width: 30px;
  max-height: 30px;
  margin-left: 20px;
  margin-top: 12px;
  float: left;
`;
export const Details = styled.div`
  margin-left: 0.875rem;
  display: inline-block;
`;

export const Name = styled.span`
  margin-top: 0.75rem;
  font-size: 0.875rem;
  float: left;
  clear: left;
  color: #252534;
  width: 17.75rem;
  text-overflow: ellipsis;

  & p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

export const Size = styled.span`
  margin-bottom: 0.75rem;
  font-size: 0.625rem;
  float: left;
  clear: left;
  color: #95979d;
`;

export const Remove = styled.span`
  float: right;
  margin-left: 10px;
  margin-top: -17px;

  &:hover {
    cursor: pointer;
  }
`;
