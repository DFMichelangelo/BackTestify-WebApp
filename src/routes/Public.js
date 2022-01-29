import React, { lazy, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import ErrorNotFound from "theme/views/Placeholders/ErrorNotFound";
const Backtester = lazy(() => import("views/Backtester"));

function Public() {

    return (
        <Switch>
            <Route path="/p/backtester" component={Backtester} />
            <Route component={ErrorNotFound} />
        </Switch>
    );
}

export default Public;
