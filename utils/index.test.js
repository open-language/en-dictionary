const utils = require('./index')

describe('Test Utils', () => {
    test('Test getArray', () => {
        expect(utils.getArray('one')).toEqual(['one'])
        expect(utils.getArray(['one'])).toEqual(['one'])
    })
})