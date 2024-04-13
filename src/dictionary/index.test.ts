import { expect, test, describe, beforeAll } from "bun:test";
const wordnet = require("en-wordnet").default;
import Dictionary from "../dictionary";

const dictionary = new Dictionary(wordnet.get("3.0")!);

describe("Test the dictionary", () => {
  beforeAll(async () => {
    await dictionary.init();
  }, 20000);

  test("Test searchWord", () => {
    console.time("search");
    let result = dictionary.searchFor(["coaxing"]);
    console.timeEnd("search");
    expect(result.get("coaxing")!.get("noun")!.lemma).toBe("coaxing");
    expect(result.get("coaxing")!.get("noun")!.pos).toBe("noun");

    expect(
      result
        .get("coaxing")!
        .get("noun")!
        .offsetData.map((item) => item.words)
        .join(",")
    ).toContain("coaxing");
    expect(
      result
        .get("coaxing")!
        .get("noun")!
        .offsetData.map((item) => item.glossary)
        .join(",")
    ).toContain("flattery designed to gain");

    console.time("search2");
    result = dictionary.searchFor(["yet", "preposterous"]);
    console.timeEnd("search2");
    expect(result.get("yet")!.get("adverb")!.lemma).toBe("yet");
    expect(result.get("yet")!.get("adverb")!.pos).toBe("adverb");

    expect(
      result
        .get("yet")!
        .get("adverb")!
        .offsetData.map((item) => item.words)
        .join(",")
    ).toContain("yet");
    expect(
      result
        .get("yet")!
        .get("adverb")!
        .offsetData.map((item) => item.glossary)
        .join(",")
    ).toContain("largest drug bust yet");
  });

  test("Test searchOffsetsInData", () => {
    console.time("searchOffsetsInData");
    const result = dictionary.searchOffsetsInDataFor([12787364, 2570643]);
    console.timeEnd("searchOffsetsInData");
    expect(result.get(12787364)!.offset).toBe(12787364);
    expect(result.get(2570643)!.offset).toBe(2570643);
  });

  test("Test searchSimple", () => {
    console.time("searchSimple-drink,train");
    const result = dictionary.searchSimpleFor(["drink", "train"]);
    console.timeEnd("searchSimple-drink,train");
    expect(result.get("drink")!.get("noun")!.meaning).toBe(
      "a single serving of a beverage"
    );
  });

  test("Test wordsStartingWith", () => {
    console.time("wordsStartingWith");
    const result = dictionary.wordsStartingWith("bring");
    console.timeEnd("wordsStartingWith");
    expect(result.length).toBe(24);
  });

  test("Test wordsEndingWith", () => {
    console.time("wordsEndingWith");
    const result = dictionary.wordsEndingWith("bring");
    console.timeEnd("wordsEndingWith");
    expect(result.length).toBe(1);
  });

  test("Test wordsIncluding", () => {
    console.time("wordsIncluding");
    const result = dictionary.wordsIncluding("bring");
    console.timeEnd("wordsIncluding");
    expect(result.length).toBe(25);
  });

  test("Test wordsUsingAllCharactersFrom", () => {
    console.time("wordsUsingAllCharactersFrom");
    const result = dictionary.wordsUsingAllCharactersFrom("bringing");
    console.timeEnd("wordsUsingAllCharactersFrom");
    expect(result.length).toBe(6);
  });

  test("Test wordsWithCharsIn", () => {
    console.time("wordsWithCharsIn");
    const result = dictionary.wordsWithCharsIn("precipitate");
    console.timeEnd("wordsWithCharsIn");
    expect(result.size).toBe(7);

    console.time("wordsWithCharsIn-priority");
    const result2 = dictionary.wordsWithCharsIn("precipitate", "abc");
    console.timeEnd("wordsWithCharsIn-priority");
    expect(result2.size).toBe(7);
  });

  test("Test hasAllCharsIn", () => {
    expect(Dictionary.hasAllCharsIn("bringing", "ing")).toBe(true);
    expect(Dictionary.hasAllCharsIn("bringing", "ding")).toBe(false);
  });

  test("Test weird inputs", () => {
    expect(dictionary.searchFor([""]).size).toBe(0);
    expect(dictionary.searchFor([]).size).toBe(0);

    expect(dictionary.searchOffsetsInDataFor([-1]).size).toBe(0);
    expect(dictionary.searchOffsetsInDataFor([]).size).toBe(0);

    expect(dictionary.searchSimpleFor([]).size).toBe(0);
    expect(dictionary.searchSimpleFor(["googoogoo"]).size).toBe(0);

    expect(dictionary.wordsStartingWith("").length).toBe(0);
    expect(dictionary.wordsStartingWith("mengerti").length).toBe(0);

    expect(dictionary.wordsEndingWith("").length).toBe(0);
    expect(dictionary.wordsEndingWith("mengerti").length).toBe(0);

    expect(dictionary.wordsIncluding("").length).toBe(0);
    expect(dictionary.wordsIncluding("mengerti").length).toBe(0);

    expect(dictionary.wordsUsingAllCharactersFrom("").length).toBe(0);

    expect(dictionary.wordsWithCharsIn("").size).toBe(0);
  });
});
