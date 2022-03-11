import React, { lazy, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { BacktesterContext } from "contexts/Providers/BacktesterProvider";
import config from "configuration/config";
import { useMediaQuery } from "@mui/material";
const Input = lazy(() => import("views/Input"));
const Benchmark = lazy(() => import("views/Benchmark"));
const Backtests = lazy(() => import("views/Backtests"));
const Portfolio = lazy(() => import("views/Portfolio"));
const Orders = lazy(() => import("views/Orders"));
const Performance = lazy(() => import("views/Performance"));
const Logs = lazy(() => import("views/Logs"));
const CreateStrategy = lazy(() => import("views/CreateStrategy"));
const RawOrders = lazy(() => import("views/RawData/Orders"));
const RawPortfolio = lazy(() => import("views/RawData/Portfolio"));

const DesktopOnly = lazy(() => import("theme/views/Placeholders/DesktopOnly"));

function Backtester() {
    const matches = useMediaQuery("(max-width:" + config.mobileScreenWidth + ")");
    const backtesterContext = useContext(BacktesterContext);
    if (matches) return (
        <Switch>
            <Route path="/p/backtester/*" component={DesktopOnly} />
        </Switch>
    )

    return (
        <Switch>
            <Route path="/p/backtester/input" component={Input} />
            <Route path="/p/backtester/backtests" component={Backtests} />
            {backtesterContext.backtesterResults ?
                <Switch>
                    <Route path="/p/backtester/benchmark" component={Benchmark} />
                    <Route path="/p/backtester/orders" component={Orders} />
                    <Route path="/p/backtester/portfolio" component={Portfolio} />
                    <Route path="/p/backtester/performance" component={Performance} />
                    <Route path="/p/backtester/logs" component={Logs} />
                    <Route path="/p/backtester/create_strategy" component={CreateStrategy} />
                    <Route path="/p/backtester/raw-data/orders" component={RawOrders} />
                    <Route path="/p/backtester/raw-data/portfolio" component={RawPortfolio} />
                </Switch>
                :
                <Route path="/p/backtester*">
                    <Redirect to="/error/create-backtest" />
                </Route>}

            <Route path="/p/backtester*">
                <Redirect to="/p/backtester/input" />
            </Route>

        </Switch >
    );
}

export default Backtester;
