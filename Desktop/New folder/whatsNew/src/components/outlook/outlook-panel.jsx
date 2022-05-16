import React from "react";
import "./outlook-panel.css";
import MessageList from "./message-list";
import MessageTopBar from "../outlook/message-topbar";
import { loginRequest } from "../../outlook/config";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
function OutlookPanel() {
  const authRequest = {
    ...loginRequest,
  };
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      authenticationRequest={authRequest}
    >
      <div className="outlook-panel">
        <MessageTopBar />
        <MessageList />
      </div>
    </MsalAuthenticationTemplate>
  );
}

export default OutlookPanel;
