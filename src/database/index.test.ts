/* eslint-disable no-console */
import wordnet from "en-wordnet";
import Database from "../database";
import IndexLine from "../parser/index.line";
import DataLine from "../parser/data.line";

// const db = new Database(path.join(__dirname, '..', 'mockWordnet'))
const db = new Database(wordnet.get("3.0"));

describe("Test the dictionary", () => {
  beforeAll(async () => {
    await db.init();
  }, 10000);

  test("Test addIndex", () => {
    const indexline = new IndexLine();
    const index = indexline.parse(
      "test_christmas_tree n 5 2 @ #m 5 0 12787364 12738599 11621547 11621281 03026626  "
    );
    console.time("addIndex");
    db.addIndex(index);
    console.timeEnd("addIndex");
    expect(
      db.indexLemmaIndex.get("test_christmas_tree")!.get("noun")!.lemma
    ).toBe("test_christmas_tree");
    expect(
      db.indexLemmaIndex.get("test_christmas_tree")!.get("noun")!.offsets
    ).toEqual([12787364, 12738599, 11621547, 11621281, 3026626]);
    expect(db.indexOffsetIndex.get(12787364)![0].offsets.join(",")).toContain(
      "12787364"
    );
  });

  test("Test IndexLemmaSearch", () => {
    console.time("indexLemmaSearch");
    let result = db.indexLemmaSearch(["christmas_tree"]);
    console.timeEnd("indexLemmaSearch");
    expect(result.get("christmas_tree")!.get("noun")!.lemma).toBe(
      "christmas_tree"
    );
    expect(
      result
        .get("christmas_tree")!
        .get("noun")!
        .offsets.join(",")
    ).toContain("12787364");

    console.time("indexLemmaSearch2");
    result = db.indexLemmaSearch(["christmas_tree", "preposterous"]);
    console.timeEnd("indexLemmaSearch2");
    expect(result.get("christmas_tree")!.get("noun")!.lemma).toBe(
      "christmas_tree"
    );
    expect(
      result
        .get("christmas_tree")!
        .get("noun")!
        .offsets.join(",")
    ).toContain("12787364");
    expect(result.get("preposterous")!.get("adjective")!.lemma).toBe(
      "preposterous"
    );
    expect(
      result
        .get("preposterous")!
        .get("adjective")!
        .offsets.join(",")
    ).toContain("2570643");
  });

  test("Test IndexOffsetSearch", () => {
    console.time("indexOffsetSearch");
    let result = db.indexOffsetSearch([12787364]);
    console.timeEnd("indexOffsetSearch");
    expect(
      result
        .get(12787364)!
        .map((item) => item.lemma)
        .join(",")
    ).toContain("christmas_tree");
    expect(
      result
        .get(12787364)!
        .map((item) => item.offsets)
        .join(",")
    ).toContain("12787364");

    console.time("indexOffsetSearch2");
    result = db.indexOffsetSearch([12787364, 2570643]);
    console.timeEnd("indexOffsetSearch2");
    expect(
      result
        .get(12787364)!
        .map((item) => item.lemma)
        .join(",")
    ).toContain("christmas_tree");
    expect(
      result
        .get(12787364)!
        .map((item) => item.offsets)
        .join(",")
    ).toContain("12787364");
    expect(
      result
        .get(2570643)!
        .map((item) => item.lemma)
        .join(",")
    ).toContain("preposterous");
    expect(
      result
        .get(2570643)!
        .map((item) => item.offsets)
        .join(",")
    ).toContain("2570643");
  });

  test("Test addData", () => {
    const dataline = new DataLine();
    const dataLine = dataline.parse(
      '90588221 31 v 08 grok 0 get_the_picture 0 comprehend 0 savvy 0 dig 0 grasp 0 compass 0 apprehend 0 015 @ 00588888 v 0000 + 00533452 a 0801 + 01745027 a 0801 + 05805475 n 0802 + 10240082 n 0802 + 05806623 n 0602 + 05806855 n 0601 + 05805475 n 0404 + 00532892 a 0301 + 00532892 a 0302 + 05805902 n 0301 ~ 00590241 v 0000 ~ 00590366 v 0000 ~ 00590761 v 0000 ~ 00590924 v 0000 03 + 08 00 + 26 00 + 02 02 | get the meaning of something; "Do you comprehend the meaning of this letter?"  '
    );
    console.time("addData");
    db.addData(dataLine);
    console.timeEnd("addData");
    expect(db.dataLemmaIndex.get("grok")![0].offset).toBe(588221);
    expect(db.dataOffsetIndex.get(90588221)!.offset).toBe(90588221);
    expect(db.dataOffsetIndex.get(90588221)!.words.length).toBe(8);
  });

  test("Test DataLemmaSearch", () => {
    console.time("dataLemmaSearch");
    let result = db.dataLemmaSearch(["christmas_tree"]);
    console.timeEnd("dataLemmaSearch");
    expect(
      result
        .get("christmas_tree")!
        .map((item) => item.words)
        .join(",")
    ).toContain("christmas_tree");
    expect(
      result
        .get("christmas_tree")!
        .map((item) => item.offset)
        .join(",")
    ).toContain("12787364");

    console.time("dataLemmaSearch2");
    result = db.dataLemmaSearch(["christmas_tree", "preposterous"]);
    console.timeEnd("dataLemmaSearch2");
    expect(
      result
        .get("christmas_tree")!
        .map((item) => item.words)
        .join(",")
    ).toContain("christmas_tree");
    expect(
      result
        .get("christmas_tree")!
        .map((item) => item.offset)
        .join(",")
    ).toContain("12787364");
    expect(
      result
        .get("preposterous")!
        .map((item) => item.words)
        .join(",")
    ).toContain("preposterous");
    expect(
      result
        .get("preposterous")!
        .map((item) => item.offset)
        .join(",")
    ).toContain("2570643");
  });

  test("Test DataOffsetSearch", () => {
    console.time("dataOffsetSearch");
    let result = db.dataOffsetSearch([12787364]);
    console.timeEnd("dataOffsetSearch");
    expect(result.get(12787364)!.offset).toBe(12787364);
    expect(result.get(12787364)!.words.join(",")).toContain("christmas_tree");

    console.time("dataOffsetSearch2");
    result = db.dataOffsetSearch([12787364, 2570643]);
    console.timeEnd("dataOffsetSearch2");
    expect(result.get(12787364)!.offset).toBe(12787364);
    expect(result.get(12787364)!.words.join(",")).toContain("christmas_tree");
  });
});
