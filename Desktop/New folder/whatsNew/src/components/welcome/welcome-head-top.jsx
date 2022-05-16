import React, { useState } from "react";
import { DiscussionActions } from "../messages/channel-head.style.js";
import Notifications from "../datapanel/notification";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useTranslation } from "react-i18next";
/* Currently not need for this, will do this when globally required
import SearchSuggestions from "../utils/search-suggestion";*/

function ChannelHeadTop(props) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { t } = useTranslation();
  /* Currently not need for this, will do this when globally required
  const [searchValue, setSearchValue] = useState("");
  const [searchToggle, setSearchToggle] = useState(false);*/

  const [showBg, setShowBg] = useState(false);

  /* Currently not need for this, will do this when globally required
  const handleToggleSearch = (e) => {
    setSearchToggle(!searchToggle);
  };
  const handleChangeSearch = (searchValue) => {
    setSearchValue(searchValue);
  };*/

  return (
    <div className="topBar m-0">
      <div className="d-flex align-items-center pr-0">
        <DiscussionActions>
          <div className="d-flex align-items-center left-spacing">
            {/*<OverlayTrigger*/}
            {/*  placement="bottom"*/}
            {/*  delay={{ show: 150, hide: 100 }}*/}
            {/*  trigger={["hover", "focus"]}*/}
            {/*  show={showTooltip}*/}
            {/*  overlay={*/}
            {/*    <Tooltip id={t("header.tooltip:notifications")}>*/}
            {/*      {t("header.tooltip:notifications")}*/}
            {/*    </Tooltip>*/}
            {/*  }*/}
            {/*>*/}
            {/*  /!*<div*!/*/}
            {/*  /!*  className={`welcome-page topBar__icon ${*!/*/}
            {/*  /!*    showBg === true ? "active" : ""*!/*/}
            {/*  /!*  }`}*!/*/}
            {/*  /!*>*!/*/}
            {/*  /!*  <Notifications*!/*/}
            {/*  /!*    showToolTip={(val) => setShowTooltip(val)}*!/*/}
            {/*  /!*    setShowBg={(val) => setShowBg(val)}*!/*/}
            {/*  /!*    showBg={showBg}*!/*/}
            {/*  /!*  />*!/*/}
            {/*  /!*</div>*!/*/}
            {/*</OverlayTrigger>*/}
            {/* Currently not need for this, will do this when globally required */}
            {/* <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("header.tooltip:search")}>
                  {t("header.tooltip:search")}
                </Tooltip>
              }
            >
              <SearchSuggestions />
            </OverlayTrigger> */}
          </div>
        </DiscussionActions>
      </div>
    </div>
  );
}

export default ChannelHeadTop;
