import React from "react";
import Actions from "./Actions";

export default function Metadata ({score, setMode, mode}) {
  return <footer className="mt-2 d-flex w-100 justify-content-between align-items-center">
    <Actions setMode={setMode} mode={mode} />
    <small className="text-muted">{score}</small>
  </footer>;
}
