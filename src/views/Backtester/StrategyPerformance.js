import React from "react";
import MetricCard from "components/MetricCard";
import GenericCard from "components/GenericCard";
import OverPeriodAnnualizedCard from "components/OverPeriodAnnualizedCard";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{ name: 'Page A', uv: 800, pv: 400, amt: 1400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 700, pv: 400, amt: 4400 }];
function StrategyPerformance(props) {
    return (<div className="flex flex-col">
        <div className="flex flex-row">
            <MetricCard title="Sharpe Ratio" />
            <OverPeriodAnnualizedCard title="portfolioReturn" data={[0, 0]} />
            <OverPeriodAnnualizedCard title="portfolioVolatility" />
            <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingReturn" />
            <OverPeriodAnnualizedCard title="buyAndHoldUnderlyingVolatility" />
            <OverPeriodAnnualizedCard title="alpha" subtitle="overPeriod" />
        </div>
        <div className="flex flex-row">
            <GenericCard title="equityLine">
                <LineChart width={500} height={400} data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </GenericCard>
            <GenericCard title="drawdown">
                <LineChart width={500} height={400} data={data}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </GenericCard>
        </div>
    </div>)
}

export default StrategyPerformance