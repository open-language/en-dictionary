const wordnet = require('en-wordnet')
const Dictionary = require('./index')

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        const dictionary = new Dictionary(wordnet['3.0'])
        await dictionary.init()

        const result = dictionary.searchFor('yet')
        expect(result.yet.lemma).toBe('yet')
        expect(result.yet.pos).toBe('adverb')
    }, 10000)
})