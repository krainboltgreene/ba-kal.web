import React from "react";
import {storiesOf} from "@storybook/react";
import EditWord from "./EditWord";
import EditDefinitions from "./EditDefinitions";

storiesOf("Result", module)
  .add("in edit mode", () => {
    return <section className="list-group-item" id={id} score={score} definitionloaded={entryLoaded}>
      <EditWord word={word} setWord={(value) => setPayload({...payload, word: value})} />
      <EditDefinitions changeDefinitions={changeDefinitions} definitions={definitions} />
      <Metadata key="result-footer" id={id} score={score} setMode={setMode} mode={mode} />
    </section>;
  });
