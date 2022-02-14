import React, { useState, useEffect } from "react";
import config from "configuration/config";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

function Activation(props) {
  let history = useHistory();
  const { t } = useTranslation();
  const { fetch, error } = useFetch();
  const [activationStatus, setActivationStatus] = useState("ACTIVATION");

  const pushInsideApp = () => {
    const usp = new URLSearchParams(props.location.search);
    const returnUrl = usp.get("returnUrl");
    if (returnUrl) history.push(returnUrl);
    else history.push("/");
  };

  const loadData = async () => {
    setActivationStatus("ACTIVATION");
    try {
      await fetch({
        url: Endpoints.auth.activation,
        urlParams: {
          activationCode: props.match.params.activationCode,
        },
        method: "POST",
      });
      setActivationStatus("ACTIVATED");
    } catch (e) {
      setActivationStatus("ERROR");
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <div id="activation">
      <Helmet title={`${config.name.short} - ${t("auth.activation.title")}`} />

      <div id="activationForm">
        <img
          width="300px"
          className="mb-5 self-center"
          src={process.env.PUBLIC_URL + "/img/logos/longLogo.svg"}
          alt="Main logo"
        />
        <Typography align="center" variant="h3" gutterBottom>
          {t("auth.activation.title")}
        </Typography>
        {activationStatus === "ACTIVATING" && (
          <>
            <Typography align="center" variant="body1" gutterBottom>
              {t("auth.activation.activatingText")}
            </Typography>
            <div className="flex justify-center mt-5">
              <CircularProgress color="primary" size={75} />
            </div>
          </>
        )}
        {activationStatus === "ACTIVATED" && (
          <>
            <Typography align="center" variant="body1" gutterBottom>
              {t("auth.activation.activatedText")}
            </Typography>
            <img
              width="100px"
              className="mt-5 mb-10 self-center"
              src={process.env.PUBLIC_URL + "/img/tick.svg"}
              alt="Confirm"
            />
            <div className="flex justify-center mb-3">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  pushInsideApp();
                }}
              >
                {t("auth.activation.goToApp")}
              </Button>
            </div>
          </>
        )}
        {activationStatus === "ERROR" && (
          <>
            <Typography align="center" variant="body1" gutterBottom>
              {t(`auth.activation.${error.data.message}`)}
            </Typography>
            <img
              width="100px"
              className="mt-5 mb-10 self-center"
              src={process.env.PUBLIC_URL + "/img/cross.svg"}
              alt="Confirm"
            />
            <div className="flex justify-center mb-3">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  loadData();
                }}
              >
                {t("auth.activation.retry")}
              </Button>
            </div>
          </>
        )}
        <div id="auxiliaryLinks">
          <span className="mr-1">
            {t("auth.alreadyHaveAnAccount")}
          </span>
          <Link href="/auth/login" vcolor="primary">
            {t("auth.login")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Activation;
