import styled from "styled-components";

export const DiscussionName = styled.h1`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  color: ${({ theme: { colors } }) => colors.grey__dark};
  cursor: pointer;
  margin: 0;
  //   line-height: 1

  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
`;

export const DiscussionDescription = styled.h1`
  display: flex;
  align-items: left;
  font-size: 12px;
  font-weight: 100;
  font-family: "Roboto", sans-serif;
  color: #999999;
  cursor: pointer;
  margin: 0;
`;

export const ProjectName = styled.p`
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  line-height: 45px;
`;

export const Button = styled.span`
  display: flex;
  align-items: right;
  font-size: 10px;
  font-weight: 100;
  background-color: #ca4c70;
  color: #fff;
  padding: 0.375rem 0.75rem;
  border: none;
  cursor: pointer;
  line-height: 1.4;
  border-radius: 25px;
  border: 1px solid #ca4c70;

  img {
    width: 1rem;
    height: 1rem;
    margin-right: 0.3125rem;
  }
`;

export const DiscussionActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  flex: 1;
  width: 100%;

  img {
    // padding: .5rem;
    cursor: pointer;
  }
`;

// export const Icon = styled.img`
//   width: 1.5rem;
//   height: 1.5rem;
// `;
