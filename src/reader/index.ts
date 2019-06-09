import readline from 'readline'
import fs from 'fs'
import IndexLine from '../parser/index.line';
import DataLine from '../parser/data.line';

const fileTypes = ['index', 'data']
const wordTypes = ['adj', 'adv', 'noun', 'verb']


class Reader {

    db: any
    isReady: boolean
    readRemaining: number

    constructor(db: any) {
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
                        output: undefined
                    })
            
                    readerInterface.on('line', (line) => {
                        if (fileType === 'index') {
                            const item = new IndexLine().parse(line)
                            this.db.addIndex(item)
                        } else {
                            const item = new DataLine().parse(line)
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

export default Reader