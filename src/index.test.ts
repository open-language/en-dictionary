
import wordnet from 'en-wordnet'
import Dictionary from './index'

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        const dictionary = new Dictionary(wordnet.get('3.0'))
        await dictionary.init()

        const result = dictionary.searchFor(['yet'])
        expect(result.get('yet')!.get('adverb')!.lemma).toBe('yet')
        expect(result.get('yet')!.get('adverb')!.pos).toBe('adverb')
    }, 10000)
})

describe("Test that all POS are indexed", () => {
    test('searchFor(["smart"]) returns the predicted result for adjective sense', async () => {
        const dictionary = new Dictionary(wordnet.get("3.0"));
        await dictionary.init();
    
        const result = dictionary.searchFor(["smart"]);
        expect(result.get("smart")!.size).not.toEqual(1);
        expect(result.get("smart")!.get("adjective")!.offsetData[0].glossary[0]).toEqual("showing mental alertness and calculation and resourcefulness");
    }, 10000);
  
    test("searchOffsetsInDataFor() can find the specified offset", async () => {
        const dictionary = new Dictionary(wordnet.get("3.0"));
        await dictionary.init();
    
        const result = dictionary.searchOffsetsInDataFor([438707, 975487]);
        expect(result.get(438707)).toBeDefined();
        expect(result.get(975487)!.glossary[0]).toEqual("elegant and stylish");
    }, 10000);
  });
