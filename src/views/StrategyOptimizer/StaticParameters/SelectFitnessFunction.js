import React from 'react';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

function SelectFitnessFunction(props) {
    const { formikInstance, fitnessFunctions } = props;
    const { t } = useTranslation();
    return (
        <GenericCard title={t("backtester.selectFitnessFunction")} width="fit-content">
            <TextField
                select
                id="fitnessFunction"
                size="small"
                onChange={(newValue) => formikInstance.setFieldValue("fitnessFunction", newValue.target.value)}
                value={formikInstance.values.fitnessFunction}
                label={t("backtester.fitnessFunction")}
                sx={{ width: "90%" }}
            >
                {fitnessFunctions?.map(fitFunc => <MenuItem value={fitFunc} key={fitFunc}>{fitFunc}</MenuItem>)}

            </TextField>
        </GenericCard>
    );
}

export default SelectFitnessFunction;