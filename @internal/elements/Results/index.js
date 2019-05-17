export default function Results({
  rows,
  resultCount,
  offset
}) {
  if (rows) {
    return <section key="row-list" className="list-group">{rows.map(({
        id,
        score
      }) => <Result key={id} id={id} score={score} />)}</section>;
  }

  return null;
}