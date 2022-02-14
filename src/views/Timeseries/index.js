import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';

function Timeseries(props) {
    const themeContext = useContext(ThemeContext);

    useEffect(() => {
        themeContext.setTitle("backtester.timeseries", <ShowChartOutlinedIcon />);
    }, []);


    return (
        <div>

        </div>)
}

export default Timeseries;