import React from 'react';
import { useTranslation } from "react-i18next";
import GenericCard from "components/GenericCard";

function Orders(props) {
    const { t } = useTranslation();
    return (
        <GenericCard title={t("backtester.orders")}>

        </GenericCard>
    );
}

export default Orders;