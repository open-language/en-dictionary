const enDictionary = require('./index')

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        const dict = await enDictionary.init()
        const result = dict.searchWord('yet')
        expect(result.lemma).toBe('yet')
        expect(result.pos).toBe('adverb')
    }, 10000)
})