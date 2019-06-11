import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {connect} from "react-redux";
import {mergeDeepRight} from "@unction/complete";
import {isPopulated} from "@unction/complete";
import {createStructuredSelector} from "reselect";
import {dig} from "@unction/complete";

import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";
import Word from "./Word";
import Definitions from "./Definitions";
import Metadata from "./Metadata";
import view from "@internal/view";

export default view([
  connect(createStructuredSelector({
    replicatedIds: dig(["replication", "incoming"]),
  })),
  function Result (properties) {
    const {dispatch} = properties;
    const {id} = properties;
    const {score} = properties;
    const {replicatedIds} = properties;
    const [payload, setPayload] = useState({});
    const [mode, setMode] = useState("viewing");
    const [entryLoaded, setEntryLoaded] = useState(false);
    const [result, setResult] = useState({});
    const {word} = mode === "editing" ? payload : result;
    const {definitions} = mode === "editing" ? payload : result;

    useEffect(() => {
      const set = async () => {
        if (mode === "saving") {
          await dispatch.database.writeEntry(payload);

          setEntryLoaded(new Date());

          setMode("viewing");
        }
      };

      set();
    }, [dispatch.database, mode, payload]);

    useEffect(() => {
      const get = async () => {
        const entry = await dispatch.database.getEntry(id);

        setResult(entry);
        setPayload(entry);

        setEntryLoaded(new Date());
      };

      if (!isPopulated(result)) {
        get();
      } else if (replicatedIds.includes(id)) {
        get();
      }
    }, [dispatch.database, id, replicatedIds, result]);

    if (!entryLoaded) {
      return null;
    }

    const changeDefinitions = (value) => {
      setPayload(mergeDeepRight(payload)({definitions: value}));
    };

    return <section className="list-group-item" id={id} score={score} definitionloaded={entryLoaded}>
      {mode === "editing" && <EditWord word={word} setWord={(value) => setPayload({...payload, word: value})} />}
      {mode === "viewing" && <Word entryLoaded={entryLoaded} word={word} />}
      {mode === "editing" && <EditDefinitions changeDefinitions={changeDefinitions} definitions={definitions} />}
      {mode === "viewing" && <Definitions definitions={definitions} />}
      <Metadata key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />
    </section>;
  },
]);
