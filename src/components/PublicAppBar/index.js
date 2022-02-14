import React, { useContext, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import Tooltip from "@mui/material/Tooltip";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const { t } = useTranslation();
  useEffect(() => {
    if (props.title) themeContext.setTitle(props.title);
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Toolbar>
          {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
  </IconButton>*/}
          <img
            width="30px"
            className="mr-3"
            src={process.env.PUBLIC_URL + "/img/logos/shortLogo.svg"}
            alt="Main logo"
          />
          <Typography variant="h6" className={classes.title}>
            {t(props.title)}
          </Typography>
          <Tooltip title={t("publicAppBar.goToApp")}>
            <IconButton
              onClick={() => {
                history.push("/auth/login");
              }}
            >
              <ExitToAppOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {props.children}
    </div>
  );
}
