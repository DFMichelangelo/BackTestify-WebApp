import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import GenericCard from "components/GenericCard";
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, ComposedChart, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import CustomLegend from 'components/ChartComponents/CustomLegend';
import CustomTooltip from "components/ChartComponents/CustomTooltip";
import { fromTimestampToDateString } from "auxiliaries/dates";

function Portfolio(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.portfolio", <AccountBalanceWalletOutlinedIcon />);
    }, []);


    let portfolioValue = [];

    if (backtesterContext?.backtesterResults) {
        portfolioValue = backtesterContext?.backtesterResults?.raw_data.benchmark.map((benchmarkAssetValue, index) => {
            const liquidity = index >= backtesterContext?.backtesterResults.amount_of_data_for_strategy_from_today
                ? backtesterContext?.backtesterResults?.raw_data.portfolio_value_history[index - backtesterContext?.backtesterResults?.amount_of_data_for_strategy_from_today].liquidity
                : backtesterContext?.backtesterResults?.analytics.portfolio.initial_value
            const assetsValue = index >= backtesterContext?.backtesterResults.amount_of_data_for_strategy_from_today ? backtesterContext?.backtesterResults?.raw_data.portfolio_value_history[index - backtesterContext?.backtesterResults?.amount_of_data_for_strategy_from_today].assets_value : 0;
            return {
                date: backtesterContext?.backtesterResults?.raw_data.dates[index],
                liquidity,
                assetsValue,
                benchmarkAssetValue,
                totalPortfolioValue: liquidity + assetsValue
            }
        })
    }
    return (
        <div>
            <div className="flex flex-row">
                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.absoluteReturn"
                    data={[backtesterContext?.backtesterResults?.analytics.portfolio.absolute_return_over_period.toFixed(2),
                    backtesterContext?.backtesterResults?.analytics.portfolio.absolute_return_annualized.toFixed(2)]} />

                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.percentageReturn"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.portfolio.percentage_return_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.portfolio.percentage_return_annualized).toFixed(2) + " %"]} />
                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.percentageVolatility"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.portfolio.volatility_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.portfolio.volatility_annualized).toFixed(2) + " %"]} />

            </div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.portfolioValue" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart minHeight={300} data={portfolioValue} >
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={portfolioValue?.[0].liquidity}
                                label={portfolioValue?.[0].liquidity}
                                stroke="red" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" domain={['auto', 'auto']} tickFormatter={fromTimestampToDateString} />
                            <YAxis yAxisId={0} type="number" domain={['auto', 'auto']} />
                            <YAxis yAxisId={1} orientation="right" type="number" domain={['auto', 'auto']} />
                            <Line yAxisId={0} dot={false} type="monotone" dataKey="totalPortfolioValue" stroke="#8884d8" />
                            <Line yAxisId={1} dot={false} type="monotone" dataKey="benchmarkAssetValue" stroke="#8d8" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>

                <GenericCard title="backtester.portfolioLiquidity" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart minHeight={300} data={portfolioValue} >
                            <ReferenceLine y={portfolioValue[0].liquidity}
                                label={portfolioValue[0].liquidity}
                                stroke="red" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" domain={['auto', 'auto']} tickFormatter={fromTimestampToDateString} />
                            <XAxis type="number" dataKey="date" />
                            <YAxis type="number" domain={['auto', 'auto']} />
                            <Line dot={false} type="monotone" dataKey="liquidity" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>

        </div>)
}

export default Portfolio;