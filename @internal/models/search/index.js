export default {
  state: {},
  reducers: {},
  effects () {
    return {
      word (query, {database}) {
        return database.local.search({
          query,
          fields: [
            "word",
          ],
        });
      },
      wordOrDefintion (query, {database}) {
        return database.local.search({
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
      },
    };
  },
};
