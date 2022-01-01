import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTranslation } from "react-i18next";

import Button from '@mui/material/Button';
import "./style.scss";


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
  };
}

function Backtester(props) {
  const themeContext = useContext(ThemeContext);
  const [t, i18n] = useTranslation();
  useEffect(() => {
    themeContext.setTitle("Backtester", <AccessTimeOutlinedIcon />);
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="backtester">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={t("backtester.input")} {...a11yProps(0)} />
            <Tab label={t("backtester.timeseriesAnalytics")} {...a11yProps(1)} />
            <Tab label={t("backtester.backtestPerformance")} {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Input>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
      </Box>
    </div>
  );
}

export default Backtester;
