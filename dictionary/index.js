const utils = {
    getArray: (query) => {
        return (!Array.isArray(query)) ? [query] : query
    },
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

    searchWord: (term) => {
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

    searchOffsetsInData: (offsets) => {
        return datastore.dataOffsetSearch(offsets)
    }

    // querySynsets: (search) => {
    //     if (!datastore.isReady) {
    //         return new Error('Dictionary is not ready to query yet')
    //     }

    //     const output = {}
    //     const dataSynsetQuery = []
    //     // Get results from index
    //     const indexResult = datastore.indexOffsetSearch(search, 'synset')
    //     Object.keys(indexResult).forEach((item) => {
    //         output[indexResult[item].lemma] = {
    //             word: indexResult[item].lemma,
    //             pos: indexResult[item].pos,
    //             offsets: indexResult[item].offsets
    //         }
    //         dataSynsetQuery.push(...indexResult[item].offsets)
    //     })

    //     // Get results from data
    //     // const linkedSynsets = []
    //     // const dataResults = dictionary.dataSearch(dataSynsetQuery)
    //     // indexResult[firstResult].offsets.forEach((synset) => {
    //     //     const item = dataResults[synset]
    //     //     const op = {}
    //     //     op.offset = item.offset
    //     //     op.pos = item.pos
    //     //     op.words = []
    //     //     item.words.forEach(word => op.words.push(word.word))
    //     //     op.glossary = item.glossary
    //     //     op.linked = {}
    //     //     item.pointers.forEach(i => {
    //     //         linkedSynsets.push(i.offset)
    //     //         op.linked[i.offset] = { why: i.pointerSymbol, offset: i.offset }
    //     //     })
    //     //     output.synsets[synset] = op
    //     // })

    //     return output
    // },

    // startsWith: (query) => {
    //     const output = []
    //     const filtered = dictionary.filter('index', (item) => {
    //         return !item.isComment && (item.lemma.startsWith(query))
    //     })
    //     Object.keys(filtered).forEach((item) => {
    //         output.push(filtered[item].lemma)
    //     })
    //     return output
    // },

    // endsWith: (query) => {
    //     const output = []
    //     const filtered = dictionary.filter('index', (item) => {
    //         return !item.isComment && (item.lemma.endsWith(query))
    //     })
    //     Object.keys(filtered).forEach((item) => {
    //         output.push(filtered[item].lemma)
    //     })
    //     return output
    // },

    // includes: (query) => {
    //     const output = []
    //     const filtered = dictionary.filter('index', (item) => {
    //         return !item.isComment && (item.lemma.includes(query))
    //     })
    //     Object.keys(filtered).forEach((item) => {
    //         output.push(filtered[item].lemma)
    //     })
    //     return output
    // },

    // withEachCharIn: (query) => {
    //     const output = []
    //     const filtered = dictionary.filter('index', (item) => {
    //         if (item.isComment) {
    //             return false
    //         }

    //         const lemmaSplit = item.lemma.split('').sort()
    //         const querySplit = query.split('').sort()

    //         for (let i = 0; i < querySplit.length; i += 1) {
    //             const char = querySplit[i]
    //             const found = lemmaSplit.indexOf(char)
    //             if (found < 0) {
    //                 return false
    //             }

    //             lemmaSplit.splice(found, 1)
    //         }
    //         return true
    //     })
    //     Object.keys(filtered).forEach((item) => {
    //         output.push(filtered[item].lemma)
    //     })
    //     return output
    // },

    // withCharsIn: (query, minLength = 0) => {
    //     const output = []
    //     const filtered = dictionary.filter('index', (item) => {
    //         if (item.isComment) {
    //             return false
    //         }

    //         const lemmaSplit = item.lemma.split('').sort()
    //         const querySplit = query.split('').sort()

    //         if (lemmaSplit.length < minLength) {
    //             return false
    //         }

    //         if (lemmaSplit.length > querySplit.length) {
    //             return false
    //         }

    //         for (let i = 0; i < lemmaSplit.length; i += 1) {
    //             const char = lemmaSplit[i]
    //             const foundQuery = querySplit.indexOf(char)
    //             if (foundQuery < 0) {
    //                 return false
    //             }

    //             querySplit.splice(foundQuery, 1)
    //         }
    //         return true
    //     })
    //     Object.keys(filtered).forEach((item) => {
    //         output.push(filtered[item].lemma)
    //     })
    //     return output.sort((a, b) => {
    //         return b.length - a.length
    //     })
    // },

    // filter: (fileType, filterFunc) => {
    //     const results = {}
    //     if (fileType === 'index') {
    //         datastore.index.filter(filterFunc).forEach((set) => {
    //             results[set.lemma] = set
    //         })
    //     } else {
    //         datastore.data.filter(filterFunc).forEach((set) => {
    //             results[set.offset] = set
    //         })
    //     }
    //     return results
    // }
    
}

module.exports = {
    db: datastore,
    searchWord: queries.searchWord,
    searchOffsetsInData: queries.searchOffsetsInData
}