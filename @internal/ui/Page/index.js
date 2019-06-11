import React from "react";
import {defaultProps} from "recompose";
import {withRouter} from "react-router";
import {get} from "@unction/complete";

import view from "@internal/view";
import {Navigation} from "@internal/elements";
import {Metadata} from "@internal/elements";

export default view([
  defaultProps({}),
  withRouter,
  function Page (properties) {
    const {children} = properties;
    const dataComponent = get("data-component")(properties);
    const {match: {isExact, path, url}} = properties;

    return <main className="container-fluid" data-component={dataComponent} data-match-exact={isExact} data-match-path={path} data-match-url={url}>
      <Navigation />
      {children}
      <Metadata />
    </main>;
  },
]);
