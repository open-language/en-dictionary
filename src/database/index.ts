import Reader from '../reader'
import Index from '../parser/interace.index';
import Data from '../parser/interface.data';

class Database {

    path: string
    isReady: boolean

    index: Index[]
    indexLemmaIndex: Map<string, Index>
    indexOffsetIndex: Map<number, Index[]>

    data: Data[]
    dataOffsetIndex: Map<number, Data>
    dataLemmaIndex: Map<string, Data[]>

    constructor(path: string) {
        this.isReady = false
        this.index = []
        this.indexLemmaIndex = new Map()
        this.indexOffsetIndex = new Map()
        this.data = []
        this.dataLemmaIndex = new Map()
        this.dataOffsetIndex = new Map()
        this.path = path
    }

    async init() {
        const reader = new Reader(this)
        await reader.init()
    }

    ready() {
        this.isReady = true
    }

    addIndex(index: Index) {
        if (index.isComment) {
            return
        }
        this.index.push(index)
        this.indexLemmaIndex.set(index.lemma, index)

        index.offsets.forEach((offset) => {
            let output: Index[] = []
            if (this.indexOffsetIndex.get(offset) !== undefined) {
                output = this.indexOffsetIndex.get(offset)!
            }
            output.push(index)
            this.indexOffsetIndex.set(offset, output)
        })
    }

    static copyIndex(index: Index) {
        const output: Index = {
            lemma: index.lemma,
            pos: index.pos,
            offsetCount: index.offsetCount,
            pointerCount: index.pointerCount,
            pointers: [...index.pointers],
            senseCount: index.senseCount,
            tagSenseCount: index.tagSenseCount,
            offsets: [...index.offsets],
            isComment: index.isComment,
            offsetData: [...index.offsetData]
        }
        return output
    }

    indexLemmaSearch(query: string[]) {
        const output = new Map<string, Index>()
        query.forEach((lemma) => {
            if ((lemma !== '') && (this.indexLemmaIndex.get(lemma) !== undefined)) {
                output.set(lemma, Database.copyIndex(this.indexLemmaIndex.get(lemma)!))
            }
        })
        return output
    }

    indexOffsetSearch(query: number[]) {
        const output = new Map<Number, Index[]>()
        query.forEach((offset) => {
            if (offset && this.indexOffsetIndex.get(offset)) {
                const items: Index[] = []
                this.indexOffsetIndex.get(offset)!.forEach((item) => {
                    items.push(Database.copyIndex(item))
                })
                output.set(offset, items)
            }
        })
        return output
    }

    addData(data: Data) {
        if (data.isComment) {
            return
        }
        this.data.push(data)
        this.dataOffsetIndex.set(data.offset, data)
        data.words.forEach((word) => {
            let output: Data[] = [] 
            if (this.dataLemmaIndex.get(word)) {
                output = this.dataLemmaIndex.get(word)!
            }
            output.push(data)
            this.dataLemmaIndex.set(word, output)
        })    
    }

    static copyData(data: Data) {
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

    dataLemmaSearch(query: string[]) {
        const output = new Map<string, Data[]>()
        query.forEach((lemma) => {
            const items: Data[] = []
            if ((lemma !== '') && this.dataLemmaIndex.get(lemma)) {
                this.dataLemmaIndex.get(lemma)!.forEach((item) => {
                    items.push(Database.copyData(item))
                })
            }
            output.set(lemma, items)
        })
        return output
    }

    dataOffsetSearch(query: number[]) {
        const output = new Map<number, Data>()
        query.forEach((offset) => {
            if (offset && this.dataOffsetIndex.get(offset)) {
                output.set(offset, Database.copyData(this.dataOffsetIndex.get(offset)!))
            }
        })
        return output
    }

    getSize() {
        return {
            count: this.index.length + this.data.length,
            indexes: this.indexOffsetIndex.size
                + this.indexLemmaIndex.size
                + this.dataOffsetIndex.size
                + this.dataLemmaIndex.size
        }
    }

}

export default Database