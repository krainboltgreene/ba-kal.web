require("pry")
require("pry-remote")
require("pry-doc")
require("ox")
require("htmlentities")
require("uri")
require("net/http")
require("base64")

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

puts "Reading from raw file..."
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
      hash.merge(
        "_id" => Base64.urlsafe_encode64(DECODE.call(word_node.text.strip)),
        "word" => DECODE.call(word_node.text.strip),
        "definitions" => {
          "unknown" => [
            DECODE.call(extra.map(&:text).compact.map(&:strip).join(" "))
          ]
        },
        "examples" => [],
        "etymologies" => [],
        "note" => ""
      )
    end
  end)
end.reduce([]) do |previous, (group, records)|
  [*previous, records.map do |record|
    record.merge("group" => group)
  end]
end.flatten

url = URI("http://35.224.124.140:5984/dictionary")
http = Net::HTTP.new(url.host, url.port)

puts "Creating database..."
request = Net::HTTP::Put.new(url)
request["accept"] = "application/json"
request["content-type"] = "application/json"
puts http.request(request)

DATABASE.each do |record|
  puts "Finding dictionary entry..."
  url = URI("http://35.224.124.140:5984/dictionary/#{record.fetch("_id")}")
  http = Net::HTTP.new(url.host, url.port)
  request = Net::HTTP::Get.new(url)
  request["accept"] = "application/json"

  puts response = http.request(request)

  if response.kind_of?(Net:HTTPSuccess)
    document = JSON.parse(response.body)

    revision = document.fetch("_rev")

    puts "Updating dictionary entry..."

    url = URI("http://35.224.124.140:5984/dictionary/#{record.fetch("_id")}")
    http = Net::HTTP.new(url.host, url.port)
    request = Net::HTTP::Put.new(url)
    request["accept"] = "application/json"
    request["content-type"] = "application/json"
    request.body = JSON.dump(record.merge({"_rev" => revision}))

    puts http.request(request)
  else
    puts "Importing into dictionary..."
    DATABASE.each do |record|
      puts "Writing to dictionary..."
      request = Net::HTTP::Post.new(url)
      request["accept"] = "application/json"
      request["content-type"] = "application/json"
      request.body = record.to_json
      puts http.request(request)
    end
  end
end
