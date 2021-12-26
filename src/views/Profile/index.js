import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import "./style.scss";
import LanguageBox from "./LanguageBox";
import ProfileBox from "./ProfileBox";
import DisableUserBox from "./DisableAccountBox";
import ChangePasswordBox from "./ChangePasswordBox";
import DoNotRememberPassword from "./DoNotRememberPassword";
import _ from "lodash";
import TopSide from "./TopSide";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { Trans } from "react-i18next";
import TabPanel from "components/TabPanel";
import UploadProfileImageBox from "./UploadProfileImageBox";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";


const useStyles = makeStyles((theme) => ({
  rootTabs: {
    marginLeft: 10,
    marginRight: 10,
    borderBottom: "1px solid #E0E0E0",
    marginTop: 30,
  },
  tab: {
    textTransform: "unset",
  },
  appBarBase: {
    boxShadow: "unset",
  },
  indicator: {
    backgroundColor: theme.palette.primary.main,
    height: 4,
  },
}));

function Profile(props) {
  const themeContext = useContext(ThemeContext);
  const [value, setValue] = useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => setValue(newValue);

  useEffect(() => {
    themeContext.setTitle("profile.profile", <PersonOutlineOutlinedIcon />);
  }, []);

  return (
    <div className="profile flex flex-col">
      <TopSide />
      <div className={classes.rootTabs}>
        <AppBar
          color="transparent"
          position="static"
          className={classes.appBarBase}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              className={classes.tab}
              label={
                <Typography variant="h6">
                  <Trans>profile.profile</Trans>
                </Typography>
              }
            />
            <Tab
              className={classes.tab}
              label={
                <Typography variant="h6">
                  <Trans>Account</Trans>
                </Typography>
              }
            />
          </Tabs>
        </AppBar>
      </div>
      <TabPanel value={value} index={0}>
        <div className=" profileTab flex">
          <div className="leftBox flex flex-col w-3/6">
            <ProfileBox />
            <ChangePasswordBox />
          </div>
          <div className="rightBox flex flex-col w-3/6">
            <UploadProfileImageBox />
            <LanguageBox />
            <DoNotRememberPassword />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="accountTab flex">
          <div className="leftBox flex flex-col w-3/6">
            <DisableUserBox />
          </div>
          <div className="rightBox flex flex-col w-3/6">
          </div>
        </div>
      </TabPanel>
    </div>
  );
}
export default Profile;
