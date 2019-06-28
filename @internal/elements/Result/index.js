import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import {connect} from "react-redux";
import {dig} from "@unction/complete";
import {createStructuredSelector} from "reselect";

import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";
import EditEtymologies from "./EditEtymologies";
import Etymologies from "./Etymologies";
import EditExamples from "./EditExamples";
import Examples from "./Examples";
import EditNote from "./EditNote";
import Note from "./Note";
import Word from "./Word";
import Definitions from "./Definitions";
import Metadata from "./Metadata";
import Actions from "./Actions";
import view from "@internal/view";

const FADED = 0.5;
const VISIBLE = 1;

export default view([
  connect(createStructuredSelector({
    isSearching: dig(["database", "search", "active"]),
  })),
  function Result (properties) {
    const {dispatch} = properties;
    const {id} = properties;
    const {score} = properties;
    const {result} = properties;
    const {isSearching} = properties;
    const [payload, setPayload] = useState(result);
    const [mode, setMode] = useState("viewing");
    const {word} = mode === "editing" ? payload : result;
    const {etymologies} = mode === "editing" ? payload : result;
    const {examples} = mode === "editing" ? payload : result;
    const {definitions} = mode === "editing" ? payload : result;
    const {note} = mode === "editing" ? payload : result;
    const setSaving = () => setMode("saving");
    const setDeleting = () => setMode("deleting");
    const setViewing = () => setMode("viewing");
    const setEditing = () => setMode("editing");


    useEffect(() => {
      const set = async () => {
        await dispatch.database.writeEntry({
          ...result,
          word: payload.word,
          definitions: payload.definitions,
          etymologies: payload.etymologies,
          examples: payload.examples,
          note: payload.note,
        });
      };
      const remove = async () => {
        await dispatch.database.deleteEntry(id);
      };

      if (mode === "saving") {
        set();
        setViewing();
      } else if (mode === "deleting") {
        remove();
        setViewing();
      }
    }, [definitions, dispatch.database, id, mode, payload, result, word]);

    const setDefinitions = (value) => {
      setPayload({...payload, definitions: value});
    };
    const changeWord = (value) => setPayload({...payload, word: value});
    const changeEtymologies = (value) => setPayload({...payload, etymologies: value});
    const changeExamples = (value) => setPayload({...payload, examples: value});
    const changeNote = (value) => setPayload({...payload, note: value});

    return <section className="card" css={{opacity: isSearching ? FADED : VISIBLE}} id={id} score={score}>
      {mode === "editing" && <EditWord word={word} changeWord={changeWord} />}
      {mode === "viewing" && <Word word={word} />}
      {mode === "editing" && <EditDefinitions setDefinitions={setDefinitions} definitions={definitions} />}
      {mode === "viewing" && <Definitions definitions={definitions} />}
      {mode === "editing" && <EditEtymologies etymologies={etymologies} changeEtymologies={changeEtymologies} />}
      {mode === "viewing" && <Etymologies etymologies={etymologies} />}
      {mode === "editing" && <EditExamples examples={examples} changeExamples={changeExamples} />}
      {mode === "viewing" && <Examples examples={examples} />}
      {mode === "editing" && <EditNote note={note} changeNote={changeNote} />}
      {mode === "viewing" && <Note note={note} />}
      <Metadata id={id} score={score} mode={mode} />
      <Actions mode={mode} setSaving={setSaving} setDeleting={setDeleting} setViewing={setViewing} setEditing={setEditing} setDefinitions={setDefinitions} definitions={definitions} />
    </section>;
  },
]);
