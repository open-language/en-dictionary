const wordnet = require('en-wordnet')
const readline = require('readline')
const fs = require('fs')
const parser = require('../parser')
const dictionary = require('../dictionary')

const fileTypes = ['index', 'data']
const wordTypes = ['adj', 'adv', 'noun', 'verb']

const version = "3.0"
const wordnetPath = wordnet[version]

const reader = {
    isReady: false,
    readRemaining: 8,

    init: () => {
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
                            dictionary.db.addIndex(item)
                        } else {
                            const item = new parser.DataLine(line)
                            dictionary.db.addData(item)
                        }
                    })
            
                    readerInterface.on('close', () => {
                        reader.readRemaining -= 1
                        if (reader.readRemaining === 0) {
                            reader.isReady = true
                            dictionary.db.ready()
                            resolve()
                        }
                    })
            
                    // Ignoring close, pause, resume, SIGCONT, SIGINT, SIGTSTP
                })
            })    
        })
    },
}

module.exports = reader