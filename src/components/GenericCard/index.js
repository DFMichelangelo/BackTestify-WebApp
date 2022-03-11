import React from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useTranslation } from "react-i18next";
import classnames from 'classnames';
import "./style.scss"

function GenericCard(props) {
    const { title, subtitle, classNameContent, showSubtitle } = props;
    const { t } = useTranslation();
    return (

        <Card className="genericCard"
            sx={{
                padding: "15px",
                width: props.width ? props.width : "initial",
                height: "fit-content",
                margin: props?.margins?.magin ? props.margins.magin : "10px",
                //marginTop: props?.margins?.marginTop + "px !important",
                //marginBottom: props?.margins?.marginBottom + "px !important",
                //marginLeft: props?.margins?.marginLeft + "px !important",
                //marginRight: props?.margins?.marginRight + "px !important",

            }}>
            <Typography align="center" variant="subtitle1" gutterBottom>
                <span style={{
                    fontWeight: "bold",
                }}>
                    {t(title)}
                </span>
            </Typography>
            {
                showSubtitle && <Typography variant="overline" gutterBottom >
                    <span style={{
                        color: "rgb(100, 100, 100)",
                    }}>
                        {subtitle ? t(subtitle) : <br />}
                    </span>
                </Typography>
            }
            <div className={classnames(classNameContent, "genericCardChildren")}>
                {props.children}
            </div>
        </Card >
    )
}
export default GenericCard