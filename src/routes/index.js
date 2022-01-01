import React, { lazy, useEffect, useContext, useState, useCallback } from "react";
import { Route, Switch } from "react-router-dom";
import RoutingApp from "./App";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { UserContext } from "contexts/Providers/UserProvider";
import RoutingAuth from "./Auth";
import i18n from "i18n";
import CookieConsentDrawer from "theme/CookieConsentDrawer";
import { DateTime } from "luxon";
import Theme from "theme";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
const ErrorInternalServer = lazy(() =>
  import("theme/views/Placeholders/ErrorInternalServer")
);
const ErrorNotAuthorized = lazy(() =>
  import("theme/views/Placeholders/ErrorNotAuthorized")
);
const ErrorNotFound = lazy(() => import("theme/views/Placeholders/ErrorNotFound"));
const PrivacyPolicy = lazy(() => import("theme/views/TOS/PrivacyPolicy"));
const TermsAndConditions = lazy(() => import("theme/views/TOS/TermsAndConditions"));
const Backtester = lazy(() => import("views/Backtester"));



function App(props) {
  const themeContext = useContext(ThemeContext);
  const userContext = useContext(UserContext);
  const { fetch } = useFetch();
  useEffect(() => {
    window.addEventListener("app-update", onAppUpdate);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    checkUserIdentity();
  }, []);

  const checkUserIdentity = useCallback(async () => {
    if (userContext.user) {
      //setLoading(false);
      return;
    }
    // ? qui non ho l'utente
    try {
      const data = await fetch({
        method: "GET",
        url: Endpoints.user.profile,
        redirectToPage500: true,
      });
      userContext.setUser(data);
      //setLoading(false);
    } catch (e) {
      if (e?.status == 404) {
        //history.push("auth/login?returnUrl=" + history.location.pathname);
        //themeContext.showWarningSnackbar({ message: "loginAgain" })
      }
      //history.push("auth?returnUrl=" + history.location.pathname)
    }
  }, []);



  const onBeforeInstallPrompt = (e) => {
    if (!e) return;
    e.preventDefault();
    themeContext.setInstallEvent(e);
  };

  const onAppUpdate = () => {
    let format = "yyyy-LL-dd hh:mm:ss";
    if (localStorage.updateDialogLastShown) {
      let date = DateTime.fromFormat(localStorage.updateDialogLastShown, format)
      if (DateTime.local().diff(date, "minute").toObject().minutes < 1) return
    }
    localStorage.updateDialogLastShown = DateTime.local().toFormat(format)
    themeContext.showInfoDialog({
      title: i18n.t("newUpdateAlert.title"),
      message: i18n.t("newUpdateAlert.message"),
      onClose: () => {
        window.location.reload();
      },
    });
  };

  return (
    <span>
      <CookieConsentDrawer />
      <Switch>
        <Route path="/terms-and-conditions" component={TermsAndConditions} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/error/404" component={ErrorNotFound} />
        <Route path="/error/401" component={ErrorNotAuthorized} />
        <Route path="/error/403" component={ErrorNotAuthorized} />
        <Route path="/error/500" component={ErrorInternalServer} />
        <Route path="/auth*" component={RoutingAuth} />
        <Theme>
          <Switch>
            <Route path="/backtester" component={Backtester} />
            <Route path="/*" exact component={RoutingApp} />
          </Switch>
        </Theme>
      </Switch>
    </span>
  );
}

export default App;
