const reader = require('../reader')
const dictionary = require('./index')

describe("Test the dictionary", () => {

    beforeAll(async () => {
        await reader.init()
    }, 20000)

    test('Test Filter', () => {
        let result = dictionary.filter('index', (item) => {
            return !item.isComment && (item.lemma === 'preposterous')
        })
        expect(result.preposterous.lemma).toBe('preposterous')

        result = dictionary.filter('data', (item) => {
            return !item.isComment && (item.offset === 514618)
        })
        expect(result[514618].offset).toBe(514618)
    })

    test('Test IndexSearch', () => {
        let result = dictionary.indexSearch('preposterous')
        expect(result.preposterous.lemma).toBe('preposterous')

        result = dictionary.indexSearch(2570643, 'synset')
        expect(result.preposterous.lemma).toBe('preposterous')
    })

    test('Test DataSearch', () => {
        const result = dictionary.dataSearch([2570643, 129612])
        expect(result[2570643].offset).toBe(2570643)
        expect(result[129612].offset).toBe(129612)
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

        // result = dictionary.querySynsets([2570643])
        // expect(result.word).toBe('absurd')
        // expect(result.synsets[2570643].words).toEqual([
        //     "absurd",
        //     "cockeyed",
        //     "derisory",
        //     "idiotic",
        //     "laughable",
        //     "ludicrous",
        //     "nonsensical",
        //     "preposterous",
        //     "ridiculous"
        // ])
        
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

    test('Time Audits', () => {
        let terms = ['preposterous', 'progressive', 'positive']
        for(let i = 0; i < terms.length; i += 1) {
            console.time(`dictionary.query(${terms[i]})`)
            dictionary.query(terms[i])
            console.timeEnd(`dictionary.query(${terms[i]})`)
        }

        terms = [1817500, 337172, 65064]
        for (let i = 0; i < terms.length; i += 1) {
            console.time(`dictionary.query(${terms[i]}, synset)`)
            dictionary.querySynsets(terms[i])
            console.timeEnd(`dictionary.query(${terms[i]}, synset)`)
        }

        // terms = [1817500, 337172, 65064]
        // for (let i = 0; i < terms.length; i += 1) {
        //     console.time(`dictionary.query(${terms[i]}, synset, false)`)
        //     dictionary.query(terms[i], 'synset', false)
        //     console.timeEnd(`dictionary.query(${terms[i]}, synset, false)`)
        // }
    })

})

