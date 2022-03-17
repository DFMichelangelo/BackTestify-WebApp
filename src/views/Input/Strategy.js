import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import GenericCard from "components/GenericCard";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Divider from '@mui/material/Divider';
import FormikTextField from "components/FormikComponents/FormikTextField";
import TextField from '@mui/material/TextField';
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
function Strategy(props) {
    const { formikInstance, setValidationTrigger, setStrategySelected, setInitialValues, validationSchema, setDisableButton, strategies, strategySelected } = props;
    const { t } = useTranslation();
    return (
        <GenericCard title="backtester.strategy" classNameContent="flex flex-col">
            <div className="flex justify-center items-center">
                <ToggleButtonGroup
                    id="ordersPositionsLimitations"
                    color="primary"
                    value={formikInstance.values.ordersPositionsLimitations}
                    exclusive
                    size="small"
                    onChange={(newValue) => formikInstance.setFieldValue("ordersPositionsLimitations", newValue.target.value)}
                >
                    <ToggleButton value="long_only">
                        {t("backtester.longOnly")}
                    </ToggleButton>
                    <ToggleButton value="no_limitations">
                        {t("backtester.noLimitations")}
                    </ToggleButton>
                    <ToggleButton value="short_only">
                        {t("backtester.shortOnly")}
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>
            {formikInstance.values.ordersPositionsLimitations == "no_limitations" &&
                <FormControlLabel
                    sx={{ marginTop: 1 }}
                    control={
                        <Switch
                            checked={formikInstance.values.openNewOrderOnContrarianSignal}
                            onChange={(e) => formikInstance.setFieldValue("openNewOrderOnContrarianSignal", e.target.checked)}
                        />}
                    label={<Typography variant="body2" gutterBottom>{t("backtester.openNewOrderOnContrarianSignal")}</Typography>} />
            }

            <Divider variant="middle" />
            <TextField
                select
                id="strategy"
                size="small"
                onChange={(newValue) => {
                    setValidationTrigger(false);
                    setStrategySelected(newValue.target.value)
                    let obj = {}
                    newValue.target.value.indicators_parameters_config.map(indicator => obj[indicator.name] = indicator.default_value)
                    setInitialValues({
                        initial: { ...formikInstance.values, strategy: newValue.target.value },
                        additional: obj
                    })
                    validationSchema.isValid(
                        {
                            ...formikInstance.values,
                            strategy: newValue.target.value,
                            ...obj
                        }
                    ).then((e) => {
                        setDisableButton(!e)
                        setValidationTrigger(true);
                    });
                }
                }
                value={formikInstance.values.strategy}
                label={t("backtester.strategy")}
            >
                {strategies.map((strategy) => <MenuItem key={strategy.name} value={strategy}>{strategy.name}</MenuItem>)}
            </TextField>

            {strategySelected?.indicators_parameters_config && strategySelected.indicators_parameters_config.map(indicator_config =>
                <FormikTextField
                    size="small"
                    triggerAfterTouch
                    key={indicator_config.name}
                    formikInstance={formikInstance}
                    id={indicator_config.name}
                    label={indicator_config.name}
                    type="number"
                />
            )}
        </GenericCard>
    );
}

export default Strategy;