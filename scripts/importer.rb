require("pry")
require("pry-remote")
require("pry-doc")
require("ox")
require("htmlentities")
require("uri")
require("net/http")
require("securerandom")
require("base64")
require("concurrent")

ORIGIN = "http://localhost:5984"
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

def rewrite_definition(entry, pattern, multiple: false)
  detail = entry.fetch("definitions").first.fetch("detail")

  return entry unless detail.match?(pattern)

  before = detail
  after = detail.gsub(pattern, "[")

  matching = detail.match(pattern).to_a.last.
    gsub(' .', '.').
    gsub(' ,', ',').
    gsub(' ;', ';').
    gsub("— ", "")

  yield(if multiple
    matching
      .split("\n")
      .map(&:strip).reject(&:empty?)
  else
    matching
      .strip
  end)
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
records = flat_hash(
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
        "_id" => SecureRandom.uuid,
        "word" => DECODE.call(word_node.text.strip),
        "definitions" => [
          {
            "id" => SecureRandom.uuid(),
            "type" => "unknown",
            "detail" => DECODE.call(extra.map(&:text).compact.map(&:strip).join(" "))
          }
        ],
        "examples" => "",
        "etymologies" => "",
        "note" => "",
      )
    end
  end)
end.
  reduce([]) do |previous, (group, records)|
    [*previous, records.map do |record|
      record.merge("group" => group)
    end]
  end.flatten.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("[", "^[")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub(": \n ", ": ")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Compare also:", "^Compare also:")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Compare:", "^Compare:")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Calque:", "^Calque:")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Alternative:", "^Alternative:")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Abbreviation:", "^Abbreviation:")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("Abbreviation of", "^Abbreviation of")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail").gsub("]", "]$")
        )
      ]
    )
  end.
  map do |entry|
    entry.merge(
      "definitions" => [
        entry.fetch("definitions").first.merge(
          "detail" => entry.fetch("definitions").first.fetch("detail") + "^"
        )
      ]
    )
  end.
  map do |entry|
    rewrite_definition(entry, /Etymology: (.+?)\^/mi) do |matches|
      entry.merge(
        "etymologies" => "#{entry.fetch("etymologies")}\n#{matches}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Etymolgoy: (.+?)\^/mi) do |matches|
      entry.merge(
        "etymologies" => "#{entry.fetch("etymologies")}\n#{matches}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Etymology (?:\d): (.+?)\^/mi) do |matches|
      entry.merge(
        "etymologies" => "#{entry.fetch("etymologies")}\n#{matches}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Etymolgoy (?:\d): (.+?)\^/mi) do |matches|
      entry.merge(
        "etymologies" => "#{entry.fetch("etymologies")}\n#{matches}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Note: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\n#{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Calque: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nCalque: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Phono-semantic matching: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nPhono-semantic matching: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Alternative: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nAlternative: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[n\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "n",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[vi\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "vi",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[conjunction\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "conjunction",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[vt\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "vt",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[vti\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "vti",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[vs\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "vs",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[vo\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "vo",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[pf\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "pf",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[adv\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "adv",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[helping verb\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "helping verb",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[prep\]\$(.+?)\^/mi, multiple: true) do |matches|
      entry.merge(
        "definitions" => [
          *entry.fetch("definitions"),
          *matches.map do |detail|
            {
              "id" => SecureRandom.uuid,
              "type" => "prep",
              "detail" => detail
            }
          end
        ]
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[ex\]\$(.+?)\^/mi) do |matches|
      entry.merge(
        "examples" => "#{entry.fetch("examples")}\n#{matches}"
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[example\]\$(.+?)\^/mi) do |matches|
      entry.merge(
        "examples" => "#{entry.fetch("examples")}\n#{matches}"
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[phrase\]\$(.+?)\^/mi) do |matches|
      entry.merge(
        "examples" => "#{entry.fetch("examples")}\n#{matches}"
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\[ph\]\$(.+?)\^/mi) do |matches|
      entry.merge(
        "examples" => "#{entry.fetch("examples")}\n#{matches}"
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Compare: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nCompare: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Compare (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nCompare: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Contraction: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nContraction: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\AEnglish (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nEnglish #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\AArabic (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nArabic #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\AGerman (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nGerman #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\ASinitic (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nSinitic #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\ARussian (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nRussian #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\ASpanish (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nSpanish #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /\APortuguese (.+?)\^/mi) do |(first, *rest)|
      entry.merge(
        "etymologies" => "#{entry.fetch("examples")}\nPortuguese #{first}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /See: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nSee: #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Abbreviation: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nAbbreviation of #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Abbreaviation: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nAbbreaviation of #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Portmanteau: (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nPortmanteau of #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Portmanteau of (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nPortmanteau of #{matching}",
      )
    end
  end.
  map do |entry|
    rewrite_definition(entry, /Abbreviation of (.+?)\^/mi) do |matching|
      entry.merge(
        "note" => "#{entry.fetch("note")}\nAbbreviation of #{matching}",
      )
    end
  end.
  map do |entry|
    entry.merge(
      "note" => entry.fetch("note").strip,
      "examples" => entry.fetch("examples").strip,
      "etymologies" => entry.fetch("etymologies").strip,
    )
  end.
  map do |entry|
    first, *rest = entry.fetch("definitions")

    entry.merge(
      "leftover" => first.fetch("detail").
        gsub(/\[n\]\$.+?\^/mi, '').
        gsub(/\[vi\]\$.+?\^/mi, '').
        gsub(/\[vt\]\$.+?\^/mi, '').
        gsub(/\[vs\]\$.+?\^/mi, '').
        gsub(/\[vo\]\$.+?\^/mi, '').
        gsub(/\[vti\]\$.+?\^/mi, '').
        gsub(/\[ex\]\$.+?\^/mi, '').
        gsub(/\[conjunction\]\$.+?\^/mi, '').
        gsub(/\[ph\]\$.+?\^/mi, '').
        gsub(/\[pf\]\$.+?\^/mi, '').
        gsub(/\[helping verb\]\$.+?\^/mi, '').
        gsub(/\[adv\]\$.+?\^/mi, '').
        gsub(/\[example\]\$.+?\^/mi, '').
        gsub(/\[phrase\]\$.+?\^/mi, '').
        gsub(/\[prep\]\$.+?\^/mi, '').
        gsub(/Abbreviation: .+?\^/mi, '').
        gsub(/Abbreaviation: .+?\^/mi, '').
        gsub(/Contraction: .+?\^/mi, '').
        gsub(/Phono-semantic matching: .+?\^/mi, '').
        gsub(/Abbreviation of .+?\^/mi, '').
        gsub(/Alternative: .+?\^/mi, '').
        gsub(/Portmanteau: .+?\^/mi, '').
        gsub(/Portmanteau of .+?\^/mi, '').
        gsub(/Compare: .+?\^/mi, '').
        gsub(/Compare .+?\^/mi, '').
        gsub(/See: .+?\^/mi, '').
        gsub(/Etymology: .+?(?:\^|\z)/mi, '').
        gsub(/Etymolgoy: .+?(?:\^|\z)/mi, '').
        gsub(/Etymolgoy \d: .+?(?:\^|\z)/mi, '').
        gsub(/Etymology \d: .+?(?:\^|\z)/mi, '').
        gsub(/Note: .+?\^/mi, '').
        gsub(/Calque: .+?\^/mi, '').
        gsub(/\AEnglish .+?\^/mi, '').
        gsub(/\AGerman .+?\^/mi, '').
        gsub(/\AArabic .+?\^/mi, '').
        gsub(/\ASinitic .+?\^/mi, '').
        gsub(/\ASpanish .+?\^/mi, '').
        gsub(/\ARussian .+?\^/mi, '').
        gsub(/\APortuguese .+?\^/mi, '').
        gsub(/\^/mi, '').
        gsub(/\A \z/, '').
        gsub(/\A\n\z/, '').
        gsub(/\A\n \z/, '')
    )
  end.
  map do |entry|
    first, *rest = entry.fetch("definitions")

    entry.merge(
      "original" => first,
      "definitions" => rest
    )
  end

puts "Creating database..."
url = URI("#{ORIGIN}/dictionary")
http = Net::HTTP.new(url.host, url.port)
request = Net::HTTP::Put.new(url)
request["accept"] = "application/json"
request["content-type"] = "application/json"
http.request(request)

def find(id)
  puts "Finding dictionary entry..."
  url = URI("#{ORIGIN}/dictionary/#{id}")
  http = Net::HTTP.new(url.host, url.port)
  request = Net::HTTP::Get.new(url)
  request["accept"] = "application/json"

  http.request(request)
end

def create(record)
  puts "Writing to dictionary..."
  url = URI("#{ORIGIN}/dictionary")
  http = Net::HTTP.new(url.host, url.port)
  request = Net::HTTP::Post.new(url)
  request["accept"] = "application/json"
  request["content-type"] = "application/json"
  request.body = record.to_json

  http.request(request)
end

pool = Concurrent::FixedThreadPool.new(5)

records.each do |record|
  pool.post do
    find_response = find(record.fetch("_id"))

    unless find_response.kind_of?(Net::HTTPOK)
      create(record)
    end
  end
end

pool.wait_for_termination
