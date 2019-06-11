import React from "react";

export default function Definitions ({definitions}) {
  return <>
    {
      Object.entries(definitions).map(([id, definition]) => {
        return <p key={`result-definition-${id}`} className="mb-1" type={definition.type}>
          [{definition.type}] {definition.detail}
        </p>;
      })
    }
  </>;
}
