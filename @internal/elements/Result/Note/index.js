import React from "react";
import {isPopulated} from "@unction/complete";

export default function Note ({note}) {
  if (!isPopulated(note)) {
    return null;
  }

  return <section className="note card-body">
    <p className="text-muted">
      <span className="badge badge-light">Note</span> <em>{note}</em>
    </p>
  </section>;
}
