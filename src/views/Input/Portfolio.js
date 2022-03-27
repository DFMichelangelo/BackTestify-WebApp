import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import FormikTextField from "components/FormikComponents/FormikTextField";
import { Typography } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
function Portfolio(props) {
    const { formikInstance } = props
    const { t } = useTranslation();

    return (
        <GenericCard title="backtester.portfolio" classNameContent="flex flex-col">
            <FormikTextField
                id="initialPortfolioValue"
                label={t("backtester.initialPortfolioValue")}
                type="number"
                formikInstance={formikInstance}
                size="small"
            />
            <Divider variant="middle" />
            <Typography variant="button" align="center" gutterBottom>
                {t("backtester.orderSize")}
            </Typography>
            <div className="flex items-center">
                <ToggleButtonGroup
                    id="orderSizeType"
                    color="primary"
                    value={formikInstance.values.orderSizeType}
                    exclusive
                    size="small"
                    onChange={(newValue) => formikInstance.setFieldValue("orderSizeType", newValue.target.value)}
                >
                    <ToggleButton key="absolute_value" value="absolute_value">123</ToggleButton>
                    <ToggleButton key="percentage" value="percentage">%</ToggleButton>
                </ToggleButtonGroup>
                <FormikTextField
                    fullWidth
                    formikInstance={formikInstance}
                    id="orderSizeAmount"
                    label={t("backtester.amount")}
                    type="number"
                    size="small"
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <span className={formikInstance.values.orderSizeType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                            </InputAdornment>
                    }}
                />
            </div>
        </GenericCard>
    );
}

export default Portfolio;