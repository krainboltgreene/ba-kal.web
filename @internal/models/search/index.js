export default {
  state: {
    active: false,
  },
  reducers: {
    toggle (currentState) {
      return {...currentState, active: !currentState.active};
    },
    update (currentState, payload) {
      return {...currentState, ...payload};
    },
  },
  effects (dispatch) {
    return {
      async word (query, {database}) {
        dispatch.search.toggle();
        dispatch.search.update({query});

        const results = await database.local.search({
          query,
          fields: [
            "word",
          ],
        });

        dispatch.search.toggle();
        dispatch.search.update({count: results.total_rows});

        return results;
      },
      async wordOrDefinition (query, {database}) {
        dispatch.search.toggle();
        dispatch.search.update({query});

        const results = await database.local.search({
          query,
          fields: [
            "word",
            "definitions.unknown",
            "definitions.n",
            "definitions.vt",
            "definitions.vo",
            "definitions.vs",
            "definitions.vi",
          ],
        });

        dispatch.search.update({count: results.total_rows});
        dispatch.search.toggle();

        return results;
      },
    };
  },
};
