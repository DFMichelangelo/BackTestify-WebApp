import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { Trans, useTranslation } from "react-i18next";
import "./style.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};


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
        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
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
