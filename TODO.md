// import {ReplicationContext} from "@internal/contexts";

// const DEFAULT_DOCUMENT_COUNT = 0;
// const replicationContext = useContext(ReplicationContext);
// const [documentCount, setDocumentCount] = useState(DEFAULT_DOCUMENT_COUNT);
// const [replicationState, setReplicationState] = useState(replicationContext);

// state.removeAllListeners("change");
// replicationContext.on("change", setReplicationState);

// useEffect(() => {
//   localDatabaseContext
//     .info()
//     .then(({doc_count}) => setDocumentCount(doc_count))
//     .catch(console.error);
// }, [replicationState.last_seq]);



import {uniqBy} from "ramda";
import moment from "moment";
const [rootLoaded, setRootLoaded] = useState(false);
const [rootResults, setRootResults] = useState({});
  useEffect(async () => {
    if (word) {
      const subresults = await database.findRelatedWords(word)
      const subresults = await Promise.all(
        word
          .split(" / ")
          .flatMap((subsection) => subsection.split(" "))
          .map((subword) => database.search({query: subword, fields: ["word"], highlighting: true, highlighting_pre: "<strong class=\"text-info\">"}))
      );

      const mergedSubresults = subresults.reduce((accumulation, subresult) => ({total_rows: accumulation.total_rows + subresult.total_rows, rows: [...accumulation.rows, ...subresult.rows]}));

      setRootResults(
        {...mergedSubresults, rows: uniqBy((record) => record.id, mergedSubresults.rows)}
      );

      setRootLoaded(new Date());
    }
  }, [entryLoaded, word]);
<ResultRoot key="result-root" rootLoaded={rootLoaded} {...rootResults} />
