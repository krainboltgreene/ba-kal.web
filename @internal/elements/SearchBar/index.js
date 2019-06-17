import React from "react";
import {connect} from "react-redux";
import view from "@internal/view";

const MINIMUM_DOCUMENT_COUNT = 0;

export default view([
  connect(),
  function SearchBar (properties) {
    const {pendingDocumentCount} = properties;
    const {setQuery} = properties;
    const {query} = properties;
    const {setOptions} = properties;
    const {options} = properties;
    const updateSearch = (event) => setQuery(event.target.value);
    const updateOptions = (option) => () => setOptions({...options, [option]: !options[option]});

    return <form className="py-1" onSubmit={(event) => event.preventDefault()}>
      <section className="form-row">
        <section className="col">
          <section className="input-group">
            <section className="input-group-prepend">
              <label className="input-group-text" htmlFor="search">Search</label>
            </section>

            <input id="search" aria-label="search" required placeholder="Type here to search" className="form-control form-control-lg" type="text" disabled={pendingDocumentCount > MINIMUM_DOCUMENT_COUNT} onChange={updateSearch} value={query} autoComplete="off" />
          </section>
        </section>
      </section>

      <section className="form-row">
        <section className="col d-flex justify-content-end flex-wrap">
          <section className="form-check form-check-inline">
            <input aria-label="search words" id="searchWords" className="form-check-input" type="checkbox" onChange={updateOptions("searchWords")} checked={options.searchWords} />
            <label className="form-check-label" htmlFor="searchWords">Words</label>
          </section>
          <section className="form-check form-check-inline">
            <input aria-label="search definitions" id="searchDefinitions" className="form-check-input" type="checkbox" onChange={updateOptions("searchDefinitions")} checked={options.searchDefinitions} />
            <label className="form-check-label" htmlFor="searchDefinitions">Definitions</label>
          </section>
          <section className="form-check form-check-inline">
            <input aria-label="search etymologies" id="searchEtymologies" className="form-check-input" type="checkbox" onChange={updateOptions("searchEtymologies")} checked={options.searchEtymologies} />
            <label className="form-check-label" htmlFor="searchEtymologies">Etymologies</label>
          </section>
          <section className="form-check form-check-inline">
            <input aria-label="search examples" id="searchExamples" className="form-check-input" type="checkbox" onChange={updateOptions("searchExamples")} checked={options.searchExamples} />
            <label className="form-check-label" htmlFor="searchExamples">Examples</label>
          </section>
          <section className="form-check form-check-inline">
            <input aria-label="search notes" id="searchNotes" className="form-check-input" type="checkbox" onChange={updateOptions("searchNotes")} checked={options.searchNotes} />
            <label className="form-check-label" htmlFor="searchNotes">Notes</label>
          </section>
        </section>
      </section>
    </form>;
  },
]);
