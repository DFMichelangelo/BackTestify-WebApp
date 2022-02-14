import React, { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "sassStyles/placeholders.scss";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Typography from "@mui/material/Typography";

function ErrorNotAuthorized(props) {
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  useEffect(() => {
    themeContext.setTitle("placeholder.youAreNotAuthorized");
  }, []);

  return (
    <div className="error-page placeholder internal-server-error">
      <img
        width="250px"
        src="/img/placeholders/unauthorized.svg"
        alt="Not Authorized"
        className="error-image"
      />
      <Typography variant="h5" gutterBottom className="error-text">
        {t("placeholder.youAreNotAuthorized")}
      </Typography>
      <Link
        to="/"
        color="primary"
        variant="contained"
        component={Button}
        className="error-button"
      >
        {t("placeholder.backToHomepage")}
      </Link>
    </div>
  );
}

export default ErrorNotAuthorized;
