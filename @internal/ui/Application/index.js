import React from "react";
import {Route, Switch} from "react-router";

import ErrorBoundry from "./ErrorBoundry";

import {SearchPage} from "@internal/pages";
import {TranslatePage} from "@internal/pages";
import {PageNotFound} from "@internal/pages";

export default function Application () {
  return <ErrorBoundry>
    <Switch>
      <Route path="/translate" component={TranslatePage} />
      <Route path="/search" component={SearchPage} />
      <Route exact path="/" component={SearchPage} />
      <Route component={PageNotFound} />
    </Switch>
  </ErrorBoundry>;
}
