import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import Checkbox from '@mui/material/Checkbox';
import FormikTextField from "components/FormikComponents/FormikTextField";
import { useTranslation } from "react-i18next";
import FormControlLabel from '@mui/material/FormControlLabel';

function StrategyOptimizer(props) {
    const { formikInstance } = props;
    const themeContext = useContext(ThemeContext);
    const { t } = useTranslation();

    return (
        <div className="parameterToOptimize flex items-center">
            <FormControlLabel control={<Checkbox />} label="Lorem ipsum dolor sit amet" />
            <FormikTextField
                formikInstance={formikInstance}
                style={{ width: 150 }}
                //id="durationAmount"
                size="small"
                label={t("backtester.initialValue")}
                type="number"
            />
            <FormikTextField
                formikInstance={formikInstance}
                style={{ width: 150 }}
                //id="durationAmount"
                size="small"
                label={t("backtester.finalValue")}
                type="number"
            />
            <FormikTextField
                formikInstance={formikInstance}
                style={{ width: 150 }}
                //id="durationAmount"
                size="small"
                label={t("backtester.stepValue")}
                type="number"
            />
        </div>
    );
}

export default StrategyOptimizer;
