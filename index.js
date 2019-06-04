const reader = require('./reader')
const dictionary = require('./dictionary')

const enDictionary = {
    init: async () => {
        await reader.init()
        return dictionary
    },

}

module.exports = enDictionary