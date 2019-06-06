const utils = require('../utils')

const database = {
    // Readiness
    isReady: false,
    ready: () => {
        database.isReady = true
    },

    // Index
    index: [],
    addIndex: (index) => {
        if (index.isComment) {
            return
        }
        database.index.push(index)
        database.indexLemmaIndex[index.lemma] = index
        index.offsets.forEach((offset) => {
            if (!Array.isArray(database.indexOffsetIndex[offset])) {
                database.indexOffsetIndex[offset] = []
            }
            database.indexOffsetIndex[offset].push(index)
        })
    },

    indexLemmaIndex: {},
    indexLemmaSearch: (query) => {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            const item = database.indexLemmaIndex[lemma]
            output[item.lemma] = item
        })
        return output
    },

    indexOffsetIndex: {},
    indexOffsetSearch: (query) => {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = database.indexOffsetIndex[offset]
        })
        return output
    },

    // Data
    data: [],
    addData: (data) => {
        if (data.isComment) {
            return
        }
        database.data.push(data)
        database.dataOffsetIndex[data.offset] = data
        data.words.forEach((word) => {
            if (!Array.isArray(database.dataLemmaIndex[word])) {
                database.dataLemmaIndex[word] = []
            }
            database.dataLemmaIndex[word].push(data)
        })
    },

    dataLemmaIndex: {},
    dataLemmaSearch: (query) => {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            output[lemma] = database.dataLemmaIndex[lemma]
        })
        return output
    },

    dataOffsetIndex: {},
    dataOffsetSearch: (query) => {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = database.dataOffsetIndex[offset]
        })
        return output
    },

    // Size
    getSize: () => {
        return {
            count: database.index.length + database.data.length,
            indexes: Object.keys(database.indexOffsetIndex).length + Object.keys(database.indexLemmaIndex).length + Object.keys(database.dataOffsetIndex).length + Object.keys(database.dataLemmaIndex).length
        }
    },
}

module.exports = database