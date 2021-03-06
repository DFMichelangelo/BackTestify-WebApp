import React from "react";
import { Route, Switch } from "react-router-dom";
import ErrorNotFound from "theme/views/Placeholders/ErrorNotFound";
import Backtester from "./Backtester";

function Public(props) {

    return (
        <Switch>
            <Route path="/p/backtester*" component={Backtester} />
            <Route component={ErrorNotFound} />
        </Switch>
    );
}

export default Public;
