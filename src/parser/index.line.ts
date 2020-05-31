import configs from "./configs";
import Index from "./interace.index";
import Pointer from "./interface.pointer";

class IndexLine {
  line: Index;

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
      isComment: false,
    };
  }

  parse(line: string) {
    if (line.charAt(0) === " ") {
      this.line.isComment = true;
      return this.line;
    }

    const tokens = line.split(" ");
    this.line.lemma = tokens.shift()!;

    const posAbbr = tokens.shift()!;
    this.line.pos = configs.pos.get(posAbbr)!;
    this.line.offsetCount = parseInt(tokens.shift()!, 10);
    this.line.pointerCount = parseInt(tokens.shift()!, 10);
    this.line.pointers = [];
    for (let index = 0; index < this.line.pointerCount; index += 1) {
      const token = tokens.shift()!;
      if (token !== undefined) {
        const pointerSymbol = configs.pointerSymbols.get(posAbbr)!;
        const pointerSymbolValue = pointerSymbol.get(token);
        if (pointerSymbolValue !== undefined) {
          const pointer: Pointer = {
            symbol: pointerSymbolValue,
            offset: 0,
            pos: this.line.pos,
          };
          this.line.pointers.push(pointer);
        }
      }
    }
    this.line.senseCount = parseInt(tokens.shift()!, 10);
    this.line.tagSenseCount = parseInt(tokens.shift()!, 10);
    this.line.offsets = [];
    for (let index = 0; index < this.line.offsetCount; index += 1) {
      this.line.offsets.push(parseInt(tokens.shift()!, 10));
    }
    return this.line;
  }
}

export default IndexLine;
