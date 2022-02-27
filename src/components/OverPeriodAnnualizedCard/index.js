import React from "react";
import MetricCard from 'components/MetricCard';

function OverPeriodAnnualizedCard(props) {
    const { title, classname, data, horizontal } = props;
    const multiMetricData = [
        {
            subtitle: "backtester.overPeriod",
            metricValue: data?.[0]
        },
        {
            subtitle: "backtester.annualized",
            metricValue: data?.[1]
        },
    ]
    return (
        <MetricCard title={title} horizontal={horizontal} classname={classname} multiMetricData={multiMetricData} />
    )
}
export default OverPeriodAnnualizedCard