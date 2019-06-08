const reiterator = require('reiterator')
const utils = require('../utils')
const Reader = require('../reader')

const obj = reiterator.objects

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

    static copyIndex(index) {
        return {
            lemma: index.lemma,
            pos: index.pos,
            offsetCount: index.offsetCount,
            pointerCount: index.pointerCount,
            pointers: [...index.pointers],
            senseCount: index.senseCount,
            tagSenseCount: index.tagSenseCount,
            offsets: [...index.offsets],
            isComment: index.isComment
        }
    }

    indexLemmaSearch(query) {
        const output = {}
        utils.getArray(query).forEach((lemma) => {
            if (lemma && this.indexLemmaIndex[lemma]) {
                output[this.indexLemmaIndex[lemma].lemma] = Database.copyIndex(this.indexLemmaIndex[lemma])
            }
        })
        return output
    }

    indexOffsetSearch(query) {
        const output = {}
        utils.getArray(query).forEach((offset) => {
            if (offset && this.indexOffsetIndex[offset] && obj.isArray(this.indexOffsetIndex[offset])) {
                output[offset] = []
                this.indexOffsetIndex[offset].forEach((item) => {
                    if (item) {
                        output[offset].push(Database.copyIndex(item))
                    }
                })    
            }
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

    static copyData(data) {
        return {
            offset: data.offset,
            pos: data.pos,
            wordCount: data.wordCount,
            words: [...data.words],
            pointerCnt: data.pointerCnt,
            pointers: [...data.pointers],
            glossary: [...data.glossary],
            isComment: data.isComment
        }
    }

    dataLemmaSearch(query) {
        const output = {}
        utils.getArray(query).forEach((lemma) => {
            if (lemma && this.dataLemmaIndex[lemma] && obj.isArray(this.dataLemmaIndex[lemma])) {
                output[lemma] = []
                this.dataLemmaIndex[lemma].forEach((item) => {
                    if (item) {
                        output[lemma].push(Database.copyData(item))
                    }
                })    
            }
        })
        return output
    }

    dataOffsetSearch(query) {
        const output = {}
        utils.getArray(query).forEach((offset) => {
            if (offset && this.dataOffsetIndex[offset]) {
                output[offset] = Database.copyData(this.dataOffsetIndex[offset])
            }
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