const configs = require('./configs')

class IndexLine {
    constructor(line) {
        this.lemma = ''
        this.pos = ''
        this.synsetCount = 0
        this.pointerCount = 0
        this.pointers = []
        this.senseCount = 0
        this.tagSenseCount = 0
        this.synsetOffsets = []
        this.isComment = false
        this.line = line

        if (this.line.charAt(0) === ' ') {
            return this
        }

        const tokens = this.line.split(' ')
        this.lemma = tokens.shift()
        this.pos = configs.pos[tokens.shift()]
        this.synsetCount = parseInt(tokens.shift(), 10)
        this.pointerCount = parseInt(tokens.shift(), 10)
        this.pointers = []
        for (let index = 0; index < this.pointerCount; index += 1) {
            this.pointers.push( configs.pointerSymbols[this.pos][tokens.shift()] )
        }
        this.senseCount = parseInt(tokens.shift(), 10)
        this.tagSenseCount = parseInt(tokens.shift(), 10)
        this.synsetOffsets = []
        for (let index = 0; index < this.synsetCount; index += 1) {
            this.synsetOffsets.push( tokens.shift() )
        }
        return this
    }
}

module.exports = IndexLine