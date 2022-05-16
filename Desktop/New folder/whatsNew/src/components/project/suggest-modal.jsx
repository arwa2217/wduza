import React from "react";
import styled, { css } from "styled-components";
import SVG from "react-inlinesvg";
import CircleIcon from "../../assets/icons/v2/ic_circle.svg";

const StyledContent = styled.div.attrs((props) => ({
  className: props.className,
}))`
  &.advanced-security-help-modal {
    display: none;
  }
  .suggest {
    position: absolute;
    padding: 16px 20px;
    ${(props) =>
      props.monolySecurity
        ? css`
            top: 14px;
            left: 0;
            width: 340px;
          `
        : css`
            top: 0;
            left: 16px;
            width: 400px;
          `}
    border: 1px solid #cccccc;
    box-sizing: border-box;
    border-radius: 4px;
    background: #ffff;
    z-index: 9;
    max-width: 400px;
    min-width: 340px;
    .content-block {
      display: flex;
      align-items: start;

      .circle {
        svg {
          margin: -3px 5px 0 0;
        }
      }
      .content {
        color: rgba(0, 0, 0, 0.7);
        font-size: 13px;
      }
    }
    .content-block:nth-child(n + 2) {
      padding-top: 6px;
    }
    .title {
      color: rgba(0, 0, 0, 0.9);
      font-weight: bold;
      font-size: 12px;
    }
  }
`;
const SuggestModal = (props) => {
  const { modalName, title, detailsList, monolySecurity } = props;
  return (
    <StyledContent className={modalName} monolySecurity={monolySecurity}>
      <div className="suggest">
        {title && <div className="title">{title}</div>}
        {detailsList.length > 0 &&
          detailsList.map((item, index) => (
            <div className="content-block" key={index}>
              <div className="circle">
                <SVG
                  src={CircleIcon}
                  alt="circle-icon"
                  className="circle-icon"
                />
              </div>
              <p className="content">{item}</p>
            </div>
          ))}
      </div>
    </StyledContent>
  );
};

export default SuggestModal;
