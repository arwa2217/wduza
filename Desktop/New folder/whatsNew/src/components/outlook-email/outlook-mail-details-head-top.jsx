import { useMsal } from "@azure/msal-react";
import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ContextPanelActive from "../../assets/icons/context-panel-active.svg";
import ContextPanel from "../../assets/icons/context-panel.svg";
import { setMailSummary } from "../../store/actions/mail-summary-action";
import { clearDataCached } from "../../utilities/outlook";

const OutLookMailDetailsHeadTop = () => {
  const { instance } = useMsal();
  const dispatch = useDispatch();
  const isSummary = useSelector((state) => state.MailSummaryReducer.isSummary);
  const { t } = useTranslation();
  const activePanel = useSelector((state) => state.config.activeActionPanel);

  const handleLogout = () => {
    localStorage.removeItem("EMAIL_COLOR");
    clearDataCached();
    const currentAuth = instance.getActiveAccount();
    const logoutRequest = {
      account: instance.getAccountByHomeId(currentAuth.homeAccountId),
      mainWindowRedirectUri: window.location.href,
      postLogoutRedirectUri: window.location.href,
    };
    instance.logout(logoutRequest);
  };

  return (
    <div
      className="topBar m-0 p-0 d-flex"
      style={{ height: "70px", marginRight: "5px" }}
    >
      <div className="d-flex align-items-center justify-content-end pr-0 w-100">
        <div className="d-flex align-items-center">
          <div
            className={`${
              activePanel === "WELCOME_EMAIL"
                ? "d-flex align-items-center mr-0"
                : "d-none"
            }`}
          >
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip id={t("outlook.mail.tooltip:log.out")}>
                  {t("outlook.mail.tooltip:log.out")}
                </Tooltip>
              }
            >
              <div
                className={"topBar__icon topBar__icon__logOut"}
                onClick={handleLogout}
              >
                {t("outlook.mail.head.top:leave")}
              </div>
            </OverlayTrigger>
          </div>
          <div
            className={`${
              activePanel === "WELCOME_EMAIL" ? "d-none" : "d-flex"
            } align-items-center mr-0`}
          >
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 150, hide: 100 }}
              trigger={["hover", "focus"]}
              overlay={<Tooltip>{t("outlook.mail.head.top:summary")}</Tooltip>}
            >
              <div
                className="topBar__icon"
                id="opened"
                onClick={() => dispatch(setMailSummary(!isSummary))}
              >
                {isSummary ? (
                  <img
                    id="icon"
                    src={ContextPanelActive}
                    alt="channel details"
                  />
                ) : (
                  <img id="icon" src={ContextPanel} alt="channel details" />
                )}
              </div>
            </OverlayTrigger>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutLookMailDetailsHeadTop;
