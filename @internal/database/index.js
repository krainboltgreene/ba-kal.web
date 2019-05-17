import PouchDB from "pouchdb";

export default function local () {
  return new PouchDB("local");
}
