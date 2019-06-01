import PouchDB from "pouchdb";
import pouchDBQuickSearch from "pouchdb-quick-search";
import {mergeDeepRight} from "@unction/complete";

PouchDB.plugin(pouchDBQuickSearch);

const INFO_INTERVAL = 5000;
const DATABASE_CONFIGURATION = {
  local: {
    auto_compaction: true,
  },
  remote: {
    auth: {
      username: process.env.COUCHDB_USERNAME,
      password: process.env.COUCHDB_PASSWORD,
    },
  },
};

export default {
  state: {
    remote: null,
    local: null,
  },
  reducers: {
    store (currentState, [type, database]) {
      return mergeDeepRight(currentState)({[type]: database});
    },
  },
  effects (dispatch) {
    return {
      async initialize () {
        await dispatch.database.create(["local", "dictionary"]);
        await dispatch.metadata.query("local");
        setInterval(() => dispatch.metadata.query("local"), INFO_INTERVAL);

        await dispatch.database.create(["remote", process.env.COUCHDB_URI]);
        await dispatch.metadata.query("remote");
        setInterval(() => dispatch.metadata.query("remote"), INFO_INTERVAL);

        return dispatch.replication.replicate({from: "remote", to: "local"});
      },
      async create ([type, location]) {
        return dispatch.database.store([type, await new PouchDB(location, DATABASE_CONFIGURATION[type])]);
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
