import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import GenericCard from "components/GenericCard";
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, Brush, ComposedChart, Area, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import CustomTooltip from "components/ChartComponents/CustomTooltip";
import CustomLegend from "components/ChartComponents/CustomLegend";

import { fromTimestampToDateString } from "auxiliaries/dates";
function Benchmark(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("backtester.benchmark", <ShowChartOutlinedIcon />);
    }, []);

    let benchmarkPrices = [];
    let benchmarkReturns = [];
    let benchmarkReturnsDistribution = [];
    let benchmarkAcf = [];
    let benchmarkPacf = [];
    if (backtesterContext?.backtesterResults) {
        benchmarkPrices = backtesterContext?.backtesterResults?.raw_data.benchmark.map((price, index) => {
            return {
                date: backtesterContext?.backtesterResults?.raw_data.dates[index],
                price
            }
        })
        benchmarkReturns = backtesterContext?.backtesterResults?.analytics.benchmark.returns.map((returnValue, index) => {
            return {
                date: backtesterContext?.backtesterResults?.raw_data.dates[index],
                returnValue: returnValue * 100
            }
        })

        benchmarkReturnsDistribution = backtesterContext?.backtesterResults?.analytics.benchmark.returns_distribution.map((elem, index) => {
            return {
                bin_edge: 100 * elem.bin_edge,
                amount: elem.amount
            }
        })
        benchmarkAcf = backtesterContext?.backtesterResults?.analytics.benchmark.autocorrelation_function.values.map((autocorrelation, index) => {
            return {
                lag: index + 1,
                autocorrelation,
                confidenceInterval: backtesterContext?.backtesterResults?.analytics.benchmark.autocorrelation_function.confidence_intervals[index]
            }
        })

        benchmarkPacf = backtesterContext?.backtesterResults?.analytics.benchmark.partial_autocorrelation_function.values.map((partialAutocorrelation, index) => {
            return {
                lag: index + 1,
                partialAutocorrelation,
                confidenceInterval: backtesterContext?.backtesterResults?.analytics.benchmark.partial_autocorrelation_function.confidence_intervals[index]
            }
        })
    }


    let stdReturns = backtesterContext.backtesterResults.analytics.benchmark.returns_std * 100
    let meanReturns = backtesterContext.backtesterResults.analytics.benchmark.returns_mean * 100
    return (
        <div>
            <div className="flex flex-row w-full">
                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.absoluteReturn"
                    data={[backtesterContext?.backtesterResults?.analytics.benchmark.absolute_return_over_period.toFixed(2),
                    backtesterContext?.backtesterResults?.analytics.benchmark.absolute_return_annualized.toFixed(2)]} />

                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.percentageReturn"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.benchmark.percentage_return_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.benchmark.percentage_return_annualized).toFixed(2) + " %"]} />
                <OverPeriodAnnualizedCard
                    horizontal
                    title="backtester.percentageVolatility"
                    data={[(100 * backtesterContext?.backtesterResults?.analytics.benchmark.volatility_over_period).toFixed(2) + " %",
                    (100 * backtesterContext?.backtesterResults?.analytics.benchmark.volatility_annualized).toFixed(2) + " %"]} />
            </div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.timeseries" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart data={benchmarkPrices} >
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} tickFormatter={fromTimestampToDateString} />
                            <YAxis type="number" domain={['auto', 'auto']} />
                            <Line dot={false} type="monotone" dataKey="price" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>
                <GenericCard title="backtester.pricesDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart layout="vertical" data={backtesterContext?.backtesterResults?.analytics.benchmark.prices_distribution} >
                            <YAxis reversed={true} type="number" dataKey="bin_edge" domain={['auto', 'auto']} />
                            <XAxis type="number" />
                            <Bar dot={false} type="monotone" dataKey="amount" fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </BarChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>

            <div className="flex flex-row w-full">
                <MetricCard
                    title="backtester.returns"
                    width={"50%"}
                    horizontal
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
                        <BarChart data={benchmarkReturns} >
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceArea x1={benchmarkReturns[0].date} x2={benchmarkReturns[benchmarkReturns.length - 1].date} y1={meanReturns - stdReturns} y2={meanReturns + stdReturns} stroke="red" strokeOpacity={0.3} />
                            <ReferenceLine y={0} stroke="#000" />
                            <ReferenceLine y={meanReturns} stroke="green" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} tickFormatter={fromTimestampToDateString} />
                            <YAxis type="number" domain={['auto', 'auto']} />
                            <Bar unit={" %"} dataKey="returnValue" fill="#8884d8" barSize={1.5} />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </BarChart>
                    </ResponsiveContainer>

                </MetricCard>
                <GenericCard title="backtester.returnsDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart data={benchmarkReturnsDistribution} >
                            <XAxis type="number" unit={"%"} dataKey="bin_edge" domain={['auto', 'auto']} />
                            <YAxis type="number" />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceArea x1={meanReturns - stdReturns} x2={meanReturns + stdReturns} y1={0} y2={Math.max(...benchmarkReturnsDistribution.map(elem => elem.amount))} stroke="red" strokeOpacity={0.3} />
                            <Bar dataKey="amount" fill="#8884d8" />

                            <ReferenceLine x={0} stroke="#000" />
                            <ReferenceLine x={meanReturns} stroke="green" strokeDasharray="3 3" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </BarChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.autocorrelationFunction" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <ComposedChart data={benchmarkAcf}>
                            <XAxis dataKey="lag" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={0} stroke="#000" />
                            <Area type="monotone" dataKey="confidenceInterval" fill="#c3c1eb" stroke="#c3c1eb" />
                            <Bar dataKey="autocorrelation" fill="#8884d8" />
                            {CustomLegend()}
                            {CustomTooltip()}
                        </ComposedChart>
                    </ResponsiveContainer>
                </GenericCard>
                <GenericCard title="backtester.partialAutocorrelationFunction" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <ComposedChart data={benchmarkPacf}>
                            <XAxis dataKey="lag" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={0} stroke="#000" />
                            <Area type="monotone" dataKey="confidenceInterval" fill="#c3c1eb" stroke="#c3c1eb" />
                            <Bar dataKey="partialAutocorrelation" fill="#8884d8" />
                            {CustomLegend()}
                            {CustomTooltip()}
                        </ComposedChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
        </div>)
}

export default Benchmark;