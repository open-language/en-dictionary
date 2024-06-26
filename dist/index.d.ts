// Generated by dts-bundle-generator v9.3.1

export interface Pointer {
	symbol: string;
	offset: number;
	pos: string;
}
export interface Data {
	offset: number;
	pos: string;
	wordCount: number;
	words: string[];
	pointerCnt: number;
	pointers: Pointer[];
	glossary: string[];
	isComment: boolean;
}
export interface Index {
	lemma: string;
	pos: string;
	offsetCount: number;
	offsets: number[];
	offsetData: Data[];
	pointerCount: number;
	pointers: Pointer[];
	senseCount: number;
	tagSenseCount: number;
	isComment: boolean;
}
declare class Database {
	path: string;
	isReady: boolean;
	index: Index[];
	indexLemmaIndex: Map<string, Map<string, Index>>;
	indexOffsetIndex: Map<number, Index[]>;
	data: Data[];
	dataOffsetIndex: Map<number, Data>;
	dataLemmaIndex: Map<string, Data[]>;
	constructor(path: string);
	init(): Promise<void>;
	ready(): void;
	addIndex(index: Index): void;
	static copyIndex(indexMap: Map<string, Index>): Map<string, Index>;
	indexLemmaSearch(query: string[]): Map<string, Map<string, Index>>;
	indexOffsetSearch(query: number[]): Map<Number, Index[]>;
	addData(data: Data): void;
	static copyData(data: Data): {
		offset: number;
		pos: string;
		wordCount: number;
		words: string[];
		pointerCnt: number;
		pointers: Pointer[];
		glossary: string[];
		isComment: boolean;
	};
	dataLemmaSearch(query: string[]): Map<string, Data[]>;
	dataOffsetSearch(query: number[]): Map<number, Data>;
	getSize(): {
		count: number;
		indexes: number;
	};
}
export interface SearchSimple {
	lemma: string;
	words: string;
	meaning: string;
}
declare class Dictionary {
	path: string;
	database: Database;
	constructor(path: string);
	init(): Promise<void>;
	searchFor(term: string[]): Map<string, Map<string, Index>>;
	searchOffsetsInDataFor(offsets: number[]): Map<number, Data>;
	searchSimpleFor(words: string[]): Map<string, Map<string, SearchSimple>>;
	wordsStartingWith(prefix: string): string[];
	wordsEndingWith(suffix: string): string[];
	wordsIncluding(word: string): string[];
	wordsUsingAllCharactersFrom(query: string, ignorePhrases?: boolean): string[];
	wordsWithCharsIn(query: string, priorityCharacters?: string): Map<string, Map<string, SearchSimple>>;
	static hasAllCharsIn(word: string, test: string): boolean;
}

export {
	Dictionary as default,
};

export {};
