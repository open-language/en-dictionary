const readline = require('readline')
const fs = require('fs')
const parser = require('../parser')

const fileTypes = ['index', 'data']
const wordTypes = ['adj', 'adv', 'noun', 'verb']


class Reader {
    constructor(db) {
        this.db = db
        this.isReady = false
        this.readRemaining = 8
    }

    init() {
        return new Promise((resolve, reject) => {
            fileTypes.forEach((fileType) => {
                wordTypes.forEach((wordType) => {
                    const file = `${this.db.path}/${fileType}.${wordType}`
                    const readerInterface = readline.createInterface({
                        input: fs.createReadStream(file),
                        output: false
                    })
            
                    readerInterface.on('line', (line) => {
                        if (fileType === 'index') {
                            const item = new parser.IndexLine(line)
                            this.db.addIndex(item)
                        } else {
                            const item = new parser.DataLine(line)
                            this.db.addData(item)
                        }
                    })
            
                    readerInterface.on('close', () => {
                        this.readRemaining -= 1
                        if (this.readRemaining === 0) {
                            this.isReady = true
                            this.db.ready()
                            resolve()
                        }
                    })

                    readerInterface.on('error', () => {
                        reject()
                    })
            
                    // Ignoring close, pause, resume, SIGCONT, SIGINT, SIGTSTP
                })
            })    
        })
    }

}

module.exports = Reader