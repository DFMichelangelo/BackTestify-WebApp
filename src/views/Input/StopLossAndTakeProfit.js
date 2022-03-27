import React, { useEffect, useState } from 'react';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormikTextField from "components/FormikComponents/FormikTextField";
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';
import { Typography } from "@mui/material";
function StopLossAndTakeProfit(props) {
    const { formikInstance } = props;
    const { t } = useTranslation();
    const [showRewardRiskRatio, setShowRewardRiskRatio] = useState(true);
    useEffect(() => {
        setShowRewardRiskRatio(((formikInstance.values.stopLossEnabled && formikInstance.values.takeProfitEnabled)
            && (formikInstance.values.stopLossType == formikInstance.values.takeProfitType) && (formikInstance.values.stopLossAmount && formikInstance.values.takeProfitAmount)))
    }, [formikInstance.values.stopLossEnabled, formikInstance.values.takeProfitEnabled, formikInstance.values.stopLossType, formikInstance.values.takeProfitType, formikInstance.values.stopLossAmount, formikInstance.values.takeProfitAmount]);
    return (
        <GenericCard title="backtester.stopLossAndTakeProfit">

            <FormControlLabel
                id="takeProfitEnabled"
                control={<Checkbox />}
                label={t("backtester.takeProfitEnabled")}
                checked={formikInstance.values.takeProfitEnabled}
                onChange={newValue => formikInstance.setFieldValue("takeProfitEnabled", newValue.target.checked)}
            />

            <div className="flex items-center">
                <ToggleButtonGroup
                    id="takeProfitType"
                    color="primary"
                    value={formikInstance.values.takeProfitEnabled ? formikInstance.values.takeProfitType : ""}
                    exclusive
                    size="small"
                    disabled={!formikInstance.values.takeProfitEnabled}
                    onChange={(newValue) => formikInstance.setFieldValue("takeProfitType", newValue.target.value)}
                >
                    <ToggleButton key="absolute_value" value="absolute_value">123</ToggleButton>
                    <ToggleButton key="percentage" value="percentage">%</ToggleButton>
                </ToggleButtonGroup>
                <FormikTextField
                    fullWidth
                    size="small"
                    formikInstance={formikInstance}
                    id="takeProfitAmount"
                    label={t("backtester.takeProfitAmount")}
                    type="number"
                    disabled={!formikInstance.values.takeProfitEnabled}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <span className={formikInstance.values.takeProfitType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                            </InputAdornment>
                    }}
                />
            </div>
            <FormControlLabel

                id="stopLossEnabled"
                control={<Checkbox />}
                label={t("backtester.stopLossEnabled")}
                checked={formikInstance.values.stopLossEnabled}
                onChange={newValue => formikInstance.setFieldValue("stopLossEnabled", newValue.target.checked)}
            />

            <div className="flex items-center">
                <ToggleButtonGroup
                    id="stopLossType"
                    color="primary"
                    value={formikInstance.values.stopLossEnabled ? formikInstance.values.stopLossType : ""}
                    exclusive
                    size="small"
                    disabled={!formikInstance.values.stopLossEnabled}
                    onChange={(newValue) => formikInstance.setFieldValue("stopLossType", newValue.target.value)}
                >
                    <ToggleButton key="absolute_value" value="absolute_value">123</ToggleButton>
                    <ToggleButton key="percentage" value="percentage">%</ToggleButton>
                </ToggleButtonGroup>
                <FormikTextField
                    fullWidth
                    size="small"
                    formikInstance={formikInstance}
                    id="stopLossAmount"
                    label={t("backtester.stopLossAmount")}
                    type="number"
                    disabled={!formikInstance.values.stopLossEnabled}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <span className={formikInstance.values.stopLossType == "percentage" ? "opacity-100" : "opacity-0"}>%</span>
                            </InputAdornment>
                    }}
                />
            </div>
            {/*            <span className={classnames(showRewardRiskRatio ? "visible" : "invisible")}>*/}
            {showRewardRiskRatio &&
                <Typography align="center" variant="body1" >
                    {t("backtester.rewardToRiskRatio") + ": " + (-formikInstance.values.takeProfitAmount / formikInstance.values.stopLossAmount).toFixed(2)}
                </Typography>}
            {/*</span>*/}
        </GenericCard>
    );
}

export default StopLossAndTakeProfit;