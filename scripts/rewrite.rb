require("couchrest")

server = CouchRest.new
database = server.database("dictionary")
database.all_docs({include_docs: true}) do |entry|
  database.save_doc(entry.fetch("doc").merge(
    "note" => entry.fetch("doc").fetch("note").strip,
    "etymologies" => entry.fetch("doc").fetch("etymologies").strip,
    "examples" => entry.fetch("doc").fetch("examples").strip,
  ))
end
