import React from "react";

export default function EditExamples ({examples, setExamples}) {
  return <form className="examples card-body" noValidate onSubmit={(event) => event.preventDefault()}>
    <section className="form-group">
      <label htmlFor={examples}>Etymology</label>
      <textarea id={examples} aria-label="the word's etymology" className="form-control" value={examples} onChange={(event) => setExamples(event.target.value)} />
    </section>
  </form>;
}
