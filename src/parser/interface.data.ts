import Pointer from "./interface.pointer";

interface Data {
  offset: number;
  pos: string;
  wordCount: number;
  words: string[];
  pointerCnt: number;
  pointers: Pointer[];
  glossary: string[];
  isComment: boolean;
}

export default Data;
