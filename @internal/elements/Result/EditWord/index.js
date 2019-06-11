import React from "react";

export default function EditWord ({word, setWord}) {
  return <form className="mb-1">
    <header className="form-group">
      <input aria-label="word" type="text" className="form-control form-control-lg" value={word} onChange={(event) => setWord(event.target.value)} />
    </header>
  </form>;
}
