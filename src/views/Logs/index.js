import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

function Logs(props) {
    const themeContext = useContext(ThemeContext);

    useEffect(() => {
        themeContext.setTitle("backtester.logs", <ListAltOutlinedIcon />);
    }, []);


    return (
        <div>

        </div>)
}

export default Logs;