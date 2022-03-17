import React from 'react';
import DatePicker from '@mui/lab/DatePicker';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { DateTime } from "luxon";
import FormikTextField from "components/FormikComponents/FormikTextField";

function FinancialInstruments(props) {
    const { formikInstance } = props
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.financialInstruments" classNameContent="flex flex-col" width="300px" margins={{
            margin: "0px",
            marginTop: "10px",
            marginBottom: "10px",
        }}>
            <div className="flex justify-center items-center">
                <ToggleButtonGroup
                    id="typeStartDate"
                    color="primary"
                    value={formikInstance.values.typeStartDate}
                    exclusive
                    size="small"
                    onChange={(newValue) => formikInstance.setFieldValue("typeStartDate", newValue.target.value)}
                >
                    <ToggleButton value="date">{t("backtester.date")}</ToggleButton>
                    <ToggleButton value="duration">{t("backtester.duration")}</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {formikInstance.values.typeStartDate === "duration" ?
                <div className="flex">
                    <FormikTextField
                        formikInstance={formikInstance}
                        style={{ width: "45%" }}
                        id="durationAmount"
                        size="small"
                        label={t("backtester.durationAmount")}
                        type="number"
                    />

                    <TextField
                        style={{ width: "45%" }}
                        select
                        id="durationType"
                        size="small"
                        onChange={(newValue) => formikInstance.setFieldValue("durationType", newValue.target.value)}
                        value={formikInstance.values.durationType}
                        label={t("backtester.durationType")}
                    >
                        <MenuItem value={"days"}>{t("backtester.days")}</MenuItem>
                        <MenuItem value={"months"}>{t("backtester.months")}</MenuItem>
                        <MenuItem value={"years"}>{t("backtester.years")}</MenuItem>
                    </TextField>
                </div>
                :
                <DatePicker
                    id="startDate"
                    label={t("backtester.startDate")}
                    //maxDate={DateTime.now().minus({ years: 1 })}
                    value={formikInstance.values.startDate}
                    onChange={(e) => formikInstance.setFieldValue("startDate", e)}
                    renderInput={(params) => <TextField {...params} size="small" />}
                />
            }
            <Divider variant="middle" />
            <DatePicker
                id="endDate"
                label={t("backtester.endDate")}
                //minDate={formikInstance.values.startDate}
                maxDate={DateTime.now().minus({ days: 1 })}
                value={formikInstance.values.endDate}
                onChange={(e) => formikInstance.setFieldValue("endDate", e)}
                renderInput={(params) => <TextField {...params} size="small" />}
            />

            <TextField
                select
                id="timeframe"
                size="small"
                onChange={(newValue) => formikInstance.setFieldValue("timeframe", newValue.target.value)}
                value={formikInstance.values.timeframe}
                label={t("backtester.timeframe")}
                disabled
            >
                <MenuItem value={"1h"}>{t("backtester.hourly")}</MenuItem>
                <MenuItem value={"1d"}>{t("backtester.daily")}</MenuItem>
            </TextField>

            <FormikTextField
                formikInstance={formikInstance}
                id="financialInstrumentName"
                label={t("backtester.financialInstrumentName")}
                size="small"
            />

            <FormikTextField
                formikInstance={formikInstance}
                id="benchmarkFinancialInstrumentName"
                label={t("backtester.benchmarkFinancialInstrumentName")}
                size="small"
            />
        </GenericCard>
    );
}

export default FinancialInstruments;