import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import MetricCard from "components/MetricCard";
function Orders(props) {
    const themeContext = useContext(ThemeContext);
    const backtesterContext = useContext(BacktesterContext);

    useEffect(() => {
        themeContext.setTitle("backtester.orders", <MarkAsUnreadOutlinedIcon />);
    }, []);

    let ordersInfo = backtesterContext.backtesterResults.analytics.orders;
    return (
        <div>
            <div className="flex flex-row">

                <MetricCard title="backtester.ordersInfo" multiMetricData={[
                    {
                        subtitle: "backtesterltotalOrders",
                        metricValue: ordersInfo.general.amount
                    },
                    {
                        subsubtitle: "longOrders",
                        metrics: [{
                            subtitle: "absoluteValue",
                            metricValue: ordersInfo.long_orders.amount
                        },
                        {
                            subtitle: "percentageValue",
                            metricValue: (ordersInfo.long_orders.percentage * 100).toFixed(2) + "%"
                        },
                        {
                            subtitle: "amountProfitableOrders",
                            metricValue: ordersInfo.long_orders.amount_profitable_orders
                        },
                        {
                            subtitle: "percentageProfitableOrders",
                            metricValue: (ordersInfo.long_orders.percentage_profitable_orders * 100).toFixed(2) + "%"
                        }]
                    },
                    {
                        subsubtitle: "shortOrders",
                        metrics: [
                            {
                                subtitle: "absoluteValue",
                                metricValue: ordersInfo.short_orders.amount
                            },
                            {
                                subtitle: "percentageValue",
                                metricValue: (ordersInfo.short_orders.percentage * 100).toFixed(2) + "%"
                            },
                            {
                                subtitle: "amountProfitableOrders",
                                metricValue: ordersInfo.short_orders.amount_profitable_orders
                            },
                            {
                                subtitle: "percentageProfitableOrders",
                                metricValue: (ordersInfo.short_orders.percentage_profitable_orders * 100).toFixed(2) + "%"
                            }
                        ]
                    }
                ]
                } />
            </div>
        </div>)
}

export default Orders;