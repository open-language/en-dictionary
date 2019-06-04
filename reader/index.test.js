const reader = require('./index')
const dictionary = require('../dictionary')

describe("Test the reader functionality", () => {
    test("Test initialization", async () => {
        await reader.init()
        const size = dictionary.db.getSize()
        expect(size.count).toBe(272946)
        expect(size.indexes).toBe(529860)
    }, 10000)
})