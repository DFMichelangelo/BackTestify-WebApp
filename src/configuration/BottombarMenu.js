import React from "react";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
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
