import React from 'react';
import GenericCard from "components/GenericCard";
import { useTranslation } from "react-i18next";
import FormikTextField from "components/FormikComponents/FormikTextField";


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
        </GenericCard>
    );
}

export default Portfolio;