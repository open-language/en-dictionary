const enDictionary = require('./index')

describe('Test if the package is usable', () => {
    test('Check path', () => {
        expect(enDictionary.wordnetPath).toContain("node_modules/en-wordnet/database")
    })
})