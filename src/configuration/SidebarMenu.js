import React from "react";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
const SidebarMenu = [
  {
    type: "item",
    id: "Backtester",
    to: "/backtester",
    icon: <AccessTimeOutlinedIcon />,
    exact: true,
  },
  {
    id: "divider1",
    type: "divider",
  },
];

export default SidebarMenu;
