const enWordnet = require("en-wordnet").default;
import { expect, test, describe, beforeAll } from "bun:test";
import Dictionary from "./index";

const dictionary = new Dictionary(enWordnet.get("3.0"));

describe("Test the index file for EnDictionary", () => {
  beforeAll(async () => {
    await dictionary.init();
  }, 10000);

  test("Test initialization", () => {
    const result = dictionary.searchFor(["yet"]);
    expect(result.get("yet")!.get("adverb")!.lemma).toBe("yet");
    expect(result.get("yet")!.get("adverb")!.pos).toBe("adverb");
  }, 10000);
});

describe("Test that all POS are indexed", () => {
  beforeAll(async () => {
    await dictionary.init();
  }, 10000);

  test('searchFor(["smart"]) returns the predicted result for adjective sense', () => {
    const result = dictionary.searchFor(["smart"]);
    expect(result.get("smart")!.size).not.toEqual(1);
    expect(
      result.get("smart")!.get("adjective")!.offsetData[0].glossary[0]
    ).toEqual("showing mental alertness and calculation and resourcefulness");
  }, 10000);

  test("searchOffsetsInDataFor() can find the specified offset", () => {
    const result = dictionary.searchOffsetsInDataFor([438707, 975487]);
    expect(result.get(438707)).toBeDefined();
    expect(result.get(975487)!.glossary[0]).toEqual("elegant and stylish");
  }, 10000);
});
