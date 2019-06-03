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
    init: () => {
        fileTypes.forEach((fileType) => {
            wordTypes.forEach((wordType) => {
                reader.read(fileType, wordType)
            })
        })
    },

    read: (fileType, wordType) => {
        const file = `${wordnetPath}/${fileType}.${wordType}`
        const readerInterface = readline.createInterface({
            input: fs.createReadStream(file),
            output: false
        })

        readerInterface.on('line', (line) => {
            if (fileType === 'index') {
                const item = new parser.IndexLine(line)
                dictionary.addIndex(item)
            } else {
                const item = new parser.DataLine(line)
                dictionary.addData(item)
            }
        })

        // Ignoring close, pause, resume, SIGCONT, SIGINT, SIGTSTP
    },
}

module.exports = reader