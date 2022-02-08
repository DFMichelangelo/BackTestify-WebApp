import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import useFetch from "hooks/useFetch";
import { useTranslation } from "react-i18next";
import RoundLoader from "components/RoundLoader";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import GenericCard from "components/GenericCard";
import EnhancedTable from "components/EnhancedTable";

function Portfolio(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("backtester.portfolio", <AccountBalanceWalletOutlinedIcon />);
    }, []);

    const headCells = [
        {
            id: "date",
            label: t("backtester.date"),
        },
        {
            id: "liquidity",
            label: t("backtester.liquidity"),
        },
        {
            id: "assetsValue",
            label: t("backtester.assetsValue"),
        },
        {
            id: "totalValue",
            label: t("backtester.totalValue"),
            helpText: t("backtester.totalValueHelperText"),
        },
    ]

    let rows = [];
    if (backtesterContext?.backtesterResults?.raw_data?.portfolio_value_history)
        rows = backtesterContext?.backtesterResults?.raw_data?.portfolio_value_history.map(portfolio_row => {
            return {
                id: portfolio_row.date,
                date: {
                    value: portfolio_row.date,
                },
                liquidity: {
                    value: portfolio_row.liquidity.toFixed(2),
                },
                assetsValue: {
                    value: portfolio_row.assets_value.toFixed(2),
                },
                totalValue: {
                    value: (portfolio_row.liquidity + portfolio_row.assets_value).toFixed(2),

                },
            }
        })



    return (
        <div>
            <GenericCard>
                <EnhancedTable
                    headCells={headCells}
                    rows={rows}
                    readOnly
                    dense
                    rowsPerPage={25}
                    showFilters={false}
                    showSearchbar={false}
                />
            </GenericCard>
        </div>)
}

export default Portfolio;