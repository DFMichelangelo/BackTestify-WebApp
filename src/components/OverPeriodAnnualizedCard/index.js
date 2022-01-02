import React from "react";
import MetricCard from 'components/MetricCard';
import _ from "lodash"
function OverPeriodAnnualizedCard(props) {
    const { title, classname, data } = props;
    const multiMetricData = [
        {
            subtitle: "overPeriod",
            metricValue: _.get(data, "data[0]", undefined)
        },
        {
            subtitle: "annualized",
            metricValue: _.get(data, "data[1]", undefined)
        },
    ]
    return (
        <MetricCard title={title} classname={classname} multiMetricData={multiMetricData} />
    )
}
export default OverPeriodAnnualizedCard