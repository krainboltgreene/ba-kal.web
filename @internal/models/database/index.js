import PouchDB from "pouchdb";
import pouchDBQuickSearch from "pouchdb-quick-search";

PouchDB.plugin(pouchDBQuickSearch);

const REPLICATION_CONFIGURATION = {live: true, retry: true, heartbeat: true, batch_size: 250};

export default {
  state: {
    remote: null,
    local: null,
    replication: null,
  },
  reducers: {
    updateDatabase (state, [type, database]) {
      return {...state, [type]: database};
    },
  },
  effects (dispatch) {
    return {
      async createDatabase ([type, location]) {
        return dispatch.database.updateDatabase([type, await new PouchDB(location)]);
      },
      async replicate ({from, to}, {database}) {
        const replication = await database[to].local.replicate.from(database[from], REPLICATION_CONFIGURATION);

        debugger;
      },
      async writeEntry ([id, data], {database}) {
        await database.local.put(id, data);
      },
      async getEntry (id, {database}) {
        await database.local.get(id);
      },
    };
  },
};
