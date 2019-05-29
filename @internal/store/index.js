import {init} from "@rematch/core";
import logger from "redux-logger";

import {search} from "@internal/models";
import {database} from "@internal/models";

export default init({
  models: {
    search,
    database,
  },
  redux: {
    middlewares: process.env.NODE_ENV === "development" ? [logger] : [],
  },
});
