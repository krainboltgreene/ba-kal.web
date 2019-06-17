import React from "react";

export default function Metadata ({score, mode}) {
  return <section className="card-body d-flex justify-content-between align-items-end">
    {mode === "saving" && <small className="text-info">loading</small>}
    {mode === "deleting" && <small className="text-warning">deleting</small>}
    {mode === "erroring" && <small className="text-danger">something broke</small>}
    <small className="text-muted">{(score * 100).toFixed(2)}% match</small>
  </section>;
}
