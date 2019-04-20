require("concurrent-ruby")
require("pry")
require("pry-remote")
require("pry-doc")
require("ox")
require("htmlentities")
require("securerandom")
require("uri")
require("net/http")

DECODE = HTMLEntities.new.method(:decode)
IGNORED = [
  "Abbreviations",
  "Pronouns",
  "Function words",
  "Determiners",
  "Numbers",
  "Proper nouns",
  "Phrases",
  "Idioms and proverbs",
  "Leters of the Latin Alphabet",
  "Letters of the Greek Alphabet",
  "Onomatopoeia"
]
Ox.default_options = {
  mode: :generic,
  effort: :tolerant,
  smart: true
}
def flat_hash(list, cursor_check)
  list.reduce([{}, nil]) do |(hash, cursor), entity|
    if cursor_check.call(entity)
      [hash, entity]
    else
      [
        hash.merge(cursor => [*hash.fetch(cursor, nil), entity]),
        cursor
      ]
    end
  end.first
end

DATALAKE = File.
  read(File.join(".", "data", "Bukkalbakom.html")).
  gsub(Regexp.new(%(<hr style="page-break-before:always;display:none;">)), "").
  gsub(/class=".+?"/, "").
  gsub(/<br>/, "\n").
  gsub(/\n/, "\n").
  gsub(/\n\t\t\t\t\t/, "").
  gsub(/\n\t\t\t\t/, "").
  gsub(/&(r|l)dquo;/, "\"").
  gsub(/id=".+?"/, ""); nil
DATABASE = flat_hash(
  Ox.parse(DATALAKE).locate("body/*").reject {|entity| ["p", "h2"].include?(entity.value)},
  ->(entity) {entity.value == "h1"}
).transform_keys do |key|
  key.nodes.first.text.strip
end.reduce({}) do |hash, (key, list)|
  next(hash) if IGNORED.include?(key)
  hash.merge(key => list.map(&:nodes).map do |entries|
    entries.map(&:nodes).reduce({}) do |hash, (word_node, *extra)|
      next(hash) if word_node.text.nil?
      hash.merge("word" => DECODE.call(word_node.text.strip), "definition" => DECODE.call(extra.map(&:text).compact.map(&:strip).join(" ")))
    end
  end)
end.reduce([]) do |previous, (group, records)|
  [*previous, records.map do |record|
    record.merge("group" => group)
  end]
end.flatten

DATABASE.each do |record|
  url = URI("http://35.224.124.140:5984/dictionary")

  http = Net::HTTP.new(url.host, url.port)

  request = Net::HTTP::Post.new(url)
  request["accept"] = "application/json"
  request["content-type"] = "application/json"
  request.body = record.to_json

  http.request(request)
end
