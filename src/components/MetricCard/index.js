import React from "react";

import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import GenericCard from 'components/GenericCard';
import "./style.scss"
function MetricCard(props) {
    const { title, subtitle, metricValue, classname, multiMetricData } = props;
    const [t, i18n] = useTranslation();
    return (
        <div className="metricCard">
            <GenericCard title={title} subtitle={subtitle} classname={classname} showSubtitle={multiMetricData ? false : true}>
                {multiMetricData ?
                    multiMetricData.map(value =>
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
        </div >
    )
}
export default MetricCard