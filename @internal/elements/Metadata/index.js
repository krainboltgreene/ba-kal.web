import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {dig} from "@unction/complete";
import view from "@internal/view";

const HIDE_COUNT = 0;

export default view([
  connect(createStructuredSelector({
    pendingReplicationCount: dig(["database", "replication", "pendingCount"]),
    localDocumentCount: dig(["database", "local", "documentCount"]),
    remoteDocumentCount: dig(["database", "remote", "documentCount"]),
    lastQueriedAt: dig(["database", "local", "lastQueriedAt"]),
    lastReplicationChangedAt: dig(["database", "replication", "lastChangedAt"]),
    lastReplicationPausedAt: dig(["database", "replication", "lastPausedAt"]),
    isSearching: dig(["database", "search", "active"]),
    resultCount: dig(["database", "search", "count"]),
    query: dig(["database", "search", "query"]),
  })),
  function Metadata (properties) {
    const {pendingReplicationCount} = properties;
    const {localDocumentCount} = properties;
    const {remoteDocumentCount} = properties;
    const {lastReplicationChangedAt} = properties;
    const {lastReplicationPausedAt} = properties;
    const {isSearching} = properties;
    const {query} = properties;
    const {resultCount} = properties;

    const documentCount = Math.max(Math.max(remoteDocumentCount, localDocumentCount), pendingReplicationCount);
    const lastReplicatedAt = lastReplicationChangedAt > lastReplicationPausedAt ? lastReplicationChangedAt : lastReplicationPausedAt;

    return <section className="alert alert-light mb-0">
      {!query && <p>Type above to start searching the dictionary.</p>}
      {isSearching && <p>Searching for <em><u>{query}</u></em> ... (first search is slow).</p>}
      {query && !isSearching && <p>Searching for <em><u>{query}</u></em> we have found {resultCount} matches.</p>}
      {pendingReplicationCount > HIDE_COUNT && <p>Replicating {pendingReplicationCount} out of {documentCount} documents.</p>}
      {pendingReplicationCount === HIDE_COUNT && <p>{documentCount} total documents.</p>}
      {lastReplicatedAt && <p>Last replicated {moment(lastReplicatedAt).fromNow()}.</p>}
    </section>;
  },
]);
