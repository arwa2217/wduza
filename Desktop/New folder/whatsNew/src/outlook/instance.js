import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig } from "./config";

const msalInstance = new PublicClientApplication(msalConfig);
// Default to using the first account if no account is active on page load
if (
  !msalInstance.getActiveAccount() &&
  msalInstance.getAllAccounts().length > 0
) {
  // Account selection logic is app dependent. Adjust as needed for different use cases.
  msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
    localStorage.setItem("msalToken", event.payload.accessToken);
  }
});
export default msalInstance;
