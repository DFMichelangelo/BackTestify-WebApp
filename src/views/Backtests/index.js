import React, { useEffect, useContext, useState } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import GenericCard from "components/GenericCard";
import EnhancedTable from "components/EnhancedTable";
import Endpoints from "Endpoints";
import RestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import useFetch from "hooks/useFetch";
import RoundLoader from "components/RoundLoader";
import { fromTimestampToDateString } from "auxiliaries/dates";

function CreateStrategy(props) {
    const themeContext = useContext(ThemeContext);
    const { data, fetch, loading } = useFetch()
    const { t } = useTranslation();

    const loadData = async () => {
        await fetch({
            url: Endpoints.backtester.getAllBacktests,
            baseUrl: process.env.REACT_APP_BACKTESTER_ENGINE_URL,
            method: "GET",
        })
    }
    useEffect(() => {
        themeContext.setTitle("backtester.backtests", <RestorePageOutlinedIcon />);
        loadData()
    }, []);
    const headCells = [
        {
            id: "startDate",
            label: t("backtester.startDate"),
        },
        {
            id: "endDate",
            label: t("backtester.endDate"),
        },
        {
            id: "strategy",
            label: t("backtester.strategy"),
        },
        {
            id: "financialInstrumentName",
            label: t("backtester.financialInstrumentName"),
        },
        {
            id: "timeframe",
            label: t("backtester.timeframe"),
        },
        {
            id: "percentageReturnAnnualized",
            label: t("backtester.percentageReturnAnnualized"),
        },
        {
            id: "volatilityAnnualized",
            label: t("backtester.volatilityAnnualized"),
        },
        {
            id: "maxDrawdown",
            label: t("backtester.maxDrawdown"),
        },
        {
            id: "sharpeRatioAnnualized",
            label: t("backtester.sharpeRatioAnnualized"),
        },
    ]

    if (loading) return <RoundLoader />
    const rows = data.map(backtest => {
        return {
            id: backtest._id,
            startDate: { value: fromTimestampToDateString(backtest.input.start_date) },
            endDate: { value: fromTimestampToDateString(backtest.input.end_date) },
            strategy: { value: backtest.input.strategy_name },
            financialInstrumentName: { value: backtest.input.input_data.financial_instrument_name },
            timeframe: { value: backtest.input.input_data.timeframe },
            percentageReturnAnnualized: { value: (100 * backtest.result.analytics.portfolio.percentage_return_annualized).toFixed(2), symbol: "%" },
            volatilityAnnualized: { value: (100 * backtest.result.analytics.portfolio.volatility_annualized).toFixed(2), symbol: "%" },
            maxDrawdown: { value: (100 * backtest.result.analytics.portfolio.drawdown.max_drawdown).toFixed(2), symbol: "%" },
            sharpeRatioAnnualized: { value: backtest.result.analytics.performance.sharpe_ratio_annualized.toFixed(2) },
        }
        //creationPrice: { value: order.creation_price.toFixed(2) },
        //openDate: { value: fromTimestampToDateString(order.open_date) },
        //openPrice: { value: order.open_price.toFixed(2) },
        //position: { value: order.position },
        //size: { value: order.size },
        //status: { value: order.status },
        //stopLossPrice: { value: order.stop_loss_price.toFixed(2) },
        //takeProfitPrice: { value: order.take_profit_price.toFixed(2) },
        //value: { value: order.value.toFixed(2) },
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
                    showFilters={true}
                    showSearchbar={false}
                />
            </GenericCard>
        </div>)
}

export default CreateStrategy;