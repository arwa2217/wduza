import styled from "styled-components";

export const DiscussionName = styled.h1`
  font-size: 18px;
  color: #555555;
  margin: 0;
  line-height: 1.1;
  white-space: nowrap;
  font-weight: 400;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DiscussionDescription = styled.h1`
  font-size: 12px;
  color: #999999;
  margin: 0;
  padding-top: 3px;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProjectName = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  line-height: 45px;
  margin-bottom: 0;
  padding-left: 5px;
`;

export const Button = styled.span`
  display: flex;
  font-size: 10px;
  font-weight: 100;
  background-color: ${(props) =>
    props.discussionType === "INTERNAL"
      ? "#C8C8C8"
      : props.discussionType === "EXTERNAL"
      ? "#CA4C70"
      : "#AECEBD"};
  color: #fff;
  padding: 0.375rem 0.75rem;
  border: none;
  cursor: pointer;
  line-height: 1.4;
  border-radius: 20px;
  border: 1px solid
    ${(props) =>
      props.discussionType === "INTERNAL"
        ? "#C8C8C8"
        : props.discussionType === "EXTERNAL"
        ? "#CA4C70"
        : "#AECEBD"};

  img {
    width: 1rem;
    height: 1rem;
    margin-right: 0.3125rem;
  }
`;

export const DiscussionActions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  flex: 1;
  width: 100%;
  .badge {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    padding: 0px;
    position: absolute;
    top: -1px;
    right: -8px;
  }
  .left-spacing {
    margin-left: 0px !important;
  }
`;
