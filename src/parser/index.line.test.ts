import { expect, test, describe } from "bun:test";
import IndexLine from "./index.line";

describe("Test parsing an index line", () => {
  test("Parse an index line", () => {
    let item = new IndexLine().parse(
      "  7 database and its documentation for any purpose and without fee or  "
    );
    expect(item.isComment).toBe(true);

    item = new IndexLine().parse(
      "advanced a 8 1 & 8 8 01840121 00819526 01876261 01211296 01208738 00816839 00412171 00198383"
    );
    expect(item.lemma).toBe("advanced");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(8);
    expect(item.pointerCount).toBe(1);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Similar to" },
    ]);
    expect(item.senseCount).toBe(8);
    expect(item.tagSenseCount).toBe(8);
    expect(item.offsets).toEqual([
      1840121,
      819526,
      1876261,
      1211296,
      1208738,
      816839,
      412171,
      198383,
    ]);

    item = new IndexLine().parse(".38-calibre a 1 1 \\ 1 0 03146602  ");
    expect(item.lemma).toBe(".38-calibre");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(1);
    expect(item.pointerCount).toBe(1);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Pertainym (pertains to noun)" },
    ]);
    expect(item.senseCount).toBe(1);
    expect(item.tagSenseCount).toBe(0);
    expect(item.offsets).toEqual([3146602]);

    item = new IndexLine().parse("10th a 1 1 & 1 0 02203373  ");
    expect(item.lemma).toBe("10th");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(1);
    expect(item.pointerCount).toBe(1);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Similar to" },
    ]);
    expect(item.senseCount).toBe(1);
    expect(item.tagSenseCount).toBe(0);
    expect(item.offsets).toEqual([2203373]);

    item = new IndexLine().parse(
      "a_posteriori a 2 3 ! & ^ 2 0 00139126 00859350  "
    );
    expect(item.lemma).toBe("a_posteriori");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(2);
    expect(item.pointerCount).toBe(3);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Antonym" },
      { offset: 0, pos: "adjective", symbol: "Similar to" },
      { offset: 0, pos: "adjective", symbol: "Also see" },
    ]);
    expect(item.senseCount).toBe(2);
    expect(item.tagSenseCount).toBe(0);
    expect(item.offsets).toEqual([139126, 859350]);

    item = new IndexLine().parse("around_the_bend a 1 1 & 1 0 02074929  ");
    expect(item.lemma).toBe("around_the_bend");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(1);
    expect(item.pointerCount).toBe(1);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Similar to" },
    ]);
    expect(item.senseCount).toBe(1);
    expect(item.tagSenseCount).toBe(0);
    expect(item.offsets).toEqual([2074929]);

    item = new IndexLine().parse(
      "armed a 3 3 ! & ; 3 1 00142407 00146210 00144877  "
    );
    expect(item.lemma).toBe("armed");
    expect(item.pos).toBe("adjective");
    expect(item.offsetCount).toBe(3);
    expect(item.pointerCount).toBe(3);
    expect(item.pointers).toEqual([
      { offset: 0, pos: "adjective", symbol: "Antonym" },
      { offset: 0, pos: "adjective", symbol: "Similar to" },
    ]);
    expect(item.senseCount).toBe(3);
    expect(item.tagSenseCount).toBe(1);
    expect(item.offsets).toEqual([142407, 146210, 144877]);
  });
});
