import {mergeDeepRight} from "@unction/complete";

export default {
  state: {
    remote: {
      documentCount: 0,
    },
    local: {
      documentCount: 0,
    },
  },
  reducers: {
    update (currentState, [type, information]) {
      return mergeDeepRight(currentState)({
        [type]: {
          documentCount: information.doc_count,
          lastQueriedAt: new Date(),
        },
      });
    },
  },
  effects (dispatch) {
    return {
      async query (type, {database}) {
        return dispatch.metadata.update([type, await database[type].info()]);
      },
    };
  },
};
