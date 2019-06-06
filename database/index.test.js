/* eslint-disable no-console */
const Reader = require('../reader')
const db = require('./index')
const parser = require('../parser')

// function log(item) {
//     console.log(JSON.stringify(item, null, 2))
// }

describe("Test the dictionary", () => {

    beforeAll(async () => {
        const reader = new Reader()
        await reader.init()
    }, 20000)

    test('Test addIndex', () => {
        const indexLine = new parser.IndexLine('test_christmas_tree n 5 2 @ #m 5 0 12787364 12738599 11621547 11621281 03026626  ')
        console.time('addIndex')
        db.addIndex(indexLine)
        console.timeEnd('addIndex')
        expect(db.indexLemmaIndex.test_christmas_tree.lemma).toBe('test_christmas_tree')
        expect(db.indexLemmaIndex.test_christmas_tree.offsets).toEqual([12787364, 12738599, 11621547, 11621281, 3026626])
        expect(db.indexOffsetIndex[12787364][0].offsets.join(',')).toContain('12787364')
    })

    test('Test IndexLemmaSearch', () => {
        console.time('indexLemmaSearch')
        let result = db.indexLemmaSearch('christmas_tree')
        console.timeEnd('indexLemmaSearch')
        expect(result.christmas_tree.lemma).toBe('christmas_tree')
        expect(result.christmas_tree.offsets.join(',')).toContain('12787364')

        console.time('indexLemmaSearch2')
        result = db.indexLemmaSearch(['christmas_tree', 'preposterous'])
        console.timeEnd('indexLemmaSearch2')
        expect(result.christmas_tree.lemma).toBe('christmas_tree')
        expect(result.christmas_tree.offsets.join(',')).toContain('12787364')
        expect(result.preposterous.lemma).toBe('preposterous')
        expect(result.preposterous.offsets.join(',')).toContain('2570643')
    })

    test('Test IndexOffsetSearch', () => {
        console.time('indexOffsetSearch')
        let result = db.indexOffsetSearch(12787364)
        console.timeEnd('indexOffsetSearch')
        expect(result['12787364'].map(item => item.lemma).join(',')).toContain('christmas_tree')
        expect(result['12787364'].map(item => item.offsets).join(',')).toContain('12787364')

        console.time('indexOffsetSearch2')
        result = db.indexOffsetSearch([12787364, 2570643])
        console.timeEnd('indexOffsetSearch2')
        expect(result['12787364'].map(item => item.lemma).join(',')).toContain('christmas_tree')
        expect(result['12787364'].map(item => item.offsets).join(',')).toContain('12787364')
        expect(result['2570643'].map(item => item.lemma).join(',')).toContain('preposterous')
        expect(result['2570643'].map(item => item.offsets).join(',')).toContain('2570643')

    })

    test('Test addData', () => {
        const dataLine = new parser.DataLine('90588221 31 v 08 grok 0 get_the_picture 0 comprehend 0 savvy 0 dig 0 grasp 0 compass 0 apprehend 0 015 @ 00588888 v 0000 + 00533452 a 0801 + 01745027 a 0801 + 05805475 n 0802 + 10240082 n 0802 + 05806623 n 0602 + 05806855 n 0601 + 05805475 n 0404 + 00532892 a 0301 + 00532892 a 0302 + 05805902 n 0301 ~ 00590241 v 0000 ~ 00590366 v 0000 ~ 00590761 v 0000 ~ 00590924 v 0000 03 + 08 00 + 26 00 + 02 02 | get the meaning of something; "Do you comprehend the meaning of this letter?"  ')
        console.time('addData')
        db.addData(dataLine)
        console.timeEnd('addData')
        expect(db.dataLemmaIndex.grok[0].offset).toBe(588221)
        expect(db.dataOffsetIndex['90588221'].offset).toBe(90588221)
        expect(db.dataOffsetIndex['90588221'].words.length).toBe(8)
    })

    test('Test DataLemmaSearch', () => {
        console.time('dataLemmaSearch')
        let result = db.dataLemmaSearch('christmas_tree')
        console.timeEnd('dataLemmaSearch')
        expect(result.christmas_tree.map(item => item.words).join(',')).toContain('christmas_tree')
        expect(result.christmas_tree.map(item => item.offset).join(',')).toContain('12787364')

        console.time('dataLemmaSearch2')
        result = db.dataLemmaSearch(['christmas_tree', 'preposterous'])
        console.timeEnd('dataLemmaSearch2')
        expect(result.christmas_tree.map(item => item.words).join(',')).toContain('christmas_tree')
        expect(result.christmas_tree.map(item => item.offset).join(',')).toContain('12787364')
        expect(result.preposterous.map(item => item.words).join(',')).toContain('preposterous')
        expect(result.preposterous.map(item => item.offset).join(',')).toContain('2570643')
    })

    test('Test DataOffsetSearch', () => {
        console.time('dataOffsetSearch')
        let result = db.dataOffsetSearch(12787364)
        console.timeEnd('dataOffsetSearch')
        expect(result[12787364].offset).toBe(12787364)
        expect(result[12787364].words.join(',')).toContain('christmas_tree')

        console.time('dataOffsetSearch2')
        result = db.dataOffsetSearch([12787364, 2570643])
        console.timeEnd('dataOffsetSearch2')
        expect(result[12787364].offset).toBe(12787364)
        expect(result[12787364].words.join(',')).toContain('christmas_tree')
    })

})