import React from "react";
import {useEffect} from "react";
import {useState} from "react";

import {Page} from "@internal/ui";
import {Search} from "@internal/elements";
import {Results} from "@internal/elements";

const MINIMUM_SEARCH_SIZE = 1;
const DEFAULT_OPTIONS = {};

const meetsMinimumForSearch = (query) => query && query.length > MINIMUM_SEARCH_SIZE;

export default function TranslatePage () {
  const [{total_rows: resultCount, rows, offset}, setResults] = useState({});
  const [query, setQuery] = useState();
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  useEffect(() => {
    if (meetsMinimumForSearch(query)) {
      const search = async () => {
        const results = await translatePhrase(database, query);

        setResults(results);
      };

      search();
    } else {
      setResults({});
    }
  }, [query, options]);

  return <Page subtitle="Welcome!" hasHeader={false}>
    <Search key="search" query={query} setQuery={setQuery} options={options} setOptions={setOptions} />
    <Results key="results" resultCount={resultCount} rows={rows} offset={offset} />
  </Page>;
}
