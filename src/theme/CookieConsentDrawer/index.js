import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import "./style.scss";
import { getCookie, setCookie } from "auxiliaries/cookies";
function CookieConsentDrawer(props) {
  const { t } = useTranslation();
  const [cookieConsentOpen, setCookieConsentOpen] = useState(
    !getCookie("acceptedCookies")
  );
  const createAcceptCookieConsent = () => {
    setCookie("acceptedCookies", true, 356 * 60);
    setCookieConsentOpen(false);
  };

  return (
    <Drawer
      sx={{
        "& .MuiPaper-root": {
          zIndex: 1201,
        }
      }}
      variant="persistent" anchor="bottom" open={cookieConsentOpen}>
      <div className="flex justify-center mt-4 mb-4 ml-2 mr-2 items-center">
        <div>
          <Typography variant="body2">
            {t("cookieConsentDrawer.text")}
            <Link href="/privacy-policy">Privacy Policy</Link>
          </Typography>
        </div>
        <span className="flex" id="cookie-consent-buttons">
          <div className="ml-2 mr-2">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={createAcceptCookieConsent}
            >
              {t("cookieConsentDrawer.ok")}
            </Button>
          </div>
        </span>
      </div>
    </Drawer>
  );
}
export default CookieConsentDrawer;
