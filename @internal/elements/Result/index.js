import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {mergeDeepRight} from "@unction/complete";

import ResultHeader from "../ResultHeader";
import ResultFooter from "../ResultFooter";

export default function Result ({id, score}) {
  const [edit, setEdit] = useState({});
  const [mode, setMode] = useState("viewing");
  const [entryLoaded, setEntryLoaded] = useState(false);
  const [result, setResult] = useState({});
  const {word} = result;
  const {definitions} = result;

  useEffect(() => {
    const set = async () => {
      if (mode === "saving") {
        await writeEntry(database, id, edit);

        setEntryLoaded(new Date());
      }
    };

    set();
  }, [edit, id, mode]);

  useEffect(() => {
    const get = async () => {
      const entry = await getEntry(database, id);

      setResult(entry);

      setEntryLoaded(new Date());
    };

    get();
  }, [id, score]);

  if (entryLoaded && mode === "editing") {
    return <section className="list-group-item" id={id} score={score} definitionloaded={entryLoaded}>
      <form key="result-form" className="mb-1">
        <header key="result-form-header" className="form-group">
          <input type="text" className="form-control form-control-lg" value={word} onChange={(event) => setEdit(mergeDeepRight(edit, {word: event.target.value}))} />
        </header>
        {
          Object.entries(definitions).flatMap(([type, typeDefinitions]) => {
            return typeDefinitions.map((definition) => {
              return <section key={`result-form-definition-${type}-${definition}`} className="form-group">
                <textarea className="form-control" value={definition} onChange={(event) => setEdit(mergeDeepRight(edit, {definitions: {[type]: [event.target.value]}}))} />
              </section>;
            });
          })
        }
      </form>
      <ResultFooter key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />
    </section>;
  }

  if (entryLoaded) {
    return <section className="list-group-item" id={id} score={score} definitionloaded={entryLoaded}>
      <ResultHeader entryLoaded={entryLoaded} word={word} />
      {
        Object.entries(definitions).flatMap(([type, typeDefinitions]) => {
          return typeDefinitions.map((definition) => {
            return <p key={`result-definition-${type}-${definition}`} className="mb-1" type={type}>
              [{type}] ${definition}
            </p>;
          });
        })
      }
      <ResultFooter key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />
    </section>;
  }

  return null;
}
