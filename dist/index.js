// src/reader/index.ts
import readline from "readline";
import fs from "fs";

// src/parser/configs.ts
var pos = new Map().set("n", "noun").set("v", "verb").set("a", "adjective").set("s", "adjective satellite").set("r", "adverb");
var pointerSymbolsNoun = new Map().set("!", "Antonym").set("@", "Hypernym").set("@i", "Instance Hypernym").set("~", "Hyponym").set("~i", "Instance Hyponym").set("#m", "Member holonym").set("#s", "Substance holonym").set("#p", "Part holonym").set("%m", "Member meronym").set("%s", "Substance meronym").set("%p", "Part meronym").set("=", "Attribute").set("+", "Derivationally related form").set(";c", "Domain of synset - TOPIC").set("-c", "Member of this domain - TOPIC").set(";r", "Domain of synset - REGION").set("-r", "Member of this domain - REGION").set(";u", "Domain of synset - USAGE").set("-u", "Member of this domain - USAGE");
var pointerSymbolsVerb = new Map().set("!", "Antonym").set("@", "Hypernym").set("~", "Hyponym").set("*", "Entailment").set(">", "Cause").set("^", "Also see").set("$", "Verb Group").set("+", "Derivationally related form").set(";c", "Domain of synset - TOPIC").set(";r", "Domain of synset - REGION").set(";u", "Domain of synset - USAGE");
var pointerSymbolsAdjective = new Map().set("!", "Antonym").set("&", "Similar to").set("<", "Participle of verb").set("\\", "Pertainym (pertains to noun)").set("=", "Attribute").set("^", "Also see").set(";c", "Domain of synset - TOPIC").set(";r", "Domain of synset - REGION").set(";u", "Domain of synset - USAGE");
var pointerSymbolsAdverb = new Map().set("!", "Antonym").set("\\", "Derived from adjective").set(";c", "Domain of synset - TOPIC").set(";r", "Domain of synset - REGION").set(";u", "Domain of synset - USAGE");
var pointerSymbols = new Map().set("n", pointerSymbolsNoun).set("v", pointerSymbolsVerb).set("a", pointerSymbolsAdjective).set("r", pointerSymbolsAdverb);
var configs_default = { pos, pointerSymbols };

// src/parser/index.line.ts
class IndexLine {
  line;
  constructor() {
    this.line = {
      lemma: "",
      pos: "",
      offsetCount: 0,
      offsets: [],
      offsetData: [],
      pointerCount: 0,
      pointers: [],
      senseCount: 0,
      tagSenseCount: 0,
      isComment: false
    };
  }
  parse(line) {
    if (line.charAt(0) === " ") {
      this.line.isComment = true;
      return this.line;
    }
    const tokens = line.split(" ");
    this.line.lemma = tokens.shift();
    const posAbbr = tokens.shift();
    this.line.pos = configs_default.pos.get(posAbbr);
    this.line.offsetCount = parseInt(tokens.shift(), 10);
    this.line.pointerCount = parseInt(tokens.shift(), 10);
    this.line.pointers = [];
    for (let index = 0;index < this.line.pointerCount; index += 1) {
      const token = tokens.shift();
      if (token !== undefined) {
        const pointerSymbol = configs_default.pointerSymbols.get(posAbbr);
        const pointerSymbolValue = pointerSymbol.get(token);
        if (pointerSymbolValue !== undefined) {
          const pointer = {
            symbol: pointerSymbolValue,
            offset: 0,
            pos: this.line.pos
          };
          this.line.pointers.push(pointer);
        }
      }
    }
    this.line.senseCount = parseInt(tokens.shift(), 10);
    this.line.tagSenseCount = parseInt(tokens.shift(), 10);
    this.line.offsets = [];
    for (let index = 0;index < this.line.offsetCount; index += 1) {
      this.line.offsets.push(parseInt(tokens.shift(), 10));
    }
    return this.line;
  }
}
var index_line_default = IndexLine;

// src/parser/data.line.ts
class DataLine {
  line;
  constructor() {
    this.line = {
      offset: 0,
      pos: "",
      wordCount: 0,
      words: [],
      pointerCnt: 0,
      pointers: [],
      glossary: [],
      isComment: false
    };
  }
  parse(line) {
    if (line.charAt(0) === " ") {
      this.line.isComment = true;
      return this.line;
    }
    const glossarySplit = line.split("|");
    if (glossarySplit.length > 1) {
      glossarySplit[1].split(";").forEach((part) => {
        this.line.glossary.push(part.trim());
      });
    }
    const meta = glossarySplit[0].split(" ");
    this.line.offset = parseInt(meta.shift(), 10);
    const pos2 = meta.shift();
    if (pos2 !== undefined && configs_default.pos.get(pos2) !== undefined) {
      this.line.pos = configs_default.pos.get(pos2);
    }
    this.line.wordCount = parseInt(meta.shift(), 16);
    for (let index = 0;index < this.line.wordCount; index += 1) {
      const word = meta.shift();
      if (word !== undefined) {
        this.line.words.push(word.toLowerCase());
      }
    }
    this.line.pointerCnt = parseInt(meta.shift(), 10);
    for (let index = 0;index < this.line.pointerCnt; index += 1) {
      const block = {
        symbol: "",
        offset: 0,
        pos: ""
      };
      block.symbol = meta.shift();
      block.offset = parseInt(meta.shift(), 10);
      const pos3 = meta.shift();
      const posValue = configs_default.pos.get(pos3);
      if (posValue != null) {
        block.pos = posValue;
        const symbols = configs_default.pointerSymbols.get(pos3);
        if (symbols !== undefined) {
          const symbol = symbols.get(block.symbol);
          if (symbol !== undefined) {
            block.symbol = symbol;
          }
        }
      }
      meta.shift();
      this.line.pointers.push(block);
    }
    return this.line;
  }
}
var data_line_default = DataLine;

