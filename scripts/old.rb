# [#<Ox::Element:0x00007fb2c31f6440
#   @nodes=
#    [#<Ox::Element:0x00007fb2c31f6378 @nodes=["ap / ап / اپ"], @value="span">,
#     #<Ox::Element:0x00007fb2c31f6238 @nodes=["\n Etymology: Quechua"], @value="span">,
#     #<Ox::Element:0x00007fb2c31f60f8 @nodes=["api"], @value="span">,
#     #<Ox::Element:0x00007fb2c31f5fb8
#      @nodes=
#       [".\n [vs]\n &mdash; soft ; flexible, pliable, bendy, tender, yielding, lenient\n &mdash; soft; weak, feeble, delicate\n &mdash; gentle, mild\n &mdash; mild (of flavor)\n &mdash; easy, requiring little effort\n &mdash; weak, unsaturated\n &mdash; (finance) subsidized, not market rate, regulated"],
#      @value="span">],
#   @value="li">]
#
#
#
#
#   [#<Ox::Element:0x00007fb2c31f5d60
#     @nodes=
#      [#<Ox::Element:0x00007fb2c31f5c98 @nodes=["meap"], @value="span">,
#       #<Ox::Element:0x00007fb2c31f5b58 @nodes=["\n [vi]\n &mdash; to soften\n [vt]\n &mdash; to soften"], @value="span">],
#     @value="li">]
#
# <Word, Etymology?, ?, Definition>
# 0 = word
# 1 estimology?
# 2 ???
# 3. definition
#
#   if examples.any?
#     [
#       definition.split(/\n &mdash; /).reject(&:empty?) + if examples.any? then examples.join(": ") else "" end,
#     ].compact
#   else
#     definition.split(/\n &mdash; /).reject(&:empty?)
#   end

class Datastore
  attr_reader :store

  def initialize(raw)
    @raw = raw
    @nodes = flat_hash(
      Ox.parse(raw).locate("body/*").reject {|entity| ["p", "h2"].include?(entity.value)},
      ->(entity) {entity.value == "h1"}
    )

    @store = @nodes
    @chapters = @store.keys
  end
end

case key
when "Abbreviations"
  Hash[entries.first.nodes.first.nodes.first.split(/\n /).map do |item|
    item.match(/\[(\w+)\] = (\w+)/m).captures
  end]
when "Pronouns"
  Hash[entries.map(&:nodes).map do |nodes|
    nodes.map(&:text).compact.map(&:strip)
  end].transform_keys do |key|
    key.split(" / ")
  end.transform_values do |value|
    DECODE.(value.gsub(/&mdash; /, ""))
  end
when "Function words"
  entries.
    map(&:nodes).
    map{|node| node.map(&:text)}.
    map do |(key, definition, *examples)|
      {
        key.strip.split(" / ") => [definition, *examples].join(" ").split(/\n &mdash; /).reject(&:empty?).map(&DECODE)
      }
    end.
    reduce(&:merge)
when "Determiners"
  entries.
    map(&:nodes).
    map{|node| node.map(&:text)}.
    map do |(key, definition)|
      {
        key.strip.split(" / ") => DECODE.(definition.strip.gsub(/\n/, ""))
      }
    end.
    reduce(&:merge)
when "Numbers", "Proper nouns"
  entries.
    map(&:nodes).
    map{|node| node.map(&:text)}.
    map do |(key, *definition)|
      {
        key.strip.split(" / ") => DECODE.(definition.join(" ").strip.gsub(/\n/, ""))
      }
    end.
    reduce(&:merge)
when "Phrases"
  entries.
    map(&:nodes).
    map {|list| list.map(&:text).compact.map(&:strip).join(" ").gsub(/\n/, " ").gsub(/&mdash;/, "")}.
    map(&DECODE)
when "Idioms and proverbs"
  Hash[entries.map(&:nodes).map do |items|
    items.map(&:text).map(&:strip)
  end.map do |example, *translations|
    [example, translations.join(" ")]
  end]
when "Leters of the Latin Alphabet", "Letters of the Greek Alphabet"
  Hash[entries.map(&:nodes).map do |items|
    items.map(&:text)
  end].
    transform_keys(&DECODE).
    transform_keys{|key| key.split(" ")}.
    transform_values{|value| value.gsub(/&mdash; /, "")}.
    transform_values(&:strip).
    transform_values(&DECODE)
when "Onomatopoeia"
  Hash[entries.map(&:nodes).map do |items|
    items.map(&:text).compact.map(&:strip)
  end.map do |example, *translations|
    [example, translations.join(" ")]
  end].
    transform_keys(&DECODE).
    transform_values{|value| value.gsub(/&mdash; /, "")}.
    transform_values(&DECODE)
else
  entries.map(&:nodes).reduce({}) do |hash, (word_node, *extra)|
    next(hash) if word_node.text.nil?
    hash.merge({"word" => DECODE.call(word_node.text.strip), "extra" => DECODE.call(extra.map(&:text).compact.map(&:strip).join(" "))})
  end
end
