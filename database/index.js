const utils = require('../utils')
const Reader = require('../reader')

class Database {

    constructor(path) {
        this.isReady = false
        this.index = []
        this.indexLemmaIndex = {}
        this.indexOffsetIndex = {}
        this.data = []
        this.dataLemmaIndex = {}
        this.dataOffsetIndex = {}
        this.path = path
    }

    async init() {
        const reader = new Reader(this)
        await reader.init()
    }

    ready() {
        this.isReady = true
    }

    addIndex(index) {
        if (index.isComment) {
            return
        }
        this.index.push(index)
        this.indexLemmaIndex[index.lemma] = index
        index.offsets.forEach((offset) => {
            if (!Array.isArray(this.indexOffsetIndex[offset])) {
                this.indexOffsetIndex[offset] = []
            }
            this.indexOffsetIndex[offset].push(index)
        })
    }

    indexLemmaSearch(query) {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            const item = this.indexLemmaIndex[lemma]
            output[item.lemma] = Object.create(item)
        })
        return output
    }

    indexOffsetSearch(query) {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = Object.create(this.indexOffsetIndex[offset])
        })
        return output
    }

    addData(data) {
        if (data.isComment) {
            return
        }
        this.data.push(data)
        this.dataOffsetIndex[data.offset] = data
        data.words.forEach((word) => {
            if (!Array.isArray(this.dataLemmaIndex[word])) {
                this.dataLemmaIndex[word] = []
            }
            this.dataLemmaIndex[word].push(data)
        })    
    }

    dataLemmaSearch(query) {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            output[lemma] = Object.create(this.dataLemmaIndex[lemma])
        })
        return output
    }

    dataOffsetSearch(query) {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = Object.create(this.dataOffsetIndex[offset])
        })
        return output
    }

    getSize() {
        return {
            count: this.index.length + this.data.length,
            indexes: Object.keys(this.indexOffsetIndex).length + Object.keys(this.indexLemmaIndex).length + Object.keys(this.dataOffsetIndex).length + Object.keys(this.dataLemmaIndex).length
        }
    }

}

module.exports = Database