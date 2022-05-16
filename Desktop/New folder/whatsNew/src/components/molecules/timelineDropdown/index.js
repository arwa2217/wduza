import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
const TimelineDropdownStyle = styled.div`
  position: relative;
  width: auto;
  display: inline-block;
  margin: 0 auto;
  button {
    font-family: "Roboto", sans-serif !important;
    width: 100%;
    line-height: 18px;
    outline: none;
    background-color: #ffffff;
    border: none;
    box-shadow: none;
    cursor: default;
    font-size: 12px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    padding: 0;
    :focus {
      box-shadow: none;
    }
  }
  ul.active {
    opacity: 1;
    margin-top: 8px;
    transition: all 500ms;
    li {
      display: block;
    }
  }
  ul {
    opacity: 0;
    box-shadow: 0 2px 6px -2px #908a8a;
    border-radius: 20px;
    background: #f6f7f7;
    color: black;
    list-style: none;
    margin: 20px 0;
    padding: 5px 0;
    position: absolute;
    width: auto;
    right: 10px;
    z-index: 1;
    li {
      display: none;
      padding: 5px 20px;
      cursor: pointer;
      pointer-event: auto;
      text-shadow: 0px 0px 1px grey;
      :first-child {
        color: lightgray;
        pointer-event: none;
        text-shadow: none;
      }
      &.sub-nav {
        border-top: 1px solid lightgrey;
      }
      i {
        float: right;
      }
    }
  }
`;
export default ({ options, currentOption, navigateTo }) => {
  const ref = useRef(null);
  const [visible, setVisibility] = useState(false);
  const { t } = useTranslation();
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setVisibility(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });
  return (
    <TimelineDropdownStyle ref={ref}>
      <button
      // onClick={() => setVisibility(!visible)}
      >
        {t(`timeline.header`, {
          time: currentOption,
        })}
      </button>
      <ul className={visible ? "active" : ""}>
        <li>{t("jump.to")}</li>
        {options.map(({ text, subNav }, index) => {
          return (
            <li
              key={text + index}
              onClick={() => {
                navigateTo(text);
                setVisibility(!visible);
              }}
              className={subNav ? "sub-nav" : ""}
            >
              {text}
              {subNav && <Icon name="chevron right" />}
            </li>
          );
        })}
      </ul>
    </TimelineDropdownStyle>
  );
};
