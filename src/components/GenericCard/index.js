import React from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import "./style.scss"

function ChartCard(props) {
    const { title, subtitle, classNameContent, showSubtitle } = props;
    const { t } = useTranslation();
    return (
        <div className="genericCard">
            <Card sx={{ width: props.width, padding: "15px" }}>
                <Typography variant="subtitle1">
                    <span style={{
                        fontWeight: "bold",
                    }}>
                        {t(title)}
                    </span>
                </Typography>
                {showSubtitle && <Typography variant="overline" gutterBottom >
                    <span style={{
                        color: "rgb(100, 100, 100)",
                    }}>
                        {subtitle ? t(subtitle) : <br />}
                    </span>
                </Typography>}
                <div className={classNameContent}>
                    {props.children}
                </div>
            </Card>
        </div>
    )
}
export default ChartCard