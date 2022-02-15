import React, { lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

const Input = lazy(() => import("views/Input"));
const Underlying = lazy(() => import("views/Underlying"));
const Portfolio = lazy(() => import("views/Portfolio"));
const Orders = lazy(() => import("views/Orders"));
const Performance = lazy(() => import("views/Performance"));
const Logs = lazy(() => import("views/Logs"));
const CreateStrategy = lazy(() => import("views/CreateStrategy"));
const RawOrders = lazy(() => import("views/RawData/Orders"));
const RawPortfolio = lazy(() => import("views/RawData/Portfolio"));

function Backtester() {

    return (
        <Switch>
            <Route path="/p/backtester/input" component={Input} />
            <Route path="/p/backtester/underlying" component={Underlying} />
            <Route path="/p/backtester/orders" component={Orders} />
            <Route path="/p/backtester/portfolio" component={Portfolio} />
            <Route path="/p/backtester/performance" component={Performance} />
            <Route path="/p/backtester/logs" component={Logs} />
            <Route path="/p/backtester/create_strategy" component={CreateStrategy} />
            <Route path="/p/backtester/raw-data/orders" component={RawOrders} />
            <Route path="/p/backtester/raw-data/portfolio" component={RawPortfolio} />
            <Route path="/p/backtester*">
                <Redirect to="/p/backtester/input" />
            </Route>

        </Switch>
    );
}

export default Backtester;
