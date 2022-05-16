import styled from "styled-components";

export const P = styled.p`
  line-height: 1;
  &.disabled:hover {
    cursor: not-allowed;
  }
`;
export const Image = styled.img`
  &:disabled:hover {
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  &:disabled:hover {
    cursor: not-allowed;
  }
`;
