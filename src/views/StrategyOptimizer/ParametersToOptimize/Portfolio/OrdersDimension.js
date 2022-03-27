import React from 'react';
import { useTranslation } from "react-i18next";
import ToggleButton from '@mui/material/ToggleButton';
function OrdersDimension(props) {
    const { formikInstance } = props
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.portfolio" classNameContent="flex flex-col">
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

export default OrdersDimension;