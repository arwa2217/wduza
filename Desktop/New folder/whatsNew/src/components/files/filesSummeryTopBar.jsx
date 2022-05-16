import React, { useState } from "react";
import "./filesSummeryTopBar.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { DiscussionActions } from "../messages/channel-head.style";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import Notifications from "../datapanel/notification";
import OpenedChannelDetails from "../../assets/icons/context-panel.svg";
import OpenChannelDetails from "../../assets/icons/context-panel-active.svg";

function filesSummeryTopBar(props) {
  const { t } = useTranslation();
  const activeSelectedFileId = useSelector(
    (state) => state.config.activeSelectedFileId
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const filePanelActive = useSelector((state) => state.config.filePanelActive);
  return (
    <div className="topBar m-0">
      <div className="d-flex align-items-center justify-content-between pr-0">
        <DiscussionActions className="justify-content-end">
          <div className="d-flex align-items-center">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              show={showTooltip}
              overlay={
                <Tooltip id={t("header.tooltip:notifications")}>
                  {t("header.tooltip:notifications")}
                </Tooltip>
              }
            >
              <div
                className={`topBar__icon ${showBg === true ? "active" : ""}`}
              >
                <Notifications
                  showToolTip={(val) => setShowTooltip(val)}
                  setShowBg={(val) => setShowBg(val)}
                  showBg={showBg}
                />
              </div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("header.tooltip:summary")}>
                  {t("header.tooltip:summary")}
                </Tooltip>
              }
            >
              <div
                onClick={activeSelectedFileId && props.onToggleChannelDetails}
                className={`topBar__icon topBar__icon__summary ${
                  !activeSelectedFileId ? "disabled " : ""
                }${filePanelActive ? "active" : ""}`}
                id={filePanelActive ? "opened" : ""}
              >
                <img
                  id="icon"
                  src={
                    filePanelActive ? OpenedChannelDetails : OpenChannelDetails
                  }
                  alt={"channel details"}
                />
              </div>
            </OverlayTrigger>
          </div>
        </DiscussionActions>
      </div>
    </div>
  );
}

export default filesSummeryTopBar;
