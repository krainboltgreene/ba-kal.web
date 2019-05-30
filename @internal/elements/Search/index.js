import React from "react";
import {connect} from "react-redux";
import view from "@internal/view";

const MINIMUM_DOCUMENT_COUNT = 0;

export default view([
  connect(),
  function Search (properties) {
    const {pendingDocumentCount} = properties;
    const {setQuery} = properties;
    const {query} = properties;
    const {setOptions} = properties;
    const {options} = properties;
    const updateSearch = (event) => setQuery(event.target.value);
    const updateOptions = (option) => () => setOptions({...options, [option]: !options[option]});

    return <form key="search-form" className="py-1">
      <section className="form-row">
        <section className="col">
          <section className="input-group">
            <section className="input-group-prepend">
              <label className="input-group-text" htmlFor="search">Search</label>
            </section>

            <input id="search" className="form-control form-control-lg" type="text" disabled={pendingDocumentCount > MINIMUM_DOCUMENT_COUNT} onChange={updateSearch} value={query} />
          </section>
        </section>
      </section>

      <section className="form-row">
        <section className="col">
          <section className="form-check">
            <label className="form-check-label" htmlFor="search_definitions">
              <input id="search_definitions" className="form-check-input" type="checkbox" onChange={updateOptions("searchDefinitions")} checked={options.searchDefinitions} /> Search word &amp; definitions
            </label>
          </section>
        </section>
      </section>
    </form>;
  },
]);
