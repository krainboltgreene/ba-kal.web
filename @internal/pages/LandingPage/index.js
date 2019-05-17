import React from "react";

import {Page} from "@internal/ui";
import {Search} from "@internal/elements";
import {Results} from "@internal/elements";
import {Metadata} from "@internal/elements";

const DEFAULT_DOCUMENT_COUNT = 0;
const MINIMUM_SEARCH_SIZE = 1;

export default function LandingPage ({LocalDatabaseContext, ReplicationContext, ReplicationStateContext}) {
  const localDatabaseContext = React.useContext(LocalDatabaseContext);
  const replicationContext = React.useContext(ReplicationContext);
  // const replicationStateContext = React.useContext(ReplicationStateContext);
  const [documentCount, setDocumentCount] = React.useState(DEFAULT_DOCUMENT_COUNT);
  const [replicationState, setReplicationState] = React.useState(replicationContext);
  const [{total_rows: resultCount, rows, offset}, setResults] = React.useState({});
  const [query, setQuery] = React.useState();

  replicationContext.removeAllListeners("change");
  replicationContext.on("change", setReplicationState);

  React.useEffect(() => {
    localDatabaseContext
      .info()
      .then(({doc_count}) => setDocumentCount(doc_count))
      .catch(console.error);
  }, [replicationState.last_seq]);

  React.useEffect(() => {
    if (query && query.length > MINIMUM_SEARCH_SIZE) {
      localDatabaseContext
        .search({
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
        })
        .then(setResults)
        .catch(console.error);
    } else {
      setResults({});
    }
  }, [query]);

  return <LocalDatabaseContext.Provider>
    <ReplicationContext.Provider>
      <ReplicationStateContext.Provider value={replicationState}>
        <Page subtitle="Welcome!" hasHeader={false}>
          <Search key="search" query={query} setQuery={setQuery} />
          <Results key="results" resultCount={resultCount} rows={rows} offset={offset} />
          <Metadata key="metadata" query={query} rows={rows} documentCount={documentCount} resultCount={resultCount} />
        </Page>
      </ReplicationStateContext.Provider>
    </ReplicationContext.Provider>
  </LocalDatabaseContext.Provider>;
}
