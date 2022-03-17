import React from 'react';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import Checkbox from '@mui/material/Checkbox';
import FormikTextField from "components/FormikComponents/FormikTextField";
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import PercentageAbsoluteValueToggleButtons from "components/PercentageAbsoluteValueToggleButtons/index";
function Commissions(props) {
    const { formikInstance } = props
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.commissions" classNameContent="flex flex-col">
            <span className="tbd">

                <FormControlLabel
                    id="commissionsOnOrderFillEnabled"
                    control={<Checkbox />}
                    label={t("backtester.onOrderFill")}
                    checked={formikInstance.values.commissionsOnOrderFillEnabled}
                    onChange={newValue => formikInstance.setFieldValue("commissionsOnOrderFillEnabled", newValue.target.checked)}
                />
                <div className="flex items-center">
                    <ToggleButtonGroup
                        id="commissionsOnOrderFillType"
                        color="primary"
                        value={formikInstance.values.commissionsOnOrderFillEnabled ? formikInstance.values.commissionsOnOrderFillType : ""}
                        exclusive
                        size="small"
                        disabled={!formikInstance.values.commissionsOnOrderFillEnabled}
                        onChange={(newValue) => formikInstance.setFieldValue("commissionsOnOrderFillType", newValue.target.value)}
                    >
                        {PercentageAbsoluteValueToggleButtons}
                    </ToggleButtonGroup>
                    <FormikTextField
                        fullWidth
                        size="small"
                        formikInstance={formikInstance}
                        id="commissionsOnOrderFillAmount"
                        label={t("backtester.commissionsPerOrder")}
                        type="number"
                        disabled={!formikInstance.values.commissionsOnOrderFillEnabled}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <span className={formikInstance.values.commissionsOnOrderFillType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                                </InputAdornment>
                        }}
                    />
                </div>
                <Divider variant="middle" />


                <FormControlLabel
                    id="commissionsOvernightEnabled"
                    control={<Checkbox />}
                    label={t("backtester.overnight")}
                    checked={formikInstance.values.commissionsOvernightEnabled}
                    onChange={newValue => formikInstance.setFieldValue("commissionsOvernightEnabled", newValue.target.checked)}
                />
                <div className="flex items-center">
                    <ToggleButtonGroup
                        id="commissionsOvernightType"
                        color="primary"
                        value={formikInstance.values.commissionsOvernightEnabled ? formikInstance.values.commissionsOvernightType : ""}
                        exclusive
                        size="small"
                        disabled={!formikInstance.values.commissionsOvernightEnabled}
                        onChange={(newValue) => formikInstance.setFieldValue("commissionsOvernightType", newValue.target.value)}
                    >
                        {PercentageAbsoluteValueToggleButtons}
                    </ToggleButtonGroup>
                    <FormikTextField
                        fullWidth
                        size="small"
                        formikInstance={formikInstance}
                        id="commissionsOvernightAmount"
                        label={t("backtester.commissionsPerOrder")}
                        type="number"
                        disabled={!formikInstance.values.commissionsOvernightEnabled}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <span className={formikInstance.values.commissionsOvernightType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                                </InputAdornment>
                        }}
                    />
                </div>
            </span>
        </GenericCard>
    );
}

export default Commissions;