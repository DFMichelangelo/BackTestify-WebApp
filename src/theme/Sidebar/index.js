import React, { useContext } from "react";
import { styled, useTheme } from '@mui/material/styles';
import classnames from "classnames";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { makeStyles } from "@mui/styles";
import config from "configuration/config";
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import useMediaQuery from "@mui/material/useMediaQuery";
import Navigation from "./Navigation";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import CustomScrollbar from "components/CustomScrollbar";
import { useHistory } from "react-router-dom";

const openedMixin = (theme) => ({
  overflowY: "hidden",
  width: config.theme.sidebar.drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen * 3,
  }),
  overflowX: 'hidden',
});



const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen * 3,
  }),
  overflowX: 'hidden',
  overflowY: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});




const Drawer = styled(SwipeableDrawer, { shouldForwardProp: (prop) => prop !== 'openSB' & prop !== "matches" })(
  ({ theme, openSB, matches }) => ({
    width: config.theme.sidebar.drawerWidth,
    flexShrink: 0,
    ...matches && { zIndex: "1300 !important" }, // ? In order to let cookie consent visible
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(openSB && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!openSB && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const LogobarDiv = styled('div', { shouldForwardProp: (prop) => prop !== 'sidebarOpenedEvent' & prop !== "matches" })(
  (({ theme, sidebarOpenedEvent, matches }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent:
      (sidebarOpenedEvent === "click" & !matches) ? "space-between" : "center",
    padding: theme.spacing(0, 1),
    marginLeft: sidebarOpenedEvent === "click" ? 10 : 0,
    height: theme.mixins.toolbar.minHeight,
    //? necessary for content to be below app bar
    ...theme.mixins.toolbar,
  })));


const LogoImg = styled('img', { shouldForwardProp: (prop) => prop !== 'open' })(
  (({ theme, open }) => ({
    ...(!open && {
      opacity: 0,
      transition: theme.transitions.create(["opacity"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    })
  })))
function Sidebar(props) {
  const history = useHistory();
  const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");
  const {
    handleDrawerCloseOnHover,
    handleDrawerOpenOnHover,
    handleDrawerOpenOnClick,
    handleDrawerCloseOnClick,
  } = props;
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);

  return (
    <Drawer
      variant={matches ? "temporary" : "permanent"}
      onClose={handleDrawerCloseOnClick}
      onOpen={handleDrawerOpenOnClick}
      open={themeContext.sidebarOpen}
      openSB={themeContext.sidebarOpen ? 1 : 0}
      matches={matches ? 1 : 0}>


      <LogobarDiv
        id="logobar"
        sidebarOpenedEvent={themeContext.sidebarOpenedEvent}
        matches={matches ? 1 : 0}
      >
        <LogoImg
          open={themeContext.sidebarOpen ? 1 : 0}
          alt={"Logo"}
          onClick={() => {
            history.push("/");
          }}
          width={160}
          src={process.env.PUBLIC_URL + "/img/logos/longLogo.svg"}
        />
        {themeContext.sidebarOpen && (
          <>
            {themeContext.sidebarOpenedEvent === "click" && !matches && (
              <IconButton onClick={handleDrawerCloseOnClick}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </>
        )}
      </LogobarDiv>
      <Divider />

      <CustomScrollbar>
        <span
          onMouseEnter={handleDrawerOpenOnHover}
          onMouseLeave={handleDrawerCloseOnHover}
        >
          <Navigation />
        </span>
      </CustomScrollbar>

    </Drawer >
  );
}

export default Sidebar;
