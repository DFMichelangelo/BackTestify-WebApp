import React, { useEffect, useContext } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "sassStyles/placeholders.scss";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Typography from "@mui/material/Typography";

function CreateBacktest(props) {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    themeContext.setTitle("placeholder.createNewBacktest");
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
        src="/img/placeholders/createNewBacktest.svg"
        alt="Create Backtest"
        className="error-image"
      />
      <Typography variant="h5" gutterBottom className="error-text">
        {t("placeholder.createNewBacktest")}
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

export default CreateBacktest;
