import React, { useEffect, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import History from "../utilities/history";
import PrivateRoute from "./privateroute/private-route";
import SignupRoute from "./privateroute/SignupRoute";
import RegisterRoute from "./privateroute/RegisterRoute";
import GuestLoginRoute from "./privateroute/guest-login-route";
import GuestFileDownload from "./privateroute/guest-file-download";
import ResetRoute from "./privateroute/reset-route";
import "semantic-ui-css/semantic.min.css";
import Theme from "@styles/theme";
import { ThemeProvider } from "@material-ui/core";
import themeList from "../theme";
import "./app.css";
import withClearCache from "./clearCache";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { getApplicationVersion } from "../store/actions/config-actions";
import features from "features";
import { AppRoutes } from "../constants/app-routes";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MENU_ITEMS } from "../constants/menu-items";
import SignDocumentModal from "./e-signature/sign-document/sign-document-modal";
const VerifyPage = lazy(() => import("./e-signature/pages/verifyPage"));
const SigninPage = lazy(() => import("./signin/signin-page"));
const HomePage = lazy(() => import("./home/home-page"));
const ResetPasswordRequest = lazy(() => import("./reset/reset-password-page"));
const SignupPage = lazy(() => import("./signup/signup-page"));
const UpdatePasswordPage = lazy(() => import("./reset/update-password-page"));
const FinishSignupPage = lazy(() => import("./signup/finish-signup-page"));
const MainFrame = lazy(() => import("./mainframe/main-frame-page"));
const AddESignatureView = lazy(() =>
  import("./e-signature/add-e-signature-view")
);
const GuestESignRoute = lazy(() => import("./privateroute/guest-e-sign-route"));

const ClearCacheComponent = withClearCache(MainApp);

/*
 *Main Component Class
 *Creation of global states happen here
 *Routes definition
 */

function App() {
  return <ClearCacheComponent />;
}

function MainApp() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const buildVersion = useSelector((state) => state.config.buildVersion);
  const isUserTyping = useSelector((state) => state.config.isUserTyping);

  useEffect(() => {
    if (
      !features.disable_build_version_check &&
      buildVersion &&
      buildVersion.toString() !==
        t("setting.modal:profile:version.value").toString()
    ) {
      if (isUserTyping) {
        let action = window.confirm(t("new.app.version.available"));
        if (action) {
          window.location.reload(true);
        }
      } else {
        window.location.reload(true);
      }
    }
  }, [buildVersion, t]);

  useEffect(() => {
    dispatch(getApplicationVersion());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Theme>
      <ThemeProvider theme={themeList[2]}>
        <CssBaseline />
        <Router history={History}>
          <Switch>
            <GuestFileDownload path={AppRoutes.FILE_SHARE} component={<></>} />
            <GuestESignRoute
              path={AppRoutes.GUEST_E_SIGN}
              component={AddESignatureView}
            />
            <Route path={AppRoutes.SIGN_IN} component={SigninPage} />
            <Route path={AppRoutes.HOME} component={HomePage} />
            <Route path={AppRoutes.RESET} component={ResetPasswordRequest} />
            {/* <Route exact path={MENU_ITEMS.SIGN_DOCUMENT}>
              <SignDocumentModal />
            </Route> */}
            {/* <Route path={AppRoutes.VERIFY_PATH} component={VerifyPage} /> */}
            <SignupRoute path={AppRoutes.SIGN_UP} component={SignupPage} />
            <ResetRoute
              path={AppRoutes.REMEDIATE}
              component={UpdatePasswordPage}
            />
            <RegisterRoute
              path={AppRoutes.REGISTER}
              component={FinishSignupPage}
            />
            <GuestLoginRoute
              path={AppRoutes.GUEST_LOGIN}
              component={MainFrame}
            />
            <PrivateRoute path={AppRoutes.DEFAULT_PATH} component={MainFrame} />
            <PrivateRoute
              path={AppRoutes.PROJECTS_PATH}
              component={MainFrame}
            />
            <PrivateRoute path={AppRoutes.EMAIL_PATH} component={MainFrame} />

            {/* <MainFrame />*/}
          </Switch>
        </Router>
      </ThemeProvider>
    </Theme>
  );
}

export { App };
