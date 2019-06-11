import {init} from "@rematch/core";
import {createLogger} from "redux-logger";

import {search} from "@internal/models";
import {database} from "@internal/models";
import {replication} from "@internal/models";
import {databaseInformation} from "@internal/models";

export default init({
  models: {
    search,
    database,
    replication,
    databaseInformation,
  },
  redux: {
    middlewares: process.env.NODE_ENV === "production" ? [] : [createLogger({collapsed: true, duration: true})],
  },
});
