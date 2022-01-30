import React from "react";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
const SidebarMenu = [
  {
    type: "item",
    id: "backtester.backtester",
    to: "/p/backtester",
    icon: <AccessTimeOutlinedIcon />,
    exact: true,
  },
  {
    id: "divider1",
    type: "divider",
  },
];

export default SidebarMenu;