// src/reader/index.ts
var fileTypes = ["index", "data"];
var wordTypes = ["adj", "adv", "noun", "verb"];

class Reader {
  db;
  isReady;
  readRemaining;
  constructor(db) {
    this.db = db;
    this.isReady = false;
    this.readRemaining = 8;
  }
  init() {
    return new Promise((resolve, reject) => {
      fileTypes.forEach((fileType) => {
        wordTypes.forEach((wordType) => {
          const file = `${this.db.path}/${fileType}.${wordType}`;
          const readerInterface = readline.createInterface({
            input: fs.createReadStream(file),
            output: undefined
          });
          readerInterface.on("line", (line) => {
            if (fileType === "index") {
              const item = new index_line_default().parse(line);
              this.db.addIndex(item);
            } else {
              const item = new data_line_default().parse(line);
              this.db.addData(item);
            }
          });
          readerInterface.on("close", () => {
            this.readRemaining -= 1;
            if (this.readRemaining === 0) {
              this.isReady = true;
              this.db.ready();
              resolve("");
            }
          });
          readerInterface.on("error", () => {
            reject();
          });
        });
      });
    });
  }
}
var reader_default = Reader;

// src/database/index.ts
class Database {
  path;
  isReady;
  index;
  indexLemmaIndex;
  indexOffsetIndex;
  data;
  dataOffsetIndex;
  dataLemmaIndex;
  constructor(path) {
    this.isReady = false;
    this.index = [];
    this.indexLemmaIndex = new Map;
    this.indexOffsetIndex = new Map;
    this.data = [];
    this.dataLemmaIndex = new Map;
    this.dataOffsetIndex = new Map;
    this.path = path;
  }
  async init() {
    const reader2 = new reader_default(this);
    await reader2.init();
  }
  ready() {
    this.isReady = true;
  }
  addIndex(index) {
    if (index.isComment) {
      return;
    }
    this.index.push(index);
    const existingIndicies = this.indexLemmaIndex.get(index.lemma);
    if (existingIndicies) {
      existingIndicies.set(index.pos, index);
    } else {
      this.indexLemmaIndex.set(index.lemma, new Map([[index.pos, index]]));
    }
    index.offsets.forEach((offset) => {
      let output = [];
      if (this.indexOffsetIndex.get(offset) !== undefined) {
        output = this.indexOffsetIndex.get(offset);
      }
      output.push(index);
      this.indexOffsetIndex.set(offset, output);
    });
  }
  static copyIndex(indexMap) {
    return new Map(indexMap);
  }
  indexLemmaSearch(query) {
    const output = new Map;
    query.forEach((lemma) => {
      if (lemma !== "" && this.indexLemmaIndex.get(lemma) !== undefined) {
        output.set(lemma, Database.copyIndex(this.indexLemmaIndex.get(lemma)));
      }
    });
    return output;
  }
  indexOffsetSearch(query) {
    const output = new Map;
    query.forEach((offset) => {
      if (offset && this.indexOffsetIndex.get(offset)) {
        const items = [];
        this.indexOffsetIndex.get(offset).forEach((item) => {
          items.push({ ...item });
        });
        output.set(offset, items);
      }
    });
    return output;
  }
  addData(data2) {
    if (data2.isComment) {
      return;
    }
    this.data.push(data2);
    this.dataOffsetIndex.set(data2.offset, data2);
    data2.words.forEach((word) => {
      let output = [];
      if (this.dataLemmaIndex.get(word)) {
        output = this.dataLemmaIndex.get(word);
      }
      output.push(data2);
      this.dataLemmaIndex.set(word, output);
    });
  }
  static copyData(data2) {
    return {
      offset: data2.offset,
      pos: data2.pos,
      wordCount: data2.wordCount,
      words: [...data2.words],
      pointerCnt: data2.pointerCnt,
      pointers: [...data2.pointers],
      glossary: [...data2.glossary],
      isComment: data2.isComment
    };
  }
  dataLemmaSearch(query) {
    const output = new Map;
    query.forEach((lemma) => {
      const items = [];
      if (lemma !== "" && this.dataLemmaIndex.get(lemma)) {
        this.dataLemmaIndex.get(lemma).forEach((item) => {
          items.push(Database.copyData(item));
        });
      }
      output.set(lemma, items);
    });
    return output;
  }
  dataOffsetSearch(query) {
    const output = new Map;
    query.forEach((offset) => {
      if (offset && this.dataOffsetIndex.get(offset)) {
        output.set(offset, Database.copyData(this.dataOffsetIndex.get(offset)));
      }
    });
    return output;
  }
  getSize() {
    return {
      count: this.index.length + this.data.length,
      indexes: this.indexOffsetIndex.size + this.indexLemmaIndex.size + this.dataOffsetIndex.size + this.dataLemmaIndex.size
    };
  }
}
var database_default = Database;

