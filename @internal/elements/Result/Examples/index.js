import React from "react";
import {isPopulated} from "@unction/complete";

export default function Examples ({examples}) {
  if (!isPopulated(examples)) {
    return null;
  }

  return <section className="examples card-body">
    <p><span className="badge badge-light">Examples</span> {examples}</p>
  </section>;
}
