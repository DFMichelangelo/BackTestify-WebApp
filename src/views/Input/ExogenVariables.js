import React from 'react';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import FormikTextField from "components/FormikComponents/FormikTextField";
import InputAdornment from '@mui/material/InputAdornment';

function ExogenVariables(props) {
    const { formikInstance } = props;
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.exogenVariables" classNameContent="flex flex-col">
            <FormikTextField
                formikInstance={formikInstance}
                id="riskFreeRate"
                size="small"
                label={t("backtester.riskFreeRate")}
                type="number"
                InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
            />
        </GenericCard>
    );
}

export default ExogenVariables;