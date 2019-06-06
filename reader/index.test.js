const Reader = require('./index')
const database = require('../database')

describe("Test the reader functionality", () => {
    test("Test initialization", async () => {
        const reader = new Reader()
        await reader.init()
        const size = database.getSize()
        expect(size.count).toBe(272946)
        expect(size.indexes).toBe(529860)
    }, 10000)
})