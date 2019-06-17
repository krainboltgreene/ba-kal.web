import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {dig} from "@unction/complete";
import {mapValues} from "@unction/complete";

import view from "@internal/view";
import {Page} from "@internal/ui";
import {SearchBar} from "@internal/elements";
import {Result} from "@internal/elements";

const MINIMUM_SEARCH_SIZE = 1;
const DEFAULT_OPTIONS = {
  searchDefinitions: false,
};

const meetsMinimumForSearch = (query) => query && query.length > MINIMUM_SEARCH_SIZE;

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
      if (meetsMinimumForSearch(query) && options.searchDefinitions) {
        const search = async () => {
          setResults(await dispatch.database.searchWordOrDefinition(query));
        };

        search();
      } else if (meetsMinimumForSearch(query)) {
        const search = async () => {
          setResults(await dispatch.database.searchWord(query));
        };

        search();
      } else {
        setResults({rows: []});
      }
    }, [dispatch.database, options.searchDefinitions, query, lastReplicationPausedAt]);

    return <Page subtitle="Search the dictionary" hasHeader={false}>
      <section className="list-group">
      <SearchBar query={query} setQuery={setQuery} options={options} setOptions={setOptions} />
        {mapValues(({id, score, doc: result}) => <Result key={id} id={id} score={score} result={result} />)(rows)}
      </section>
    </Page>;
  },
]);
