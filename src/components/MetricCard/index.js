import React from "react";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import GenericCard from 'components/GenericCard';
import classnames from "classnames";

import "./style.scss"
function MetricCard(props) {
    const { title, subtitle, metricValue, classname, multiMetricData } = props;
    const { t } = useTranslation();
    return (

        <GenericCard title={title} subtitle={subtitle} width={props.width} classname={classnames("metricCard", classname)} showSubtitle={multiMetricData ? false : true}>
            {props.children}
            {multiMetricData ?
                multiMetricData.map((value, valueIndex) =>
                    <div key={valueIndex} className={classnames(valueIndex !== multiMetricData.length - 1 && "mb-2")}>
                        {value.subsubtitle ?
                            <span key={value.subtitle}>
                                <div className="text-center">
                                    <span style={{
                                        color: "rgb(100, 100, 100)",
                                        fontSize: "14px !important"
                                    }}>
                                        <Typography
                                            align="center" variant="button" gutterBottom >
                                            {t(value.subsubtitle)}</Typography></span></div>
                                <div className="flex flex-row">
                                    {value.metrics.map((metric, ind) =>
                                        <span key={metric.subtitle} className={classnames(ind !== value.metrics.length - 1 && "mr-2")}>
                                            <span className="flex flex-row">
                                                <span className="flex flex-col">
                                                    <Typography align="center" variant="overline" gutterBottom >
                                                        <span style={{
                                                            color: "rgb(100, 100, 100)",
                                                        }}>
                                                            {metric?.subtitle ? t(metric?.subtitle) : <br />}
                                                        </span>
                                                    </Typography>
                                                    <Typography align="center" variant="h6" >
                                                        <span style={{
                                                            fontWeight: "semi-bold",
                                                        }}>
                                                            {metric?.metricValue ? metric?.metricValue : "-"}
                                                        </span>
                                                    </Typography>
                                                </span>
                                                {ind < value.metrics.length - 1 && <span className="ml-1">
                                                    <Divider orientation="vertical" />
                                                </span>}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </span>
                            :
                            <span key={value.subtitle}><Typography variant="overline" gutterBottom >
                                <span style={{
                                    color: "rgb(100, 100, 100)",
                                }}>
                                    {value?.subtitle ? t(value?.subtitle) : <br />}
                                </span>
                            </Typography>
                                <Typography variant="h6" >
                                    <span style={{
                                        fontWeight: "semi-bold",
                                    }}>
                                        {value?.metricValue ? value?.metricValue : "-"}
                                    </span>
                                </Typography>
                            </span>
                        }</div>
                )
                :
                <Typography variant="h6" >
                    <span style={{
                        fontWeight: "semi-bold",
                    }}>
                        {metricValue ? metricValue : "-"}
                    </span>
                </Typography>}
        </GenericCard>
    )
}
export default MetricCard