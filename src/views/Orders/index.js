import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';

function Orders(props) {
    const themeContext = useContext(ThemeContext);

    useEffect(() => {
        themeContext.setTitle("backtester.orders", <MarkAsUnreadOutlinedIcon />);
    }, []);

    return (
        <div>

        </div>)
}

export default Orders;