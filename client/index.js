import React from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import {Provider as ReduxProvider} from "react-redux";

import {Application} from "@internal/ui";
import store from "@internal/store";

store.dispatch.database.initialize()
  .then(
    function render () {
      return hydrate(
        <BrowserRouter>
          <HelmetProvider>
            <ReduxProvider store={store}>
              <Application />
            </ReduxProvider>
          </HelmetProvider>
        </BrowserRouter>,
        document.querySelector("#application")
      );
    }
  )
  .catch(console.error);
