import React from "react";

import Result from "../Result";

export default function Results ({rows}) {
  if (rows) {
    return <section key="row-list" className="list-group">
      {
        rows.map(({id, score}) => <Result key={id} id={id} score={score} />)
      }
    </section>;
  }

  return null;
}
