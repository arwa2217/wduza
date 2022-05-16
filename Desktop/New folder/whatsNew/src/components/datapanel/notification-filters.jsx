import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Button, TextLink } from "../shared/styles/mainframe.style";

const notificationOptions = (t) => {
  return [
    {
      key: "channel",
      text: t("channel"),
      value: t("channel"),
    },
    {
      key: "mention",
      text: t("mention"),
      value: t("mention"),
    },
    {
      key: "reaction",
      text: t("reaction"),
      value: t("reaction"),
    },
  ];
};

const NotificationFilters = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.selectedFilter);
  const buttonBackgroundColorNormal = "tags__color__white";
  const buttonBackgroundColorHovered = "tags__background_green";
  const textColorNormal = "tags__color__grey";
  const textColorHovered = "tags__color__white";
  const borderColorNormal = "post__tags__border__grey";
  const borderColorHovered = "tags__background_green";
  const { t } = useTranslation();

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div className="d-flex justify-content-end">
      {selectedValue === "All" || selectedValue === "" ? (
        <>
          <h5 className="mb-0" style={{ width: "80px" }}>
            {t("")}
          </h5>
          <TextLink
            to={"#"}
            onClick={props.markAllRead}
            className={props.linkDisable}
            primary={`true`}
            underline={`true`}
            tiny={`true`}
            strong={`true`}
            style={{}}
          >
            {t("setting.modal:notifications:mark.all.as.read")}
          </TextLink>
        </>
      ) : (
        <>
          <div
            style={
              props.global
                ? { width: "240px", marginTop: "8px" }
                : { width: "calc(100% - 110px)", marginTop: "8px" }
            }
          >
            <Button
              size=""
              rounded
              backgroundColor={buttonBackgroundColorHovered}
              textColor={textColorHovered}
              hoverBackgroundColor={buttonBackgroundColorHovered}
              hoverTextColor={textColorHovered}
              borderColor={textColorHovered}
              hoverBorderColor={textColorHovered}
              className="d-flex align-items-center notification-filter-active-badge"
              style={{ width: "80px", height: "20px" }}
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
          </div>
          <TextLink
            to={"#"}
            onClick={props.markAllRead}
            className={props.linkDisable}
            primary={`true`}
            underline={`true`}
            tiny={`true`}
            strong={`true`}
            style={{}}
          >
            {t("setting.modal:notifications:mark.all.as.read")}
          </TextLink>
        </>
      )}
      <div
        style={{ marginLeft: "10px", marginTop: "8px" }}
        className="filter__icon"
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </div>
    </div>
  ));

  return (
    <div
      className="notification-menu notification-menu-filter"
      style={props.global ? { width: "calc(100% - 100px" } : {}}
    >
      <Dropdown drop="right" alignRight="false">
        <Dropdown.Toggle
          menuAlign="right"
          as={CustomToggle}
          id="dropdown-button-drop-right"
        ></Dropdown.Toggle>
        <Dropdown.Menu
          alignRight={true}
          rootCloseEvent="mousedown"
          className="dropdown-noti"
        >
          {/*<div className="dropdown-header" style={{textAlign: 'left',
          color: "black", fontsize: "small"}}>
            <h6>{t("filter")}</h6>
          </div>*/}
          <Dropdown.Header
            className="menu-header"
            style={{
              textAlign: "left",
              color: "black",
              paddingLeft: "10px",
              paddingBottom: "5px",
              paddingTop: "5px",
              height: "22px",
              fontSize: "12px",
              lineHeight: "normal",
            }}
          >
            Filter
          </Dropdown.Header>
          <div className="dropdown-content">
            {notificationOptions(t).map((option, index) => (
              <Button
                style={{}}
                key={`notification-filter-button-${index}`}
                rounded
                bordered
                value={option.value}
                onClick={() => {
                  props.handleClick(option.key);
                  if (selectedValue === option.key) {
                    setSelectedValue("All");
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
                className="justify-content-center notification-filter-position"
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

export default NotificationFilters;