// src/dictionary/index.ts
class Dictionary {
  path;
  database;
  constructor(path) {
    this.path = path;
    this.database = new database_default(this.path);
  }
  async init() {
    await this.database.init();
  }
  searchFor(term) {
    let output = new Map;
    output = this.database.indexLemmaSearch(term);
    output.forEach((lemmaMap, lemma) => {
      lemmaMap.forEach((index) => {
        const lemmaData = this.searchOffsetsInDataFor(index.offsets);
        index.offsetData = [];
        lemmaData.forEach((data2) => {
          index.offsetData.push(data2);
        });
        if (output.get(lemma)) {
          output.get(lemma).set(index.pos, index);
        }
      });
    });
    return output;
  }
  searchOffsetsInDataFor(offsets) {
    return this.database.dataOffsetSearch(offsets);
  }
  searchSimpleFor(words) {
    const output = new Map;
    const result = this.searchFor(words);
    result.forEach((lemmaMap, lemma) => {
      lemmaMap.forEach((index) => {
        if (index.offsetData.length > 0) {
          let meaning = "";
          const firstWords = index.offsetData[0].words.join(", ");
          if (index.offsetData[0].glossary.length > 0) {
            meaning = index.offsetData[0].glossary[0];
          }
          if (output.get(lemma)) {
            output.get(lemma).set(index.pos, {
              words: firstWords,
              meaning,
              lemma
            });
          } else {
            output.set(lemma, new Map([
              [
                index.pos,
                {
                  words: firstWords,
                  meaning,
                  lemma
                }
              ]
            ]));
          }
        }
      });
    });
    return output;
  }
  wordsStartingWith(prefix) {
    let output = [];
    if (prefix !== "") {
      output = this.database.index.filter((item) => item.lemma.startsWith(prefix)).map((item) => item.lemma);
    }
    return output;
  }
  wordsEndingWith(suffix) {
    let output = [];
    if (suffix !== "") {
      output = this.database.index.filter((item) => item.lemma.endsWith(suffix)).map((item) => item.lemma);
    }
    return output;
  }
  wordsIncluding(word) {
    let output = [];
    if (word !== "") {
      output = this.database.index.filter((item) => item.lemma.includes(word)).map((item) => item.lemma);
    }
    return output;
  }
  wordsUsingAllCharactersFrom(query, ignorePhrases = true) {
    let output = [];
    if (query === "") {
      return output;
    }
    const querySplit = query.split("").sort();
    output = this.database.index.filter((item) => {
      const lemmaSplit = item.lemma.split("").sort();
      if (ignorePhrases && (lemmaSplit.includes("_") || lemmaSplit.includes("-"))) {
        return false;
      }
      for (let i = 0;i < querySplit.length; i += 1) {
        const found = lemmaSplit.indexOf(querySplit[i]);
        if (found < 0) {
          return false;
        }
        lemmaSplit.splice(found, 1);
      }
      return true;
    }).map((item) => item.lemma);
    return output;
  }
  wordsWithCharsIn(query, priorityCharacters = "") {
    const matchingWords = this.database.index.filter((item) => Dictionary.hasAllCharsIn(query, item.lemma)).map((item) => item.lemma).sort((a, b) => {
      let diff = 0;
      if (priorityCharacters.length > 0) {
        const aPriority = Dictionary.hasAllCharsIn(a, priorityCharacters) ? 10 : 0;
        const bPriority = Dictionary.hasAllCharsIn(b, priorityCharacters) ? 10 : 0;
        diff = b.length + bPriority - (a.length + aPriority);
      } else {
        diff = b.length - a.length;
      }
      return diff;
    }).splice(0, 10);
    return this.searchSimpleFor(matchingWords);
  }
  static hasAllCharsIn(word, test) {
    const wordSplit = word.split("").sort();
    const testSplit = test.split("").sort();
    if (testSplit.length > wordSplit.length) {
      return false;
    }
    for (let i = 0;i < testSplit.length; i += 1) {
      const foundChar = wordSplit.indexOf(testSplit[i]);
      if (foundChar < 0) {
        return false;
      }
      wordSplit.splice(foundChar, 1);
    }
    return true;
  }
}
var dictionary_default = Dictionary;

// src/index.ts
var src_default = dictionary_default;
export {
  src_default as default
};
