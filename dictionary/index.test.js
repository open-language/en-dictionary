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
        expect(result.preposterous.lemma).toBe('preposterous')

        result = dictionary.filter('data', (item) => {
            return !item.isComment && (item.synsetOffset === 514618)
        })
        expect(result[514618].synsetOffset).toBe(514618)
    })

    test('Test IndexSearch', () => {
        const result = dictionary.indexSearch('preposterous')
        expect(result.preposterous.lemma).toBe('preposterous')
    })

    test('Test DataSearch', () => {
        const result = dictionary.dataSearch([2570643, 129612])
        expect(result[2570643].synsetOffset).toBe(2570643)
        expect(result[129612].synsetOffset).toBe(129612)
    })

    test('Test Query dictionary', () => {
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

    test('Test Starts with', () => {
        expect(dictionary.startsWith('prestig')).toEqual(['prestigious', 'prestige', 'prestigiousness'])
    })

    test('Test Ends with', () => {
        expect(dictionary.endsWith('sterous')).toEqual(['blusterous', 'boisterous', 'preposterous'])
    })

    test('Test Includes', () => {
        expect(dictionary.includes('grating')).toEqual(['gratingly', 'denigrating', 'grating', 'diffraction_grating', 'integrating'])
    })

    test('Test With Each Char In', () => {
        expect(dictionary.withEachCharIn('sudhanshuraheja')).toEqual(['church_of_jesus_christ_of_latter-day_saints'])
    })

    test('Test With Chars In', () => {
        expect(dictionary.withCharsIn('yearns', 5).length).toBe(5)
    })

})

