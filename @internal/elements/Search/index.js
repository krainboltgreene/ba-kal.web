export default function Search({
  setQuery,
  query
}) {
  const {
    pending: pendingDocumentCount
  } = React.useContext(ReplicationStateContext);
  return <form key="search-form" className="py-1"><section className="form-row"><section className="col input-group">{[<section key="search-icon" className="input-group-prepend"><span className="input-group-text">Search</span></section>, <input key="search-input" className="form-control form-control-lg" type="text" disabled={pendingDocumentCount > 0} onChange={event => setQuery(event.target.value)} value={query} />]}</section></section></form>;
}