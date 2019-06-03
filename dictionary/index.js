const datastore = {
    index: [],
    data: []
}

const dictionary = {
    isReady: false,

    addIndex: (index) => {
        datastore.index.push(index)
        return dictionary.getDatastoreSize()
    },

    addData: (data) => {
        datastore.data.push(data)
        return dictionary.getDatastoreSize()
    },

    getDatastoreSize: () => {
        return datastore.index.length + datastore.data.length
    },

    readComplete: () => {
        dictionary.isReady = true
    },

    query: (search) => {
        if (!dictionary.isReady) {
            return new Error('Dictionary is not ready to query yet')
        }

        const output = {}

        // Get results from index
        const indexResult = dictionary.indexSearch(search)
        output.word = indexResult[search].lemma
        output.pos = indexResult[search].pos
        output.synsetOffsets = indexResult[search].synsetOffsets
        output.synsets = {}

        // Get results from data
        const linkedSynsets = []
        const dataResults = dictionary.dataSearch(indexResult[search].synsetOffsets)
        indexResult[search].synsetOffsets.forEach((synset) => {
            const item = dataResults[synset]
            const op = {}
            op.offset = item.synsetOffset
            op.pos = item.pos
            op.words = []
            item.words.forEach(word => op.words.push(word.word))
            op.glossary = item.glossary
            op.linked = {}
            item.pointers.forEach(i => {
                linkedSynsets.push(i.synsetOffset)
                op.linked[i.synsetOffset] = { why: i.pointerSymbol, offset: i.synsetOffset }
            })
            output.synsets[synset] = op
        })

        // Get results from linked words
        const linkedResults = dictionary.dataSearch(linkedSynsets)
        Object.keys(output.synsets).forEach((synset) => {
            Object.keys(output.synsets[synset].linked).forEach((linked) => {
                const linkedData = linkedResults[linked]
                output.synsets[synset].linked[linked].pos = linkedData.pos
                output.synsets[synset].linked[linked].words = []
                linkedData.words.forEach((w) => {
                    output.synsets[synset].linked[linked].words.push(w.word)
                })
                output.synsets[synset].linked[linked].glossary = linkedData.glossary
            })
        })
        return output
    },

    startsWith: (query) => {
        const output = []
        const filtered = dictionary.filter('index', (item) => {
            return !item.isComment && (item.lemma.startsWith(query))
        })
        Object.keys(filtered).forEach((item) => {
            output.push(filtered[item].lemma)
        })
        return output
    },

    indexSearch: (query) => {
        const filtered = dictionary.filter('index', (item) => {
            return !item.isComment && (item.lemma === query)
        })
        if (Object.keys(filtered).length > 0) {
            return filtered
        }
        return new Error('Word not found in index')
    },

    dataSearch: (query) => {
        const filtered = dictionary.filter('data', (item) => {
            return !item.isComment && (query.includes(item.synsetOffset))
        })
        if (Object.keys(filtered).length > 0) {
            return filtered
        }
        return new Error('Word not found in data')
    },

    filter: (fileType, filterFunc) => {
        const results = {}
        if (fileType === 'index') {
            datastore.index.filter(filterFunc).forEach((set) => {
                results[set.lemma] = set
            })
        } else {
            datastore.data.filter(filterFunc).forEach((set) => {
                results[set.synsetOffset] = set
            })
        }
        return results
    }
    
}

module.exports = dictionary