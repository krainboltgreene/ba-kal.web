import React from "react";

export default function EditEtymologies ({etymologies, setEtymologies}) {
  return <form className="etymologies card-body" noValidate onSubmit={(event) => event.preventDefault()}>
    <section className="form-group">
      <label htmlFor={etymologies}>Etymology</label>
      <textarea id={etymologies} aria-label="the word's etymology" className="form-control" value={etymologies} onChange={(event) => setEtymologies(event.target.value)} />
    </section>
  </form>;
}
