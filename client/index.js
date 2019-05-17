import React from "react";
import {hydrate} from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";
import PouchDB from "pouchdb";
import pouchDBQuickSearch from "pouchdb-quick-search";

import {Application} from "@internal/ui";

PouchDB.plugin(pouchDBQuickSearch);

const localPouchDB = new PouchDB("indexdb");
const remotePouchDB = new PouchDB("http://35.224.124.140:5984/dictionary");
const localToRemoteReplication = localPouchDB
  .replicate
  .from(remotePouchDB, {live: true, retry: true, heartbeat: true, batch_size: 250});

const LocalDatabaseContext = React.createContext(localPouchDB);
const ReplicationContext = React.createContext(localToRemoteReplication);
const ReplicationStateContext = React.createContext();

hydrate(
  <BrowserRouter>
    <HelmetProvider>
      <Application LocalDatabaseContext={LocalDatabaseContext} ReplicationContext={ReplicationContext} ReplicationStateContext={ReplicationStateContext} />
    </HelmetProvider>
  </BrowserRouter>,
  document.getElementById("application")
);
