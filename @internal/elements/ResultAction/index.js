import React from "react";

export default function ResultAction ({setMode, mode}) {
  if (mode === "editing") {
    return <button type="button" className="btn btn-primary btn-sm" onClick={() => setMode("saving")}>save</button>;
  }

  if (mode === "saving") {
    return <small className="text-info">loading</small>;
  }

  if (mode === "errored") {
    return <small className="text-danger">error</small>;
  }

  return <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => setMode("editing")}>edit</button>;
}
