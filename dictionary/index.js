const database = require('../database')

const utils = {

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

const queries = {

    searchFor: (term) => {
        let output = {}
        if (!database.isReady) {
            return new Error('Dictionary is not ready to query yet')
        }

        output = database.indexLemmaSearch(term)
        Object.keys(output).forEach((key) => {
            output[key].offsets = Object.values(database.dataOffsetSearch(output[key].offsets))
        })
        return output
    },

    searchOffsetsInDataFor: (offsets) => {
        return database.dataOffsetSearch(offsets)
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
        return database
                .index
                .filter(item => item.lemma.startsWith(prefix))
                .map(item => item.lemma)
    },

    wordsEndingWith: (suffix) => {
        return database
                .index
                .filter(item => item.lemma.endsWith(suffix))
                .map(item => item.lemma)
    },

    wordsIncluding: (word) => {
        return database
                .index
                .filter(item => item.lemma.includes(word))
                .map(item => item.lemma)
    },

    wordsUsingAllCharactersFrom: (query, ignorePhrases = true) => {
        const querySplit = query.split('').sort()
        return database
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
        const matchingWords = database
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
    db: database,
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