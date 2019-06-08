/* eslint-disable no-console */
const wordnet = require('en-wordnet')
const Dictionary = require('./index')

const dictionary = new Dictionary(wordnet['3.0'])

describe("Test the dictionary", () => {

    beforeAll(async () => {
        await dictionary.init()
    }, 20000)

    test('Test searchWord', () => {
        console.time('search')
        let result = dictionary.searchFor('coaxing')
        console.timeEnd('search')
        expect(result.coaxing.lemma).toBe('coaxing')
        expect(result.coaxing.pos).toBe('noun')

        expect(result.coaxing.offsets.map(item => item.words).join(',')).toContain('coaxing')
        expect(result.coaxing.offsets.map(item => item.glossary).join(',')).toContain('flattery designed to gain')

        console.time('search2')
        result = dictionary.searchFor(['yet', 'preposterous'])
        console.timeEnd('search2')
        expect(result.yet.lemma).toBe('yet')
        expect(result.yet.pos).toBe('adverb')

        expect(result.yet.offsets.map(item => item.words).join(',')).toContain('yet')
        expect(result.yet.offsets.map(item => item.glossary).join(',')).toContain('largest drug bust yet')
    })

    test('Test searchOffsetsInData', () => {
        console.time('searchOffsetsInData')
        const result = dictionary.searchOffsetsInDataFor([12787364, 2570643])
        console.timeEnd('searchOffsetsInData')
        expect(result[12787364].offset).toBe(12787364)
        expect(result[2570643].offset).toBe(2570643)
    })

    test('Test searchSimple', () => {
        console.time('searchSimple-drink,train')
        const result = dictionary.searchSimpleFor(['drink', 'train'])
        console.timeEnd('searchSimple-drink,train')
        expect(result.drink.meaning).toBe('the act of drinking alcoholic beverages to excess')
    })

    test('Test wordsStartingWith', () => {
        console.time('wordsStartingWith')
        const result = dictionary.wordsStartingWith('bring')
        console.timeEnd('wordsStartingWith')
        expect(result.length).toBe(24)
    })

    test('Test wordsEndingWith', () => {
        console.time('wordsEndingWith')
        const result = dictionary.wordsEndingWith('bring')
        console.timeEnd('wordsEndingWith')
        expect(result.length).toBe(1)
    })

    test('Test wordsIncluding', () => {
        console.time('wordsIncluding')
        const result = dictionary.wordsIncluding('bring')
        console.timeEnd('wordsIncluding')
        expect(result.length).toBe(25)
    })

    test('Test wordsUsingAllCharactersFrom', () => {
        console.time('wordsUsingAllCharactersFrom')
        const result = dictionary.wordsUsingAllCharactersFrom('bringing')
        console.timeEnd('wordsUsingAllCharactersFrom')
        expect(result.length).toBe(6)
    })

    test('Test wordsWithCharsIn', () => {
        console.time('wordsWithCharsIn')
        const result = dictionary.wordsWithCharsIn('precipitate')
        console.timeEnd('wordsWithCharsIn')
        expect(Object.keys(result).length).toBe(7)

        console.time('wordsWithCharsIn-priority')
        const result2 = dictionary.wordsWithCharsIn('precipitate', 'abc')
        console.timeEnd('wordsWithCharsIn-priority')
        expect(Object.keys(result2).length).toBe(7)
    })

    test('Test hasAllCharsIn', () => {
        expect(Dictionary.hasAllCharsIn('bringing', 'ing')).toBe(true)
        expect(Dictionary.hasAllCharsIn('bringing', 'ding')).toBe(false)
    })

    test('Test weird inputs', () => {
        expect(dictionary.searchFor(undefined)).toEqual({})
        expect(dictionary.searchFor('')).toEqual({})
        expect(dictionary.searchFor(false)).toEqual({})
        expect(dictionary.searchFor([])).toEqual({})
        expect(dictionary.searchFor({})).toEqual({})
        expect(dictionary.searchFor('mengerti')).toEqual({})
        expect(dictionary.searchFor([undefined])).toEqual({})

        expect(dictionary.searchOffsetsInDataFor(undefined)).toEqual({})
        expect(dictionary.searchOffsetsInDataFor('')).toEqual({})
        expect(dictionary.searchOffsetsInDataFor(false)).toEqual({})
        expect(dictionary.searchOffsetsInDataFor([])).toEqual({})
        expect(dictionary.searchOffsetsInDataFor({})).toEqual({})
        expect(dictionary.searchOffsetsInDataFor('mengerti')).toEqual({})
        expect(dictionary.searchOffsetsInDataFor([undefined])).toEqual({})

        expect(dictionary.searchSimpleFor(undefined)).toEqual({})
        expect(dictionary.searchSimpleFor('')).toEqual({})
        expect(dictionary.searchSimpleFor(false)).toEqual({})
        expect(dictionary.searchSimpleFor([])).toEqual({})
        expect(dictionary.searchSimpleFor({})).toEqual({})
        expect(dictionary.searchSimpleFor('mengerti')).toEqual({})
        expect(dictionary.searchSimpleFor([undefined])).toEqual({})

        expect(dictionary.wordsStartingWith(undefined)).toEqual([])
        expect(dictionary.wordsStartingWith('')).toEqual([])
        expect(dictionary.wordsStartingWith(false)).toEqual([])
        expect(dictionary.wordsStartingWith([])).toEqual([])
        expect(dictionary.wordsStartingWith({})).toEqual([])
        expect(dictionary.wordsStartingWith('mengerti')).toEqual([])
        expect(dictionary.wordsStartingWith([undefined])).toEqual([])

        expect(dictionary.wordsEndingWith(undefined)).toEqual([])
        expect(dictionary.wordsEndingWith('')).toEqual([])
        expect(dictionary.wordsEndingWith(false)).toEqual([])
        expect(dictionary.wordsEndingWith([])).toEqual([])
        expect(dictionary.wordsEndingWith({})).toEqual([])
        expect(dictionary.wordsEndingWith('mengerti')).toEqual([])
        expect(dictionary.wordsEndingWith([undefined])).toEqual([])

        expect(dictionary.wordsIncluding(undefined)).toEqual([])
        expect(dictionary.wordsIncluding('')).toEqual([])
        expect(dictionary.wordsIncluding(false)).toEqual([])
        expect(dictionary.wordsIncluding([])).toEqual([])
        expect(dictionary.wordsIncluding({})).toEqual([])
        expect(dictionary.wordsIncluding('mengerti')).toEqual([])
        expect(dictionary.wordsIncluding([undefined])).toEqual([])

        expect(dictionary.wordsUsingAllCharactersFrom(undefined)).toEqual([])
        expect(dictionary.wordsUsingAllCharactersFrom('')).toEqual([])
        expect(dictionary.wordsUsingAllCharactersFrom(false)).toEqual([])
        expect(dictionary.wordsUsingAllCharactersFrom([])).toEqual([])
        expect(dictionary.wordsUsingAllCharactersFrom({})).toEqual([])
        expect(dictionary.wordsUsingAllCharactersFrom([undefined])).toEqual([])

        expect(dictionary.wordsWithCharsIn(undefined)).toEqual({})
        expect(dictionary.wordsWithCharsIn('')).toEqual({})
        expect(dictionary.wordsWithCharsIn(false)).toEqual({})
        expect(dictionary.wordsWithCharsIn([])).toEqual({})
        expect(dictionary.wordsWithCharsIn({})).toEqual({})
        expect(dictionary.wordsWithCharsIn([undefined])).toEqual({})

    })

})