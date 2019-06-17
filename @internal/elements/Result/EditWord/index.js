import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {isPopulated} from "@unction/complete";

const validationClassName = (boolean) => {
  if (boolean === false) {
    return "is-invalid";
  }

  if (boolean === true) {
    return "is-valid";
  }

  return "";
};

export default function EditWord ({word, changeWord}) {
  const [isWordValid, setIsWordValid] = useState(false);

  useEffect(() => {
    if (isPopulated(word)) {
      setIsWordValid(true);
    }
  }, [word]);

  return <form className="card-body" noValidate onSubmit={(event) => event.preventDefault()}>
    <section className="form-group">
      <label htmlFor="word">Word</label>
      <input aria-label="word" type="text" required className={`form-control form-control-lg ${validationClassName(isWordValid)}`} value={word} onChange={(event) => changeWord(event.target.value)} />
    </section>
  </form>;
}
