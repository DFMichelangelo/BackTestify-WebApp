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

function App() {

  yupConfig();
  return (
    <ErrorBoundary>
      <Provider>
        <MUIThemeHandler>
          <React.Suspense fallback={<RoundLoader />}>
            <Router>
              <Routes />
              <SnackBar />
              <StandardDialog />
            </Router>
          </React.Suspense>
        </MUIThemeHandler>
      </Provider>
    </ErrorBoundary>
  );
}

export default App

