import React, { useEffect, useContext } from "react";
import { ThemeContext } from "contexts/Providers/ThemeProvider";
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import MetricCard from "components/MetricCard";

import { LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{ name: 'Page A', uv: 800, pv: 400, amt: 1400 }, { name: 'Page A', uv: 400, pv: 2400, amt: 2400 }, { name: 'Page A', uv: 700, pv: 400, amt: 4400 }];


function Performance(props) {
    const themeContext = useContext(ThemeContext);

    useEffect(() => {
        themeContext.setTitle("backtester.performance", <SpeedOutlinedIcon />);
    }, []);


    return (
        <div className="flex flex-col w-full">

            <div className="flex flex-row">

                <MetricCard title="ordersInfo" multiMetricData={[
                    {
                        subtitle: "totalOrders",
                        metricValue: "0"
                    }
                    ,
                    {
                        subsubtitle: "longOrders",
                        metrics: [{
                            subtitle: "absoluteValue",
                            metricValue: "0"
                        },
                        {
                            subtitle: "percentageValue",
                            metricValue: "0"
                        }]
                    },
                    {
                        subsubtitle: "shortOrders",
                        metrics: [{
                            subtitle: "absoluteValue",
                            metricValue: "0"
                        },
                        {
                            subtitle: "percentageValue",
                            metricValue: "0"
                        }]
                    }
                ]
                } />
            </div>
            <div className="flex flex-row w-full">
                <ResponsiveContainer minWidth={"50%"} minHeight={400}>
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

                <ResponsiveContainer minWidth={"50%"} minHeight={400}>
                    <LineChart data={data}>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                    </LineChart>
                </ResponsiveContainer>

            </div>
        </div>)
}

export default Performance;