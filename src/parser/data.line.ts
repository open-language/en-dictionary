import configs from "./configs";
import Data from "./interface.data";

class DataLine {
  line: Data;

  constructor() {
    this.line = {
      offset: 0,
      pos: "",
      wordCount: 0,
      words: [],
      pointerCnt: 0,
      pointers: [],
      glossary: [],
      isComment: false,
    };
  }

  parse(line: string) {
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
    this.line.offset = parseInt(meta.shift()!, 10);
    // const lexFilenum = parseInt(meta.shift()!, 10);

    const pos = meta.shift();
    if (pos !== undefined && configs.pos.get(pos) !== undefined) {
      this.line.pos = configs.pos.get(pos)!;
    }

    this.line.wordCount = parseInt(meta.shift()!, 16);
    for (let index = 0; index < this.line.wordCount; index += 1) {
      const word = meta.shift();
      // const lexId = parseInt(meta.shift()!, 16);
      if (word !== undefined) {
        this.line.words.push(word.toLowerCase());
      }
    }

    this.line.pointerCnt = parseInt(meta.shift()!, 10);
    for (let index = 0; index < this.line.pointerCnt; index += 1) {
      const block = {
        symbol: "",
        offset: 0,
        pos: "",
      };

      block.symbol = meta.shift()!;
      block.offset = parseInt(meta.shift()!, 10);

      const pos = meta.shift()!;
      const posValue = configs.pos.get(pos);
      if (posValue != undefined) {
        block.pos = posValue;
        const symbols = configs.pointerSymbols.get(pos);
        if (symbols !== undefined) {
          const symbol = symbols.get(block.symbol);
          if (symbol !== undefined) {
            block.symbol = symbol;
          }
        }
      }

      // block.sourceTargetHex = meta.shift()
      meta.shift();
      this.line.pointers.push(block);
    }

    return this.line;
  }
}

export default DataLine;
