import React, { useContext } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import config from "configuration/config";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import { Settings } from "luxon";

function MUIThemeHandler(props) {
  const themeContext = useContext(ThemeContext);

  let muithemeConfig = {
    typography: {
      //fontFamily: `"Comfortaa", "Roboto", "Helvetica", "Arial", sans-serif`,
      fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    },
    palette: {
      mode: localStorage.getItem("theme") || themeContext.muiType,
      primary: {
        main: config.palette.primaryColor,
        ...(config.theme.forceTextColor.enabled && {
          contrastText: config.theme.forceTextColor.color,
        }),
      },
      secondary: {
        main: config.palette.secondaryColor,
      },
    },
  };

  const theme = createTheme(muithemeConfig);
  Settings.defaultLocale = themeContext.i18nextLng?.split("-")[0]
  return (
    <LocalizationProvider dateAdapter={AdapterLuxon} locale={themeContext.i18nextLng?.split("-")[0]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default MUIThemeHandler;
