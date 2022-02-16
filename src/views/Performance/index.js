import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import MetricCard from "components/MetricCard";


function Performance(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    useEffect(() => {
        themeContext.setTitle("backtester.performance", <SpeedOutlinedIcon />);
    }, []);


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
        </div>)
}

export default Performance;