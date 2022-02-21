import * as React from 'react';
import RoundLoader from "components/RoundLoader";
import { BrowserRouter as Router } from "react-router-dom";
import Provider from "./contexts/Provider";
import Routes from "routes";
import MUIThemeHandler from "./components/MUIThemeHandler";
import "./i18n";
import SnackBar from "components/SnackBar";
import StandardDialog from "components/StandardDialog";
import ErrorBoundary from "components/ErrorBoundary";
import yupConfig from "auxiliaries/yupConfig";
import { Settings } from "luxon";
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
let locale = window.navigator.userLanguage || window.navigator.language;

function App() {
  Settings.defaultLocale = localStorage.getItem("i18nextLng").split("-")[0] || locale
  yupConfig();
  return (
    <ErrorBoundary>
      <Provider>
        <LocalizationProvider dateAdapter={AdapterLuxon} locale={localStorage.getItem("i18nextLng").split("-")[0] || locale}>
          <MUIThemeHandler>
            <React.Suspense fallback={<RoundLoader />}>
              <Router>
                <Routes />
                <SnackBar />
                <StandardDialog />
              </Router>
            </React.Suspense>
          </MUIThemeHandler>
        </LocalizationProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App

