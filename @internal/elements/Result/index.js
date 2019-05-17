export default function Result({
  id,
  score
}) {
  const localDatabaseContext = React.useContext(LocalDatabaseContext);
  const [edit, setEdit] = React.useState({});
  const [mode, setMode] = React.useState("viewing");
  const [documentLoaded, setDocumentLoaded] = React.useState(false);
  const [rootLoaded, setRootLoaded] = React.useState(false);
  const [{
    word,
    definitions,
    examples,
    note
  }, setDocumentResult] = React.useState({});
  const [rootResults, setRootResults] = React.useState({});
  React.useEffect(() => {
    if (mode === "saving") {
      localDatabaseContext.put(id, edit).then(() => setDocumentLoaded(new Date()));
    }
  }, [mode]);
  React.useEffect(() => {
    localDatabaseContext.get(id).then(setDocumentResult).then(() => setDocumentLoaded(new Date()));
  }, [id, score]);
  React.useEffect(() => {
    if (word) {
      Promise.all(word.split(" / ").flatMap(subsection => subsection.split(" ")).map(subword => localDatabaseContext.search({
        query: subword,
        fields: ["word"],
        highlighting: true,
        highlighting_pre: "<strong class=\"text-info\">"
      }))).then(results => results.reduce((accumulation, result) => ({
        total_rows: accumulation.total_rows + result.total_rows,
        rows: [...accumulation.rows, ...result.rows]
      }))).then(results => ({ ...results,
        rows: R.uniqBy(({
          id
        }) => id, results.rows)
      })).then(setRootResults).then(() => setRootLoaded(new Date()));
    }
  }, [documentLoaded, word]);

  if (documentLoaded && mode === "editing") {
    return <section className="list-group-item" id={id} score={score} documentloaded={documentLoaded}>{[<form key="result-form" className="mb-1">{[<header key="result-form-header" className="form-group"><input type="text" className="form-control form-control-lg" value={word} onChange={event => setEdit(R.mergeDeepRight(edit, {
            word: event.target.value
          }))} /></header>, ...Object.entries(definitions).flatMap(function ([type, typeDefinitions]) {
          return typeDefinitions.map(function (definition, index) {
            return <section key={`result-form-definition-${type}-${index}`} className="form-group"><textarea className="form-control" value={definition} onChange={event => setEdit(R.mergeDeepRight(edit, {
                definitions: {
                  [type]: [event.target.value]
                }
              }))} /></section>;
          });
        })]}</form>, <ResultFooter key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />]}</section>;
  }

  if (documentLoaded) {
    return <section className="list-group-item" id={id} score={score} documentloaded={documentLoaded}>{[<header key="result-header" className="d-flex w-100 justify-content-between">{[<h5 key="result-header-word" className="mb-1">{word}</h5>, <small key="result-header-loaded" className="text-muted">{`Last fetched ${moment(documentLoaded).fromNow()}`}</small>]}</header>, ...Object.entries(definitions).flatMap(function ([type, typeDefinitions]) {
        return typeDefinitions.map((definition, index) => {
          return <p key={`result-definition-${type}-${index}`} className="mb-1" type={type}>{`[${type}] ${definition}`}</p>;
        });
      }), <ResultRoot key="result-root" rootLoaded={rootLoaded} {...rootResults} />, <ResultFooter key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />]}</section>;
  }

  return null;
}