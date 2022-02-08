import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import RoundLoader from "components/RoundLoader";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';

function Portfolio(props) {
    const themeContext = useContext(ThemeContext);
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.portfolio", <AccountBalanceWalletOutlinedIcon />);
    }, []);


    return (
        <div>

        </div>)
}

export default Portfolio;