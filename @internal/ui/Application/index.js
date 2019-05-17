import React from "react";
import {Route, Switch} from "react-router";

import {LandingPage} from "@internal/pages";
import {PageNotFound} from "@internal/pages";

import ErrorBoundry from "./ErrorBoundry";

export default function Application () {
  return <ErrorBoundry>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route component={PageNotFound} />
    </Switch>
  </ErrorBoundry>;
}
