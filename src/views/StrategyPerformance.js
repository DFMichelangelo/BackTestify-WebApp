import React from "react";
import MetricCard from "components/MetricCard";
import GenericCard from "components/GenericCard";
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

function StrategyPerformance(props) {
    return (<div className="flex flex-col w-full">
        <div className="flex flex-row">
            <MetricCard title="Sharpe Ratio" />
            <OverPeriodAnnualizedCard title="portfolioReturn" data={[0, 0]} />
            <OverPeriodAnnualizedCard title="portfolioVolatility" />
            <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingReturn" />
            <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingVolatility" />
            <OverPeriodAnnualizedCard title="alpha" subtitle="overPeriod" />
        </div>
        <div className="flex flex-row">

            <MetricCard title="ordersInfo" multiMetricData={[
                {
                    subtitle: "totalOrders",
                    metricValue: "0"
                }
                ,
                {
                    subsubtitle: "longOrders",
                    metrics: [{
                        subtitle: "absoluteValue",
                        metricValue: "0"
                    },
                    {
                        subtitle: "percentageValue",
                        metricValue: "0"
                    }]
                },
                {
                    subsubtitle: "shortOrders",
                    metrics: [{
                        subtitle: "absoluteValue",
                        metricValue: "0"
                    },
                    {
                        subtitle: "percentageValue",
                        metricValue: "0"
                    }]
                }
            ]
            } />
        </div>
        <div className="flex flex-row w-full">
            <ResponsiveContainer minWidth={"50%"} minHeight={400}>
                <LineChart data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer minWidth={"50%"} minHeight={400}>
                <LineChart data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>

        </div>
    </div>)
}

export default StrategyPerformance