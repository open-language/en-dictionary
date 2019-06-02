const enDictionary = require('./index')

describe('Test if the package is usable', () => {
    test('Check version number', () => {
        expect(enDictionary.version).toBe("3.1")
    })
})