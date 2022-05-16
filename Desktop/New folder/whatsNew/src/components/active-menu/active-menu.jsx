import React, { useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN_SUB_MENU, MENU_ITEMS } from "../../constants/menu-items";
import { Redirect } from "react-router";
import PrivateRoute from "../privateroute/private-route";
import History from "../../utilities/history";
import { useHistory, useLocation } from "react-router-dom";
import { setActiveMenuItem } from "../../store/actions/config-actions";
import { RESET_FILE_STATES } from "../../store/actionTypes/main-files-action-types";
import msalInstance from "../../outlook/instance";
import { MsalProvider } from "@azure/msal-react";
import ESignatureView from "../e-signature/e-signature-view";
import AddESignatureView from "../e-signature/add-e-signature-view";
import SignDocumentModal from "../e-signature/sign-document/sign-document-modal";

const ProjectItemView = lazy(() =>
  import("../project-item-view/project-item-view")
);
const AdminAccountPage = lazy(() =>
  import("../admin/account-management/admin-account")
);
const AdminDiscussionPage = lazy(() =>
  import("../admin/discussion-management/admin-discussion")
);
const AdminFilePage = lazy(() => import("../admin/file-management/index.jsx"));
const GlobalSearch = lazy(() => import("../global-search/global-search"));
const UserHome = lazy(() => import("../user-home/user-home"));
const FilesView = lazy(() => import("../files/files-view/index.jsx"));
const EmailView = lazy(() => import("../email-view/email-view"));

export default (props) => {
  const activeMenuItem = useSelector((state) => state.config.activeMenuItem);
  const history = useHistory();
  const dispatch = useDispatch();
  const pushPathToHistory = useSelector(
    (state) => state.config.pushPathToHistory
  );
  const location = useLocation();

  useEffect(() => {
    dispatch(setActiveMenuItem(location.pathname, false));
  }, []);

  useEffect(() => {
    if (pushPathToHistory) {
      const { search } = location;
      History.push([activeMenuItem, search].join(""));
    }
    if (
      activeMenuItem ===
        `${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.FILE_MANAGEMENT}` ||
      activeMenuItem === MENU_ITEMS.FILES
    ) {
      dispatch({ type: RESET_FILE_STATES });
    }
  }, [activeMenuItem]);

  useEffect(() => {
    return history.listen((location) => {
      if (history.action === "POP") {
        dispatch(setActiveMenuItem(location.pathname, false));
      }
    });
  }, [History.length]);
  return (
    <>
      <PrivateRoute
        exact
        path={`${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.ACCOUNT_MANAGEMENT}`}
      >
        <AdminAccountPage {...props} />
      </PrivateRoute>
      <PrivateRoute
        exact
        path={`${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.DISCUSSION_MANAGEMENT}`}
      >
        <AdminDiscussionPage {...props} />
      </PrivateRoute>
      <PrivateRoute
        exact
        path={`${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.FILE_MANAGEMENT}`}
      >
        <AdminFilePage {...props} />
      </PrivateRoute>
      <PrivateRoute
        exact
        path={`${MENU_ITEMS.ADMINISTRATOR}${ADMIN_SUB_MENU.SETTINGS}`}
      >
        <AdminAccountPage {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.GLOBAL_SEARCH}>
        <GlobalSearch {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.FILES}>
        <FilesView {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.E_SIGNATURE}>
        <ESignatureView {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.ADD_E_SIGNATURE}>
        <AddESignatureView {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.SIGN_DOCUMENT}>
        <SignDocumentModal {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.HOME}>
        <UserHome {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.COLLECTIONS}>
        <ProjectItemView {...props} />
      </PrivateRoute>
      <PrivateRoute exact path={MENU_ITEMS.EMAIL}>
        <MsalProvider instance={msalInstance}>
          <EmailView {...props} />
        </MsalProvider>
      </PrivateRoute>
      <Redirect
        from="/"
        to={
          location.pathname !== "/" ? location.pathname : MENU_ITEMS.COLLECTIONS
        }
      />
    </>
  );
};
