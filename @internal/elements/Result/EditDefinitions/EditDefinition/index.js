import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {mapValues} from "@unction/complete";
import {isPopulated} from "@unction/complete";
import {isPresent} from "@unction/complete";
import {first} from "@unction/complete";

const INVALID_TYPES = [
  ["unknown", "Pick a type..."],
];
const VALID_TYPES = [
  ["n", "Noun"],
  ["det", "Determiner"],
  ["vi", "Intransitive Verb"],
  ["vt", "Transitive Verb"],
  ["vs", "Stative Verb"],
  ["vo", "Verb Object"],
  ["prep", "Preposition"],
  ["adv", "Adverb"],
];

const validationClassName = (boolean) => {
  if (boolean === false) {
    return "is-invalid";
  }

  if (boolean === true) {
    return "is-valid";
  }

  return "";
};

export default function EditDefinition ({definition, setDefinition}) {
  const [isDetailValid, setIsDetailValid] = useState(false);
  const [isTypeValid, setIsTypeValid] = useState(false);
  const changeType = (event) => setDefinition({...definition, type: event.target.value});
  const changeDetail = (event) => setDefinition({...definition, detail: event.target.value});
  const deleteDefinition = () => setDefinition(null);

  useEffect(() => {
    if (isPresent(definition.type) && mapValues(first)(VALID_TYPES).includes(definition.type)) {
      setIsTypeValid(true);
    }
    if (isPopulated(definition.detail)) {
      setIsDetailValid(true);
    }
  }, [definition.detail, definition.id, definition.type]);

  return <section className="list-group-item">
    <section className="form-group">
      <label htmlFor={`definition-${definition.id}`}>Definition</label>
      <section className="input-group">
        <select aria-label="word" className={`custom-select ${validationClassName(isTypeValid)}`} value={definition.type} onBlur={changeType} onChange={changeType}>
          {mapValues(([slug, text]) => <option key={slug} value={slug}>{text}</option>)([...INVALID_TYPES, ...VALID_TYPES])}
        </select>
        <section className="input-group-append">
          <button type="button" className="btn btn-outline-danger" onClick={deleteDefinition}>Delete</button>
        </section>
      </section>
      <section className="invalid-feedback">
        You must pick one of the valid types.
      </section>
    </section>

    <section className="form-group">
      <textarea id={`definition-${definition.id}`} required aria-label="detail" className={`form-control ${validationClassName(isDetailValid)}`} defaultValue={definition.detail} onChange={changeDetail} />
      <section className="invalid-feedback">
        You need to have something here.
      </section>
    </section>
  </section>;
}
