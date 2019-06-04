const configs = require('./configs')

class IndexLine {
    constructor(line) {
        this.lemma = ''
        this.pos = ''
        this.offsetCount = 0
        this.pointerCount = 0
        this.pointers = []
        this.senseCount = 0
        this.tagSenseCount = 0
        this.offsets = []
        this.isComment = false

        if (line.charAt(0) === ' ') {
            this.isComment = true
            return this
        }

        const tokens = line.split(' ')
        this.lemma = tokens.shift()
        this.pos = configs.pos[tokens.shift()]
        this.offsetCount = parseInt(tokens.shift(), 10)
        this.pointerCount = parseInt(tokens.shift(), 10)
        this.pointers = []
        for (let index = 0; index < this.pointerCount; index += 1) {
            this.pointers.push( configs.pointerSymbols[this.pos][tokens.shift()] )
        }
        this.senseCount = parseInt(tokens.shift(), 10)
        this.tagSenseCount = parseInt(tokens.shift(), 10)
        this.offsets = []
        for (let index = 0; index < this.offsetCount; index += 1) {
            this.offsets.push( parseInt(tokens.shift(), 10) )
        }
        return this
    }
}

module.exports = IndexLine