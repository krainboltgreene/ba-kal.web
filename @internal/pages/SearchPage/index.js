import React from "react";
import {useEffect} from "react";
import {useState} from "react";
import {connect} from "react-redux";

import view from "@internal/view";
import {Page} from "@internal/ui";
import {Search} from "@internal/elements";
import {Results} from "@internal/elements";

const MINIMUM_SEARCH_SIZE = 1;
const DEFAULT_OPTIONS = {
  searchDefinitions: false,
};

const meetsMinimumForSearch = (query) => query && query.length > MINIMUM_SEARCH_SIZE;

export default view([
  connect(),
  function SearchPage (properties) {
    const {dispatch} = properties;
    const [{total_rows: resultCount, rows, offset}, setResults] = useState({});
    const [query, setQuery] = useState();
    const [options, setOptions] = useState(DEFAULT_OPTIONS);

    useEffect(() => {
      if (meetsMinimumForSearch(query) && options.searchDefinitions) {
        const search = async () => {
          setResults(await dispatch.search.wordOrDefinition(query));
        };

        search();
      } else if (meetsMinimumForSearch(query)) {
        const search = async () => {
          setResults(await dispatch.search.word(query));
        };

        search();
      } else {
        setResults({});
      }
    }, [query, options, dispatch.search]);

    return <Page subtitle="Search the dictionary" hasHeader={false}>
      <Search key="search" query={query} setQuery={setQuery} options={options} setOptions={setOptions} />
      <Results key="results" resultCount={resultCount} rows={rows} offset={offset} />
    </Page>;
  },
]);
