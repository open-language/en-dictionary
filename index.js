const Reader = require('./reader')
const dictionary = require('./dictionary')

const enDictionary = {
    init: async () => {
        const reader = new Reader()
        await reader.init()
        return dictionary
    },
}

module.exports = enDictionary