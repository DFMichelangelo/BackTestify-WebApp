import React, { useContext } from "react";
import MuiAppBar from "@mui/material/AppBar";
import ToolbarUI from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import config from "configuration/config";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import ProfileButton from "theme/Header/ProfileButton";
import { styled } from '@mui/material/styles';

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' | prop !== 'matches',
})(({ theme, open, matches }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: config.theme.header.shadow
    ? "0px 10px 10px rgba(151, 151, 151, 0.1)"
    : "unset",
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen * 3.3,
  }),
  ...((open & !matches) && {
    marginLeft: config.theme.sidebar.drawerWidth,
    width: `calc(100% - ${config.theme.sidebar.drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen * 3,
    }),
  }),
}));

const IconButtonMenu = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'open' | prop !== 'matches',
})(({ theme, open, matches }) => ({
  marginRight: !matches ? '36px' : '0px',
  padding: "12px",
  ...(!matches && {
    opacity: 1,
    transition: theme.transitions.create(["margin", "opacity", "padding"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen * 3.3
    }),
    ...(open && {
      margin: 0,
      opacity: 0,
      padding: 0,
      transition: theme.transitions.create(["margin", "opacity", "padding"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen * 3.3,
      }),
    })
  }),
}));


function Header(props) {
  const themeContext = useContext(ThemeContext);
  const { handleDrawerOpenOnClick } = props;
  const { icon, title, headerVisible } = themeContext;
  const { t } = useTranslation();
  const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");
  if (!headerVisible) return null;
  return (
    <AppBar
      position="fixed"
      open={themeContext.sidebarOpen ? 1 : 0}
      matches={matches ? 1 : 0}
    >
      {
        title ? (
          <Helmet title={`${config.name.short} - ${t(title)}`} />
        ) : (
          <Helmet title={config.name.long} />
        )}

      <ToolbarUI
      //matches={matches ? true : undefined}
      //open={themeContext.sidebarOpen}
      >
        <IconButtonMenu
          color="inherit"
          open={themeContext.sidebarOpen ? 1 : 0}
          matches={matches ? 1 : 0}
          edge="start"
          onClick={handleDrawerOpenOnClick}
        >
          <MenuIcon />
        </IconButtonMenu>
        <span className="flex  items-center w-full">
          {icon}
          <span className="">
            <Typography
              variant="h6"
              sx={{
                ...(matches && { fontSize: "1.15rem" })
              }}
            >
              <span className="ml-2">
                {t(title)}
              </span>
            </Typography>
          </span>
          <ProfileButton />
        </span>
      </ToolbarUI>
    </AppBar >
  );
}

export default Header;