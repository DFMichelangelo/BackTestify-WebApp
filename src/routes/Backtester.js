import React, { lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import ErrorNotFound from "theme/views/Placeholders/ErrorNotFound";
const Input = lazy(() => import("views/Backtester/Input"));
const Portfolio = lazy(() => import("views/Backtester/Portfolio"));
const Orders = lazy(() => import("views/Backtester/Orders"));
const Performance = lazy(() => import("views/Backtester/Performance"));
const Logs = lazy(() => import("views/Backtester/Logs"));

function Backtester() {

    return (
        <Switch>
            <Route path="/p/backtester/input" component={Input} />
            <Route path="/p/backtester/orders" component={Orders} />
            <Route path="/p/backtester/portfolio" component={Portfolio} />
            <Route path="/p/backtester/performance" component={Performance} />
            <Route path="/p/backtester/logs" component={Logs} />
            <Route path="/p/backtester*">
                <Redirect to="/p/backtester/input" />
            </Route>

        </Switch>
    );
}

export default Backtester;
