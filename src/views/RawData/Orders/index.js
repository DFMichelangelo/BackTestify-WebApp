import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { useTranslation } from "react-i18next";
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import GenericCard from "components/GenericCard";
import EnhancedTable from "components/EnhancedTable";
import { fromTimestampToDateString } from "auxiliaries/dates";
function Orders(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);
    const { t } = useTranslation();

    useEffect(() => {
        themeContext.setTitle("backtester.orders", <MarkAsUnreadOutlinedIcon />);
    }, []);

    const headCells = [
        { id: "closeDate", label: t("backtester.closeDate") },
        { id: "closePrice", label: t("backtester.closePrice") },
        { id: "creationDate", label: t("backtester.creationDate") },
        { id: "creationPrice", label: t("backtester.creationPrice") },
        { id: "openDate", label: t("backtester.openDate") },
        { id: "openPrice", label: t("backtester.openPrice") },
        { id: "position", label: t("backtester.position") },
        { id: "size", label: t("backtester.size") },
        { id: "status", label: t("backtester.status") },
        { id: "stopLossPrice", label: t("backtester.stopLossPrice") },
        { id: "takeProfitPrice", label: t("backtester.takeProfitPrice") },
        { id: "value", label: t("backtester.value") },
    ]

    let rows = [];
    if (backtesterContext?.backtesterResults?.raw_data?.orders)
        rows = backtesterContext?.backtesterResults?.raw_data?.orders.map(order => {
            return {
                id: order.ID,
                closeDate: { value: fromTimestampToDateString(order.close_date) },
                closePrice: { value: order.close_price.toFixed(2) },
                creationDate: { value: fromTimestampToDateString(order.creation_date) },
                creationPrice: { value: order.creation_price.toFixed(2) },
                openDate: { value: fromTimestampToDateString(order.open_date) },
                openPrice: { value: order.open_price.toFixed(2) },
                position: { value: order.position },
                size: { value: order.size },
                status: { value: order.status },
                stopLossPrice: { value: order.stop_loss_price.toFixed(2) },
                takeProfitPrice: { value: order.take_profit_price.toFixed(2) },
                value: { value: order.value.toFixed(2) },

            }
        })
    return (
        <div>
            <GenericCard>
                <EnhancedTable
                    headCells={headCells}
                    rows={rows}
                    readOnly
                    dense
                    rowsPerPage={25}
                    showFilters={true}
                    showSearchbar={false}
                />
            </GenericCard>
        </div>)
}

export default Orders;