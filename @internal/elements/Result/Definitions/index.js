import React from "react";
import {mapValues} from "@unction/complete";

const VALID_TYPES = new Map([
  ["n", "Noun"],
  ["det", "Determiner"],
  ["vi", "Intransitive Verb"],
  ["vt", "Transitive Verb"],
  ["vs", "Stative Verb"],
  ["vo", "Verb Object"],
  ["prep", "Preposition"],
  ["adv", "Adverb"],
]);

export default function Definitions ({definitions}) {
  return <ul className="list-group list-group-flush">
    {
      mapValues(({id, type, detail}) => {
        return <li className="list-group-item">
          <p key={`result-definition-${id}`} className="mb-1" type={type}>
            <span className="badge badge-light">{VALID_TYPES.get(type)}</span> {detail}
          </p>
        </li>;
      })(definitions)
    }
  </ul>;
}
