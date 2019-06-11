import React from "react";
import {storiesOf} from "@storybook/react";
import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";
import Metadata from "./Metadata";

const state = {
  id: "1",
  score: "0.99",
  mode: "viewing",
  word: "example",
  entryLoaded: true,
  definitions: {
    "1a": {
      type: "v",
      detail: "An example detail",
    },
  },
};
const changeWord = (word) => {
  state.word = word;
};
const changeDefinitions = (definition) => {
  state.definitions = {...state.definitions, definition};
};
const setMode = (mode) => {
  state.mode = mode;
};

storiesOf("Result", module)
  .add("in edit mode", () => {
    return <section className="list-group-item" id={state.id} score={state.score} definitionloaded={state.entryLoaded}>
      <EditWord word={state.word} setWord={changeWord} />
      <EditDefinitions changeDefinitions={changeDefinitions} definitions={state.definitions} />
      <Metadata key="result-footer" id={state.id} score={state.score} setMode={setMode} mode={state.mode} />
    </section>;
  });
