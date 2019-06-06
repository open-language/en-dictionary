const wordnet = require('en-wordnet')
const readline = require('readline')
const fs = require('fs')
const parser = require('../parser')
const database = require('../database')

const fileTypes = ['index', 'data']
const wordTypes = ['adj', 'adv', 'noun', 'verb']

const version = "3.0"
const wordnetPath = wordnet[version]

class Reader {
    constructor() {
        this.isReady = false
        this.readRemaining = 8
    }

    init() {
        return new Promise((resolve) => {
            fileTypes.forEach((fileType) => {
                wordTypes.forEach((wordType) => {
                    const file = `${wordnetPath}/${fileType}.${wordType}`
                    const readerInterface = readline.createInterface({
                        input: fs.createReadStream(file),
                        output: false
                    })
            
                    readerInterface.on('line', (line) => {
                        if (fileType === 'index') {
                            const item = new parser.IndexLine(line)
                            database.addIndex(item)
                        } else {
                            const item = new parser.DataLine(line)
                            database.addData(item)
                        }
                    })
            
                    readerInterface.on('close', () => {
                        this.readRemaining -= 1
                        if (this.readRemaining === 0) {
                            this.isReady = true
                            database.ready()
                            resolve()
                        }
                    })
            
                    // Ignoring close, pause, resume, SIGCONT, SIGINT, SIGTSTP
                })
            })    
        })
    }
}

module.exports = Reader