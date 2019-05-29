import React from "react";
import ResultAction from "../ResultAction";

export default function ResultFooter ({score, setMode, mode}) {
  return <footer className="mt-2 d-flex w-100 justify-content-between">
    <ResultAction key="result-footer-action" setMode={setMode} mode={mode} />
    <small key="result-footer-score" className="text-muted">{score}</small>
  </footer>;
}
