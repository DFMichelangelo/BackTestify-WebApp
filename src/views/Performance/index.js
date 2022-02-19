import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import MetricCard from "components/MetricCard";
import { useTranslation } from "react-i18next";
import { BarChart, Area, ComposedChart, AreaChart, Bar, ReferenceLine, ReferenceArea, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import GenericCard from "components/GenericCard";
import CustomLegend from 'components/ChartComponents/CustomLegend';
import CustomTooltip from "components/ChartComponents/CustomTooltip";

function Performance(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();
    useEffect(() => {
        themeContext.setTitle("backtester.performance", <SpeedOutlinedIcon />);
    }, []);

    let equityLineValue = [];
    if (backtesterContext?.backtesterResults) {
        let portfolioInitialValue = backtesterContext?.backtesterResults?.raw_data.portfolio_value_history[0].liquidity
        equityLineValue = backtesterContext?.backtesterResults?.raw_data.portfolio_value_history.map((portfolioValue, index) => {
            return {
                date: index, // TODO - provsional
                underlyingAssetValue: backtesterContext?.backtesterResults?.raw_data.underlying[index],
                equityValue: portfolioValue.liquidity + portfolioValue.assets_value - portfolioInitialValue
            }
        })
    }
    const gradientOffset = () => {
        const dataMax = Math.max(...equityLineValue.map((i) => i.equityValue));
        const dataMin = Math.min(...equityLineValue.map((i) => i.equityValue));

        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();
    console.log(off);
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-row w-full">
                <MetricCard title="backtester.sharpeRatio" multiMetricData={[
                    {
                        subtitle: "backtester.annualized",
                        metricValue: backtesterContext.backtesterResults.analytics.performance.sharpe_ratio_annualized.toFixed(2),
                    }]} />
                <MetricCard title="backtester.sortinoRatio" multiMetricData={[
                    {
                        subtitle: "backtester.annualized",
                        metricValue: undefined,
                    }]} />
                <MetricCard title="backtester.calmarRatio" multiMetricData={[
                    {
                        subtitle: "backtester.annualized",
                        metricValue: undefined,
                    }]} />
                <MetricCard title="backtester.alpha" multiMetricData={[
                    {
                        subtitle: "backtester.annualized",
                        metricValue: undefined,
                    }]} />
                <MetricCard title="backtester.vsBuyAndHoldUnderlying" multiMetricData={[
                    {
                        subtitle: "backtester.annualized",
                        metricValue: undefined,
                    }]} />
                {/*
    <OverPeriodAnnualizedCard title="alpha" subtitle="overPeriod" />*/}
            </div>
            <div className="flex flex-row w-full">
                <GenericCard title="backtester.equityLine" width={"50%"}>
                    <ResponsiveContainer minHeight={300} >
                        <ComposedChart minHeight={300} data={equityLineValue} >
                            <CartesianGrid stroke="#ccc" />
                            <ReferenceLine y={0}
                                label={0}
                                stroke="red" strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="date" />
                            <YAxis yAxisId={0} type="number" domain={['auto', 'auto']} />
                            <YAxis yAxisId={1} orientation="right" type="number" domain={['auto', 'auto']} />

                            <defs>
                                <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset={off} stopColor="green" stopOpacity={1} />
                                    <stop offset={off} stopColor="red" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <Area yAxisId={0} dot={false} type="monotone" dataKey="equityValue" stroke="#8884d8" fill="url(#splitColor)" />
                            <Line yAxisId={1} dot={false} type="monotone" dataKey="underlyingAssetValue" stroke="purple" />
                            {CustomTooltip()}
                            {CustomLegend()}
                        </ComposedChart>
                    </ResponsiveContainer>
                </GenericCard>
            </div>
        </div>)
}

export default Performance;