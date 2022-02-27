import React from "react";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import GenericCard from 'components/GenericCard';
import classnames from "classnames";

import "./style.scss"
function MetricCard(props) {
    const { title, subtitle, metricValue, classname, multiMetricData, horizontal } = props;
    const { t } = useTranslation();
    return (

        <GenericCard title={title} subtitle={subtitle} width={props.width} classname={classnames("metricCard", classname)} showSubtitle={multiMetricData ? false : true}>
            {props.children}
            {multiMetricData ?
                <div className={classnames(horizontal && "flex")}>
                    {multiMetricData.map((value, valueIndex) =>
                        <div key={valueIndex} className={classnames((valueIndex !== multiMetricData.length - 1 && !horizontal) && "mb-3", (valueIndex !== multiMetricData.length - 1 && horizontal) && "mr-2 ")}>
                            {value.metrics ?
                                <span key={value.subtitle}>
                                    <div className="text-center">
                                        <span style={{
                                            color: "rgb(100, 100, 100)",
                                            fontSize: "14px !important"
                                        }}>
                                            <Typography
                                                align="center" variant="button" >
                                                {t(value.subtitle)}</Typography>
                                        </span>
                                    </div>
                                    <div key={value.subtitle + "_"} className="flex flex-row justify-center">
                                        {value.metrics.map((metric, ind) =>
                                            <span key={metric.subsubtitle + "__"} className={classnames(ind !== value.metrics.length - 1 && "mr-2")}>
                                                <span className="flex flex-row">
                                                    <span className="flex flex-col">
                                                        <Typography align="center" variant="overline" >
                                                            <span style={{
                                                                color: "rgb(100, 100, 100)",
                                                            }}>
                                                                {metric?.subsubtitle ? t(metric?.subsubtitle) : <br />}
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
                                                    {ind < value.metrics.length - 1 && <span className="ml-2">
                                                        <Divider orientation="vertical" />
                                                    </span>}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                </span>
                                :
                                <span key={value.subtitle}><Typography variant="overline" align={horizontal ? "center" : "left"}>
                                    <span style={{
                                        color: "rgb(100, 100, 100)",
                                    }}>
                                        {value?.subtitle ? t(value?.subtitle) : <br />}
                                    </span>
                                </Typography>
                                    <Typography variant="h6" align={horizontal ? "center" : "left"}>
                                        <span style={{
                                            fontWeight: "semi-bold",
                                        }}>
                                            {value?.metricValue ? value?.metricValue : "-"}
                                        </span>
                                    </Typography>
                                </span>
                            }</div>
                    )}
                </div>
                :
                <Typography variant="h6" >
                    <span style={{
                        fontWeight: "semi-bold",
                    }}>
                        {metricValue ? metricValue : "-"}
                    </span>
                </Typography>
            }
        </GenericCard >
    )
}
export default MetricCard