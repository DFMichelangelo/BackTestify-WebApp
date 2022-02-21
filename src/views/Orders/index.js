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
                        subtitle: "backtester.general",
                        metrics: [{
                            subsubtitle: "backtester.totalOrders",
                            metricValue: ordersInfo.general.amount
                        },
                        {
                            subsubtitle: "backtester.profitableOrders",
                            metricValue: ((ordersInfo.long_orders.percentage_profitable_orders + ordersInfo.short_orders.percentage_profitable_orders) * 100).toFixed(2) + " %"
                        }
                        ]
                    },
                    {
                        subtitle: "backtester.longOrders",
                        metrics: [{
                            subsubtitle: "backtester.absoluteValue",
                            metricValue: ordersInfo.long_orders.amount
                        },
                        {
                            subsubtitle: "backtester.percentage",
                            metricValue: (ordersInfo.long_orders.percentage * 100).toFixed(2) + "%"
                        },
                        {
                            subsubtitle: "backtester.amountProfitable",
                            metricValue: ordersInfo.long_orders.amount_profitable_orders
                        },
                        {
                            subsubtitle: "backtester.percentageProfitable",
                            metricValue: (ordersInfo.long_orders.percentage_profitable_orders * 100).toFixed(2) + "%"
                        }]
                    },
                    {
                        subtitle: "backtester.shortOrders",
                        metrics: [
                            {
                                subsubtitle: "backtester.absoluteValue",
                                metricValue: ordersInfo.short_orders.amount
                            },
                            {
                                subsubtitle: "backtester.percentage",
                                metricValue: (ordersInfo.short_orders.percentage * 100).toFixed(2) + "%"
                            },
                            {
                                subsubtitle: "backtester.amountProfitable",
                                metricValue: ordersInfo.short_orders.amount_profitable_orders
                            },
                            {
                                subsubtitle: "backtester.percentageProfitable",
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