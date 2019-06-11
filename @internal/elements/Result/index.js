import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {connect} from "react-redux";
import {mergeDeepRight} from "@unction/complete";

import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";
import Word from "./Word";
import Definitions from "./Definitions";
import Metadata from "./Metadata";
import view from "@internal/view";

export default view([
  connect(),
  function Result (properties) {
    const {dispatch} = properties;
    const {id} = properties;
    const {score} = properties;
    const {result} = properties;
    const [payload, setPayload] = useState(result);
    const [mode, setMode] = useState("viewing");
    const {word} = mode === "editing" ? payload : result;
    const {definitions} = mode === "editing" ? payload : result;

    useEffect(() => {
      const set = async () => {
        await dispatch.database.writeEntry({...result, word: payload.word, definitions: payload.definitions});
      };

      if (mode === "saving") {
        set();
        setMode("viewing");
      }
    }, [definitions, dispatch.database, mode, payload, result, word]);

    const changeDefinitions = (value) => {
      setPayload(mergeDeepRight(payload)({definitions: value}));
    };

    return <section className="list-group-item" id={id} score={score}>
      {mode === "editing" && <EditWord word={word} setWord={(value) => setPayload({...payload, word: value})} />}
      {mode === "viewing" && <Word word={word} />}
      {mode === "editing" && <EditDefinitions changeDefinitions={changeDefinitions} definitions={definitions} />}
      {mode === "viewing" && <Definitions definitions={definitions} />}
      <Metadata id={id} score={score} setMode={setMode} mode={mode} />
    </section>;
  },
]);
