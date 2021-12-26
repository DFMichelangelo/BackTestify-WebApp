import React, { useContext } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import BottomNavigation from "theme/BottomNavigation";
import config from "configuration/config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from '@mui/material/styles';


export default function Theme(props) {
  const themeContext = useContext(ThemeContext);
  const handleDrawerCloseOnHover = () => isOpen(false, "hover");
  const handleDrawerOpenOnHover = () => isOpen(true, "hover");
  const handleDrawerOpenOnClick = () => isOpen(true, "click");
  const handleDrawerCloseOnClick = () => isOpen(false, "click");
  const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");

  const theme = useTheme();
  const isOpen = (value, openType) => {
    if (
      themeContext.sidebarOpenedEvent === "click" &&
      openType == "hover" &&
      themeContext.sidebarOpen === true
    )
      return;
    themeContext.setSidebarOpen(value);
    themeContext.setSidebarOpenedEvent(openType);
  };

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  return (
    <div className="flex h-full">
      {config.theme.header.enabled && (
        <Header handleDrawerOpenOnClick={handleDrawerOpenOnClick} />
      )}
      {themeContext.showSidebarComponents(matches) && (
        <Sidebar
          handleDrawerOpenOnHover={handleDrawerOpenOnHover}
          handleDrawerCloseOnHover={handleDrawerCloseOnHover}
          handleDrawerCloseOnClick={handleDrawerCloseOnClick}
          handleDrawerOpenOnClick={handleDrawerOpenOnHover}
        />
      )}
      <div className="w-full h-full overflow-x-hidden">
        <div className="contentHeight">
          <DrawerHeader />
          {props.children}
        </div>
        <div>
          {config.theme.bottomNavigation.enabled && <BottomNavigation />}
        </div>
      </div>
    </div>
  );
}
