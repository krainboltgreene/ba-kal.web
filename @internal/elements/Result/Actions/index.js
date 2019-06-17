import React from "react";
import uuid from "uuid/v4";

export default function Actions ({mode, setSaving, setViewing, setEditing, deleteEntry, setDefinitions, definitions}) {
  const addNewDefinition = () => setDefinitions([...definitions, {id: uuid(), type: null, detail: ""}]);

  if (mode === "editing") {
    return <footer className="actions card-footer" role="group" aria-label="actions">
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={setSaving}>Save</button>
      &nbsp;
      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addNewDefinition}>New Definition</button>
      &nbsp;
      <button type="button" className="btn btn-outline-danger btn-sm" onClick={deleteEntry}>Delete</button>
      &nbsp;
      <button type="button" className="btn btn-outline-dark btn-sm" onClick={setViewing}>Close</button>
    </footer>;
  }

  return <footer className="actions card-footer" role="group" aria-label="actions">
    <button type="button" className="btn btn-outline-dark btn-sm" onClick={setEditing}>Edit</button>
  </footer>;
}
