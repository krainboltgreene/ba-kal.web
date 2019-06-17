import React from "react";
import {storiesOf} from "@storybook/react";

import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";
import EditEtymology from "./EditEtymology";
import Etymology from "./Etymology";
import EditNote from "./EditNote";
import Note from "./Note";
import Word from "./Word";
import Definitions from "./Definitions";
import Metadata from "./Metadata";
import Actions from "./Actions";

const changeWord = (state) => (word) => {
  state.word = word;
};
const changeEtymology = (state) => (etymologies) => {
  state.etymologies = etymologies;
};
const changeNote = (state) => (note) => {
  state.note = note;
};
const setDefinitions = (state) => (definition) => {
  state.definitions = [...state.definitions, definition];
};
const setViewing = (state) => () => {
  state.mode = "viewing";
};
const setEditing = (state) => () => {
  state.mode = "editing";
};
const setDeleting = (state) => () => {
  state.mode = "deleting";
};

storiesOf("Result", module)
  .add("in edit mode", () => {
    const state = {
      id: "1",
      score: "0.99",
      mode: "editing",
      word: "example",
      definitions: [
        {
          id: "1a",
          type: "vi",
          detail: "An example detail",
        },
        {
          id: "2b",
          type: "n",
          detail: "Another example",
        },
      ],
    };

    return <section className="card" id={state.id} score={state.score}>
      <section className="card-body">
        {state.mode === "editing" && <>
          <EditWord word={state.word} changeWord={changeWord(state)} />
          <EditEtymology etymologies={state.etymologies} changeEtymology={changeEtymology(state)} />
          <EditDefinitions setDefinitions={setDefinitions(state)} definitions={state.definitions} />
          <EditNote note={state.note} changeNote={changeNote(state)} />
        </>}
        {state.mode === "viewing" && <>
          <Word word={state.word} />
          <Etymology etymologies={state.etymologies} />
          <Definitions definitions={state.definitions} />
          <Note note={state.note} />
        </>}
        <Actions mode={state.mode} setDeleting={setDeleting} setViewing={setViewing(state)} setEditing={setEditing(state)} />
      </section>
      <Metadata id={state.id} score={state.score} />
    </section>;
  });
