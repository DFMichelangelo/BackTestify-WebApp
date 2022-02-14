import React from "react";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
const BottombarMenu = [
  {
    id: "profile.profile",
    to: "/account/profile",
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    id: "dashboard.dashboard",
    to: "/dashboard",
    icon: <DashboardOutlinedIcon />,
  },
];
export default BottombarMenu;
