const reader = require('./index')
const dictionary = require('../dictionary')

describe("Test the reader functionality", () => {
    test("Test initialization", async () => {
        await reader.init()
        expect(dictionary.getDatastoreSize()).toBe(273178)
    }, 10000)
})