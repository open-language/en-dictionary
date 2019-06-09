
import wordnet from 'en-wordnet'
import Dictionary from './index'

describe("Test the index file for EnDictionary", () => {
    test("Test initialization", async () => {
        const dictionary = new Dictionary(wordnet.get('3.0'))
        await dictionary.init()

        const result = dictionary.searchFor(['yet'])
        expect(result.get('yet')!.lemma).toBe('yet')
        expect(result.get('yet')!.pos).toBe('adverb')
    }, 10000)
})