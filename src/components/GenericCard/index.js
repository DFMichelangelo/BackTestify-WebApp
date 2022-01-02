import React from "react";
import classnames from "classnames";
import Card from '@mui/material/Card';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import "./style.scss"

function ChartCard(props) {
    const { title, subtitle, classname, showSubtitle } = props;
    const [t, i18n] = useTranslation();
    return (
        <div className={classnames("genericCard", classname)}>
            <Card sx={{ width: "fit-content", padding: "15px" }}>
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
                {props.children}
            </Card>
        </div>
    )
}
export default ChartCard