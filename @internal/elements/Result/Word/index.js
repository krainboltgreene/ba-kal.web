import React from "react";
import moment from "moment";

export default function Word ({word, entryLoaded}) {
  return <header className="d-flex w-100 justify-content-between">
    <h5 className="mb-1">{word}</h5>
    <small className="text-muted">
      Last fetched {moment(entryLoaded).fromNow()}
    </small>
  </header>;
}
