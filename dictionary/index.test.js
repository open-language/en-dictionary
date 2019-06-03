const reader = require('../reader')
const dictionary = require('./index')

describe("Test the dictionary", () => {

    beforeAll(async (done) => {
        reader.init()
        const retrier = () => {
            setTimeout(() => {
                if(reader.isReady) {
                    done()
                } else {
                    retrier()
                }
            }, 100)
        }
        retrier()
    })

    test('Test Filter', () => {
        let result = dictionary.filter('index', (item) => {
            return !item.isComment && (item.lemma === 'preposterous')
        })
        expect(result.lemma).toBe('preposterous')

        result = dictionary.filter('data', (item) => {
            return !item.isComment && (item.synsetOffset === 514618)
        })
        expect(result[514618].synsetOffset).toBe(514618)
    })

    test('Test IndexSearch', () => {
        const result = dictionary.indexSearch('preposterous')
        expect(result.lemma).toBe('preposterous')
    })

    test('Test DataSearch', () => {
        const result = dictionary.dataSearch([2570643, 129612])
        expect(result[2570643].synsetOffset).toBe(2570643)
        expect(result[129612].synsetOffset).toBe(129612)
    })

    test('Query dictionary', () => {
        const result = dictionary.query('preposterous')
        expect(result.word).toBe('preposterous')
        expect(result.synsets[2570643].words).toEqual([
            "absurd",
            "cockeyed",
            "derisory",
            "idiotic",
            "laughable",
            "ludicrous",
            "nonsensical",
            "preposterous",
            "ridiculous"
        ])
    })
})

