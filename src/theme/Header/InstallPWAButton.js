import React, { useState, useContext } from "react";
import { PWAInstalledChecker, installApp } from "auxiliaries/PWA";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";
function InstallPWAButton(props) {
  let [showButton, setShowButton] = useState(true);
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);

  if (showButton && !PWAInstalledChecker() && themeContext.installEvent) {
    return (
      <div id="install-app">
        <MenuItem
          dense={true}
          className="install-button"
          onClick={async () => {
            setShowButton(false);
            let result = await installApp(themeContext.installEvent);
            setShowButton(result);
          }}
        >
          <span className="menuItem">
            <GetAppOutlinedIcon
              className="menuProfileIcon"
              color="action"
              fontSize="small"
            />
            <Typography color="textSecondary" variant="body2" gutterBottom>
              {t("installApp")}
            </Typography>
          </span>
        </MenuItem>
      </div>
    );
  } else return null;
}

export default InstallPWAButton;
