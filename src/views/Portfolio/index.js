import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import GenericCard from "components/GenericCard";
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, ComposedChart, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
function Portfolio(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.portfolio", <AccountBalanceWalletOutlinedIcon />);
    }, []);


    let portfolioValue = [];
    if (backtesterContext?.backtesterResults) {
        portfolioValue = backtesterContext?.backtesterResults?.raw_data.portfolio_value_history.map((portfolioValue, index) => {
            return {
                ...portfolioValue,
                date: index, // TODO - provsional
                underlyingAssetValue: backtesterContext?.backtesterResults?.raw_data.underlying[index],
                totalPortfolioValue: portfolioValue.liquidity + portfolioValue.assets_value
            }
        }
        )
    }

    return (
        <div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.portfolioValue" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart minHeight={300} data={portfolioValue} >
                            <ReferenceLine y={portfolioValue?.[0].liquidity}
                                label={portfolioValue?.[0].liquidity}
                                stroke="red" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" />
                            <YAxis yAxisId={0} type="number" name={t("backtester.totalPortfolioValue")} domain={['auto', 'auto']} />
                            <YAxis yAxisId={1} orientation="right" type="number" name={t("backtester.underlyingAssetValue")} domain={['auto', 'auto']} />
                            <Line yAxisId={0} dot={false} type="monotone" dataKey="totalPortfolioValue" stroke="#8884d8" />
                            <Line yAxisId={1} dot={false} type="monotone" dataKey="underlyingAssetValue" stroke="#8d8" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>

                <GenericCard title="backtester.portfolioLiquidity" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart minHeight={300} data={portfolioValue} >
                            <ReferenceLine y={portfolioValue[0].liquidity}
                                label={portfolioValue[0].liquidity}
                                stroke="red" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" />
                            <XAxis type="number" dataKey="date" />
                            <YAxis type="number" name={t("backtester.portfolioLiquidity")} domain={['auto', 'auto']} />
                            <Line dot={false} type="monotone" dataKey="liquidity" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
            <div>
                <div className="flex flex-row">
                    <OverPeriodAnnualizedCard
                        title="backtester.portfolioAbsoluteReturn"
                        data={[backtesterContext?.backtesterResults?.analytics.portfolio.absolute_return_over_period.toFixed(2),
                        backtesterContext?.backtesterResults?.analytics.portfolio.absolute_return_annualized.toFixed(2)]} />

                    <OverPeriodAnnualizedCard
                        title="backtester.portfolioPercentageReturn"
                        data={[(100 * backtesterContext?.backtesterResults?.analytics.portfolio.percentage_return_over_period).toFixed(2) + " %",
                        (100 * backtesterContext?.backtesterResults?.analytics.portfolio.percentage_return_over_period).toFixed(2) + " %"]} />
                    <OverPeriodAnnualizedCard
                        title="backtester.portfolioPercentageVolatility"
                        data={[(100 * backtesterContext?.backtesterResults?.analytics.portfolio.volatility_over_period).toFixed(2) + " %",
                        (100 * backtesterContext?.backtesterResults?.analytics.portfolio.volatility_annualized).toFixed(2) + " %"]} />
                    {/*<MetricCard title="Sharpe Ratio" />

                    <OverPeriodAnnualizedCard title="portfolioVolatility" />
                    <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingReturn" />
                    <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingVolatility" />
    <OverPeriodAnnualizedCard title="alpha" subtitle="overPeriod" />*/}
                </div>
            </div>
        </div>)
}

export default Portfolio;