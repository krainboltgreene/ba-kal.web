import React from "react";

export default function EditNote ({note, changeNote}) {
  return <form className="card-body" noValidate onSubmit={(event) => event.preventDefault()}>
    <section className="form-group">
      <label htmlFor="note">Note</label>
      <textarea id="note" aria-label="note" className="form-control" value={note} onChange={(event) => changeNote(event.target.value)} />
    </section>
  </form>;
}
