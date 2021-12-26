import React from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CallToActionOutlinedIcon from "@mui/icons-material/CallToActionOutlined";

const SidebarMenu = [
  {
    type: "item",
    id: "Dashboard",
    to: "/dashboard",
    icon: <DashboardOutlinedIcon />,
    exact: true,
  },
  {
    id: "divider1",
    type: "divider",
  },
  {
    type: "item",
    id: "Helpers",
    to: "/helpers",
    icon: <CallToActionOutlinedIcon />,
    exact: true,
  },
];

export default SidebarMenu;
