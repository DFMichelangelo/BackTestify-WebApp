import React, { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "sassStyles/placeholders.scss";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Typography from "@mui/material/Typography";
function ErrorInternalServer(props) {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    themeContext.setTitle("placeholder.errorInternalServer");
  }, []);

  const pushInsideApp = () => {
    const usp = new URLSearchParams(props.location.search);
    const returnUrl = usp.get("returnUrl");
    if (returnUrl) history.push(returnUrl);
    else history.push("/");
  };

  return (
    <div className="error-page placeholder internal-server-error">
      <img
        width="250px"
        src="/img/placeholders/internalServerError.svg"
        alt="500 Internal Server Error"
        className="error-image"
      />
      <Typography variant="h5" gutterBottom className="error-text">
        {t("placeholder.errorInternalServer")}
      </Typography>
      <Button
        onClick={pushInsideApp}
        color="primary"
        variant="contained"
        component={Button}
        className="error-button"
      >
        {t("placeholder.backToHomepage")}
      </Button>
    </div>
  );
}

export default ErrorInternalServer;
