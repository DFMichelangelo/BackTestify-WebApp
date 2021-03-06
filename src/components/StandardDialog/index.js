import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { Formik, Form } from "formik";
import TextField from "@mui/material/TextField";
import classnames from "classnames";
import _ from "lodash";
import PropTypes from "prop-types";
import "./style.scss";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function StandardDialog(props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { t } = useTranslation();
  useEffect(() => {
    createValidationSchema();
  }, []);

  const hideDialog = (formikBag) => () => {
    const { onClose } = themeContext.dialog;
    setMoreOpen(false);
    if (onClose) onClose();
    themeContext.hideDialog();
    formikBag.resetForm();
  };

  const onConfirm = (values, formikBag) => {
    const { onConfirm } = themeContext.dialog;
    if (onConfirm) onConfirm(values.text);
    themeContext.hideDialog();
    formikBag.resetForm();
  };

  let validationSchema;
  const createValidationSchema = () => {
    validationSchema = Yup.object().shape({
      text: Yup.string().min(5).required(),
    });

    return validationSchema;
  };

  const createButtons = (formikBag, showMoreInfo) => {
    let buttons = [];
    const { additionalButtons, type } = themeContext.dialog;
    if (Array.isArray(additionalButtons)) {
      for (let i = 0; i < additionalButtons.length; i++) {
        const single = additionalButtons[i];
        buttons.push(
          <Button
            key={single.text}
            className={classnames(single.className)}
            onClick={single.onClick}
            disabled={single.disabled}
          >
            {single.text}
          </Button>
        );
      }
    }
    if (showMoreInfo) {
      buttons.push(
        <Button
          key="2"
          className="more-info"
          onClick={() => setMoreOpen(!moreOpen)}
        >
          {moreOpen ? "Show less" : "More info"}
        </Button>
      );
    }

    if (type === "confirm") {
      buttons.push(
        <Button key="3" className="close" onClick={hideDialog(formikBag)}>
          {t("cancel")}
        </Button>
      );
      buttons.push(
        <Button key="4" className="ok" type="submit">
          {t("ok")}
        </Button>
      );
    } else {
      // Success, error, ....
      buttons.push(
        <Button key="5" className="close" onClick={hideDialog(formikBag)}>
          {t("close")}
        </Button>
      );
    }

    return buttons;
  };

  const {
    open,
    type,
    icon,
    modal,
    inputIcon,
    inputlabel,
    err,
  } = themeContext.dialog;
  let { title, message, moreInfo } = themeContext.dialog;

  let showMoreInfo = Boolean(moreInfo);
  //-------------------------- Error handling -------------------------
  if (err) {
    // qui ho un errore
    let mex = _.get(err, "data.message");
    if (mex) message = mex;
    let stack = _.get(err, "data.stack");
    if (stack) {
      showMoreInfo = true;
      moreInfo = stack;
    } else {
      showMoreInfo = true;
      moreInfo = _.get(err, "status") + " - " + _.get(err, "statusText");
    }
    if (!message) {
      message = t("unknownError");
      showMoreInfo = false;
      moreInfo = null;
    }
  }
  //------------------------- Icon -------------------------------------
  let realIcon = null;
  if (!icon) {
    // Routes su type
    switch (type) {
      case "error":
        realIcon = <ErrorOutlineOutlinedIcon className="iconTitleColor" />;
        break;
      case "success":
        realIcon = (
          <CheckCircleOutlineOutlinedIcon className="iconTitleColor" />
        );
        break;
      case "info":
      case "confirm":
        realIcon = <InfoOutlinedIcon className="iconTitleColor" />;
        break;
      case "warning":
        realIcon = <ReportProblemOutlinedIcon className="iconTitleColor" />;
        break;
      default:
        realIcon = "";
    }
  } else {
    realIcon = icon;
  }

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={onConfirm}
      validationSchema={validationSchema}
      initialValues={{
        text: "",
      }}>
      {(formikBag) => {
        const buttons = createButtons(formikBag, showMoreInfo);
        return (
          <Form>
            <Dialog
              open={Boolean(open)}
              onClose={modal ? null : hideDialog(formikBag)}
              scroll="paper"
              maxWidth="md"
              className={classnames("standard-dialog input", type)}
            >
              <DialogTitle className="title">
                <span>{realIcon}</span>
                <span className="text">{title}</span>
              </DialogTitle>
              <DialogContent className="content">
                <DialogContentText className="content-text">
                  {message}
                </DialogContentText>
                {type === "confirm" && (
                  <div className="flex justify-center pl-2 pr-2">
                    <TextField
                      name="text"
                      label={inputlabel}
                      icon={inputIcon}
                    />
                  </div>
                )}
                {moreOpen && <div className="more-info">{moreInfo}</div>}
              </DialogContent>
              <DialogActions>{buttons}</DialogActions>
            </Dialog>
          </Form>
        );
      }}
    </Formik>
  );
}

StandardDialog.propTypes = {
  additionalButtons: PropTypes.array,
  cb: PropTypes.func,
  onConfirm: PropTypes.func,
  err: PropTypes.object,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  message: PropTypes.string,
  modal: PropTypes.bool,
  moreMessage: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  open: PropTypes.bool,
};

StandardDialog.defaultProps = {
  inputIcon: <EditOutlinedIcon />,
  inputlabel: "",
  additionalButtons: undefined,
  err: undefined,
  icon: <AddOutlinedIcon className="iconTitleColor" />,
  message: "",
  modal: false,
  moreMessage: "",
  title: "",
  type: "",
  open: false,
  onConfirm: undefined,
};

export default StandardDialog;
