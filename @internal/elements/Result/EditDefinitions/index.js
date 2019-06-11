import React from "react";

import EditDefinition from "./EditDefinition";

export default function EditDefinitions ({changeDefinitions, definitions}) {
  return <form className="mb-1">
    {
      Object.entries(definitions).map(([id, definition]) => {
        const changeDefinition = (value) => {
          changeDefinitions({[id]: value});
        };

        return <EditDefinition key={`result-form-definition-${id}`} definition={definition} changeDefinition={changeDefinition} />;
      })
    }
  </form>;
}
