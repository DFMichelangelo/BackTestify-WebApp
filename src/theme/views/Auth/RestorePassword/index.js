import React, { useState, useContext } from "react";
import config from "configuration/config";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";
import "./style.scss";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import Endpoints from "Endpoints";
import "./style.scss";
import * as Yup from "yup";
import useFetch from "hooks/useFetch";
import Link from "@mui/material/Link";

function RestorePassword(props) {
  let [disableButton, setDisableButton] = useState(true);
  const themeContext = useContext(ThemeContext);
  const { fetch } = useFetch();
  const { t } = useTranslation();
  const [restorePasswordStatus, setRestorePasswordStatus] = useState(
    "INSERTING_EMAIL"
  );
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
  });

  const restorePasswordFormik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async (values, formikBag) => {
      try {
        await fetch({
          url: Endpoints.auth.lostPasswordEmail,
          data: values,
          method: "POST",
        });
        setRestorePasswordStatus("EMAIL_SENT");
      } catch (err) {
        if (err?.status === 404)
          themeContext.showErrorSnackbar({
            message: "auth." + err.data.message,
          });
        else if (err?.status < 500)
          themeContext.showErrorSnackbar({ message: "auth.error" });
      }
    },
    validationSchema,
    validate: (values) => {
      validationSchema.isValid(values).then((e) => setDisableButton(!e));
    },
  });

  return (
    <div id="RestorePassword">
      <Helmet
        title={`${config.name.short} - ${t("auth.restorePassword.title")}`}
      />

      <div id="RestorePasswordForm">
        <img
          width="300px"
          className="mb-5 self-center"
          src={process.env.PUBLIC_URL + "/img/logos/longLogo.svg"}
          alt="Main logo"
        />
        <Typography align="center" variant="h3" gutterBottom>
          {t("auth.restorePassword.title")}
        </Typography>

        {restorePasswordStatus === "INSERTING_EMAIL" && (
          <form onSubmit={restorePasswordFormik.handleSubmit}>
            <div id="formInputs">
              <TextField
                error={
                  restorePasswordFormik.touched.email &&
                  Boolean(restorePasswordFormik.errors.email)
                }
                id="email"
                label="Email"
                variant="filled"
                type="email"
                name="email"
                onChange={restorePasswordFormik.handleChange}
                onBlur={restorePasswordFormik.handleBlur}
                value={restorePasswordFormik.values.email}
                helperText={
                  restorePasswordFormik.touched.email &&
                  t(restorePasswordFormik.errors.email)
                }
              />
            </div>
            <div id="submitInput">
              <Button
                size="large"
                type="submit"
                disabled={disableButton || restorePasswordFormik.isSubmitting}
                variant="contained"
                color="primary"
              >
                {t("auth.restorePassword.title")}
              </Button>
            </div>
          </form>
        )}
        {restorePasswordStatus === "EMAIL_SENT" && (
          <>
            <Typography align="center" variant="body1" gutterBottom>
              {t("auth.restorePassword.resetPasswordEmailSent")}
            </Typography>
            <img
              width="100px"
              className="mt-5 mb-10 self-center"
              src={process.env.PUBLIC_URL + "/img/tick.svg"}
              alt="Confirm"
            />
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

export default RestorePassword;
