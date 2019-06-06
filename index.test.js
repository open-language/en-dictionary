const wordnet = require('en-wordnet')
const dictionary = require('./index')

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        await dictionary.init(wordnet['3.0'])

        const result = dictionary.searchFor('yet')
        expect(result.yet.lemma).toBe('yet')
        expect(result.yet.pos).toBe('adverb')
    }, 10000)
})