import React from "react";
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import RawOnOutlinedIcon from '@mui/icons-material/RawOnOutlined';
const SidebarMenu = [
  {
    type: "group",
    id: "backtester.backtester",
    children: [
      {
        type: "item",
        id: "backtester.input",
        to: "/p/backtester/input",
        icon: <InputOutlinedIcon />,
        exact: true,
      },
      {
        type: "item",
        id: "backtester.orders",
        to: "/p/backtester/orders",
        icon: <MarkAsUnreadOutlinedIcon />,
        exact: true,
      },
      {
        type: "item",
        id: "backtester.portfolio",
        to: "/p/backtester/portfolio",
        icon: <AccountBalanceWalletOutlinedIcon />,
        exact: true,
      },
      {
        type: "item",
        id: "backtester.performance",
        to: "/p/backtester/performance",
        icon: <SpeedOutlinedIcon />,
        exact: true,
      },
      {
        type: "item",
        id: "backtester.logs",
        to: "/p/backtester/logs",
        icon: <ListAltOutlinedIcon />,
        exact: true,
      },
      {
        type: "collapse",
        id: "backtester.rawData",
        icon: <RawOnOutlinedIcon />,
        children: [{
          type: "item",
          id: "backtester.orders",
          to: "/p/backtester/orders",
          icon: <MarkAsUnreadOutlinedIcon />,
          exact: true,
        },
        {
          type: "item",
          id: "backtester.portfolio",
          to: "/p/backtester/portfolio",
          icon: <AccountBalanceWalletOutlinedIcon />,
          exact: true,
        },]
      }
    ]
  },
  /*{
    id: "divider1",
    type: "divider",
  },*/
];

export default SidebarMenu;
