const utils = {
    getArray: (query) => {
        return (!Array.isArray(query)) ? [query] : query
    },

    hasAllCharsIn: (word, test) => {
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

const datastore = {
    // Readiness
    isReady: false,
    ready: () => {
        datastore.isReady = true
    },

    // Index
    index: [],
    addIndex: (index) => {
        if (index.isComment) {
            return
        }
        datastore.index.push(index)
        datastore.indexLemmaIndex[index.lemma] = index
        index.offsets.forEach((offset) => {
            if (!Array.isArray(datastore.indexOffsetIndex[offset])) {
                datastore.indexOffsetIndex[offset] = []
            }
            datastore.indexOffsetIndex[offset].push(index)
        })
    },

    indexLemmaIndex: {},
    indexLemmaSearch: (query) => {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            const item = datastore.indexLemmaIndex[lemma]
            output[item.lemma] = item
        })
        return output
    },

    indexOffsetIndex: {},
    indexOffsetSearch: (query) => {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = datastore.indexOffsetIndex[offset]
        })
        return output
    },

    // Data
    data: [],
    addData: (data) => {
        if (data.isComment) {
            return
        }
        datastore.data.push(data)
        datastore.dataOffsetIndex[data.offset] = data
        data.words.forEach((word) => {
            if (!Array.isArray(datastore.dataLemmaIndex[word])) {
                datastore.dataLemmaIndex[word] = []
            }
            datastore.dataLemmaIndex[word].push(data)
        })
    },

    dataLemmaIndex: {},
    dataLemmaSearch: (query) => {
        const output = {}
        const lemmas = utils.getArray(query)
        lemmas.forEach((lemma) => {
            output[lemma] = datastore.dataLemmaIndex[lemma]
        })
        return output
    },

    dataOffsetIndex: {},
    dataOffsetSearch: (query) => {
        const output = {}
        const offsets = utils.getArray(query)
        offsets.forEach((offset) => {
            output[offset] = datastore.dataOffsetIndex[offset]
        })
        return output
    },

    // Size
    getSize: () => {
        return {
            count: datastore.index.length + datastore.data.length,
            indexes: Object.keys(datastore.indexOffsetIndex).length + Object.keys(datastore.indexLemmaIndex).length + Object.keys(datastore.dataOffsetIndex).length + Object.keys(datastore.dataLemmaIndex).length
        }
    },

}

const queries = {

    searchFor: (term) => {
        let output = {}
        if (!datastore.isReady) {
            return new Error('Dictionary is not ready to query yet')
        }

        output = datastore.indexLemmaSearch(term)
        Object.keys(output).forEach((key) => {
            output[key].offsets = Object.values(datastore.dataOffsetSearch(output[key].offsets))
        })
        return output
    },

    searchOffsetsInDataFor: (offsets) => {
        return datastore.dataOffsetSearch(offsets)
    },

    searchSimpleFor: (words) => {
        const output = {}
        const result = queries.searchFor(words)
        Object.keys(result).forEach((lemma) => {
            output[lemma] = { 
                words: result[lemma].offsets[0].words.join(', '), 
                meaning: result[lemma].offsets[0].glossary[0],
            }
        })
        return output
    },

    wordsStartingWith: (prefix) => {
        return datastore
                .index
                .filter(item => item.lemma.startsWith(prefix))
                .map(item => item.lemma)
    },

    wordsEndingWith: (suffix) => {
        return datastore
                .index
                .filter(item => item.lemma.endsWith(suffix))
                .map(item => item.lemma)
    },

    wordsIncluding: (word) => {
        return datastore
                .index
                .filter(item => item.lemma.includes(word))
                .map(item => item.lemma)
    },

    wordsUsingAllCharactersFrom: (query, ignorePhrases = true) => {
        const querySplit = query.split('').sort()
        return datastore
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
    },

    wordsWithCharsIn: (query, priorityCharacters = '') => {
        const matchingWords = datastore
                .index
                .filter(item => utils.hasAllCharsIn(query, item.lemma))
                .map(item => item.lemma)
                .sort((a, b) => {
                    if (priorityCharacters.length > 0) {
                        const aPriority = utils.hasAllCharsIn(priorityCharacters, a) ? 10 : 0
                        const bPriority = utils.hasAllCharsIn(priorityCharacters, b) ? 10 : 0
                        return (b.length + bPriority) - (a.length + aPriority)
    
                    } 
                    return b.length - a.length
                    
                })
        return queries.searchSimpleFor(matchingWords)
    },

}

module.exports = {
    db: datastore,
    utils,
    searchFor: queries.searchFor,
    searchOffsetsInDataFor: queries.searchOffsetsInDataFor,
    searchSimpleFor: queries.searchSimpleFor,
    wordsStartingWith: queries.wordsStartingWith,
    wordsEndingWith: queries.wordsEndingWith,
    wordsIncluding: queries.wordsIncluding,
    wordsUsingAllCharactersFrom: queries.wordsUsingAllCharactersFrom,
    wordsWithCharsIn: queries.wordsWithCharsIn,
}