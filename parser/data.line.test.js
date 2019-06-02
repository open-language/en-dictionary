const DataLine = require('./data.line')

describe("Test parsing a data line", () => {
    test("Parse a data line", () => {
        let item = new DataLine("  20 ABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE OR THAT THE USE  ")
        expect(item.isComment).toBe(true)

        item = new DataLine('00002684 03 n 02 object 0 physical_object 0 039 @ 00001930 n 0000 + 00532607 v 0105 ~ 00003553 n 0000 ~ 00027167 n 0000 ~ 03009633 n 0000 ~ 03149951 n 0000 ~ 03233423 n 0000 ~ 03338648 n 0000 ~ 03532080 n 0000 ~ 03595179 n 0000 ~ 03610270 n 0000 ~ 03714721 n 0000 ~ 03892891 n 0000 ~ 04012260 n 0000 ~ 04248010 n 0000 ~ 04345288 n 0000 ~ 04486445 n 0000 ~ 07851054 n 0000 ~ 09238143 n 0000 ~ 09251689 n 0000 ~ 09267490 n 0000 ~ 09279458 n 0000 ~ 09281777 n 0000 ~ 09283193 n 0000 ~ 09287968 n 0000 ~ 09295338 n 0000 ~ 09300905 n 0000 ~ 09302031 n 0000 ~ 09308398 n 0000 ~ 09334396 n 0000 ~ 09335240 n 0000 ~ 09358550 n 0000 ~ 09368224 n 0000 ~ 09407346 n 0000 ~ 09409203 n 0000 ~ 09432990 n 0000 ~ 09468237 n 0000 ~ 09474162 n 0000 ~ 09477037 n 0000 | a tangible and visible entity; an entity that can cast a shadow; "it was full of rackets, balls and other objects"')
        expect(item.synsetOffset).toBe('00002684')
        expect(item.lexFilenum).toBe(3)
        expect(item.ssType).toBe('noun')
        expect(item.wordCount).toBe(2)
        expect(item.words).toEqual([{ word: 'object', lexId: 0}, { word: 'physical_object', lexId: 0 }])
        expect(item.pointerCnt).toBe(39)
        expect(item.pointers[38]).toEqual({ pointerSymbol: 'Hyponym', pos: 'noun', sourceTargetHex: '0000', synsetOffset:'09477037' })
        expect(item.frames).toEqual([])
        expect(item.glossary).toEqual(['a tangible and visible entity', 'an entity that can cast a shadow', '"it was full of rackets, balls and other objects"'])
    })
})

