const Database = require('../database')

class Dictionary {
    constructor(path) {
        this.database = null
        this.path = path
    }

    async init() {
        this.database = new Database(this.path)
        await this.database.init()
    }

    searchFor(term) {
        let output = {}
        if (!this.database.isReady) {
            return new Error('Dictionary is not ready to query yet')
        }

        output = this.database.indexLemmaSearch(term)
        Object.keys(output).forEach((key) => {
            output[key].offsets = Object.values(this.database.dataOffsetSearch(output[key].offsets))
        })
        return output
    }

    searchOffsetsInDataFor(offsets) {
        return this.database.dataOffsetSearch(offsets)
    }

    searchSimpleFor(words) {
        const output = {}
        const result = this.searchFor(words)
        Object.keys(result).forEach((lemma) => {
            output[lemma] = { 
                words: result[lemma].offsets[0].words.join(', '), 
                meaning: result[lemma].offsets[0].glossary[0],
            }
        })
        return output
    }

    wordsStartingWith(prefix) {
        return this.database
                .index
                .filter(item => item.lemma.startsWith(prefix))
                .map(item => item.lemma)
    }

    wordsEndingWith(suffix) {
        return this.database
                .index
                .filter(item => item.lemma.endsWith(suffix))
                .map(item => item.lemma)
    }

    wordsIncluding(word) {
        return this.database
                .index
                .filter(item => item.lemma.includes(word))
                .map(item => item.lemma)
    }

    wordsUsingAllCharactersFrom(query, ignorePhrases = true) {
        const querySplit = query.split('').sort()
        return this.database
                .index
                .filter((item) => {
                    const lemmaSplit = item.lemma.split('').sort()

                    if (ignorePhrases && lemmaSplit.includes('_')) {
                        return false
                    }

                    for (let i = 0; i < querySplit.length; i += 1) {
                        const found = lemmaSplit.indexOf(querySplit[i])
                        if (found < 0) {
                            return false
                        }
                        lemmaSplit.splice(found, 1)
                    }
                    return true
                })
                .map(item => item.lemma)
    }

    wordsWithCharsIn(query, priorityCharacters = '') {
        const matchingWords = this.database
                .index
                .filter(item => Dictionary.hasAllCharsIn(query, item.lemma))
                .map(item => item.lemma)
                .sort((a, b) => {
                    let diff = 0
                    if (priorityCharacters.length > 0) {
                        const aPriority = Dictionary.hasAllCharsIn(a, priorityCharacters) ? 10 : 0
                        const bPriority = Dictionary.hasAllCharsIn(b, priorityCharacters) ? 10 : 0
                        diff = (b.length + bPriority) - (a.length + aPriority)
                    } else {
                        diff = b.length - a.length
                    }
                    return diff
                })
                .splice(0, 10)
        return this.searchSimpleFor(matchingWords)
    }

    static hasAllCharsIn(word, test) {
        const wordSplit = word.split('').sort()
        const testSplit = test.split('').sort()
        
        if (testSplit.length > wordSplit.length) {
            return false
        }

        for (let i = 0; i < testSplit.length; i += 1) {
            const foundChar = wordSplit.indexOf(testSplit[i])
            if (foundChar < 0) {
                return false
            }

            wordSplit.splice(foundChar, 1)
        }
        return true
    }

}

module.exports = Dictionary