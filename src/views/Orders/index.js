import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import RoundLoader from "components/RoundLoader";
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';

function Orders(props) {
    const themeContext = useContext(ThemeContext);
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.orders", <MarkAsUnreadOutlinedIcon />);
    }, []);

    return (
        <div>

        </div>)
}

export default Orders;