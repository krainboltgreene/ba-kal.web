export default {
  state: {},
  reducers: {},
  effects () {
    return {
      async searchWord (query, {database}) {
        await database.local.search({
          query,
          fields: [
            "word",
          ],
        });
      },
      async searchWordAndDefinitions (query, {database}) {
        await database.local.search({
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
