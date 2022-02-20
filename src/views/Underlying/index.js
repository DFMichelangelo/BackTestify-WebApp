import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import GenericCard from "components/GenericCard";
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, Brush, ComposedChart, Area, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import customTooltip from "components/ChartComponents/CustomTooltip";
import customLegend from "components/ChartComponents/CustomLegend";

function Underlying(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("backtester.underlying", <ShowChartOutlinedIcon />);
    }, []);

    let underlyingPrices = [];
    let underlyingReturns = [];
    let underlyingReturnsDistribution = [];
    let underlyingAcf = [];
    let underlyingPacf = [];
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
        underlyingAcf = backtesterContext?.backtesterResults?.analytics.underlying.autocorrelation_function.autocorrelation.map((autocorrelation, index) => {
            return {
                lag: index + 1,
                autocorrelation,
                confidenceInterval: backtesterContext?.backtesterResults?.analytics.underlying.autocorrelation_function.confidence_intervals[index]
            }
        })

        underlyingPacf = backtesterContext?.backtesterResults?.analytics.underlying.partial_autocorrelation_function.partialAutocorrelation.map((partialAutocorrelation, index) => {
            return {
                lag: index + 1,
                partialAutocorrelation,
                confidenceInterval: backtesterContext?.backtesterResults?.analytics.underlying.partial_autocorrelation_function.confidence_intervals[index]
            }
        })
    }


    let stdReturns = backtesterContext.backtesterResults.analytics.underlying.returns_std * 100
    let meanReturns = backtesterContext.backtesterResults.analytics.underlying.returns_mean * 100

    return (
        <div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.timeseries" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <LineChart data={underlyingPrices} >
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} />
                            <YAxis type="number" domain={['auto', 'auto']} />
                            <Line dot={false} type="monotone" dataKey="price" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            {customTooltip()}
                            {customLegend()}
                        </LineChart>
                    </ResponsiveContainer>
                </GenericCard>
                <GenericCard title="backtester.pricesDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart layout="vertical" data={backtesterContext?.backtesterResults?.analytics.underlying.prices_distribution} >
                            <YAxis reversed={true} type="number" dataKey="bin_edge" domain={['auto', 'auto']} />
                            <XAxis type="number" />
                            <Bar dot={false} type="monotone" dataKey="amount" fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            {customTooltip()}
                            {customLegend()}
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
                    (100 * backtesterContext?.backtesterResults?.analytics.underlying.percentage_return_annualized).toFixed(2) + " %"]} />
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
                        <BarChart data={underlyingReturns}>
                            <XAxis type="number" dataKey="date" domain={['dataMin', 'dataMax']} />
                            <YAxis type="number" unit={"%"} domain={['auto', 'auto']} />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceArea x1={0} x2={underlyingReturns.length - 1} y1={meanReturns - stdReturns} y2={meanReturns + stdReturns} stroke="red" strokeOpacity={0.3} />
                            <ReferenceLine y={0} stroke="#000" />
                            <ReferenceLine y={meanReturns} stroke="green" strokeDasharray="3 3" />

                            <Bar unit={" %"} dataKey="returnValue" fill="#8884d8" />
                            {customTooltip()}
                            {customLegend()}
                        </BarChart>
                    </ResponsiveContainer>
                </MetricCard>
                <GenericCard title="backtester.returnsDistribution" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <BarChart data={underlyingReturnsDistribution} >
                            <XAxis type="number" unit={"%"} dataKey="bin_edge" domain={['auto', 'auto']} />
                            <YAxis type="number" />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceArea x1={meanReturns - stdReturns} x2={meanReturns + stdReturns} y1={0} y2={Math.max(...underlyingReturnsDistribution.map(elem => elem.amount))} stroke="red" strokeOpacity={0.3} />
                            <Bar dataKey="amount" fill="#8884d8" />

                            <ReferenceLine x={0} stroke="#000" />
                            <ReferenceLine x={meanReturns} stroke="green" strokeDasharray="3 3" />
                            {customTooltip()}
                            {customLegend()}
                        </BarChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.autocorrelationFunction" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <ComposedChart data={underlyingAcf}>
                            <XAxis dataKey="lag" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={0} stroke="#000" />
                            <Area type="monotone" dataKey="confidenceInterval" fill="#c3c1eb" stroke="#c3c1eb" />
                            <Bar dataKey="autocorrelation" fill="#8884d8" />
                            {customLegend()}
                            {customTooltip()}
                        </ComposedChart>
                    </ResponsiveContainer>
                </GenericCard>
                <GenericCard title="backtester.partialAutocorrelationFunction" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <ComposedChart data={underlyingPacf}>
                            <XAxis dataKey="lag" />
                            <YAxis />
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={0} stroke="#000" />
                            <Area type="monotone" dataKey="confidenceInterval" fill="#c3c1eb" stroke="#c3c1eb" />
                            <Bar dataKey="partialAutocorrelation" fill="#8884d8" />
                            {customLegend()}
                            {customTooltip()}
                        </ComposedChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
        </div>)
}

export default Underlying;