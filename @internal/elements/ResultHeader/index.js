import React from "react";
import moment from "moment";

export default function ResultHeader ({word, entryLoaded}) {
  return <header key="result-header" className="d-flex w-100 justify-content-between">
    <h5 key="result-header-word" className="mb-1">{word}</h5>
    <small key="result-header-loaded" className="text-muted">
      Last fetched {moment(entryLoaded).fromNow()}
    </small>
  </header>;
}
