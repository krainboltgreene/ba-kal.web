import React from "react";
import {isPopulated} from "@unction/complete";

export default function Etymologies ({etymologies}) {
  if (!isPopulated(etymologies)) {
    return null;
  }

  return <section className="etymologies card-body">
    <p><span className="badge badge-light">Etymology</span> {etymologies}</p>
  </section>;
}
