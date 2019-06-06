const enDictionary = require('./index')

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        const dict = await enDictionary.init()
        const result = dict.searchFor('yet')
        expect(result.yet.lemma).toBe('yet')
        expect(result.yet.pos).toBe('adverb')
    }, 10000)
})