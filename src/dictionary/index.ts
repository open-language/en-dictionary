import Database from '../database'
import Data from '../parser/interface.data';
import Index from '../parser/interace.index';
import SearchSimple from './interface.searchSimple';

class Dictionary {
    path: string
    database: Database

    constructor(path: string) {
        this.path = path
        this.database = new Database(this.path)
    }

    async init() {
        await this.database.init()
    }

    searchFor(term: string[]) {
        let output = new Map<string, Map<string, Index>>();

        output = this.database.indexLemmaSearch(term);
        output.forEach((lemmaMap, lemma) => {
            lemmaMap.forEach((index) => {
                const lemmaData = this.searchOffsetsInDataFor(index.offsets);
                index.offsetData = [];
                lemmaData.forEach((data) => {
                    index.offsetData.push(data);
                });
                output.get(lemma)?.set(index.pos, index);
            });
        });
        return output;
    }

    searchOffsetsInDataFor(offsets: number[]) {
        return this.database.dataOffsetSearch(offsets);
    }

    searchSimpleFor(words: string[]) {
        const output = new Map<string, Map<string, SearchSimple>>();
        const result = this.searchFor(words);

        result.forEach((lemmaMap: Map<string, Index>, lemma: string) => {
            lemmaMap.forEach((index) => {
                if (index.offsetData.length > 0) {
                    let meaning = "";
                    const firstWords = index.offsetData[0].words.join(", ");
                    if (index.offsetData[0].glossary.length > 0) {
                        meaning = index.offsetData[0].glossary[0];
                    }

                    output.get(lemma)?.set(index.pos, {
                        words: firstWords,
                        meaning: meaning,
                        lemma: lemma,
                    }) ?? output.set(lemma, new Map<string, SearchSimple>([[index.pos, {
                        words: firstWords,
                        meaning: meaning,
                        lemma: lemma,
                    }]]))
                }
            });
        });

        return output
    }

    wordsStartingWith(prefix: string) {
        let output: string[] = []
        if (prefix !== '') {
            output = this.database
                .index
                .filter(item => item.lemma.startsWith(prefix))
                .map(item => item.lemma)
        }
        return output
    }

    wordsEndingWith(suffix: string) {
        let output: string[] = []
        if (suffix !== '') {
            output = this.database
                        .index
                        .filter(item => item.lemma.endsWith(suffix))
                        .map(item => item.lemma)
        }
        return output
    }

    wordsIncluding(word: string) {
        let output: string[] = []
        if (word !== '') {
            output = this.database
                .index
                .filter(item => item.lemma.includes(word))
                .map(item => item.lemma)
        }
        return output
    }

    wordsUsingAllCharactersFrom(query: string, ignorePhrases = true) {
        let output: string[] = []
        if(query === '') {
            return output
        }

        const querySplit = query.split('').sort()
        output = this.database
                .index
                .filter((item) => {
                    const lemmaSplit = item.lemma.split('').sort()

                    if (ignorePhrases && (lemmaSplit.includes('_') || lemmaSplit.includes('-') )) {
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
        return output
    }

    wordsWithCharsIn(query: string, priorityCharacters = '') {
        const matchingWords = this.database
                .index
                .filter(item => Dictionary.hasAllCharsIn(query, item.lemma))
                .map(item => item.lemma)
                .sort((a, b) => {
                    let diff = 0
                    if (priorityCharacters.length > 0) {
                        const aPriority = Dictionary.hasAllCharsIn(a, priorityCharacters) ? 10 : 0
                        const bPriority = Dictionary.hasAllCharsIn(b, priorityCharacters) ? 10 : 0
                        diff = (b.length + bPriority) - (a.length + aPriority)
                    } else {
                        diff = b.length - a.length
                    }
                    return diff
                })
                .splice(0, 10)
        return this.searchSimpleFor(matchingWords)
    }

    static hasAllCharsIn(word: string, test: string) {
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

export default Dictionary