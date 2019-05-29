import React from "react";
import moment from "moment";

export default function Metadata ({documentCount, query, resultCount, rows}) {
  if (pendingDocumentCount > 0) {
    return <section className="alert alert-light mb-0">
      <p>
        Last replicated {moment(replicationStateChangedAt).fromNow()}...
      </p>

      <p>
        Waiting to replicate {pendingDocumentCount}/{documentCount} documents.
      </p>
    </section>;
  }

  if (query && query.length > 1 && rows && rows.length > 0) {
    return <section className="alert alert-light mb-0">
      <p>
        Last replicated {moment(replicationStateChangedAt).fromNow()}...
      </p>

      <p>
        Waiting to replicate {pendingDocumentCount}/{documentCount} documents.
      </p>

      <p>
        Searching for <em>{query}</em> we have found {resultCount} matches.
      </p>
    </section>;
  }

  if (query && query.length > 1) {
    return <section className="alert alert-light mb-0">
      <p>
        Last replicated {moment(replicationStateChangedAt).fromNow()}...
      </p>

      <p>
        Waiting to replicate {pendingDocumentCount}/{documentCount} documents.
      </p>

      <p>
        Searching for <em>{query}</em> ... (first search is slow).
      </p>
    </section>;
  }

  return <section className="alert alert-light mb-0">
    <p>
      Last replicated {moment(replicationStateChangedAt).fromNow()}...
    </p>

    <p>
      Waiting to replicate {pendingDocumentCount}/{documentCount} documents.
    </p>

    <p>
      Type above to start searching the dictionary.
    </p>
  </section>;
}
