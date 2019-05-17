export default function Metadata({
  documentCount,
  query,
  resultCount,
  rows
}) {
  const {
    start_time: replicationStateChangedAt,
    pending: pendingDocumentCount,
    last_seq
  } = React.useContext(ReplicationStateContext);

  if (pendingDocumentCount > 0) {
    return <section className="alert alert-light mb-0">{[`Last replicated ${moment(replicationStateChangedAt).fromNow()}.`, <br />, `Waiting to replicate ${pendingDocumentCount || 0} words, ${documentCount} words already stored.`, <br />, "Replicating..."]}</section>;
  }

  if (query && query.length > 1 && rows && rows.length > 0) {
    return <section className="alert alert-light mb-0">{[`Last replicated at ${moment(replicationStateChangedAt).fromNow()}.`, <br />, `${documentCount} total words in dictionary.`, <br />, `Searching for "${query}", we have found ${resultCount} matches.`]}</section>;
  }

  if (query && query.length > 1) {
    return <section className="alert alert-light mb-0">{[`Last replicated at ${moment(replicationStateChangedAt).fromNow()}.`, <br />, `${documentCount} total words in dictionary.`, <br />, `Searching for "${query}"... (first search is slow)`]}</section>;
  }

  return <section className="alert alert-light mb-0">{[`Last replicated ${moment(replicationStateChangedAt).fromNow()}.`, <br />, `${documentCount} total words in dictionary.`, <br />, "Type above to start searching the dictionary."]}</section>;
}