import Pointer from "./interface.pointer";
import Data from "./interface.data";

interface Index {
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

export default Index;
