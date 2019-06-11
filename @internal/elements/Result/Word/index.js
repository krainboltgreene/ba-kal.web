import React from "react";

export default function Word ({word}) {
  return <header className="d-flex w-100 justify-content-between">
    <h5 className="mb-1">{word}</h5>
  </header>;
}
