import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {dig} from "@unction/complete";
import {mapValues} from "@unction/complete";
import {compact} from "@unction/complete";

import view from "@internal/view";
import {Page} from "@internal/ui";
import {SearchBar} from "@internal/elements";
import {Result} from "@internal/elements";
import {mediaqueries} from "@internal/typography";

const MINIMUM_SEARCH_SIZE = 1;
const DEFAULT_OPTIONS = {
  searchWords: true,
};
const meetsMinimumForSearch = (query) => query && query.length > MINIMUM_SEARCH_SIZE;
const grid = mediaqueries({
  display: "grid",
  gridTemplateColumns: [
    "repeat(auto-fill, minmax(250px, 1fr))",
    "repeat(auto-fill, minmax(350px, 1fr))",
    "repeat(auto-fill, minmax(450px, 1fr))",
    "repeat(auto-fill, minmax(450px, 1fr))",
    "repeat(auto-fill, minmax(650px, 1fr))",
  ],
  gridGap: ".5rem",
});

export default view([
  connect(createStructuredSelector({
    lastReplicationPausedAt: dig(["database", "replication", "lastPausedAt"]),
  })),
  function SearchPage (properties) {
    const {dispatch} = properties;
    const {lastReplicationPausedAt} = properties;
    const [{rows}, setResults] = useState({rows: []});
    const [query, setQuery] = useState();
    const [options, setOptions] = useState(DEFAULT_OPTIONS);

    useEffect(() => {
      if (meetsMinimumForSearch(query)) {
        const search = async () => {
          setResults(await dispatch.database.search([query, compact([
            options.searchWords ? "word" : null,
            options.searchEtymologies ? "etymologies" : null,
            options.searchDefinitions ? "definitions.detail" : null,
            options.searchNotes ? "note" : null,
            options.searchExamples ? "examples" : null,
          ])]));
        };

        search();
      } else {
        setResults({rows: []});
      }
    }, [dispatch.database, options.searchDefinitions, options.searchEtymologies, options.searchNotes, options.searchWords, query, lastReplicationPausedAt, options.searchExamples]);


    return <Page subtitle="Search the dictionary" hasHeader={false}>
      <SearchBar query={query} setQuery={setQuery} options={options} setOptions={setOptions} />
      <section className="card-deck" css={grid}>
        {mapValues(({id, score, doc: result}) => <Result key={id} id={id} score={score} result={result} />)(rows)}
      </section>
    </Page>;
  },
]);
