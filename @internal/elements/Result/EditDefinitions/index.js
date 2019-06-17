import React from "react";
import {mapValues} from "@unction/complete";
import {rejectByValue} from "@unction/complete";
import {equals} from "@unction/complete";
import {get} from "@unction/complete";
import {sortBy} from "@unction/complete";

import EditDefinition from "./EditDefinition";

export default function EditDefinitions ({setDefinitions, definitions}) {
  return <form noValidate onSubmit={(event) => event.preventDefault()} css={{borderTop: "1px solid rgba(0,0,0,.125)", borderBottom: "1px solid rgba(0,0,0,.125)"}}>
    <section className="list-group list-group-flush">
      {
        mapValues((definition) => {
          const setDefinition = (value) => {
            if (value) {
              return setDefinitions([...rejectByValue(equals(definition))(definitions), value]);
            }

            return setDefinitions(rejectByValue(equals(definition))(definitions));
          };

          return <EditDefinition key={`result-form-definition-${definition.id}`} definition={definition} setDefinition={setDefinition} />;
        })(sortBy(get("id"))(definitions))
      }
    </section>
  </form>;
}
