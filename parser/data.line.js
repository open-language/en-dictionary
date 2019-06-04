const configs = require('./configs')

class DataLine {
    constructor(line) {
        this.offset = 0
        this.lexFilenum = ''
        this.pos = ''
        this.wordCount = 0
        this.words = [] // { word, lexId }
        this.pointerCnt = 0
        this.pointers = []
        this.frames = []
        this.glossary = []
        this.isComment = false

        this.line = line

        if (this.line.charAt(0) === ' ') {
            this.isComment = true
            return this
        }

        const glossarySplit = line.split('|')
        glossarySplit[1].split(';').forEach((part) => {
            this.glossary.push(part.trim())
        })

        const meta = glossarySplit[0].split(' ')
        this.offset = parseInt(meta.shift(), 10)
        this.lexFilenum = parseInt(meta.shift(), 10)
        this.pos = configs.pos[meta.shift()]
        this.wordCount = parseInt(meta.shift(), 16)
        for (let index = 0; index < this.wordCount; index += 1) {
            const block = {}
            block.word = meta.shift()
            block.lexId = parseInt(meta.shift(), 16)
            this.words.push(block)
        }

        this.pointerCnt = parseInt(meta.shift(), 10)
        for (let index = 0; index < this.pointerCnt; index += 1) {
            const block = {}
            block.pointerSymbol = meta.shift()
            block.offset = parseInt(meta.shift(), 10)
            block.pos = configs.pos[meta.shift()]
            block.pointerSymbol = configs.pointerSymbols[block.pos][block.pointerSymbol]
            block.sourceTargetHex = meta.shift()
            this.pointers.push(block)
        }

        this.frames = []

        return this
    }
}

module.exports = DataLine