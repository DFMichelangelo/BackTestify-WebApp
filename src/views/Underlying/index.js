import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import GenericCard from "components/GenericCard";
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, ComposedChart, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import { max } from "lodash";



function Underlying(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("backtester.timeseries", <ShowChartOutlinedIcon />);
    }, []);

    let underlyingPrices = [];
    let underlyingReturns = [];
    let underlyingReturnsDistribution = [];
    if (backtesterContext?.backtesterResults) {
        underlyingPrices = backtesterContext?.backtesterResults?.raw_data.underlying.map((price, index) => {
            return {
                date: index,
                price
            }
        })
        underlyingReturns = backtesterContext?.backtesterResults?.analytics.underlying.returns.map((returnValue, index) => {
            return {
                date: index,
                returnValue: returnValue * 100
            }
        })

        underlyingReturnsDistribution = backtesterContext?.backtesterResults?.analytics.underlying.returns_distribution.map((elem, index) => {
            return {
                bin_edge: 100 * elem.bin_edge,
                amount: elem.amount
            }
        })
    }
    console.log(underlyingReturnsDistribution)
    let stdReturns = backtesterContext.backtesterResults.analytics.underlying.returns_std * 100
    let meanReturns = backtesterContext.backtesterResults.analytics.underlying.returns_mean * 100
    return (
        <div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.timeseries" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart data={underlyingPrices} >
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} />
                            <YAxis type="number" name={t("backtester.price")} domain={['auto', 'auto']} />
                            <Line dot={false} type="monotone" dataKey="price" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>
                <GenericCard title="backtester.pricesDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart layout="vertical" data={backtesterContext?.backtesterResults?.analytics.underlying.prices_distribution} >
                            <YAxis reversed={true} type="number" dataKey="bin_edge" domain={['auto', 'auto']} />
                            <XAxis type="number" name={t("backtester.timeseries")} />
                            <Bar dot={false} type="monotone" dataKey="amount" fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
            <div className="flex flex-row w-full">
                <OverPeriodAnnualizedCard
                    title="backtester.underlyingAbsoluteReturn"
                    data={[backtesterContext?.backtesterResults?.analytics.underlying.absolute_return_over_period.toFixed(2),
                    backtesterContext?.backtesterResults?.analytics.underlying.absolute_return_annualized.toFixed(2)]} />

                <OverPeriodAnnualizedCard
                    title="backtester.underlyingPercentageReturn"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.underlying.percentage_return_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.underlying.percentage_return_over_period).toFixed(2) + " %"]} />
                <OverPeriodAnnualizedCard
                    title="backtester.underlyingPercentageVolatility"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.underlying.volatility_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.underlying.volatility_annualized).toFixed(2) + " %"]} />
            </div>
            <div className="flex flex-row w-full">
                <MetricCard title="backtester.returns" width={"50%"}
                    multiMetricData={[
                        {
                            subtitle: "backtester.mean",
                            metricValue: meanReturns.toFixed(2) + "%"
                        },
                        {
                            subtitle: "backtester.standardDeviation",
                            metricValue: stdReturns.toFixed(2) + "%"
                        }]}
                >
                    <ResponsiveContainer minHeight={300} >
                        <BarChart data={underlyingReturns} >
                            <ReferenceArea x1={0} x2={underlyingReturns.length - 1} y1={meanReturns - stdReturns} y2={meanReturns + stdReturns} stroke="red" strokeOpacity={0.3} />
                            <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" isFront={true} strokeWidth={2} />
                            <ReferenceLine y={meanReturns} stroke="green" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} />
                            <YAxis type="number" name={t("backtester.returns")} unit={"%"} domain={['auto', 'auto']} />
                            <Bar dataKey="returnValue" fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </MetricCard>
                <GenericCard title="backtester.returnsDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart data={underlyingReturnsDistribution} >
                            <XAxis type="number" unit={"%"} dataKey="bin_edge" domain={['auto', 'auto']} />
                            <YAxis type="number" name={t("backtester.returnsDistribution")} />
                            <Bar dataKey="amount" fill="#8884d8" />
                            <ReferenceArea x1={meanReturns - stdReturns} x2={meanReturns + stdReturns} y1={0} y2={max(underlyingReturnsDistribution.map(elem => elem.amount) - 2)} stroke="red" strokeOpacity={0.3} />
                            <ReferenceLine x={0} stroke="red" strokeDasharray="3 3" isFront={true} strokeWidth={2} />
                            <ReferenceLine x={meanReturns} stroke="green" strokeDasharray="3 3" />

                            <CartesianGrid stroke="#ccc" />
                            <Tooltip />
                            <Legend />
                        </BarChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
        </div>)
}

export default Underlying;