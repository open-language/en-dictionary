![](assets/wordnet-readme-logo.png)

En-Dictonary is a node.js module which makes works and their relations available as a package.

## About

This packages uses the [en-wordnet](https://github.com/open-language/en-wordnet) package to make the words, their meanings and relationships available to your node.js package. It also adds helper functions for other ways to access the information.

![](https://img.shields.io/github/license/open-language/en-dictionary.svg)

## Quick Start

You can install the package via `bun` or `npm` or `yarn`, along with one of the wordnet databases:

```
bun init
bun add -d @types/bun
bun install en-dictionary
vi index.ts
```

Once it has been added, you need to initialize the dictionary, like so:

```js
const wordnet = require("en-wordnet").default;
const Dictionary = require("en-dictionary");

const start = async () => {
    const dictionary = new Dictionary(wordnet.get("3.0"));
    await dictionary.init();

    let result = dictionary.searchFor(["yet"]);
    console.log(result);

    result = dictionary.searchFor(["preposterous"]);
    console.log(result.get("preposterous").get("adjective"));
    console.log(JSON.stringify(result.get("preposterous").get("adjective"), null, '\t'));

    result = dictionary.searchSimpleFor(["preposterous"]);
    console.log(result);

    result = dictionary.wordsStartingWith("prestig");
    console.log(result)

    result = dictionary.wordsEndingWith("sterous");
    console.log(result)

    result = dictionary.wordsIncluding("grating");
    console.log(result);

    result = dictionary.wordsWithCharsIn("toaddndyrnrtssknwfsaregte");
    console.log(result)

    result = dictionary.wordsUsingAllCharactersFrom("indonesia");
    console.log(result);
};

await start()

export {}
```

And get started!
```js
bun run index.ts
```

There are some more [examples here](https://github.com/open-language/en-dictionary/blob/master/src/index.test.ts).

The dictionary can take about 2000ms to load the data in memory, it doesn't use an external database/redis yet (nor is that planned, since most queries are fast enough, and the underlying data doesn't changes probably once a year).

As of version 1.2.0, most lookups are extremely fast:

```txt
bun test v1.1.3 (2615dc74)

src/index.test.ts:
✓ Test the index file for EnDictionary > Test initialization [4.28ms]
✓ Test that all POS are indexed > searchFor(["smart"]) returns the predicted result for adjective sense [0.45ms]
✓ Test that all POS are indexed > searchOffsetsInDataFor() can find the specified offset [0.17ms]

dist/index.test.js:
✓ Test the index file for EnDictionary > Test initialization [1.10ms]
✓ Test that all POS are indexed > searchFor(["smart"]) returns the predicted result for adjective sense [0.06ms]
✓ Test that all POS are indexed > searchOffsetsInDataFor() can find the specified offset [0.02ms]

src/reader/index.test.ts:
✓ Test the reader functionality > Test initialization [3.56ms]

src/database/index.test.ts:
[0.02ms] addIndex
✓ Test the dictionary > Test addIndex [3.55ms]
[0.01ms] indexLemmaSearch
[0.00ms] indexLemmaSearch2
✓ Test the dictionary > Test IndexLemmaSearch [0.29ms]
[0.10ms] indexOffsetSearch
[0.05ms] indexOffsetSearch2
✓ Test the dictionary > Test IndexOffsetSearch [0.97ms]
[0.04ms] addData
✓ Test the dictionary > Test addData [0.19ms]
[0.10ms] dataLemmaSearch
[0.01ms] dataLemmaSearch2
✓ Test the dictionary > Test DataLemmaSearch [0.31ms]
[0.01ms] dataOffsetSearch
[0.00ms] dataOffsetSearch2
✓ Test the dictionary > Test DataOffsetSearch [0.05ms]

src/parser/data.line.test.ts:
✓ Test parsing a data line > Parse a data line [0.12ms]

src/parser/index.line.test.ts:
✓ Test parsing an index line > Parse an index line [0.15ms]

src/dictionary/index.test.ts:
[0.04ms] search
[0.04ms] search2
✓ Test the dictionary > Test searchWord [1.43ms]
[0.01ms] searchOffsetsInData
✓ Test the dictionary > Test searchOffsetsInData [0.05ms]
[0.36ms] searchSimple-drink,train
✓ Test the dictionary > Test searchSimple [0.40ms]
[7.54ms] wordsStartingWith
✓ Test the dictionary > Test wordsStartingWith [7.59ms]
[6.32ms] wordsEndingWith
✓ Test the dictionary > Test wordsEndingWith [6.38ms]
[9.82ms] wordsIncluding
✓ Test the dictionary > Test wordsIncluding [9.87ms]
[164.22ms] wordsUsingAllCharactersFrom
✓ Test the dictionary > Test wordsUsingAllCharactersFrom [164.31ms]
[238.15ms] wordsWithCharsIn
[291.85ms] wordsWithCharsIn-priority
✓ Test the dictionary > Test wordsWithCharsIn [530.26ms]
✓ Test the dictionary > Test hasAllCharsIn [0.17ms]
✓ Test the dictionary > Test weird inputs [192.01ms]

dist/reader/index.test.js:
✓ Test the reader functionality > Test initialization [2.76ms]

dist/database/index.test.js:
[0.01ms] addIndex
✓ Test the dictionary > Test addIndex [1.17ms]
[0.01ms] indexLemmaSearch
[0.00ms] indexLemmaSearch2
✓ Test the dictionary > Test IndexLemmaSearch [0.09ms]
[0.10ms] indexOffsetSearch
[0.01ms] indexOffsetSearch2
✓ Test the dictionary > Test IndexOffsetSearch [0.24ms]
[0.01ms] addData
✓ Test the dictionary > Test addData [0.11ms]
[0.08ms] dataLemmaSearch
[0.01ms] dataLemmaSearch2
✓ Test the dictionary > Test DataLemmaSearch [0.22ms]
[0.00ms] dataOffsetSearch
[0.00ms] dataOffsetSearch2
✓ Test the dictionary > Test DataOffsetSearch [0.04ms]

dist/utils/index.test.js:
✓ Test Utils > Test getArray [0.30ms]

dist/parser/index.line.test.js:
✓ Test parsing an index line > Parse an index line [0.16ms]

dist/parser/data.line.test.js:
✓ Test parsing a data line > Parse a data line [0.10ms]

dist/dictionary/index.test.js:
[0.03ms] search
[0.03ms] search2
✓ Test the dictionary > Test searchWord [1.27ms]
[0.02ms] searchOffsetsInData
✓ Test the dictionary > Test searchOffsetsInData [0.06ms]
[0.30ms] searchSimple-drink,train
✓ Test the dictionary > Test searchSimple [0.33ms]
[8.55ms] wordsStartingWith
✓ Test the dictionary > Test wordsStartingWith [8.61ms]
[8.34ms] wordsEndingWith
✓ Test the dictionary > Test wordsEndingWith [8.43ms]
[9.07ms] wordsIncluding
✓ Test the dictionary > Test wordsIncluding [9.14ms]
[164.23ms] wordsUsingAllCharactersFrom
✓ Test the dictionary > Test wordsUsingAllCharactersFrom [164.31ms]
[264.27ms] wordsWithCharsIn
[277.32ms] wordsWithCharsIn-priority
✓ Test the dictionary > Test wordsWithCharsIn [541.73ms]
✓ Test the dictionary > Test hasAllCharsIn [0.09ms]
✓ Test the dictionary > Test weird inputs [226.36ms]

 45 pass
 0 fail
 268 expect() calls
Ran 45 tests across 13 files. [6.86s]
```

### Query words

You can query for a single or multiple words with this syntax.

```js
let result = dictionary.searchFor(["preposterous"]);
console.log(JSON.stringify(result.get("preposterous").get("adjective"), null, '\t'));
```

Here's a sample outlet that you can expect for the queries above:

```json
{
	"lemma": "preposterous",
	"pos": "adjective",
	"offsetCount": 1,
	"offsets": [
		2570643
	],
	"offsetData": [
		{
			"offset": 2570643,
			"pos": "adjective satellite",
			"wordCount": 9,
			"words": [
				"absurd",
				"cockeyed",
				"derisory",
				"idiotic",
				"laughable",
				"ludicrous",
				"nonsensical",
				"preposterous",
				"ridiculous"
			],
			"pointerCnt": 5,
			"pointers": [
				{
					"symbol": "Similar to",
					"offset": 2570282,
					"pos": "adjective"
				},
				{
					"symbol": "Derivationally related form",
					"offset": 6607809,
					"pos": "noun"
				},
				{
					"symbol": "Derivationally related form",
					"offset": 852922,
					"pos": "verb"
				},
				{
					"symbol": "Derivationally related form",
					"offset": 4891683,
					"pos": "noun"
				},
				{
					"symbol": "Derivationally related form",
					"offset": 6607809,
					"pos": "noun"
				}
			],
			"glossary": [
				"incongruous",
				"inviting ridicule",
				"\"the absurd excuse that the dog ate his homework\"",
				"\"that's a cockeyed idea\"",
				"\"ask a nonsensical question and get a nonsensical answer\"",
				"\"a contribution so small as to be laughable\"",
				"\"it is ludicrous to call a cottage a mansion\"",
				"\"a preposterous attempt to turn back the pages of history\"",
				"\"her conceited assumption of universal interest in her rather dull children was ridiculous\""
			],
			"isComment": false
		}
	],
	"pointerCount": 1,
	"pointers": [
		{
			"symbol": "Similar to",
			"offset": 0,
			"pos": "adjective"
		}
	],
	"senseCount": 1,
	"tagSenseCount": 1,
	"isComment": false
}
```

There's also a simpler response version:

```js
let result = dictionary.searchSimpleFor(["preposterous"]);
console.log(result);
```

... which returns with a short and sweet

```js
Map(1) {
  "preposterous": Map(1) {
    "adjective": {
      words: "absurd, cockeyed, derisory, idiotic, laughable, ludicrous, nonsensical, preposterous, ridiculous",
      meaning: "incongruous",
      lemma: "preposterous",
    },
  },
}```

### Find words which start with, end with or include a certain set of words

You can find words which start or end with a specific set of words, you can do this:

```js
let result = dict.wordsStartingWith("prestig");
result = dict.wordsEndingWith("sterous");
result = dict.wordsIncluding("grating");
```

Here's what you would get on running the functions above:

```json
[ "prestigious", "prestige", "prestigiousness" ]
```

```json
[ "blusterous", "boisterous", "preposterous" ]
```

```json
[ "denigrating", "grating", "gratingly", "diffraction_grating", "grating", "integrating" ]
```

### Find words which can be created with a given set of words

This is useful when you're playing scrabble or a similar game. You can define the list of characters that you have available and the minimum length of the words that you need

```js
let result = dict.wordsWithCharsIn("toaddndyrnrtssknwfsaregte");
let result = dict.wordsWithCharsIn("toaddndyrnrtssknwfsaregte", "ab"); // In this case words with both a and b will show up on the top
```

You can expect the following output if you run the command above:

```js
Map(10) {
  "grandstander": Map(1) {
    "noun": {
      words: "grandstander",
      meaning: "someone who performs with an eye to the applause from spectators in the grandstand",
      lemma: "grandstander",
    },
  },
  "transgressor": Map(1) {
    "noun": {
      words: "transgressor",
      meaning: "someone who transgresses",
      lemma: "transgressor",
    },
  },
  "anterograde": Map(1) {
    "adjective": {
      words: "anterograde",
      meaning: "of amnesia",
      lemma: "anterograde",
    },
  },
  "nonstandard": Map(1) {
    "adjective": {
      words: "nonstandard",
      meaning: "not conforming to the language usage of a prestige group within a community",
      lemma: "nonstandard",
    },
  },
  "transgender": Map(1) {
    "adjective": {
      words: "transgender, transgendered",
      meaning: "involving a partial or full reversal of gender",
      lemma: "transgender",
    },
  },
  "forwardness": Map(1) {
    "noun": {
      words: "bumptiousness, cockiness, pushiness, forwardness",
      meaning: "offensive boldness and assertiveness",
      lemma: "forwardness",
    },
  },
  "nonattender": Map(1) {
    "noun": {
      words: "no-show, nonattender, truant",
      meaning: "someone who shirks duty",
      lemma: "nonattender",
    },
  },
  "strangeness": Map(1) {
    "noun": {
      words: "unfamiliarity, strangeness",
      meaning: "unusualness as a consequence of not being well known",
      lemma: "strangeness",
    },
  },
  "transferase": Map(1) {
    "noun": {
      words: "transferase",
      meaning: "any of various enzymes that move a chemical group from one compound to another compound",
      lemma: "transferase",
    },
  },
  "retrograde": Map(2) {
    "adjective": {
      words: "retrograde",
      meaning: "moving from east to west on the celestial sphere",
      lemma: "retrograde",
    },
    "verb": {
      words: "retrograde",
      meaning: "move backward in an orbit, of celestial bodies",
      lemma: "retrograde",
    },
  },
}
```

### Find words which have all of the words of a given word

This is sort of the opposite of what we did above:

```js
let result = dict.wordsUsingAllCharactersFrom("indonesia");
```

You can expect the following output if you run the command above:

```json
[
  "conventionalised", "dimensional", "inconsiderable", "inconsiderate", "indonesian", "institutionalised",
  "institutionalized", "insubordinate", "multidimensional", "noninstitutionalised", "noninstitutionalized",
  "nonresidential", "unidimensional", "unimpassioned", "unsaponified", "inconsiderately", "abdominocentesis",
  "animadversion", "antiredeposition", "consideration", "contradictoriness", "decentalisation",
  "decentralisation", "decolonisation", "decriminalisation", "dehumanisation", "demagnetisation",
  "demineralisation", "demonetisation", "demonisation", "denationalisation", "denisonia", "denominationalism",
  "densification", "depersonalisation", "depersonalization", "desalination", "desalinisation",
  "desalinization", "desensitisation", "desensitization", "designation", "destalinisation",
  "destalinization", "destination", "desynchronisation", "desynchronization", "didanosine",
  "dimensionality", "disappointment", "discontinuance", "disinfestation", "disintegration",
  "disorientation", "dispassionateness", "dispensation", "dissemination", "extraordinariness",
  "gymnadeniopsis", "inconsiderateness", "inconsideration", "indonesia", "indonesian", "inordinateness",
  "kinosternidae", "modernisation", "mountainside", "ordinariness", "predestination", "predestinationist",
  "pseudohallucination", "reconsideration", "sedimentation", "superordination", "tenderisation",
  "underestimation", "denationalise"
]
```

## Is this credible?

We currently rely on Version 3.0 of [Princeton University's Wordnet](https://wordnet.princeton.edu/), the data for which is available as a separate package. We will be adding more with time.

## Credits

- [TJ Holowaychuk](https://github.com/tj) for showing us how to use black and white beautifully to create the image on the top of the readme. Inspiration from [apex/up](https://github.com/apex/up)
- [Princeton Univerysity's Wordnet](https://wordnet.princeton.edu/) for bringing so much sanity in the world
