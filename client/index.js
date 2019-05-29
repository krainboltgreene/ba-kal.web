import React from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {Provider as ReduxProvider} from "react-redux";

import {Application} from "@internal/ui";
import store from "@internal/store";

store.dispatch.database.createDatabase(["local", "dictionary"]);
store.dispatch.database.createDatabase(["remote", "http://35.224.124.140:5984/dictionary"]);
store.dispatch.database.replicate({from: "remote", to: "local"});

hydrate(
  <BrowserRouter>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <Application />
      </ReduxProvider>
    </HelmetProvider>
  </BrowserRouter>,
  document.querySelector("#application")
);
