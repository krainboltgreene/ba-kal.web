import React from "react";

export default function EditDefinition ({definition, changeDefinition}) {
  const changeType = (event) => {
    changeDefinition({...definition, type: event.target.value});
  };
  const changeDetail = (event) => {
    changeDefinition({...definition, detail: event.target.value});
  };

  return <section className="form-group">
    <input aria-label="word" type="text" className="form-control form-control-lg" value={definition.type} onChange={changeType} />
    <textarea aria-label="detail" className="form-control" value={definition.detail} onChange={changeDetail} />
  </section>;
}
