import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import OpenContacts from "../../assets/icons/context-panel-active.svg";
import OpenedContacts from "../../assets/icons/context-panel.svg";
import Notifications from "../datapanel/notification";
import { useTranslation } from "react-i18next";

const GlobalSearchTopBar = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
    const { t } = useTranslation();
  return (
    <div className="notification-top-area">
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 150, hide: 100 }}
        trigger={["hover", "focus"]}
        overlay={
          <Tooltip id={t("user.summary:contacts")}>
            {t("user.summary:contacts")}
          </Tooltip>
        }
      >
        <div
          // onClick={() => {
          //   props.setIsActive(!props.isActive);
          // }}
          className={`topBar__icon topBar__icon__summary ${
            props.isActive ? "active" : ""
          }`}
          id={props.isActive ? "opened" : ""}
        >
          <img
            id="icon"
            src={props.isActive ? OpenedContacts : OpenContacts}
            alt={"channel details"}
          />
        </div>
      </OverlayTrigger>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 150, hide: 100 }}
        trigger={["hover", "focus"]}
        show={showTooltip}
        overlay={
          <Tooltip id={t("user.summary:notifications")}>
            {t("user.summary:notifications")}
          </Tooltip>
        }
      >
        <div className={`topBar__icon ${showBg === true? "active": ""}`}>
          <Notifications 
            showToolTip={(val)=> setShowTooltip(val)} 
            setShowBg={(val) => setShowBg(val)}
            showBg={showBg}
          />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default GlobalSearchTopBar;
