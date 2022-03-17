import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from "react-i18next";
import GenericCard from "components/GenericCard";
import TextField from '@mui/material/TextField';
function Broker(props) {
    const { formikInstance } = props
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.broker">
            <span className="tbd">
                <div className="flex flex-col">
                    <TextField
                        select
                        id="orderFractioning"
                        size="small"
                        onChange={(newValue) => formikInstance.setFieldValue("orderFractioning", newValue.target.value)}
                        value={formikInstance.values.orderFractioning}
                        label={t("backtester.orderFractioning")}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={0.1}>0.1</MenuItem>
                        <MenuItem value={0.01}>0.01</MenuItem>
                        <MenuItem value={0}>{t("backtester.fluidFractioning")}</MenuItem>
                    </TextField>

                    <TextField
                        select
                        id="minimumOrderSize"
                        size="small"
                        onChange={(newValue) => formikInstance.setFieldValue("minimumOrderSize", newValue.target.value)}
                        value={formikInstance.values.minimumOrderSize}
                        label={t("backtester.minimumOrderSize")}
                    >
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={0.1}>0.1</MenuItem>
                        <MenuItem value={0.01}>0.01</MenuItem>
                        <MenuItem value={0}>{t("backtester.noMinimumSize")}</MenuItem>
                    </TextField>
                </div>
            </span>
        </GenericCard>
    );
}

export default Broker;