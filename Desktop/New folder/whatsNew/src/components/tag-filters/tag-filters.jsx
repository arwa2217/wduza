import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "../shared/styles/mainframe.style";

const tagOptions = (t) => {
  return [
    {
      key: "decision",
      text: t("decision"),
      value: t("decision"),
    },
    {
      key: "question",
      text: t("question"),
      value: t("question"),
    },
    {
      key: "follow-up",
      text: t("follow-up"),
      value: t("follow-up"),
    },
    {
      key: "important",
      text: t("important"),
      value: t("important"),
    },
  ];
};

const TagFilters = (props) => {
  const activeFilter = useSelector((state) => state.tagReducer.activeTag);
  const [selectedValue, setSelectedValue] = useState(activeFilter);
  const buttonBackgroundColorNormal = "tags__color__white";
  const buttonBackgroundColorHovered = "tags__background_green";
  const textColorNormal = "tags__color__grey";
  const textColorHovered = "tags__color__white";
  const borderColorNormal = "post__tags__border__grey";
  const borderColorHovered = "tags__background_green";
  const { t } = useTranslation();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="d-flex justify-content-between">
      {selectedValue === "All" || selectedValue === "" ? (
        <h5 className="mb-0">{t("all.tags")}</h5>
      ) : (
        <Button
          size="small"
          strong
          rounded
          backgroundColor={buttonBackgroundColorHovered}
          textColor={textColorHovered}
          hoverBackgroundColor={buttonBackgroundColorHovered}
          hoverTextColor={textColorHovered}
          borderColor={textColorHovered}
          hoverBorderColor={textColorHovered}
          className="d-flex align-items-center m-0 tags-filter-position"
        >
          {t(selectedValue.toLowerCase())}
          <span
            style={{
              fontSize: "19px",
              lineHeight: "11px",
              fontWeight: "normal",
            }}
            onClick={() => {
              props.handleClick(selectedValue);
              setSelectedValue("All");
            }}
            class="pl-2"
          >
            &times;
          </span>
        </Button>
      )}

      <a
        className="filter__icon"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        href
      >
        {children}
      </a>
    </div>
  ));

  return (
    <div className="post-tag-menu post-tag-menu-filter">
      <Dropdown>
        <Dropdown.Toggle
          menuAlign="right"
          as={CustomToggle}
          id="dropdown-button-drop-left"
        ></Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-menu bg-white"
        >
          <Dropdown.Header className="menu-header">
            {t("click.to.filter.by.tag")}
          </Dropdown.Header>
          <div className="dropdown-content">
            {tagOptions(t).map((option, index) => (
              <Button
                key={`tag-filter-button-${index}`}
                size="small"
                style={
                  index === 0
                    ? { margin: "0 5px 5px 0" }
                    : index === 1
                    ? { margin: "0 0 5px" }
                    : index === 2
                    ? { margin: "0 5px 0 0" }
                    : { margin: 0 }
                }
                strong
                rounded
                bordered
                value={option.value}
                onClick={() => {
                  props.handleClick(option.key);
                  if (selectedValue === option.key) {
                    setSelectedValue("");
                  } else {
                    setSelectedValue(option.key);
                  }
                }}
                backgroundColor={
                  option.key === selectedValue
                    ? buttonBackgroundColorHovered
                    : buttonBackgroundColorNormal
                }
                textColor={
                  option.key === selectedValue
                    ? textColorHovered
                    : textColorNormal
                }
                borderColor={
                  option.key === selectedValue
                    ? borderColorHovered
                    : borderColorNormal
                }
                hoverBackgroundColor={buttonBackgroundColorHovered}
                hoverTextColor={textColorHovered}
                hoverBorderColor={borderColorHovered}
                className="tags-filter-position"
              >
                {option.value}
              </Button>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default TagFilters;
