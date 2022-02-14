import React, { useContext, useState } from "react";
import { Card, CardContent, CardHeader, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import "./style.scss";
import CardActions from "@mui/material/CardActions";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InputAdornment from "@mui/material/InputAdornment";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import useFetch from "hooks/useFetch";
import Endpoints from "Endpoints";


function ChangePasswordBox(props) {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(
    false
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [disableChangeButton, setDisableChangeButton] = useState(true);
  const { fetch } = useFetch();

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(),
    password: Yup.string().required().min(8),
  });

  const changePasswordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
    },
    onSubmit: async (values, formikBag) => {
      try {
        await fetch({
          method: "PUT",
          url: Endpoints.auth.passwordReset,
          data: {
            currentPassword: values.currentPassword,
            password: values.password,
          },
        });
        handleClose();
        formikBag.resetForm();
        themeContext.showSuccessSnackbar({
          message: t("profile.passwordChanged"),
        });
      } catch (e) {
        if (e?.status < 500)
          themeContext.showErrorSnackbar({
            message: t("profile.passwordIsWrong"),
          });
      }
    },
    validationSchema,
    validate: (values) => {
      validationSchema.isValid(values).then((e) => setDisableChangeButton(!e));
    },
  });

  const handleClose = () => {
    setOpenChangePasswordDialog(false);
    changePasswordFormik.resetForm();
  };

  return (
    <>
      <Dialog
        open={openChangePasswordDialog}
        onClose={handleClose}
        className="p-5"
      >
        <DialogTitle id="form-dialog-title">
          {t("profile.changePassword")}
        </DialogTitle>
        <form onSubmit={changePasswordFormik.handleSubmit}>
          <DialogContent>
            <DialogContentText>
              {t("profile.changePasswordText")}
            </DialogContentText>

            <TextField
              variant="outlined"
              id="currentPassword"
              label={t("profile.currentPassword")}
              type={passwordVisible ? "text" : "password"}
              value={changePasswordFormik.values.currentPassword}
              onBlur={changePasswordFormik.handleBlur}
              onChange={changePasswordFormik.handleChange}
              error={
                changePasswordFormik.touched.currentPassword &&
                Boolean(changePasswordFormik.errors.currentPassword)
              }
              helperText={
                changePasswordFormik.touched.currentPassword &&
                t(changePasswordFormik.errors.currentPassword)
              }
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    >
                      {passwordVisible ? (
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
              variant="outlined"
              id="password"
              label={t("profile.newPassword")}
              type={passwordVisible ? "text" : "password"}
              fullWidth
              onBlur={changePasswordFormik.handleBlur}
              value={changePasswordFormik.values.password}
              error={
                changePasswordFormik.touched.password &&
                Boolean(changePasswordFormik.errors.password)
              }
              helperText={
                changePasswordFormik.touched.password &&
                t(changePasswordFormik.errors.password)
              }
              onChange={changePasswordFormik.handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setPasswordVisible(!passwordVisible);
                      }}
                    >
                      {passwordVisible ? (
                        <VisibilityOutlinedIcon />
                      ) : (
                        <VisibilityOffOutlinedIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              {t("profile.back")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={disableChangeButton}
            >
              {t("profile.change")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Card id="changePasswordBox">
        <CardHeader title={t("profile.changePassword")} />
        <CardContent className="flex flex-col">
          <div>
            {t("profile.changePasswordText")}
          </div>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            onClick={() => {
              setOpenChangePasswordDialog(true);
            }}
          >
            {t("profile.changeYourPassword")}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default ChangePasswordBox;
