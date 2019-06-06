![](assets/wordnet-readme-logo.png)

En-Dictonary is a node.js module which makes works and their relations available as a package.

## About

This packages uses the [En-Wordnet](https://github.com/open-language/en-wordnet) package to make the words, their meanings and relationships available to your node.js package. It also adds helper functions for other ways to access the information.

![](https://img.shields.io/travis/open-language/en-dictionary.svg)
![](https://img.shields.io/codecov/c/github/open-language/en-dictionary/master.svg)
![](https://img.shields.io/github/license/open-language/en-dictionary.svg)

## Quick Start

You can install the package via `npm` or `yarn`

```
yarn add en-dictionary
```

Once it has been added, you need to initialize the dictionary, like so
```js
const wordnet = require('en-wordnet')
const Dictionary = require('./index')

const start = async () => {
  const dictionary = new Dictionary(wordnet['3.0'])
  await dictionary.init()

  const result = dictionary.searchFor('yet')
}
start()
```
There are some more [examples here](https://github.com/open-language/en-dictionary/blob/master/index.test.js).

The dictionary can take about 2000ms to load the data in memory, it doesn't use an external database/redis yet (nor is that planned, since most queries are fast enough, and the underlying data doesn't changes probably once a year)

As of version 1.2.0, most lookups are extremely fast
```txt
search: 1ms
search2: 0ms
searchOffsetsInData: 0ms
searchSimple-drink,train: 0ms
wordsStartingWith: 18ms
wordsEndingWith: 16ms
wordsIncluding: 17ms
wordsUsingAllCharactersFrom: 231ms
wordsWithCharsIn: 326ms
wordsWithCharsIn-priority: 350ms
addIndex: 0ms
indexLemmaSearch: 0ms
indexLemmaSearch2: 0ms
indexOffsetSearch: 0ms
indexOffsetSearch2: 0ms
addData: 0ms
dataLemmaSearch: 0ms
dataLemmaSearch2: 0ms
dataOffsetSearch: 0ms
dataOffsetSearch2: 0ms
```

### Query words

You can query for a single word with this syntax. If you want to use multiple words, replace the ` ` with `_`.
```js
let result = dict.searchFor('preposterous')
```

Here's a sample outlet that you can expect for the queries above

```json
{
  "preposterous": {
    "lemma": "preposterous",
    "pos": "adjective",
    "offsetCount": 1,
    "pointerCount": 1,
    "pointers": [
      "Similar to"
    ],
    "senseCount": 1,
    "tagSenseCount": 1,
    "offsets": [
      {
        "offset": 2570643,
        "pos": "ajective satellite",
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
            "pointerSymbol": "Similar to",
            "offset": 2570282,
            "pos": "adjective"
          },
          {
            "pointerSymbol": "Derivationally related form",
            "offset": 6607809,
            "pos": "noun"
          },
          {
            "pointerSymbol": "Derivationally related form",
            "offset": 852922,
            "pos": "verb"
          },
          {
            "pointerSymbol": "Derivationally related form",
            "offset": 4891683,
            "pos": "noun"
          },
          {
            "pointerSymbol": "Derivationally related form",
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
    "isComment": false
  }
}
```

There's also a simpler response version

```js
let result = dict.searchSimpleFor('preposterous')
```

... which returns with a short and sweet

```json
{
  "preposterous": {
    "words": "absurd, cockeyed, derisory, idiotic, laughable, ludicrous, nonsensical, preposterous, ridiculous",
    "meaning": "incongruous"
  }
}
```

### Find words which start with, end with or include a certain set of words

You can find words which start or end with a specific set of words, you can do this

```js
let result = dict.wordsStartingWith('prestig')
result = dict.wordsEndingWith('sterous')
result = dict.wordsIncluding('grating')
```

Here's what you would get on running the functions above

```json
[
  "prestigious",
  "prestige",
  "prestigiousness"
]
```

```json
[
  "blusterous",
  "boisterous",
  "preposterous"
]
```

```json
[
  "gratingly",
  "denigrating",
  "grating",
  "diffraction_grating",
  "integrating"
]
```

### Find words which can be created with a given set of words

This is useful when you're playing scrabble or a similar game. You can define the list of characters that you have available and the minimum length of the words that you need

```js
let result = dict.wordsWithCharsIn('toaddndyrnrtssknwfsaregte')
let result = dict.wordsWithCharsIn('toaddndyrnrtssknwfsaregte', 'ab') // In this case words which both a and b will show up on the top
```

You can expect the following output if you run the command above

```json
{
  "transgressor": {
    "words": "transgressor",
    "meaning": "someone who transgresses"
  },
  "grandstander": {
    "words": "grandstander",
    "meaning": "someone who performs with an eye to the applause from spectators in the grandstand"
  },
  "nonattender": {
    "words": "no-show, nonattender, truant",
    "meaning": "someone who shirks duty"
  },
  "forwardness": {
    "words": "readiness, eagerness, zeal, forwardness",
    "meaning": "prompt willingness"
  },
  "anterograde": {
    "words": "anterograde",
    "meaning": "of amnesia"
  },
  "transferase": {
    "words": "transferase",
    "meaning": "any of various enzymes that move a chemical group from one compound to another compound"
  },
  "transgender": {
    "words": "transgender, transgendered",
    "meaning": "involving a partial or full reversal of gender"
  },
  "strangeness": {
    "words": "unfamiliarity, strangeness",
    "meaning": "unusualness as a consequence of not being well known"
  },
  "nonstandard": {
    "words": "nonstandard",
    "meaning": "not standard"
  },
  "waterfront": {
    "words": "waterfront",
    "meaning": "the area of a city (such as a harbor or dockyard) alongside a body of water"
  }
}
```

### Find words which have all of the words of a given word

This is sort of the opposite of what we did above
```js
let result = dict.wordsUsingAllCharactersFrom('indonesia')
```

You can expect the following output if you run the command above
```json
[
  "abdominocentesis",
  "inconsiderately",
  "denationalise",
  "conventionalised",
  "animadversion",
  "dimensional",
  "antiredeposition",
  "inconsiderable",
  "inconsiderate",
  "indonesian",
  "institutionalised",
  "institutionalized",
  "insubordinate",
  "multidimensional",
  "noninstitutionalised",
  "noninstitutionalized",
  "nonresidential",
  "unidimensional",
  "unimpassioned",
  "unsaponified",
  "consideration",
  "contradictoriness",
  "decentalisation",
  "decentralisation",
  "decolonisation",
  "decriminalisation",
  "dehumanisation",
  "demagnetisation",
  "demineralisation",
  "demonetisation",
  "demonisation",
  "denationalisation",
  "denisonia",
  "denominationalism",
  "densification",
  "depersonalisation",
  "depersonalization",
  "desalination",
  "desalinisation",
  "desalinization",
  "desensitisation",
  "desensitization",
  "designation",
  "destalinisation",
  "destalinization",
  "destination",
  "desynchronisation",
  "desynchronization",
  "didanosine",
  "dimensionality",
  "disappointment",
  "discontinuance",
  "disinfestation",
  "disintegration",
  "disorientation",
  "dispassionateness",
  "dispensation",
  "dissemination",
  "extraordinariness",
  "gymnadeniopsis",
  "inconsiderateness",
  "inconsideration",
  "indonesia",
  "indonesian",
  "inordinateness",
  "kinosternidae",
  "modernisation",
  "mountainside",
  "ordinariness",
  "predestination",
  "predestinationist",
  "pseudohallucination",
  "reconsideration",
  "sedimentation",
  "superordination",
  "tenderisation",
  "underestimation"
]
```

## Is this credible?

We currently rely on Version 3.0 of [Princeton University's Wordnet](https://wordnet.princeton.edu/), the data for which is available as a separate package. We will be adding more with time.

## Credits

- [TJ Holowaychuk](https://github.com/tj) for showing us how to use black and white beautifully to create the image on the top of the readme. Inspiration from [apex/up](https://github.com/apex/up)
- [Princeton Univerysity's Wordnet](https://wordnet.princeton.edu/) for bringing so much sanity in the world