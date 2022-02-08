import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import RoundLoader from "components/RoundLoader";
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

function Logs(props) {
    const themeContext = useContext(ThemeContext);
    const { t } = useTranslation();
    const { fetch, loading, data } = useFetch();

    useEffect(() => {
        themeContext.setTitle("backtester.logs", <ListAltOutlinedIcon />);
    }, []);


    if (loading) return <RoundLoader />;
    return (
        <div>

        </div>)
}

export default Logs;