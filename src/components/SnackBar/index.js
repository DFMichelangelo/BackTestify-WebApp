import React, { useContext } from "react";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SnackBar(props) {
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { t } = useTranslation();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    themeContext.hideSnackbar();
  };

  const handleClick = () => {
    const { onClick, link } = themeContext.snackbar.button;
    if (typeof onClick === "function") onClick();
    else if (link.startsWith("http")) {
      const win = window.open(link, "_blank");
      win.focus();
    } else {
      history.push(link);
    }
  };

  return (
    <Snackbar
      open={themeContext.snackbar.open}
      autoHideDuration={themeContext.snackbar.autoHideDuration}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={handleClose}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={themeContext.snackbar.type}
        action={
          themeContext.snackbar.button && (
            <Button color="inherit" size="small" onClick={handleClick}>
              {t(themeContext.snackbar.button.text)}
            </Button>
          )
        }
      >
        <div className="flex">
          {t(themeContext.snackbar.message)}
        </div>
      </Alert>
    </Snackbar>
  );
}

export default SnackBar;
