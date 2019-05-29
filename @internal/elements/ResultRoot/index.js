import React from "react";

export default function ResultRoot ({rootLoaded, resultCount, rows}) {
  if (rootLoaded) {
    return <section resultcount={resultCount} rootloaded={rootLoaded}>
      {
        rows.map(({id, highlighting: {word}}) => {
          return <li key={`result-root-${id}`} className="badge badge-pill badge-light" dangerouslySetInnerHTML={{__html: word}} id={id} />;
        })
      }
    </section>;
  }

  return <section className="alert alert-warning mb-0">Searching for root words...</section>;
}
