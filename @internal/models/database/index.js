import PouchDB from "pouchdb";
import pouchDBQuickSearch from "pouchdb-quick-search";
import {mergeDeepRight} from "@unction/complete";

PouchDB.plugin(pouchDBQuickSearch);

const REPLICATION_CONFIGURATION = {live: true, retry: true, heartbeat: true, batch_size: 250};

export default {
  state: {
    remote: null,
    local: null,
    replication: null,
    events: [],
  },
  reducers: {
    setDatabase (currentState, [type, database]) {
      return mergeDeepRight(currentState)({[type]: database});
    },
    startReplication (currentState, job) {
      return mergeDeepRight(currentState)({replication: {job, lastStartedAt: new Date()}, events: [[new Date(), "started"]]});
    },
    updateReplication (currentState, information) {
      return mergeDeepRight(currentState)({replication: {lastChangedAt: new Date()}, events: [[new Date(), "updated", information]]});
    },
    pauseReplication (currentState, error) {
      return mergeDeepRight(currentState)({replication: {lastPausedAt: new Date()}, events: [[new Date(), "paused", error]]});
    },
    resumeReplication (currentState) {
      return mergeDeepRight(currentState)({lastStartedAt: new Date(), events: [[new Date(), "resumed"]]});
    },
    crashReplication (currentState, error) {
      return mergeDeepRight(currentState)({events: [[new Date(), "crashed", error]]});
    },
    completeReplication (currentState, information) {
      return mergeDeepRight(currentState)({events: [[new Date(), "completed", information]]});
    },

  },
  effects (dispatch) {
    return {
      async initialize () {
        await dispatch.database.createDatabase(["local", "dictionary"]);
        await dispatch.database.createDatabase(["remote", "http://35.224.124.140:5984/dictionary"]);
        await dispatch.database.replicate({from: "remote", to: "local"});
      },
      async createDatabase ([type, location]) {
        return dispatch.database.setDatabase([type, await new PouchDB(location)]);
      },
      replicate ({from, to}, {database}) {
        return dispatch.database.startReplication(
          database[to].replicate.from(database[from], REPLICATION_CONFIGURATION)
            // handle change
            .on("change", dispatch.database.updateReplication)
            // replication paused (e.g. replication up to date, user went offline)
            .on("paused", dispatch.database.pauseReplication)
            // replicate resumed (e.g. new changes replicating, user went back online)
            .on("active", dispatch.database.resumeReplication)
            // a document failed to replicate (e.g. due to permissions)
            .on("denied", dispatch.database.crashReplication)
            // handle complete
            .on("complete", dispatch.database.completeReplication)
            // handle error
            .on("error", dispatch.database.crashReplication)
        );
      },
      writeEntry ([id, data], {database}) {
        return database.local.put(id, data);
      },
      getEntry (id, {database}) {
        return database.local.get(id);
      },
    };
  },
};
