import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {dig} from "@unction/complete";
import view from "@internal/view";

const HIDE_COUNT = 0;
const MINIMUM_SEARCH_LENGTH = 1;

export default view([
  connect(createStructuredSelector({
    documentAwaitingReplicationCount: () => 0,
    documentCount: () => 0,
    lastReplicatedAt: dig(["database", "replication", "lastChangedAt"]),
  })),
  function Metadata (properties) {
    const {lastReplicatedAt} = properties;
    const {documentAwaitingReplicationCount} = properties;
    const {documentCount} = properties;
    const {query} = properties;
    const {resultCount} = properties;
    const {rows} = properties;

    if (documentAwaitingReplicationCount > HIDE_COUNT) {
      return <section className="alert alert-light mb-0">
        <p>
          Last replicated {moment(lastReplicatedAt).fromNow()}...
        </p>

        <p>
          Waiting to replicate {documentAwaitingReplicationCount}/{documentCount} documents.
        </p>
      </section>;
    }

    if (query && query.length > MINIMUM_SEARCH_LENGTH && rows && rows.length > HIDE_COUNT) {
      return <section className="alert alert-light mb-0">
        <p>
          Last replicated {moment(lastReplicatedAt).fromNow()}...
        </p>

        <p>
          Waiting to replicate {documentAwaitingReplicationCount}/{documentCount} documents.
        </p>

        <p>
          Searching for <em>{query}</em> we have found {resultCount} matches.
        </p>
      </section>;
    }

    if (query && query.length > MINIMUM_SEARCH_LENGTH) {
      return <section className="alert alert-light mb-0">
        <p>
          Last replicated {moment(lastReplicatedAt).fromNow()}...
        </p>

        <p>
          Waiting to replicate {documentAwaitingReplicationCount}/{documentCount} documents.
        </p>

        <p>
          Searching for <em>{query}</em> ... (first search is slow).
        </p>
      </section>;
    }

    return <section className="alert alert-light mb-0">
      <p>
        Last replicated {moment(lastReplicatedAt).fromNow()}...
      </p>

      <p>
        Waiting to replicate {documentAwaitingReplicationCount}/{documentCount} documents.
      </p>

      <p>
        Type above to start searching the dictionary.
      </p>
    </section>;
  },
]);
