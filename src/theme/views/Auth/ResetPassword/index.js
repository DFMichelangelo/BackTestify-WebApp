import React, { useState, useContext } from "react";
import config from "configuration/config";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";
import * as Yup from "yup";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Button from "@mui/material/Button";
import { useFormik } from "formik";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
function RestorePassword(props) {
  let history = useHistory();
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  const { fetch } = useFetch();
  const [restorePasswordStatus, setRestorePasswordStatus] = useState("RESET");
  let [disableButton, setDisableButton] = useState(true);
  let [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    password1: Yup.string().required(),
    password2: Yup.string().required().min(8).equalTo(Yup.ref("password1")),
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const pushInsideApp = () => {
    const usp = new URLSearchParams(props.location.search);
    const returnUrl = usp.get("returnUrl");
    if (returnUrl) history.push(returnUrl);
    else history.push("/");
  };

  const resetPasswordFormik = useFormik({
    initialValues: {
      password1: "",
      password2: "",
    },
    onSubmit: async (values, formikBag) => {
      try {
        await fetch({
          url: Endpoints.auth.passwordReset,
          data: {
            password: values.password2,
            activationCode: props.match.params.activationCode,
          },
          method: "POST",
        });
        setRestorePasswordStatus("RESETTED");
      } catch (e) {
        if (e?.status === 404)
          themeContext.showErrorSnackbar({ message: "auth." + e.data.message });
        else if (e?.status < 500)
          themeContext.showErrorSnackbar({ message: "auth.error" });
      }
    },
    validationSchema,
    validate: (values) => {
      validationSchema.isValid(values).then((e) => setDisableButton(!e));
    },
  });

  return (
    <div id="ResetPassword">
      <Helmet
        title={`${config.name.short} - ${t("auth.resetPassword.title")}`}
      />

      <div id="ResetPasswordForm">
        <img
          width="300px"
          className="mb-5 self-center"
          src={process.env.PUBLIC_URL + "/img/logos/longLogo.svg"}
          alt="Main logo"
        />
        <Typography align="center" variant="h3" gutterBottom>
          {t("auth.resetPassword.title")}
        </Typography>
        {
          // ? FORM
        }
        {restorePasswordStatus === "RESET" && (
          <form onSubmit={resetPasswordFormik.handleSubmit} className="mt-6">
            <div id="formInputs">
              <TextField
                error={
                  resetPasswordFormik.touched.password1 &&
                  Boolean(resetPasswordFormik.errors.password1)
                }
                id="password1"
                label={t("auth.resetPassword.insertNewPassword")}
                variant="filled"
                onChange={resetPasswordFormik.handleChange}
                onBlur={resetPasswordFormik.handleBlur}
                value={resetPasswordFormik.values.password1}
                helperText={
                  resetPasswordFormik.touched.password1 &&
                  t(resetPasswordFormik.errors.password1)
                }
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                error={
                  resetPasswordFormik.touched.password2 &&
                  Boolean(resetPasswordFormik.errors.password2)
                }
                variant="filled"
                id="password2"
                label={t("auth.resetPassword.insertNewPasswordAgain")}
                type={showPassword ? "text" : "password"}
                onChange={resetPasswordFormik.handleChange}
                onBlur={resetPasswordFormik.handleBlur}
                value={resetPasswordFormik.values.password2}
                helperText={
                  resetPasswordFormik.touched.password2 &&
                  t(resetPasswordFormik.errors.password2)
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon />
                        ) : (
                          <VisibilityOffOutlinedIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div id="submitInput">
              <Button
                size="large"
                type="submit"
                disabled={disableButton || resetPasswordFormik.isSubmitting}
                variant="contained"
                color="primary"
              >
                {t("auth.resetPassword.title")}
              </Button>
            </div>
          </form>
        )}

        {restorePasswordStatus === "RESETTED" && (
          <>
            <Typography align="center" variant="body1" gutterBottom>
              {t("auth.resetPassword.resettedPasswordText")}
            </Typography>
            <img
              width="100px"
              className="mt-5 mb-10 self-center"
              src={process.env.PUBLIC_URL + "/img/tick.svg"}
              alt="Confirm"
            />
            <div className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  pushInsideApp();
                }}
              >
                {t("auth.resetPassword.goToApp")}
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

export default RestorePassword;
